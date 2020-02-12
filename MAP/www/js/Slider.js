/*
 * Coded by kojima@sofrio
 *	2015/12/02
 */

Slider = function(){};

Slider.Setup = function(id,value,slide)
{	'use strict';
	var slider=document.getElementById(id);
	slider.className="slider";
	slider.innerHTML='<div></div><input type="button"/>';
	var rect=slider.getBoundingClientRect();
	var thumb=slider.getElementsByTagName('input')[0];
	var dragging=false;

	var setValue = function(pos){
		thumb.style.left=(pos-thumb.clientWidth/2)+'px';
		slide(pos/slider.clientWidth);
	};
	setValue(value*slider.clientWidth);

	// 目盛り部分をクリックしたとき
	slider.onclick = function(ev){
		dragging=true;
		document.onmousemove(ev);
		dragging=false;
	};
	// ドラッグ開始
	thumb.onmousedown = function(ev){
		dragging=true;
		return false;
	};
	// ドラッグ終了
	document.onmouseup = function(ev){
		dragging=false;
	};
	// ドラッグ
	document.onmousemove = function(ev){
		if(!dragging) return;		
		if(!ev) ev=window.event;
		var left=ev.clientX;
		// マウス座標とスライダーの位置関係で値を決める
		var pos=Math.round(left-rect.left);
		// スライダーからはみ出したとき
		if(pos<0){
			pos = 0;
		} else
		if(pos>slider.clientWidth){
			pos=slider.clientWidth;
		}
		setValue(pos);
		return false;
	};
}
