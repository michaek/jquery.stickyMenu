/*
 * jQuery Sticky Menu Plugin v0.1
 * http://
 *
 * Copyright (c) 2010 Bearded Studio LLC
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 * 
 * Depends on:
 * jQuery Sticky http://github.com/michaek/jquery.sticky
 * jQuery Address http://www.asual.com/jquery/address/
 */
(function($){
  $.fn.stickyMenu = function(options){
    options = $.extend({
      containedBy: null,  // dom element that restricts scrolling of navigation
      activeClass: 'active'
    }, options);
    
    // loop over the selected elements
    this.each(function(){
      var $stickyMenu = $(this);
      var $stickyLinks = $stickyMenu.find('a');

      // we'll keep track of whether we just clicked the menu
      var listenForScroll = false;
      $stickyLinks.click(function(){ listenForScroll = false; });

      var activateLinksOnScroll = function(){
        var scrollOffset = $(this).scrollTop();
        var $active = null;
        var $activeLink = null;

        // since we're scrolling, we should listen for scrolling!
        listenForScroll = true;

        // we want to get the active link, but this is not the efficient way!
        // TODO: optimize even just a little
        $stickyLinks.each(function(){
          var $link = $(this);
          
          var $target = $($link.attr('href'));
          if ($target.length) {
            // ignore everything that's beyond the current scroll
            if ($target.offset().top > scrollOffset) {
              return;
            }
            // if this target is further down the page than a previous target, use it
            if (!$active || $target.offset().top > $active.offset().top) {
              $active = $target;
              $activeLink = $link;
            }
          }
        });
        
        // update address with the current value
        if ($active) {
          $.address.value($activeLink.attr('href').replace(/^#/, ''));
        }
      }
      
      // on the change event for address
      $.address.change(function(event) {
        var targetSelector = event.path.replace(/^\//, '#');
        var $target = $(targetSelector);
        var $link = $stickyLinks.filter('[href='+targetSelector+']');
        $stickyLinks.removeClass(options.activeClass);
        $link.addClass(options.activeClass);
        
        // only start scrolling if we're not listening for scrolling
        if (!listenForScroll) {
          // unbind the scroll function to avoid conflicts
          $(window).unbind('scroll', activateLinksOnScroll);
          // scroll to the target element
          $('body').animate({scrollTop: $target.offset().top}, 250, function(){
            // re-bind the scroll function when the animation has completed
            $(window).scroll(activateLinksOnScroll);
          });
        }
      });
      
      // invoke sticky on the menu
      $stickyMenu.sticky({containedBy: options.containedBy});
      // invoke address on our menu links
      $stickyLinks.address();
      
      // listen to the scroll to activate menu links
      $(window).scroll(activateLinksOnScroll);

    });
  }
})(jQuery);
