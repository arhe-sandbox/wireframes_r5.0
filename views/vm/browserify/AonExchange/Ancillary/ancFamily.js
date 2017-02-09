(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.ancFamily');

    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializeAncFamily();
        ns.setupJqueryBindings();

    });


    ns.initializeAncFamily = function initializeAncFamily() {
        EXCHANGE.viewModels.ancFamilyViewModel = EXCHANGE.models.ancFamilyViewModel();

        var ancFamilyLb = new EXCHANGE.lightbox.Lightbox({
            name: 'ancFamily',
            divSelector: '#ancFamily-popup',
            openButtonSelector: '#ancFamily-open-button',
            closeButtonSelector: '#ancFamily-close-button',
            beforeOpen: function () {

                return true;
            },
            afterOpen: function () {
                ns.ancFamilyModelLoad();
                $.publish("EXCHANGE.lightbox.ancFamily.loaded");
                $.publish("lightbox-refresh-ancFamily");
                $("#new-depend").hide();
                $("#familySection").show();
            },
            afterClose: function () {
                EXCHANGE.AncSearchHeader.AncSearchHeaderViewModelLoad();
            }
        });

    };



    function isEmptyOrSpaces(str) {
        return str === null || str.match(/^ *$/) !== null;
    }

    ns.ancFamilyModelLoad = function ancFamilyModelLoad() {


        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Ancillary/GetAncFamilyViewModel",

            dataType: "json",
            success: function (data) {
                $('#custom-gender-male').find('div').removeClass('custom-radio');
                $('#custom-gender-female').find('div').removeClass('custom-radio');
                $('#custom-tobaco-yes').find('div').removeClass('custom-radio');
                $('#custom-tobaco-no').find('div').removeClass('custom-radio');
                app.viewModels.ancFamilyViewModel = app.viewModels.ancFamilyViewModel.loadFromJSON(data);
                $('.ddl').dropkick();
                $('#depend-error').hide();
            },
            error: function (data) {

            }

        });

    };

    ns.getConnectionTypeName = function getConnectionTypeName(conType) {
        switch (conType) {
            case 0:
                return "Primary";
            case 1:
                return "Spouse";
            case 2:
                return "Child";
            case 3:
                return "Parent";
            case 4:
                return "Family Member";
        }
        return "";
    };

    ns.setupJqueryBindings = function setupJqueryBindings() {

        $('#btn-add-depend').live('click', ns.addMember);

        $('#editMember').live('click', ns.editMember);

        $('#submit-depend').live('click', ns.submitFamilyMember);

        $('#submit-cancel').live('click', ns.hideMemberSection);

    };

    ns.addMember = function addMember() {
        EXCHANGE.viewModels.ancFamilyViewModel.addEditFamilyMember_Lbl("Add Family Member");
        EXCHANGE.viewModels.ancFamilyViewModel.action("add");
        EXCHANGE.viewModels.ancFamilyViewModel.firstNameEdit_tb("");
        EXCHANGE.viewModels.ancFamilyViewModel.lastNameEdit_tb("");
        EXCHANGE.viewModels.ancFamilyViewModel.genderEdit_radio("");
        EXCHANGE.viewModels.ancFamilyViewModel.tobaccoEdit_Radio("");

        var updateFamilyDOB = $('#myFamilyDOB');
        var updateDobViewModel = app.viewModels.ancFamilyViewModel.dateOfBirth;
        updateDobViewModel.reloadBoundDobValuesFromModel();
        updateFamilyDOB.find('#ddl-year').val(0);
        updateFamilyDOB.find('#ddl-month').val(0);
        updateFamilyDOB.find('#ddl-day').val(0);

        EXCHANGE.functions.redrawDropkickBySelectElementId('ddl-year');
        EXCHANGE.functions.redrawDropkickBySelectElementId('ddl-day');
        EXCHANGE.functions.redrawDropkickBySelectElementId('ddl-month');
        $('input[name=af-tb]').attr('checked', false);
        $('input[name=genderRadioGroup]').attr('checked', false);

        $("label[for='gender_male']").removeAttr('class');
        $("label[for='gender_female']").removeAttr('class');
        $("label[for='af-no']").removeAttr('class');
        $("label[for='af-yes']").removeAttr('class');

        ns.showMember();
    };

    ns.showMember = function showMember() {
        $('#depend-error').hide();
        if (!($("#new-depend").is(":visible"))) {
            $("#new-depend").show();
            $("#familySection").hide();
        }

    };

    ns.hideMemberSection = function hideMemberSection() {

        if (($("#new-depend").is(":visible"))) {
            $("#new-depend").hide();
            $("#familySection").show();
        }
    };
    function isSpouseAdded() {
        var obj;
        $.each(EXCHANGE.viewModels.ancFamilyViewModel.under65(), function (key, value) {
            if (this.ConnectionType == "Spouse") {
                return true;
            }
        });
        $.each(EXCHANGE.viewModels.ancFamilyViewModel.over65NoPrimary(), function (key, value) {
            if (this.ConnectionType == "Spouse") {
                return true;
            }
        });
        return false;
    }
    function getMemberModel(idparam) {
        var obj;
        $.each(EXCHANGE.viewModels.ancFamilyViewModel.under65(), function (key, value) {
            if (this.CustomerNumber == idparam) {
                obj = this;
                return false;
            }

        });
        $.each(EXCHANGE.viewModels.ancFamilyViewModel.over65NoPrimary(), function (key, value) {
            if (this.CustomerNumber == idparam) {
                obj = this;
                return false;
            }

        });
        return obj;
    }



    ns.editMember = function editMember() {
        EXCHANGE.viewModels.ancFamilyViewModel.addEditFamilyMember_Lbl("Edit Family Member");
        EXCHANGE.viewModels.ancFamilyViewModel.action("edit");
        var element = $(this).attr('customerNumber');
        var famViewModel = getMemberModel(element);
        EXCHANGE.viewModels.ancFamilyViewModel.customerNumber = famViewModel.CustomerNumber;
        EXCHANGE.viewModels.ancFamilyViewModel.editId(famViewModel.Id);
        EXCHANGE.viewModels.ancFamilyViewModel.firstNameEdit_tb(famViewModel.FirstName);
        EXCHANGE.viewModels.ancFamilyViewModel.lastNameEdit_tb(famViewModel.LastName);
        var dtPt = famViewModel.DateOfBirth.split('/');
        EXCHANGE.viewModels.ancFamilyViewModel.dateOfBirth.Year(dtPt[2]);
        EXCHANGE.viewModels.ancFamilyViewModel.dateOfBirth.Month(dtPt[0]);
        EXCHANGE.viewModels.ancFamilyViewModel.dateOfBirth.Day(dtPt[1]);
        EXCHANGE.functions.redrawDropkickBySelectElementId('ddl-year');
        EXCHANGE.functions.redrawDropkickBySelectElementId('ddl-day');
        EXCHANGE.functions.redrawDropkickBySelectElementId('ddl-month');
        EXCHANGE.viewModels.ancFamilyViewModel.relation(famViewModel.ConnectionRoleName);
        EXCHANGE.functions.redrawDropkickBySelectElementId('af-mt');
        EXCHANGE.viewModels.ancFamilyViewModel.relation_tb(famViewModel.ConnectionRoleName);

        ns.showMember();

        $("label[for='gender_male']").removeAttr('class');
        $("label[for='gender_female']").removeAttr('class');
        $("label[for='af-no']").removeAttr('class');
        $("label[for='af-yes']").removeAttr('class');

    };

    ns.submitFamilyMember = function submitFamilyMember() {
        if (EXCHANGE.viewModels.ancFamilyViewModel.action() == "add")
            ns.addFamilyMember();
        else
            ns.updateFamilyMember();
    };

    function checkDobSelected() {
        if (($('#ddl-month').val() != '') && ($('#ddl-month').val() != '') && ($('#ddl-month').val() != ''))
            return true;
        else
            return false;
    }
    ns.checkError = function checkError() {
        var fName = app.viewModels.ancFamilyViewModel.firstNameEdit_tb();
        var lName = app.viewModels.ancFamilyViewModel.lastNameEdit_tb();
        if (fName == '' || lName == '' || !checkDobSelected()) {
            $('#depend-error').show();
            $("#familySection").hide();
            return true;
        } else {

            return false;
        }
    };



    ns.addFamilyMember = function addFamilyMember() {
        if (ns.checkError()) return;
        EXCHANGE.ButtonSpinner = $("#submit-depend").ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
        var aboutMeArgs = {
            FirstName: app.viewModels.ancFamilyViewModel.firstNameEdit_tb(),
            LastName: app.viewModels.ancFamilyViewModel.lastNameEdit_tb(),
            DateOfBirthYear: $('#ddl-year').val(),
            DateOfBirthMonth: $('#ddl-month').val(),
            DateOfBirthDay: $('#ddl-day').val(),
            Gender: app.viewModels.ancFamilyViewModel.genderEdit_radio(),
            Smoker: app.viewModels.ancFamilyViewModel.tobaccoEdit_Radio(),
            RelationType: $('#af-mt').val(),
            CustomerNumber: ns.newGuid(),
            Action: "Add"
        };

        var month = $('#ddl-month').val().length > 1 ? $('#ddl-month').val() : "0" + $('#ddl-month').val();
        var day = $('#ddl-day').val().length > 1 ? $('#ddl-day').val() : "0" + $('#ddl-day').val();

        var arr = ko.observableArray([]);

        arr.push({
            Addresses: null,
            Attestation: 0,
            ConnectionRoleName: $('#af-mt').val() == "Spouse" ? $('#af-mt').val() : "Child",
            ConnectionType: $('#af-mt').val() == "Spouse" ? 1 : 0,
            Connections: null,
            CustomerNumber: aboutMeArgs.CustomerNumber,
            DateOfBirth: $('#ddl-year').val() + "-" + month + "-" + day + "T00:00:00",
            EHealthLogin: null,
            EHealthUniqueId: null,
            EmailAddress: null,
            FirstName: app.viewModels.ancFamilyViewModel.firstNameEdit_tb(),
            HasSuppressedInfo: false,
            Id: aboutMeArgs.CustomerNumber,
            IsAnchorForPre65: false,
            IsDentalCoverage: false,
            IsDependentDentalEligible: true,
            IsDependentVisionEligible: true,
            IsOkToCall: false,
            IsPre65: false,
            IsAddedFromSession: true,
            IsSuppressInfo: false,
            IsVisionCoverage: false,
            LastName: app.viewModels.ancFamilyViewModel.lastNameEdit_tb(),
            MedicareEligibityDateTime: null,
            MiddleName: null,
            PhoneNumber: null,
            PrimaryPhoneNumber: null,
            Role: null,
            SSN: null
        });


        if (EXCHANGE.user.UserSession.UserProfile.family() == null)
            EXCHANGE.user.UserSession.UserProfile.family = arr;
        else
            EXCHANGE.user.UserSession.UserProfile.family.push(arr);




        aboutMeArgs = JSON.stringify(aboutMeArgs);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Ancillary/AddFamilyMember",
            data: aboutMeArgs,
            dataType: "json",
            success: function (data) {
                EXCHANGE.ButtonSpinner.Stop();
                if (data.IsValid) {
                    ns.ancFamilyModelLoad();
                    ns.hideMemberSection();
                } else {
                    $('#depend-error').show();
                }
            },
            error: function (data) {
                EXCHANGE.ButtonSpinner.Stop();
                app.viewModels.ancFamilyViewModel.errorMessage_Lbl("Some error has occured. Please try again later");
            }
        });
    };

    ns.updateFamilyMember = function updateFamilyMember() {
        if (ns.checkError()) return;
        EXCHANGE.ButtonSpinner = $("#submit-depend").ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
        var aboutMeArgs = {
            FirstName: app.viewModels.ancFamilyViewModel.firstNameEdit_tb(),
            LastName: app.viewModels.ancFamilyViewModel.lastNameEdit_tb(),
            DateOfBirthYear: $('#ddl-year').val(),
            DateOfBirthMonth: $('#ddl-month').val(),
            DateOfBirthDay: $('#ddl-day').val(),
            Gender: app.viewModels.ancFamilyViewModel.genderEdit_radio(),
            Smoker: app.viewModels.ancFamilyViewModel.tobaccoEdit_Radio(),
            RelationType: $('#af-mt').val(),
            Id: app.viewModels.ancFamilyViewModel.editId(),
            CustomerNumber: app.viewModels.ancFamilyViewModel.customerNumber,
            Action: "Edit"
        };



        aboutMeArgs = JSON.stringify(aboutMeArgs);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Ancillary/UpdateFamilyMember",
            data: aboutMeArgs,
            dataType: "json",
            success: function (data) {
                EXCHANGE.ButtonSpinner.Stop();
                if (data.IsValid) {
                    ns.ancFamilyModelLoad();
                    ns.hideMemberSection();
                } else {
                    $('#depend-error').show();
                }
            },
            error: function (data) {
                EXCHANGE.ButtonSpinner.Stop();
                app.viewModels.ancFamilyViewModel.errorMessage_Lbl("Some error has occured. Please try again later");
            }
        });
    };

    ns.newGuid = function newGuid() {
        return ns.S4() + ns.S4() + "-" + ns.S4() + "-" + ns.S4() + "-" + ns.S4() + "-" + ns.S4() + ns.S4() + ns.S4();
    };

    ns.S4 = function S4() {
        return Math.random().toString(16).substr(2, 4);
    };

} (EXCHANGE));

