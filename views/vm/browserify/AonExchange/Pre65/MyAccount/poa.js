(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.poa");

    $(document).ready(function () {
        // Initialize only if using "communication restrictions" as a separate webpart.
        //ns.initializePage();
        ns.setupBindings();
    });

    ns.setupBindings = function setupBindings() {
        $(document).on("click", "#pre65-lnk-att-edit", function () {
            if (!$.browser.mozilla) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
            }
            ns.changePoaPopulateEdits();
            $('.pre65-att-read').hide();
            $('.pre65-att-read-btn').hide();
            $('.pre65-att-edit').show();
            $('.pre65-att-edit-btn').show();
            $('.poa-addr-select').show();
            if ($.browser.mozilla) {
                return false;
            }
        });
        

        $(document).ready(function () {
            $('.poa-addr-select').hide();
            $('.poa-addr-dd').hide();

            $('#my-profile-poa').on(($.browser.msie ? 'mousedown' : 'click'), 'div#dk_container_poa-add-dropdown div.dk_options a', function (e) {
                var chosenval = $(this).attr('data-dk-dropdown-value');
                app.viewModels.PoaViewModel.poaCustAddr_tb(chosenval);
                app.viewModels.PoaViewModel.updatePoaAddr(chosenval);
            });

            $("*[name='rb-attorney']").change(function () {
                app.viewModels.PoaViewModel.powerOfAttorneyCountyEdit_tb(app.viewModels.PoaViewModel.powerOfAttorneyCounty_tb());
                app.viewModels.PoaViewModel.powerOfAttorneyStateEdit_tb(app.viewModels.PoaViewModel.powerOfAttorneyState_tb());
                if ($(this).attr('value') == "Yes") {
                    if (app.viewModels.PoaViewModel.powerOfAttorneyState_tb() === '') {
                        app.placeholder.clearPlaceholder('#pre65-ed-st');
                        $("div.dk_options ul.dk_options_inner>li").removeClass("dk_option_current");
                        $("div.dk_options ul.dk_options_inner li:first-child").addClass("dk_option_current");
                        $("div#dk_container_pre65-ed-st a.dk_toggle span.dk_label").text("Select One");
                    }
                }
                if ($(this).attr('value') == "No") {
                    if (!app.viewModels.PoaViewModel.powerOfAttorneyIsEmpty()) {
                        $('#pre65-att-edit-btn').show();
                        $('#pre65-att-cancel-btn').show();
                    }
                    if (app.viewModels.PoaViewModel.powerOfAttorneyIsEmpty()) {
                        $('#pre65-att-edit-btn').hide();
                        $('#pre65-att-cancel-btn').hide();
                    }
                }
                $('#dk_container_pre65-ed-st').attr('tabindex', '0');
            });
            

        });

        $(document).on("click", "#pre65-att-edit-btn", function () {
            if (!$.browser.mozilla) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
            }
            ns.removeInlineErrorsPoa();
            app.ButtonSpinner = $(this).ButtonSpinner({ buttonType: app.enums.ButtonType.SMALLBLUE });
            ns.savePoa();
            if ($.browser.mozilla) {
                return false;
            }
        });

        $(document).on("click", "#pre65-att-cancel-btn", function () {
            if (!$.browser.mozilla) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
            }
            if ($('#radio1').is(':checked')) {
                $('.pre65-att-edit').hide();
                $('.pre65-att-edit-btn').hide();
                $('.pre65-att-read').show();
                $('.pre65-att-read-btn').show();
                if (app.viewModels.PoaViewModel.powerOfAttorneyIsEmpty()) {
                    app.viewModels.PoaViewModel.powerOfAttorneyDesignateEdit_radio('No');
                }
            }
            else if ($('#radio2').is(':checked')) {
                $('.pre65-att-edit').hide();
                $('.pre65-att-edit-btn').hide();
                $('.pre65-att-read').show();
                $('.pre65-att-read-btn').show();
                app.viewModels.PoaViewModel.powerOfAttorneyDesignateEdit_radio('Yes');
            }
            $('.poa-addr-select').hide();
            if ($.browser.mozilla) {
                return false;
            }
        });

    };

    ns.initializePage = function initializePage() {
        if (app.viewModels.PoaViewModel == null) {
            ns.setupViewModels();
        }
        if (app.viewModels.PoaViewModel.isVMLoaded() === false) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/CommunicationRestrictionsViewModel",
                dataType: "json",
                success: function (response) {
                    app.viewModels.PoaViewModel.loadFromJSON(response);
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
        app.viewModels.PoaViewModel = new app.models.PoaViewModel();
        ko.applyBindings(app.viewModels, $('#my-profile-poa').get(0));
    };


    ns.changePoaPopulateEdits = function changePoaPopulateEdits() {
        //app.viewModels.PoaViewModel.powerOfAttorneyDesignateEdit_radio(app.viewModels.PoaViewModel.powerOfAttorneyDesignate_radio());
        app.viewModels.PoaViewModel.powerOfAttorneyDesignate_radio(app.viewModels.PoaViewModel.powerOfAttorneyDesignateEdit_radio());

        // If we have a power of attorney designated, populate the edit form with his/her info. Else, clear all POA fields
        if (!app.viewModels.PoaViewModel.powerOfAttorneyIsEmpty()) {
            if (app.viewModels.PoaViewModel.powerOfAttorneyFirstName_tb() != '') {
                app.viewModels.PoaViewModel.powerOfAttorneyFirstNameEdit_tb(app.viewModels.PoaViewModel.powerOfAttorneyFirstName_tb());
                app.placeholder.clearPlaceholder('#pre65-ed-fna');
            }
            if (app.viewModels.PoaViewModel.powerOfAttorneyLastName_tb() != '') {
                app.viewModels.PoaViewModel.powerOfAttorneyLastNameEdit_tb(app.viewModels.PoaViewModel.powerOfAttorneyLastName_tb());
                app.placeholder.clearPlaceholder('#pre65-ed-lna');
            }
            if (app.viewModels.PoaViewModel.powerOfAttorneyAddress1_tb() != '') {
                app.viewModels.PoaViewModel.powerOfAttorneyAddress1Edit_tb(app.viewModels.PoaViewModel.powerOfAttorneyAddress1_tb());
                app.placeholder.clearPlaceholder('#pre65-ed-ad1');
            }
            if (app.viewModels.PoaViewModel.powerOfAttorneyAddress2_tb() != '') {
                app.viewModels.PoaViewModel.powerOfAttorneyAddress2Edit_tb(app.viewModels.PoaViewModel.powerOfAttorneyAddress2_tb());
                app.placeholder.clearPlaceholder('#pre65-ed-ad2');
            }
            app.viewModels.PoaViewModel.powerOfAttorneyCityEdit_tb(app.viewModels.PoaViewModel.powerOfAttorneyCity_tb());
            app.viewModels.PoaViewModel.powerOfAttorneyStateEdit_tb(app.viewModels.PoaViewModel.powerOfAttorneyState_tb());
            app.functions.setDropdownSelectedOption('#dk_container_pre65-ed-st', app.viewModels.PoaViewModel.powerOfAttorneyState_tb());
            app.viewModels.PoaViewModel.powerOfAttorneyZipEdit_tb(app.viewModels.PoaViewModel.powerOfAttorneyZip_tb());
            app.viewModels.PoaViewModel.powerOfAttorneyCountyEdit_tb(app.viewModels.PoaViewModel.powerOfAttorneyCounty_tb());
            app.viewModels.PoaViewModel.powerOfAttorneyPhoneEdit_tb(app.viewModels.PoaViewModel.powerOfAttorneyPhone_tb());
        }
        else {
            ns.clearPoaFields();
        }
    };

    ns.changePoaPopulateReadonlys = function changePoaPopulateReadonlys() {
        app.viewModels.PoaViewModel.powerOfAttorneyDesignate_radio(app.viewModels.PoaViewModel.powerOfAttorneyDesignateEdit_radio());

        // If user selected to designate a power of attorney, populate the readonly form with his/her info. Else, clear all POA fields
        if (app.viewModels.PoaViewModel.powerOfAttorneyDesignateEdit_radio() == app.viewModels.PoaViewModel.powerOfAttorneyDesignateYes_lbl()) {
            app.viewModels.PoaViewModel.powerOfAttorneyIsEmpty(false);
            app.viewModels.PoaViewModel.powerOfAttorneyDesignate_radio(app.viewModels.PoaViewModel.powerOfAttorneyDesignateYes_lbl());
            app.viewModels.PoaViewModel.powerOfAttorneyFirstName_tb(app.viewModels.PoaViewModel.powerOfAttorneyFirstNameEdit_tb());
            app.viewModels.PoaViewModel.powerOfAttorneyLastName_tb(app.viewModels.PoaViewModel.powerOfAttorneyLastNameEdit_tb());
            app.viewModels.PoaViewModel.powerOfAttorneyAddress1_tb(app.viewModels.PoaViewModel.powerOfAttorneyAddress1Edit_tb());
            app.viewModels.PoaViewModel.powerOfAttorneyAddress2_tb(app.viewModels.PoaViewModel.powerOfAttorneyAddress2Edit_tb());
            app.viewModels.PoaViewModel.powerOfAttorneyCity_tb(app.viewModels.PoaViewModel.powerOfAttorneyCityEdit_tb());
            app.viewModels.PoaViewModel.powerOfAttorneyState_tb(app.viewModels.PoaViewModel.powerOfAttorneyStateEdit_tb());
            app.viewModels.PoaViewModel.powerOfAttorneyZip_tb(app.viewModels.PoaViewModel.powerOfAttorneyZipEdit_tb());
            for (var i = 0; i < app.viewModels.PoaViewModel.countyList().length; i++) {
                if (app.viewModels.PoaViewModel.countyList()[i].Id === app.viewModels.PoaViewModel.countyId_boundToSelectValue()) {
                    app.viewModels.PoaViewModel.powerOfAttorneyCounty_tb(app.viewModels.PoaViewModel.countyList()[i].CountyName); ; break;
                }
            }
            app.viewModels.PoaViewModel.powerOfAttorneyPhone_tb(app.viewModels.PoaViewModel.powerOfAttorneyPhoneEdit_tb());
        }
        else {
            app.viewModels.PoaViewModel.powerOfAttorneyIsEmpty(true);
            ns.clearPoaFields();
        }
    };

    ns.clearPoaFields = function clearPoaFields() {
        // Clear readonlys
        app.viewModels.PoaViewModel.powerOfAttorneyFirstName_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyLastName_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyAddress1_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyAddress2_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyCity_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyState_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyZip_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyCounty_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyPhone_tb('');

        //Clear edits
        app.viewModels.PoaViewModel.powerOfAttorneyFirstNameEdit_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyLastNameEdit_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyAddress1Edit_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyAddress2Edit_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyCityEdit_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyStateEdit_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyZipEdit_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyCountyEdit_tb('');
        app.viewModels.PoaViewModel.powerOfAttorneyPhoneEdit_tb('');

        //blurring these fields makes the placeholder ie plugin work properly
        $('#pre65-ed-fna').blur();
        $('#pre65-ed-lna').blur();
        $('#pre65-ed-ad1').blur();
        $('#pre65-ed-ad2').blur();
        app.functions.updateDropkick('#pre65-ed-st', "Select One");
        app.viewModels.PoaViewModel.countyList([]);
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
                app.viewModels.PoaViewModel.countyList([]);
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
                    app.viewModels.PoaViewModel.countyList(data);
                    for (var i = 0; i < app.viewModels.PoaViewModel.countyList().length; i++) {
                        if (app.viewModels.PoaViewModel.countyList()[i].CountyName === app.viewModels.PoaViewModel.powerOfAttorneyCounty_tb() || app.viewModels.PoaViewModel.countyList()[i].Id === app.viewModels.PoaViewModel.powerOfAttorneyCountyEdit_tb()) {
                            app.viewModels.PoaViewModel.countyId_boundToSelectValue(app.viewModels.PoaViewModel.countyList()[i].Id); ; break;
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

    ns.savePoa = function savePoa() {
        // If user is saving with No selected, remove the POA from his account. Else, validate the POA details
        if (app.viewModels.PoaViewModel.powerOfAttorneyDesignateEdit_radio() == app.viewModels.PoaViewModel.powerOfAttorneyDesignateNo_lbl()) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/RemovePowerOfAttorney",
                dataType: "json",
                success: function () {
                    app.ButtonSpinner.Stop();
                    $('.pre65-att-edit').hide();
                    $('.pre65-att-edit-btn').hide();
                    $('.pre65-att-read').show();
                    $('.poa-addr-select').hide();
                    ns.changePoaPopulateReadonlys();
                    app.viewModels.PoaViewModel.powerOfAttorneyIsEmpty(true);
                    //app.viewModels.Pre65MyAccountAboutMeViewModel.changesSavedPoa(true);
                }
            });
        } else {
            for (var i = 0; i < app.viewModels.PoaViewModel.countyList().length; i++) {
                if (app.viewModels.PoaViewModel.countyList()[i].Id === $('#pre65-ed-co').parent().find('.dk_option_current a').attr('data-dk-dropdown-value')) {
                    app.viewModels.PoaViewModel.countyId_boundToSelectValue(app.viewModels.PoaViewModel.countyList()[i].Id); ; break;
                }
            }
            app.viewModels.PoaViewModel.powerOfAttorneyStateEdit_tb($('#pre65-ed-st').parent().find('.dk_option_current a').attr('data-dk-dropdown-value'));
            var poaArgs = {
                FirstName: app.viewModels.PoaViewModel.powerOfAttorneyFirstNameEdit_tb(),
                LastName: app.viewModels.PoaViewModel.powerOfAttorneyLastNameEdit_tb(),
                Address1: app.viewModels.PoaViewModel.powerOfAttorneyAddress1Edit_tb(),
                Address2: app.viewModels.PoaViewModel.powerOfAttorneyAddress2Edit_tb(),
                City: app.viewModels.PoaViewModel.powerOfAttorneyCityEdit_tb(),
                State: app.viewModels.PoaViewModel.powerOfAttorneyStateEdit_tb(),
                Zip: app.viewModels.PoaViewModel.powerOfAttorneyZipEdit_tb(),
                CountyId: app.viewModels.PoaViewModel.countyId_boundToSelectValue(),
                Phone: app.viewModels.PoaViewModel.powerOfAttorneyPhoneEdit_tb()
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
                        $('.pre65-att-edit-btn').hide();
                        $('.pre65-att-read').show();
                        $('.pre65-att-read-btn').show();
                        $('.poa-addr-select').hide();
                        ns.changePoaPopulateReadonlys();
                        app.viewModels.PoaViewModel.powerOfAttorneyIsEmpty(false);
                        //app.viewModels.UpdateProfileViewModel.changesSavedPoa(true);
                    }
                }
            });
        }
    };

    ns.displayInlineErrorsPoa = function displayInlineErrorsPoa() {
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "FirstName") {
                $('#pre65-ed-fna').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "LastName") {
                $('#pre65-ed-lna').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "State") {
                $('#dk_container_pre65-ed-st').addClass('error-field');
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
                $('#dk_container_pre65-ed-st').addClass('error-field');
                $('#pre65-ed-zi').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "City") {
                $('#pre65-ed-ci').addClass('error-field');
            } else {
                console.log('missed:' + inlineErrors[i].PropertyName);
            }
        }
    };

    ns.loadInlineErrors = function loadInlineErrors(data, section) {
        var hasInlineErrors = false;
        ns.clearInlineErrors();
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

    ns.removeInlineErrorsPoa = function removeInlineErrorsPoa() {
        ns.clearInlineErrors();
        $('#pre65-ed-fna').removeClass('error-field');
        $('#pre65-ed-lna').removeClass('error-field');
        $('#pre65-ed-st').removeClass('error-field');
        $('#pre65-ed-zi').removeClass('error-field');
        $('#pre65-ed-pn').removeClass('error-field');
        $('#pre65-ed-ad1').removeClass('error-field');
        $('#pre65-ed-ad2').removeClass('error-field');
        $('#dk_container_pre65-ed-co').removeClass('error-field');
        $('#pre65-ed-ci').removeClass('error-field');
        $('#dk_container_pre65-ed-st').removeClass('error-field');

    };

    ns.addInlineError = function addInlineError(error) {
        app.viewModels.PoaViewModel.inlineErrorsExistPoa(true);
        var errorListPoa = app.viewModels.PoaViewModel.inlineErrorsPoa();
        errorListPoa.push(error);
        app.viewModels.PoaViewModel.inlineErrorsPoa(errorListPoa);
    };

    ns.clearInlineErrors = function clearInlineError() {
        app.viewModels.PoaViewModel.inlineErrorsExistPoa(false);
        app.viewModels.PoaViewModel.inlineErrorsPoa([]);
    };

} (EXCHANGE));