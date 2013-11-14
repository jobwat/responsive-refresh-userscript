// ==UserScript==
// @name        Responsive refresh
// @namespace   http://github.com/frontfoot
// @version     0.1
// @description Refresh
// @match       http://localhost:3000/*
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



// a function that loads jQuery and calls a callback function when jQuery has finished loading
// thx http://stackoverflow.com/questions/2246901/how-can-i-use-jquery-in-greasemonkey-scripts-in-google-chrome
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
  // Note, jQ replaces $ to avoid conflicts.
  //console.log("There are " + jQ('a').length + " links on this page.");  
 
  var REGEXP=new RegExp('[&\?]?_device=([a-z]+)');

  function guessDeviceFromWidth(width){
    if ( width < 768 ){ return 'mobile'; }
    else if( width < 1024 ){ return 'tablet'; }
    else { return 'desktop'; }
  }

  function newUrl(device){
    var clean_url = window.location.href;
    if ( window.location.href.match(REGEXP) ){ clean_url=window.location.href.replace(REGEXP,'') }
    var delimiter = clean_url.match(/[?=]/) ? '&' : '?';
    return clean_url + delimiter + '_device=' + device;
  }

  function resized(width){
    //console.log('resizeD ', width);
      
    var device_should = guessDeviceFromWidth(width);
    var device_is=(match=window.location.href.match(REGEXP))?match[1]:undefined;
    if(device_should==device_is){ 
      //console.log('Width=' + width + 'px : Device is already ' + device_is);
    }
    else{
      console.log('Width=' + width + 'px : going', device_should);
      window.location = newUrl(device_should);
    }

  }
    
  var prevWidth = $(window).width();
  var timeoutId = 0;
  $(window).resize(function() {
    var width = $(window).width();
    if (prevWidth == width) {
        console.log('same width', width, ', return'); // never occur..?
		return;
	}
    //console.log('resize ', width);
    if (timeoutId !== 0) {
	  clearTimeout(timeoutId);
	}
	timeoutId = setTimeout(function debounced() {
		resized(width);
		prevWidth = width;
		timeoutId = 0;
	}, 100);
  });
}


// load jQuery and execute the main function
addJQuery(main);

