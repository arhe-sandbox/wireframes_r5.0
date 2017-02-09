(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.requestPlanDocuments');

    EXCHANGE.namespace('EXCHANGE.viewModels');

    var inlineErrors = new Array();

    $(document).ready(function () {
        ns.initializeRequestPlanDocuments();
    });

    ns.setupBindings = function setupBindings() {

        $("#plandoc_acc").accordion({
            heightStyle: "content"
        });

        app.functions.setupPhoneFormatting();
        $(this).find('.input').each(function () {
            $(this).find('.active-placeholder').removeClass('active-placeholder');
        });
    };

    ns.setupDropdowns = function () {
        $('.selectstatedocuments').dropkick();
    };

    ns.initializeRequestPlanDocuments = function initializeRequestPlanDocuments() {
        app.viewModels.RequestPlanDocumentsViewModel = EXCHANGE.models.RequestPlanDocumentsViewModel();
        app.viewModels.RequestPlanDocumentsMailViewModel = EXCHANGE.models.RequestPlanDocumentsMailViewModel();
        app.viewModels.RequestPlanDocumentsMailConfirmViewModel = EXCHANGE.models.RequestPlanDocumentsMailConfirmViewModel();
        app.viewModels.RequestPlanDocumentsEmailViewModel = EXCHANGE.models.RequestPlanDocumentsEmailViewModel();
        app.viewModels.RequestPlanDocumentsEmailConfirmViewModel = EXCHANGE.models.RequestPlanDocumentsEmailConfirmViewModel();

        var requestLb = new EXCHANGE.lightbox.Lightbox({
            name: 'plandocuments',
            divSelector: '#request-documents',
            openButtonSelector: '#request-documents-open-button',
            closeButtonSelector: '#request-documents-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#requestDocumentsTemplates').get(0));
                ns.setupBindings();
                return true;
            },
            afterOpen: function (clickedItem) {
                //If clickedItem is null, then we are backing into this lightbox and it is already loaded
                if (clickedItem != null) {
                    ns.RequestPlanDocumentsPopupLoad(clickedItem);
                } else {
                    $.publish("EXCHANGE.lightbox.plandocuments.loaded");
                }
            },
            showWaitPopup: true
        });

        var requestByMailLb = new EXCHANGE.lightbox.Lightbox({
            name: 'plandocumentsmail',
            divSelector: '#request-documents-mail',
            openButtonSelector: '#request-documents-mail-open-button',
            closeButtonSelector: '#request-documents-mail-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#requestDocumentsTemplates').get(0));
                ns.setupBindings();
                ns.initializeTabIndices('#plan-documents-mail-lightbox', 'request-plans-mail-firstname');
                ns.setupDropdowns();
                ns.getCountiesForNewZip();
                ns.setIEReadonlyFields();
                return true;
            },
            beforeSubmit: ns.sendRequestMailClick,
            afterClose: function () {
                ns.removeTabIndexes('#plan-documents-mail-lightbox');
                EXCHANGE.viewModels.RequestPlanDocumentsMailViewModel.clearInlineErrors();
            }
        });

        var requestByMailConfirmLb = new EXCHANGE.lightbox.Lightbox({
            name: 'plandocumentsmailconfirm',
            divSelector: '#request-documents-mail-confirm',
            openButtonSelector: '#request-documents-mail-confirm-open-button',
            closeButtonSelector: '#request-documents-mail-confirm-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#requestDocumentsTemplates').get(0));
                ns.setupBindings();
                return true;
            },
            beforeSubmit: function () {
                ns.ResetRequestDocumentsForm();
                $.publish("EXCHANGE.lightbox.plandocuments.back");
                return true;
            },
            afterClose: function () {
                if (window.location.pathname.indexOf('application-overview.aspx') !== -1) {
                    location.reload();
                }
            }
        });

        var requestByEmailLb = new EXCHANGE.lightbox.Lightbox({
            name: 'plandocumentsemail',
            divSelector: '#request-documents-email',
            openButtonSelector: '#request-documents-email-open-button',
            closeButtonSelector: '#request-documents-email-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#requestDocumentsTemplates').get(0));
                ns.setupBindings();
                ns.setupDropdowns();
                ns.getCountiesForNewZipEmail();
                ns.setIEReadonlyFields();
                $('#requestFirstName').focus();
                return true;
            },
            beforeSubmit: ns.sendRequestEmailClick,
            afterClose: function () {
                EXCHANGE.viewModels.RequestPlanDocumentsEmailViewModel.clearInlineErrors();
            }
        });

        var requestByEmailConfirmLb = new EXCHANGE.lightbox.Lightbox({
            name: 'plandocumentsemailconfirm',
            divSelector: '#request-documents-email-confirm',
            openButtonSelector: '#request-documents-email-confirm-open-button',
            closeButtonSelector: '#request-documents-email-confirm-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#requestDocumentsTemplates').get(0));
                ns.setupBindings();
                return true;
            },
            beforeSubmit: function () {
                ns.ResetRequestDocumentsForm();
                $.publish("EXCHANGE.lightbox.plandocuments.back");
                return true;
            },
            afterClose: function () {
                if (window.location.pathname.indexOf('application-overview.aspx') !== -1) {
                    location.reload();
                }
            }
        });

    };

    ns.RequestPlanDocumentsPopupLoad = function RequestPlanDocumentsPopupLoad(item) {
        var id = $(item).attr('id');
        app.viewModels.RequestPlanDocumentsViewModel.loadFromPlanViewModel(ko.dataFor(item), id);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/RequestPlanDocumentsViewModel",
            dataType: "json",
            success: function (data) {
                var serverViewModel = data;
                var planGuid = $(item).attr('id');

                EXCHANGE.viewModels.RequestPlanDocumentsViewModel.loadFromJSON(serverViewModel.RequestPlanDocumentsPopupViewModel);
                EXCHANGE.viewModels.RequestPlanDocumentsMailViewModel.loadFromJSON(serverViewModel.RequestPlanDocumentsMailViewModel);
                EXCHANGE.viewModels.RequestPlanDocumentsMailConfirmViewModel.loadFromJSON(serverViewModel.RequestPlanDocumentsMailConfirmViewModel);
                EXCHANGE.viewModels.RequestPlanDocumentsEmailViewModel.loadFromJSON(serverViewModel.RequestPlanDocumentsEmailViewModel);
                EXCHANGE.viewModels.RequestPlanDocumentsEmailConfirmViewModel.loadFromJSON(serverViewModel.RequestPlanDocumentsEmailConfirmViewModel);
                ns.setupDropdowns();

                app.placeholder.applyPlaceholder();

                // Bug # 3320 - In IE 'disabled' attribute font color is light gray. But the font color is black for 'readOnly' attribute.
                ns.setIEReadonlyFields();
                $.publish("EXCHANGE.lightbox.plandocuments.loaded");
            }
        });
    };

    ns.setIEReadonlyFields = function setIEReadonlyFields() {
        if ($.browser.msie && app.user.UserSession.IsLoggedIn()) {
            EXCHANGE.viewModels.RequestPlanDocumentsEmailViewModel.disableFirstName(false);
            EXCHANGE.viewModels.RequestPlanDocumentsEmailViewModel.disableLastName(false);
            EXCHANGE.viewModels.RequestPlanDocumentsEmailViewModel.disabledZipOverride(true);
            EXCHANGE.viewModels.RequestPlanDocumentsEmailViewModel.disabledCountyOverride(true);
            EXCHANGE.viewModels.RequestPlanDocumentsMailViewModel.disableFirstName(false);
            EXCHANGE.viewModels.RequestPlanDocumentsMailViewModel.disableLastName(false);
            $('.formleft').find('.first').attr('readOnly', "readonly");
            $('.formleft').find('.last').attr('readOnly', "readonly");
            //            $('.formleft').find('.zip').attr('readOnly', "readonly");
            //            $('.formleft').find('.county').attr('readOnly', "readonly");
        }
    };

    ns.sendRequestMailClick = function sendRequestMailClick() {
        app.ButtonSpinner = $(".lightbox-done-plandocumentsmail").ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
        ns.removeInlineErrorsRequestDocumentsMail();
        var state = EXCHANGE.functions.getDropdownSelectedOption('#requestDocumentsStateDiv');
        app.viewModels.RequestPlanDocumentsMailViewModel.state(state);
        var countyId = $('#ddlCountyRequestPlanDocsByMail').parent().find('.dk_option_current').find('a').attr('data-dk-dropdown-value');
        EXCHANGE.viewModels.RequestPlanDocumentsMailViewModel.countyId(countyId);

        var jsObj = EXCHANGE.viewModels.RequestPlanDocumentsMailViewModel;
        var paramsJson = JSON.stringify(jsObj.toJS());

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/ValidateRequestDocumentsMail",
            data: paramsJson,
            dataType: "json",
            success: function (validationModel) {
                app.ButtonSpinner.Stop();
                var inlineErrorExist = ns.loadRequestDocumentsMailInlineErrors(validationModel.ValidationResult);
                if (inlineErrorExist) {
                    ns.displayInlineErrorsRequestDocumentsMail();
                } else {
                    app.viewModels.ActivateAccountViewModel.setLead(validationModel.Lead);
                    app.viewModels.ShoppingCartViewModel.getCartViewModel();
                    app.viewModels.ShoppingCartViewModel.useAPIPlanCount(true);
                    $.publish("EXCHANGE.lightbox.plandocumentsmailconfirm.open");
                }
            },
            error: function () {
                app.ButtonSpinner.Stop();
            }
        });
    };

    ns.sendRequestEmailClick = function sendRequestEmailClick() {
        app.ButtonSpinner = $(".lightbox-done-plandocumentsemail").ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
        ns.removeInlineErrorsRequestDocumentsEmail();
        if (app.viewModels.RequestPlanDocumentsEmailViewModel.disabledCounty()) {
            var countyId = $('#requestdocsbyemailcounty').val();
            app.viewModels.RequestPlanDocumentsEmailViewModel.countyId(countyId);
        } else {
            var countyId = $('#ddlCountyRequestPlanDocsByEmail').parent().find('.dk_option_current').find('a').attr('data-dk-dropdown-value');
            app.viewModels.RequestPlanDocumentsEmailViewModel.countyId(countyId);
        }

        var jsObj = EXCHANGE.viewModels.RequestPlanDocumentsEmailViewModel;
        var paramsJson = JSON.stringify(jsObj.toJS());

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/ValidateRequestDocumentsEmail",
            data: paramsJson,
            dataType: "json",
            success: function (validationModel) {
                app.ButtonSpinner.Stop();
                var inlineErrorExist = ns.loadRequestDocumentsEmailInlineErrors(validationModel.ValidationResult);
                if (inlineErrorExist) {
                    ns.displayInlineErrorsRequestDocumentsEmail();
                } else {
                    app.viewModels.ActivateAccountViewModel.setLead(validationModel.Lead);
                    app.viewModels.ShoppingCartViewModel.getCartViewModel();
                    app.viewModels.ShoppingCartViewModel.useAPIPlanCount(true);
                    $.publish("EXCHANGE.lightbox.plandocumentsemailconfirm.open");

                }
                $('#requestFirstName').focus();
            },
            error: function () {
                app.ButtonSpinner.Stop();
            }
        });
    };

    ns.setErrorFieldOnClassMail = function setErrorFieldOnClassMail(controlClass) {
        $('.requestmailpopup').find(controlClass).addClass('error-field');
    };


    ns.setErrorFieldOnDropdownMail = function setErrorFieldOnDropdownMail(controlClass) {
        $('.requestmailpopup').find(controlClass).parent().find('.dk_container').addClass('error-field');
    };

    ns.removeInlineErrorsRequestDocumentsMail = function removeInlineErrorsRequestDocumentsMail() {
        $('.requestmailpopup').find('.error-field').removeClass('error-field');
    };

    ns.setErrorFieldOnClassEmail = function setErrorFieldOnClassEmail(controlClass) {
        $('.requestemailpopup').find(controlClass).addClass('error-field');
    };

    ns.removeInlineErrorsRequestDocumentsEmail = function removeInlineErrorsRequestDocumentsEmail() {
        $('.requestemailpopup').find('.error-field').removeClass('error-field');
    };

    ns.setErrorFieldOnDropdownEmail = function setErrorFieldOnDropdownMail(controlClass) {
        $('.requestemailpopup').find(controlClass).parent().find('.dk_container').addClass('error-field');
    };

    ns.loadRequestDocumentsMailInlineErrors = function loadRequestDocumentsMailInlineErrors(data) {
        var hasInlineErrors = false;
        EXCHANGE.viewModels.RequestPlanDocumentsMailViewModel.clearInlineErrors();
        inlineErrors = [];
        for (var i = 0; i < data.Errors.length; i++) {
            if (data.Errors[i].PropertyName == "County" && !app.viewModels.RequestPlanDocumentsMailViewModel.showCountyList()) {
                continue;
            }
            var error = data.Errors[i].ErrorMessage;
            if (error.indexOf("inline:") != -1) {
                var errorString = error.substring(error.indexOf("inline:") + "inline:".length);
                inlineErrors.push(data.Errors[i]);
                EXCHANGE.viewModels.RequestPlanDocumentsMailViewModel.addInlineError(errorString);
                hasInlineErrors = true;
            }
        }
        return hasInlineErrors;
    };

    ns.loadRequestDocumentsEmailInlineErrors = function loadRequestDocumentsEmailInlineErrors(data) {
        var hasInlineErrors = false;
        EXCHANGE.viewModels.RequestPlanDocumentsEmailViewModel.clearInlineErrors();
        inlineErrors = [];
        for (var i = 0; i < data.Errors.length; i++) {
            if (data.Errors[i].PropertyName == "County" && !app.viewModels.RequestPlanDocumentsEmailViewModel.showCountyList()) {
                continue;
            }
            var error = data.Errors[i].ErrorMessage;
            if (error.indexOf("inline:") != -1) {
                var errorString = error.substring(error.indexOf("inline:") + "inline:".length);
                inlineErrors.push(data.Errors[i]);
                EXCHANGE.viewModels.RequestPlanDocumentsEmailViewModel.addInlineError(errorString);
                hasInlineErrors = true;
            }
        }
        return hasInlineErrors;
    };

    ns.displayInlineErrorsRequestDocumentsMail = function displayInlineErrorsRequestDocumentsMail() {
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "FirstName") {
                ns.setErrorFieldOnClassMail('.first');
            } else if (inlineErrors[i].PropertyName == "LastName") {
                ns.setErrorFieldOnClassMail('.last');
            } else if (inlineErrors[i].PropertyName == "Phone") {
                ns.setErrorFieldOnClassMail('.phone');
            } else if (inlineErrors[i].PropertyName == "Email") {
                ns.setErrorFieldOnClassMail('.email');
            } else if (inlineErrors[i].PropertyName == "Address1") {
                ns.setErrorFieldOnClassMail('.address1');
            } else if (inlineErrors[i].PropertyName == "City") {
                ns.setErrorFieldOnClassMail('.city');
            } else if (inlineErrors[i].PropertyName == "ZipCodeState") {
                ns.setErrorFieldOnDropdownMail('.selectstatedocuments');
                ns.setErrorFieldOnClassMail('.zip');
            } else if (inlineErrors[i].PropertyName == "State") {
                ns.setErrorFieldOnDropdownMail('.selectstatedocuments');
            } else if (inlineErrors[i].PropertyName == "Zip") {
                ns.setErrorFieldOnClassMail('.zip');
            } else if (inlineErrors[i].PropertyName == "County" && app.viewModels.RequestPlanDocumentsMailViewModel.showCountyList()) {
                ns.setErrorFieldOnDropdownMail('.selectcounty');
            }
        }
    };

    ns.displayInlineErrorsRequestDocumentsEmail = function displayInlineErrorsRequestDocumentsEmail() {
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "FirstName") {
                ns.setErrorFieldOnClassEmail('.first');
            } else if (inlineErrors[i].PropertyName == "LastName") {
                ns.setErrorFieldOnClassEmail('.last');
            } else if (inlineErrors[i].PropertyName == "Phone") {
                ns.setErrorFieldOnClassEmail('.phone');
            } else if (inlineErrors[i].PropertyName == "Email") {
                ns.setErrorFieldOnClassEmail('.email');
            } else if (inlineErrors[i].PropertyName == "Zip") {
                ns.setErrorFieldOnClassEmail('.zip');
            } else if (inlineErrors[i].PropertyName == "County" && app.viewModels.RequestPlanDocumentsEmailViewModel.showCountyList()) {
                ns.setErrorFieldOnDropdownEmail('.selectcounty');
            }
        }
    };

    ns.getCountiesForNewZip = function () {
        $('#plandocumentsmail_zip').unbind('keyup');

        $('#plandocumentsmail_zip').keyup(function (keyEventArgs) {
            var input = $(this);
            var zip = input.val();
            ns.queryForCountiesByZip(zip);
        });
        ns.queryForCountiesByZip($('#plandocumentsmail_zip').val());
    };

    ns.queryForCountiesByZip = function (zip) {
        var zipInt = parseInt(zip);

        if (zip.length == 5 && zipInt >= 0 && zipInt < 100000) {
            ns.getCountiesForZipAjax(zip);
        } else {
            app.viewModels.RequestPlanDocumentsMailViewModel.countyList([]);
            app.functions.redrawDropkickBySelectElementId('ddlCountyRequestPlanDocsByMail');
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
                app.viewModels.RequestPlanDocumentsMailViewModel.countyList(data);

                if (app.viewModels.RequestPlanDocumentsMailViewModel.countyList().length == 1) {
                    app.viewModels.RequestPlanDocumentsMailViewModel.countyId(app.viewModels.RequestPlanDocumentsMailViewModel.countyList()[0].Id);
                }

                app.functions.redrawDropkickBySelectElementId('ddlCountyRequestPlanDocsByMail');
                if (zip != $('#plandocumentsmail_zip').val()) {
                    ns.getCountiesForZipAjax(app.viewModels.RequestPlanDocumentsMailViewModel.userZip_tb());
                }
            }
        });
    };

    ns.getCountiesForNewZipEmail = function () {
        $('#plandocumentsemail_zip').unbind('keyup');

        $('#plandocumentsemail_zip').keyup(function (keyEventArgs) {
            var input = $(this);
            var zip = input.val();
            ns.queryForCountiesByZipEmail(zip);
        });
        ns.queryForCountiesByZipEmail($('#plandocumentsemail_zip').val());
    };

    ns.queryForCountiesByZipEmail = function (zip) {
        var zipInt = parseInt(zip);

        if (zip.length == 5 && zipInt >= 0 && zipInt < 100000) {
            ns.getCountiesForZipAjaxEmail(zip);
        } else {
            app.viewModels.RequestPlanDocumentsEmailViewModel.countyList([]);
            if (!app.viewModels.RequestPlanDocumentsEmailViewModel.disabledCounty()) {
                app.functions.redrawDropkickBySelectElementId('ddlCountyRequestPlanDocsByEmail');
            }
        }
    };

    ns.getCountiesForZipAjaxEmail = function getCountiesForZipAjaxEmail(zip) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Geography/GetCountiesByZip",
            dataType: "json",
            data: JSON.stringify({ 'zip': zip }),
            success: function (data) {
                app.viewModels.RequestPlanDocumentsEmailViewModel.countyList(data);

                if (app.viewModels.RequestPlanDocumentsEmailViewModel.countyList().length == 1) {
                    app.viewModels.RequestPlanDocumentsEmailViewModel.countyId(app.viewModels.RequestPlanDocumentsEmailViewModel.countyList()[0].Id);
                }

                if (!app.viewModels.RequestPlanDocumentsEmailViewModel.disabledCounty()) {
                    app.functions.redrawDropkickBySelectElementId('ddlCountyRequestPlanDocsByEmail');
                }
                if (zip != $('#plandocumentsemail_zip').val()) {
                    ns.getCountiesForZipAjaxEmail(app.viewModels.RequestPlanDocumentsEmailViewModel.zip_tb());
                }
            }
        });
    };

    ns.ResetRequestDocumentsForm = function ResetRequestDocumentsForm() {
        ns.removeInlineErrorsRequestDocumentsMail();
        ns.removeInlineErrorsRequestDocumentsEmail();
        EXCHANGE.viewModels.RequestPlanDocumentsMailViewModel.clearInlineErrors();
        EXCHANGE.viewModels.RequestPlanDocumentsEmailViewModel.clearInlineErrors();
        EXCHANGE.functions.setDropdownSelectedOption('#requestDocumentsStateDiv', EXCHANGE.viewModels.RequestPlanDocumentsMailViewModel.selectOne_lbl());
        EXCHANGE.functions.resetDropdownHighlight('#requestDocumentsStateDiv');
        EXCHANGE.viewModels.RequestPlanDocumentsViewModel.hasBeenLoaded = false;
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

} (EXCHANGE));

