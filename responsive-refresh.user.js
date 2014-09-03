// ==UserScript==
// @name        Responsive refresh
// @namespace   http://github.com/frontfoot
// @version     1.0
// @downloadURL https://raw.github.com/jobwat/responsive-refresh-userscript/master/responsive-refresh.user.js
// @description Refresh
// @include     http://localhost:3000/*
// @include     http://*wizardofodds.com.au/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @copyright   2013+, Joseph Boiteau @ FrontFoot, MIT Licence
// ==/UserScript==
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


var prevWidth = $(window).width();
var width = prevWidth;
var timeoutId = 0;

function device(){
    if ( width < 768 ){ return 'mobile'; }
    else if( width < 1024 ){ return 'tablet'; }
   	else { return 'desktop'; }
}

function getUrlVars(url)
{
    var vars = [], hash;
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function updateUrl(url, dev){
    if(!url) url = window.location.href;
    var _device = dev || device();
    var url_vars = getUrlVars(url);
    url_vars['_device'] = _device
    var params = '';
    for (var i = 0; i < url_vars.length; i++)
    {
        params += (i==0) ? '?' : '&';
        params += url_vars[i];
        params += '=';
        params += url_vars[url_vars[i]];
    }
    return url.slice(0, url.indexOf('?')) + params;
}

function resized(){
    var device_is=getUrlVars(window.location.href)['_device'];
    if(device()==device_is){ 
        //console.log('Width=' + width + 'px : Device is already ' + device_is);
        return false;
    }
    else{
        //console.log('Width=' + width + 'px : going', device());
        window.location.href = updateUrl();
    }
}

function forceDevice(dev){
    console.log('force ', dev)
    toggleActive(false);
    window.location.href = updateUrl(undefined, dev);
}

function active(){
    return localStorage.getItem("responsive-refresh-active") == 'true';
}

function toggleActive(state){
    var new_state = (state==false) ? false : !active();
    localStorage.setItem("responsive-refresh-active", new_state);
    $('#auto_refresh')[0].checked = new_state;

    // if toggled get active, act as resized
    if(new_state){ resized(); }
    // re-update links to remove the _device
    updateAllLinks();
}

function insertControlPanel(){
    $(document.body).prepend('<div id="responsive_refresh" style="position: absolute; z-index: 9; background: white; opacity: 0.7; font-size: 10px; line-height: 10px;"></div>');
    $('#responsive_refresh').append($('<input />', { type: 'checkbox', id: 'auto_refresh', checked: active() }));
    $('#responsive_refresh').append($('<label style="cursor: pointer;" for="auto_refresh">auto-refresh</label>'));
    $('#auto_refresh').click(function(event){event.stopPropagation(); toggleActive();});
    $.each(['mobile', 'tablet', 'desktop'], function(i, dev){
        $('#responsive_refresh').append($("<span style=\"margin-left: 5px; cursor: pointer;\" id=\"toggle_"+dev+"\" href=\"#\">"+dev+"</span>"));
	    $("#toggle_"+dev).click(function(event){ console.log('click ', dev); forceDevice(dev);});
    });
}

$(window).resize(function() {
    width = $(window).width();

    // forget if size unchanged
    if (prevWidth == width) { return; }

    // forget if tool inactive
    if(!active()){ return; }

    // don't fire on every events, wait 100ms
    if (timeoutId !== 0) { clearTimeout(timeoutId); }
    timeoutId = setTimeout(function debounced() {
        resized();
        prevWidth = width;
        timeoutId = 0;
    }, 100);
});

function updateAllLinks() {
    var anchorElements = document.getElementsByTagName('a');
    if(active()){
        for (var i in anchorElements) anchorElements[i].href = updateUrl(anchorElements[i].href);
    } else {
        for (var i in anchorElements) anchorElements[i].href = cleanUrl(anchorElements[i].href);
    }
}

if(active()){ resized(); }
insertControlPanel();
updateAllLinks();

