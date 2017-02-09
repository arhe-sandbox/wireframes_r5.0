// Wait Indicators - UI indicators for visual indication to the user that an action or process is 
// happening or running. This includes wait popups, button spinners, tab activation

(function ($) {

    var popID = 0;
    var maskZIndex = 10001;

    // ---------------------------------------------------------------------------------------------
    // Open a Wait Popup spinner to inform the user to wait until a running process is complete.
    //
    // params: options - param array:
    //             hide - whether to hide the host element or dim it while showing the wait popup
    //             fullWindow - whether to hide/dim the entire window
    //             pageSetup - whether this is the global page setup wait popup
    //             callback - callback function to call upon wait popup close
    // ---------------------------------------------------------------------------------------------
    $.fn.WaitPopup = function (options) {
        var options = $.extend({}, { hide: false, fullWindow: true, pageSetup: false, callback: null, blankTemplate: false, contentTemplate: false }, options);
        this.isOpen = false;  // whether the wait popup is open
        this.fullWindow = options.fullWindow;
        var hostObj = $(this);  // host element to dim/hide
        var hostL;

        popID = (options.pageSetup ? 0 : popID + 1);  // page setup wait popup is 0
        this.PopID = popID;  // unique wait popup id

        $('body').append('<div id="waitPopup-mask' + this.PopID
            + '" style="display:none; position: relative'
            + (options.hide ? '; background-color: #EDEDED; border: 2px dashed #EDEDED;"' : '"')
            + ' class="modalPopLite-mask waitPopup-mask" />');
        this.MaskObj = $('#waitPopup-mask' + this.PopID);
        this.MaskObj.wrap('<div id="waitPopup-maskwrapper' + this.PopID
            + '" style="left: -10000px;" class="modalPopLite-wrapper waitPopup-maskwrapper" />');

        //If Blank fullpage Wait Indicator needed (Template A - Sprint 9)
        if (options.blankTemplate) {
            this.MaskObj.addClass('waitPopup-child-' + this.PopID);
        } else {
            $('body').append('<div id="waitPopup-content' + this.PopID
                        + '" class="waitPopup-content" style="display:none; width: 220px; height: 140px; position: relative">'
                       + '<img src="/AonExchange/media/Image-Gallery/SiteImages/spinner2.gif" style="margin-left: 80px; margin-top: 20px"/>'
                     + '<h1 class="bannertext" style="background-color: White; padding: 0 0 0 10px; text-align: center; margin-top: 90px">Please Wait...</h1></div>');
            this.ContentObj = $('#waitPopup-content' + this.PopID);
            this.ContentObj.wrap('<div id="waitPopup-wrapper' + this.PopID
                        + '" style="left: -10000px;" class="modalPopLite-wrapper waitPopup-wrapper" />');
            this.ContentObj.addClass('waitPopup-child-' + this.PopID);
        }

        // ---------------------------------------------------------------------------------------------
        // Open the Wait Popup
        // params: (none)
        // ---------------------------------------------------------------------------------------------
        this.Open = function () {
            this.isOpen = true;

            // Determine size and positioning of host element and wait popup
            var winW = $(window).outerWidth();
            var winH = $(window).outerHeight();
            var winScrollW = window.outerWidth;
            var winScrollH = window.outerHeight;
            var objW = $('.waitPopup-child-' + this.PopID).outerWidth();
            var objH = $('.waitPopup-child-' + this.PopID).outerHeight();
            var left = (winW / 2) - (objW / 2);
            var top = (winH / 2) - (objH / 2) + EXCHANGE.functions.getScrollTop();
            var hostW = (options.fullWindow ? winW : $(hostObj).outerWidth());
            var hostH = (options.fullWindow ? winH : $(hostObj).outerHeight());
            hostL = (options.fullWindow ? 0 : $(hostObj).offset().left);
            var hostT = (options.fullWindow ? 0 : $(hostObj).offset().top);
            var objL = hostL + (hostW / 2) - (objW / 2);
            var objT = hostT + (hostH / 2) - (objH / 2);
            var footerH = $('.footer li.column-text.group').height();


            //If Header & Container has hidden classes - remove it to show for Content WaitIndicator
            if (!options.blankTemplate) {
                $('.header.hidden').removeClass('hidden');
                $('.container:first.hidden').removeClass('hidden');
            }


            // If the host element needs hidden
            if (options.hide && !options.fullWindow) {

                // If the host element is a lightbox, adjust the dimensions and hide the lightbox
                if ($(hostObj).parent().is('.modalPopLite-wrapper')) {
                    hostL = $(hostObj).parent().offset().left;
                    hostT = $(hostObj).parent().offset().top;
                    $(hostObj).parent().css('left', "-10000px");
                }
                // Hide the host element
                else {
                    $(hostObj).hide();
                }
            }

            var newW = Math.max(winScrollW, $(document.body).outerWidth());
            var newH = Math.max(winScrollH, $(document.body).outerHeight(true));

            if (options.fullWindow) {
                // IE7 (and lower) need this class to be on the HTML element, not the body element. But 
                // we can't put the class on both elements; transparency in Firefox (and possibly 
                // other browsers) isn't correct in that case. So we need a special case to check 
                // for IE7. 
                if (EXCHANGE.functions.isIE7OrLower()) {
                    $("html").addClass("full-window-wait-spinner");
                } else {
                    $("body").addClass("full-window-wait-spinner");
                }

                // For fullWindow spinner, we want the overlay to cover the
                // viewport, not the page. 
                $('#waitPopup-maskwrapper' + this.PopID).css({
                    'position': 'fixed'
                });
            }

            // Display the wait popup
            $('#waitPopup-maskwrapper' + this.PopID).fadeTo(0, (options.hide ? 1.0 : 0.6));
            $('#waitPopup-maskwrapper' + this.PopID).css({
                'width': (options.fullWindow ? '100%' : (hostW + 'px'))
                , 'height': (options.fullWindow ? '100%' : (hostH + 'px'))
                , 'left': hostL + 'px'
                , 'top': hostT + 'px'
                , 'background-color': (options.hide ? '#EDEDED' : '#000000')
            });
            $('#waitPopup-wrapper' + this.PopID).css({ 'left': objL + "px", 'top': (options.hide ? objT : objT) });

            // If Template B - Sprint 9
            if (options.contentTemplate) {
                $('#waitPopup-maskwrapper' + this.PopID).css({ 'opacity': '0' });

                var wrapper = $('#waitPopup-wrapper' + this.PopID);
                var content = $('#waitPopup-content' + this.PopID);
                var container = $('body .container:first');
                var header = $('body .header:first');
                if (header.length === 0) {
                    header = $('body .pre65header:first');
                    header.height(111); //same as height of pre65 menu
                }

                wrapper.css({ 'position': 'absolute' });
                wrapper.width(container.width());
                wrapper.height(container.height()-header.height());
                wrapper.offset({top: header.height()+10 , left: container.offset().left});

                //Removing shadow & adjusting Wrapper Width & Height
                var wrapLeft = wrapper.offset().left - 40;
                wrapper.css({ 'left': wrapLeft + 'px', 'boxShadow': '0px 0px 0px rgba(0, 0, 0, 0)' });
                wrapper.width(function (index, width) {
                    return (width + 40);
                });

                content.css({ 'position': 'absolute',
                    'left': ((wrapper.width() - content.width()) / 2) + 'px',
                    'top': ((wrapper.height() - content.height()) / 2) + 'px'
                });
            }

            $('#waitPopup-wrapper' + this.PopID).fadeIn('slow');

            //If Blank fullpage Popup needed (Template 1 - Sprint 9)
            if (options.blankTemplate) {
                this.MaskObj.show();
            } else {
                this.ContentObj.show();
            }

        };

        // ---------------------------------------------------------------------------------------------
        // Close the Wait Popup
        // params: removePopups (optional) - supplied if function should remove waitPopup DOM element instead of hide it
        // ---------------------------------------------------------------------------------------------
        this.Close = function (removePopups) {
            if (arguments.length == 1 && removePopups == true) {
                // Remove the wait popup
                $('#waitPopup-maskwrapper' + this.PopID).remove();
                $('#waitPopup-wrapper' + this.PopID).remove();
            } else {
                // Hide the wait popup
                $('#waitPopup-maskwrapper' + this.PopID).hide();
                $('#waitPopup-wrapper' + this.PopID).css('left', "-10000px");
            }

            if (options.fullWindow) {
                // For an explanation, see the section of code above where the
                // class "full-window-wait-spinner" was added; here, we are simply
                // reversing that action. 
                if (EXCHANGE.functions.isIE7OrLower()) {
                    $("html").removeClass("full-window-wait-spinner");
                } else {
                    $("body").removeClass("full-window-wait-spinner");
                }

                // In code above, we had set position to fixed for a fullWindow spinner. 
                // Here, we are simply reversing that decision.
                $('#waitPopup-maskwrapper' + this.PopID).css({
                    'position': 'relative'
                });
            }


            //If Header & Container has hidden classes - remove it to show
            if (options.blankTemplate || options.contentTemplate) {
                $('.header.hidden').removeClass('hidden');
                $('.container:first.hidden').removeClass('hidden');
            }

            // If the host element was hidden
            if (options.hide && !options.fullWindow) {

                // If the host element is a lightbox, show it
                if ($(hostObj).parent().is('.modalPopLite-wrapper')) {
                    $(hostObj).parent().css('left', hostL + 'px');
                }
                // Show the host element
                else {
                    $(hostObj).show();
                }
            }

            this.isOpen = false;

            // If a callback function was specified, call it
            if (options.callBack != null) {
                options.callBack.call(this);
            }

            // Close the global page setup wait popup
            if (this.PopID != 0 && EXCHANGE.WaitPopup && EXCHANGE.WaitPopup.PopID == 0) {
                EXCHANGE.WaitPopup.Close();
            }
        };

        // If this is the first time called, open the wait popup
        if (!this.isOpen) {
            this.Open();
        }

        return this;
    };

    var spinID = 0;

    // ---------------------------------------------------------------------------------------------
    // Show a button spinner to inform the user to wait until a running process is complete.
    //
    // params: options - param array:
    //             buttonType - enum value indicating button type
    //             callback - callback function to call upon process completion
    // ---------------------------------------------------------------------------------------------
    $.fn.ButtonSpinner = function (options) {
        var options = $.extend({}, {
            buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN
            , callback: null
        }, options);

        spinID++;
        this.SpinID = spinID;  // unique button spinner id
        this.isActive = false;  // whether the button spinner is active

        var hostObj = $(this);  // host button to show spinner
        var hostL;
        var hostText;

        // Save the existing button text, which could be based on an input or anchor tag
        if (hostObj.is('input')) {
            hostText = hostObj.val();
        } else if (hostObj.is('a')) {
            // Buttons with icons have text within a span tag
            if (hostObj.has('span').length > 0) {
                hostText = $(hostObj).children('span').last().html();
                // Otherwise, button text is plain text
            } else {
                hostText = hostObj.html();
            }
        }

        $('body').append('<div id="spinner-mask' + this.SpinID
            + '" style="display:none; position: relative"'
            + ' class="modalPopLite-mask spinner-mask" />');
        this.MaskObj = $('#spinner-mask' + this.SpinID);
        this.MaskObj.wrap('<div id="spinner-maskwrapper' + this.SpinID
            + '" style="left: -10000px;" class="modalPopLite-wrapper spinner-maskwrapper" />');

        var imageName = 'ajax-loader_green_lg';

        if (options.buttonType == EXCHANGE.enums.ButtonType.LARGEGREEN) {
            imageName = 'ajax-loader_green_lg';
        } else if (options.buttonType == EXCHANGE.enums.ButtonType.SMALLGREEN) {
            imageName = 'ajax-loader_green';
        } else if (options.buttonType == EXCHANGE.enums.ButtonType.LARGEBLUE) {
            imageName = 'ajax-loader_blue_lg';
        } else if (options.buttonType == EXCHANGE.enums.ButtonType.SMALLBLUE) {
            imageName = 'ajax-loader_blue';
        } else if (options.buttonType == EXCHANGE.enums.ButtonType.LARGEDARKGRAY) {
            imageName = 'ajax-loader_dark2_lg';
        } else if (options.buttonType == EXCHANGE.enums.ButtonType.LARGEMEDIUMGRAY) {
            imageName = 'ajax-loader_medium_lg';
        } else if (options.buttonType == EXCHANGE.enums.ButtonType.LARGELIGHTGRAY) {
            imageName = 'ajax-loader_light_lg';
        } else if (options.buttonType == EXCHANGE.enums.ButtonType.SMALLLIGHTGRAY) {
            imageName = 'ajax-loader_light';
        }

        $('body').append('<div id="spinner-content' + this.SpinID
            + '" class="spinner-content" style="display:none; position: relative; z-index:' + (maskZIndex + this.SpinID) + '">'
            + '<img src="/AonExchange/media/Image-Gallery/SiteImages/' + imageName + '.gif" style=""/>'
            + '</div>');
        this.ContentObj = $('#spinner-content' + this.SpinID);
        this.ContentObj.wrap('<div id="spinner-wrapper' + this.SpinID
            + '" class="spinner-wrapper" style="left: -10000px; position:absolute;" />');
        //this.ContentObj.addClass('waitPopup-child-' + this.PopID);

        // ---------------------------------------------------------------------------------------------
        // Start the Button Spinner
        // params: (none)
        // ---------------------------------------------------------------------------------------------
        this.Start = function () {
            this.isActive = true;

            // Determine size and positioning of host element and window
            var winW = $(window).outerWidth();
            var winH = $(window).outerHeight();
            var winScrollW = window.outerWidth;
            var winScrollH = window.outerHeight;
            var hostW = $(hostObj).outerWidth();
            var hostH = $(hostObj).outerHeight();
            hostL = $(hostObj).offset().left;
            var hostT = $(hostObj).offset().top;
            var objL = hostL + (hostW / 2) - (24 / 2);
            var objT = hostT + (hostH / 2) - (24 / 2);
            var footerH = $('.footer li.column-text.group').height();

            // Hide the button text, which could be based on an input or anchor tag
            if (hostObj.is('input')) {
                hostObj.val('');
            } else if (hostObj.is('a')) {
                // Buttons with icons have text within a span tag
                if (hostObj.has('span').length > 0) {
                    $(hostObj).children('span').last().html('&nbsp;');
                    // Otherwise, button text is plain text
                } else {
                    hostObj.html('&nbsp;');
                }
            }

            var newW = Math.max(winScrollW, $(document.body).outerWidth());
            var newH = Math.max(winScrollH, $(document.body).outerHeight(true));

            // Disable all controls by showing a low-opacity panel on top of the entire page
            $('#spinner-maskwrapper' + this.SpinID).fadeTo(0, 0.1);
            $('#spinner-maskwrapper' + this.SpinID).css({
                'width': newW + 'px'
                , 'height': (newH + footerH) + 'px'
                , 'left': '0px'
                , 'top': '0px'
                , 'background-color': '#000000'
                , 'z-index': maskZIndex + this.SpinID
            });

            // Display the spinner
            $('#spinner-wrapper' + this.SpinID).css({ 'left': objL + "px", 'top': objT });
            this.ContentObj.show();
        };

        // ---------------------------------------------------------------------------------------------
        // Stop the Button Spinner
        // params: options - param array:
        //             textChanged - whether the button text was already changed by the client
        // ---------------------------------------------------------------------------------------------
        this.Stop = function (options) {
            var options = $.extend({}, {
                textChanged: false
            }, options);

            // Hide the spinner
            $('#spinner-maskwrapper' + this.SpinID).hide();
            $('#spinner-wrapper' + this.SpinID).css('left', "-10000px");

            // If the button text was changed by the caller, don't reset it to the original text
            if (!options.textChanged) {

                // Show the button text, which could be based on an input or anchor tag
                if (hostObj.is('input')) {
                    hostObj.val(hostText);
                } else if (hostObj.is('a')) {
                    // Buttons with icons have text within a span tag
                    if (hostObj.has('span').length > 0) {
                        $(hostObj).children('span').last().html(hostText);
                        // Otherwise, button text is plain text
                    } else {
                        hostObj.html(hostText);
                    }
                }
            }

            this.isActive = false;
        };

        // If this is the first time called, start the button spinner
        if (!this.isActive) {
            this.Start();
        }

        return this;
    };

})(jQuery);
