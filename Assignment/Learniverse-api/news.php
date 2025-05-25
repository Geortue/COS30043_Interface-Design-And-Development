<?php
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : null;
$input = json_decode(file_get_contents('php://input'), true);

$conn = mysqli_connect('feenix-mariadb.swin.edu.au', 's103488418', '111103', 's103488418_db');
mysqli_set_charset($conn, 'utf8');

$table = "news";

if ($action === 'id') {
    $key = isset($_GET['id']) ? intval($_GET['id']) : 0;
} else {
    $key = null;
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

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM `$table`";
        if ($key) {
            $sql .= " WHERE id=$key";
        }
        break;

    case 'POST':
        $sql = "INSERT INTO `$table` SET $set";
        break;

    case 'PUT':
        $sql = $key ? "UPDATE `$table` SET $set WHERE id=$key" : null;
        break;

    case 'DELETE':
        $sql = $key ? "DELETE FROM `$table` WHERE id=$key" : null;
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
