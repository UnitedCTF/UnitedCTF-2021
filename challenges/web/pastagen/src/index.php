<!DOCTYPE html>
<html>

<head>
  <meta charset='utf-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <title>Cool Pasta Generator</title>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Comic%20Sans%20MS" />
  <style>
    html {
      background-color: #d9bd62;
      background-image: url("./wowe.png");
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: bottom right;
      font-family: 'Comic Sans MS';
    }

    .colors {
      text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;
    }
  </style>
  <script>
    window.addEventListener("DOMContentLoaded", () => {
      const elements = document.querySelectorAll(".colors");
      const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "purple"];
      for (let el of elements)
        el.innerHTML = 
          el.textContent.split(" ")
            .map((s, i) => `<span style="color: ${colors[i % colors.length]};">${s}</span>`)
            .join(" ");
    })
  </script>
</head>

<body>
  <h1 class="colors">Cool Pasta Generator</h1>
  <h4 class="colors">Please select a pasta from our curated list and spam away ! ! !</h4>
  <form method="GET" action="/">
    <select name="pasta">
      <?php
      // FLAG-THAT_IS_NOT_A_COPYPASTA
      $files = scandir("./pastas");
      $selected = isset($_GET["pasta"]) ? $_GET["pasta"] : "";
      for ($i = 2; $i < count($files); $i++) {
        echo "<option value='./pastas/" . $files[$i] . "'" . ($selected == "./pastas/".$files[$i] ? "selected" : "") . ">";
        echo substr($files[$i], 0, -4);
        echo "</option>";
      }
      ?>
    </select>
    <input type="submit" />
  </form>
  <?php
  if (isset($_GET["pasta"]) && $_GET["pasta"]) {
    // avoid an infinite loop
    $pasta = $_GET["pasta"];
    $_GET["pasta"] = null;

    echo "<pre>";
    include($pasta);
    echo "</pre>";
  }
  ?>
</body>

</html>