<?php
	session_start();

	if (!isset($_SESSION["failed"])) {
		$_SESSION["failed"] = false;
	}

	if (!isset($_SESSION["page"])) {
		$_SESSION["page"] = "default";
	}

	$page = $_SESSION["page"];

	if ($page != "loggedin") {
		$page = "default";
	}
?>

<html>
	<head>
<?php
		if ($page == "default") {
			echo '<title>Web Connect™ Secure Login 4.2</title>';
		} else {
			echo '<title>Web Connect™ Secure Messages App</title>';
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
			$_SESSION["failed"] = false;
		}

		echo'			</form>';
	} else if ($page == "loggedin") {
		echo '			<p class="sign" align="center">Welcome back Admin!</p>
			<p class="sign" align="center">Your messages:</p>
			<br/><p align="center">You have 1 new message(s):</p>
			<br/><p align="center" style="color:#808080">FLAG-dXMbMHuEn47ZqwHEdtPYR3BDEBshBnEAcDqtpDY8</p>
			<p class="forgot" align="center"><a href="user.php?logout">Logout</a></p>';
	}
?>
		</div>
	</body>
</html>
