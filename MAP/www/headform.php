<?php
/*
 * Coded by kojima@sofrio.com
 *	2015/11/23
 */
$settings=true;
?>

<form action="" id="head-form" class="navbar-form navbar-right">
	<span id="alert" style="position:absolute; left:4px; top:30px; color:red; font-weight:bold;">Javascriptが禁止された状態では動作しません。</span>
	<script>document.getElementById("alert").innerHTML="";</script>
	&nbsp;
	<input type="checkbox" id="detect"> 検出
	&nbsp;
	<select name='y'></select> / <select name='m'></select> / <select name='d'></select>
	&nbsp;
	<select name='h'></select> : <select name='i'></select> : <select name='s'></select>
	&nbsp;
	<input id="time-btn" type="button" value="指定時刻に移動" />
	&nbsp;
	<span id="now-time"></span>	
	&nbsp;
	<input id="now-btn" type="button" value="現在時刻に移動" />
	&nbsp;
<?php if($settings): ?>
	<?php if($player): ?>
		<!--a href="javascript:window.open('/setup.php?id=<?=$cameraID;?>', 'setup', 'menubar=no, toolbar=no, scrollbars=yes');"><img src="./img/settings.png" width="20" title="設定"/></a-->
	<?php else: ?>
		<a href="javascript:window.open('settings.php', 'setup', 'menubar=no, toolbar=no, scrollbars=yes');"><img src="./img/settings.png" width="20" title="設定"/></a>
	<?php endif; ?>
	&nbsp;
<?php endif; ?>
</form>
<script>
	document.getElementById("head-form").style.visibility="hidden";
</script>

