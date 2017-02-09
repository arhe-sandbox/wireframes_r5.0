(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.myGuidedAction");

    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        EXCHANGE.WaitPopup = $(window).WaitPopup({ contentTemplate: true });
        app.decisionSupport.initializeDecisionSupport();
        ns.initializePage();
        app.viewModels.UpdateProfileViewModel = new app.models.UpdateProfileViewModel();
        $(".browse-page .colmL").css("width", "970px");
        $(".browse-page .colmL").css("padding-top", "130px");
        $(".pre65-ac-container").css("margin-top", "2px");
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/UpdateProfileClientViewModel",
            dataType: "json",
            success: function (response) {
                app.viewModels.UpdateProfileViewModel.loadFromJSON(response);
            },
            error: function (data) {
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            }
        });

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/FirstActionNeededViewModel",
            dataType: "json",

            success: function (response) {
                // EXCHANGE.WaitPopup = $(window).WaitPopup({ contentTemplate: true });

                if (app.viewModels.UpdateProfileViewModel.doneLoading()) {
                    ns.guidedActionViewModelSuccessCallback(response);
                } else {
                    app.viewModels.UpdateProfileViewModel.doneLoading.subscribe(function (newValue) {
                        ns.guidedActionViewModelSuccessCallback(response);
                    });
                }
                // select and dropkick work
                app.functions.addMonthOptionsSubscription(app.viewModels.UpdateProfileViewModel.dateOfBirth, 'month', true);
                $('#updateProfileAboutMeEditForm').find('.selectfield').dropkick();
            }
        });
    });

    ns.initializePage = function initializePage() {
        ns.setupViewModels();
        ns.bindEvents();
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.MyGuidedActionViewModel = new app.models.MyGuidedActionViewModel();
        ko.applyBindings(app.viewModels.MyGuidedActionViewModel, $('#update-profile').get(0));

    };
    ns.guidedActionViewModelSuccessCallback = function guidedActionViewModelSuccessCallback(response) {
        app.viewModels.MyGuidedActionViewModel.loadFromJSON(response);
        app.viewModels.MyGuidedActionViewModel.POA(app.viewModels.PoaViewModel);


        app.viewModels.MyGuidedActionViewModel.medCabinet(app.viewModels.UpdateProfileViewModel.medCabinet());
        //app.viewModels.MyGuidedActionViewModel.POA().ShowWebPart(false);
        app.viewModels.MyGuidedActionViewModel.medCabinet().ShowWebPart(false);
        app.viewModels.MyGuidedActionViewModel.MyAppointmentsViewModel().ShowWebPart(false);
        app.viewModels.MyGuidedActionViewModel.CommunicationPreferencesViewModel().ShowWebPart(false);
        //        if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
        ns.navigateBasedOnAction(app.viewModels.MyGuidedActionViewModel.Alert());
    };
    ns.navigateBasedOnAction = function navigateBasedOnAction(ANA) {
        $(".DoNotShowOnActionNeeded").hide();
        $("#divPre65MyFamily").hide();
        $("#physician").hide();
        var showLoadingPanl = false;
        if (app.viewModels.MyGuidedActionViewModel.Alert() === null)
            app.functions.redirectToRelativeUrlFromSiteBase("my-action-needed.aspx");
        if (EXCHANGE.WaitPopup)
            EXCHANGE.WaitPopup.Close();
        switch (app.viewModels.MyGuidedActionViewModel.Alert().Link) {
            case EXCHANGE.enums.ActionNeededLinkEnum.Appointments:
                {
                    app.decisionSupport.initializeDecisionSupport();

                    if (app.viewModels.MyAppointmentsViewModel == undefined) {
                        app.viewModels.MyAppointmentsViewModel = new app.models.MyAppointmentsViewModel();
                        app.viewModels.MyAppointmentsViewModel.ShowWebPart(false);
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: "/API/Account/MyAppointmentsClientViewModel",
                            dataType: "json",
                            success: function (response) {
                                app.viewModels.MyAppointmentsViewModel.loadFromJSON(response);
                                app.viewModels.MyGuidedActionViewModel.MyAppointmentsViewModel(app.viewModels.MyAppointmentsViewModel);
                                app.viewModels.MyAppointmentsViewModel.ShowWebPart(true);
                            }
                        });
                    }
                    else {
                        app.viewModels.MyGuidedActionViewModel.MyAppointmentsViewModel(app.viewModels.MyAppointmentsViewModel);
                        app.viewModels.MyAppointmentsViewModel.ShowWebPart(true);
                    }
                    break;
                }
            case app.enums.ActionNeededLinkEnum.POA:
                {
                    $("#divPre65MyFamily").removeClass("container").css('width', 960);
                    //app.viewModels.MyGuidedActionViewModel.POA().ShowWebPart(true);
                    app.viewModels.MyGuidedActionViewModel.medCabinet().ShowWebPart(false);
                    $("#divPre65MyFamily").show();
                    $(".DoNotShowOnActionNeeded").hide();
                    $("#divPre65MyFamily").find("#my-personal-info").hide();
                    $("#divPre65MyFamily").find("#my-profile-addresses").hide();
                    $("#divPre65MyFamily").find("#my-profile-poa").show();
                    $("#divPre65MyFamily").find("#pre65-tabs").hide();
                    $("#divPre65MyFamily").find("#tabs-2").hide();
                    break;
                }
            case app.enums.ActionNeededLinkEnum.PrescriptionRegime:
                {
                    app.decisionSupport.initializeDecisionSupport();
                    app.viewModels.MyGuidedActionViewModel.POA().ShowWebPart(false);
                    app.viewModels.MyGuidedActionViewModel.medCabinet().ShowWebPart(true);
                    $('#ShopPDPmain').hide();
                    break;
                }
            case app.enums.ActionNeededLinkEnum.CommunicationPreferences:
            case app.enums.ActionNeededLinkEnum.MyProfile:
                {
                    app.functions.setupPhoneFormatting();
                    ns.setupAddressRadios();
                    ns.setupDropdowns();

                    $("#divPre65MyFamily").show();
                    $(".DoNotShowOnActionNeeded").hide();
                    $("#divPre65MyFamily").find("#my-profile-poa").hide();
                    break;
                }
            case app.enums.ActionNeededLinkEnum.Physicians:
                {
                    $("#physician").show();
                    $("#physician").attr("style", "font:13px arial, helvetica, sans-serif");
                    ns.findRecommendationsModelLoad();
                    app.viewModels.MyGuidedActionViewModel.POA().ShowWebPart(false);
                    app.viewModels.MyGuidedActionViewModel.medCabinet().ShowWebPart(false);
                    //$(".colmL").attr("style", "width:100%");
                    showLoadingPanl = true;
                    break;
                }

            default:
                app.functions.redirectToRelativeUrlFromSiteBase("my-action-needed.aspx");
                break;
        }
        if (!showLoadingPanl)
            $('#waitPopup-maskwrapper1').remove();
    };

    ns.displayGuidedAction = function displayGuidedAction() {

    };

    ns.optOut = function optOut(alert) {
        ns.markAlertsInActive(alert);

        var alertArgs = JSON.stringify(ko.mapping.toJS(alert));
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/Optout",
            dataType: "json",
            data: alertArgs,
            success: function (response) {
                if (response != true) {
                    alert("failed");
                }
            }
        });
        switch (alert.Link) {
            case EXCHANGE.enums.ActionNeededLinkEnum.Physicians:
                {
                    EXCHANGE.Optum.RemoveDoctors();
                }
        }
        $('#continueBtn').click();
    }

    ns.markAlertsInActive = function markMessageinActive(alert) {
        var alerts = [alert];

        if (alerts.length > 0) {
            var plainAlrts = $.map(alerts, function (alert, index) {
                return ko.mapping.toJS(alert);
            });
            var alertArgs = JSON.stringify(plainAlrts);

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/MarkActionNeededAlertsInActive",
                dataType: "json",
                data: alertArgs,
                success: function (response) {
                    if (response != true) {
                        alert("failed");
                    }
                }
            });
        }

        return true;
    };
    ns.bindEvents = function bindEvents() {
        $(document).on('click', '#continueBtn', function (event) {
            if (EXCHANGE.viewModels.MyGuidedActionViewModel.Alert().Link == app.enums.ActionNeededLinkEnum.Physicians && EXCHANGE.viewModels.OptumViewModel != undefined) {

                if (EXCHANGE.viewModels.OptumViewModel.chosenAnswer() == undefined) {
                    alert("Please select an answer.");
                    event.preventDefault();
                    return;
                }
                if (EXCHANGE.viewModels.OptumViewModel.chosenAnswer() != undefined && EXCHANGE.viewModels.OptumViewModel.chosenAnswer()
                    && EXCHANGE.viewModels.OptumViewModel.physicians().length == 0) {
                    alert("Please select NO to continue or select at least one doctor.");
                    event.preventDefault();
                    return;
                }
            }

            if (EXCHANGE.viewModels.MyGuidedActionViewModel != undefined && EXCHANGE.viewModels.OptumViewModel.chosenAnswer() == false
                && EXCHANGE.viewModels.OptumViewModel.physicians().length > 0) {
                EXCHANGE.Optum.RemoveDoctors();
            }

            var args = ko.toJSON(EXCHANGE.viewModels.MyGuidedActionViewModel.Alert);
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: args,
                url: "/API/Account/NextActionNeededViewModel",
                dataType: "json",

                success: function (response) {

                    if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close(true);
                    ns._actionPageSubmitNavigation(response);
                }
            });
        });

        $(document).on('click', '.open-cart-alert', function () {
            if (app.user.UserSession && app.user.UserSession.UserProfile && app.user.UserSession.UserProfile.zipCode && app.viewModels.ShoppingCartViewModel) {
                var $spinner = $(this).ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGELIGHTGRAY });
                app.shoppingCart.setupPlans(function () {
                    ns.openShoppingCart($spinner);
                });
            }
            return false;
        });

        $(document).on('click', '.open-helpmechoose-alert', function () {
            var $spinner = $(this).ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGELIGHTGRAY });
            ns.openHelpMeChoose($spinner);
            return false;
        });

        $(document).on('click', '.open-prescriptionregime-alert', function () {
            var $spinner = $(this).ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGELIGHTGRAY });
            ns.openPrescriptionRegime($spinner);
            return false;
        });
    };

    ns._actionPageSubmitNavigation = function _acionPageSubmitNavigation(response) {
        if (response != null) {
            if (response.Alert == null) {
                app.functions.redirectToRelativeUrlFromSiteBase("my-action-needed.aspx");
                return;
            }
        }
        (!ns.submittingPage)
        {
            ns.submittingPage = true;
            app.functions.redirectToRelativeUrlFromSiteBase("my-action-guide.aspx");
        }
    };

    ns.refreshUI = function refreshUI() {

        app.placeholder.applyPlaceholder();
        //open primary address for editing if we came from login conflict after changing zip.
        if (app.viewModels.MyGuidedActionViewModel.CommunicationPreferencesViewModel().displayChangePrimaryAddressMessage()) {
            var newZip = app.functions.getKeyValueFromWindowLocation('NewZip');

            $.each(app.viewModels.MyGuidedActionViewModel.CommunicationPreferencesViewModel.addressVms(), function (index, item) {
                if (item.isPrimary()) {
                    app.viewModels.MyGuidedActionViewModel.CommunicationPreferencesViewModel.editAddressByIndex(item.index());

                    //clear old values from address, prefill new zip
                    item.editStreet1('');
                    item.editStreet2('');
                    item.editCity('');
                    item.editState('Select One');

                    item.editZip(newZip);
                    ns.getCountiesForNewZip($('.edit-addr-zip[addridx="' + index + '"]'));

                    app.viewModels.MyGuidedActionViewModel.CommunicationPreferencesViewModel.displayChangePrimaryAddressMessage(true);

                    return false;
                }
            });
        }
        //

        ns.setupDropdowns();
        ns.updateRadioStates();
        ns.bindCountyChangeKeyUp();
        ns.updateDropkickDropdowns();
    };

    ns.setupAddressRadios = function setupAddressRadios() {
        $('.addresses').find('input').customInput();
    };

    ns.setupDropdowns = function () {
        $('.selectstate').dropkick();
    };

    ns.redoDropkick = function redoDropkick(item) {
        $(item).dropkick();
    };

    ns.updateRadioStates = function () {
        $(".address-radio").customInput();
        // ns.bindPrimaryMailingRadios();
    };

    ns.updateDropkickDropdowns = function () {
        // Okay, so, IE doesn't fire click events on these guys, so for IE we need to listen to mousedown events. This appears to be just when
        // we're also using dropkick, so watch out for that.
        $('.select-state').parents('li').find('.dk_container').find('li').on(($.browser.msie ? 'mousedown' : 'click'), function () {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            var addrIdx = parseInt($(this).parents('li').find('select').attr('data-addr-idx'));
            app.viewModels.MyGuidedActionViewModel.CommunicationPreferencesViewModel().addressVms()[addrIdx].editState(selectedVal);
        });
        $('.comm-editable .selectcounty').parents('li').find('.dk_container').find('li').on(($.browser.msie ? 'mousedown' : 'click'), function () {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            var addrIdx = parseInt($(this).parents('li').find('select').attr('data-addr-idx'));
            app.viewModels.MyGuidedActionViewModel.CommunicationPreferencesViewModel().addressVms()[addrIdx].editCounty(selectedVal);
        });
        $('.selectcountry').parents('li').find('.dk_container').find('li').on(($.browser.msie ? 'mousedown' : 'click'), function () {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            var addrIdx = parseInt($(this).parents('li').find('select').attr('data-addr-idx'));
            app.viewModels.MyGuidedActionViewModel.CommunicationPreferencesViewModel.addressVms()[addrIdx].editCountry(selectedVal);
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
                    app.viewModels.MyGuidedActionViewModel.CommunicationPreferencesViewModel().addressVms()[addrIdx].stateList(data);
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
                    app.viewModels.MyGuidedActionViewModel.CommunicationPreferencesViewModel().addressVms()[addrIdx].countyList(data);
                    input.parents('ul').find('.selectcounty').dropkick();
                    ns.updateDropkickDropdowns();
                }
            });
        } else {
            app.viewModels.MyGuidedActionViewModel.CommunicationPreferencesViewModel().addressVms()[addrIdx].countyList([]);
            input.parents('ul').find('.selectcounty').dropkick();
            ns.updateDropkickDropdowns();
        }
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
                    app.viewModels.MyGuidedActionViewModel.POA().countyList(data);
                    for (var i = 0; i < app.viewModels.MyGuidedActionViewModel.POA().countyList().length; i++) { if (app.viewModels.MyGuidedActionViewModel.POA().countyList()[i].CountyName === app.viewModels.MyGuidedActionViewModel.POA().powerOfAttorneyCounty_tb()) { app.viewModels.MyGuidedActionViewModel.POA().countyId_boundToSelectValue(app.viewModels.MyGuidedActionViewModel.POA().countyList()[i].Id); ; break; } }
                }

                app.functions.redrawDropkickBySelectElementId('dd-select-county');
                ns.pendingCountyLookup = false;

            },
            failure: function () {
                ns.pendingCountyLookup = false;
            }
        });
    };

    ns.loadInlineErrors = function loadInlineErrors(data, section) {
        var hasInlineErrors = false;
        app.viewModels.MyGuidedActionViewModel.clearInlineErrors(section);
        inlineErrors = [];
        for (var i = 0; i < data.Errors.length; i++) {
            var error = data.Errors[i].ErrorMessage;
            if (error.indexOf("inline:") != -1) {
                error = error.substring(error.indexOf("inline:") + "inline:".length);
            }

            inlineErrors.push(data.Errors[i]);
            app.viewModels.MyGuidedActionViewModel.addInlineError(error, section);
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
            } else if (inlineErrors[i].PropertyName == "NewUsername") {
                $('#newUsername').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "EditUsernamePassword") {
                $('#usernameEditPwd').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "PasswordMismatch") {
                $('#passwordEditNew').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "EditPassword") {
                $('#passwordEditCurrent').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "FirstName") {
                $('#poaFirstName').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "LastName") {
                $('#poaLastName').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "State") {
                $('#poaState').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "Zip") {
                $('#poaZip').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "Phone") {
                $('#poaPhone').addClass('error-field');
            } else if (inlineErrors[i].PropertyName == "Password1") {
                $('#passwordEditNew').addClass('error-field');
                $('#passwordEditNewConfirm').addClass('error-field');
            }
        }
    };

    ns.validateUpdatePhone = function validateUpdatePhone(ajaxCallback) {
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
                } else {
                    ns.setInlineErrorsPhone(data.Errors);
                }

            }
        });

        ns.clearInlineErrorsPhone(isPrimary);
    };

    ns.findRecommendationsModelLoad = function findRecommendationsModelLoad() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Recommendations/findRecommendationsClientViewModel",
            success: function (data) {
                app.viewModels.MyGuidedActionViewModel = app.viewModels.MyGuidedActionViewModel.loadPlansFromJSON(data);
                $('#waitPopup-maskwrapper1').remove();
            },
            error: function (data) {
                //EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.FindRec.findRecommendationsClientViewModel");
            }
        });

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
            error: function (data) {
                EXCHANGE.ButtonSpinner.Stop();
            }
        });

        ns.clearInlineErrorsEmail();
    };


} (EXCHANGE));
