(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.getHelp');

    EXCHANGE.namespace('EXCHANGE.viewModels');

    var inlineErrors = new Array();

    $(document).ready(function () {
        ns.wireupJqueryEvents();
        ns.initializeGetHelp();
    });

    ns.initializeGetHelp = function initializeGetHelp() {
        EXCHANGE.viewModels.GetHelpPopupViewModel = EXCHANGE.models.GetHelpPopupViewModel();
        EXCHANGE.viewModels.SendMessageViewModel = EXCHANGE.models.SendMessageViewModel();
        EXCHANGE.viewModels.CallMeBackViewModel = EXCHANGE.models.SendMessageViewModel();
        EXCHANGE.viewModels.WebChatViewModel = EXCHANGE.models.SendMessageViewModel();
        EXCHANGE.viewModels.SendMessageConfirmViewModel = EXCHANGE.models.SendMessageConfirmViewModel();
        EXCHANGE.viewModels.CallMeBackConfirmViewModel = EXCHANGE.models.CallMeBackConfirmViewModel();


        var getHelpLb = new EXCHANGE.lightbox.Lightbox({
            name: 'gethelp',
            divSelector: '#get-help-popup',
            openButtonSelector: '#get-help-open-button',
            closeButtonSelector: '#get-help-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#getHelpTemplates').get(0));
                $('#sendMessageSaveBtn').hide();
                return true;
            },
            afterOpen: function () {
                if (!app.viewModels.GetHelpPopupViewModel.hasBeenLoaded) {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/API/GetHelp/GetHelpPopupClientViewModel",
                        dataType: "json",
                        success: function (data) {
                            var viewModel = data;
                            EXCHANGE.viewModels.GetHelpPopupViewModel.loadFromJSON(viewModel.GetHelpPopupViewModel);
                            EXCHANGE.viewModels.SendMessageViewModel.loadFromJSON(viewModel.SendMessageViewModel);
                            EXCHANGE.viewModels.CallMeBackViewModel.loadFromJSON(viewModel.CallMeBackViewModel);
                            EXCHANGE.viewModels.WebChatViewModel.loadFromJSON(viewModel.WebChatViewModel);
                            EXCHANGE.viewModels.SendMessageConfirmViewModel.loadFromJSON(viewModel.SendMessageConfirmViewModel);
                            EXCHANGE.viewModels.CallMeBackConfirmViewModel.loadFromJSON(viewModel.CallMeBackConfirmViewModel);

                            EXCHANGE.placeholder.applyPlaceholder();


                            //  ns.refreshCallCenterOpen(new Date());
                            $('.selectfieldhelpMe').dropkick();
                            $.publish("EXCHANGE.lightbox.gethelp.loaded");
                            $.publish("lightbox-refresh-gethelp");
                        }
                    });
                }
                else {
                    $.publish("EXCHANGE.lightbox.gethelp.loaded");
                }

                //  ns.refreshCallCenterOpen(new Date());
                ns.refreshWebChatAvailable();
            },
            showWaitPopup: true
        });
        var sendMessageLightbox = new EXCHANGE.lightbox.Lightbox({
            name: 'sendmessage',
            divSelector: '#send-message-popup',
            openButtonSelector: '#send-message-open-button',
            closeButtonSelector: '#send-message-close-button',
            beforeOpen: function (clickedItem) {
                if ($(clickedItem).attr('id') === 'getHelpSendMessageBtn') {
                    if (_gaq) {
                        _gaq.push(['_trackEvent', 'Get Help Request', 'Click', 'Send Us Message']);
                    }
                }
                ko.applyBindings(EXCHANGE.viewModels, $('#getHelpTemplates').get(0));
                ns.getCountiesForNewZip();
                $('#messageFirstname').focus();
                return true;
            },
            afterOpen: function () {
                app.functions.setupPhoneFormatting();
                $('.selectfieldhelpMe').dropkick();
                ns.scrollWebNavigationDD();
            },
            beforeSubmit: ns.sendMessageClick,
            afterClose: function () {
                ns.removeInlineErrorsGetHelp();
                EXCHANGE.viewModels.SendMessageViewModel.clearInlineErrors();
                EXCHANGE.functions.setDropdownSelectedOption('#sendMessageSubjectDiv', EXCHANGE.viewModels.SendMessageViewModel.subject_options()[0].Text);
                EXCHANGE.functions.resetDropdownHighlight('#sendMessageSubjectDiv');
                app.viewModels.SendMessageViewModel.yourMessage_tb('');
            }
        });
        var sendMessageConfirmLightbox = new EXCHANGE.lightbox.Lightbox({
            name: 'sendmessageconfirm',
            divSelector: '#send-message-confirm',
            openButtonSelector: '#send-message-confirm-open-button',
            closeButtonSelector: '#send-message-confirm-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#getHelpTemplates').get(0));
                return true;
            },
            beforeSubmit: function () {
                $.publish("EXCHANGE.lightbox.gethelp.back");
                return true;
            }
        });
        var callBackLightbox = new EXCHANGE.lightbox.Lightbox({
            name: 'callback',
            divSelector: '#call-me-back-popup',
            openButtonSelector: '#call-back-open-button',
            closeButtonSelector: '#call-back-close-button',
            potentialChildren: ['callbackconfirm', 'gethelp', 'privacy'],
            beforeOpen: function (clickedItem) {
                if ($(clickedItem).attr('id') === 'getHelpCallBackBtn') {
                    if (_gaq) {
                        _gaq.push(['_trackEvent', 'Get Help Request', 'Click', 'Request Call Back']);
                    }
                }
                if ($('#getHelpCallBackBtn').hasClass('disabled')) {
                    return false;
                }
                ko.applyBindings(EXCHANGE.viewModels, $('#getHelpTemplates').get(0));
                ns.getCountiesForNewZip();
                $('#callFirstname').focus();
                return true;
            },
            afterOpen: function () {
                app.functions.setupPhoneFormatting();
                $('.selectfieldhelpMe').dropkick();
                ns.scrollCallBackDD();
            },
            beforeSubmit: ns.callMeBackClick,
            afterClose: function () {
                ns.removeInlineErrorsGetHelp();
                EXCHANGE.viewModels.CallMeBackViewModel.clearInlineErrors();
                EXCHANGE.functions.setDropdownSelectedOption('#callMeBackSubjectDiv', EXCHANGE.viewModels.CallMeBackViewModel.subject_options()[0].Text);
                EXCHANGE.functions.resetDropdownHighlight('#callMeBackSubjectDiv');
            }
        });
        var callbackConfirmLightbox = new EXCHANGE.lightbox.Lightbox({
            name: 'callbackconfirm',
            divSelector: '#call-me-back-confirm',
            openButtonSelector: '#call-back-confirm-open-button',
            closeButtonSelector: '#call-back-confirm-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#getHelpTemplates').get(0));
                return true;
            },
            beforeSubmit: function () {
                $.publish("EXCHANGE.lightbox.gethelp.back");
                return true;
            }
        });
        var webchatConfirmLightbox = new EXCHANGE.lightbox.Lightbox({
            name: 'webchatconfirm',
            divSelector: '#web-chat-confirm',
            openButtonSelector: '#web-chat-confirm-open-button',
            closeButtonSelector: '#web-chat-confirm-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#getHelpTemplates').get(0));
                return true;
            },
            afterOpen: function () {
                if (!app.viewModels.GetHelpPopupViewModel.hasBeenLoaded) {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/API/GetHelp/GetHelpPopupClientViewModel",
                        dataType: "json",
                        success: function (data) {
                            var viewModel = data;
                            EXCHANGE.viewModels.GetHelpPopupViewModel.loadFromJSON(viewModel.GetHelpPopupViewModel);
                            $.publish("EXCHANGE.lightbox.webchatconfirm.loaded");
                        }
                    });
                }
                else {
                    $.publish("EXCHANGE.lightbox.webchatconfirm.loaded");
                }
                ns.refreshWebChatAvailable();
            },
            beforeSubmit: function () {
                $.publish("EXCHANGE.lightbox.gethelp.back");
                return true;
            }
        });

        var webChatLightbox = new EXCHANGE.lightbox.Lightbox({
            name: 'webchat',
            divSelector: '#web-chat-popup',
            openButtonSelector: '#web-chat-open-button',
            closeButtonSelector: '#web-chat-close-button',
            potentialChildren: ['webchatconfirm', 'gethelp', 'privacy'],
            beforeOpen: function (clickedItem) {
                if ($(clickedItem).attr('id') === 'getHelpWebChatBtn') {
                    if (_gaq) {
                        _gaq.push(['_trackEvent', 'Get Help Request', 'Click', 'Web Chat']);
                    }
                }
                if ($('#getHelpWebChatBtn').hasClass('disabled')) {
                    return false;
                }
                ko.applyBindings(EXCHANGE.viewModels, $('#getHelpTemplates').get(0));
                ns.getCountiesForNewZip();
                $('#chatFirstname').focus();
                return true;
            },
            afterOpen: function () {
                app.functions.setupPhoneFormatting();
                ns.scrollWebChatDD();
                $('#WebChatSubjectDiv').dropkick();
            },
            beforeSubmit: ns.webChatClick,
            afterClose: function () {
                ns.removeInlineErrorsGetHelp();
                EXCHANGE.viewModels.WebChatViewModel.clearInlineErrors();
                EXCHANGE.functions.setDropdownSelectedOption('#WebChatSubjectDiv', EXCHANGE.viewModels.WebChatViewModel.subject_options()[0].Text);
                EXCHANGE.functions.resetDropdownHighlight('#WebChatSubjectDiv');
            }
        });
    };

    ns.refreshWebChatAvailable = function refreshWebChatAvailable() {
        app.viewModels.GetHelpPopupViewModel.webChatEnabledUrl(app.viewModels.GetHelpPopupViewModel.webChatEnabledUrl());
    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $(document).on('click', '.helpOptions', function () {
            ns.processHelpOptionsClick();
        });
    };

    // Process the help options button click
    ns.processHelpOptionsClick = function () {
        if (EXCHANGE.user.webChatStarted === true) {
            openWebChatConfirmLightbox();
        } else {
            openGetHelpLightbox();
        }
    }

    // Query if web chat confirm is already open
    function isWebChatConfirmAlreadyOpen() {
        return (EXCHANGE.lightbox.currentLightbox && EXCHANGE.lightbox.currentLightbox.name === "webchatconfirm");
    }

    // Open the WebChat Confirm Lightbox 
    function openWebChatConfirmLightbox() {
        if (isWebChatConfirmAlreadyOpen()) {
            EXCHANGE.user.webChatStarted = false;
        }
        else {
            $.publish('EXCHANGE.lightbox.closeAll');
            $.publish("EXCHANGE.lightbox.webchatconfirm.open");
        }
    }

    // Open the Get Help Lightbox
    function openGetHelpLightbox() {
        if (_gaq) {
            _gaq.push(['_trackEvent', 'Get Help', 'Click', location.pathname]);
        }
        $.publish("EXCHANGE.lightbox.gethelp.open");
    }

    ns.webChatAgentsAvailable = function webChatAgentsAvailable() {
        app.viewModels.GetHelpPopupViewModel.webChatAvailable(true);
    };

    ns.webChatAgentsUnavailable = function webChatAgentsUnavailable() {
        app.viewModels.GetHelpPopupViewModel.webChatAvailable(false);
    };

    ns.sendMessageClick = function sendMessageClick() {
        ns.removeInlineErrorsGetHelp();
        //
        var subject = EXCHANGE.functions.getDropdownSelectedOption('#sendMessageSubjectDiv');
        EXCHANGE.viewModels.SendMessageViewModel = EXCHANGE.viewModels.SendMessageViewModel.updateSubject(subject);
        //
        var jsObj = EXCHANGE.viewModels.SendMessageViewModel;
        var paramsJson = JSON.stringify(jsObj.toJS());

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/GetHelp/ValidateSendMessage",
            data: paramsJson,
            dataType: "json",
            success: function (serverValidationModel) {
                var inlineErrorExist = ns.loadSendMessageInlineErrors(serverValidationModel.ValidationResult);
                if (inlineErrorExist) {
                    ns.displayInlineErrorsGetHelp();
                } else {
                    app.viewModels.ActivateAccountViewModel.setLead(serverValidationModel.Lead);
                    if (app.viewModels.ShoppingCartViewModel) {
                        app.viewModels.ShoppingCartViewModel.getCartViewModel();
                        app.viewModels.ShoppingCartViewModel.useAPIPlanCount(true);
                    }
                    $.publish("EXCHANGE.lightbox.sendmessageconfirm.open");
                }
            }
        });
    };

    ns.callMeBackClick = function callMeBackClick() {
        ns.removeInlineErrorsGetHelp();
        //
        var subject = EXCHANGE.functions.getDropdownSelectedOption('#callMeBackSubjectDiv');
        EXCHANGE.viewModels.CallMeBackViewModel = EXCHANGE.viewModels.CallMeBackViewModel.updateSubject(subject);
        //
        var jsObj = EXCHANGE.viewModels.CallMeBackViewModel;
        var paramsJson = JSON.stringify(jsObj.toJS());

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/GetHelp/ValidateCallMeBack",
            data: paramsJson,
            dataType: "json",
            success: function (serverValidationModel) {
                var inlineErrorExist = ns.loadCallMeBackInlineErrors(serverValidationModel.ValidationResult);
                if (inlineErrorExist) {
                    ns.displayInlineErrorsGetHelp();
                } else {
                    app.viewModels.ActivateAccountViewModel.setLead(serverValidationModel.Lead);
                    if (app.viewModels.ShoppingCartViewModel) {
                        app.viewModels.ShoppingCartViewModel.getCartViewModel();
                        app.viewModels.ShoppingCartViewModel.useAPIPlanCount(true);
                    }
                    $.publish("EXCHANGE.lightbox.callbackconfirm.open");
                }
            }
        });

        return false;
    };

    ns.webChatClick = function webChatClick() {
        ns.removeInlineErrorsGetHelp();

        //
        var subject = EXCHANGE.functions.getDropdownSelectedOption('#WebChatSubjectDiv');
        var val = EXCHANGE.functions.getDropdownSelectedOptionValue('#WebChatSubjectDiv');

        EXCHANGE.viewModels.WebChatViewModel = EXCHANGE.viewModels.WebChatViewModel.updateSubject(subject, val);
        //
        var jsObj = EXCHANGE.viewModels.WebChatViewModel;
        var paramsJson = JSON.stringify(jsObj.toJS());

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/GetHelp/ValidateWebChat",
            data: paramsJson,
            dataType: "json",
            success: function (validationModel) {
                var inlineErrorExist = ns.loadWebChatInlineErrors(validationModel.ValidationResult);
                if (inlineErrorExist) {
                    ns.displayInlineErrorsGetHelp();
                } else {
                    app.viewModels.ActivateAccountViewModel.setLead(validationModel.Lead);
                    if (app.viewModels.ShoppingCartViewModel) {
                        app.viewModels.ShoppingCartViewModel.getCartViewModel();
                        app.viewModels.ShoppingCartViewModel.useAPIPlanCount(true);
                    }
                    ns.startWebChat(validationModel);
                }
            }
        });

        return false;
    };

    ns.startWebChat = function startWebChat(webChatValidationModel) {
        if (parent.main_frame) {
            alert(webChatValidationModel.NestedChatWarningMessage);
            $.publish("EXCHANGE.lightbox.webchat.back");
            return;
        }

        var redirectToWebChatPage = function () {
            var redirectPath = "/CMSTemplates/AonExchange/WebChat/WebChat.aspx"; ;
            app.functions.redirectToRelativeUrlFromSiteBase(redirectPath);
        };

        //save eapp data with no validation, if on app page
        if (app.application && app.application.navigationBar
            && app.application.navigationBar.applicationPageSubmitNoValidation
                && app.viewModels.ApplicationPageViewModel
                    && app.applicationPage) {
            app.application.navigationBar.applicationPageSubmitNoValidation(redirectToWebChatPage);
        } else {
            redirectToWebChatPage();
        }
    };

    ns.loadCallMeBackInlineErrors = function loadCallMeBackInlineErrors(data) {
        var hasInlineErrors = false;
        EXCHANGE.viewModels.CallMeBackViewModel.clearInlineErrors();
        inlineErrors = [];
        for (var i = 0; i < data.Errors.length; i++) {
            var error = data.Errors[i].ErrorMessage;
            if (error.indexOf("inline:") != -1) {
                var errorString = error.substring(error.indexOf("inline:") + "inline:".length);
                inlineErrors.push(data.Errors[i]);
                EXCHANGE.viewModels.CallMeBackViewModel.addInlineError(errorString);
                hasInlineErrors = true;
            }
        }
        return hasInlineErrors;
    };

    ns.loadSendMessageInlineErrors = function loadSendMessageInlineErrors(data) {
        var hasInlineErrors = false;
        EXCHANGE.viewModels.SendMessageViewModel.clearInlineErrors();
        inlineErrors = [];
        for (var i = 0; i < data.Errors.length; i++) {
            var error = data.Errors[i].ErrorMessage;
            if (error.indexOf("inline:") != -1) {
                var errorString = error.substring(error.indexOf("inline:") + "inline:".length);
                inlineErrors.push(data.Errors[i]);
                EXCHANGE.viewModels.SendMessageViewModel.addInlineError(errorString);
                hasInlineErrors = true;
            }
        }
        return hasInlineErrors;
    };

    ns.loadWebChatInlineErrors = function loadWebChatInlineErrors(data) {
        var hasInlineErrors = false;
        EXCHANGE.viewModels.WebChatViewModel.clearInlineErrors();
        inlineErrors = [];
        for (var i = 0; i < data.Errors.length; i++) {
            var error = data.Errors[i].ErrorMessage;
            if (error.indexOf("inline:") != -1) {
                var errorString = error.substring(error.indexOf("inline:") + "inline:".length);
                inlineErrors.push(data.Errors[i]);
                EXCHANGE.viewModels.WebChatViewModel.addInlineError(errorString);
                hasInlineErrors = true;
            }
        }
        return hasInlineErrors;
    };

    ns.displayInlineErrorsGetHelp = function displayInlineErrorsGetHelp() {
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "FirstName_Tb") {
                ns.setErrorFieldOnClass('.first');
            } else if (inlineErrors[i].PropertyName == "LastName_Tb") {
                ns.setErrorFieldOnClass('.last');
            } else if (inlineErrors[i].PropertyName == "Phone_Tb") {
                ns.setErrorFieldOnClass('.phone');
            } else if (inlineErrors[i].PropertyName == "Email_Tb") {
                ns.setErrorFieldOnClass('.email');
            } else if (inlineErrors[i].PropertyName == "Zip_Tb") {
                ns.setErrorFieldOnClass('.zip');
            } else if (inlineErrors[i].PropertyName == "YourMessage_Tb") {
                ns.setErrorFieldOnClass('.textmessage');
            } else if (inlineErrors[i].PropertyName == "CountyId") {
                ns.setErrorFieldOnClass('#dk_container_ddlCountySendMessage');
                ns.setErrorFieldOnClass('#dk_container_ddlCountyCallMe');
                ns.setErrorFieldOnClass('#dk_container_ddlCountyWebChat');

            }
        }
    };

    ns.setErrorFieldOnClass = function setErrorFieldOnClass(controlClass) {
        $('.popup').find(controlClass).addClass('error-field');
    };

    ns.removeInlineErrorsGetHelp = function removeInlineErrorsGetHelp() {
        $('.popup').find('.error-field').removeClass('error-field');
    };

    ns.refreshCallCenterOpen = function refreshCallCenterOpen(now) {
        if (!(now instanceof Date)) {
            return;
        }

        var openTime = app.viewModels.GetHelpPopupViewModel.todaysOpenTime();
        var closeTime = app.viewModels.GetHelpPopupViewModel.todaysCloseTime();
        var today = app.viewModels.GetHelpPopupViewModel.today();

        var isOpen = false;
        if (openTime && closeTime) {
            if (now.getUTCDay() != today) {
                isOpen = false;
            } else {
                // change javascript date to match the date format from dynamics so we can compare the date objects easily
                now.setUTCFullYear(1900);
                now.setUTCMonth(0);
                now.setUTCDate(1);


                if (now > openTime && now < closeTime) {
                    isOpen = true;
                }
            }
        }
        app.viewModels.GetHelpPopupViewModel.requestCallBackBtn_disabled(!isOpen);
    };

    ns.scrollWebNavigationDD = function scrollWebNavigationDD() {
        $('#sendMessageSubjectDiv').find('.dk_toggle').on('mouseup', function () {
            setTimeout(function () {
                $('.formpage').scrollTop($('.formpage')[0].scrollHeight);
            }, 50);
        });
    };

    ns.scrollCallBackDD = function scrollCallBackDD() {
        $('#dk_container_formwideCallMeBack').find('.dk_toggle').on('mouseup', function () {
            setTimeout(function () {
                $('.formpage').scrollTop($('.formpage')[0].scrollHeight);
            }, 50);
        });
    };

    ns.scrollWebChatDD = function scrollWebChatDD() {
        $('#WebChatSubjectDiv').find('.dk_toggle').on('mouseup', function () {
            setTimeout(function () {
                $('.formpage').scrollTop($('.formpage')[0].scrollHeight);
            }, 50);
        });
    };


    /**************** County Methods ***********************************/

    ns.updateDropkickDropdowns = function () {
        // Okay, so, IE doesn't fire click events on these guys, so for IE we need to listen to mousedown events. This appears to be just when
        // we're also using dropkick, so watch out for that.

        $('#ddlCountySendMessage').parents('li').find('.dk_container').find('li').on(($.browser.msie ? 'mousedown' : 'click'), function () {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            app.viewModels.SendMessageViewModel.countyId(selectedVal);
        });

        $('#ddlCountyCallMe').parents('li').find('.dk_container').find('li').on(($.browser.msie ? 'mousedown' : 'click'), function () {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            app.viewModels.CallMeBackViewModel.countyId(selectedVal);
        });

        $('#ddlCountyWebChat').parents('li').find('.dk_container').find('li').on(($.browser.msie ? 'mousedown' : 'click'), function () {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            app.viewModels.WebChatViewModel.countyId(selectedVal);
        });




    };
    ns.getCountiesForNewZip = function () {
        $('.zip').unbind('keyup');

        $('.zip').keyup(function (keyEventArgs) {
            var input = $(this);
            var zip = input.val();
            ns.queryForCountiesByZip(zip);
        });
        ns.queryForCountiesByZip($('.zip').val());
    };

    ns.queryForCountiesByZip = function (zip) {
        var zipInt = parseInt(zip);

        if (zip.length == 5 && zipInt >= 0 && zipInt < 100000) {
            ns.getCountiesForZipAjax(zip);
        } else {
            app.viewModels.SendMessageViewModel.countyList([]);
            app.viewModels.CallMeBackViewModel.countyList([]);
            app.viewModels.WebChatViewModel.countyList([]);
            app.functions.redrawDropkickBySelectElementId('ddlCountySendMessage');
            app.functions.redrawDropkickBySelectElementId('ddlCountyCallMe');
            app.functions.redrawDropkickBySelectElementId('ddlCountyWebChat');
        }
    };

    ns.getCountiesForZipAjax = function getCountiesForZipAjax(zip) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Geography/GetCountiesByZip",
            dataType: "json",
            data: JSON.stringify({ 'zip': zip }),
            success: function (data) {
                app.viewModels.SendMessageViewModel.countyList(data);
                app.viewModels.CallMeBackViewModel.countyList(data);
                app.viewModels.WebChatViewModel.countyList(data);

                if (data.length == 1) {
                    app.viewModels.SendMessageViewModel.countyId(app.viewModels.SendMessageViewModel.countyList()[0].Id);
                    app.viewModels.CallMeBackViewModel.countyId(app.viewModels.CallMeBackViewModel.countyList()[0].Id);
                    app.viewModels.WebChatViewModel.countyId(app.viewModels.WebChatViewModel.countyList()[0].Id);
                }


                app.functions.redrawDropkickBySelectElementId('ddlCountySendMessage');
                app.functions.redrawDropkickBySelectElementId('ddlCountyCallMe');
                app.functions.redrawDropkickBySelectElementId('ddlCountyWebChat');
                ns.updateDropkickDropdowns();

            }
        });
    };





    /**************** End Of County methods ***************************/

} (EXCHANGE, this));

