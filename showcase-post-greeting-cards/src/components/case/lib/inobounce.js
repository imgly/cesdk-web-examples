// Copyright (c) 2013, Lawrence Davis
// All rights reserved.

// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

// 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/*! iNoBounce - v0.2.0
 * https://github.com/lazd/iNoBounce/
 * Copyright (c) 2013 Larry Davis <lazdnet@gmail.com>; Licensed BSD */

// Stores the Y position where the touch started
var startY = 0;
// Stores the X position where the touch started
var startX = 0;

// Store enabled status
var enabled = false;

var supportsPassiveOption = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function () {
      supportsPassiveOption = true;
      // Linter
      return true;
    }
  });
  window.addEventListener('test', null, opts);
} catch (e) {}

var handleTouchmove = function (evt) {
  // Get the element that was scrolled upon
  var el = evt.target;

  // Allow zooming
  var zoom = window.innerWidth / window.document.documentElement.clientWidth;
  if (evt.touches.length > 1 || zoom !== 1) {
    return;
  }

  // Check all parent elements for scrollability
  while (el !== document.body && el !== document) {
    // Get some style properties
    var style = window.getComputedStyle(el);

    if (!style) {
      // If we've encountered an element we can't compute the style for, get out
      break;
    }

    // if the element is a horizontally scrollable element, ignore it
    var overflowX = style.getPropertyValue('overflow-x');
    if (overflowX === 'scroll' || overflowX === 'auto') {
      var curX = evt.touches ? evt.touches[0].screenX : evt.screenX;
      // if scrolling vertically, allow it
      if (curX !== startX) {
        return;
      }
    }

    // Ignore range input element
    if (el.nodeName === 'INPUT' && el.getAttribute('type') === 'range') {
      return;
    }

    var scrolling = style.getPropertyValue('-webkit-overflow-scrolling');
    var overflowY = style.getPropertyValue('overflow-y');
    var height = parseInt(style.getPropertyValue('height'), 10);

    // Determine if the element should scroll
    var isScrollable =
      scrolling === 'touch' && (overflowY === 'auto' || overflowY === 'scroll');
    var canScroll = el.scrollHeight > el.offsetHeight;

    if (isScrollable && canScroll) {
      // Get the current Y position of the touch
      var curY = evt.touches ? evt.touches[0].screenY : evt.screenY;

      // Determine if the user is trying to scroll past the top or bottom
      // In this case, the window will bounce, so we have to prevent scrolling completely
      var isAtTop = startY <= curY && el.scrollTop === 0;
      var isAtBottom =
        startY >= curY && el.scrollHeight - el.scrollTop === height;

      // Stop a bounce bug when at the bottom or top of the scrollable element
      if (isAtTop || isAtBottom) {
        evt.preventDefault();
      }

      // No need to continue up the DOM, we've done our job
      return;
    }

    // Test the next parent
    el = el.parentNode;
  }

  // Stop the bouncing -- no parents are scrollable
  evt.preventDefault();
};

var handleTouchstart = function (evt) {
  // Store the first Y position of the touch
  startY = evt.touches ? evt.touches[0].screenY : evt.screenY;
  startX = evt.touches ? evt.touches[0].screenX : evt.screenX;
};

var enable = function () {
  // Listen to a couple key touch events
  window.addEventListener(
    'touchstart',
    handleTouchstart,
    supportsPassiveOption ? { passive: false } : false
  );
  window.addEventListener(
    'touchmove',
    handleTouchmove,
    supportsPassiveOption ? { passive: false } : false
  );
  enabled = true;
};

var disable = function () {
  // Stop listening
  window.removeEventListener('touchstart', handleTouchstart, false);
  window.removeEventListener('touchmove', handleTouchmove, false);
  enabled = false;
};

var isEnabled = function () {
  return enabled;
};

// Customization: Do not do anything by default.
// // Enable by default if the browser supports -webkit-overflow-scrolling
// // Test this by setting the property with JavaScript on an element that exists in the DOM
// // Then, see if the property is reflected in the computed style
// var testDiv = document.createElement('div');
// document.documentElement.appendChild(testDiv);
// testDiv.style.WebkitOverflowScrolling = 'touch';
// var isScrollSupported =
//   'getComputedStyle' in window &&
//   window.getComputedStyle(testDiv)['-webkit-overflow-scrolling'] === 'touch';
// document.documentElement.removeChild(testDiv);

// if (isScrollSupported) {
//   enable();
// }

// A module to support enabling/disabling iNoBounce
export { enable, disable, isEnabled };
