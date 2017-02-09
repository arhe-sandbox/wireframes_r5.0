(function (app, $) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.placeholder");
    ns.applyPlaceholder = function () {
        if (!$.support.placeholder) {
            $("input[placeholder]").placeholder();
        }
    };
    /* */

    ns.clearPlaceholder = function (elementSelector) {
        if (!$.support.placeholder) {
            $(elementSelector).data('placeholding', false).removeClass("active-placeholder"); //.unbind('focus').unbind('blur');
        }
    };


} (EXCHANGE, jQuery));

/* PLACEHOLDER PLUGIN */

(function ($) {
    var blurFunction = function() {
        if ($(this).val() === "") {
            var text = $(this).attr("placeholder");
              if ($.browser.msie && parseInt($.browser.version, 10) !== 9)
            $(this).data("placeholding", true).addClass("active-placeholder").val(text);
        }
    };

$.fn.placeholder = function ()
{
	return $(this).each(function () {
		
		var placeholderText = $(this).attr("placeholder");
				
		if ($(this).is(":password"))
		{
			
			var textElement = $('<input type="text" />');
			
			var watchlist = [
				"id",
				"class",
				"size",
				"name",
				"placeholder",
				"disabled"
			];
			var len = watchlist.length;
			for (var i=0; i<len; i++)
			{
				var atr = $(this).attr(watchlist[i]);
				if (typeof atr !== 'undefined' && atr !== false)
					textElement.attr(watchlist[i], $(this).attr(watchlist[i]));
			}
			
			if ($.browser.msie && parseInt($.browser.version, 10) !== 9)
            textElement.addClass("active-placeholder");
			var passwordElement = $(this);
			if ($.browser.msie && parseInt($.browser.version, 10) !== 9)
			textElement.addClass("active-placeholder").val(placeholderText);
			
			textElement.focus(function () {
				$(this).after($(this).data("passwordElement").clone(true));
				$(this).next().focus();
				$(this).remove();
			});
			
			passwordElement.blur(function () {
				if ($(this).val() === "")
				{
					$(this).after($(this).data("textElement").clone(true));
					$(this).next().data("passwordElement",$(this).clone(true));
					$(this).remove();
				}
			});
			
			passwordElement.data("textElement", textElement.clone(true));
			textElement.data("passwordElement", passwordElement.clone(true));
			
			if (passwordElement.val() === "")
				passwordElement.after(textElement).remove();
			
		} else {

		    if ($(this).val() === "" || $(this).val() === placeholderText)
            {if ($.browser.msie && parseInt($.browser.version, 10) !== 9)
		        $(this).data("placeholding", true).addClass("active-placeholder").val(placeholderText);
                }
		    else
		        $(this).data("placeholding", false).removeClass("active-placeholder"); //edited by geneca, remove the active placeholder class in case the plugin was called multiple times on the same element

		    $(this).focus(function() {
		        if ($(this).data("placeholding"))
		            $(this).data("placeholding", false).removeClass("active-placeholder").val("");
		    });
		    if (!($(this).data('events').blur && $(this).data('events').blur[0].handler == blurFunction)) {
		        $(this).blur(blurFunction);
		    }

		}
	});
};

})(jQuery);

jQuery.support.placeholder = (function(){
    var i = document.createElement('input');
    return 'placeholder' in i;
})();
