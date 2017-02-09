(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.aboutMe");

    $(document).ready(function () {
        ns.setupViewModels();
        ns.loadViewModels();
        ns.setupMyProfileTabs();
    });

    ns.checkAddressConflict = function() {
        var name = "AddressConflict";
        var string = window.location.href;
        var result = EXCHANGE.functions.getKeyValueFromUrl(name, string);
        if (result === "true") {
            return true;
        }
        return false;
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.PersonalInfoViewModel = new app.models.PersonalInfoViewModel();
        if ($('#my-personal-info')[0] !== undefined)
            ko.applyBindings(app.viewModels.PersonalInfoViewModel, $('#my-personal-info').get(0));

        app.viewModels.CommunicationPreferencesViewModel = new app.models.CommunicationPreferencesViewModel();
        if ($('#my-profile-addresses')[0] !== undefined)
            ko.applyBindings(app.viewModels.CommunicationPreferencesViewModel, $('#my-profile-addresses').get(0));

        app.viewModels.PoaViewModel = new app.models.PoaViewModel();
        if ($('#my-profile-poa')[0] !== undefined)
            ko.applyBindings(app.viewModels.PoaViewModel, $('#my-profile-poa').get(0));

        app.viewModels.CommunicationRestrictionsViewModel = new app.models.CommunicationRestrictionsViewModel();
        if ($('#my-comm-restrictions')[0] !== undefined)
            ko.applyBindings(app.viewModels.CommunicationRestrictionsViewModel, $('#my-comm-restrictions').get(0));
    };

    ns.loadViewModels = function loadViewModels() {
        var isAddressInConflict = ns.checkAddressConflict();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/AboutMeTabViewModel",
            dataType: "json",
            data: JSON.stringify({ 'IsAddressInConflict': isAddressInConflict}),
            success: function (response) {
                app.viewModels.PersonalInfoViewModel.loadFromJSON(response.personalInfoVM);
                app.viewModels.PersonalInfoViewModel.loadRadiosFromBools();
                app.viewModels.PoaViewModel.loadFromJSON(response.poaVM);
                app.viewModels.PoaViewModel.powerOfAttorneyDesignateEdit_radio(app.viewModels.PoaViewModel.powerOfAttorneyDesignateEdit_radio());
                $('.pre65-att-edit-btn').hide();
                if (app.viewModels.PoaViewModel.powerOfAttorneyDesignateEdit_radio() === "Yes") {
                    if (!app.viewModels.PoaViewModel.powerOfAttorneyIsEmpty()) {
                        $('#pre65-att-edit-btn').hide();
                        $('#pre65-att-cancel-btn').hide();
                    }
                    else {
                        $('#pre65-att-edit-btn').show();
                        $('#pre65-att-cancel-btn').show();
                    }
                }
                app.viewModels.CommunicationPreferencesViewModel.loadFromJSON(response.commPreferencesVM);
                app.viewModels.CommunicationRestrictionsViewModel.loadFromJSON(response.commRestrictionsVM);
                app.viewModels.CommunicationRestrictionsViewModel.loadRadiosFromBools();
                $('.pre65-ddl').dropkick();
                ns.setupCountyKeyup();

                if (isAddressInConflict === true) {
                    $('#my-profile-addresses .pre65-ac-addresses .pre65-ac-box a span')[0].click();

                    $("#add-address1").val("");
                    $("#add-address2").val("");
                    $("#add-city").val("");
                    $("#add-zipcode").val(EXCHANGE.user.UserSession.UserProfile.zipCode);
                }

                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            },
            error: function (data) {
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            }
        });

    };

    ns.setupMyProfileTabs = function setupMyProfileTabs() {
        $(document).on("click", ".tab-btn", function () {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            var displayDiv = $(this).attr('href');
            $('.pre65-hide-tabs').hide();
            $(displayDiv).show();

            //Toggle the active class
            var oldActive = $(this).parent().parent().find('li a.active');
            oldActive.toggleClass('active');
            oldActive.toggleClass('inactive');
            $(this).toggleClass('inactive');
            $(this).toggleClass('active');
        });

        //Display the first tab menu by default
        $('.pre65-hide-tabs:first').show();

        //Set default display
        if ($('input:radio[name="rb-attorney"]:checked').val() == 'Yes') {
            $('.pre65-wrap-attorney').show();
        }
        else {
            $('.pre65-wrap-attorney').hide();
        }

        $('input:radio[name="rb-attorney"]').change(function () {
            if ($(this).val() == 'Yes') {
                $('.pre65-wrap-attorney').show('fast');
            }
            else {
                $('.pre65-wrap-attorney').hide('fast');
            }
        });

        if ($('input:radio[name="rb-attorney-addr"]:checked').val() == 'Yes') {
            $('.poa-addr-dd').show();
            $('.poa-address-block').hide();
        }
        else {
            $('.poa-addr-dd').hide();
            $('.poa-address-block').show();
        }

        $('input:radio[name="rb-attorney-addr"]').change(function () {
            if ($(this).val() == 'Yes') {
                $('.poa-addr-dd').show('fast');
                $('.poa-address-block').hide('fast');
            }
            else {
                $('.poa-addr-dd').hide('fast');
                $('.poa-address-block').show('fast');
            }
        });

        
    };

    ns.setupCountyKeyup = function setupCountyKeyup() {

    };

    ns.initializePage = function initializePage() {
        ns.setupViewModels();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/Pre65AboutMeClientViewModel",
            dataType: "json",
            success: function (response) {
                app.viewModels.Pre65MyAccountAboutMeViewModel.loadFromJSON(response.UpdateProfileVM);
                app.viewModels.Pre65MyAccountAboutMeViewModel.Addr().loadFromJSON(response.CommunicationPreferencesVM);
                app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyDesignateEdit_radio(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyDesignate_radio());
                app.viewModels.Pre65MyAccountAboutMeViewModel.CommPref().loadRadiosFromBools();
                $('.pre65-ddl').dropkick();
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            },
            error: function (data) {
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            }
        });
    };





    ns.setupJqueryBindings = function setupJqueryBindings() {

        ns.getCountiesForNewZip();

        $(document).on("click", "#pre65-btn-address", function () {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            //Check if the new address section is displayed. If not, turn it on
            if (!($(".pre65-new-address").is(":visible"))) {
                //Clear input values
                $(".pre65-new-address input").val('');
                $(".pre65-new-address").show();
                $("#pre65-add-submit").val("Submit");
            }
        });

        //Bind the click event for the submit address button
        $(document).on("click", "#pre65-add-submit", function () {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            //Update text to show we're adding a new address
            $(".pre65-new-address h3").html("Add New Address");

            var curName = $("#add-name").val();
            var curAddress1 = $("#add-address1").val();
            var curAddress2 = $("#add-address2").val();
            var curCity = $("#add-city").val();
            var curState = $("#add-state").val();
            var curZip = $("#add-zipcode").val();

            //Add the new address to the list
            $(".pre65-ac-addresses").append('<li class="pre65-ac-box"><h4>' + curName + '</h4><strong><span class="cur-add1">' + curAddress1 + '</span><br /><span class="cur-add2">' + curAddress2 + '</span><br /><span class="cur-city">' + curCity + '</span> <span class="cur-state">' + curState + '</span>, <span class="cur-zip">' + curZip + '</span></strong><a href="#edit" title="Edit Address"><span class="pre65-fa pre65-fa-edit edit-address"></span></a></li>');

            //Clear the inputs in the new address section
            $("#add-name").val('');
            $("#add-address1").val('');
            $("#add-address2").val('');
            $("#add-city").val('');
            $("#add-state").val('');
            $("#add-zipcode").val('');

            //Hide the new address section
            $(".pre65-new-address").hide();

        });

        //Bind the click event for editing addresses
        $(document).on("click", ".pre65-edit-address", function () {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            //Update text to show we're adding a new address
            $(".pre65-new-address h3").html("Editing Address");

            var curLi = $(this).parent().parent();
            //populate inputs with appropriate text
            $("#add-name").val(curLi.find('h4').html());
            $("#add-address1").val(curLi.find('.cur-add1').html());
            $("#add-address2").val(curLi.find('.cur-add2').html());
            $("#add-city").val(curLi.find('.cur-city').html());
            $("#add-state").val(curLi.find('.cur-state').html());
            $("#add-zipcode").val(curLi.find('.cur-zip').html());

            //Display new address area and remove the old html
            $(".pre65-new-address").show();
            $("#pre65-add-submit").val("Submit");
            curLi.remove();

            //Trigger the click events for the dropkick dropdowns so they are updated when editing
            $option = $('#dk_container_add-name .dk_options a[data-dk-dropdown-value="' + curLi.find('h4').html() + '"]');
            $option.trigger("click");
        });

    };



    ns.setupMyProfileReadOnly = function setupMyProfileReadOnly() {
        $(document).on("click", "#pre65-update-profile", function () {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            app.ButtonSpinner = $(this).ButtonSpinner({ buttonType: app.enums.ButtonType.SMALLBLUE });
            ns.saveCommRestrictions();
        });

        $(document).on("click", "#pre65-lnk-att-edit", function () {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            ns.getCountiesForZipAjax(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyZip_tb());
            ns.changePoaPopulateEdits();
            $('.pre65-att-read').hide();
            $('.pre65-att-read-btn').hide();
            $('.pre65-att-edit').show();
        });

        $(document).on("click", "#pre65-att-edit", function () {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            app.ButtonSpinner = $(this).ButtonSpinner({ buttonType: app.enums.ButtonType.SMALLBLUE });
            ns.removeInlineErrorsPoa();
            ns.savePoa();

        });

    };

    ns.changePoaPopulateEdits = function changePoaPopulateEdits() {
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyDesignateEdit_radio(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyDesignate_radio());

        // If we have a power of attorney designated, populate the edit form with his/her info. Else, clear all POA fields
        if (!app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyIsEmpty()) {
            if (app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyFirstName_tb() != '') {
                app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyFirstNameEdit_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyFirstName_tb());
                app.placeholder.clearPlaceholder('#pre65-ed-fna');
            }
            if (app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyLastName_tb() != '') {
                app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyLastNameEdit_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyLastName_tb());
                app.placeholder.clearPlaceholder('#pre65-ed-lna');
            }
            if (app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress1_tb() != '') {
                app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress1Edit_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress1_tb());
                app.placeholder.clearPlaceholder('#pre65-ed-ad1');
            }
            if (app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress2_tb() != '') {
                app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress2Edit_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress2_tb());
                app.placeholder.clearPlaceholder('#pre65-ed-ad2');
            }
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyCityEdit_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyCity_tb());
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyStateEdit_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyState_tb());
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyZipEdit_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyZip_tb());
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyCountyEdit_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyCounty_tb());
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyPhoneEdit_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyPhone_tb());
        }
        else {
            ns.clearPoaFields();
        }
    };

    ns.changePoaPopulateReadonlys = function changePoaPopulateReadonlys() {
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyDesignate_radio(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyDesignateEdit_radio());

        // If user selected to designate a power of attorney, populate the readonly form with his/her info. Else, clear all POA fields
        if (app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyDesignateEdit_radio() == app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyDesignateYes_lbl()) {
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyIsEmpty(false);
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyDesignate_radio(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyDesignateYes_lbl());
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyFirstName_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyFirstNameEdit_tb());
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyLastName_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyLastNameEdit_tb());
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress1_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress1Edit_tb());
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress2_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress2Edit_tb());
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyCity_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyCityEdit_tb());
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyState_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyStateEdit_tb());
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyZip_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyZipEdit_tb());
            for (var i = 0; i < app.viewModels.Pre65MyAccountAboutMeViewModel.POA().countyList().length; i++) {
                if (app.viewModels.Pre65MyAccountAboutMeViewModel.POA().countyList()[i].Id === app.viewModels.Pre65MyAccountAboutMeViewModel.POA().countyId_boundToSelectValue()) {
                    app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyCounty_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().countyList()[i].CountyName); ; break;
                }
            }
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyPhone_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyPhoneEdit_tb());
        }
        else {
            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyIsEmpty(true);
            ns.clearPoaFields();
        }
    };

    ns.clearPoaFields = function clearPoaFields() {
        // Clear readonlys
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyFirstName_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyLastName_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress1_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress2_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyCity_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyState_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyZip_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyCounty_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyPhone_tb('');

        //Clear edits
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyFirstNameEdit_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyLastNameEdit_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress1Edit_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress2Edit_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyCityEdit_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyStateEdit_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyZipEdit_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyCountyEdit_tb('');
        app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyPhoneEdit_tb('');

        //blurring these fields makes the placeholder ie plugin work properly
        $('#pre65-ed-fna').blur();
        $('#pre65-ed-lna').blur();
        $('#pre65-ed-ad1').blur();
        $('#pre65-ed-ad2').blur();
    };

    ns.getCountiesForNewZip = function () {
        $('#pre65-ed-zi').unbind('keyup');

        $('#pre65-ed-zi').keyup(function () {
            var input = $(this);
            var zip = input.val();
            var zipInt = parseInt(zip);

            if (zip.length == 5 && zipInt >= 0 && zipInt < 100000) {
                if (!ns.pendingCountyLookup) {
                    ns.pendingCountyLookup = true;
                    ns.getCountiesForZipAjax(zip);
                }
            } else {
                app.viewModels.Pre65MyAccountAboutMeViewModel.POA().countyList([]);
                app.functions.redrawDropkickBySelectElementId('pre65-ed-co');
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
                    app.viewModels.Pre65MyAccountAboutMeViewModel.POA().countyList(data);
                    for (var i = 0; i < app.viewModels.Pre65MyAccountAboutMeViewModel.POA().countyList().length; i++) {
                        if (app.viewModels.Pre65MyAccountAboutMeViewModel.POA().countyList()[i].CountyName === app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyCounty_tb()) {
                            app.viewModels.Pre65MyAccountAboutMeViewModel.POA().countyId_boundToSelectValue(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().countyList()[i].Id); ; break;
                        }
                    }
                }

                app.functions.redrawDropkickBySelectElementId('pre65-ed-co');
                ns.pendingCountyLookup = false;

            },
            failure: function () {
                ns.pendingCountyLookup = false;
            }
        });
    };

    ns.saveAddress = function saveAddress() {

    };

    ns.saveCommRestrictions = function saveCommRestrictions() {
        var args = JSON.stringify({
            IsOkToCall: app.viewModels.Pre65MyAccountAboutMeViewModel.CommPref().callRadio() == true,
            IsOkToEmail: app.viewModels.Pre65MyAccountAboutMeViewModel.CommPref().emailRadio() == true,
            IsOkToMail: app.viewModels.Pre65MyAccountAboutMeViewModel.CommPref().mailRadio() == true

        });
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/UpdateCommRestrictions",
            dataType: "json",
            data: args,
            success: function (response) {
                app.ButtonSpinner.Stop();
                if (response.IsValid) {
                    app.viewModels.Pre65MyAccountAboutMeViewModel.CommPref().updateCommRestrictions();
                }
                else {
                    ns.setInlineErrorsCommPref(response.Errors);
                }
            }
        });
        ns.clearInlineErrorsCommPref();
    };

    ns.savePoa = function savePoa() {
        // If user is saving with No selected, remove the POA from his account. Else, validate the POA details
        if (app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyDesignateEdit_radio() == app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyDesignateNo_lbl()) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/RemovePowerOfAttorney",
                dataType: "json",
                success: function () {
                    app.ButtonSpinner.Stop();
                    $('.pre65-att-edit').hide();
                    $('.pre65-att-read').show();
                    ns.changePoaPopulateReadonlys();
                }
            });
        } else {
            for (var i = 0; i < app.viewModels.Pre65MyAccountAboutMeViewModel.POA().countyList().length; i++) {
                if (app.viewModels.Pre65MyAccountAboutMeViewModel.POA().countyList()[i].Id === $('#pre65-ed-co').parent().find('.dk_option_current a').attr('data-dk-dropdown-value')) {
                    app.viewModels.Pre65MyAccountAboutMeViewModel.POA().countyId_boundToSelectValue(app.viewModels.Pre65MyAccountAboutMeViewModel.POA().countyList()[i].Id); ; break;
                }
            }
            var poaArgs = {
                FirstName: app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyFirstNameEdit_tb(),
                LastName: app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyLastNameEdit_tb(),
                Address1: app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress1Edit_tb(),
                Address2: app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyAddress2Edit_tb(),
                City: app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyCityEdit_tb(),
                State: app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyStateEdit_tb(),
                Zip: app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyZipEdit_tb(),
                CountyId: app.viewModels.Pre65MyAccountAboutMeViewModel.POA().countyId_boundToSelectValue(),
                Phone: app.viewModels.Pre65MyAccountAboutMeViewModel.POA().powerOfAttorneyPhoneEdit_tb()
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
                        $('.pre65-att-edit').hide();
                        $('.pre65-att-read').show();
                        $('.pre65-att-read-btn').show();
                        ns.changePoaPopulateReadonlys();
                    }
                }
            });
        }
    };

    ns.populatePersonalInfoReads = function populatePersonalInfoReads() {
        // This method is called once the server has ensured that the submitted values are valid and that 
        // edit mode should be replaced by an updated read-only mode. 

        app.viewModels.Pre65MyAccountAboutMeViewModel.firstName_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.firstNameEdit_tb());
        app.viewModels.Pre65MyAccountAboutMeViewModel.lastName_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.lastNameEdit_tb());
        app.viewModels.Pre65MyAccountAboutMeViewModel.gender_tb(app.viewModels.Pre65MyAccountAboutMeViewModel.genderEdit_radio());

        // Date of birth view model Year/Month/Day were already populated before submitting to server; however,
        // the ModelYear/ModelMonth/ModelDay should be updated, now that the server has approved the values, so 
        // that our "local copy of server value" is accurate again.        
        var dateOfBirth = app.viewModels.Pre65MyAccountAboutMeViewModel.dateOfBirth;
        dateOfBirth.ModelYear(dateOfBirth.Year());
        dateOfBirth.ModelMonth(dateOfBirth.Month());
        dateOfBirth.ModelDay(dateOfBirth.Day());
        app.viewModels.Pre65MyAccountAboutMeViewModel.CommPref().userEmailAddress(app.viewModels.Pre65MyAccountAboutMeViewModel.CommPref().userEmailAddress_tb());
    };


    ns.loadInlineErrors = function loadInlineErrors(data, section) {
        var hasInlineErrors = false;
        EXCHANGE.viewModels.Pre65MyAccountAboutMeViewModel.clearInlineErrors(section);
        inlineErrors = [];
        for (var i = 0; i < data.Errors.length; i++) {
            var error = data.Errors[i].ErrorMessage;
            if (error.indexOf("inline:") != -1) {
                error = error.substring(error.indexOf("inline:") + "inline:".length);
            }

            inlineErrors.push(data.Errors[i]);
            EXCHANGE.viewModels.Pre65MyAccountAboutMeViewModel.addInlineError(error, section);
            hasInlineErrors = true;
        }
        return hasInlineErrors;
    };

    ns.displayInlineErrors = function displayInlineErrors() {
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "FirstName") {
                $('#tabs-1').find('#pre65-ab-fn').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "LastName") {
                $('#tabs-1').find('#pre65-ab-ln').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "DateOfBirthYear") {
                $('#tabs-1').find('#dk_container_pre65-ab-dobY').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "DateOfBirthMonth") {
                $('#tabs-1').find('#dk_container_pre65-ab-dobM').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "DateOfBirthDay") {
                $('#tabs-1').find('#dk_container_pre65-ab-dobD').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "DateOfBirth.DateOfBirth") {
                $('#tabs-1').find('#dk_container_pre65-ab-dobY').addClass('error-field');
                $('#tabs-1').find('#dk_container_pre65-ab-dobM').addClass('error-field');
                $('#tabs-1').find('#dk_container_pre65-ab-dobD').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "Phone") {
                $('#tabs-1').find('#pre65-ab-pn').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "Email") {
                $('#tabs-1').find('#pre65-ab-em').addClass('error-field');
            }
        }
    };

    ns.displayInlineErrorsPoa = function displayInlineErrorsPoa() {
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "FirstName") {
                $('#pre65-ed-fna').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "LastName") {
                $('#pre65-ed-lna').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "State") {
                $('#pre65-ed-st').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "Zip") {
                $('#pre65-ed-zi').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "Phone") {
                $('#pre65-ed-pn').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "Address1") {
                $('#pre65-ed-ad1').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "Address2") {
                $('#pre65-ed-ad2').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "CountyId") {
                $('#dk_container_pre65-ed-co').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "City") {
                $('#pre65-ed-ci').addClass('error-field');
            } else {
                console.log('missed:' + inlineErrors[i].PropertyName);
            }
        }
    };

    ns.removeErrorsProfileInfo = function removeErrorsProfileInfo() {
        EXCHANGE.viewModels.Pre65MyAccountAboutMeViewModel.clearInlineErrors('profileInfo');
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

    ns.clearInlineErrorsCommPref = function clearInlineErrorsCommPref() {
        app.viewModels.Pre65MyAccountAboutMeViewModel.inlineErrorsExistCommPref(false);
        app.viewModels.Pre65MyAccountAboutMeViewModel.inlineErrorsCommPref([]);
        $('ul.pre65-ac-checks li').removeClass('error-field');
    };

    ns.setInlineErrorsCommPref = function setInlineErrorsCommPref(errors) {
        app.viewModels.Pre65MyAccountAboutMeViewModel.inlineErrorsExistCommPref(true);
        $('ul.pre65-ac-checks li').addClass('error-field');
        for (var i = 0; i < errors.length; i++) {
            app.viewModels.Pre65MyAccountAboutMeViewModel.inlineErrorsCommPref.push(errors[i].ErrorMessage);
        }
    };

    ns.removeInlineErrorsPoa = function removeInlineErrorsPoa() {
        EXCHANGE.viewModels.Pre65MyAccountAboutMeViewModel.clearInlineErrors('poa');
        $('#pre65-ed-fna').removeClass('error-field');
        $('#pre65-ed-lna').removeClass('error-field');
        $('#pre65-ed-st').removeClass('error-field');
        $('#pre65-ed-zi').removeClass('error-field');
        $('#pre65-ed-pn').removeClass('error-field');
        $('#pre65-ed-ad1').removeClass('error-field');
        $('#pre65-ed-ad2').removeClass('error-field');
        $('#dk_container_pre65-ed-co').removeClass('error-field');
        $('#pre65-ed-ci').removeClass('error-field');
    };

} (EXCHANGE));
