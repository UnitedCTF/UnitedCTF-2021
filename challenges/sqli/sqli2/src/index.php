<?php
	session_start();
?>
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
	// Rate limiting: Create new session with fresh timestamp
	if (!isset($_SESSION["last_request"])) {
		$_SESSION["last_request"] = microtime(true);
	}

	$status = "";
	$filename = "/tmp/sqli2.sqlite";

	// Test submitted login info for validity
	if (isset($_POST['u']) && !empty($_POST['u'])) {
		if (isset($_POST['p']) && !empty($_POST['p'])) {

			// Rate limiting: Check if last login attempt was more than 100ms ago
			if (microtime(true) - $_SESSION["last_request"] > 0.1) {

				// Basic SQLmap detection
				if (stripos($_SERVER['HTTP_USER_AGENT'], 'sqlmap') !== false) {
					// SQLmap detected
					sleep(rand(1, 10));
					die();
				}

				$db = new SQLite3($filename, SQLITE3_OPEN_READONLY);
				$results = @$db->query("SELECT * FROM users WHERE username='" . $_POST['u'] . "' AND password='" . $_POST['p'] . "'");

				if (gettype($results) != "object" || !$results) {
					// Fatal error, SQL query may be invalid
					$status = "SQL error";
				} else {
					$rowcount = 0;
					while ($results->fetchArray()) {
						$rowcount++;
					}
					$results->reset();

					if ($rowcount == 1) {
						// Success
						$row = $results->fetchArray();
						echo '<div class="flag"><h1><br><br><br></h1><h1>Login success!!</h1><h1>' . $row["password"] . '</h1></div>';
						die();
					} else {
						// Failed login
						$status = "Login failure";
					}
				}

				$db->close();
			}

			// Rate limiting: Set new fresh timestamp
			$_SESSION["last_request"] = microtime(true);
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

		$db->query('INSERT INTO "users" ("username", "password") VALUES ("admin", "FLAG-4acceacedaf77ae3c3ecc5fec82ff1fflimitit")');
		$db->query('INSERT INTO "users" ("username", "password") VALUES ("ben", "OopsThatAnotherUsersPassword")');

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
