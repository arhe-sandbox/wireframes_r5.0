/**
* Lightbox that displays an error message similar to the Call Us lightbox. 
* This has no link requirements; just publish the lightbox and it goes.
*/
(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.stopEnrollment');

    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializeStopEnrollment();
    });

    ns.initializeStopEnrollment = function initializeStopEnrollment() {
        EXCHANGE.viewModels.StopEnrollmentPopupViewModel = EXCHANGE.models.StopEnrollmentPopupViewModel();

        ko.applyBindings(EXCHANGE.viewModels, $('#stop-enrollment-popup').get(0));

        var stopEnrollmentLb = new EXCHANGE.lightbox.Lightbox({
            name: 'stopenrollment',
            divSelector: '#stop-enrollment-popup',
            openButtonSelector: '#stop-enrollment-open-button',
            closeButtonSelector: '#stop-enrollment-close-button',
            potentialChildren: ['gethelp'],
            afterOpen: ns.stopEnrollmentLoad
        });
    };

    ns.stopEnrollmentLoad = function stopEnrollmentLoad() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Application/StopEnrollmentClientViewModel",
            dataType: "json",
            success: function (viewModel) {
                var serverViewModel = viewModel;
                EXCHANGE.viewModels.StopEnrollmentPopupViewModel.loadFromJSON(serverViewModel.StopEnrollmentPopupViewModel);
            }
        });
    };

} (EXCHANGE));

