<?php
	session_start();
	error_reporting(0);

	if (!isset($_SESSION["failed"])) {
		$_SESSION["failed"] = false;
	}

	$page = "default";

	function cookieDecode($cookie) {
		$arr = json_decode(base64_decode(base64_decode($cookie)), true);
		return $arr[str_rot13('user')];
	}

	if (isset($_COOKIE['session']) && !empty($_COOKIE['session'])) {
		$page = str_rot13(cookieDecode($_COOKIE['session']));
	}

	if ($page != "admin" && $page != "guest") {
		$page = "default";
	}
?>

<html>
	<head>
<?php
		if ($page == "default") {
			echo '<title>Web Connect™ Safe Login 2.0</title>';
		} else {
			echo '<title>Web Connect™ Safe Messages App</title>';
		}
?>
		<meta charset="utf-8">
		<link rel="stylesheet" href="styles.css">
		<link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet">
		<meta name="viewport" content="width=device-width, initial-scale=1" />
	</head>

	<body>
		<div class="main">
<?php
	if ($page == "default") {
		echo '			<p class="sign" align="center">Sign in</p>
			<form method="post" class="form1">
				<input class="un" type="text" name="u" align="center" placeholder="Username">
				<input class="pass" type="password" name="p" align="center" placeholder="Password">
				<button class="submit" type="submit" align="center" formaction="/user.php">Sign in</button>';

		if ($_SESSION["failed"] == true) {
			echo '<br><br><p align="center">Login failed. Try again.</p>';
		} else {
			echo '<p align="center"><button class="guest" type="submit" align="center" formaction="/user.php?guest">Login as Guest</button></p>';
		}

		echo'			</form>';
	} else if ($page == "admin") {
		echo '			<p class="sign" align="center">Welcome ' . $page . '!</p>
			<p class="sign" align="center">Your messages:</p>
			<br/><p align="center">You have 1 new message(s):</p>
			<br/><p align="center" style="color:#808080">FLAG-WH9R7GXttUvx2vqXJ4jLMWFywLBAX2</p>
			<p class="forgot" align="center"><a href="user.php?logout">Logout</a></p>';
	} else if ($page == "guest") {
		echo '			<p class="sign" align="center">Welcome ' . $page . '!</p>
			<p class="sign" align="center">General messages:</p>
			<br/><p align="center">There are no general messages</p>
			<br/><br/><p class="forgot" align="center"><a href="user.php?logout">Logout</a></p>';
	}
?>
		</div>
	</body>
</html>
