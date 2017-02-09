(function (app) {
    var ns = app.namespace("EXCHANGE.updateProfile");

    EXCHANGE.namespace('EXCHANGE.viewModels');

    var inlineErrors = new Array();
    ns.pendingCountyLookup = false;

    $(document).ready(function () {
        ns.initializePage();
        ns.bindEvents();
    });

    $('#ShopPDP').live('click', function () {
        window.open('/videos/rx-plans.aspx', 'popUpWindow', 'left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes,width=660,height=430');
    });
     
    ns.initializePage = function initializePage() {
        ns.setupPlans(function () {
        });
        app.planDetails.initializePlanDetails();
        app.comparePlans.initializeComparePlans();
        app.savedPlans.initializeSavedPlansPopup();
        app.intelligentSwap.initializeIntelligentSwap();
        app.optionalCoverage.initializeOptionalCoverage();
        app.viewCart.initializeViewCart();
        app.comparisonLimit.initializeComparisonLimit();
        app.decisionSupport.initializeDecisionSupport();
        ns.setupViewModels();
        ns.hideEditForms();
        ns.setupBindings();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/UpdateProfileClientViewModel",
            dataType: "json",
            success: function (response) {
                app.viewModels.UpdateProfileViewModel.loadFromJSON(response);
                // select and dropkick work
                app.functions.addMonthOptionsSubscription(app.viewModels.UpdateProfileViewModel.dateOfBirth, 'month', true);
                $('#updateProfileAboutMeEditForm').find('.selectfield').dropkick();

                ns.customInputForSwitch($(".about-me-gender"));
                ns.customInputForSwitch($(".poa-designate-switch"));
                EXCHANGE.placeholder.applyPlaceholder();
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
                $("#MedicineCabinet").css("margin-bottom", "0px");
            },
            error: function () {
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            }
        });
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.UpdateProfileViewModel = new app.models.UpdateProfileViewModel();
        ko.applyBindings(app.viewModels, $('#update-profile').get(0));
    };
    ns.hideEditForms = function hideEditForms() {
        $("#about-me-edit").hide();
        $("#change-username").hide();
        $("#change-password").hide();
        $("#poa-edit").hide();
    };

    ns.afterCartAndPlansLoaded = function afterCartAndPlansLoaded(callback) {
        app.viewModels.SearchResultsViewModel.loadFromActivePlans();
        if ($.isFunction(callback)) {
            callback();
        }
    };

    ns.setupBindings = function setupBindings() {
        ns.getCountiesForNewZip();
        $(document).on("click", "#about-me-edit-button", function () {
            $("#about-me-readonly").hide();
            $("#about-me-edit").show();
            ns.aboutMePopulateEdits();
            ns.updateStateForSwitch($(".about-me-gender"));

        });

        $(document).on("click", "#about-me-cancel-button", function () {
            ns.removeErrorsAboutMe();
            $("#about-me-edit").hide();
            $("#about-me-readonly").show();
            app.viewModels.UpdateProfileViewModel.changesSavedAboutMe(false);
            ns.aboutMePopulateEdits();
        });

        $(document).on("click", "#about-me-save-button", function () {
            app.ButtonSpinner = $(this).ButtonSpinner({ buttonType: app.enums.ButtonType.SMALLBLUE });
            ns.saveAboutMe();
        });

        $(document).on("click", "#change-username-edit-button", function () {
            $("#security-profile").hide();
            $("#change-username").show();
            $("#newUsername").val('');
            ns.clearAllTempFields();
        });

        $(document).on("click", "#change-username-cancel-button", function () {
            ns.removeInlineErrorsUsername();
            $("#change-username").hide();
            $("#security-profile").show();
            app.viewModels.UpdateProfileViewModel.changesSavedSecurityProfile(false);
            ns.clearAllTempFields();
        });

        $(document).on("click", "#change-username-save-button", function () {
            app.ButtonSpinner = $(this).ButtonSpinner({ buttonType: app.enums.ButtonType.SMALLBLUE });
            ns.removeInlineErrorsUsername();
            ns.saveNewUsername();
        });

        $(document).on("click", "#change-password-edit-button", function () {
            $("#security-profile").hide();
            $("#change-password").show();
            ns.changePasswordPopulateEdits();
        });

        $(document).on("click", "#change-password-cancel-button", function () {
            $("#change-password").hide();
            $("#security-profile").show();
            app.viewModels.UpdateProfileViewModel.changesSavedSecurityProfile(false);
            ns.removeInlineErrorsPassword();
            ns.changePasswordPopulateEdits();
        });

        $(document).on("click", "#change-password-save-button", function () {
            app.ButtonSpinner = $(this).ButtonSpinner({ buttonType: app.enums.ButtonType.SMALLBLUE });
            ns.removeInlineErrorsPassword();
            ns.saveNewPassword();
        });

        $(document).on("click", "#change-poa-edit-button", function () {
            ns.getCountiesForZipAjax(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyZip_tb());
            $("#poa-edit").show();
            $("#poa-readonly").hide();
            ns.changePoaPopulateEdits();
            ns.updateStateForSwitch($(".poa-designate-switch"));
        });

        $(document).on("click", "#change-poa-cancel-button", function () {
            ns.removeInlineErrorsPoa();
            $("#poa-edit").hide();
            $("#poa-readonly").show();
            app.viewModels.UpdateProfileViewModel.changesSavedPoa(false);
            ns.changePoaPopulateEdits();
        });

        $(document).on("click", "#change-poa-save-button", function () {
            app.ButtonSpinner = $(this).ButtonSpinner({ buttonType: app.enums.ButtonType.SMALLBLUE });
            ns.removeInlineErrorsPoa();
            ns.savePoa();
        });

        // If a new month is selected, the available values in the "Date" dropdown must change to reflect that month
        $('#updateProfileAboutMeEditForm').on(($.browser.msie ? 'mousedown' : 'click'), 'div#dk_container_month div.dk_options a', function () {
            var chosenMonth = $(this).attr('data-dk-dropdown-value');
            var chosenYear = $('#year').val();
            var dayOptions = app.viewModels.UpdateProfileViewModel.dateOfBirth.DayOptions;
            app.functions.dateDropDownUpdate(chosenMonth, chosenYear, dayOptions);
        });

    };

    ns.setDateValuesInModel = function setDateValuesInModel() {
        var monthVal = app.functions.getDropdownSelectedValueBySelectElementId('month');
        app.viewModels.UpdateProfileViewModel.dateOfBirth.Month(monthVal);
        var dayVal = app.functions.getDropdownSelectedValueBySelectElementId('day');
        app.viewModels.UpdateProfileViewModel.dateOfBirth.Day(dayVal);
        var yearVal = app.functions.getDropdownSelectedValueBySelectElementId('year');
        app.viewModels.UpdateProfileViewModel.dateOfBirth.Year(yearVal);
    };
    ns.setupPlans = function setupPlans(callback) {
        if (!app.viewModels.SearchResultsViewModel) {
            app.viewModels.SearchResultsViewModel = app.models.SearchResultsViewModel();
        }
        if (!app.viewModels.PlanSharedResourceStrings) {
            app.viewModels.PlanSharedResourceStrings = app.models.PlanSharedResourceStrings();
        }
        if (!app.plans.AllPlanViewModels || app.plans.AllPlanViewModels.length == 0) {
            ns.loadPlans(callback);
        }
        else if ($.isFunction(callback)) {
            callback();
        }
    };
    ns.loadPlans = function loadPlans(callback) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SearchResult/GetPlansForShoppingCart",
            dataType: "json",
            success: function (data) {
                var viewModel = data;
                app.viewModels.SearchResultsViewModel.loadFromJSON(viewModel.SearchResultsViewModel, viewModel.PlanLists);
                app.viewModels.PlanSharedResourceStrings.loadFromJSON(viewModel.PlanSharedResourceStrings);

                var cb = function () {
                    ns.afterCartAndPlansLoaded(callback);
                };

                app.plans.PlanLoader.loadAllPlansFromJson(viewModel, cb);
            }
        });
    };
    ns.saveAboutMe = function saveAboutMe() {
        ns.setDateValuesInModel();
        var aboutMeArgs = {
            FirstName: app.viewModels.UpdateProfileViewModel.firstNameEdit_tb(),
            LastName: app.viewModels.UpdateProfileViewModel.lastNameEdit_tb(),
            DateOfBirthYear: app.viewModels.UpdateProfileViewModel.dateOfBirth.Year(),
            DateOfBirthMonth: app.viewModels.UpdateProfileViewModel.dateOfBirth.Month(),
            DateOfBirthDay: app.viewModels.UpdateProfileViewModel.dateOfBirth.Day(),
            Gender: app.viewModels.UpdateProfileViewModel.genderEdit_radio()
        };
        aboutMeArgs = JSON.stringify(aboutMeArgs);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/ValidateAboutMe",
            data: aboutMeArgs,
            dataType: "json",
            success: function (response) {
                app.ButtonSpinner.Stop();
                ns.removeErrorsAboutMe();
                var inlineErrorExist = ns.loadInlineErrors(response.ValidationResult, 'aboutMe');
                if (inlineErrorExist) {
                    ns.displayInlineErrors();
                } else {
                    $("#about-me-edit").hide();
                    $("#about-me-readonly").show();
                    app.viewModels.UpdateProfileViewModel.dateOfBirth_tb(response.FormattedDateOfBirth);
                    ns.aboutMePopulateLocalReadonlys();
                    app.viewModels.UpdateProfileViewModel.changesSavedAboutMe(true);
                    app.user.UserSession.loadFromJSON(response.UserSession);
                    app.viewModels.LoginHeaderViewModel.refreshWelcomeText();
                }
            }
        });
    };

    ns.onSuccessfulLogoutRedirect = function onSuccessfulLogoutRedirect() {
        var queryString = "?lightboxName=login&dst=/update-profile.aspx";
        app.functions.redirectToRelativeUrlFromSiteBase(queryString);
    };

    ns.processValidateNewUserResponse = function processValidateNewUserResponse(serverValidationModel) {
        app.ButtonSpinner.Stop();
        var inlineErrorExist = ns.loadInlineErrors(serverValidationModel.ValidationResult, 'username');

        if (!inlineErrorExist) {
            if (!serverValidationModel.ChangeUsernameValidationResult.IsPasswordCorrect) {
                inlineErrorExist = ns.loadInlineErrors({ Errors: [{ ErrorMessage: app.viewModels.UpdateProfileViewModel.incorrectPassword_lbl(), PropertyName: 'EditUsernamePassword'}] }, 'username');
            }
        }

        if (inlineErrorExist) {
            ns.displayInlineErrors();
        } else {
            $("#change-username").hide();
            $("#security-profile").show();
            ns.changeUsernamePopulateReadonlys();
            app.viewModels.UpdateProfileViewModel.changesSavedSecurityProfile(true);
            app.loginHeader.logOutAjaxRequest(ns.onSuccessfulLogoutRedirect);
        }
    };

    ns.saveNewUsername = function saveNewUsername() {
        var newUsernameArgs = {
            Username: app.viewModels.UpdateProfileViewModel.chooseUsername_tb(),
            Password: $('#usernameEditPwd').val()
        };
        newUsernameArgs = JSON.stringify(newUsernameArgs);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/ValidateNewUsername",
            data: newUsernameArgs,
            dataType: "json",
            success: ns.processValidateNewUserResponse,
            error: function (data) {
            //temp fix for kentico 8
                app.ButtonSpinner.Stop();
                app.loginHeader.logOutAjaxRequest(ns.onSuccessfulLogoutRedirect);
            }
        });
    };

    ns.saveNewPassword = function saveNewPassword() {
        var newPasswordArgs = {
            CurrentPassword: $('#passwordEditCurrent').val(),
            NewPassword: $('#passwordEditNew').val(),
            NewPasswordConfirm: $('#passwordEditNewConfirm').val()
        };
        newPasswordArgs = JSON.stringify(newPasswordArgs);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/ValidateNewPassword",
            data: newPasswordArgs,
            dataType: "json",
            success: function (serverValidationModel) {
                app.ButtonSpinner.Stop();
                var inlineErrorExist = ns.loadInlineErrors(serverValidationModel.ValidationResult, 'password');

                if (!inlineErrorExist) {
                    if (!serverValidationModel.ChangePasswordValidationResult.IsPasswordCorrect) {
                        inlineErrorExist = ns.loadInlineErrors({ Errors: [{ ErrorMessage: app.viewModels.UpdateProfileViewModel.incorrectPassword_lbl(), PropertyName: 'EditPassword'}] }, 'password');
                    }
                }

                if (inlineErrorExist) {
                    ns.displayInlineErrors();
                } else {
                    $("#change-password").hide();
                    $("#security-profile").show();
                    ns.changePasswordPopulateReadonlys();
                    app.viewModels.UpdateProfileViewModel.changesSavedSecurityProfile(true);
                }
            }
        });
    };

    ns.getCountiesForNewZip = function () {
        $('#poaZip').unbind('keyup');

        $('#poaZip').keyup(function () {
            var input = $(this);
            var zip = input.val();
            var zipInt = parseInt(zip);

            if (zip.length == 5 && zipInt >= 0 && zipInt < 100000) {
                if (!ns.pendingCountyLookup) {
                    ns.pendingCountyLookup = true;
                    ns.getCountiesForZipAjax(zip);
                }
            } else {
                app.viewModels.UpdateProfileViewModel.POA().countyList([]);
                app.functions.redrawDropkickBySelectElementId('dd-select-county');
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
                if (data[0] !== undefined) {
                    app.viewModels.UpdateProfileViewModel.POA().countyList(data);
                    for (var i = 0; i < app.viewModels.UpdateProfileViewModel.POA().countyList().length; i++) { if (app.viewModels.UpdateProfileViewModel.POA().countyList()[i].CountyName === app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyCounty_tb()) { app.viewModels.UpdateProfileViewModel.POA().countyId_boundToSelectValue(app.viewModels.UpdateProfileViewModel.POA().countyList()[i].Id); ; break; } }
                }

                app.functions.redrawDropkickBySelectElementId('dd-select-county');
                ns.pendingCountyLookup = false;

            },
            failure: function () {
                ns.pendingCountyLookup = false;
            }
        });
    };
    ns.savePoa = function savePoa() {
        // If user is saving with No selected, remove the POA from his account. Else, validate the POA details
        if (app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyDesignateEdit_radio() == app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyDesignateNo_lbl()) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/RemovePowerOfAttorney",
                dataType: "json",
                success: function () {
                    app.ButtonSpinner.Stop();
                    $("#poa-edit").hide();
                    $("#poa-readonly").show();
                    ns.changePoaPopulateReadonlys();
                    app.viewModels.UpdateProfileViewModel.changesSavedPoa(true);
                }
            });
        } else {
            for (var i = 0; i < app.viewModels.UpdateProfileViewModel.POA().countyList().length; i++) { if (app.viewModels.UpdateProfileViewModel.POA().countyList()[i].Id === $('#dd-select-county').parent().find('.dk_option_current a').attr('data-dk-dropdown-value')) { app.viewModels.UpdateProfileViewModel.POA().countyId_boundToSelectValue(app.viewModels.UpdateProfileViewModel.POA().countyList()[i].Id); ; break; } }
            var poaArgs = {
                FirstName: app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyFirstNameEdit_tb(),
                LastName: app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyLastNameEdit_tb(),
                Address1: app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress1Edit_tb(),
                Address2: app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress2Edit_tb(),
                City: app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyCityEdit_tb(),
                State: app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyStateEdit_tb(),
                Zip: app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyZipEdit_tb(),
                CountyId: app.viewModels.UpdateProfileViewModel.POA().countyId_boundToSelectValue(),
                Phone: app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyPhoneEdit_tb()
            };
            poaArgs = JSON.stringify(poaArgs);

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/ValidatePowerOfAttorney",
                data: poaArgs,
                dataType: "json",
                success: function (response) {
                    app.ButtonSpinner.Stop();
                    var serverViewModel = response;
                    var inlineErrorExist = ns.loadInlineErrors(serverViewModel.ValidationResult, 'poa');
                    if (inlineErrorExist) {
                        ns.displayInlineErrorsPoa();
                    } else {
                        $("#poa-edit").hide();
                        $("#poa-readonly").show();
                        ns.changePoaPopulateReadonlys();
                        app.viewModels.UpdateProfileViewModel.changesSavedPoa(true);
                    }
                }
            });
        }
    };

    ns.loadInlineErrors = function loadInlineErrors(data, section) {
        var hasInlineErrors = false;
        EXCHANGE.viewModels.UpdateProfileViewModel.clearInlineErrors(section);
        inlineErrors = [];
        for (var i = 0; i < data.Errors.length; i++) {
            var error = data.Errors[i].ErrorMessage;
            if (error.indexOf("inline:") != -1) {
                error = error.substring(error.indexOf("inline:") + "inline:".length);
            }

            inlineErrors.push(data.Errors[i]);
            EXCHANGE.viewModels.UpdateProfileViewModel.addInlineError(error, section);
            hasInlineErrors = true;
        }
        return hasInlineErrors;
    };

    ns.displayInlineErrors = function displayInlineErrors() {
            for (var i = 0; i < inlineErrors.length; i++) {
                if (inlineErrors[i].PropertyName == "FirstName") {
                    $('#updateProfileAboutMeEditForm').find('#aboutMeFirstNameEdit').addClass('error-field');
                } else if (inlineErrors[i].PropertyName == "LastName") {
                    $('#updateProfileAboutMeEditForm').find('#aboutMeLastNameEdit').addClass('error-field');
                } else if (inlineErrors[i].PropertyName == "DateOfBirthYear") {
                    $('#updateProfileAboutMeEditForm').find('#dk_container_year').addClass('error-field');
                } else if (inlineErrors[i].PropertyName == "DateOfBirthMonth") {
                    $('#updateProfileAboutMeEditForm').find('#dk_container_month').addClass('error-field');
                } else if (inlineErrors[i].PropertyName == "DateOfBirthDay") {
                    $('#updateProfileAboutMeEditForm').find('#dk_container_day').addClass('error-field');
                } else if (inlineErrors[i].PropertyName == "DateOfBirth.DateOfBirth") {
                    $('#updateProfileAboutMeEditForm').find('#dk_container_year').addClass('error-field');
                    $('#updateProfileAboutMeEditForm').find('#dk_container_month').addClass('error-field');
                    $('#updateProfileAboutMeEditForm').find('#dk_container_day').addClass('error-field');
                } else if (inlineErrors[i].PropertyName == "Username") {
                    $('#newUsername').addClass('error-field');
                } else if (inlineErrors[i].PropertyName == "EditUsernamePassword") {
                    $('#usernameEditPwd').addClass('error-field');
                } else if (inlineErrors[i].PropertyName == "PasswordMismatch") {
                    $('#passwordEditNew').addClass('error-field');
                } else if (inlineErrors[i].PropertyName == "EditPassword") {
                    $('#passwordEditCurrent').addClass('error-field');
                } else if (inlineErrors[i].PropertyName == "Password1") {
                    $('#passwordEditNew').addClass('error-field');
                    $('#passwordEditNewConfirm').addClass('error-field');
                } else if (inlineErrors[i].PropertyName == "CurrentPassword") {
                    $('#passwordEditCurrent').addClass('error-field');
                    //  Bug fix for 47369 added class for highlight in red color in .com
                    $('#usernameEditPwd').addClass('error-field');                  
                }
            }
    };
    
    ns.displayInlineErrorsPoa = function displayInlineErrorsPoa() {
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "FirstName") {
                $('#poaFirstName').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "LastName") {
                $('#poaLastName').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "State") {
                $('#poaState').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "Zip") {
                $('#poaZip').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "Phone") {
                $('#poaPhone').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "Address1") {
                $('#poaAddressOne').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "Address2") {
                $('#poaAddressTwo').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "CountyId") {
                $('#dk_container_dd-select-county').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "City") {
                $('#poaCity').addClass('error-field');
            } else {
                console.log('missed:' + inlineErrors[i].PropertyName);
            }
        }
    };

    ns.clearErrorFieldsAboutMe = function clearErrorFieldsAboutMe() {
        var aboutMeForm = $('#updateProfileAboutMeEditForm');
        aboutMeForm.find('#aboutMeFirstNameEdit').removeClass('error-field');
        aboutMeForm.find('#aboutMeLastNameEdit').removeClass('error-field');
        aboutMeForm.find('#dk_container_year').removeClass('error-field');
        aboutMeForm.find('#dk_container_month').removeClass('error-field');
        aboutMeForm.find('#dk_container_day').removeClass('error-field');
    };

    ns.removeErrorsAboutMe = function removeErrorsAboutMe() {
        EXCHANGE.viewModels.UpdateProfileViewModel.clearInlineErrors('aboutMe');
        ns.clearErrorFieldsAboutMe();
    };

    ns.removeInlineErrorsUsername = function removeInlineErrorsUsername() {
        EXCHANGE.viewModels.UpdateProfileViewModel.clearInlineErrors('username');
        $('#newUsername').removeClass('error-field');
        //  Bug fix for 47369 remove class for highlight in red color in .com
        $('#usernameEditPwd').removeClass('error-field');
        $('#passwordEditCurrent').removeClass('error-field');
    };

    ns.removeInlineErrorsPassword = function removeInlineErrorsPassword() {
        EXCHANGE.viewModels.UpdateProfileViewModel.clearInlineErrors('password');
        $('#passwordEditNew').removeClass('error-field');
        $('#passwordEditNewConfirm').removeClass('error-field');
        $('#passwordEditCurrent').removeClass('error-field');
        $('#usernameEditPwd').removeClass('error-field');
    };

    ns.removeInlineErrorsPoa = function removeInlineErrorsPoa() {
        EXCHANGE.viewModels.UpdateProfileViewModel.clearInlineErrors('poa');
        $('#poaFirstName').removeClass('error-field');
        $('#poaLastName').removeClass('error-field');
        $('#poaState').removeClass('error-field');
        $('#poaZip').removeClass('error-field');
        $('#poaPhone').removeClass('error-field');
        $('#poaAddressOne').removeClass('error-field');
        $('#poaAddressTwo').removeClass('error-field');
        $('#dk_container_dd-select-county').removeClass('error-field');
        $('#poaCity').removeClass('error-field');
    };

    ns.aboutMePopulateEdits = function aboutMePopulateEdits() {
        app.viewModels.UpdateProfileViewModel.firstNameEdit_tb(app.viewModels.UpdateProfileViewModel.firstName_tb());
        app.viewModels.UpdateProfileViewModel.lastNameEdit_tb(app.viewModels.UpdateProfileViewModel.lastName_tb());
        app.viewModels.UpdateProfileViewModel.genderEdit_radio(app.viewModels.UpdateProfileViewModel.gender_tb());

        // The "readonly"s that we use to re-populate the editable copy of the date-of-birth values, are the 
        // ModelYear/ModelMonth/ModelDay in the view model. We must copy these to the bound dob values, then the
        // selects, and finally re-generate the dropkicks.
        var updateForm = $('#updateProfileAboutMeEditForm');
        var updateDobViewModel = app.viewModels.UpdateProfileViewModel.dateOfBirth;

        updateDobViewModel.reloadBoundDobValuesFromModel();

        updateForm.find('#year').val(updateDobViewModel.Year());
        updateForm.find('#month').val(updateDobViewModel.Month());
        updateForm.find('#day').val(updateDobViewModel.Day());

        app.functions.redrawDropkickBySelectElementId('year');
        app.functions.redrawDropkickBySelectElementId('month');
        app.functions.redrawDropkickBySelectElementId('day');
    };

    ns.aboutMePopulateLocalReadonlys = function aboutMePopulateLocalReadonlys() {
        // This method is called once the server has ensured that the submitted values are valid and that 
        // edit mode should be replaced by an updated read-only mode. 

        app.viewModels.UpdateProfileViewModel.firstName_tb(app.viewModels.UpdateProfileViewModel.firstNameEdit_tb());
        app.viewModels.UpdateProfileViewModel.lastName_tb(app.viewModels.UpdateProfileViewModel.lastNameEdit_tb());
        app.viewModels.UpdateProfileViewModel.gender_tb(app.viewModels.UpdateProfileViewModel.genderEdit_radio());

        // Date of birth view model Year/Month/Day were already populated before submitting to server; however,
        // the ModelYear/ModelMonth/ModelDay should be updated, now that the server has approved the values, so 
        // that our "local copy of server value" is accurate again.        
        var dateOfBirth = app.viewModels.UpdateProfileViewModel.dateOfBirth;
        dateOfBirth.ModelYear(dateOfBirth.Year());
        dateOfBirth.ModelMonth(dateOfBirth.Month());
        dateOfBirth.ModelDay(dateOfBirth.Day());
    };

    ns.changeUsernamePopulateReadonlys = function changeUsernamePopulateReadonlys() {
        ns.clearAllTempFields();
        app.viewModels.UpdateProfileViewModel.username_tb(app.viewModels.UpdateProfileViewModel.chooseUsername_tb());
    };

    ns.changePasswordPopulateEdits = function changePasswordPopulateEdits() {
        ns.clearAllTempFields();
    };

    ns.changePasswordPopulateReadonlys = function changePasswordPopulateReadonlys() {
        ns.clearAllTempFields();
    };

    ns.changePoaPopulateEdits = function changePoaPopulateEdits() {
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyDesignateEdit_radio(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyDesignate_radio());

        // If we have a power of attorney designated, populate the edit form with his/her info. Else, clear all POA fields
        if (!app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyIsEmpty()) {
            if (app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyFirstName_tb() != '') {
                app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyFirstNameEdit_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyFirstName_tb());
                app.placeholder.clearPlaceholder('#poaFirstName');
            }
            if (app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyLastName_tb() != '') {
                app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyLastNameEdit_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyLastName_tb());
                app.placeholder.clearPlaceholder('#poaLastName');
            }
            if (app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress1_tb() != '') {
                app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress1Edit_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress1_tb());
                app.placeholder.clearPlaceholder('#poaAddressOne');
            }
            if (app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress2_tb() != '') {
                app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress2Edit_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress2_tb());
                app.placeholder.clearPlaceholder('#poaAddressTwo');
            }
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyCityEdit_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyCity_tb());
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyStateEdit_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyState_tb());
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyZipEdit_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyZip_tb());
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyCountyEdit_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyCounty_tb());
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyPhoneEdit_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyPhone_tb());
        }
        else {
            ns.clearPoaFields();
        }
    };

    ns.changePoaPopulateReadonlys = function changePoaPopulateReadonlys() {
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyDesignate_radio(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyDesignateEdit_radio());

        // If user selected to designate a power of attorney, populate the readonly form with his/her info. Else, clear all POA fields
        if (app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyDesignateEdit_radio() == app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyDesignateYes_lbl()) {
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyIsEmpty(false);
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyDesignate_radio(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyDesignateYes_lbl());
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyFirstName_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyFirstNameEdit_tb());
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyLastName_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyLastNameEdit_tb());
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress1_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress1Edit_tb());
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress2_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress2Edit_tb());
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyCity_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyCityEdit_tb());
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyState_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyStateEdit_tb());
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyZip_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyZipEdit_tb());
            for (var i = 0; i < app.viewModels.UpdateProfileViewModel.POA().countyList().length; i++) { if (app.viewModels.UpdateProfileViewModel.POA().countyList()[i].Id === app.viewModels.UpdateProfileViewModel.POA().countyId_boundToSelectValue()) { app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyCounty_tb(app.viewModels.UpdateProfileViewModel.POA().countyList()[i].CountyName); ; break; } }
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyPhone_tb(app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyPhoneEdit_tb());
        }
        else {
            app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyIsEmpty(true);
            ns.clearPoaFields();
        }
    };

    ns.clearPoaFields = function clearPoaFields() {
        // Clear readonlys
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyFirstName_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyLastName_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress1_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress2_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyCity_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyState_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyZip_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyCounty_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyPhone_tb('');

        //Clear edits
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyFirstNameEdit_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyLastNameEdit_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress1Edit_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyAddress2Edit_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyCityEdit_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyStateEdit_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyZipEdit_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyCountyEdit_tb('');
        app.viewModels.UpdateProfileViewModel.POA().powerOfAttorneyPhoneEdit_tb('');

        //blurring these fields makes the placeholder ie plugin work properly
        $('#poaFirstName').blur();
        $('#poaLastName').blur();
        $('#poaAddressOne').blur();
        $('#poaAddressTwo').blur();
    };

    ns.clearAllTempFields = function clearAllTempFields() {
        $("#usernameEditPwd").val('');
        $("#passwordEditCurrent").val('');
        $("#passwordEditNew").val('');
        $("#passwordEditNewConfirm").val('');
    };

    ns.updateStateForSwitch = function updateStateForSwitch(switchSelector) {
        switchSelector.trigger("updateState");
    };

    ns.customInputForSwitch = function customInputForSwitch(switchSelector) {
        switchSelector.customInput();
    };

    ns.bindEvents = function bindEvents() {
        $(document).on("click", "#addToSavedUpdateProfile", function () {
            if (EXCHANGE.user.UserSession.IsLoggedIn()) {
                ns.setupPlans(function () {
                });
                $.publish("EXCHANGE.lightbox.savedplans.open");
            } else {
                $.publish("EXCHANGE.lightbox.login.open");
            }
        });
    };

} (EXCHANGE));
