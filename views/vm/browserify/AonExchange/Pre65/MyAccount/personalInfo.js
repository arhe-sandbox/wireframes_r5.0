(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.personalInfo");

    $(document).ready(function () {
        // Initialize only if using "communication restrictions" as a separate webpart.
        //ns.initializePage();
        ns.setupBindings();
    });

    ns.setupBindings = function setupBindings() {
        $(document).on("click", "#pre65-lnk-edit-personal", function () {
            //event.preventDefault ? event.preventDefault() : event.returnValue = false;
            app.viewModels.PersonalInfoViewModel.firstNameEdit_tb(app.viewModels.PersonalInfoViewModel.firstName_tb());
            app.viewModels.PersonalInfoViewModel.lastNameEdit_tb(app.viewModels.PersonalInfoViewModel.lastName_tb());

            app.viewModels.PersonalInfoViewModel.genderEdit_radio(app.viewModels.PersonalInfoViewModel.gender_tb());
            app.viewModels.PersonalInfoViewModel.userEmailAddress_tb(app.viewModels.PersonalInfoViewModel.userEmailAddress());
            app.viewModels.PersonalInfoViewModel.suppressInfoChecked_tb(app.viewModels.PersonalInfoViewModel.isSuppressInfo());

            EXCHANGE.functions.redrawDropkickBySelectElementId('pre65-ab-dobM');
            EXCHANGE.functions.redrawDropkickBySelectElementId('pre65-ab-dobD');
            EXCHANGE.functions.redrawDropkickBySelectElementId('pre65-ab-dobY');

            $('.pre65-pi-read').hide();
            $('.pre65-pi-read-btn').hide();
            $('.pre65-pi-edit').show();

            // Enable Suppress Info checkbox on click of 'Edit Personal Info' button
            $('input#pre65-suppress-info').attr('disabled', false);

            if (app.user.UserSession.Agent && app.user.UserSession.Agent().Id && app.user.UserSession.Agent().Id() !== app.constants.blankGuid) {
                //First Name
                $("#pre65-ab-fn").hide();
                $("#pre65-pi-fn").show();
                // Last Name
                $("#pre65-ab-ln").hide();
                $("#pre65-pi-ln").show();
                // DOB
                $(".pre65-dd-dates .pre65-pi-edit").hide();
                $("#pi-dob").show();
                // Gender
                $(".pre65-rd-btns.pre65-pi-edit").hide();
                $("#pre65-pi-gen").show();
                $("#pre65-ab-pn").focus();
            } else {
                $('#pre65-ab-fn').focus();
            }
            $('#dk_container_pre65-ab-dobM').attr('tabindex', '0');
            $('#dk_container_pre65-ab-dobD').attr('tabindex', '0');
            $('#dk_container_pre65-ab-dobY').attr('tabindex', '0')
        });


        $(document).on("click", "#pre65-pi-submit", function (event) {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;           
            app.ButtonSpinner = $(this).ButtonSpinner({ buttonType: app.enums.ButtonType.SMALLBLUE });
            ns.savePersonalInfo();
        });

        $(document).on("click", "#pre65-pi-cancel", function () {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            ns.clearInlineErrorsProfileInfo();
            $('.pre65-pi-read').show();
            $('.pre65-pi-read-btn').show();
            $('.pre65-pi-edit').hide();
            // Disable Suppress Info checkbox on click of 'Cancel' button
            $('input#pre65-suppress-info').attr('disabled', true);
            // Retain the saved value of 'Suppress Personal Info' checkbox on click of Cancel button
            app.viewModels.PersonalInfoViewModel.suppressInfoRadio(app.viewModels.PersonalInfoViewModel.suppressInfoChecked_tb());
        });
    };

    ns.initializePage = function initializePage() {
        if (app.viewModels.PersonalInfoViewModel == null) {
            ns.setupViewModels();
        }
        if (app.viewModels.PersonalInfoViewModel.isVMLoaded() === false) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/PersonalInfoViewModel",
                dataType: "json",
                success: function (response) {
                    app.viewModels.PersonalInfoViewModel.loadFromJSON(response);
                    $('.pre65-pi-ddl').dropkick();
                    if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
                    //app.agentAccess.hideAndDisable();
                },
                error: function (data) {
                    if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
                }
            });
        }
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.PersonalInfoViewModel = new app.models.PersonalInfoViewModel();
        ko.applyBindings(app.viewModels, $('#my-personal-info').get(0));
    };

    ns.savePersonalInfo = function savePersonalInfo() {
        ns.setDateValuesInModel();
        var personalInfoArgs = {
            FirstName: app.viewModels.PersonalInfoViewModel.firstNameEdit_tb(),
            LastName: app.viewModels.PersonalInfoViewModel.lastNameEdit_tb(),
            DateOfBirthYear: app.viewModels.PersonalInfoViewModel.dateOfBirth.Year(),
            DateOfBirthMonth: app.viewModels.PersonalInfoViewModel.dateOfBirth.Month(),
            DateOfBirthDay: app.viewModels.PersonalInfoViewModel.dateOfBirth.Day(),
            Gender: app.viewModels.PersonalInfoViewModel.genderEdit_radio(),
            Email: app.viewModels.PersonalInfoViewModel.userEmailAddress_tb(),
            Phone: app.viewModels.PersonalInfoViewModel.primaryNumber(),
            IsSuppressInfo: app.viewModels.PersonalInfoViewModel.suppressInfoRadio() === true
        };
        personalInfoArgs = JSON.stringify(personalInfoArgs);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/ValidatePersonalInfo",
            data: personalInfoArgs,
            dataType: "json",
            success: function (response) {
                app.ButtonSpinner.Stop();
                ns.clearInlineErrorsProfileInfo();
                var inlineErrorExist = ns.loadInlineErrors(response.ValidationResult, 'profileInfo');
                if (inlineErrorExist) {
                    ns.displayInlineErrors();
                } else {
                    app.viewModels.PersonalInfoViewModel.dateOfBirth_tb(response.FormattedDateOfBirth);
                    ns.populatePersonalInfoReads();
                    $('.pre65-pi-read').show();
                    $('.pre65-pi-read-btn').show();
                    $('.pre65-pi-edit').hide();
                    // Enable Suppress Info checkbox 
                    $('input#pre65-suppress-info').attr('disabled', true)

                    //app.viewModels.Pre65MyAccountAboutMeViewModel.changesSavedAboutMe(true);
                    //app.user.UserSession.loadFromJSON(response.UserSession);
                    //app.viewModels.LoginHeaderViewModel.refreshWelcomeText();
                }
            }
        });
    };

    ns.populatePersonalInfoReads = function populatePersonalInfoReads() {
        // This method is called once the server has ensured that the submitted values are valid and that 
        // edit mode should be replaced by an updated read-only mode. 

        app.viewModels.PersonalInfoViewModel.firstName_tb(app.viewModels.PersonalInfoViewModel.firstNameEdit_tb());
        app.viewModels.PersonalInfoViewModel.lastName_tb(app.viewModels.PersonalInfoViewModel.lastNameEdit_tb());
        app.viewModels.PersonalInfoViewModel.gender_tb(app.viewModels.PersonalInfoViewModel.genderEdit_radio());

        // Date of birth view model Year/Month/Day were already populated before submitting to server; however,
        // the ModelYear/ModelMonth/ModelDay should be updated, now that the server has approved the values, so 
        // that our "local copy of server value" is accurate again.        
        var dateOfBirth = app.viewModels.PersonalInfoViewModel.dateOfBirth;
        dateOfBirth.ModelYear(dateOfBirth.Year());
        dateOfBirth.ModelMonth(dateOfBirth.Month());
        dateOfBirth.ModelDay(dateOfBirth.Day());
        //app.viewModels.PersonalInfoViewModel.primaryNumber();
        app.viewModels.PersonalInfoViewModel.userEmailAddress(app.viewModels.PersonalInfoViewModel.userEmailAddress_tb());
        app.viewModels.PersonalInfoViewModel.updateSuppressInfo();
    };

    ns.setDateValuesInModel = function setDateValuesInModel() {
        var monthVal = app.functions.getDropdownSelectedValueBySelectElementId('pre65-ab-dobM');
        app.viewModels.PersonalInfoViewModel.dateOfBirth.Month(monthVal);
        var dayVal = app.functions.getDropdownSelectedValueBySelectElementId('pre65-ab-dobD');
        app.viewModels.PersonalInfoViewModel.dateOfBirth.Day(dayVal);
        var yearVal = app.functions.getDropdownSelectedValueBySelectElementId('pre65-ab-dobY');
        app.viewModels.PersonalInfoViewModel.dateOfBirth.Year(yearVal);
    };

    ns.loadInlineErrors = function loadInlineErrors(data, section) {
        var hasInlineErrors = false;
        ns.clearInlineErrorsProfileInfo();
        inlineErrors = [];
        for (var i = 0; i < data.Errors.length; i++) {
            var error = data.Errors[i].ErrorMessage;
            if (error.indexOf("inline:") !== -1) {
                error = error.substring(error.indexOf("inline:") + "inline:".length);
            }
            inlineErrors.push(data.Errors[i]);
            ns.addInlineError(error);
            hasInlineErrors = true;
        }
        return hasInlineErrors;
    };

    ns.addInlineError = function addInlineError(error) {
        app.viewModels.PersonalInfoViewModel.inlineErrorsExistProfileInfo(true);
        var errorListProfileInfo = app.viewModels.PersonalInfoViewModel.inlineErrorsProfileInfo();
        errorListProfileInfo.push(error);
        app.viewModels.PersonalInfoViewModel.inlineErrorsProfileInfo(errorListProfileInfo);
    };

    ns.displayInlineErrors = function displayInlineErrors() {
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName === "FirstName") {
                $('#tabs-1').find('#pre65-ab-fn').addClass('error-field');
            } else if (inlineErrors[i].PropertyName === "LastName") {
                $('#tabs-1').find('#pre65-ab-ln').addClass('error-field');
            } else if (inlineErrors[i].PropertyName === "DateOfBirthYear") {
                $('#tabs-1').find('#dk_container_pre65-ab-dobY').addClass('error-field');
            } else if (inlineErrors[i].PropertyName === "DateOfBirthMonth") {
                $('#tabs-1').find('#dk_container_pre65-ab-dobM').addClass('error-field');
            } else if (inlineErrors[i].PropertyName === "DateOfBirthDay") {
                $('#tabs-1').find('#dk_container_pre65-ab-dobD').addClass('error-field');
            } else if (inlineErrors[i].PropertyName === "DateOfBirth.DateOfBirth") {
                $('#tabs-1').find('#dk_container_pre65-ab-dobY').addClass('error-field');
                $('#tabs-1').find('#dk_container_pre65-ab-dobM').addClass('error-field');
                $('#tabs-1').find('#dk_container_pre65-ab-dobD').addClass('error-field');
            } else if (inlineErrors[i].PropertyName === "Phone") {
                $('#tabs-1').find('#pre65-ab-pn').addClass('error-field');
            } else if (inlineErrors[i].PropertyName === "Email") {
                $('#tabs-1').find('#pre65-ab-em').addClass('error-field');
            }
        }
    };

    ns.clearInlineErrorsProfileInfo = function clearInlineErrorsCommPref() {
        app.viewModels.PersonalInfoViewModel.inlineErrorsExistProfileInfo(false);
        app.viewModels.PersonalInfoViewModel.inlineErrorsProfileInfo([]);
        ns.clearErrorFieldsProfileInfo();
    };

    ns.clearErrorFieldsProfileInfo = function clearErrorFieldsProfileInfo() {
        var profileInfoForm = $('#tabs-1');
        profileInfoForm.find('#pre65-ab-fn').removeClass('error-field');
        profileInfoForm.find('#pre65-ab-ln').removeClass('error-field');
        profileInfoForm.find('#dk_container_pre65-ab-dobY').removeClass('error-field');
        profileInfoForm.find('#dk_container_pre65-ab-dobM').removeClass('error-field');
        profileInfoForm.find('#dk_container_pre65-ab-dobD').removeClass('error-field');
        profileInfoForm.find('#pre65-ab-pn').removeClass('error-field');
        profileInfoForm.find('#pre65-ab-em').removeClass('error-field');
    };
} (EXCHANGE));
