<html>
  <head>
    <script language="JavaScript" type="text/javascript" src="operator/jquery-1.4.2.min.js"></script>
    <script language="JavaScript" type="text/javascript">
      $(document).keydown(function(e) {
        $("#a").get(0).innerHTML += '|'+e.keyCode;
      });
    </script>
  </head>
  <body>
    <div id="a"></div>
  </body>
</html>

