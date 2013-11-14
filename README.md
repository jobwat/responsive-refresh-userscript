## Responsive refresh userscript

A [userscript](http://userscripts.org/) to assist you in your responsive devs

### Why

Our latest responsive site is partially responsive from the server side rendering.

This script automatically refresh the page with the proper device format, as you resize the page.

### Install

As chrome is slightly painful (they probably got good concerns), you can't install a userscript directly... see http://userscripts.org/about/installing

The trick is too install the [Tampermonkey extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), and then load the script: https://github.com/jobwat/responsive-refresh-userscript/raw/master/responsive-refresh.user.js

### Note

I've started the same project as a [Chrome Extension](https://github.com/jobwat/refresh-on-resize-chrome-extension) first but couldn't get the viewport dimensions, only the window ones.

### Licence

[MIT](http://opensource.org/licenses/MIT)
