(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.createAccount');

    // These "constants" correspond to the names of the Knockout.js "subpanel" templates in 
    // CreateAccountPersonalInfo.ascx; if those template names change, just change the values
    // of these constants, and the rest of this file will work. 
    // 
    // The different templates exist due to the duplicate-checking feature of Create Account;
    // see the requirements for details. 
    var INITIAL_TEMPLATE_NAME = "create-account-subpanel-initial-template";
    var VERIFICATION_TEMPLATE_NAME = "create-account-subpanel-verification-template";
    var REFINEMENT_TEMPLATE_NAME = "create-account-subpanel-refinement-template";

    // It is not always possible to reliably know if data entered on the Personal Info lightbox should be 
    // cleared when the Personal Info and Auth lightboxes are opened and closed. The three variables below 
    // highlight the cases where the correct action *is* known; the code can take specific action in those
    // cases and fall back to sensible default behavior otherwise. 
    //
    // The usage pattern is to assign one of these variables to true at the start of an event or transition,
    // and then to reassign that variable back to false at the completion of that event or transition. 
    ns.isForwardTransitionFromPersonalInfoToAuth = false;
    ns.isBackwardTransitionFromAuthToPersonalInfo = false;
    ns.isAccountSuccessfullyCreated = false;
    ns.isForwardTransitionToOtherLB = false;
    ns.month_tb = "";
    ns.day_tb = "";
    ns.year_tb = "";
    ns.county_tb = "";
    ns.countyList = "";

    $(document).ready(function () {
        ns.initializeCreateAccount();
    });


    // *************** Setup and API calls ************************

    // This is the code that sets up the two-lightbox Create Account feature
    ns.initializeCreateAccount = function initializeCreateAccount() {
        ns.setupViewModels();
        ns.createPersonalInfoLightbox();
        ns.createAuthLightbox();
        ns.setupJqueryBindings();
    };

    // Construct the view models used by Knockout for the Create Account feature
    ns.setupViewModels = function setupViewModels() {
        if (!app.viewModels.CreateAccountPersonalInfoViewModel || !app.viewModels.CreateAccountAuthViewModel) {
            app.viewModels.CreateAccountPersonalInfoViewModel = app.models.CreateAccountPersonalInfoViewModel();
            app.viewModels.CreateAccountAuthViewModel = app.models.CreateAccountAuthViewModel();

            // The CreateAccountAuthViewModel is used in a few different places on the site (together with
            // CreateAccountAuthContent.ascx). So, for each such place -- including this file -- it is necessary to 
            // indicate what actions the back and continue buttons must trigger, since those actions vary by context. 
            // In this file, the back button has a custom event handler (see elsewhere in this file), and the
            // continue button is associated with a standard lightbox event triggered by the standard lightbox 
            // event class added below. 
            app.viewModels.CreateAccountAuthViewModel.continueButtonClass('lightbox-done-createaccountauth');
        }
    };

    // Creates the lightbox for Step 1 of the Create Account process, where the user enters personal info. 
    ns.createPersonalInfoLightbox = function () {
        var createAccountPersonalInfoLb = new EXCHANGE.lightbox.Lightbox({
            name: 'createaccountpersonalinfo',
            divSelector: '#create-account-personal-info-popup',
            openButtonSelector: '#create-account-personal-info-open-button',
            closeButtonSelector: '#create-account-personal-info-close-button',
            beforeOpen: function () {
                ko.applyBindings(app.viewModels, $('#create-account-personal-info-popup').get(0));
                return true;
            },
            afterOpen: function (item) {
                // This call will configure the view model data for both the Personal Info lightbox and Auth lightbox. 
                ns.configureDataAndPersonalInfoLightbox();
            },
            showWaitPopup: true,
            beforeSubmit: function (clickedItem) {
                app.ButtonSpinner = $(clickedItem).ButtonSpinner({ buttonType: app.enums.ButtonType.LARGEGREEN });
                ns.submitNewAccountPersonalInfoForValidation();
                return false;
            },
            afterClose: function () {
                ns.eraseErrorsFromPersonalInfoLightbox();
                ns.removeTabIndexes('#create-account-personal-info-popup');
                if (ns.isForwardTransitionFromPersonalInfoToAuth || ns.isForwardTransitionToOtherLB) {
                    // Date-of-birth values must be preserved in model; see dateOfBirthViewModel.js for details.
                    app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.storeValuesToModel();
                } else {
                    ns.clearFieldsOnPersonalInfoLightbox();
                }
                ns.removeDropkicksFromPersonalInfoLightbox();
            }
        });
    };

    // Creates the lightbox for Step 2 of the Create Account process, where the user enters site authentication information. 
    ns.createAuthLightbox = function () {
        var createAccountAuthLb = new EXCHANGE.lightbox.Lightbox({
            name: 'createaccountauth',
            divSelector: '#create-account-auth-popup',
            openButtonSelector: '#create-account-auth-open-button',
            closeButtonSelector: '#create-account-auth-close-button',
            beforeOpen: function () {
                ko.applyBindings(app.viewModels, $('#create-account-auth-popup').get(0));
                return true;
            },
            afterOpen: function () {
                // View model data for this Auth lightbox is configured in the afterOpen call for the  
                // Personal Info lightbox, so no additional view model configuration is needed here.
                ns.configureAuthLightbox();
            },
            beforeSubmit: function (clickedItem) {
                app.ButtonSpinner = $(clickedItem).ButtonSpinner({ buttonType: app.enums.ButtonType.LARGEGREEN });
                if (app.viewModels.CreateAccountPersonalInfoViewModel.CRMAccountExists()) {
                    ns.updateCRMAccountInfo();
                }
                else if (app.viewModels.CreateAccountPersonalInfoViewModel.connectToExistingAccount()) {
                    ns.submitAppendedAccountInfo();
                } else {
                    ns.submitNewAccountInfo();
                }
                return false;
            },
            afterClose: function () {
                ns.eraseErrorsFromAuthLightbox();
                ns.removeTabIndexes('#create-account-auth-popup');
                ns.clearFieldsOnAuthLightbox();

                // In most cases, Personal Info fields retained upon transition to the Auth lightbox can't be cleared here, since  
                // it can't be reliably known that the Personal Info data is no longer needed. However, if account creation data has 
                // been successfully submitted, then that's an exception; Personal Info fields can safely be cleared in that case. 
                if (ns.isAccountSuccessfullyCreated) {
                    ns.clearFieldsOnPersonalInfoLightbox();

                    // This flag can be cleared, since the work that is conditional on successful account creation has now been accomplished. 
                    ns.isAccountSuccessfullyCreated = false;
                }
            }
        });
    };

    // Configures the view model data for both lightboxes and configures the Personal Info lightbox.
    ns.configureDataAndPersonalInfoLightbox = function () {
        $('.createAccountChildLB').bind('click', function () {
            ns.month_tb = app.functions.getDropdownSelectedOption('#dk_container_monthCrAcct');
            ns.day_tb = app.functions.getDropdownSelectedOption('#dk_container_dayCrAcct');
            ns.year_tb = app.functions.getDropdownSelectedOption('#dk_container_yearCrAcct');
            ns.county_tb = app.functions.getDropdownSelectedOption('#dk_container_create-account-county');
            ns.countyList = app.viewModels.CreateAccountPersonalInfoViewModel.countyList();
            ns.isForwardTransitionToOtherLB = true;
        });
        if (ns.isBackwardTransitionFromAuthToPersonalInfo) {
            // In this case, the Personal Info lightbox is being re-opened after transitioning to and from the Auth
            // lightbox. So, the data and subpanel template name already stored in the view model are still legitimate, 
            // and it is not necessary to retrieve fresh data. 

            // Date-of-birth values must be restored from model; see dateOfBirthViewModel.js for details.
            app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.reloadBoundDobValuesFromModel();
            ns.completePersonalInfoLightboxConfiguration();
            
            // The flag highlighting the transition from one lightbox to another should now be turned off, since
            // that transition is about to be completed.
            ns.isBackwardTransitionFromAuthToPersonalInfo = false;
            $.publish("EXCHANGE.lightbox.createaccountpersonalinfo.loaded");
        } else if (ns.isForwardTransitionToOtherLB) {
            ns.completePersonalInfoLightboxConfiguration();
            app.functions.setDropdownSelectedOption('#dk_container_monthCrAcct', ns.month_tb);
            app.functions.setDropdownSelectedOption('#dk_container_dayCrAcct', ns.day_tb);
            app.functions.setDropdownSelectedOption('#dk_container_yearCrAcct', ns.year_tb);
            app.viewModels.CreateAccountPersonalInfoViewModel.countyList(ns.countyList);
            app.functions.setDropdownSelectedOption('#dk_container_create-account-county', ns.county_tb);
            ns.isForwardTransitionToOtherLB = false;
            $.publish("EXCHANGE.lightbox.createaccountpersonalinfo.loaded");
        } else {
            // In this case, the Personal Info lightbox is being opened at the start of the Create Account process; any existing
            // data (leftover from an earlier, prematurely-terminated Create Account process) should be cleared and server data should 
            // be written in its place. 
            ns.clearFieldsOnPersonalInfoLightbox();
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Login/CreateAccountClientViewModels",
                dataType: "json",
                success: function (data) {
                    var serverViewModel = data;

                    // Populate the view models for both lightboxes now, so that opening the Auth lightbox won't require a second AJAX call. 
                    app.viewModels.CreateAccountPersonalInfoViewModel.loadFromJSON(serverViewModel.CreateAccountPersonalInfoViewModel);
                    app.viewModels.CreateAccountAuthViewModel.loadFromJSON(serverViewModel.CreateAccountAuthViewModel);

                    app.viewModels.CreateAccountPersonalInfoViewModel.SubpanelTemplateName(INITIAL_TEMPLATE_NAME);
                    ns.completePersonalInfoLightboxConfiguration();
                    $.publish("EXCHANGE.lightbox.createaccountpersonalinfo.loaded");
                },
                error: function () {
                    $.publish('EXCHANGE.lightbox.closeAll');
                }
            });
        }
    };

    // Assumes the view models are configured and populated, and completes configuration of the Personal Info lightbox. 
    ns.completePersonalInfoLightboxConfiguration = function () {
        // We need this call made before we activate the dropkicks, so that there isn't a small window between
        // when the dropkicks exist and when the subscription starts monitoring for changes.
        app.functions.addMonthOptionsSubscription(app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth, 'monthCrAcct', true);

        // Ensure IE handles any "placeholder" attributes in the HTML elements, since by default, IE doesn't have that capability.
        app.placeholder.applyPlaceholder();

        ns.initializeTabIndices('#create-account-personal-info-popup', "first-name")

        // The assumption in the next two lines is that there are no existing dropkicks on the Personal Info lighbox, and 
        // thus it is safe to open the dropkicks below. In order to ensure that that assumption is true, the lightbox must  
        // remove all dropkicks when it is closed (including when transitioning to the Auth lightbox). 
        $('#createAccountPersonalInfoSearchForm').find('.selectfield').dropkick();
        $('#createAccountPersonalInfoSearchForm').find('.selectcounty').dropkick();

        ns.bindPersonalInfoLightboxElementsToJqueryEvents();
    };
    
    // Assumes the view models are configured and populated, and configures the Auth lightbox. 
    ns.configureAuthLightbox = function () {
        ns.initializeTabIndices('#create-account-auth-popup', "username");

        $('#createAcctAuthContentCancelBtn').bind('click', function () {
            ns.isBackwardTransitionFromAuthToPersonalInfo = true;
            $.publish("EXCHANGE.lightbox.createaccountauth.back");
        });

        // The transition from the Personal Info lightbox to the Auth lightbox is now complete, so 
        // this flag should be cleared. 
        ns.isForwardTransitionFromPersonalInfoToAuth = false;
    };

    // Submits the data from the Personal Info lightbox for validation
    ns.submitNewAccountPersonalInfoForValidation = function submitNewAccountPersonalInfoForValidation() {
        // Only copy select values from the dropdowns if the dropdowns are actually on screen; otherwise
        // we did that earlier, and can just use whatever values have already been written to the view model.
        if (app.viewModels.CreateAccountPersonalInfoViewModel.SubpanelTemplateName() == INITIAL_TEMPLATE_NAME) {
            ns.copySelectValuesToViewModel();
        }
        var newAccount = ns.createPersonalAccountArgs();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Login/ValidateCreateAccountPersonalInfo",
            dataType: "json",
            data: JSON.stringify(newAccount),
            success: function (serverValidationModel) {
                var validationModel = serverValidationModel;

                app.ButtonSpinner.Stop();
                ns.eraseErrorsFromPersonalInfoLightbox();
                var validationResult = validationModel.ValidationResult;

                var moveToAuthStep = false;
                var redirectToLogin = false;

                if (validationResult.IsValid) {
                    ns.handlePersonalInfoWorkflow(validationModel);
                } else {
                    app.viewModels.CreateAccountPersonalInfoViewModel.hasMatchAlert(false);
                    app.viewModels.CreateAccountPersonalInfoViewModel.hasMatchError(false);
                    ns.loadPersonalInfoErrors(validationResult.Errors);
                };
            }
        });

        ns.eraseErrorsFromPersonalInfoLightbox();
    };

    ns.updateCRMAccountInfo = function updateCRMAccountInfo() {
        var newAccount = ns.createArgsForSubmitNewAccountInfo();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Login/CompletePartialAccount",
            dataType: "json",
            data: JSON.stringify(newAccount),
            success: function (data) {
                var serverViewModel = data;
                app.viewModels.CreateAccountAuthViewModel.errors([]);
                app.ButtonSpinner.Stop();

                if (serverViewModel.ValidationResult.IsValid) {
                    ns.isAccountSuccessfullyCreated = true;

                    //copy / pasted and edited, from login.js
                    var loginViewModel = serverViewModel.LoginValidationModel;
                    if (loginViewModel.LoginConflictViewModel.IsConflict) {
                        ns.checkProfileConflict();
                    } else {
                        app.login.setQueryStringAndReload();
                    }
                    //end copy paste
                } else {
                    ns.loadAuthErrors(serverViewModel.ValidationResult.Errors);
                }
            }
        });
    };

    ns.submitNewAccountInfo = function submitNewAccountInfo() {
        var newAccount = ns.createArgsForSubmitNewAccountInfo();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Login/CreateNewAccount",
            dataType: "json",
            data: JSON.stringify(newAccount),
            success: function (data) {
                app.ButtonSpinner.Stop();

                ns.eraseErrorsFromAuthLightbox();
                var validationResult = data;
                if (validationResult.IsValid) {
                    ns.isAccountSuccessfullyCreated = true;
                    app.login.setQueryStringAndReload();
                } else {
                    ns.loadAuthErrors(validationResult.Errors);
                }
            }
        });

        ns.eraseErrorsFromAuthLightbox();
    };

    ns.submitAppendedAccountInfo = function submitAppendedAccountInfo() {
        var newAccount = ns.createArgsForSubmitAppendedAccountInfo();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Login/CompletePartialAccount",
            dataType: "json",
            data: JSON.stringify(newAccount),
            success: function (data) {
                var serverViewModel = data;
                app.viewModels.CreateAccountAuthViewModel.errors([]);
                app.ButtonSpinner.Stop();

                if (serverViewModel.ValidationResult.IsValid) {
                    ns.isAccountSuccessfullyCreated = true;

                    //copy / pasted and edited, from login.js
                    var loginViewModel = serverViewModel.LoginValidationModel;
                    if (loginViewModel.LoginConflictViewModel.IsConflict) {
                        ns.checkProfileConflict();
                    } else {
                        app.login.setQueryStringAndReload();
                    }
                    //end copy paste
                } else {
                    ns.loadAuthErrors(serverViewModel.ValidationResult.Errors);
                }
            }
        });

        ns.eraseErrorsFromAuthLightbox();
    };

    ns.getCountiesForZip = function getCountiesForZip(zipField) {
        // var input = $(this);
        var input = zipField;
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
                    app.viewModels.CreateAccountPersonalInfoViewModel.countyList(data);
                    ns.resetCountyDropkick();
                }
            });
        } else {
            app.viewModels.CreateAccountPersonalInfoViewModel.countyList([]);
            ns.resetCountyDropkick();
        }
    };

    // *************** Argument creation for API calls **************************

    ns.createPersonalAccountArgs = function () {
        var newAccount = {
            FirstName: app.viewModels.CreateAccountPersonalInfoViewModel.firstName_tb(),
            LastName: app.viewModels.CreateAccountPersonalInfoViewModel.lastName_tb(),
            DateOfBirthYear: app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.Year(),
            DateOfBirthMonth: app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.Month(),
            DateOfBirthDay: app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.Day(),
            Email1: app.viewModels.CreateAccountPersonalInfoViewModel.email1_tb(),
            Email2: app.viewModels.CreateAccountPersonalInfoViewModel.email2_tb(),
            Zip: app.viewModels.CreateAccountPersonalInfoViewModel.zip_tb(),
            County: app.viewModels.CreateAccountPersonalInfoViewModel.county(),
            Phone: app.viewModels.CreateAccountPersonalInfoViewModel.phone_tb(),
            LastFourOfSsn: app.viewModels.CreateAccountPersonalInfoViewModel.ssn_tb(),
            NavigatorsId: app.viewModels.CreateAccountPersonalInfoViewModel.navId_tb(),
            IsIdentificationAction: app.viewModels.CreateAccountPersonalInfoViewModel.SubpanelTemplateName() == INITIAL_TEMPLATE_NAME,
            IsVerificationAction: app.viewModels.CreateAccountPersonalInfoViewModel.SubpanelTemplateName() == VERIFICATION_TEMPLATE_NAME,
            IsRefinementAction: app.viewModels.CreateAccountPersonalInfoViewModel.SubpanelTemplateName() == REFINEMENT_TEMPLATE_NAME
        };

        return newAccount;
    };

    ns.createArgsForSubmitNewAccountInfo = function () {
        var newAccount = {
            FirstName: app.viewModels.CreateAccountPersonalInfoViewModel.firstName_tb(),
            LastName: app.viewModels.CreateAccountPersonalInfoViewModel.lastName_tb(),
            DateOfBirthYear: app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.Year(),
            DateOfBirthMonth: app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.Month(),
            DateOfBirthDay: app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.Day(),
            Email1: app.viewModels.CreateAccountPersonalInfoViewModel.email1_tb(),
            Email2: app.viewModels.CreateAccountPersonalInfoViewModel.email2_tb(),
            Zip: app.viewModels.CreateAccountPersonalInfoViewModel.zip_tb(),
            County: app.viewModels.CreateAccountPersonalInfoViewModel.county(),
            Phone: app.viewModels.CreateAccountPersonalInfoViewModel.phone_tb(),
            LastFourOfSsn: app.viewModels.CreateAccountPersonalInfoViewModel.ssn_tb(),
            NavigatorsId: app.viewModels.CreateAccountPersonalInfoViewModel.navId_tb(),
            Username: app.viewModels.CreateAccountAuthViewModel.username_tb(),
            Password1: app.viewModels.CreateAccountAuthViewModel.pw1_tb(),
            Password2: app.viewModels.CreateAccountAuthViewModel.pw2_tb()
        };

        return newAccount;
    };

    ns.createArgsForSubmitAppendedAccountInfo = function () {
        var newAccount = {
            FirstName: app.viewModels.CreateAccountPersonalInfoViewModel.firstName_tb(),
            LastName: app.viewModels.CreateAccountPersonalInfoViewModel.lastName_tb(),
            DateOfBirthYear: app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.Year(),
            DateOfBirthMonth: app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.Month(),
            DateOfBirthDay: app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.Day(),
            Email1: app.viewModels.CreateAccountPersonalInfoViewModel.email1_tb(),
            Email2: app.viewModels.CreateAccountPersonalInfoViewModel.email2_tb(),
            Zip: app.viewModels.CreateAccountPersonalInfoViewModel.zip_tb(),
            County: app.viewModels.CreateAccountPersonalInfoViewModel.county(),
            Phone: app.viewModels.CreateAccountPersonalInfoViewModel.phone_tb(),
            LastFourOfSsn: app.viewModels.CreateAccountPersonalInfoViewModel.ssn_tb(),
            NavigatorsId: app.viewModels.CreateAccountPersonalInfoViewModel.navId_tb(),
            Username: app.viewModels.CreateAccountAuthViewModel.username_tb(),
            Password1: app.viewModels.CreateAccountAuthViewModel.pw1_tb(),
            Password2: app.viewModels.CreateAccountAuthViewModel.pw2_tb()
        };
        return newAccount;
    };


    // *************** Utility methods for configuring the lightboxes ******************

    ns.bindPersonalInfoLightboxElementsToJqueryEvents = function bindPersonalInfoLightboxElementsToJqueryEvents() {

        var searchForm = $('#createAccountPersonalInfoSearchForm');

        // This binding will format the phone number in real time. 
        app.functions.setupPhoneFormatting();

        // This binding manipulates the county drop-down as the zip code changes. Ideally, the
        // unbind() call below would not be necessary. Once other pages on which the Create Account
        // lightboxes appear, are binding only to their own fields, and not all reachable fields 
        // with the .create-acc-zip class, it should be possible to eliminate the unbind() call. 
        var zipField = searchForm.find('.create-acc-zip');
        zipField.unbind('keyup');
        zipField.keyup(function () {
            ns.getCountiesForZip($(this));
        });

        // If a new month is selected, the available values in the "Date" dropdown must change to reflect that month
        searchForm.on(($.browser.msie ? 'mousedown' : 'click'), 'div#dk_container_monthCrAcct div.dk_options a', function (e) {
            var chosenMonth = $(this).attr('data-dk-dropdown-value');
            var chosenYear = $('#yearCrAcct').val();
            var dayOptions = app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.DayOptions;
            app.functions.dateDropDownUpdate(chosenMonth, chosenYear, dayOptions, 'dayCrAcct');
        });

        // assign the county every time the dropdown value changes
        searchForm.on(($.browser.msie ? 'mousedown' : 'click'), 'div#dk_container_countyCrAcct div.dk_options a', function (e) {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            app.viewModels.CreateAccountPersonalInfoViewModel.county(selectedVal);
        });
    };

    // Assumes the values submitted from the Personal Info page pass validation; handles the returned validation model. 
    ns.handlePersonalInfoWorkflow = function handlePersonalInfoWorkflow(serverValidationModel) {
        // Most of this method exists to handle duplicate checking when creating an account; see 
        // requirements for details. In the most common path (the non-duplicate path), the subpanel 
        // template would be the initial template, and no match would exist on initial values, so 
        // moveToAuthStep would be true, and the Auth lightbox would be opened. 
        var moveToAuthStep = false;
        var redirectToLogin = false;
        var personalInfoViewModel = app.viewModels.CreateAccountPersonalInfoViewModel;

        if (personalInfoViewModel.SubpanelTemplateName() == INITIAL_TEMPLATE_NAME) {
            if (serverValidationModel.MatchExistsOnInitialValues) {
                personalInfoViewModel.hasMatchAlert(true);
                personalInfoViewModel.hasMatchError(false);
                personalInfoViewModel.SubpanelTemplateName(VERIFICATION_TEMPLATE_NAME);
            } else {
                moveToAuthStep = true;
            }
        } else {
            if (serverValidationModel.FoundNoMatchOnVerification) {
                if (personalInfoViewModel.SubpanelTemplateName() == REFINEMENT_TEMPLATE_NAME) {
                    personalInfoViewModel.SubpanelTemplateName(VERIFICATION_TEMPLATE_NAME);
                }
                personalInfoViewModel.hasMatchAlert(false);
                personalInfoViewModel.hasMatchError(true);
            } else if (serverValidationModel.FoundSingleMatchOnVerification) {
                if (serverValidationModel.SingleMatchIsCustomer && serverValidationModel.UserAccountExists) {
                    redirectToLogin = true;
                }
                else if (serverValidationModel.SingleMatchIsCustomer && !serverValidationModel.UserAccountExists) {
                    moveToAuthStep = true;
                    personalInfoViewModel.CRMAccountExists(true);
                } else {
                    moveToAuthStep = true;
                    personalInfoViewModel.connectToExistingAccount(true);
                }
            } else {
                // In this case, serverValidationModel.FoundMultipleMatchOnVerification should be true. 
                personalInfoViewModel.SubpanelTemplateName(REFINEMENT_TEMPLATE_NAME);
            }
        }

        if (moveToAuthStep) {
            ns.isForwardTransitionFromPersonalInfoToAuth = true;
            $.publish("EXCHANGE.lightbox.createaccountauth.open");
        } else if (redirectToLogin) {
            EXCHANGE.viewModels.LoginViewModel.displayAccountExistsContent(true);
            $.publish("EXCHANGE.lightbox.login.open");
        }
    };

    // set the tabindex of all user input fields in the tree rooted at the given selector result; put focus on the element with name initialElementName
    ns.initializeTabIndices = function (selector, initialElementName) {
        var $lb = $(selector);
        $($lb).find('.has-tabindex').each(function () {
            var tabIndex = $(this).attr('data-tabindex');
            $(this).attr('tabindex', tabIndex);
        });

        var firstFocus = document.getElementsByName(initialElementName);
        $(firstFocus).focus();
    };

    // removes all tabindex values in the tree rooted at the given selector result;
    ns.removeTabIndexes = function (selector) {
        var $lb = $(selector);
        $($lb).find('.has-tabindex').each(function () {
            $(this).removeAttr('tabindex');
        });
    };

    // Copies the values from the select elements, into the corresponding values in the view model
    ns.copySelectValuesToViewModel = function copySelectValuesToViewModel() {
        // DateOfBirth fields must be copied
        var monthVal = app.functions.getDropdownSelectedValueBySelectElementId('monthCrAcct');
        app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.Month(monthVal);
        var dayVal = app.functions.getDropdownSelectedValueBySelectElementId('dayCrAcct');
        app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.Day(dayVal);
        var yearVal = app.functions.getDropdownSelectedValueBySelectElementId('yearCrAcct');
        app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.Year(yearVal);

        app.viewModels.CreateAccountPersonalInfoViewModel.dateOfBirth.storeValuesToModel();

        // Copy the county value only if the county dropdown is actually visible
        if ($('#dk_container_create-account-county')) {
            var county = app.functions.getDropdownSelectedValueBySelectElementId('create-account-county');
            app.viewModels.CreateAccountPersonalInfoViewModel.county(county);
        }
    };

    ns.removeDropkicksFromPersonalInfoLightbox = function removeDropkicksFromPersonalInfoLightbox() {
        app.functions.removeDropkickBySelectElementId('monthCrAcct');
        app.functions.removeDropkickBySelectElementId('dayCrAcct');
        app.functions.removeDropkickBySelectElementId('yearCrAcct');
        app.functions.removeDropkickBySelectElementId('create-account-county');
    };

    ns.clearFieldsOnPersonalInfoLightbox = function () {
        // Clear the selects
        $('#createAccountPersonalInfoSearchForm').find('.selectfield').each(function (index) {
            $(this).prop('selectedIndex', 0);
        });

        // clear view model data
        var personalInfoViewModel = app.viewModels.CreateAccountPersonalInfoViewModel;
        personalInfoViewModel.firstName_tb('');
        personalInfoViewModel.lastName_tb('');
        personalInfoViewModel.email1_tb('');
        personalInfoViewModel.email2_tb('');
        personalInfoViewModel.zip_tb('');
        personalInfoViewModel.countyList([]);
        personalInfoViewModel.county('');
        personalInfoViewModel.phone_tb('');
        personalInfoViewModel.ssn_tb('');
        personalInfoViewModel.navId_tb('');

        personalInfoViewModel.dateOfBirth.clearData();
    };

    ns.clearFieldsOnAuthLightbox = function () {
        var authViewModel = app.viewModels.CreateAccountAuthViewModel;
        authViewModel.username_tb('');
        authViewModel.pw1_tb('');
        authViewModel.pw2_tb('');
    };

    // Called when county dropdown changes; the dropkick must be handled accordingly
    ns.resetCountyDropkick = function resetCountyDropkick() {
        var searchForm = $('#createAccountPersonalInfoSearchForm');

        searchForm.find('.addr-county-dd').children('.dk_container').remove();
        searchForm.find('.selectcounty').dropkick();
    };


    // **************** Error handling functions **************

    ns.loadPersonalInfoErrors = function loadPersonalInfoErrors(inlineErrors) {
        app.viewModels.CreateAccountPersonalInfoViewModel.errors([]);
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "FirstName") {
                ns.setErrorFieldOnClassPersonalInfo('.first');
            } else if (inlineErrors[i].PropertyName == "LastName") {
                ns.setErrorFieldOnClassPersonalInfo('.last');
            } else if (inlineErrors[i].PropertyName == "DateOfBirthYear") {
                ns.setErrorFieldOnIdPersonalInfo('#dk_container_yearCrAcct');
            } else if (inlineErrors[i].PropertyName == "DateOfBirthMonth") {
                ns.setErrorFieldOnIdPersonalInfo('#dk_container_monthCrAcct');
            } else if (inlineErrors[i].PropertyName == "DateOfBirthDay") {
                ns.setErrorFieldOnIdPersonalInfo('#dk_container_dayCrAcct');
            } else if (inlineErrors[i].PropertyName == "DateOfBirth") {
                // "DateOfBirth" is a calculated property representing the collection of all three dob fields
                ns.setErrorFieldOnIdPersonalInfo('#dk_container_yearCrAcct');
                ns.setErrorFieldOnIdPersonalInfo('#dk_container_monthCrAcct');
                ns.setErrorFieldOnIdPersonalInfo('#dk_container_dayCrAcct');
            } else if (inlineErrors[i].PropertyName == "Email1" || inlineErrors[i].PropertyName == "Email2") {
                ns.setErrorFieldOnClassPersonalInfo('.email1');
                ns.setErrorFieldOnClassPersonalInfo('.email2');
            } else if (inlineErrors[i].PropertyName == "Zip") {
                ns.setErrorFieldOnClassPersonalInfo('.zip');
            } else if (inlineErrors[i].PropertyName == "County") {
                $('#create-account-personal-info-popup').find('.selectcounty').parent().find('.dk_container').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "Phone") {
                ns.setErrorFieldOnClassPersonalInfo('.phone');
            }
            app.viewModels.CreateAccountPersonalInfoViewModel.errors.push(inlineErrors[i].ErrorMessage);
        }
    };

    ns.loadAuthErrors = function loadAuthErrors(inlineErrors) {
        app.viewModels.CreateAccountAuthViewModel.errors([]);
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "Username") {
                ns.setErrorFieldOnClassAuth('.username');
            } else if (inlineErrors[i].PropertyName == "Password1" || inlineErrors[i].PropertyName == "Password2") {
                ns.setErrorFieldOnClassAuth('.password1');
                ns.setErrorFieldOnClassAuth('.password2');
            }
            app.viewModels.CreateAccountAuthViewModel.errors.push(inlineErrors[i].ErrorMessage);
        }
    };

    ns.setErrorFieldOnClassPersonalInfo = function setErrorFieldOnClassPersonalInfo(controlClass) {
        $('#create-account-personal-info-popup').find(controlClass).addClass('error-field');
    };

    ns.setErrorFieldOnIdPersonalInfo = function setErrorFieldOnIdPersonalInfo(itemId) {
        $('#create-account-personal-info-popup').find(itemId).addClass('error-field');
    };

    ns.setErrorFieldOnClassAuth = function setErrorFieldOnClassAuth(controlClass) {
        $('#create-account-auth-popup').find(controlClass).addClass('error-field');
    };

    ns.eraseErrorsFromPersonalInfoLightbox = function () {
        app.viewModels.CreateAccountPersonalInfoViewModel.errors([]);
        $('#create-account-personal-info-popup').find('input').removeClass('error-field');

        // Dropkick divs are not input elements, so their error boxes must be removed separately from the line above. 
        $('#create-account-personal-info-popup').find('.dk_container').removeClass('error-field');
    };

    ns.eraseErrorsFromAuthLightbox = function () {
        app.viewModels.CreateAccountAuthViewModel.errors([]);
        $('#create-account-auth-popup').find('input').removeClass('error-field');

        // Unlike the Personal Info lightbox, the Auth lightbox has no dropkick elements, so there is no 
        // need to remove error fields from .dk_container elements here.
    };
    ns.setupJqueryBindings = function setupJqueryBindings() {
        $(document).keypress(function (e) {
            if (e.keyCode == 13) {
                app.viewModels.CreateAccountAuthViewModel.username_tb($("input:text[name='username']").val());
                app.viewModels.CreateAccountAuthViewModel.pw1_tb($("input:password[name='password1']").val());
                app.viewModels.CreateAccountAuthViewModel.pw2_tb($("input:password[name='password2']").val());
                if ($('#createAcctAuthContentSaveBtn').length != 0) {
                    $('#createAcctAuthContentSaveBtn').click();
                }
            }
        });
    };
} (EXCHANGE));

