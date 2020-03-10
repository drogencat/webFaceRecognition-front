/*!
* www.jq22.com
*/(function(root,factory){'use strict';if(typeof define==='function'&&define.amd){define([],factory);}else if(typeof exports==='object'){module.exports=factory();}else{root.viewportUnitsBuggyfill=factory();}}(this,function(){'use strict';var initialized=false;var options;var isMobileSafari=/(iPhone|iPod|iPad).+AppleWebKit/i.test(window.navigator.userAgent);var viewportUnitExpression=/([+-]?[0-9.]+)(vh|vw|vmin|vmax)/g;var forEach=[].forEach;var dimensions;var declarations;var styleNode;var isOldInternetExplorer=false;function debounce(func,wait){var timeout;return function(){var context=this;var args=arguments;var callback=function(){func.apply(context,args);};clearTimeout(timeout);timeout=setTimeout(callback,wait);};}
function inIframe(){try{return window.self!==window.top;}catch(e){return true;}}
function initialize(initOptions){if(initialized){return;}
if(initOptions===true){initOptions={force:true};}
options=initOptions||{};options.isMobileSafari=isMobileSafari;if(!options.force&&!isMobileSafari&&!isOldInternetExplorer&&(!options.hacks||!options.hacks.required(options))){return;}
options.hacks&&options.hacks.initialize(options);initialized=true;styleNode=document.createElement('style');styleNode.id='patched-viewport';document.head.appendChild(styleNode);importCrossOriginLinks(function(){var _refresh=debounce(refresh,options.refreshDebounceWait||100);window.addEventListener('orientationchange',_refresh,true);window.addEventListener('pageshow',_refresh,true);if(options.force||isOldInternetExplorer||inIframe()){window.addEventListener('resize',_refresh,true);options._listeningToResize=true;}
options.hacks&&options.hacks.initializeEvents(options,refresh,_refresh);refresh();});}
function updateStyles(){styleNode.textContent=getReplacedViewportUnits();}
function refresh(){if(!initialized){return;}
findProperties();setTimeout(function(){updateStyles();},1);}
function findProperties(){declarations=[];forEach.call(document.styleSheets,function(sheet){if(sheet.ownerNode.id==='patched-viewport'||!sheet.cssRules){return;}
if(sheet.media&&sheet.media.mediaText&&window.matchMedia&&!window.matchMedia(sheet.media.mediaText).matches){return;}
forEach.call(sheet.cssRules,findDeclarations);});return declarations;}
function findDeclarations(rule){if(rule.type===7){var value=rule.cssText;viewportUnitExpression.lastIndex=0;if(viewportUnitExpression.test(value)){declarations.push([rule,null,value]);options.hacks&&options.hacks.findDeclarations(declarations,rule,null,value);}
return;}
if(!rule.style){if(!rule.cssRules){return;}
forEach.call(rule.cssRules,function(_rule){findDeclarations(_rule);});return;}
forEach.call(rule.style,function(name){var value=rule.style.getPropertyValue(name);viewportUnitExpression.lastIndex=0;if(viewportUnitExpression.test(value)){declarations.push([rule,name,value]);options.hacks&&options.hacks.findDeclarations(declarations,rule,name,value);}});}
function getReplacedViewportUnits(){dimensions=getViewport();var css=[];var buffer=[];var open;var close;declarations.forEach(function(item){var _item=overwriteDeclaration.apply(null,item);var _open=_item.selector.length?(_item.selector.join(' {\n')+' {\n'):'';var _close=new Array(_item.selector.length+1).join('\n}');if(!_open||_open!==open){if(buffer.length){css.push(open+buffer.join('\n')+close);buffer.length=0;}
if(_open){open=_open;close=_close;buffer.push(_item.content);}else{css.push(_item.content);open=null;close=null;}
return;}
if(_open&&!open){open=_open;close=_close;}
buffer.push(_item.content);});if(buffer.length){css.push(open+buffer.join('\n')+close);}
return css.join('\n\n');}
function overwriteDeclaration(rule,name,value){var _value=value.replace(viewportUnitExpression,replaceValues);var _selectors=[];if(options.hacks){_value=options.hacks.overwriteDeclaration(rule,name,_value);}
if(name){_selectors.push(rule.selectorText);_value=name+': '+_value+';';}
var _rule=rule.parentRule;while(_rule){_selectors.unshift('@media '+_rule.media.mediaText);_rule=_rule.parentRule;}
return{selector:_selectors,content:_value};}
function replaceValues(match,number,unit){var _base=dimensions[unit];var _number=parseFloat(number)/100;return(_number*_base)+'px';}
function getViewport(){var vh=window.innerHeight;var vw=window.innerWidth;return{vh:vh,vw:vw,vmax:Math.max(vw,vh),vmin:Math.min(vw,vh)};}
function importCrossOriginLinks(next){var _waiting=0;var decrease=function(){_waiting--;if(!_waiting){next();}};forEach.call(document.styleSheets,function(sheet){if(!sheet.href||origin(sheet.href)===origin(location.href)){return;}
_waiting++;convertLinkToStyle(sheet.ownerNode,decrease);});if(!_waiting){next();}}
function origin(url){return url.slice(0,url.indexOf('/',url.indexOf('://')+3));}
function convertLinkToStyle(link,next){getCors(link.href,function(){var style=document.createElement('style');style.media=link.media;style.setAttribute('data-href',link.href);style.textContent=this.responseText;link.parentNode.replaceChild(style,link);next();},next);}
function getCors(url,success,error){var xhr=new XMLHttpRequest();if('withCredentials'in xhr){xhr.open('GET',url,true);}else if(typeof XDomainRequest!=='undefined'){xhr=new XDomainRequest();xhr.open('GET',url);}else{throw new Error('cross-domain XHR not supported');}
xhr.onload=success;xhr.onerror=error;xhr.send();return xhr;}
return{version:'0.4.1',findProperties:findProperties,getCss:getReplacedViewportUnits,init:initialize,refresh:refresh};}));