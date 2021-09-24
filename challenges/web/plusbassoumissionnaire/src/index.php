<?php
	// Site web vraiment mauvais fait par un contracteur
	// L'auth fait juste ajouter un paramètre GET dans l'URL

	$msg = '';

	if (isset($_POST['uname']) && !empty($_POST['uname']) && isset($_POST['psw']) && !empty($_POST['psw'])) {

		$username = trim($_POST['uname']);
		$password = trim($_POST['psw']);

		// do not allow the weakest password ever

		if (preg_match("/^password[0-9]*/i", $_POST['psw']))
		{
			// delete
			$password = $_POST['psw'] = "";
			echo "Weak passwords are now denied due to a recent policy change! Contact the director of IT security to change your password.</br>";
		}

		// Émule le fait qu'il y aille une BD pour l'auth derrière
		if ($username == 'jeff' && $password  == 'password') {

			header('Location: index.php?login=7');
			exit;

			echo 'You have entered valid use name and password';
		}else {
			echo 'Wrong username or password';
		}
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<title>CHSDL Goldstein - login</title>
	</head>
	<body>

		<?php
			if ((isset($_GET['login']) && !empty($_GET['login'])) || (isset($_GET['login']) && $_GET['login'] === "0") || (isset($_POST['cmd']) && !empty($_POST['cmd'])))
			{
				echo "<marquee>Attention à tous. Nous savons qu'en ces temps difficiles, vous faites beaucoup d'effort pour que chacun de nous reste protégé. C'est pourquoi, nous vous offrons un nouveau lavabo à l'entrée du bâtiment afin que vous aillez à marcher moins loin pour vous laver les mains. Soyons tous solidaires pour vaincre la COVID-36. Bonne journée.</marquee>";

				if (isset($_POST['cmd']) && !empty($_POST['cmd'])) {
					$_GET['login'] = 0;
				}

				switch ($_GET['login']) {
					case "0":
						echo "<h1>Welcome admin</h1>";

						echo "<h2>Application Server Status Help And Diagnostics Page</h2>";

						echo "
		<form action='/index.php'  method='post'>
			<select name='cmd' id='commands'>
				<option value='top'>top</option>
				<option value='free'>free</option>
			</select>
			<input type='submit' value='Submit'>
		</form><pre>";

						if (isset($_POST['cmd']) && !empty($_POST['cmd'])) {
							if (!str_contains($_POST['cmd'], "top") && !str_contains($_POST['cmd'], "free")) {
								echo "Error: Command does not contain a whitelisted command.";
							} else if (preg_match("/a|h|j|k|m|q|u|v|x|y|z| |\(|\)|_|\+|\=|2|3|5|7|8|9|0/i", $_POST['cmd'])) {
								//     ^^ this is "security"
								echo "Error: Command contains an unallowed character.";
							} else {
								// exception
								if (str_starts_with($_POST['cmd'], "top")) {
									$_POST['cmd'] = str_ireplace("top", "top -bn1", $_POST['cmd']);
								}

								if (strpos($_POST['cmd'], 'uname') !== false) {
									$out = shell_exec($_POST['cmd']);
									$out = str_ireplace("UTC 2021", "UTC 2883", $out);
									$out2 = trim(shell_exec("uname -r"));
									$out = str_ireplace($out2, "34.2.23-13-generic", $out);
									echo $out;
								} else if (strpos($_POST['cmd'], 'date') !== false) {
									$out = shell_exec($_POST['cmd']);
									$out = str_ireplace("2021", "2883", $out);
									echo $out;
								} else {
									system($_POST['cmd']);
								}
							}
						} else {
							system("top -bn1");
						}

						echo "</pre><br><br><br>";

						break;

					case "2":
						echo "<h1>Welcome juliette</h1> <br><br><br><br><center><table border='2'><tr><td>1 new message(s): <hr>robert: Je comprends pas pourquoi le gouvernement veut créer un site de forums. Ça existe déjà partout sur les internets. C'est pas non plus pratique. On peut déjà s'envoyer des messages à nos Neurolinks directement par l'interface frontale et c'est instantané. Pas besoin d'un clavier. Le gouvernement est 15 ans à l'arrière. </td></tr></table></center>";
						break;
					case "3":
						echo "<h1>Welcome robert</h1>";
						break;

					case "5":
						echo "<h1>Welcome karl</h1> <br><br><br><br><center><table border='2'><tr><td>1 new message(s): <hr>Hey Karl,
<br>
Peux-tu contacter le directeur TI afin qu'il nettoie notre serveur web? J'ai eu vent qu'ils stoquent de nos vieux fichiers dans des répertoires publiques et je ne trouve pas ça très sécuritaire. Je pense que ça ne respecte pas les politiques gouvernementales parce qu'il y a peut-être des informations confidentielles là-dedans. 
<br>
Merci,<br>
Mark</td></tr></table></center>";
						break;
					case "6":
						echo "<h1>Welcome gabrielle</h1> <br><br><br><br><center><table border='2'><tr><td>1 new message(s): <hr>juliette: Salut Gabie. J'ai un RDV chez le médecin la semaine prochain. Je vais être absente mercredi.</td></tr></table></center>";
						break;
					case "7":
						echo "<h1>Welcome jeff</h1> <br><br><br><br><center><table border='2'><tr><td>3 new message(s): <hr>karl: Est-ce qu'ils ont bloqué ton mot de passe finalement?<hr>robert: STP passe au bureau lundi prochain.<hr>anonymous: flag-cb6bc02b3bb0c4eaa8583b0e069f6657c0b0f99d</td></tr></table></center>";
						break;
					default:
						echo "<h1>Welcome {?}</h1>";
				}
			}
			else
			{
				echo "<h1>Welcome</h1>";

				echo "
		<form action='index.php' method='post'>
			<div class='imgcontainer'>
				<img src='logo.jpg' alt='Centre d’hébergement de soins de dure longueur' class='avatar' height='200px'> <!-- write 'alpha version' in red? Maybe we should make this clear.-->
			</div>

			<div class='container'>
				<label for='uname'><b>Username</b></label>
				<input type='text' placeholder='Enter Username' name='uname' required>

				</br>

				<label for='psw'><b>Password</b></label>
				<input type='password' placeholder='Enter Password' name='psw' required>

				</br>

				<button type='submit'>Login</button>
				<label>
					<input type='checkbox' checked='checked' name='remember'> Remember me
				</label>
			</div>
		</form>
";
			}
		?>
	</body>
</html>
