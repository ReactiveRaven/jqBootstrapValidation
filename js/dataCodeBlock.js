/* jshint jquery:true */
/* Author: Dave Rupert 
*  License: WTFPL
----------------------*/

(function($){
  'use strict';

  $.fn.dataCodeBlock = function(){
  
    // Yoinked from Prototype.js
    var escapeHTML = function( code ) {
        return code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    };
    
    return $('[data-codeblock]').each(function(){
      var target = $(this).data('codeblock');
      var html = $(this).clone().removeAttr('data-codeblock')[0].outerHTML;
      var codeblock = $('<pre class="prettyprint linenums well well-small">');
      
      codeblock.append( escapeHTML(html) );
      
      if(target) {
        $(target).append(codeblock);
      } else {
        $(this).after(codeblock);
      }      
    });
  
  };

  // Self Execute!!
  $.fn.dataCodeBlock();
})(jQuery);