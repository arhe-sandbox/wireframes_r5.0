(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.functions');

    ns.getDropdownSelectedOption = function getDropdownSelectedOption(outerDivId) {
        return $(outerDivId).find('.dk_label').html();
    };

    ns.getDropdownSelectedOptionValue = function getDropdownSelectedOptionValue(outerDivId) {
        var selectedText = ns.getDropdownSelectedOption(outerDivId);

        var value;
        $.each($(outerDivId).find('select option'), function (index, item) {
            if ($(item).html() === selectedText) {
                value = $(item).val();
                return false;
            }
        });

        return value;
    };

    ns.getDropdownSelectedOptionBySelectElementId = function getDropdownSelectedOptionBySelectElementId(selectElementId) {
        return $('#dk_container_' + selectElementId + ' li.dk_option_current a').html();
    };

    ns.getDropdownSelectedValueBySelectElementId = function getDropdownSelectedValueBySelectElementId(selectElementId) {
        return $('#dk_container_' + selectElementId + ' li.dk_option_current a').attr('data-dk-dropdown-value');
    };

    ns.setDropdownSelectedOption = function setDropdownSelectedOption(outerDivId, value) {
        $(outerDivId).find('.dk_label').html(value);
    };

    //This is used to reset the blue highlighting on Dropkick dropboxes back to the first choice
    ns.resetDropdownHighlight = function resetDropdownHighlight(outerDivId) {
        removeHighlightFromDropdown(outerDivId);
        $(outerDivId).find('li').first().addClass('dk_option_current');
    };

    ns.updateDropkick= function updateDropkick(id, value) {
        //Get the select element and dropkick container
        var select = $(id);
        var dk = select.prev('.dk_container');
        //Set the value of the select
        select.val(value);        

        //Loop through the dropkick options
        dk.find('.dk_options_inner').children("li").each(function () {
            var li = $(this);
            var link = li.children('a');
            //Remove the 'current' class if it has it
            li.removeClass('dk_option_current');
            //If the option has the value we passed in
            if (link.data('dk-dropdown-value') === value) {
                //Set the 'current' class on the option
                li.addClass('dk_option_current');
                //Set the text of the dropkick element
                dk.find('.dk_label').text(link.text());
            }
        });
    }

    function removeHighlightFromDropdown(outerDivId) {
        $(outerDivId).find('li').removeClass('dk_option_current');
    };

    ns.redrawDropkickBySelectElementId = function redrawDropkickBySelectElementId(selectElementId) {
        $('#' + selectElementId).removeData('dropkick');
        $('#dk_container_' + selectElementId).remove();
        $('#' + selectElementId).dropkick();
    };

    ns.removeDropkickBySelectElementId = function removeDropkickBySelectElementId(selectElementId) {
        $('#' + selectElementId).removeData('dropkick');
        $('#dk_container_' + selectElementId).remove();
    };

    //hovers
    var isTouch = false;
    try { isTouch = "ontouchstart" in window; } catch (e) { }

    var $activeTip = null;

    $.fn.smartHover = function (configObject) {
        if (isTouch) {
            $(this)
    	        .bind("hold", function () {
    	            $activeTip = $(this);
    	            $(this).data("held", true);
    	        })
    	        .bind("hold", configObject.over)
    	        .bind("click", function (e) {
    	            var wasHeld = $(this).data("held");
    	            $(this).data("held", false);
    	            if (wasHeld) {
    	                e.preventDefault();
    	                return false;
    	            }
    	        })
    	        .data("close", configObject.out);
        } else {
            if ($(this).hoverIntent != undefined) {
                $(this).unbind("mouseenter").unbind("mouseleave");
                $(this).removeProp("hoverIntent_t");
                $(this).removeProp("hoverIntent_s");
            }
            $(this).hoverIntent(configObject);
        }
    };

    if (isTouch) {
        document.ontouchstart = function () {
            if ($activeTip) {
                $activeTip.data("close").call($activeTip);
                $activeTip = null;
            }
        };
    }

    ns.scrollToDiv = function scrollToDiv(divString, container, scrollOffset) {
        var offset = $('#' + divString).position();
        if (offset != null) {
            var offsetTop = offset.top;
            // Bug #116052: Fix the link navigation issue from child to parent header.
            if (divString == "anchor-tag-prescription") {
                var offsetContainerTopAbsolute = Math.abs($('#plandetailacccontainer > div.accordionButton').first().position().top);
                var targetOffsetTop = $('#' + divString).position().top;
                offsetTop = offsetContainerTopAbsolute + targetOffsetTop + 330;
            }
            else if (scrollOffset) {
                offsetTop -= scrollOffset;
            }

            if ($(container).position() !== null) {
                var containerOffset = $(container).position().top;
                $(container).animate({ scrollTop: offsetTop - containerOffset + $(container).scrollTop() });
            }
        }
    };

    ns.setupScrollBindings = function setupScrollBindings(container) {
        $(document).on('click', '.scroller', function (e) {
            var divString = $(this).attr('scrolltodiv');
            var scrollOffset = 0;
            if ($(this).attr('data-scrolloffset')) {
                scrollOffset = parseInt($(this).attr('data-scrolloffset'));
            }
            ns.scrollToDiv(divString, container, scrollOffset);
            e.preventDefault();
            e.stopPropagation();
        });
    };

    ns.setupAccordions = function setupAccordions(hideOthers) {
        $('.accordionButton').on('click', function () {
            if ($(this).parent().find('.accordionButtonEnroll').length == 0) {
                if (hideOthers === true) {
                    $(this).parent().find('.accordionButton').each(function () {
                        if ($(this).next().is(':hidden') !== true) {
                            $(this).next().slideUp('normal');
                            $(this).removeClass('on');
                        }
                    });
                }
                if ($(this).next().is(':hidden') == true) {
                    $(this).addClass('on');
                    $(this).next().slideDown('normal');
                } else {
                    $(this).next().slideUp('normal');
                    $(this).removeClass('on');

                }
            }
        });

        $('.accordionButton').on('mouseover', function () {
            $(this).addClass('over');
        }).mouseout(function () {
            $(this).removeClass('over');
        });
    };

    ns.setupPhoneFormatting = function setupPhoneFormatting() {
        $(document).on('blur', '.format-phone', function () {
            var phonenum = $(this).val();
            phonenum = ns.autoFormatPhoneNumber(phonenum);
            $(this).val(phonenum).change();
        });
    };

    ns.setupSsnFormatting = function setupSsnFormatting() {
        $(document).on('blur', '.format-ssn', function () {
            var ssn = $(this).val();
            ssn = ns.autoFormatSsn(ssn);
            $(this).val(ssn).change();
        });

    };

    ns.autoFormatPhoneNumber = function autoFormatPhoneNumber(phonenum) {

        var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (regexObj.test(phonenum)) {
            var parts = phonenum.match(regexObj);
            var phone = "";
            //if (parts[1]) { phone += "(" + parts[1] + ") "; }
            if (parts[1]) {
                phone += parts[1] + "-";
            }
            phone += parts[2] + "-" + parts[3];
            phonenum = phone;
        }
        return phonenum;
    };

    ns.autoFormatSsn = function autoFormatSsn(ssn) {
        var regexObj = /^\d{3}-?\d{2}-?\d{4}$/;
        if (regexObj.test(ssn)) {
            var matched = String(ssn.match(regexObj));
            matched = matched.replace(/[A-Za-z$-]/g, "");
            ssn = matched.substr(0, 3) + "-" + matched.substr(3, 2) + "-" + matched.substr(5, 4);
        }
        return ssn;
    };

    ns.disableFooterLinks = function disableFooterLinks() {
        $('.footer').find('a').attr('href', 'javascript:;');
        $('.footer').find('a').each(function (index, element) {
            var classStr = $(element).attr('class');
            if (classStr) {
                var classList = classStr.split(/\s+/);
                $(classList).each(function (classIdx, className) {
                    if (className.indexOf('lightbox') !== -1) {
                        $(element).removeClass(className);
                    }
                });
            }
        });
    };

    ns.addMonthOptionsSubscription = function addMonthOptionsSubscription(dateOfBirthViewModel, monthElementId, shouldRebindInitialValue) {
        // The list of month options is provided by a different file (constants.js) that is
        // populated by an AJAX call in yet another file (pageSetup.js). Therefore, the month 
        // options observable array might not actually be fully-populated when the binding is 
        // done from dob-select to dob-viewmodel. So, this subscribe call ensures that the month 
        // select -- and corresponding Dropkick -- get refreshed once the month options are actually 
        // available (assuming they are not already available).
        dateOfBirthViewModel.MonthOptions.subscribe(function () {
            if (shouldRebindInitialValue) {
                dateOfBirthViewModel.reloadBoundMonthFromModel();
            }
            app.functions.redrawDropkickBySelectElementId(monthElementId);
        });
    };

    ns.dateDropDownUpdate = function dateDropDownUpdate(chosenMonth, chosenYear, dayOptionsList, daySelectId, errorFieldClass) {
        // Note: dayOptionsList is a reference to the "DayOptions" ko observable from the dateOfBirth view model. 

        // defaults in case arguments are not sent
        var daySelectId = daySelectId ? daySelectId : 'day';
        var errorFieldClass = errorFieldClass ? errorFieldClass : 'error-field';

        // create selectors and get the appropriate elements
        var dayElemSelector = '#' + daySelectId;
        var dayDropkickSelector = '#dk_container_' + daySelectId;
        var daySelect = $(dayElemSelector);

        // capture values that we will lose when we re-assign the options list and redraw the dropkick
        var dayValue = daySelect.val();
        var isDropKickDayError = $(dayDropkickSelector).hasClass(errorFieldClass);

        // update the view model and select element
        app.functions.setDayListForMonthAndYear(chosenMonth, chosenYear, dayOptionsList);
        if (dayValue != "" && dayValue <= dayOptionsList().length) {
            daySelect.val(dayValue);
        } else {
            // else default to first option
        }

        // update the dropkick
        app.functions.redrawDropkickBySelectElementId(daySelectId);
        if (isDropKickDayError) {
            // need to re-select dropkick, since it is a new object thanks to the redraw call above 
            $(dayDropkickSelector).addClass(errorFieldClass);
        }
    };

    ns.fitLightboxToScreen = function fitLightboxToScreen(container) {
        var yOffset = ns.getScrollTop() + 10;
        var popupHeight = $(window).height() - 170;
        $(container).parents().eq(3).css({ "position": "absolute", "top": yOffset + "px" });
        $(container).css("height", popupHeight + "px");
    };

    ns.getScrollTop = function getScrollTop() {
        if (typeof pageYOffset != 'undefined') {
            //most browsers
            return pageYOffset;
        } else {
            var B = document.body; //IE 'quirks'
            var D = document.documentElement; //IE with doctype
            D = (D.clientHeight) ? D : B;
            return D.scrollTop;
        }
    };

    ns.refreshRadioButtonSelection = function refreshRadioButtonSelection(radioButtonGroupName, selectedValue) {
        var inputs = $('input[name=' + radioButtonGroupName + ']');
        $.each(inputs, function (index, item) {
            var label = $('label[for=' + item.id + ']');
            label.removeClass('checked');

            if ($(item).val() == selectedValue) {
                label.addClass('checked');
            }

        });
    };

} (EXCHANGE));

