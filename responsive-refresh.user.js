// ==UserScript==
// @name        Responsive refresh
// @namespace   http://github.com/frontfoot
// @version     0.1
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


var REGEXP=new RegExp('[&\?]?_device=([a-z]+)');
var prevWidth = $(window).width();
var width = prevWidth;
var timeoutId = 0;

function device(){
    if ( width < 768 ){ return 'mobile'; }
    else if( width < 1024 ){ return 'tablet'; }
    else { return 'desktop'; }
}

function newUrl(){
    var clean_url = window.location.href;
    console.log('newUrl', window.location.href);
    if ( window.location.href.match(REGEXP) ){ clean_url=window.location.href.replace(REGEXP,'') }
    var delimiter = clean_url.match(/[?=]/) ? '&' : '?';
    return clean_url + delimiter + '_device=' + device();
}

function resized(){
    var device_is=(match=window.location.href.match(REGEXP))?match[1]:undefined;
    if(device()==device_is){
        console.log('Width=' + width + 'px : Device is already ' + device_is);
    }
    else{
        var new_url = newUrl();
        console.log('Width=' + width + 'px : going', device(), new_url);
        window.location.href = new_url;
    }
}

function active(){
    return localStorage.getItem("responsive-refresh-active") == 'true';
}

function toggleActive(){
    new_state = !active();
    localStorage.setItem("responsive-refresh-active", new_state);
    $('#auto_refresh')[0].checked = new_state;

    // if toggled active, act as resized
    if(new_state){ resized(); }
}

function insertControlPanel(){
    $(document.body).prepend('<div id="responsive_refresh" style="position: absolute; background: white; opacity: 0.7; font-size: 10px; line-height: 10px;"></div>');
    $('#responsive_refresh').append($('<input />', { type: 'checkbox', id: 'auto_refresh', checked: active() }));
    $('#responsive_refresh').append($('<label for="auto_refresh">auto-refresh</label>'));
    $('#auto_refresh').click(function(event){event.stopPropagation(); toggleActive();});
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

insertControlPanel();

