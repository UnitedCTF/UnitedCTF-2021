<?php
	session_start();

	$password = "dXMbMHuEn47ZqwHEdtPYR3B+DEBshB(nEAcD;qt>pDY8";
	$passlen = strlen($password);	// 44

	if (isset($_GET['logout'])) {
		$_SESSION["page"] = "default";
		$_SESSION["failed"] = false;
	}

	if (isset($_POST['u']) && !empty($_POST['u'])) {
		if (isset($_POST['p']) && !empty($_POST['p'])) {
			if ($_POST['u'] === "admin") {
				$userpass = $_POST['p'];
				$len = strlen($userpass);
				$len = ($len < $passlen ? $len : $passlen);
				$failed = false;
				for ($i = 0; $i < $len; $i++) {
					// artificial delay when a character is wrong
					if ($password[$i] != $userpass[$i]) {
						$failed = true;
						usleep(150000);	// 150 ms
						break;
					}
				}

				if (strlen($userpass) != $passlen) {
					$failed = true;
				}

				if ($failed) {
					$_SESSION["page"] = "default";
					$_SESSION["failed"] = true;
				} else {
					$_SESSION["failed"] = false;
					$_SESSION["page"] = "loggedin";
				}

			} else {
				$_SESSION["failed"] = true;
			}
		}
	}

	header('Location: index.php');
?>
