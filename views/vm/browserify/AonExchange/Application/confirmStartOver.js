/**
* Lightbox that displays a confirmation message when user clicks 'Start Over' or the Aon logo. 
* Requires that the clicked link has a 'location' attribute equal to the destination page (home.aspx).
*/
(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.confirmStartOver');

    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializeConfirmStartOver();
    });


    ns.initializeConfirmStartOver = function initializeConfirmStartOver() {
        EXCHANGE.viewModels.ConfirmStartOverPopupViewModel = EXCHANGE.models.ConfirmStartOverPopupViewModel();

        ko.applyBindings(EXCHANGE.viewModels, $('#confirm-start-over-popup').get(0));

        var confirmStartOverLb = new EXCHANGE.lightbox.Lightbox({
            name: 'confirmstartover',
            divSelector: '#confirm-start-over-popup',
            openButtonSelector: '#confirm-start-over-open-button',
            closeButtonSelector: '#confirm-start-over-close-button',
            beforeOpen: function (clickedItem) {
                if (clickedItem) {
                    EXCHANGE.viewModels.ConfirmStartOverPopupViewModel.location = $(clickedItem).attr('location');
                }
                return true;
            },
            afterOpen: ns.confirmStartOverLoad,
            beforeSubmit: function () {
                app.functions.redirectToRelativeUrlFromSiteBase(EXCHANGE.viewModels.ConfirmStartOverPopupViewModel.location);
                return true;
            },
            showWaitPopup: true
        });
    };

    ns.confirmStartOverLoad = function confirmStartOverLoad() {
        if (!EXCHANGE.viewModels.ConfirmStartOverPopupViewModel.hasBeenLoaded) {

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Application/ConfirmStartOverClientViewModel",
                dataType: "json",
                success: function (data) {
                    var serverViewModel = data;
                    EXCHANGE.viewModels.ConfirmStartOverPopupViewModel.loadFromJSON(serverViewModel.ConfirmStartOverPopupViewModel);
                    $.publish("EXCHANGE.lightbox.confirmstartover.loaded");
                }
            });
        }
        else {
            $.publish("EXCHANGE.lightbox.confirmstartover.loaded");
        }
    };

} (EXCHANGE));

