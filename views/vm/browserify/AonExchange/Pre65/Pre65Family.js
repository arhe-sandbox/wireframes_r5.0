(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.Pre65Family");
    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializePage();
        ns.setupJqueryBindings();
        $('#div-depenedent-msg').hide();
    });

    ns.initializePage = function initializePage() {
        app.viewModels.Pre65FamilyViewModel = EXCHANGE.models.Pre65FamilyViewModel();
        ko.applyBindings(EXCHANGE.viewModels, $('.pre65-ac-container').get(0));
        ns.pre65FamilyModelLoad();
    };
    function isEmptyOrSpaces(str) {
        return str === null || str.match(/^ *$/) !== null;
    }

    ns.pre65FamilyModelLoad = function pre65FamilyModelLoad() {


        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Pre65/GetPre65FamilyViewModel",

            dataType: "json",
            success: function (data) {
                app.viewModels.Pre65FamilyViewModel = app.viewModels.Pre65FamilyViewModel.loadFromJSON(data);
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

    ns.getGenderName = function getGenderName(isGenderMale) {
        if (isGenderMale != null) {
            if (isGenderMale)
                return "Male";
            else
                return "Female";
        }
    };

    ns.getSmokerStatus = function getSmokerStatus(isTobaccoUser) {
        if (isTobaccoUser != null) {
            if (isTobaccoUser)
                return "Yes";
            else
                return "No";
        }
    };

    ns.setupJqueryBindings = function setupJqueryBindings() {

        $('#btn-add-depend').live('click', ns.addMember);

        $('#editMember').live('click', ns.editMember);

        $('#submit-depend').live('click', ns.submitFamilyMember);

        $('#submit-cancel').live('click', ns.hideMemberSection);

    };

    ns.addMember = function addMember() {
        $('#div-depenedent-msg').hide();
        EXCHANGE.viewModels.Pre65FamilyViewModel.addEditFamilyMember_Lbl("Add Family Member");
        EXCHANGE.viewModels.Pre65FamilyViewModel.action("add");
        EXCHANGE.viewModels.Pre65FamilyViewModel.firstNameEdit_tb("");
        EXCHANGE.viewModels.Pre65FamilyViewModel.lastNameEdit_tb("");
        EXCHANGE.viewModels.Pre65FamilyViewModel.genderEdit_radio("");
        EXCHANGE.viewModels.Pre65FamilyViewModel.tobaccoEdit_Radio("");

        var updateFamilyDOB = $('#myFamilyDOB');
        var updateDobViewModel = app.viewModels.Pre65FamilyViewModel.dateOfBirth;
        updateDobViewModel.reloadBoundDobValuesFromModel();
        updateFamilyDOB.find('#ddl-year').val(0);
        updateFamilyDOB.find('#ddl-month').val(0);
        updateFamilyDOB.find('#ddl-day').val(0);

        EXCHANGE.functions.redrawDropkickBySelectElementId('ddl-year');
        EXCHANGE.functions.redrawDropkickBySelectElementId('ddl-day');
        EXCHANGE.functions.redrawDropkickBySelectElementId('ddl-month');
        $('input[name=af-tb]').attr('checked', false);
        $('input[name=genderRadioGroup]').attr('checked', false);
        ns.showMember();

        $('#dk_container_ddl-month').attr('tabindex', '0');
        $('#dk_container_ddl-day').attr('tabindex', '0');
        $('#dk_container_ddl-year').attr('tabindex', '0');
        $('#dk_container_af-mt').attr('tabindex', '0');

        /* Checking the browser version is IE9 or not */
        if ($.browser.msie && parseInt($.browser.version, 10) == 9) {
            $("div#dk_container_ddl-month a.dk_toggle span.dk_label").text("Month");
            $("div#dk_container_ddl-year a.dk_toggle span.dk_label").text("year");
            $("div#dk_container_ddl-day a.dk_toggle span.dk_label").text("Date");
        }

    };

    ns.showMember = function showMember() {
        $('#depend-error').hide();
        if (!($("#new-depend").is(":visible"))) {
            $("#new-depend").show();
        }
        $('#submit-cancel').focus();
    };

    ns.hideMemberSection = function hideMemberSection() {

        if (($("#new-depend").is(":visible"))) {
            $("#new-depend").hide();
        }
    };
    function isSpouseAdded() {
        var obj;
        $.each(EXCHANGE.viewModels.Pre65FamilyViewModel.under65(), function (key, value) {
            if (this.ConnectionType == "Spouse") {
                return true;
            }
        });
        $.each(EXCHANGE.viewModels.Pre65FamilyViewModel.over65NoPrimary(), function (key, value) {
            if (this.ConnectionType == "Spouse") {
                return true;
            }
        });
        return false;
    }
    function getMemberModel(idparam) {
        var obj;
        $.each(EXCHANGE.viewModels.Pre65FamilyViewModel.under65(), function (key, value) {
            if (this.Id == idparam) {
                obj = this;
                return false;
            }

        });
        $.each(EXCHANGE.viewModels.Pre65FamilyViewModel.over65NoPrimary(), function (key, value) {
            if (this.Id == idparam) {
                obj = this;
                return false;
            }

        });
        return obj;
    }



    ns.editMember = function editMember() {
        EXCHANGE.viewModels.Pre65FamilyViewModel.addEditFamilyMember_Lbl("Edit Family Member");
        EXCHANGE.viewModels.Pre65FamilyViewModel.action("edit");
        var element = $(this).attr('name');
        var famViewModel = getMemberModel(element);
        EXCHANGE.viewModels.Pre65FamilyViewModel.editId(element);
        EXCHANGE.viewModels.Pre65FamilyViewModel.firstNameEdit_tb(famViewModel.FirstName);
        EXCHANGE.viewModels.Pre65FamilyViewModel.lastNameEdit_tb(famViewModel.LastName);
        EXCHANGE.viewModels.Pre65FamilyViewModel.genderEdit_radio(EXCHANGE.Pre65Family.getGenderName(famViewModel.IsGenderMale));
        EXCHANGE.viewModels.Pre65FamilyViewModel.tobaccoEdit_Radio(EXCHANGE.Pre65Family.getSmokerStatus(famViewModel.IsTobaccoUser));
        var dtPt = famViewModel.DateOfBirth.split('/');
        EXCHANGE.viewModels.Pre65FamilyViewModel.dateOfBirth.Year(dtPt[2]);
        EXCHANGE.viewModels.Pre65FamilyViewModel.dateOfBirth.Month(dtPt[0]);
        EXCHANGE.viewModels.Pre65FamilyViewModel.dateOfBirth.Day(dtPt[1]);
        EXCHANGE.functions.redrawDropkickBySelectElementId('ddl-year');
        EXCHANGE.functions.redrawDropkickBySelectElementId('ddl-day');
        EXCHANGE.functions.redrawDropkickBySelectElementId('ddl-month');
        EXCHANGE.viewModels.Pre65FamilyViewModel.relation(famViewModel.ConnectionRoleName);
        EXCHANGE.functions.redrawDropkickBySelectElementId('af-mt');
        EXCHANGE.viewModels.Pre65FamilyViewModel.relation_tb(famViewModel.ConnectionRoleName);
        ns.showMember();
    };

    ns.submitFamilyMember = function submitFamilyMember() {
        if (EXCHANGE.viewModels.Pre65FamilyViewModel.action() == "add")
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
        var fName = app.viewModels.Pre65FamilyViewModel.firstNameEdit_tb();
        var lName = app.viewModels.Pre65FamilyViewModel.lastNameEdit_tb();
        var gender = app.viewModels.Pre65FamilyViewModel.genderEdit_radio();
        var smoke = app.viewModels.Pre65FamilyViewModel.tobaccoEdit_Radio();
        if (fName == '' || lName == '' || !checkDobSelected()) {
            $('#depend-error').show();
            return true;
        } else {
            return false;
        }
    };



    ns.addFamilyMember = function addFamilyMember() {
        if (ns.checkError()) return;
        EXCHANGE.ButtonSpinner = $("#submit-depend").ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
        var aboutMeArgs = {
            FirstName: app.viewModels.Pre65FamilyViewModel.firstNameEdit_tb(),
            LastName: app.viewModels.Pre65FamilyViewModel.lastNameEdit_tb(),
            DateOfBirthYear: $('#ddl-year').val(),
            DateOfBirthMonth: $('#ddl-month').val(),
            DateOfBirthDay: $('#ddl-day').val(),
            Gender: app.viewModels.Pre65FamilyViewModel.genderEdit_radio(),
            Smoker: app.viewModels.Pre65FamilyViewModel.tobaccoEdit_Radio(),
            RelationType: $('#af-mt').val(),
            Action: "Add"
        };
        aboutMeArgs = JSON.stringify(aboutMeArgs);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Pre65/AddFamilyMember",
            data: aboutMeArgs,
            dataType: "json",
            success: function (data) {
                EXCHANGE.ButtonSpinner.Stop();
                if (data.IsValid) {
                    ns.pre65FamilyModelLoad();
                    ns.hideMemberSection();
                    $('#div-depenedent-msg').show();
                } else {
                    $('#depend-error').show();
                    $('#div-depenedent-msg').hide();
                }
            },
            error: function (data) {
                EXCHANGE.ButtonSpinner.Stop();
                app.viewModels.Pre65FamilyViewModel.errorMessage_Lbl("Some error has occured. Please try again later");
            }
        });
    };

    ns.updateFamilyMember = function updateFamilyMember() {
        if (ns.checkError()) return;
        EXCHANGE.ButtonSpinner = $("#submit-depend").ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
        var aboutMeArgs = {
            FirstName: app.viewModels.Pre65FamilyViewModel.firstNameEdit_tb(),
            LastName: app.viewModels.Pre65FamilyViewModel.lastNameEdit_tb(),
            DateOfBirthYear: $('#ddl-year').val(),
            DateOfBirthMonth: $('#ddl-month').val(),
            DateOfBirthDay: $('#ddl-day').val(),
            Gender: app.viewModels.Pre65FamilyViewModel.genderEdit_radio(),
            Smoker: app.viewModels.Pre65FamilyViewModel.tobaccoEdit_Radio(),
            RelationType: $('#af-mt').val(),
            Id: app.viewModels.Pre65FamilyViewModel.editId(),
            Action: "Edit"
        };
        aboutMeArgs = JSON.stringify(aboutMeArgs);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Pre65/UpdateFamilyMember",
            data: aboutMeArgs,
            dataType: "json",
            success: function (data) {
                EXCHANGE.ButtonSpinner.Stop();
                if (data.IsValid) {
                    ns.pre65FamilyModelLoad();
                    ns.hideMemberSection();
                } else {
                    $('#depend-error').show();
                }
            },
            error: function (data) {
                EXCHANGE.ButtonSpinner.Stop();
                app.viewModels.Pre65FamilyViewModel.errorMessage_Lbl("Some error has occured. Please try again later");
            }
        });
    };

} (EXCHANGE));
