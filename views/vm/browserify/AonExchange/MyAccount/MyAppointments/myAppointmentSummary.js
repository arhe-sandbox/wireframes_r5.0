(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.myAppointmentSummary");

    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializePage();
    });

    ns.initializePage = function initializePage() {
        ns.setupViewModels();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/MyAppointmentSummaryViewModel",
            dataType: "json",
            success: function (response) {
                app.viewModels.MyAppointmentSummaryViewModel.loadFromJSON(response);
            }
        });
        ns.wireupJqueryEvents();
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.MyAppointmentSummaryViewModel = new app.models.MyAppointmentSummaryViewModel();
        ko.applyBindings(app.viewModels, $('#my-apptsummary').get(0));
    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $('#my-apptsummary').on('click', '.summaryDetailSubmit', function (e) {

            var summaryId = $(this).attr("id");

            var summaryArgs = {
                SummaryId: summaryId
            };

            summaryArgs = JSON.stringify(summaryArgs);            

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/AppointmentSummaryIdViewModel",
                dataType: "json",
                data: summaryArgs,
                success: function (response) {
                    var location = "appt-summary.aspx";
                    app.functions.redirectToRelativeUrlFromSiteBase(location);
                }
            });

            //var location = "appt-summary.aspx?summaryId=" + summaryId;
            //app.functions.redirectToRelativeUrlFromSiteBase(location);

        });
    };

} (EXCHANGE));
