<?php
session_start();

require_once('./dbProthetaConnection.php');
// **************************initialize***************************************
$method = $_SERVER['REQUEST_METHOD'];

// ********************Actions**************************************

// parse action
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$action = $request->action;
$userId = -1;
if(isset($_COOKIE["UserId"]))
{
	$userId = $_COOKIE["UserId"];
}

if ($method != 'POST') {
	die("can only accept POST action");
}

if ($action == 'GetWebApp')
{
	$apps = array();
	$tag = json_decode($request->tag);
	foreach ($tag as $key => $value) {
		$apps = array_merge($apps, GetWebApp($value));
	}

	$apps = array_unique($apps, SORT_REGULAR);
	echo json_encode($apps);
}
elseif ($action == 'GetWebAppForCategory')
{
	echo json_encode(GetWebAppForCategory());
}

function GetWebApp($word)
{
	$conn = new mysqli( $GLOBALS['servername'], $GLOBALS['username'], 
	    $GLOBALS['password'], $GLOBALS['database']);

	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	}

	if ($stmt = $conn->prepare("SELECT u.url, u.name, wc.cat_name FROM tbl_url u INNER JOIN (SELECT c.cat_id, c.cat_name FROM `tbl_word` w INNER JOIN `tbl_category` c ON w.cat_id = c.cat_id where w.word = ?) wc ON wc.cat_id = u.cat_id_1;")) 
	{

	    /* bind parameters for markers */
	    $stmt->bind_param("s", $word);

	    /* execute query */
	    $stmt->execute();

	    /* bind result variables */
	    $stmt->bind_result($appurls, $appnames, $appcat);

	    $apps = array();
	    while ($stmt->fetch()) {
	    	$app = [];
	    	$app["name"] = $appnames;
	    	$app["url"] = $appurls;
	    	$app["cat"] = $appcat;
	    	$apps[] = $app;
	    }

		$stmt->fetch();

		$stmt->close();
	}
	else
	{
		return -1;
	}

	mysqli_close($conn);
	return $apps;
}

function GetWebAppForCategory()
{
	$conn = new mysqli( $GLOBALS['servername'], $GLOBALS['username'], 
    $GLOBALS['password'], $GLOBALS['database']);

	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	}

	if ($stmt = $conn->prepare("SELECT tc.cat_name, tu.name, tu.url FROM tbl_category tc RIGHT JOIN (select t1.url, t1.name, t1.cat_id_1 from tbl_url t1 LEFT JOIN tbl_url t2 ON t1.cat_id_1 = t2.cat_id_1 and t1.name <= t2.name GROUP BY t1.name HAVING count(t1.cat_id_1) <=2 ORDER BY `t1`.`cat_id_1` ASC) tu ON tc.cat_id = tu.cat_id_1")) 
	{
	    /* execute query */
	    $stmt->execute();

	    /* bind result variables */
	    $stmt->bind_result($appcat, $appname, $appurl);

	    $cates = [];
	    while ($stmt->fetch()) {
	    	$app = [];
	    	$app["cat"] = $appcat;
	    	$app["name"] = $appname;
	    	$app["url"] = $appurl;
	    	$cates[$appcat][] = $app;
	    }

		$stmt->fetch();

		$stmt->close();
	}
	else
	{
		return -1;
	}

	mysqli_close($conn);
	return $cates;
}

// **************************Functions***************************************
function GetLevels($userId)
{
	$conn = new mysqli( $GLOBALS['servername'], $GLOBALS['username'], 
	    $GLOBALS['password'], $GLOBALS['database']);

		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}

		$sql = "SELECT tq.question_id, tp.star, tq.stage, tq.level, tq.prefix FROM tbl_questions tq LEFT OUTER JOIN (SELECT user_id, question_id, star from tbl_progress where user_id = ".$userId.") AS tp ON tq.question_id = tp.question_id";

		if ($userId == -1) {
			 $sql = "select question_id, stage, level, prefix from tbl_questions";
		}

	    $result = mysqli_query($conn, $sql);
	    $levels = array();
	    if (mysqli_num_rows($result) > 0) {
	        while($row = mysqli_fetch_assoc($result)) {
	            $levels[] = $row;
	        }
	    }	 
	       
		mysqli_close($conn);
		return $levels;
} 

function GetUserProgress($userId)
{
	if(isset($_SESSION["question"]))
	{
		return $_SESSION["question"];
	}
	else
	{
		$question = 1;
		$conn = new mysqli( $GLOBALS['servername'], $GLOBALS['username'], 
	    $GLOBALS['password'], $GLOBALS['database']);

		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}

		if (!is_null($userId)) {

			// get stage level by question id
			if ($stmt = $conn->prepare("SELECT max(question_id) FROM tbl_progress where user_id = ?")) {

			    /* bind parameters for markers */
			    $stmt->bind_param("i", $userId);

			    /* execute query */
			    $stmt->execute();

			    /* bind result variables */
			    $stmt->bind_result($question);

			    /* fetch value */
			    $stmt->fetch();

				$stmt->close();
			}

			if (is_null($question))
			{
				$_SESSION["question"] = 1;
			}
			else
			{
				$_SESSION["question"] = $question;
			}
			
			return $_SESSION["question"];
		}
		else
		{
			die("UserId is null");
		}
		mysqli_close($conn);
	}
}


function UpdateUserProgress($userId, $star, $nextStage)
{
	$updated = null;
	if(isset($_SESSION["question"])) 
	{
		$question = $_SESSION["question"];
	}
	else
	{
		die("session is not set");
	}

	$isNewStar = null;

	$conn = new mysqli( $GLOBALS['servername'], $GLOBALS['username'], 
	    $GLOBALS['password'], $GLOBALS['database']);

	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	}

	if (!is_null($userId)) {

		// Find if the leve is played before
		if ($stmt = $conn->prepare("SELECT star FROM tbl_progress where question_id = ? and user_id = ?")) 
		{

		    /* bind parameters for markers */
		    $stmt->bind_param("ii", $question, $userId);

		    /* execute query */
		    $stmt->execute();

		    /* bind result variables */
		    $stmt->bind_result($isNewStar);

		    /* fetch value */
		    $stmt->fetch();

			$stmt->close();
		    if (is_null($isNewStar)) {
		    	// if is not played, insert a new row
		    	if ($stmt = $conn->prepare("INSERT INTO tbl_progress (user_id, question_id, star) VALUES(?, ?, ?)")) {
				    /* bind parameters for markers */
				    $stmt->bind_param("iii", $userId, $question, $star);

				    /* execute query */
				    $stmt->execute();
				    $stmt->close();
				}
				$updated = "new record";
		    }
		    else
		    {
		    	// if current level is played, update star
		    	if ($star > $isNewStar) {
		    		if ($stmt = $conn->prepare("UPDATE tbl_progress SET star = ? WHERE user_id = ? and question_id = ?")) {
					    /* bind parameters for markers */
					    $stmt->bind_param("iii", $star, $userId, $question);

					    /* execute query */
					    $stmt->execute();
					    $stmt->close();
					}

		    		$updated = "new star"." userid: ".$userId." question_id: ".$_SESSION["question"];
		    	}
		    }
		}
	}

	echo $updated;
	mysqli_close($conn);
}

function GetQuestion($userId, $questionId)
{

	$conn = new mysqli( $GLOBALS['servername'], $GLOBALS['username'], 
	    $GLOBALS['password'], $GLOBALS['database']);

	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	}

	if ($stmt = $conn->prepare("SELECT icon_set, color_set, prefix, clear_count, second_star, third_star FROM tbl_questions where question_id = ?")) {

	    /* bind parameters for markers */
	    $stmt->bind_param("i", $questionId);

	    /* execute query */
	    $stmt->execute();

	    /* bind result variables */
	    $stmt->bind_result($iconSet, $colorSet, $prefix, $clearCount, $secondStar, $thirdStar);

	    /* fetch value */
	    $stmt->fetch();
	    $stmt->close();
	}

	if (!is_null($iconSet) && !is_null($colorSet) && !is_null($clearCount) && !is_null($prefix))
	{
		$iconSet = json_decode($iconSet);
		$colorSet = json_decode($colorSet);

		$choice = rand(0, 2);
		if ($choice <= 1)
		{
			$question = GetWrong($iconSet, $colorSet, $prefix);
			$output = array("optionSet" => $question["optionSet"],
				"question" => $question["question"],
				"answer" => $question["answer"],
				"answerPath" => $question["answerPath"],
				"userId" => $userId,
				"clearCount" => $clearCount,
				"secondStar" => $secondStar,
				"thirdStar" => $thirdStar,
				"question_id" => $questionId);
			echo json_encode($output);
		}
		else
		{
			$question = GetCorect($iconSet, $colorSet, $prefix);
			$output = array("optionSet" => $question["optionSet"],
				"question" => $question["question"],
				"answer" => $question["answer"],
				"answerPath" => $question["answerPath"],
				"userId" => $userId,
				"clearCount" => $clearCount,
				"secondStar" => $secondStar,
				"thirdStar" => $thirdStar,
				"question_id" => $questionId);
			echo json_encode($output);
		}
	}

	mysqli_close($conn);
}

function GetWrong($iconSet, $colorSet, $prefix)
{
	// possible set
	$charSet = 	$iconSet;
    $colorSet = $colorSet;

    // remove two items
    while (sizeof($charSet) >5)
    {
    	$remove = rand(0, sizeof($charSet)-1);
    	unset($charSet[$remove]);
		unset($colorSet[$remove]);
	    $charSet = array_values($charSet);
	    $colorSet = array_values($colorSet);
    }

    // this specific question set
    $oriCharSet = $charSet;
    $oriColorSet = $colorSet;

    $answer = rand(0, 4);
    //echo "answer: ".sizeof($charSet)-1;
    //unset correct answer
	unset($charSet[$answer]);
	unset($colorSet[$answer]);
    $charSet = array_values($charSet);
    $colorSet = array_values($colorSet);

    // choose 1st wrong answer
    $chooseWrong = rand(0, 3);
    
	// choose the indexed char
	$wrongChar1 = $charSet[$chooseWrong];

	unset($charSet[$chooseWrong]);
	unset($colorSet[$chooseWrong]);
    $charSet = array_values($charSet);
    $colorSet = array_values($colorSet);

	// choose wrong1's color
	$chooseWrongColor = rand(0, 2);
	$wrongColor1 = $colorSet[$chooseWrongColor];

	// unset both char and color for char and color array
	unset($charSet[$chooseWrongColor]);
	unset($colorSet[$chooseWrongColor]);
    $charSet = array_values($charSet);
    $colorSet = array_values($colorSet);

	// choose 2nd wrong answer
	$chooseWrong2 = rand(0, sizeof($charSet)-1);
	$wrongChar2 = $charSet[$chooseWrong2];
	unset($charSet[$chooseWrong2]);
	unset($colorSet[$chooseWrong2]);
    $charSet = array_values($charSet);
    $colorSet = array_values($colorSet);

    $wrongColor2 = $colorSet[0];

    $question1Path = ConstructPath($wrongChar1, $wrongColor1, $prefix);
    $question2Path = ConstructPath($wrongChar2, $wrongColor2, $prefix);
    $question = array($question1Path, $question2Path);

    $optionSet = array();
    for($i = 0; $i<sizeof($oriCharSet); $i++)
    {
    	$optionSet[] = ConstructPath($oriCharSet[$i], $oriColorSet[$i], $prefix);
    }

    $answerPath = ConstructPath($oriCharSet[$answer], $oriColorSet[$answer], $prefix);
    // function to merge
	$output = array("optionSet" => $optionSet,
					"question" => $question,
					"answer" => $answer,
					"answerPath" => $answerPath);
    return $output;
}

function GetCorect($iconSet, $colorSet, $prefix)
{
	$charSet = 	$iconSet;
    $colorSet = $colorSet;

    // remove two items
    while (sizeof($charSet) >5)
    {
    	$remove = rand(0, sizeof($charSet)-1);
    	unset($charSet[$remove]);
		unset($colorSet[$remove]);
	    $charSet = array_values($charSet);
	    $colorSet = array_values($colorSet);
    }

    $oriCharSet = $charSet;
    $oriColorSet = $colorSet;

    $answer = rand(0, sizeof($charSet)-1);
    $chooseChar1 = $charSet[$answer];
    $chooseColor1 = $colorSet[$answer];

    // unset correct answer
	unset($charSet[$answer]);
	unset($colorSet[$answer]);
	$charSet = array_values($charSet);
    $colorSet = array_values($colorSet);

    // choose 1st wrong answer
    $chooseWrong = rand(0, sizeof($charSet)-1);

	// choose the indexed char
	$wrongChar1 = $charSet[$chooseWrong];

	unset($charSet[$chooseWrong]);
	unset($colorSet[$chooseWrong]);
    $charSet = array_values($charSet);
    $colorSet = array_values($colorSet);

	// choose wrong1's color
	$chooseWrongColor = rand(0, sizeof($charSet)-1);
	$wrongColor1 = $colorSet[$chooseWrongColor];

	$order = rand(0, 1);
	if ($order == 0)
	{
		ConstructPath($wrongChar1, $wrongColor1, $prefix);
		$question = array(ConstructPath($chooseChar1, $chooseColor1, $prefix), ConstructPath($wrongChar1, $wrongColor1, $prefix));
	}
	else
	{
		$question = array(ConstructPath($wrongChar1, $wrongColor1, $prefix), ConstructPath($chooseChar1, $chooseColor1, $prefix));
	}

    $optionSet = array();
    for($i = 0; $i<sizeof($oriCharSet); $i++)
    {
    	$optionSet[] = ConstructPath($oriCharSet[$i], $oriColorSet[$i], $prefix);
    }

	$answerPath = ConstructPath($oriCharSet[$answer], $oriColorSet[$answer], $prefix);
	$output = array("optionSet" => $optionSet, 
					"question" => $question,
					"answer" => $answer,
					"answerPath" => $answerPath);
    return $output;
}

function ConstructPath($char, $color, $prefix)
{
	$paths = "./img/".$prefix."/".$color."/".$char.".png";
	return $paths;
}


function SetQuestionId($index)
{
	if(isset($_SESSION["question"])) 
	{
		$_SESSION["question"] = $index;
		return 1;
	}
	else
	{
		return 0;
	}
}

?>