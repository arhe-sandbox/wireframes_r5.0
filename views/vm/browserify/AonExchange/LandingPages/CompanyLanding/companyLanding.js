(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.companyLanding');
    app.namespace("EXCHANGE.viewModels");

    ns.afterCartMerge = null;

    $(document).ready(function () {
        ns.initializeCompanyLanding();
    });

    ns.initializeCompanyLanding = function initializeCompanyLanding() {
        ns.selectMyAccountTab();
        ns.setupViewModels();
        ns.loadData();
        ns.wireupJqueryEvents();

        var firstFocus = document.getElementById("txtLastName");
        // setTimeout(function () {
        //     $(firstFocus).focus();
        // }, 100);

        if (app.functions.getKeyValueFromWindowLocation('navigatorid')) {
            app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.FindAccountViewModel.NavigatorsIdSetFromQueryString(true);
            app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.FindAccountViewModel.NavigatorsId(app.functions.getKeyValueFromWindowLocation('navigatorid'));
        }

        var companyAuthOptionsCreateAccountAuthLb = new EXCHANGE.lightbox.Lightbox({
            name: 'companyauthoptionscreateaccountauth',
            divSelector: '#company-auth-options-create-account-auth-popup',
            openButtonSelector: '#company-auth-options-create-account-auth-open-button',
            closeButtonSelector: '#company-auth-options-create-account-auth-close-button',

            beforeSubmit: function () {
                ns.submitNewAccountInfo();
                return false;
            },
            afterClose: function () {
            }
        });
    };

    ns.selectMyAccountTab = function selectMyAccountTab() {
        $('.MyAccountMenuItem').removeClass('CMSListMenuLI').addClass('CMSListMenuHighlightedLI');
        $('.MyAccountMenuItem > a').removeClass('CMSListMenuLink').addClass('CMSListMenuLinkHighlighted');
    };

    ns.setupViewModels = function setupViewModels() {
        if (!app.viewModels.CompanyLandingPageViewModels) {
            app.viewModels.CompanyLandingPageViewModels = app.models.CompanyLandingPageViewModels();
            app.viewModels.CompanyLandingPageViewModels.CreateAccountAuthViewModel.backButtonClass('lightbox-back-companyauthoptionscreateaccountauth');
            app.viewModels.CompanyLandingPageViewModels.CreateAccountAuthViewModel.continueButtonClass('lightbox-done-companyauthoptionscreateaccountauth');

            // Both of these are located in CompanyAuthOptions.ascx
            ko.applyBindings(app.viewModels.CompanyLandingPageViewModels, $('#company-auth-options').get(0));
            ko.applyBindings(app.viewModels.CompanyLandingPageViewModels, $('#company-auth-options-create-account-auth-popup').get(0));
            if ($('#u65')[0] !== undefined)
                ko.applyBindings(app.viewModels.CompanyLandingPageViewModels, $('#u65').get(0));
            if ($('#pre65_sm')[0] !== undefined)
                ko.applyBindings(app.viewModels.CompanyLandingPageViewModels, $('#pre65_sm').get(0));

            ko.applyBindings(app.viewModels.CompanyLandingPageViewModels, $('#help-box').get(0));
        }
    };

    ns.loadData = function loadData() {

        var argsObj =
            {
                CampaignCode: app.functions.getKeyValueFromWindowLocation("camp"),
                TrackingCode1: app.functions.getKeyValueFromWindowLocation("t1"),
                TrackingCode2: app.functions.getKeyValueFromWindowLocation("t2")
            };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/CompanyLanding/CompanyLandingPageViewModels",
            data: JSON.stringify(argsObj),
            dataType: "json",
            success: function (data) {
                var companyLandingPageViewModels = data;

                var IsRedirectRequired = companyLandingPageViewModels.IsRedirectRequired;

                if (IsRedirectRequired) {
                    app.functions.redirectToRelativeUrlFromSiteBase("home.aspx");
                } else {
                    app.viewModels.CompanyLandingPageViewModels = app.viewModels.CompanyLandingPageViewModels.loadFromJSON(companyLandingPageViewModels);

                    var dateOfBirthViewModel = app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.FindAccountViewModel.dateOfBirth;
                    app.functions.addMonthOptionsSubscription(dateOfBirthViewModel, 'month', true);

                    // Now that we have presumably loaded all dateOfBirth data into the view model, activate the dropkicks
                    ns.displayDropkicks();
                }
            },
            error: function (data) {
                alert("Error in companyLanding loadData! Placeholder; a better error message is needed here!");
            }
        });
    };

    ns.displayDropkicks = function displayDropkicks() {
        $('#company-auth-options').find('.selectfield').dropkick();
    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $('#btnFirstAccessContinue').bind('click', ns.submitQuestionData);
        $('.pre65_lg_urlbox').bind('click', ns.trackPre65);
        $('.pre65_sm_url').bind('click', ns.trackPre65);
        // If a new month is selected, the available values in the "Date" dropdown must change to reflect that month
        $('#company-auth-options').on(($.browser.msie ? 'mousedown' : 'click'), 'div#dk_container_month div.dk_options a', function (e) {
            var chosenMonth = $(this).attr('data-dk-dropdown-value');
            var chosenYear = $('#year').val();
            var dayOptions = app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.FindAccountViewModel.dateOfBirth.DayOptions;
            app.functions.dateDropDownUpdate(chosenMonth, chosenYear, dayOptions);
        });

        $('#txtZIPCode').live('keyup', function () {
            var input = $(this);
            var zip = input.val();
            var zipInt = parseInt(zip);

            if (zip.length == 5 && zipInt >= 0 && zipInt < 100000) {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/API/Geography/GetCountiesByZip",
                    dataType: "json",
                    data: JSON.stringify({ 'zip': zip }),
                    success: function (data) {
                        app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.FindAccountViewModel.CountyList(data);
                        $('.addr-county-dd').children('.dk_container').remove();
                        input.parents('ul').find('.selectcounty').dropkick();
                        ns.updateDropkickDropdowns();
                    }
                });
            } else {
                app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.FindAccountViewModel.CountyList([]);
                $('.addr-county-dd').children('.dk_container').remove();
                input.parents('ul').find('.selectcounty').dropkick();
                ns.updateDropkickDropdowns();
            }
        });
    };

    ns.updateDropkickDropdowns = function updateDropkickDropdowns() {
        $('.selectcounty').parents('li').find('.dk_container').find('li').on(($.browser.msie ? 'mousedown' : 'click'), function () {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.FindAccountViewModel.County(selectedVal);
        });
    };

    ns.getPagePath = function getPagePath() {
        var label = "Account Claimed";
        var company = "";
        if (location.pathname.indexOf("/") !== -1) {
            company = location.pathname.substring(1).toUpperCase();
        }
        label = "{{" + label + " - " + company + "}}";
        console.log(label);
        return label;
    };

    ns.submitQuestionData = function submitQuestionData() {
        var viewModel = app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel;

        // only need to copy date values from dropkick selects if we're actually on 
        // the template with the date of birth dropdown. 
        if (viewModel.FindAccountViewModel.FindAccountPanelTemplateName() == viewModel.FindAccountViewModel.INITIAL_TEMPLATE_NAME) {
            ns.setDateValuesInModel(viewModel);
        }

        // place spinner on button until validation results are available for display
        var $submitDataSpinner = $('#btnFirstAccessContinue').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });

        var postArgs = {};
        postArgs.FindAccountArgs = viewModel.FindAccountViewModel.toFindAccountArgs();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/CompanyLanding/CompanyLandingFirstTimeUserValidation",
            data: JSON.stringify(postArgs),
            dataType: "json",
            success: function (data) {
                ns.clearFindAccountErrors(viewModel);

                var serverValidationModel = data;
                var findAccountValidationModel = serverValidationModel.FindAccountValidationModel;
                var findAccountValidationResult = findAccountValidationModel.ValidationResult;

                viewModel.FindAccountViewModel.HasMatchError(findAccountValidationModel.DisplayMatchNotFoundMessage);

                var wasOnMultiMatch = (viewModel.FindAccountViewModel.FindAccountPanelTemplateName() == viewModel.FindAccountViewModel.MULTIMATCH_TEMPLATE_NAME);

                if (findAccountValidationResult.IsValid) {
                    if (findAccountValidationModel.DisplayMultipleMatchesTemplate) {
                        // need logic here to flip from one template to the other if necessary
                        viewModel.FindAccountViewModel.FindAccountPanelTemplateName(viewModel.FindAccountViewModel.MULTIMATCH_TEMPLATE_NAME);
                        viewModel.FindAccountViewModel.MultipleMatchFlag(true);

                        // app.findAccount.handleValidation(findAccountValidationModel, viewModel.FindAccountViewModel);
                    } else {
                        viewModel.FindAccountViewModel.FindAccountPanelTemplateName(viewModel.FindAccountViewModel.INITIAL_TEMPLATE_NAME);
                        viewModel.FindAccountViewModel.MultipleMatchFlag(false);

                        if (wasOnMultiMatch) {
                            ns.displayDropkicks();
                        }
                    }
                }

                $submitDataSpinner.Stop();

                if (findAccountValidationResult.IsValid && !findAccountValidationModel.DisplayMultipleMatchesTemplate && !findAccountValidationModel.DisplayMatchNotFoundMessage && !findAccountValidationModel.UserAccountExists) {
                    var path = ns.getPagePath();
                    if (_gaq) {
                        _gaq.push(['_trackEvent', 'form', 'submitted', path]);
                    }
                    $.publish('EXCHANGE.lightbox.companyauthoptionscreateaccountauth.open');
                } else if (findAccountValidationModel.UserAccountExists) {
                    EXCHANGE.viewModels.LoginViewModel.displayAccountExistsContent(true);
                    $.publish("EXCHANGE.lightbox.login.open");
                } else {
                    // app.findAccount.handleValidation(findAccountValidationModel, viewModel.FindAccountViewModel);
                    ns.loadFindAccountErrors(serverValidationModel.FindAccountValidationModel.ValidationResult.Errors, viewModel);
                }
            },
            error: function () {
                $submitDataSpinner.Stop();
            }
        });
    };

    ns.setDateValuesInModel = function setDateValuesInModel(viewModel) {
        var dobViewModel = viewModel.FindAccountViewModel.dateOfBirth;

        var yearVal = app.functions.getDropdownSelectedValueBySelectElementId("year");
        dobViewModel.Year(yearVal);
        var monthVal = app.functions.getDropdownSelectedValueBySelectElementId("month");
        dobViewModel.Month(monthVal);
        var dayVal = app.functions.getDropdownSelectedValueBySelectElementId("day");
        dobViewModel.Day(dayVal);

    };

    ns.removeDropkicks = function removeDropkicks() {
        app.functions.removeDropkickBySelectElementId("year");
        app.functions.removeDropkickBySelectElementId("month");
        app.functions.removeDropkickBySelectElementId("day");
    };

    ns.loadFindAccountErrors = function loadFindAccountErrors(inlineErrors, viewModel) {
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "LastName") {
                ns.setErrorFieldFindAccount('#txtLastName');
            } else if (inlineErrors[i].PropertyName == "ZIPCode") {
                ns.setErrorFieldFindAccount('#txtZIPCode');
            } else if (inlineErrors[i].PropertyName == "SSNOrNavigatorsId") {
                ns.setErrorFieldFindAccount('#txtSSN');
                ns.setErrorFieldFindAccount('#txtNavigatorsId');
            } else if (inlineErrors[i].PropertyName == "NavigatorsId") {
                ns.setErrorFieldFindAccount('#txtNavigatorsIdMultiple');
            } else if (inlineErrors[i].PropertyName == "DOB") {
                ns.setErrorFieldFindAccount('#dk_container_year');
                ns.setErrorFieldFindAccount('#dk_container_month');
                ns.setErrorFieldFindAccount('#dk_container_day');
            } else if (inlineErrors[i].PropertyName == "CountyId") {
                ns.setErrorFieldFindAccount("#dd-select-county");
            }
            viewModel.FindAccountViewModel.Errors.push(inlineErrors[i].ErrorMessage);
        }
    };

    ns.clearFindAccountErrors = function clearTextboxErrorHighlighting(viewModel) {
        viewModel.FindAccountViewModel.HasMatchError(false);
        viewModel.FindAccountViewModel.Errors([]);
        ns.clearErrorFieldFindAccount('#txtLastName');
        ns.clearErrorFieldFindAccount('#dk_container_year');
        ns.clearErrorFieldFindAccount('#dk_container_month');
        ns.clearErrorFieldFindAccount('#dk_container_day');
        ns.clearErrorFieldFindAccount('#txtZIPCode');
        ns.clearErrorFieldFindAccount('#txtLastName');
        ns.clearErrorFieldFindAccount('#txtSSN');
        ns.clearErrorFieldFindAccount('#txtNavigatorsId');
        ns.clearErrorFieldFindAccount('#dd-select-county');
    };

    ns.setErrorFieldFindAccount = function setErrorFieldOnClass(controlSelector) {
        $('#company-auth-options').find(controlSelector).addClass('error-field');
    };

    ns.clearErrorFieldFindAccount = function setErrorFieldOnClass(controlSelector) {
        $('#company-auth-options').find(controlSelector).removeClass('error-field');
    };

    ns.submitNewAccountInfo = function submitNewAccountInfo() {
        var viewModel = app.viewModels.CompanyLandingPageViewModels;

        var $accountInfoSpinner = $('.lightbox-done-companyauthoptionscreateaccountauth').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
        ns.clearAuthLightboxErrors();

        var newAccount = {
            Username: viewModel.CreateAccountAuthViewModel.username_tb(),
            Password1: viewModel.CreateAccountAuthViewModel.pw1_tb(),
            Password2: viewModel.CreateAccountAuthViewModel.pw2_tb(),
            ClientCode: app.functions.getClientCode()
        };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/CompanyLanding/CompanyLandingCreateAccount",
            dataType: "json",
            data: JSON.stringify(newAccount),
            success: function (serverViewModel) {
                ns.clearAuthLightboxErrors();
                $accountInfoSpinner.Stop();

                if (serverViewModel.ValidationResult.IsValid) {
                    app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.RedirectToMyActionNeededFlag = true;
                    app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.IsPre65 = serverViewModel.LoginValidationModel.LoginForwardResult.IsUserPre65;
                    app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.IsPrimaryClientConfig = serverViewModel.LoginValidationModel.LoginForwardResult.IsUsersPrimaryClientPre65Config;
                    app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.IsCurrentClientConfig = serverViewModel.LoginValidationModel.LoginForwardResult.IsUsersCurrentClientPre65Config;

                    //copy / pasted and edited, from login.js
                    var loginViewModel = serverViewModel.LoginValidationModel;
                    if (loginViewModel.LoginConflictViewModel.IsConflict) {
                        ns.checkProfileConflict();
                    } else {
                        var path = ns.getPagePath();
                        if (_gaq) {
                            _gaq.push(['_trackEvent', 'Account Creation Step 2', 'Submit', path]);
                        }
                        app.login.setQueryStringAndReload();
                    }
                    if (serverViewModel.AlertsCount > 0) {
                        app.functions.redirectToRelativeUrlFromSiteBase("my-action-needed.aspx");
                    }
                    else
                        app.functions.redirectToRelativeUrlFromSiteBase("my-account.aspx");
                    //end copy paste
                } else {
                    ns.loadAuthLightboxErrors(serverViewModel.ValidationResult.Errors);
                }

            }
        });
    };

    ns.checkProfileConflict = function checkProfileConflict() {
        app.viewModels.LoginConflictViewModel.doneCallback = app.login.setQueryStringAndReload;
        $.publish("EXCHANGE.lightbox.companyauthoptionscreateaccountauth.close");
        $.publish("EXCHANGE.lightbox.loginconflict.open");
    };


    ns.clearAuthLightboxErrors = function clearAuthLightboxErrors() {
        app.viewModels.CompanyLandingPageViewModels.CreateAccountAuthViewModel.errors([]);
        $('#companyauthoptionscreateaccountpopup').find('input').removeClass('error-field');
    };

    ns.setErrorFieldOnAuthLightbox = function setErrorFieldOnAuthLightbox(controlClass) {
        $('#companyauthoptionscreateaccountpopup').find(controlClass).addClass('error-field');
    };

    ns.loadAuthLightboxErrors = function loadAuthLightboxErrors(inlineErrors) {
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "Username") {
                ns.setErrorFieldOnAuthLightbox('.username');
            } else if (inlineErrors[i].PropertyName == "Password1" || inlineErrors[i].PropertyName == "Password2") {
                ns.setErrorFieldOnAuthLightbox('.password1');
                ns.setErrorFieldOnAuthLightbox('.password2');
            }
            app.viewModels.CompanyLandingPageViewModels.CreateAccountAuthViewModel.errors.push(inlineErrors[i].ErrorMessage);
        }
    };

    ns.trackPre65 = function trackPre65() {
        if (typeof _gaq !== 'undefined') {
            _gaq.push(['_trackEvent', 'Pre 65 Promotion', app.viewModels.Pre65VM.Pre65Url(), app.companyLanding.clientCode]);
        }
    };


} (EXCHANGE));
