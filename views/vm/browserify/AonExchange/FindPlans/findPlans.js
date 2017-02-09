(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.findPlans");
    app.namespace('EXCHANGE.viewModels');

    ns.inlineErrors = new Array();
    ns.zip = "";
    ns.phone = "";
    ns.pendingCountyLookup = false;
    $(document).ready(function () {
        ns.initializePage();
    });

    ns.initializePage = function initializePage() {
        if (location.href.indexOf("othercoverage") > -1) {
            $('#pre65multiplantxt').remove();
            $('#AncMultiplantxt').show();
            $('div.copyright').each(function () { $(this).find('p:not(:first)').hide() });
            $('div.copyright').find('br').remove();
            $("#externallinkpopup").remove();
        }
        app.viewModels.FindPlansViewModel = EXCHANGE.models.FindPlansViewModel();
        app.viewModels.CallUsPopupViewModel = EXCHANGE.models.CallUsPopupViewModel();
        var curMenuIndex = window.location.pathname.lastIndexOf("/") + 1;
        var curMenu = window.location.pathname.substr(curMenuIndex);
        ns.IsIntegratedGuidancePage = false;
        switch (curMenu) {
            case "find-plans.aspx":
            case "find-anc-plan.aspx":
                ko.applyBindings(EXCHANGE.viewModels, $('.container').get(0));
                break;
            case "integrated-guidance.aspx":
                ko.applyBindings(EXCHANGE.viewModels, $('#basicInfo').get(0));
                ns.IsIntegratedGuidancePage = true;
                break;

        }

        ns.finishedUpdatingFindPlansViewModel();
        $('input').customInput();

        ns.detectNeedForDirectedLandingMessageBox();
        ns.zip = app.functions.getKeyValueFromWindowLocation("zip");
        ns.phone = app.functions.getKeyValueFromWindowLocation("phone");
        ns.findPlansModelLoad(ns.zip, ns.phone);
        ns.setupLightboxes();
        ns.wireupJqueryEvents();

    };


    ns.checkForNoPlansFound = function checkForNoPlansFound() {
        var name = "ShowNoPlansLB";
        var string = window.location.href;
        var result = EXCHANGE.functions.getKeyValueFromUrl(name, string);
        app.viewModels.CallUsPopupViewModel.isWarningPopup(true);
        app.viewModels.CallUsPopupViewModel = app.viewModels.CallUsPopupViewModel.setNoPlansErrorText();
        if (result == "true") {
            $.publish('EXCHANGE.lightbox.callus.open');
        }
    };

    ns.setupLightboxes = function setupLightboxes() {
        var callusLb = new app.lightbox.Lightbox({
            name: 'callus',
            divSelector: '#call-us-popup',
            openButtonSelector: '#callus-open-button',
            closeButtonSelector: '#callus-close-button'
        });
    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $('.educational-content-link').live('click', function () {
            window.location = "learn-about-options.aspx";
        });

        $('#seePlansButton').live('click', ns.seePlansClick);

        $('#findPlansSearchForm').on(($.browser.msie ? 'mousedown' : 'click'), 'div#dk_container_month div.dk_options a', function (e) {
            var chosenMonth = $(this).attr('data-dk-dropdown-value');
            var chosenYear = $('#year').val();
            var dayOptions = app.viewModels.FindPlansViewModel.dateOfBirth.DayOptions;
            app.functions.dateDropDownUpdate(chosenMonth, chosenYear, dayOptions);
        });

        ns.getCountiesForNewZip();
        $('#county').css('width', 'auto');
        $('#county').css('z-index', '101');
        if (!ns.IsIntegratedGuidancePage)
            $('#county').css('position', 'relative');

        $('#proceedToSearch').live('click', function () {
            if (EXCHANGE.functions.getKeyValueFromUrl("ShowNoPlansLB", window.location.href) == "true") {
                $.publish('EXCHANGE.lightbox.callus.done');
                app.functions.redirectToRelativeUrlFromSiteBase("find-plans.aspx");
            }
            else {
                if (location.href.indexOf("p=d") > -1)
                    app.functions.redirectToRelativeUrlFromSiteBase("search-dental-results.aspx")
                else if (location.href.indexOf("p=v") > -1)
                    app.functions.redirectToRelativeUrlFromSiteBase("search-vision-results.aspx")
                else
                    app.functions.redirectToRelativeUrlFromSiteBase("search-results.aspx");
            }
        });
        $('#getHelpCallBackBtn').live('click', function () {
            if ((EXCHANGE.user.UserSession.Agent().Id == undefined || EXCHANGE.user.UserSession.Agent().Id() === "00000000-0000-0000-0000-000000000000")) {
                $.publish("EXCHANGE.lightbox.gethelp.open");
                $.publish('EXCHANGE.lightbox.closeAll');
                $.publish("EXCHANGE.lightbox.callback.open");
            }
        });
        $('#getHelpChatBtn').live('click', function () {
            if ((EXCHANGE.user.UserSession.Agent().Id == undefined || EXCHANGE.user.UserSession.Agent().Id() === "00000000-0000-0000-0000-000000000000")) {
                $.publish("EXCHANGE.lightbox.gethelp.open");
                $.publish('EXCHANGE.lightbox.closeAll');
                $.publish("EXCHANGE.lightbox.webchat.open");
            }
        });
        $('#getHelpSendMessageBtn').live('click', function () {
            if ((EXCHANGE.user.UserSession.Agent().Id == undefined || EXCHANGE.user.UserSession.Agent().Id() === "00000000-0000-0000-0000-000000000000")) {
                $.publish("EXCHANGE.lightbox.gethelp.open");
                $.publish('EXCHANGE.lightbox.closeAll');
                $.publish("EXCHANGE.lightbox.sendmessage.open");
            }
        });

    };

    ns.seePlansClick = function seePlansClick() {
        if (!ns.pendingCountyLookup) {
            if (!ns.IsIntegratedGuidancePage)
                EXCHANGE.WaitPopup = $(window).WaitPopup({ contentTemplate: true }); //Spint 9 - Template B for Search Results page
            else {
                EXCHANGE.WaitPopup = $('#tabs').WaitPopup({ hide: true, fullWindow: false });
            }
            ns.hideDirectedLandingMessageBox();
            ns.removeInlineErrors();
            ns.setCoverageBeginsDateInModel();
            ns.setDateValuesInModel();
            ns.setCountyInModel();
            var jsObj = app.viewModels.FindPlansViewModel;
            var paramsJson = JSON.stringify(jsObj.toJS());

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/FindPlan/ValidateApplicantDetails",
                data: paramsJson,
                dataType: "json",
                success: function (data) {
                    var inlineErrorExist = ns.loadInlineErrors(data.ErrorValidationResult);
                    var popupErrorsExist = ns.loadPopupErrors(data.ErrorValidationResult);

                    if (EXCHANGE.viewModels.SearchResultsViewModel != undefined && data.sPlanLists != null) {
                        EXCHANGE.viewModels.SearchResultsViewModel.tab0.allPlans(data.sPlanLists[0]);
                    }
                    if (popupErrorsExist) {
                        app.viewModels.CallUsPopupViewModel.isWarningPopup(true);
                    } else {
                        ns.loadPopupWarnings(data.WarningValidationResult);
                        app.viewModels.CallUsPopupViewModel.isWarningPopup(true);
                    }
                    if (inlineErrorExist) {
                        ns.displayInlineErrors();
                        EXCHANGE.WaitPopup.Close();
                        if (ns.IsIntegratedGuidancePage)
                            return false;
                    } else if (app.viewModels.CallUsPopupViewModel.errorText().length > 0 && !(app.viewModels.FindPlansViewModel.IsAncillary())) {
                        $.publish("EXCHANGE.lightbox.callus.open");
                        EXCHANGE.WaitPopup.Close();
                        if (ns.IsIntegratedGuidancePage)
                            return false;
                    }
                    else if (app.viewModels.CallUsPopupViewModel.errorText().length > 0 && app.viewModels.FindPlansViewModel.IsAncillary()) {
                        $.publish("EXCHANGE.lightbox.callus.open");
                        EXCHANGE.WaitPopup.Close();
                        if (ns.IsIntegratedGuidancePage)
                            return false;
                    }
                    else {
                        if (ns.IsIntegratedGuidancePage) {
                            EXCHANGE.WaitPopup.Close();
                            EXCHANGE.viewModels.findRecommendationsViewModel.currentTab(EXCHANGE.viewModels.findRecommendationsViewModel.currentTab() + 1)
                            $('#ancMedications').click();
                            return true;
                        }
                        if (app.viewModels.FindPlansViewModel.IsAncillary() && app.viewModels.FindPlansViewModel.currentAncSearch() == "vision") {
                            app.functions.redirectToRelativeUrlFromSiteBase("search-vision-results.aspx");
                            return;
                        }
                        if (app.viewModels.FindPlansViewModel.IsAncillary() && app.viewModels.FindPlansViewModel.currentAncSearch() == "dental") {
                            app.functions.redirectToRelativeUrlFromSiteBase("search-dental-results.aspx");
                            return;
                        }
                        if ((EXCHANGE.user.UserSession.Agent().Id == undefined || EXCHANGE.user.UserSession.Agent().Id() === "00000000-0000-0000-0000-000000000000")) {
                            app.functions.redirectToRelativeUrlFromSiteBase("integrated-guidance.aspx");
                        } else
                            app.functions.redirectToRelativeUrlFromSiteBase("/integrated-guidance.aspx");


                    }
                },
                error: function (data) {
                    EXCHANGE.WaitPopup.Close();
                }
            });
        }
    };

    ns.findPlansModelLoad = function findPlansModelLoad(zip, phone) {
        var emptyDetails = {
            UserZip: zip,
            UserPhone: phone
        };

        emptyDetails = JSON.stringify(emptyDetails);

        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.FindPlan.FindPlansClientViewModel");

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/FindPlan/FindPlansClientViewModel",
            data: emptyDetails,
            dataType: "json",
            success: function (data) {
                app.viewModels.CallUsPopupViewModel = app.viewModels.CallUsPopupViewModel.loadFromJSON(data.CallUsPopupViewModel);
                ns.checkForNoPlansFound();
                //validation step
                app.viewModels.FindPlansViewModel = app.viewModels.FindPlansViewModel.loadFromJSON(data.FindPlansViewModel);
                ns.setUpAncillary();
                ns.finishedUpdatingFindPlansViewModel();
                app.functions.addMonthOptionsSubscription(app.viewModels.FindPlansViewModel.dateOfBirth, 'month', true);

                if (ns.IsIntegratedGuidancePage) {
                    $('#findPlansSearchForm').find('.selectfields').dropkick();
                }
                else
                    $('#findPlansSearchForm').find('.selectfield').dropkick();

                app.placeholder.applyPlaceholder();
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.FindPlan.FindPlansClientViewModel");



                $('#dk_container_coverageBeginsSelectList').bind('click', function () {
                    if ($.browser.msie && (parseInt($.browser.version, 10) === 7 || document.documentMode == 7)) {
                        $('.dk_options_inner').css('z-index', '100');
                        $('.dk_options_inner').css('position', 'relative');
                        $('#coverageBeginsDiv').css('z-index', '100');
                        $('#coverageBeginsDiv').css('position', 'relative');
                        $('#dob').css('z-index', '10');
                        $('#dob').css('position', 'relative');
                        $('#county').css('width', 'auto');
                        $('#county').css('z-index', '101');
                        if (!ns.IsIntegratedGuidancePage)
                            $('#county').css('position', 'relative');
                    }
                });

                if (EXCHANGE.functions.getKeyValueFromUrl("a", window.location.href) === "pg") {
                    ns.seePlansClick();
                }
            },
            error: function (data) {
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.FindPlan.FindPlansClientViewModel");
            }
        });
    };

    ns.finishedUpdatingFindPlansViewModel = function finishedUpdatingFindPlansViewModel() {
        $('input[type=radio]').change(function () {
            var label = $(this).parent().children('label');
            var name = $(this).attr('name');

            $(document.getElementsByName(name))
                .parent().children('label')
                .removeClass('checked');

            label.addClass('checked');
        });

        $('input:checked').trigger('change');
        $('.date').blur();
    };

    // loads into the 'callus' popup all error messages that will prevent the user from proceeding to search-results
    ns.loadPopupErrors = function loadPopupErrors(data) {
        var hasPopupErrors = false;

        var errorStr = "";
        for (var i = 0; i < data.Errors.length; i++) {
            var error = data.Errors[i].ErrorMessage;
            if (error.indexOf("popup:") != -1) {
                var errorString = error.substring(error.indexOf("popup:") + "popup:".length);
                errorStr += "<p>" + errorString + "</p>";
                hasPopupErrors = true;
            }
        }
        app.viewModels.CallUsPopupViewModel = app.viewModels.CallUsPopupViewModel.setErrorText(errorStr);
        return hasPopupErrors;
    };

    // Loads into the 'callus' popup all warnings that the user must see before continuing on 
    // to search-results. Assumes no errors were previously loaded by ns.loadPopupErrors. 
    ns.loadPopupWarnings = function loadPopupWarnings(data) {
        var warningStr = "";
        for (var i = 0; i < data.Errors.length; ++i) {
            var error = data.Errors[i].ErrorMessage;
            if (error.indexOf("warning:") != -1) {
                var warningString = error.substring(error.indexOf("warning:") + "warning:".length);
                warningStr += "<p>" + warningString + "</p>";
            }
        }
        app.viewModels.CallUsPopupViewModel = app.viewModels.CallUsPopupViewModel.setErrorText(warningStr);
    };

    ns.loadInlineErrors = function loadInlineErrors(data) {
        var hasInlineErrors = false;


        app.viewModels.FindPlansViewModel.clearInlineErrors();
        ns.inlineErrors = [];
        for (var i = 0; i < data.Errors.length; i++) {
            var error = data.Errors[i].ErrorMessage;
            if (error.indexOf("inline:") != -1) {
                var errorString = error.substring(error.indexOf("inline:") + "inline:".length);
                //        Bug 50789: Modified the logic
                if (data.Errors[i].PropertyName == "CountyId") {
                    if (app.viewModels.FindPlansViewModel.showCountyList()) {
                        ns.inlineErrors.push(data.Errors[i]);
                        app.viewModels.FindPlansViewModel.addInlineError(errorString);
                        hasInlineErrors = true;
                    }
                }
                else {
                    ns.inlineErrors.push(data.Errors[i]);
                    app.viewModels.FindPlansViewModel.addInlineError(errorString);
                    hasInlineErrors = true;
                }
                //       Bug 50789: Ends here
            }
        }
        if (ns.IsIntegratedGuidancePage && EXCHANGE.functions.getDropdownSelectedValueBySelectElementId('productTypesSelectList') == "3") {
            app.viewModels.FindPlansViewModel.addInlineError("A valid Coverage type is required to find plans.");
            hasInlineErrors = true;
        }
        return hasInlineErrors;
    };

    ns.displayInlineErrors = function displayInlineErrors() {
        for (var i = 0; i < ns.inlineErrors.length; i++) {
            if (ns.inlineErrors[i].PropertyName == "UserZip") {
                $('.IcolR').find('.zip').addClass('error-field');
            } else if (ns.inlineErrors[i].PropertyName == "CoverageBegins") {
                $('.IcolR').find('#dk_container_coverageBeginsSelectList').addClass('error-field');
            } else if (ns.inlineErrors[i].PropertyName == "DateOfBirth_Year_Val") {
                $('.IcolR').find('#dk_container_year').addClass('error-field');
            } else if (ns.inlineErrors[i].PropertyName == "DateOfBirth_Month_Val") {
                $('.IcolR').find('#dk_container_month').addClass('error-field');
            } else if (ns.inlineErrors[i].PropertyName == "DateOfBirth_Day_Val") {
                $('.IcolR').find('#dk_container_day').addClass('error-field');
            } else if (ns.inlineErrors[i].PropertyName == "DOB") {
                // "DateOfBirth" is a calculated property representing the collection of all three dob fields
                $('.IcolR').find('#dk_container_year').addClass('error-field');
                $('.IcolR').find('#dk_container_month').addClass('error-field');
                $('.IcolR').find('#dk_container_day').addClass('error-field');
            }
            else if (ns.inlineErrors[i].PropertyName == "IsGenderMale") {
                $('.IcolR').find('.genderselect').addClass('error-field');
            } else if (ns.inlineErrors[i].PropertyName == "IsTobaccoUser") {
                $('.IcolR').find('.tobaccoselect').addClass('error-field');
            } else if (ns.inlineErrors[i].PropertyName == "IsDisabled") {
                $('.IcolR').find('.disabledselect').addClass('error-field');
            } else if (ns.inlineErrors[i].PropertyName == "IsKidneyFailure") {
                $('.IcolR').find('.esrdselect').addClass('error-field');
            } else if (ns.inlineErrors[i].PropertyName == "CountyId") {
                $('.IcolR').find('#ddlCountyFindPlans').siblings('.dk_container').addClass('error-field');
            }
        }
        if (ns.IsIntegratedGuidancePage && EXCHANGE.functions.getDropdownSelectedValueBySelectElementId('productTypesSelectList') == "3") {
            $('.IcolR').find('#dk_container_productTypesSelectList').addClass('error-field');
        }
    };

    ns.removeInlineErrors = function removeInlineErrors() {
        $($('.IcolR').find('ul')[1]).children('li').each(function () {
            $(this).children('input').removeClass('error-field');
            $(this).children('select').removeClass('error-field');
            $(this).children('div').removeClass('error-field');
            $('div div.dk_container', this).removeClass('error-field');
        });
        $('.IcolR').find('#dk_container_coverageBeginsSelectList').removeClass('error-field');
        if (ns.IsIntegratedGuidancePage) {
            $('.IcolR').find('#dk_container_productTypesSelectList').removeClass('error-field');
        }
    };

    ns.setCoverageBeginsDateInModel = function setCoverageBeginsDateInModel() {
        var coverageBegins = app.functions.getDropdownSelectedOption('#coverageBeginsDiv');
        app.viewModels.FindPlansViewModel = app.viewModels.FindPlansViewModel.coverageBegins_tb(coverageBegins);
    };

    ns.setDateValuesInModel = function setDateValuesInModel() {
        var monthVal = app.functions.getDropdownSelectedValueBySelectElementId('month');
        app.viewModels.FindPlansViewModel.dateOfBirth.Month(monthVal);
        var dayVal = app.functions.getDropdownSelectedValueBySelectElementId('day');
        app.viewModels.FindPlansViewModel.dateOfBirth.Day(dayVal);
        var yearVal = app.functions.getDropdownSelectedValueBySelectElementId('year');
        app.viewModels.FindPlansViewModel.dateOfBirth.Year(yearVal);
    };

    ns.setCountyInModel = function setCountyInModel() {
        if (app.viewModels.FindPlansViewModel.showCountyList()) {
            var countyId = app.functions.getDropdownSelectedValueBySelectElementId('ddlCountyFindPlans');
            app.viewModels.FindPlansViewModel.countyId(countyId);
        } else if (app.viewModels.FindPlansViewModel.countyList() && (app.viewModels.FindPlansViewModel.countyList().length > 0)) {
            var countyId = app.viewModels.FindPlansViewModel.countyList()[0].Id;
            app.viewModels.FindPlansViewModel.countyId(countyId);
        } else {
            // In this case, we don't have a legit zip code and will catch that on server validation.
            countyId = null;
        }
    };

    ns.closeLightboxes = function closeLightboxes() {
        $.publish("EXCHANGE.lightbox.closeAll");
    };

    ns.getCountiesForNewZip = function () {
        $('#txtZIPCodeFindPlans').unbind('keyup');

        $('#txtZIPCodeFindPlans').keyup(function (keyEventArgs) {
            var input = $(this);
            var zip = input.val();
            var zipInt = parseInt(zip);

            if (zip.length == 5 && zipInt >= 0 && zipInt < 100000) {
                if (!ns.pendingCountyLookup) {
                    ns.pendingCountyLookup = true;
                    ns.getCountiesForZipAjax(zip);
                }
            } else {
                app.viewModels.FindPlansViewModel.countyList([]);
                app.functions.redrawDropkickBySelectElementId('ddlCountyFindPlans');
            }

        });
    };

    ns.getCountiesForZipAjax = function getCountiesForZipAjax(zip) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Geography/GetCountiesByZip",
            dataType: "json",
            data: JSON.stringify({ 'zip': zip }),
            success: function (data) {
                app.viewModels.FindPlansViewModel.countyList(data);

                if (app.viewModels.FindPlansViewModel.countyList().length == 1) {
                    app.viewModels.FindPlansViewModel.countyId(app.viewModels.FindPlansViewModel.countyList()[0].Id);
                }
                $('#county').css('width', 'auto');
                $('#county').css('z-index', '101');
                if (!ns.IsIntegratedGuidancePage)
                    $('#county').css('position', 'relative');

                app.functions.redrawDropkickBySelectElementId('ddlCountyFindPlans');
                if (zip != $('#txtZIPCodeFindPlans').val()) {
                    ns.getCountiesForZipAjax(app.viewModels.FindPlansViewModel.userZip_tb());
                } else {
                    ns.pendingCountyLookup = false;
                }
            },
            failure: function () {
                ns.pendingCountyLookup = false;
            }
        });
    };

    ns.detectNeedForDirectedLandingMessageBox = function detectNeedForDirectedLandingMessageBox() {
        // If this was a redirect from the Directed Landing page, the query string will indicate as such. 
        // Assumes code to set up the view model has already been run and view model is available.
        var isFromDirectedLanding = app.functions.getKeyValueFromWindowLocation("message");
        if (isFromDirectedLanding == "true") {
            app.viewModels.FindPlansViewModel.isFromDirectedLanding(true);
        } else {
            app.viewModels.FindPlansViewModel.isFromDirectedLanding(false);
        }
    };

    ns.hideDirectedLandingMessageBox = function hideDirectedLandingMessageBox() {
        // Note: It is possible the message box is already hidden.
        app.viewModels.FindPlansViewModel.isFromDirectedLanding(false);
    };

    ns.setUpAncillary = function setUpAncillary() {
        if (location.href.indexOf("find-anc-plan") > -1) {
            app.viewModels.FindPlansViewModel.IsAncillary(true);
            if (location.search.indexOf("p=d") > -1)
                app.viewModels.FindPlansViewModel.currentAncSearch("dental");
            else
                app.viewModels.FindPlansViewModel.currentAncSearch("vision");
            app.viewModels.FindPlansViewModel.isDisabled_radio(false);
            app.viewModels.FindPlansViewModel.isKidneyFailure_radio(false);
            app.viewModels.FindPlansViewModel.isTobaccoUser_radio(false);
        } else {
            app.viewModels.FindPlansViewModel.IsAncillary(false);
            app.viewModels.FindPlansViewModel.isDisabled_radio();
            app.viewModels.FindPlansViewModel.isKidneyFailure_radio();
            app.viewModels.FindPlansViewModel.isTobaccoUser_radio();
        }
    };


} (EXCHANGE));
