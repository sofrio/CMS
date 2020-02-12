<?php
/*
 * Coded by kojima@sofrio.com
 *	2015/11/29
 */
$local=false;
?>
<?php if($debug>0): ?>
<p id="debug-info">
image: <span id="image"></span><br>
sound: <span id="sound"></span>
</p>
<?php endif; ?>
<script>
	document.getElementById("debug-info").style.visibility="hidden";
</script>

<?php if($local): ?>
	<style type="text/css">
	<?php require './lib/bootstrap.min.css'?>		
	<?php require './lib/bootstrap-theme.min.css'?>		
	</style>		
	<script>
	<?php require './lib/jquery.min.js'?>		
	<?php require './lib/bootstrap.min.js'?>
	</script>		
<?php else: ?>
	<?php if($debug): ?>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.css">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.js"></script>
	<?php else: ?>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
	<?php endif; ?>
<?php endif; ?>
<?php if($player): ?>
	<?php if($jQuery_slider): ?>
		<!-- Appended by kojima@sofrio.com on 2015/11/09 for slider control of Player -->
		<link rel="stylesheet" href="http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css" />
		<script src="http://code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
		<!-- End of appended -->
	<?php endif; ?>
<?php else: ?>
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB9t7Y9gB7ZQws8Spi1gKpNOsrLoc0TbBI"></script>
<?php endif; ?>

<style type="text/css">
    html { height:100%; }
    body { height:100%; margin:0; padding:0; }
    #headarea { margin-bottom:0px; }
    .gm-style-iw {
		overflow: hidden ! important;
	}
	.gm-style-iw div {
		overflow: hidden ! important;
	}
</style>

<?php
if(!isset($debug)) $debug=0;
function getBrowser()
{
	$ua=$_SERVER["HTTP_USER_AGENT"];
	if(strstr($ua,"MSIE")) return "'ie'";
	if(strstr($ua,"Trident/7")) return "'ie'";
	if(strstr($ua,"Chrome"   )) return "'chrome'";
	if(strstr($ua,"Firefox"  )) return "'firefox'";
	return "'unknown'";
}
$browser=getBrowser();
function getMobile()
{
	$ua=$_SERVER["HTTP_USER_AGENT"];
	return (strstr($ua,"iphone") || strstr($ua,"ipad") || strstr($ua,"android") || strstr($ua,"windows phone"))?"true":"false";
}
$is_mobile=getMobile();
$args=implode(',',$_POST);
$test=($_GET['q'])?"true":"false";
?>

<script>
Main = function(){};
Main.DEBUG			= <?=$debug;?>;
Main.BROWSER		= <?=$browser;?>;
Main.IS_MOBILE		= <?=$is_mobile;?>;
<?php if($player): ?>
Main.IS_PLAYER		= true;
<?php else: ?>
Main.IS_PLAYER		= false;
<?php endif; ?>
Main.RELOAD_ARGS	= '<?=$args;?>';
Main.IS_RELOAD		= (Main.RELOAD_ARGS!='');
Main.TRACK_TEST		= <?=$test;?>;
</script>

<?php if($debug): ?>
	<script src="./js/Headform.js"></script>
	<script src="./js/CameraManager.js"></script>
	<script src="./js/Camera.js"></script>
	<script src="./js/InfoWindow.js"></script>
	<script src="./js/MoviePlayer.js"></script>
	<script src="./js/SoundPlayer.js"></script>
	<script src="./js/Util.js"></script>
	<script src="./js/Main.js"></script>	
	<?php if($player && !$jQuery_slider): ?>
		<link rel="stylesheet" href="./js/Slider.css">
		<script src="./js/Slider.js"></script>
	<?php endif; ?>
<?php else: ?>
<script>
/* YO Camera demo system, coded by kojima@sofrio.com on 2015/11-12. */
	<?php require './js/Headform.min.js'?>		
	<?php require './js/CameraManager.min.js'?>		
	<?php require './js/Camera.min.js'?>	
	<?php require './js/InfoWindow.min.js'?>	
	<?php require './js/MoviePlayer.min.js'?>	
	<?php require './js/SoundPlayer.min.js'?>	
	<?php require './js/Util.min.js'?>
	<?php require './js/Main.min.js'?>
</script>	
	<?php if($player && !$jQuery_slider): ?>
		<style type="text/css">
		<?php require './js/Slider.min.css'?>		
		</style>
		<script>
		<?php require './js/Slider.min.js'?>				
		</script>		
	<?php endif; ?>	
<?php endif; ?>
