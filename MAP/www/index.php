<?php
/*
 * Coded by kojima@sofrio.com
 *	2015/11/17
 */
require_once dirname(__FILE__) . '/camera.php';

$player=false;
$debug=1;
$CMS=(get_map_id()==CAMERA_MAP);
$NPTS=(get_map_id()==NUMBER_PLATE);
?>
<!DOCTYPE html>
<html>
<?php if($CMS || $NPTS): ?>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<?php if($CMS): ?>
<title>IoT CMS（音声付）</title>
<?php elseif($NPTS): ?>
<title>NPTS</title>
<?php else: ?>
<title>Invalid request.</title>
<?php endif; ?>
</head>
<body>
<div id="headarea" class="navbar navbar-default navbar-static-top">
	<?php require 'headform.php'?>		
</div>

<div id="map_canvas" style="width:100%; height:100%"></div>

<?php require 'main.php'?>

<script>
(function()
{	'use strict';
<?php if($CMS): ?>
	console.info("Starting IoT Camera Management System...");
<?php else: ?>
	console.info("Starting Number Plate Tracking System...");
<?php endif; ?>
	var playTime=Main.Initialize();

	var $map=$("#map_canvas");
	$map.height($map.height()-$("#headarea").outerHeight());

	var lat= 35.681382;	//東京駅八重洲口
	var lng=139.766084;	//東京駅八重洲口
	var zoom=13;							
	Main.CreateMap($map,lat,lng,zoom);
	
	Main.cameraManager=new CameraManager((playTime!=0),playTime,$("#now-time"));
	Main.cameraManager.Start();
}());
</script>
</body>
<?php else: ?>
<head>
<meta http-equiv="refresh" content="0; URL='$index.htm'" />
</head>
<?php endif; ?>
</html>
<head>



