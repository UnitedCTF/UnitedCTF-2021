<?php
	session_start();

	function generateRandom() {
		$characters = "";
		$length = mt_rand(1, 13);
		for ($i = 0; $i < $length; $i++) {
			$characters .= rand(0, 9);
		}
		return $characters;
	}

	function cookieEncode($usr) {
		$arr = array(str_rot13('data') => generateRandom(), str_rot13('user') => str_rot13($usr));
		return base64_encode(base64_encode(json_encode($arr)));
	}

	if (isset($_GET['guest'])) {
		setcookie("session", cookieEncode("guest"));
		$_SESSION["failed"] = false;
	}

	if (isset($_GET['logout'])) {
		setcookie("session", "", time() - 3600);
		unset($_COOKIE['session']); 
		$_SESSION["failed"] = false;
	}

	if (isset($_POST['u']) && !empty($_POST['u'])) {
		if (isset($_POST['p']) && !empty($_POST['p'])) {
			if ($_POST['u'] === "admin" && $_POST['p'] === "MCvs8WkGBXaYuJbu#n3QHcTLTbFNGRQam67BadkFMFnCm4fqM") {
				setcookie("session", cookieEncode($_POST['u']));
				$_SESSION["failed"] = false;
			} else {
				$_SESSION["failed"] = true;
			}
		}
	}

	header('Location: index.php');
?>
