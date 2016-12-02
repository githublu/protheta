<?php
require_once('./dbConnection.php');
include './_helperFunctions.php';


// **************************initialize***************************************
$method = $_SERVER['REQUEST_METHOD'];

// parse action
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$action = $request->action;

if ($method != 'POST' )
{
    echo "Invalid Operation";
}
else if ($action == 'LogIn')
{
	echo LogIn($request);
}
else if ($action == 'SignUp')
{
    echo SignUp($request);
}
else if ($action == 'Reset')
{
	DestroySessionAndCookies();
	session_start();
}

// **************************Check Login***************************************
function LogIn($request)
{
	$output = array();
	$name = $request->name;
	$userPassword = $request->password;
	$name = replace($name);

	if($name == "" || $userPassword == "")
	{
		$output["StatusCode"] = 0;
    	$output["msg"] = "name does not exist";
	}
	else
	{
		$conn = new mysqli( $GLOBALS['servername'], $GLOBALS['username'], 
	    $GLOBALS['password'], $GLOBALS['database']);

		// Check connection
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}

		if ($stmt = $conn->prepare("SELECT user_id, password FROM tbl_users WHERE name=?")) {

		    /* bind parameters for markers */
		    $stmt->bind_param("s", $name);

		    /* execute query */
		    $stmt->execute();

		    /* bind result variables */
		    $stmt->bind_result($userId, $realPassword);

		    /* fetch value */
		    $stmt->fetch();

		    if (is_null($realPassword))
		    {
	            // wrong username
		    	$output["StatusCode"] = 0;
		    	$output["msg"] = "name does not exist";
		    }
		    else
		    {
	            if ($realPassword != $userPassword)
	            {
	                // wrong password
	                $output["StatusCode"] = 1;
	                $output["realPassword"] = $realPassword;
	                $output["password"] = $userPassword;
		    		$output["msg"] = "password is incorrect";
	            }
	            else
	            {
	                // correct password and login
	                $hour = time() + 3600; 
	                setcookie("UserId", $userId, $hour);
	                setcookie("Name", $name, $hour);
	                setcookie("Password", $realPassword, $hour);
	                $output["StatusCode"] = 2;
	                $output["msg"] = "";
	            }
		    }

		    /* close statement */
		    $stmt->close();
		    $conn->close();
		}
	}
	return json_encode($output);
}

// **************************Sign Up***************************************
function SignUp($request)
{
	$name = $request->name;
	$email = $request->email;
	$userPassword = $request->password;
	$name = replace($name);
	if($name == "" || $userPassword == "" || $email == "")
	{
		$output["StatusCode"] = 0;
    	$output["msg"] = "One of the three fields is empty";
	}
	else
	{
		// check if name is used
		$conn = new mysqli( $GLOBALS['servername'], $GLOBALS['username'], 
	    $GLOBALS['password'], $GLOBALS['database']);

		// Check connection
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}

	    $sql = "SELECT * FROM tbl_users WHERE name = '".$name."'";
	    $result = mysqli_query($conn, $sql);
	    $progress = array();
	    if (mysqli_num_rows($result) > 0) {
	    	$output["StatusCode"] = 1;
    		$output["msg"] = "Name is already existed. Please choose a different name";
	    }
	    else
	    {
    		if ($stmt = $conn->prepare("INSERT INTO tbl_users (password, name, email) VALUES(?, ?, ?)")) {
			    /* bind parameters for markers */
			    $stmt->bind_param("sss", $userPassword, $name, $email);

			    /* execute query */
			    $stmt->execute();
			    $stmt->close();
			}

			do {
				sleep(1);
				if ($stmt = $conn->prepare("SELECT user_id, password FROM tbl_users WHERE name=?")) {

				    /* bind parameters for markers */
				    $stmt->bind_param("s", $name);

				    /* execute query */
				    $stmt->execute();

				    /* bind result variables */
				    $stmt->bind_result($userId, $userPassword);

				    /* execute query */
				    $stmt->fetch();
				    $stmt->close();
				}
			} while (is_null($userId));

            $hour = time() + 3600; 
            setcookie("UserId", $userId, $hour);
            setcookie("Name", $name, $hour);
            setcookie("Password", $userPassword, $hour);
	    	$output["StatusCode"] = 2;
    		$output["msg"] = "Successfully signed up userid: ". $userId. " name: ".$name;
	    }
	}

	return json_encode($output);
}

// **************************Destroy sessions and cookies*********************************

function DestroySessionAndCookies()
{
    // Unset all of the session variables.
    unset($_SESSION['question']);
    $_SESSION = array();

    // If it's desired to kill the session, also delete the session cookie.
    // Note: This will destroy the session, and not just the session data!
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    // Finally, destroy the session.
    session_regenerate_id();
    session_destroy();

    $userId = 'UserId';
    $name = 'Name';
    $password = 'Password';

	unset($_COOKIE[$userId]);
	unset($_COOKIE[$name]);
	unset($_COOKIE[$password]);
	// empty value and expiration one hour before
	$res = setcookie($userId, '', time() - 36000);
	$res = setcookie($name, '', time() - 36000);
	$res = setcookie($password, '', time() - 36000);
}
?>