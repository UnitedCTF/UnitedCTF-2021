<html>
<head>
	<title>Web Connect™ Login</title>
	<meta charset="utf-8">
	<link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet">
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" href="styles.css">

	<script>
		function fadeout() {
			setTimeout(function() {
				var loader = document.getElementById("message");
				loader.style.transition = '.9s';
				loader.style.opacity = '0';
				loader.style.visibility = 'hidden';
			}, 1100);
		}
	</script>
</head>

<?php
	if (stripos($_SERVER['HTTP_USER_AGENT'], 'sqlmap') !== false) {
		// SQLmap detected
		sleep(rand(1, 10));
		die();
	}

	$status = "";
	$filename = "/tmp/sqli6.sqlite";

	// Test submitted login info for validity
	if (isset($_POST['u']) && !empty($_POST['u'])) {
		if (isset($_POST['p']) && !empty($_POST['p'])) {
			$db = new SQLite3($filename, SQLITE3_OPEN_READONLY);
			$reqstr = 'SELECT * FROM users WHERE username="' . $_POST['u'] . '" AND password="' . $_POST['p'] . '"';
			$results = @$db->query($reqstr);
			// vulnérable à:  " union select 1,2,name from sqlite_master--
			// ensuite on peut aller chercher le flag avec le nom de la table

			if (gettype($results) == "object") {
				if (!$results) {
					// Fatal error, SQL query may be invalid
					$status = "SQL error";
				} else if ($row = $results->fetchArray()) {
					// Success
					echo '<div class="flag"><h1><br><br><br></h1><h1>Login success!!</h1><h1>' . $row["password"] . '</h1></div>';
					die();
				} else {
					// Failed login
					$status = "Login failure";
				}
			} else {
				$status = "SQL error";
			}

			$db->close();
		}
	}

	// Create DB if it doesn't exist
	if (!file_exists($filename)) {
		$db = new SQLite3($filename, SQLITE3_OPEN_CREATE | SQLITE3_OPEN_READWRITE);

		$db->query(
		'CREATE TABLE IF NOT EXISTS "users" (
			"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			"username" VARCHAR,
			"password" VARCHAR
		  )'
		);

		$db->query(
		'CREATE TABLE IF NOT EXISTS "K953U0Ty4V" (
			"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			"flag" VARCHAR
		  )'
		);

		$db->query('INSERT INTO "users" ("username", "password") VALUES ("admin", "N0t1nTh3r3,1nT#30th3rT@bl3")');
		$db->query('INSERT INTO "K953U0Ty4V" ("flag") VALUES ("FLAG-25389bf2c3b5f951b1201213fa6c46baYouAreEpic")');

		$db->close();
	}
?>

<body onload="fadeout()">
	<div class="login">
		<h1>Login</h1>
		<form method="post">
			<input type="text" name="u" placeholder="Username" required="required" />
			<input type="password" name="p" placeholder="Password" required="required" />
			<button type="submit" class="btn btn-primary btn-block btn-large">Let me in.</button>
		</form>

<?php
	echo "<h4 id=\"message\">" . $status . "</h4>";
?>
	</div>
     
</body>

</html>
