/*
 * Coded by kojima@sofrio
 *	2015/11/04
 */
/* 未使用
function GetBrowser(version)
{	'use strict';
	var ua=window.navigator.userAgent.toLowerCase();
	if(ua.indexOf("msie")>=0){
		if(version){
			var ver = window.navigator.appVersion.toLowerCase();
			if(ver.indexOf("msie 6." )>=0) return 'ie6' ;
			if(ver.indexOf("msie 7." )>=0) return 'ie7' ;
			if(ver.indexOf("msie 8." )>=0) return 'ie8' ;
			if(ver.indexOf("msie 9." )>=0) return 'ie9' ;
			if(ver.indexOf("msie 10.")>=0) return 'ie10';
		} else {
			return 'ie';
		}
	}
	if(ua.indexOf('trident/7')>=0) return (version)?'ie11':'ie';
	if(ua.indexOf('chrome'   )>=0) return 'chrome' ;
	if(ua.indexOf('safari'   )>=0) return 'safari' ;
	if(ua.indexOf('opera'    )>=0) return 'opera'  ;
	if(ua.indexOf('firefox'  )>=0) return 'firefox';
	return 'unknown';
}

function IsMobile()
{	'use strict';
	var ua=navigator.userAgent.toLowerCase();
	return ua.indexOf('iphone')>=0 || ua.indexOf('ipad')>=0 || ua.indexOf('android')>=0 || ua.indexOf('windows phone')>=0;
}
*/
function CheckSystem()
{	'use strict';
    if(!window.HTMLCanvasElement){
		alert("このブラウザでは動画を再生できません。");
		return true;
	}
    try{
	//	if(IsMobile()) throw "mobile";
		if(!window.HTMLAudioElement) throw "no implement";
		var audio=new Audio();
		audio=null;
	}
	catch(e){
		alert("このブラウザでは音声を再生できません。("+e+")");
		return true;
	}
	return false;
}

function ParseQuery(query)
{	'use strict';
	if(!query){	
		var query=window.location.search.slice(1);
		query=decodeURIComponent(query);
	}
	query=DecodeQuery(query);
	
	var args=[];
	var hash=query.split('&'); 	   
	var n=hash.length;
	for(var i=0;i<n;i++){
		var pair=hash[i].split('=');
		args[pair[0]]=pair[1];
	}
	return args;
}

function MakeQuery(args)
{	'use strict';
	var query='',glue='';
	for(var key in args){
		query+=glue+key+'='+args[key];
		glue='&';
	}
	return EncodeQuery(query);
}

function EncodeQuery(query)
{	'use strict';
	return query.replace(/\s/g,"+");	// ' ' => '+'	
}

function DecodeQuery(query)
{	'use strict';
	return query.replace(/\+/g," ");	// '+' => ' '
}
/* 未使用
function GetCookie(key)
{	'use strict';
	key+="=";
	var cookie=document.cookie+";";
	var start=cookie.indexOf(key);
	if(start>=0){
		var end=cookie.indexOf(";",start);
		return unescape(cookie.substring(start+key.length,end));
	}
	return null;
}

function PutCookie(key,data,exp)
{	'use strict';
//	if(typeof(exp)==='undefined') exp=24*60*60*1000;
//	var date=new Date();
//	date.setTime(date.getTime()+exp);
	document.cookie=key+"="+escape(data)+";";//+"expires="+date.toGMTString();
}

function ClearCookie(key)
{	'use strict';
	if(key){
		document.cookie=key+";expires="+new Date(0).toGMTString();	
		document.cookie=key+"=;expires="+new Date(0).toGMTString();	
	} else {
		var cookies=document.cookie.split(';');
		var n=cookies.length;
		for(var i=0;i<n;i++){
			var pair=cookies[i].split('=');
			if(pair[0]) ClearCookie(pair[0]);
		}
	}
}
*/

function LocalDate(ms)
{	'use strict';
	var date=new Date(ms);
	return {
		YY:date.getFullYear(),
		MM:date.getMonth()+1,
		DD:date.getDate(),
		hh:date.getHours(),
		mm:date.getMinutes(),
		ss:date.getSeconds()
	};
}

function FormatDate(ms)
{	'use strict';
	var date=new Date(ms);
	return {
		YY:date.getFullYear(),
		MM:("0"+(date.getMonth()+1)).slice(-2),
		DD:("0"+ date.getDate()    ).slice(-2),
		hh:("0"+ date.getHours()   ).slice(-2),
		mm:("0"+ date.getMinutes() ).slice(-2),
		ss:("0"+ date.getSeconds() ).slice(-2)
	};
}

function DateStr(date)
{
	var date=FormatDate(ms)
	return date.YY+"/"+date.MM+"/"+date.DD+" "+date.hh+":"+date.mm+":"+date.ss
}

function TimeStr(ms)
{
	var date=FormatDate(ms)
	return date.hh+":"+date.mm+":"+date.ss
}

function NowStr()
{
	return TimeStr(new Date().getTime())
}

function IsEmpty(obj)
{	'use strict';
	for(var key in obj){
		return false;
	}
	return true;
}
/* 未使用
function GetElementCount(obj)
{	'use strict';
	var n=0;
	for(var key in obj){
		n++;
	}
	return n;
}
*/
// OrderedList...

OrderedListElement = function(key,data){
	'use strict';
	this.next=null;
	this.key =key;
	this.data=data;
};

OrderedList = function(noDup){
	'use strict';
	this.noDup=noDup;
    this.first=null;
    this.last =null;
	this.found=null;
	this.inserted=null;
};

OrderedList.prototype.find = function(key)
{	'use strict';
	var start=(this.found && this.found.key<=key)?this.found:this.first;		
	for(var e=start;e;e=e.next){
		if(e.key==key) return (this.found=e).data;
		if(e.key> key) break;
	}
	return null;
}
/* 未使用
OrderedList.prototype.find_lss = function(key)
{	'use strict';
	var start=(this.found && this.found.key<key)?this.found:this.first;		
	var prev=null;
	for(var e=start;e;prev=e,e=e.next){
		if(e.key>=key) return this.found=prev;
	}
	return prev;
}
*/
OrderedList.prototype.find_leq = function(key)
{	'use strict';
	var start=(this.found && this.found.key<=key)?this.found:this.first;		
	var prev=null;
	for(var e=start;e;prev=e,e=e.next){
		if(e.key>key) return this.found=prev;
	}
	return prev;
}
/* 未使用
OrderedList.prototype.find_geq = function(key)
{	'use strict';
	var start=(this.found && this.found.key<=key)?this.found:this.first;		
	for(var e=start;e;e=e.next){
		if(e.key>=key) return this.found=e;
	}
	return null;
}

OrderedList.prototype.find_gtr = function(key)
{	'use strict';
	var start=(this.found && this.found.key<key)?this.found:this.first;		
	for(var e=this.first;e;e=e.next){
		if(e.key>key) return this.found=e;
	}
	return null;
}
*/
OrderedList.prototype.shift = function()
{	'use strict';
	var elem=this.first;
	if(elem) this.first=elem.next;
	if(this.last    ==elem) this.last    =null;
	if(this.found   ==elem) this.found   =null;
	if(this.inserted==elem) this.inserted=null;
	return elem;
}

OrderedList.prototype.insert = function(key,data)
{	'use strict';
	var elem=new OrderedListElement(key,data);
	if(!this.first){
		if(this.last){
			console.error("OrderedList may be broken! first==null && last!=null");
			debugger;
		}
		this.first=elem;
		this.last =elem;
		return this.inserted=elem;
	}
	if(!this.last){
		console.error("OrderedList may be broken! first!=null && last==null");
		debugger;
	}
	if(this.last.key<=elem.key){
		if(this.noDup && this.last.key==elem.key) return this.last;
		this.last.next=elem;
		this.last=elem;
		return this.inserted=elem;
	}
	var prev=(this.inserted && this.inserted.key<elem.key)?this.inserted:null;
	for(var e=(prev)?prev.next:this.first;e;prev=e,e=e.next){
		if(elem.key<=e.key){
			if(this.noDup && elem.key==e.key) return e;
			if(prev) prev.next =elem;
			else	 this.first=elem;
			elem.next=e;
			return this.inserted=elem;
		}
	}
	console.error("OrderedList may be broken! last not chained from first.");
	debugger;
	return this.inserted=elem;
}
/* 未使用
OrderedList.prototype.pick = function(key)
{	'use strict';
	if(this.first && key<this.first.key) return null;
	var prev=null;
	for(var e=this.first;e;prev=e,e=e.next){
		if(e.key==key){
			if(prev) prev.next =e.next;
			else	 this.first=e.next;
			if(this.found   ==e) this.found   =null;
			if(this.inserted==e) this.inserted=null;
			return e.data;
		}
		if(e.key>key) break;
	}
	return null;
}
*/

/* 未使用

// BidirList...

BidirListElement = function(obj){
	'use strict';
	this.next=null;
	this.prev=null;
	this.obj=obj;
};

BidirList = function(){
	'use strict';
    this.first=null;
    this.last =null;
    this.count=0;
};

BidirList.prototype.push = function(elem)
{	'use strict';
	elem.next=null;
	elem.prev=this.last;
	if(!this.first){
		if(this.last){
			console.error("BidirList may be broken! first==null && last!=null");
			debugger;
		}
		this.first=elem;
	} else {
		if(!this.last){
			console.error("BidirList may be broken! first!=null && last==null");
			debugger;
		}
		this.last.next=elem;
	}
	this.last=elem;
	this.count++;
	return elem;
}

BidirList.prototype.shift = function()
{	'use strict';
	return this.remove(this.first);
}

BidirList.prototype.remove = function(elem)
{	'use strict';
	if(elem==this.first){
		if(elem.prev){
			console.error("BidirList may be broken! elem.prev!=null");
			debugger;
		}
		this.first=elem.next;
	} else {
		if(!elem.prev){
			console.error("BidirList may be broken! elem.prev==null");
			debugger;
		}
		elem.prev.next=elem.next;		
	}
	if(elem==this.last){
		if(elem.next){
			console.error("BidirList may be broken! elem.next!=null");
			debugger;
		}
		this.last=elem.prev;
	} else {
		if(!elem.next){
			console.error("BidirList may be broken! elem.next==null");
			debugger;
		}
		elem.next.prev=elem.prev;		
	}
	this.count--;
	return elem;
}

// Pool...

Pool = function(type){
	'use strict';
	this.type=type;
    this.inuse=new BidirList;
    this.avail=new BidirList;
};

Pool.prototype.alloc = function()
{	'use strict';
	var elem
	if(this.avail.count>0){
		elem=this.avail.shift();
	} else {
		elem=new BidirListElement(new this.type);
	}
	this.inuse.push(elem);
//	this.log();
	return elem;
}

Pool.prototype.free = function(elem)
{	'use strict';
	if(!(elem instanceof BidirListElement)) return null;
	if(!(elem.obj instanceof this.type)) return null;
	this.inuse.remove(elem);
	this.avail.push(elem);
//	this.log();
	return elem;
}

Pool.prototype.log = function()
{
	console.log("Pool("+this.type+"): #inuse="+this.inuse.count+", #avail="+this.avail.count);
}

*/
