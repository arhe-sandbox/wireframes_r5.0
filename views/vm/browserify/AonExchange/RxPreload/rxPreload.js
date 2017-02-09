(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.rxPreload');

    ns._AuthorizedRxPreload = false;
    ns._DeniedRxPreload = false;

    $(function () {
        ns.setupViewModels();
        ns.initializeRxPreloadLbs();
        ns.setupBindings();

    });

    ns.setupViewModels = function setupViewModels() {
        if (!EXCHANGE.viewModels.RxPreloadViewModel) {
            EXCHANGE.viewModels.RxPreloadViewModel = new EXCHANGE.models.RxPreloadViewModel();
        }
        if (!EXCHANGE.viewModels.RxPreloadConfirmViewModel) {
            EXCHANGE.viewModels.RxPreloadConfirmViewModel = new EXCHANGE.models.RxPreloadConfirmViewModel();
        }
    };

    ns.initializeRxPreloadLbs = function initializeRxPreloadLbs() {

        var rxPreloadLb = new EXCHANGE.lightbox.Lightbox({
            name: 'rxpreload',
            divSelector: '#rxpreload-popup',
            openButtonSelector: '#rxpreload-open-button',
            closeButtonSelector: '#rxpreload-close-button',
            beforeOpen: function () {
                if (!app.viewModels.RxPreloadViewModel.loadedFromJSON || !app.viewModels.RxPreloadConfirmViewModel.loadedFromJSON) {
                    ns.getRxPreloadViewModels();
                }
                ko.applyBindings(app.viewModels.RxPreloadViewModel, $('#rxpreload-popup').get(0));
                return true;
            },
            afterOpen: function () {
                $.publish("EXCHANGE.lightbox.rxpreload.loaded");
            },
            showWaitPopup: true
        });

        var rxPreloadConfirmLb = new EXCHANGE.lightbox.Lightbox({
            name: 'rxpreloadconfirm',
            divSelector: '#rxpreloadconfirm-popup',
            openButtonSelector: '#rxpreloadconfirm-open-button',
            closeButtonSelector: '#rxpreloadconfirm-close-button',
            beforeOpen: function () {
                ko.applyBindings(app.viewModels.RxPreloadConfirmViewModel, $('#rxpreloadconfirm-popup').get(0));
                return true;
            },
            afterOpen: function () {
                $.publish("EXCHANGE.lightbox.rxpreloadconfirm.loaded");
            },
            showWaitPopup: true
        });

    };

    ns.setupBindings = function setupBindings() {
        $(document).on('click', '#rxpreload-authorize-button', function () { //1st LB --> I Authorize
            // Save who authorized (agent/ self-service), date & outcome & update all the drug entities ??
            // Close the LB & Open Medicine cabinet (if no ndc, open InvalidNdc LB)
            EXCHANGE.ButtonSpinner = $('#rxpreload-authorize-button').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
            ns._AuthorizedRxPreload = true;
            ns._DeniedRxPreload = false;
            ns.updateRxAuthStatus();
        });
        $(document).on('click', '#rxpreloadconfirm-decline-button', function () { //2nd LB --> I decline 
            //Save who declined (agent/ self-service), date & outcome & Remove the drugs from the medicine cabinet & save changes
            // Close the LB & Open Medicine cabinet (if no ndc, open InvalidNdc LB)
            EXCHANGE.ButtonSpinner = $('#rxpreloadconfirm-decline-button').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
            ns._AuthorizedRxPreload = false;
            ns._DeniedRxPreload = true;
            ns.updateRxAuthStatus();
        });
    };


    ns.updateRxAuthStatus = function updateRxAuthStatus() {    // ajax call to save choices
        var rxPreloadArgs = JSON.stringify({ IsRxPreloadAuthorized: ns._AuthorizedRxPreload,
            IsRxPreloadDenied: ns._DeniedRxPreload,
            ShouldShowRxPreloadLB: false
        });

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/UpdateRxPreloadStatus",
            data: rxPreloadArgs,
            dataType: "json",
            success: function (data) {
                EXCHANGE.user.UserSession.RemovedUserDrugs(data.RemovedUserDrugs);
                EXCHANGE.user.UserSession.UserDrugs.drugs(data.UserDrugs);

                if (ns._AuthorizedRxPreload === true) {
                    $.publish("lightbox-refresh-rxpreload");
                }
                else if (ns._DeniedRxPreload === true) {
                    $.publish("lightbox-refresh-rxpreloadconfirm");
                }

                if (EXCHANGE.user.UserSession.RemovedUserDrugs().length <= 0) {
                    EXCHANGE.invalidNdc.updateInvalidNdcStatus();
                    //$.publish("lightbox-refresh-helpchoose");
                }
                else {
                    //$.publish("EXCHANGE.lightbox.invalidndc.loaded");
                }

                EXCHANGE.ButtonSpinner.Stop();

                if (ns._AuthorizedRxPreload === true) {
                    $.publish("EXCHANGE.lightbox.rxpreload.done");
                }
                else if (ns._DeniedRxPreload === true) {
                    $.publish("EXCHANGE.lightbox.rxpreloadconfirm.done");
                }

                EXCHANGE.user.UserSession.ShowRxPreloadLb(false);

                if (EXCHANGE.searchResults != null && EXCHANGE.user.UserSession.UserDrugs.drugs().length > 0) {
                    EXCHANGE.searchResults.sideBarAddDrugIcon();
                }

                //window.location.reload();

                $.publish("EXCHANGE.lightbox.helpchoose.open");
            }
        });
    };

    ns.getRxPreloadViewModels = function getRxPreloadViewModels() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/GetRxPreloadViewModels",
            dataType: "json",
            success: function (data) {
                app.viewModels.RxPreloadViewModel.loadFromJSON(data.RxPreloadViewModel);
                app.viewModels.RxPreloadConfirmViewModel.loadFromJSON(data.RxPreloadConfirmViewModel);
                app.viewModels.RxPreloadViewModel.loadedFromJSON = true;
                app.viewModels.RxPreloadConfirmViewModel.loadedFromJSON = true;
            }
        });
    }


} (EXCHANGE, this));
