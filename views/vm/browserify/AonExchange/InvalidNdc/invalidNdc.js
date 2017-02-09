(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.invalidNdc');

    $(function () {
        ns.setupViewModels();
        ns.initializeInvalidNdcLb();
        ns.setupBindings();

    });

    ns.setupViewModels = function setupViewModels() {
        if (!EXCHANGE.viewModels.InvalidNdcViewModel) {
            EXCHANGE.viewModels.InvalidNdcViewModel = new EXCHANGE.models.InvalidNdcViewModel();
        }
    };

    ns.initializeInvalidNdcLb = function initializeInvalidNdcLb() {

        var invalidNdcLb = new EXCHANGE.lightbox.Lightbox({
            name: 'invalidndc',
            divSelector: '#invalidndcpopup',
            openButtonSelector: '#invalidndc-open-button',
            closeButtonSelector: '#invalidndc-close-button',
            potentialChildren: ['helpchoose'],
            beforeOpen: function () {
                ns.getInvalidNdcViewModel();
                if (EXCHANGE.user.UserSession.RemovedUserDrugs().length > 0) {
                    ko.applyBindings(app.viewModels.InvalidNdcViewModel, $('#invalidndcpopup').get(0));
                    return true;
                }
                else {
                    return false;
                }             
            },
            afterClose: function () {
                ns.updateInvalidNdcStatus();
            },
            showWaitPopup: true
        });


    };

    ns.setupBindings = function setupBindings() {
        $(document).on('click', '#invalidNdcUpdateMedCab', function () { //Update Medicine Cabinet
            $.publish("EXCHANGE.lightbox.invalidndc.done");
        });
        $(document).on('click', '#invalidNdcCancel', function () { //Cancel Button
            // Close Invalid Ndc & mark it not to show
            if (EXCHANGE.searchResults != null && EXCHANGE.user.UserSession.UserDrugs.drugs().length > 0) {
                app.coverageCost.getCoverageCostsInPriorityOrder();
            }
        });
        $(document).on('click', '#close-btn-invalidndc', function () { //Cancel Button
            // Close Invalid Ndc & mark it not to show
            if (EXCHANGE.searchResults != null && EXCHANGE.user.UserSession.UserDrugs.drugs().length > 0) {
                app.coverageCost.getCoverageCostsInPriorityOrder();
            }
        });


    };

    ns.updateInvalidNdcStatus = function updateInvalidNdcStatus() {
        EXCHANGE.user.UserSession.ShowInvalidNdcLb(false);
        var invalidNdcArgs = JSON.stringify({ ShouldShowInvalidNdcLB: EXCHANGE.user.UserSession.ShowInvalidNdcLb() });
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/UpdateInvalidNdcStatus",
            data: invalidNdcArgs,
            dataType: "json",
            success: function (data) {
            }
        });
    };

    ns.getInvalidNdcViewModel = function getInvalidNdcViewModel() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/GetInvalidNdcViewModel",
            dataType: "json",
            success: function (data) {
                app.viewModels.InvalidNdcViewModel.loadFromJSON(data);
                EXCHANGE.user.UserSession.RemovedUserDrugs(data.RemovedUserDrugs);
                $.publish("EXCHANGE.lightbox.invalidndc.loaded");
            }
        });
    }



} (EXCHANGE, this));
