<?php
require_once('./dbConnection.php');

// **************************initialize***************************************
$method = $_SERVER['REQUEST_METHOD'];

// ********************Actions**************************************

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$action = $request->action;
if($method != 'POST')
{
    die("not valid operation");
}
if ($action == 'GetProgress')
{
    $userId = $request->userId;
    if (gettype($userId) == 'integer')
    {
        // ?? used anywhere??
        GetProgress($userId);
    }
}
elseif ($action == 'ShowLeaderBoard')
{
    $leaderBoard = ShowLeaderBoard();
    echo json_encode($leaderBoard);
}
elseif ($action == 'GetPlayerName')
{
    echo GetPlayerName();
}

function GetProgress($userId)
{
    // Create connection
    $conn = new mysqli( $GLOBALS['servername'], $GLOBALS['username'], 
        $GLOBALS['password'], $GLOBALS['database']);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT * FROM tbl_progress WHERE user_id = ".$userId;
    $result = mysqli_query($conn, $sql);
    $progress = array();
    if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_assoc($result)) {
            $progress[] = $row;
        }
    }

    $conn->close();
    return $progress;
}

function ShowLeaderBoard()
{
    // Create connection
    $conn = new mysqli( $GLOBALS['servername'], $GLOBALS['username'], 
        $GLOBALS['password'], $GLOBALS['database']);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT tu.name, tp.maxscore, tp.star FROM tbl_users tu INNER JOIN (SELECT MAX(question_id) maxscore, user_id, star FROM tbl_progress group by user_id order by maxscore LIMIT 3) tp ON tu.user_id = tp.user_id order by tp.maxscore desc;";
    $result = mysqli_query($conn, $sql);
    $leaderBoard = array();
    if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_assoc($result)) {
            $leaderBoard[] = $row;
        }
    }

    $conn->close();
    return $leaderBoard;
}

function GetPlayerName()
{
    if(isset($_COOKIE["UserId"]))
    {
        $userId = $_COOKIE["UserId"];

        // Create connection
        $conn = new mysqli( $GLOBALS['servername'], $GLOBALS['username'], 
            $GLOBALS['password'], $GLOBALS['database']);

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $sql = "SELECT name FROM tbl_users WHERE user_id = ".$userId;
        $result = mysqli_query($conn, $sql);
        $playerName = '';
        if (mysqli_num_rows($result) > 0) {
            while($row = mysqli_fetch_assoc($result)) {
                $playerName = $row['name'];
            }
        }

        $conn->close();
        return $playerName;
    }
    else
    {
        return -1;
    }
}

?>