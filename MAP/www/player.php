<?php
/*
 * Coded by kojima@sofrio.com
 *	2015/11/07
 */
require_once dirname(__FILE__) . '/camera.php';

$player=true;
$debug=1;
$jQuery_slider=false;
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

<?php
$cameraID=$_GET['id'];
if (!$cameraID) {
    echo "カメラのIDを指定して下さい";
    exit;
}
$movieHost=get_movie_host($cameraID);
if(!$movieHost){
	echo "カメラID $cameraID は登録されていません。";
	exit;
}
$movieURL="http://$movieHost/";
?>

<title>カメラ #<?=$cameraID;?> 再生（音声付）</title>
</head>
<body>
<div id="headarea" class="navbar navbar-default navbar-static-top">
	<?php require 'headform.php'?>		
</div>
<div style="background-color:#000;text-align:center;">
    <img src="./img/loading.gif" id="loading" width="50" style="position:absolute; top:100px; left:30px;" />
	<canvas id="canvas" width="640" height="480" style="margin:auto;"></canvas>
</div>
<table align=center width="100%" id="controls">
  <tr>
	<td width="28">
	  <img src="./img/sound.jpg"/ width="24">
	</td><td width="36">
      <div id="volume"></div>
	</td><td align=center>
	  <a href="javascript:void(0)" id="bwd"  ><img src="./img/bwd.png"   width="50" /></a>
	  <a href="javascript:void(0)" id="pause"><img src="./img/pause.png" width="50" /></a>
	  <a href="javascript:void(0)" id="fwd"  ><img src="./img/fwd.png"   width="50" /></a>
	</td>
	<td width="64">
	  <button id="sound" class="btn btn-default"></button>
	</td>
  </tr>
</table>

<?php require 'main.php'?>

<script>
(function()
{	'use strict';
	Main.cameraID=<?=$cameraID;?>;		
	console.info("Starting YO Camera player for camera #"+Main.cameraID+"...");	
	var playTime=Main.Initialize();
	
	var $ctrl=$("#controls");
	var $sound=$("#sound",$ctrl);
	Main.cameraManager=new CameraManager((playTime!=0),playTime,$("#now-time"));
	Main.cameraManager.SetPlayer(Main.cameraID,"<?=$movieURL;?>",$("#canvas"),$sound,$("#loading"));
	Main.cameraManager.Start();

	var mute=(Main.args['mute'] && Main.args['mute']=="true");
	Main.cameraManager.SetMute(Main.cameraID,mute);			
	Main.SetSoundButton(Main.cameraID,true);

	var volume=(Main.args['volume'])?Main.args['volume']:1;			
<?php if($jQuery_slider): ?>
	$("#volume").slider({
		orientation: "horizontal",
		range: "min",
		min: 0,
		max: 100,
		value: 100*volume,
		slide: function(event,ui){
			'use strict';
			Main.cameraManager.SetVolume(ui.value/100);
		}
	});
<?php else: ?>
	Slider.Setup("volume",volume,function(value){
		'use strict';
		Main.cameraManager.SetVolume(value);
	});
<?php endif; ?>
	InfoWindow.SetupControls($("#bwd",$ctrl),$("#pause",$ctrl),$("#fwd",$ctrl),$sound,Main.cameraID);
}());
</script>
</body>
</html>
