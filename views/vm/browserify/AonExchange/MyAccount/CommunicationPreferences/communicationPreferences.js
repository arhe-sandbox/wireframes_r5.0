(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.communicationPreferences");

    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializePage();
    });

    ns.initializePage = function initializePage() {
        ns.setupViewModels();
        ns.hideEditForms();
        ns.setupBindings();
        ns.setupAddressRadios();
        ns.setupDropdowns();

        var openPrimaryAddressForEditing = app.functions.getKeyValueFromWindowLocation('EditPrimaryAddress');
        if (openPrimaryAddressForEditing == 'true') {
            app.viewModels.CommunicationPreferencesViewModel.displayChangePrimaryAddressMessage(true);
        }

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/CommunicationPreferencesViewModel",
            dataType: "json",
            success: function (data) {
                app.viewModels.CommunicationPreferencesViewModel.loadFromJSON(data);
                ns.refreshUI();
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            },
            error: function () {
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            }
        });
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.CommunicationPreferencesViewModel = new app.models.CommunicationPreferencesViewModel();
        ko.applyBindings(app.viewModels, $('#communication-preferences').get(0));
    };

    ns.hideEditForms = function hideEditForms() {
    };

    ns.setupBindings = function setupBindings() {
        app.functions.setupPhoneFormatting();
    };

    ns.refreshUI = function refreshUI() {

        app.placeholder.applyPlaceholder();
        //open primary address for editing if we came from login conflict after changing zip.
        if (app.viewModels.CommunicationPreferencesViewModel.displayChangePrimaryAddressMessage()) {
            var newZip = app.functions.getKeyValueFromWindowLocation('NewZip');

            $.each(app.viewModels.CommunicationPreferencesViewModel.addressVms(), function (index, item) {
                if (item.isPrimary()) {
                    app.viewModels.CommunicationPreferencesViewModel.editAddressByIndex(item.index());

                    //clear old values from address, prefill new zip
                    item.editStreet1('');
                    item.editStreet2('');
                    item.editCity('');
                    item.editState('Select One');

                    item.editZip(newZip);
                    ns.getCountiesForNewZip($('.edit-addr-zip[addridx="' + index + '"]'));

                    app.viewModels.CommunicationPreferencesViewModel.displayChangePrimaryAddressMessage(true);
                    return;
                }
            });
        }
        ns.setupDropdowns();
        ns.updateRadioStates();
        ns.bindCountyChangeKeyUp();
        ns.updateDropkickDropdowns();
    };

    ns.setupAddressRadios = function setupAddressRadios() {
        $('.addresses').find('input').customInput();
    };

    ns.submitContactPreference = function submitContactPreference(contactPreferenceEnum, ajaxCallback) {
        var args = JSON.stringify({ PreferredContactMethod: contactPreferenceEnum });
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/SubmitContactPreference",
            dataType: "json",
            data: args,
            success: function () {
                if ($.isFunction(ajaxCallback)) {
                    ajaxCallback();
                }
            }
        });
    };

    ns.saveBothPhones = function saveBothPhones(ajaxCallback) {
        var args = JSON.stringify({
            PrimaryPhone: app.viewModels.CommunicationPreferencesViewModel.primaryNumber(),
            SecondaryPhone: app.viewModels.CommunicationPreferencesViewModel.secondaryNumber()
        });
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/SaveAllPhones",
            dataType: "json",
            data: args,
            success: function () {
                if ($.isFunction(ajaxCallback)) {
                    ajaxCallback();
                }
            }
        });
    };

    self.validateUpdatePhone = function validateUpdatePhone(ajaxCallback) {
        var isPrimary = app.viewModels.CommunicationPreferencesViewModel.isEditingPrimary();
        var args = JSON.stringify({
            Phone: isPrimary ? app.viewModels.CommunicationPreferencesViewModel.primaryNumber_tb() : app.viewModels.CommunicationPreferencesViewModel.secondaryNumber_tb(),
            IsPrimary: isPrimary
        });
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/ValidateUpdatePhone",
            dataType: "json",
            data: args,
            success: function (data) {
                if ($.isFunction(ajaxCallback)) {
                    ajaxCallback();
                }
                app.viewModels.CommunicationPreferencesViewModel.canSwitch(false);
                if (data.IsValid) {
                    app.viewModels.CommunicationPreferencesViewModel.savePhone();
                } 
                else {
                    ns.setInlineErrorsPhone(data.Errors, app.viewModels.CommunicationPreferencesViewModel.isEditingPrimary());
                }

            }
        });

        ns.clearInlineErrorsPhone(isPrimary);
    };

    ns.setInlineErrorsPhone = function (errors, isPrimary) {
        var classString = isPrimary ? ".primary-phone" : ".secondary-phone";
        app.viewModels.CommunicationPreferencesViewModel.inlineErrorsExistPhone(true);
        $('#communication-phone').find(classString).addClass('error-field');
        for (var i = 0; i < errors.length; i++) {
            app.viewModels.CommunicationPreferencesViewModel.inlineErrorsPhone.push(errors[i].ErrorMessage);
        }
    };

    ns.clearInlineErrorsPhone = function clearInlineErrorsPhone(isPrimary) {
        var classString = isPrimary ? ".primary-phone" : ".secondary-phone";
        app.viewModels.CommunicationPreferencesViewModel.inlineErrorsExistPhone(false);
        app.viewModels.CommunicationPreferencesViewModel.inlineErrorsPhone([]);
        $('#communication-phone').find(classString).removeClass('error-field');
    };


    ns.validateUpdateEmail = function validateUpdateEmail(ajaxCallback) {
        EXCHANGE.ButtonSpinner = $('#btnEmailSave').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.SMALLBLUE });

        var args = JSON.stringify({
            Email1: app.viewModels.CommunicationPreferencesViewModel.userEmailAddress_tb(),
            Email2: app.viewModels.CommunicationPreferencesViewModel.userEmailAddressConfirm_tb()
        });
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/ValidateUpdateEmail",
            dataType: "json",
            data: args,
            success: function (data) {
                if ($.isFunction(ajaxCallback)) {
                    ajaxCallback();
                }
                if (data.IsValid) {
                    app.viewModels.CommunicationPreferencesViewModel.saveEmailAddress();
                }
                else {
                    ns.setInlineErrorsEmail(data.Errors);
                }
                EXCHANGE.ButtonSpinner.Stop();
            },
            error: function () {
                EXCHANGE.ButtonSpinner.Stop();
            }
        });

        ns.clearInlineErrorsEmail();
    };

    ns.clearInlineErrorsEmail = function clearInlineErrorsEmail() {
        app.viewModels.CommunicationPreferencesViewModel.inlineErrorsExistEmail(false);
        app.viewModels.CommunicationPreferencesViewModel.inlineErrorsEmail([]);
        $('#edit-email').find('.email-input').removeClass('error-field');
    };

    ns.setInlineErrorsEmail = function setInlineErrorsEmail(errors) {
        app.viewModels.CommunicationPreferencesViewModel.inlineErrorsExistEmail(true);
        $('#edit-email').find('.email-input').addClass('error-field');
        for (var i = 0; i < errors.length; i++) {
            app.viewModels.CommunicationPreferencesViewModel.inlineErrorsEmail.push(errors[i].ErrorMessage);
        }
    };

    ns.clearInlineErrorsUpdateComm = function clearInlineErrorsUpdateComm() {
        app.viewModels.CommunicationPreferencesViewModel.inlineErrorsExistUpdateComm(false);
        app.viewModels.CommunicationPreferencesViewModel.inlineErrorsUpdateComm([]);
        $('#edit-comm-preferences').find('.switchblock').removeClass('error-field');
    };

    ns.setInlineErrorsUpdateComm = function setInlineErrorsUpdateComm(errors) {
        app.viewModels.CommunicationPreferencesViewModel.inlineErrorsExistUpdateComm(true);
        $('#edit-comm-preferences').find('.switchblock').addClass('error-field');
        for (var i = 0; i < errors.length; i++) {
            app.viewModels.CommunicationPreferencesViewModel.inlineErrorsUpdateComm.push(errors[i].ErrorMessage);
        }
    };

    ns.updateCustomInputCommRestrictions = function () {
        $('.comm-editable').find('input').customInput();
    };

    ns.submitCommRestrictions = function submitCommRestrictions(ajaxCallback) {
        var args = JSON.stringify({
            IsOkToCall: app.viewModels.CommunicationPreferencesViewModel.callRadio() == "yes",
            IsOkToEmail: app.viewModels.CommunicationPreferencesViewModel.emailRadio() == "yes",
            IsOkToMail: app.viewModels.CommunicationPreferencesViewModel.mailRadio() == "yes" 
            
        });
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/UpdateCommRestrictions",
            dataType: "json",
            data: args,
            success: function (response) {
                if ($.isFunction(ajaxCallback)) {
                    ajaxCallback();
                }
                if (response.IsValid) {
                    app.viewModels.CommunicationPreferencesViewModel.updateCommRestrictions();
                }
                else {
                    ns.setInlineErrorsUpdateComm(response.Errors);
                }
            }
        });
        ns.clearInlineErrorsUpdateComm();
    };

    ns.setupDropdowns = function () {
        $('.selectstate').dropkick();
    };

    ns.redoDropkick = function redoDropkick(item) {
        $(item).dropkick();
    };

    ns.updateRadioStates = function () {
        $(".address-radio").customInput();
    };

    ns.updateDropkickDropdowns = function () {
        // Okay, so, IE doesn't fire click events on these guys, so for IE we need to listen to mousedown events. This appears to be just when
        // we're also using dropkick, so watch out for that.
        $('.select-state').parents('li').find('.dk_container').find('li').on(($.browser.msie ? 'mousedown' : 'click'), function () {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            var addrIdx = parseInt($(this).parents('li').find('select').attr('data-addr-idx'));
            app.viewModels.CommunicationPreferencesViewModel.addressVms()[addrIdx].editState(selectedVal);
        });
        $('.selectcounty').parents('li').find('.dk_container').find('li').on(($.browser.msie ? 'mousedown' : 'click'), function () {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            var addrIdx = parseInt($(this).parents('li').find('select').attr('data-addr-idx'));
            app.viewModels.CommunicationPreferencesViewModel.addressVms()[addrIdx].editCounty(selectedVal);
        });
        $('.selectcountry').parents('li').find('.dk_container').find('li').on(($.browser.msie ? 'mousedown' : 'click'), function () {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            var addrIdx = parseInt($(this).parents('li').find('select').attr('data-addr-idx'));
            app.viewModels.CommunicationPreferencesViewModel.addressVms()[addrIdx].editCountry(selectedVal);
            ns.getStatesByCountry(selectedVal, addrIdx);
        });

        ns.getStatesByCountry = function (selectedValue, addrIdx) {

            var ddlstate = $('#states' + addrIdx);
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/GetStatesByCountry",
                dataType: "json",
                data: JSON.stringify({ 'countryName': selectedValue }),
                success: function (data) {
                    app.viewModels.CommunicationPreferencesViewModel.addressVms()[addrIdx].stateList(data);
                    ddlstate.dropkick();
                    ns.updateDropkickDropdowns();
                }
            });

        };
    };

    ns.bindCountyChangeKeyUp = function () {
        $('.edit-addr-zip').keyup(function () {
            ns.getCountiesForNewZip(this);
        });
    };

    ns.getCountiesForNewZip = function (selectedInput) {
        var input = $(selectedInput);
        var addrIdx = parseInt(input.attr('addrIdx'));
        var zip = input.val();
        var zipInt = parseInt(zip);

        if (zip.length == 5 && zipInt >= 0 && zipInt < 100000) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/GetCountiesByZip",
                dataType: "json",
                data: JSON.stringify({ 'zip': zip }),
                success: function (data) {
                    app.viewModels.CommunicationPreferencesViewModel.addressVms()[addrIdx].countyList(data);
                    input.parents('ul').find('.selectcounty').dropkick();
                    ns.updateDropkickDropdowns();
                }
            });
        } else {
            app.viewModels.CommunicationPreferencesViewModel.addressVms()[addrIdx].countyList([]);
            input.parents('ul').find('.selectcounty').dropkick();
            ns.updateDropkickDropdowns();
        }
    };
} (EXCHANGE));
