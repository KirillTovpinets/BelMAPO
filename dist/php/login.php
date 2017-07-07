<?php
	ini_set("display_errors", 1);
	require_once("config.php");

	function generateCode($length = 6){
		$chars= "asdfghjklqwertyuiopzxcvbnmASDFGHJKLQWERTYUIOPZXCVBNM0987654321";

		$code = "";

		$clen = strlen($chars) - 1;

		while (strlen($code) < $length) {
			$code .= $chars[mt_rand(0, $clen)];
		}

		return $code;
	}

	$login = $_POST["login"];
	$pass = $_POST["password"];
	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка: " . myslqli_connect_error());
	$mysqli->query("SET NAMES utf8");
	$result = $mysqli->query("SELECT * FROM users WHERE login = '$login' AND pass = '$pass'");


	if ($result->{"num_rows"} != 0) {
		$loginUser = $result->fetch_assoc();
		if ($loginUser["pass"] === $pass) {	
			$hash = md5(generateCode(10));
			$UserId = $loginUser["id"];
			$mysqli->query("UPDATE users SET hash = '$hash' WHERE id = $UserId");
			mysqli_close($mysqli);	
			session_start();
			$_SESSION["name"] = $loginUser["name"];
			$_SESSION["surname"] = $loginUser["surname"];
			$_SESSION["patername"] = $loginUser["patername"];
			header("Location:/BelMAPO/dist/main.html");
		}
		else{
			echo $_SERVER;
		}
	}
	mysqli_close($mysqli);

?>