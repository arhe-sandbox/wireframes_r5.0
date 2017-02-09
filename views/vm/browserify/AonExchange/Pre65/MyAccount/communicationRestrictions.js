(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.communicationRestrictions");

    $(document).ready(function () {
        // Initialize only if using "communication restrictions" as a separate webpart.
        //ns.initializePage();
        ns.setupBindings();
    });

    ns.setupBindings = function setupBindings() {
        $(document).on("click", "#pre65-update-profile", function () {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            app.ButtonSpinner = $(this).ButtonSpinner({ buttonType: app.enums.ButtonType.SMALLBLUE });
            ns.saveCommRestrictions();
        });
    };

    ns.initializePage = function initializePage() {
        if (app.viewModels.CommunicationRestrictionsViewModel == null) {
            ns.setupViewModels();
        }
        if (app.viewModels.CommunicationRestrictionsViewModel.isVMLoaded() === false) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/CommunicationRestrictionsViewModel",
                dataType: "json",
                success: function(response) {
                    app.viewModels.CommunicationRestrictionsViewModel.loadFromJSON(response);
                    app.viewModels.CommunicationRestrictionsViewModel.loadRadiosFromBools();
                    if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
                    //app.agentAccess.hideAndDisable();
                },
                error: function(data) {
                    if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
                }
            });
        }
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.CommunicationRestrictionsViewModel = new app.models.CommunicationRestrictionsViewModel();
        ko.applyBindings(app.viewModels, $('#my-comm-restrictions').get(0));
    };

    ns.saveCommRestrictions = function saveCommRestrictions() {
        var args = JSON.stringify({
            IsOkToCall: app.viewModels.CommunicationRestrictionsViewModel.callRadio() === true,
            IsOkToEmail: app.viewModels.CommunicationRestrictionsViewModel.emailRadio() === true,
            IsOkToMail: app.viewModels.CommunicationRestrictionsViewModel.mailRadio() === true

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
                    app.viewModels.CommunicationRestrictionsViewModel.updateCommRestrictions();
                }
                else {
                    ns.setInlineErrorsCommPref(response.Errors);
                }
            }
        });
        ns.clearInlineErrorsCommPref();
    };

    ns.setInlineErrorsCommPref = function setInlineErrorsCommPref(errors) {
        app.viewModels.CommunicationRestrictionsViewModel.inlineErrorsExistCommPref(true);
        $('ul.pre65-ac-checks li').addClass('error-field');
        for (var i = 0; i < errors.length; i++) {
            app.viewModels.CommunicationRestrictionsViewModel.inlineErrorsCommPref.push(errors[i].ErrorMessage);
        }
    };

    ns.clearInlineErrorsCommPref = function clearInlineErrorsCommPref() {
        app.viewModels.CommunicationRestrictionsViewModel.inlineErrorsExistCommPref(false);
        app.viewModels.CommunicationRestrictionsViewModel.inlineErrorsCommPref([]);
        $('ul.pre65-ac-checks li').removeClass('error-field');
    };
    

} (EXCHANGE));