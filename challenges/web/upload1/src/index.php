<?php
// flag-5f087c95fd24e2d8feef96nosecuritywhatsoever
session_start();

if (!isset($_SESSION["folder"])) {
	$_SESSION["creation"] = time();
	$folder = "uploads/" . bin2hex(random_bytes(24)) . "/";
	while (is_dir($folder)) {
		$folder = "uploads/" . bin2hex(random_bytes(24)) . "/";
	}
	mkdir($folder);
	$_SESSION["folder"] = $folder;
} else {
	// Make sure the folder does exist
	if (!is_dir($_SESSION["folder"])) {
		mkdir($_SESSION["folder"]);
	}

	// Delete files of recurring visitors after a while
	if (time() - $_SESSION["creation"] > 60 * 60 * 1) {
		$scanned_folder = array_values(array_diff(scandir($_SESSION["folder"]), array('..', '.')));
		foreach ($scanned_folder as $file) {
			$file_path = $_SESSION["folder"] . $file;
			unlink($file_path);
		}
		$_SESSION["creation"] = time();
	}
}
?>
<html>
	<head>
		<title>imajur.com - the definitive image uploader</title>
		<!-- you actually know how to pronounce it!!! -->
	<head>
	<style>
		body {
		  background-color: rgb(16,16,16);
		  color: white;
		  font-family: sans-serif;
		}
		label {
		  background-color: indigo;
		  color: white;
		  padding: 0.5rem;
		  font-family: sans-serif;
		  border-radius: 0.3rem;
		  cursor: pointer;
		  margin-top: 1rem;
		}
		#file-chosen{
		  margin-left: 0.3rem;
		  font-family: sans-serif;
		}
		.animage {
		  height: 200px;
		  max-width: 300px;
		  margin: 50px;
		}
		footer {
		  color: gray;
		  text-align: center;
		  padding: 3px;
		  font-size: xx-small;
		}
	</style>
	<script>
		async function script() {
			const actualBtn = document.getElementById('upfile');
			const fileChosen = document.getElementById('file-chosen');
			actualBtn.addEventListener('change', function(){
			  fileChosen.textContent = this.files[0].name;
			})

			document.getElementById("upfile").onchange = function() {
			    setTimeout(function () {
				document.getElementById("form").submit();
			    }, 1000);
			};
		}
	</script>

	<body onload="script();">
		<center><img src="logo.png" width="800px"/>
		
		<h2>Upload now!</h2>
		<form enctype="multipart/form-data" id="form" method="POST">
			<br/>
			<input type="file" accept=".png,.jpg,.gif" id="upfile" name="upfile" hidden/>
			<label for="upfile">Choose File</label>
			<span id="file-chosen">No file chosen</span>
		</form>
<?php
// Picture upload handling
if (isset($_FILES["upfile"])) {
	// Too many files? Just delete one randomly.
	$scanned_folder = array_values(array_diff(scandir($_SESSION["folder"]), array('..', '.')));
	if (count($scanned_folder) > 16) {
		$file_path = $_SESSION["folder"] . $scanned_folder[rand(0, 16)];
		unlink($file_path);
	}

	// Install file to personal folder
	$filename = $_FILES["upfile"]["name"];
	if ($_FILES['upfile']['size'] > 131072 || $_FILES['upfile']['error'] === UPLOAD_ERR_INI_SIZE) {
		echo "Cannot upload files larger than 128KB.";
	} else if (move_uploaded_file($_FILES['upfile']['tmp_name'], $_SESSION["folder"] . $filename)) {
		echo "Your file got uploaded successfully.";
	} else {
		echo "Oops! Something wrong happened with your file and it was lost.";
	}
}
?>
		<br/>
		<br/>
<?php
// Show gallery of uploaded images
	$scanned_folder = array_values(array_diff(scandir($_SESSION["folder"]), array('..', '.')));
	if (count($scanned_folder) > 0) {
		echo "<hr width=\"500px\"/>";
	}
	foreach ($scanned_folder as $file) {
		$file_path = $_SESSION["folder"] . $file;
		echo "<img src=\"$file_path\" class=\"animage\"/>";
	}
?>
		</center>
	</body>
	<footer>
		<p>Terms and conditions: We bear no responsibility if your files get lost, stolen, leaked, vandalized or anything else. Do not upload any confidential information here. Use this free web service at your own risk. All we can guarantee is that you get what you paid for.</p>
	</footer>
</html>
