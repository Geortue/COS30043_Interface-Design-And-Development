<?php
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : null;
$input = json_decode(file_get_contents('php://input'), true);

$conn = mysqli_connect('feenix-mariadb.swin.edu.au', 's103488418', '111103', 's103488418_db');
mysqli_set_charset($conn, 'utf8');

$table = "unit_progress";

$key = isset($_GET['id']) ? intval($_GET['id']) : null;

$columns = array();
$values = array();

if ($input && is_array($input)) {
  foreach ($input as $k => $v) {
    $columns[] = "`" . mysqli_real_escape_string($conn, $k) . "`";
    $values[] = "'" . mysqli_real_escape_string($conn, $v) . "'";
  }
}
$set = '';
for ($i = 0; $i < count($columns); $i++) {
  $set .= ($i > 0 ? ',' : '') . $columns[$i] . "=" . $values[$i];
}

switch ($method) {
  case 'GET':
    if (isset($_GET['user_id']) && isset($_GET['course_id'])) {
      $userId = intval($_GET['user_id']);
      $courseId = intval($_GET['course_id']);
      $stmt = $conn->prepare("SELECT unit_id FROM $table WHERE user_id = ? AND course_id = ?");
      $stmt->bind_param("ii", $userId, $courseId);
      $stmt->execute();
      $result = $stmt->get_result();
      $rows = array();
      while ($row = $result->fetch_assoc()) {
        $rows[] = $row['unit_id'];
      }
      echo json_encode($rows);
      $stmt->close();
      $conn->close();
      exit;
    } else {
      $sql = "SELECT * FROM $table";
    }
    break;

  case 'POST':
    if (isset($input['user_id'], $input['course_id'], $input['unit_id'])) {
      $userId = intval($input['user_id']);
      $courseId = intval($input['course_id']);
      $unitId = intval($input['unit_id']);

      // Insert progress record
      $stmt = $conn->prepare("INSERT IGNORE INTO $table (user_id, course_id, unit_id, completed) VALUES (?, ?, ?, 1)");
      $stmt->bind_param("iii", $userId, $courseId, $unitId);
      $success = $stmt->execute();
      $stmt->close();

      // Count total units for course
      $stmt = $conn->prepare("SELECT COUNT(*) as total FROM units WHERE course_id = ?");
      $stmt->bind_param("i", $courseId);
      $stmt->execute();
      $totalResult = $stmt->get_result()->fetch_assoc();
      $totalUnits = intval($totalResult['total']);
      $stmt->close();

      // Count completed units for user
      $stmt = $conn->prepare("SELECT COUNT(*) as completed FROM $table WHERE user_id = ? AND course_id = ?");
      $stmt->bind_param("ii", $userId, $courseId);
      $stmt->execute();
      $completedResult = $stmt->get_result()->fetch_assoc();
      $completedUnits = intval($completedResult['completed']);
      $stmt->close();

      // If all units are completed, mark course as completed
      if ($completedUnits === $totalUnits && $totalUnits > 0) {
        $stmt = $conn->prepare("UPDATE enrolments SET completed = 1 WHERE user_id = ? AND course_id = ?");
        $stmt->bind_param("ii", $userId, $courseId);
        $stmt->execute();
        $stmt->close();
      }

      echo json_encode(["success" => $success]);
      $conn->close();
      exit;
    }
    break;


    case 'DELETE':
    if (isset($_GET['user_id']) && isset($_GET['unit_id']) && isset($_GET['course_id'])) {
      $userId = intval($_GET['user_id']);
      $unitId = intval($_GET['unit_id']);
      $courseId = intval($_GET['course_id']);

      // Delete progress record
      $stmt = $conn->prepare("DELETE FROM $table WHERE user_id = ? AND unit_id = ? AND course_id = ?");
      $stmt->bind_param("iii", $userId, $unitId, $courseId);
      $success = $stmt->execute();
      $stmt->close();

      // Since a unit was unchecked, mark course as not completed
      $stmt = $conn->prepare("UPDATE enrolments SET completed = 0 WHERE user_id = ? AND course_id = ?");
      $stmt->bind_param("ii", $userId, $courseId);
      $stmt->execute();
      $stmt->close();

      echo json_encode(["success" => $success]);
      $conn->close();
      exit;
    }
    break;


  default:
    http_response_code(405);
    exit;
}

if (!$sql) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid query"]);
  exit;
}

$result = mysqli_query($conn, $sql);
if ($result) {
  header('Content-Type: application/json');
  if ($method === 'GET') {
    echo json_encode(mysqli_fetch_all($result, MYSQLI_ASSOC));
  } elseif ($method === 'POST') {
    echo json_encode(["id" => mysqli_insert_id($conn)]);
  } else {
    echo json_encode(["affected" => mysqli_affected_rows($conn)]);
  }
} else {
  http_response_code(500);
  echo json_encode(["error" => mysqli_error($conn)]);
}

mysqli_close($conn);
?>
