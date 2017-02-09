(function (app) {
    var ns = app.namespace('EXCHANGE.firstimeuser');
    app.namespace("EXCHANGE.viewModels");

    ns.afterCartMerge = null;
    var $waitPopup;


    $(document).ready(function () {
        ns.selectMyAccountTab();
        ns.initializePage();
        ns.wireupJqueryEvents();
    });

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $(document).on('click', '#btnFindAccountSubmit', ns.validateFindAccount);

        // If a new month is selected, the available values in the "Date" dropdown must change to reflect that month
        // Must attach the ".on()" to the element with id "first-time-user", not the element with id "firstTimeUserSearchForm", because the latter 
        // is not always on the page and the former is. 
        $('#first-time-user').on(($.browser.msie ? 'mousedown' : 'click'), 'div#dk_container_month div.dk_options a', function (e) {
            var chosenMonth = $(this).attr('data-dk-dropdown-value');
            var chosenYear = $('#year').val();
            var dayOptions = app.viewModels.FindAccountViewModel.dateOfBirth.DayOptions;
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
                        app.viewModels.FindAccountViewModel.CountyList(data);

                        if (app.viewModels.FindAccountViewModel.CountyList().length == 1) {
                            app.viewModels.FindAccountViewModel.County(app.viewModels.FindAccountViewModel.CountyList()[0].Id);
                        }

                        $('.addr-county-dd').children('.dk_container').remove();
                        input.parents('ul').find('.selectcounty').dropkick();
                        ns.updateDropkickDropdowns();
                    }
                });
            } else {
                app.viewModels.FindAccountViewModel.CountyList([]);
                $('.addr-county-dd').children('.dk_container').remove();
                input.parents('ul').find('.selectcounty').dropkick();
                ns.updateDropkickDropdowns();
            }

        });
    };

    ns.updateDropkickDropdowns = function updateDropkickDropdowns() {
        $('.selectcounty').parents('li').find('.dk_container').find('li').on(($.browser.msie ? 'mousedown' : 'click'), function () {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            app.viewModels.FindAccountViewModel.County(selectedVal);
        });
    };

    ns.selectMyAccountTab = function selectMyAccountTab() {
        $('.MyAccountMenuItem').removeClass('CMSListMenuLI').addClass('CMSListMenuHighlightedLI');
        $('.MyAccountMenuItem > a').removeClass('CMSListMenuLink').addClass('CMSListMenuLinkHighlighted');
    };

    ns.initializePage = function initializePage() {

        app.viewModels.FirstTimeUserViewModel = app.models.FirstTimeUserViewModel();
        app.viewModels.FirstTimeUserViewModel.FindAccountTemplateName('find-account-template');

        app.viewModels.FindAccountViewModel = app.models.FindAccountViewModel();

        app.viewModels.FirstTimeUserCreateAccountAuthViewModel = app.models.CreateAccountAuthViewModel();
        app.viewModels.FirstTimeUserCreateAccountAuthViewModel.backButtonClass('lightbox-back-firsttimeusercreateaccountauth');
        app.viewModels.FirstTimeUserCreateAccountAuthViewModel.continueButtonClass('lightbox-done-firsttimeusercreateaccountauth');

        if (app.functions.getKeyValueFromWindowLocation('noemail')) {
            app.viewModels.FirstTimeUserViewModel.ShowNoEmailWarning(true);
        }

        if (app.functions.getKeyValueFromWindowLocation('navigatorid')) {
            app.viewModels.FindAccountViewModel.NavigatorsIdSetFromQueryString(true);
            app.viewModels.FindAccountViewModel.NavigatorsId(app.functions.getKeyValueFromWindowLocation('navigatorid'));
        }

        var firstTimeUserCreateAccountAuthLb = new EXCHANGE.lightbox.Lightbox({
            name: 'firsttimeusercreateaccountauth',
            divSelector: '#first-time-user-create-account-auth-popup',
            openButtonSelector: '#first-time-user-create-account-auth-open-button',
            closeButtonSelector: '#first-time-user-create-account-auth-close-button',
            beforeOpen: function () {
                ko.applyBindings(app.viewModels, $('#first-time-user-create-account-auth-popup').get(0));

                return true;
            },
            beforeSubmit: function () {
                ns.submitNewAccountInfo();
                return false;
            },
            afterClose: function () {
            }
        });

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/FindAccount/FirstTimeUserClientViewModel",
            dataType: "json",
            success: function (serverPageViewModels) {
                app.viewModels.FirstTimeUserViewModel.loadFromJSON(serverPageViewModels.FirstTimeUserViewModel);
                app.viewModels.FindAccountViewModel.loadFromJSON(serverPageViewModels.FindAccountViewModel);
                app.viewModels.FirstTimeUserCreateAccountAuthViewModel.loadFromJSON(serverPageViewModels.CreateAccountAuthViewModel);

                $('#firstTimeUserSearchForm').find('.selectfield').dropkick();
                app.functions.addMonthOptionsSubscription(app.viewModels.FindAccountViewModel.dateOfBirth, 'month', false);
                ns.updatePageTitleIfCalledAsPswdReset();
            }
        });

        ko.applyBindings(app.viewModels, $('.first-time-user').get(0));
        $('input').customInput();

    };

    ns.validateFindAccount = function validateFindAccount() {

        var preValidationTemplateName = app.viewModels.FirstTimeUserViewModel.FindAccountTemplateName();

        // only need to copy values from dropkick selects if we're actually on 
        // the template with the dropdowns.
        if (preValidationTemplateName == 'find-account-template') {
            ns.setDateValuesInModel();
        }

        var $findAccountSpinner = $('#btnFindAccountSubmit').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });

        var findAccountArgs = app.viewModels.FindAccountViewModel.toFindAccountArgs();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/FindAccount/FirstTimeUserValidation",
            dataType: "json",
            data: JSON.stringify(findAccountArgs),
            success: function (serverValidationModel) {
                ns.clearFindAccountErrors();

                var validationResult = serverValidationModel.ValidationResult;
                app.viewModels.FindAccountViewModel.HasMatchError(serverValidationModel.DisplayMatchNotFoundMessage);

                if (validationResult.IsValid) {
                    if (serverValidationModel.DisplayMultipleMatchesTemplate) {
                        app.viewModels.FirstTimeUserViewModel.FindAccountTemplateName('multiple-matches-template');
                        app.viewModels.FindAccountViewModel.MultipleMatchFlag(true);
                    }
                    else {
                        app.viewModels.FirstTimeUserViewModel.FindAccountTemplateName('find-account-template');
                        app.viewModels.FindAccountViewModel.MultipleMatchFlag(false);
                        if (preValidationTemplateName == 'multiple-matches-template') {
                            // we are transitioning back to the template panel with the dropdowns, so re-bind default values 
                            // of selects and re-generate dropkicks
                            var dateOfBirthViewModel = app.viewModels.FindAccountViewModel.dateOfBirth;
                            $('#firstTimeUserSearchForm').find('#year').val(dateOfBirthViewModel.Year());
                            $('#firstTimeUserSearchForm').find('#month').val(dateOfBirthViewModel.Month());
                            $('#firstTimeUserSearchForm').find('#day').val(dateOfBirthViewModel.Day());
                            $('#firstTimeUserSearchForm').find('.selectfield').dropkick();
                        }
                    }
                }
                // if there are validation errors, then keep whatever template panel and multiple match status is already being displayed

                $findAccountSpinner.Stop();

                if (validationResult.IsValid && !app.viewModels.FindAccountViewModel.HasMatchError() && !serverValidationModel.DisplayMultipleMatchesTemplate && !serverValidationModel.UserAccountExists) {
                    $.publish('EXCHANGE.lightbox.firsttimeusercreateaccountauth.open');
                } else if (serverValidationModel.UserAccountExists) {
                    //EXCHANGE.viewModels.LoginViewModel.displayAccountExistsContent(true);
                    EXCHANGE.viewModels.FirstTimeUserCreateAccountAuthViewModel.headerTitleLbl('Update Account');
                    EXCHANGE.viewModels.FirstTimeUserCreateAccountAuthViewModel.createAccount_lbl('Update Account');
                    EXCHANGE.viewModels.FirstTimeUserCreateAccountAuthViewModel.step2_lbl('Account Credentials');
                    EXCHANGE.viewModels.FirstTimeUserCreateAccountAuthViewModel.continue_lbl('Update my Account');
                    $.publish('EXCHANGE.lightbox.firsttimeusercreateaccountauth.open');
                    //$.publish("EXCHANGE.lightbox.login.open");
                } else {
                    ns.loadFindAccountErrors(validationResult.Errors);
                }
            }
        });
    };

    ns.setDateValuesInModel = function setDateValuesInModel() {
        var monthVal = app.functions.getDropdownSelectedValueBySelectElementId('month');
        app.viewModels.FindAccountViewModel.dateOfBirth.Month(monthVal);

        var dayVal = app.functions.getDropdownSelectedValueBySelectElementId('day');
        app.viewModels.FindAccountViewModel.dateOfBirth.Day(dayVal);

        var yearVal = app.functions.getDropdownSelectedValueBySelectElementId('year');
        app.viewModels.FindAccountViewModel.dateOfBirth.Year(yearVal);
    };

    ns.loadFindAccountErrors = function loadFindAccountErrors(inlineErrors) {
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
                if ($('#first-time-user').find("#dk_container_dd-select-county") != undefined &&
                 $('#first-time-user').find("#dk_container_dd-select-county").length > 0) {
                    ns.setErrorFieldFindAccount("#dk_container_dd-select-county");
                }
            }
            app.viewModels.FindAccountViewModel.Errors.push(inlineErrors[i].ErrorMessage);
        }
    };

    ns.setErrorFieldFindAccount = function setErrorFieldOnClass(controlSelector) {
        $('#first-time-user').find(controlSelector).addClass('error-field');
    };

    ns.clearFindAccountErrors = function clearTextboxErrorHighlighting() {
        app.viewModels.FindAccountViewModel.HasMatchError(false);
        app.viewModels.FindAccountViewModel.Errors([]);
        $('#first-time-user').find('input').removeClass('error-field');
        $('#dk_container_year').removeClass('error-field');
        $('#dk_container_month').removeClass('error-field');
        $('#dk_container_day').removeClass('error-field');
        if ($('#dk_container_dd-select-county') != undefined &&
                 $('#dk_container_dd-select-county').length > 0) {
            $('#dk_container_dd-select-county').removeClass('error-field');
        }
        $('#first-time-user-create-account-auth-popup').find('input').removeClass('error-field');
    };

    ns.submitNewAccountInfo = function submitNewAccountInfo() {
        var $accountInfoSpinner = $('.lightbox-done-firsttimeusercreateaccountauth').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });

        ns.clearAuthLightboxErrors();

        var newAccount = {
            Username: app.viewModels.FirstTimeUserCreateAccountAuthViewModel.username_tb(),
            Password1: app.viewModels.FirstTimeUserCreateAccountAuthViewModel.pw1_tb(),
            Password2: app.viewModels.FirstTimeUserCreateAccountAuthViewModel.pw2_tb()
        };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/FindAccount/FirstTimeUserChangeUsernameAndPassword",
            dataType: "json",
            data: JSON.stringify(newAccount),
            success: function (serverViewModel) {
                ns.clearAuthLightboxErrors();
                $accountInfoSpinner.Stop();

                if (serverViewModel.ValidationResult.IsValid) {
                    app.viewModels.FirstTimeUserViewModel.RedirectToMyActionNeededFlag = true;
                    app.viewModels.FirstTimeUserViewModel.IsPre65 = serverViewModel.LoginValidationModel.LoginForwardResult.IsUserPre65;
                    app.viewModels.FirstTimeUserViewModel.AlertsAvaiable = serverViewModel.LoginValidationModel.LoginForwardResult.AlertsAvaiable;

                    //copy / pasted and edited, from login.js
                    var loginViewModel = serverViewModel.LoginValidationModel;
                    if (loginViewModel.LoginConflictViewModel.IsConflict) {
                        ns.checkProfileConflict();
                    } else {
                        app.login.setQueryStringAndReload();
                    }
                    //end copy paste
                } else {
                    ns.loadAuthLightboxErrors(serverViewModel.ValidationResult.Errors);
                }
            }
        });
    };

    ns.checkProfileConflict = function checkProfileConflict() {
        app.viewModels.LoginConflictViewModel.doneCallback = app.login.setQueryStringAndReload;
        $.publish("EXCHANGE.lightbox.firsttimeusercreateaccountauth.close");
        $.publish("EXCHANGE.lightbox.loginconflict.open");
    };

    ns.clearAuthLightboxErrors = function clearAuthLightboxErrors() {
        app.viewModels.FirstTimeUserCreateAccountAuthViewModel.errors([]);
        $('#firsttimeuserlogincreateaccountpopup').find('input').removeClass('error-field');
    };

    ns.setErrorFieldOnAuthLightbox = function setErrorFieldOnAuthLightbox(controlClass) {
        $('#firsttimeuserlogincreateaccountpopup').find(controlClass).addClass('error-field');
    };

    ns.loadAuthLightboxErrors = function loadAuthLightboxErrors(inlineErrors) {
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "Username") {
                ns.setErrorFieldOnAuthLightbox('.username');
            } else if (inlineErrors[i].PropertyName == "Password1" || inlineErrors[i].PropertyName == "Password2") {
                ns.setErrorFieldOnAuthLightbox('.password1');
                ns.setErrorFieldOnAuthLightbox('.password2');
            }
            app.viewModels.FirstTimeUserCreateAccountAuthViewModel.errors.push(inlineErrors[i].ErrorMessage);
        }
    };

    ns.updatePageTitleIfCalledAsPswdReset = function updatePageTitleIfCalledAsPswdReset() {
        if (location.href.indexOf("passwordreset") > -1) {
            app.viewModels.FirstTimeUserViewModel.HeaderText("Password Reset");
            document.title = "Password Reset | Aon Retiree Health Exchange ";
        }
    };

} (EXCHANGE));

