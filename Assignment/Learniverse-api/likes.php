<?php
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : null;
$input = json_decode(file_get_contents('php://input'), true);

$conn = mysqli_connect('feenix-mariadb.swin.edu.au', 's103488418', '111103', 's103488418_db');
mysqli_set_charset($conn, 'utf8');

$table = "likes";
$key = null;

if ($action === 'id') {
    $key = isset($_GET['id']) ? intval($_GET['id']) : 0;
}

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

if ($method === 'GET' && $action === 'check' && isset($_GET['user_id']) && isset($_GET['course_id'])) {
    $userId = intval($_GET['user_id']);
    $courseId = intval($_GET['course_id']);

    $stmt = $conn->prepare("SELECT COUNT(*) AS liked FROM $table WHERE user_id = ? AND course_id = ?");
    $stmt->bind_param("ii", $userId, $courseId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    echo json_encode($row);
    $stmt->close();
    $conn->close();
    exit;
}

if ($method === 'GET' && $action === 'user_likes' && isset($_GET['user_id'])) {
    $userId = intval($_GET['user_id']);
    $sql = "SELECT course_id FROM $table WHERE user_id = $userId";
    $result = mysqli_query($conn, $sql);
    $likes = [];

    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $likes[] = intval($row['course_id']);
        }
    }

    echo json_encode($likes);
    mysqli_close($conn);
    exit;
}

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM `$table`";
        break;

    case 'POST':
        if (isset($input['user_id']) && isset($input['course_id'])) {
            $userId = intval($input['user_id']);
            $courseId = intval($input['course_id']);
            $stmt = $conn->prepare("INSERT IGNORE INTO `$table` (user_id, course_id) VALUES (?, ?)");
            $stmt->bind_param("ii", $userId, $courseId);
            $success = $stmt->execute();

            if ($success) {
                $conn->query("UPDATE courses SET likes = likes + 1 WHERE id = $courseId");
                echo json_encode(["success" => true]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to like course"]);
            }

            $stmt->close();
            $conn->close();
            exit;
        }
        $sql = null;
        break;

    case 'DELETE':
        if (isset($_GET['user_id']) && isset($_GET['course_id'])) {
            $userId = intval($_GET['user_id']);
            $courseId = intval($_GET['course_id']);
            $stmt = $conn->prepare("DELETE FROM `$table` WHERE user_id = ? AND course_id = ?");
            $stmt->bind_param("ii", $userId, $courseId);
            $success = $stmt->execute();

            if ($success) {
                $conn->query("UPDATE courses SET likes = GREATEST(likes - 1, 0) WHERE id = $courseId");
                echo json_encode(["success" => true]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Failed to unlike course"]);
            }

            $stmt->close();
            $conn->close();
            exit;
        }
        $sql = null;
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
