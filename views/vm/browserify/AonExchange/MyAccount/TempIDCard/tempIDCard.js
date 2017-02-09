(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.tempIDCard");

    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializePage();
    });

    ns.initializePage = function initializePage() {
        ns.setupViewModels();
        var enrollmentId = app.functions.getKeyValueFromWindowLocation("enrollmentId");
        var args = JSON.stringify({
            EnrollmentId: enrollmentId
        });
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/TempIDCard",
            dataType: "json",
            data: args,
            success: function (response) {
                app.viewModels.TempIDCardViewModel.loadFromJSON(response);
            }
        });

        $('#waitPopup-maskwrapper1').remove();
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.TempIDCardViewModel = new app.models.TempIDCardViewModel();
        ko.applyBindings(app.viewModels, $('#temp-id-card').get(0));
    };
    
} (EXCHANGE));
