(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.home');

    EXCHANGE.namespace("EXCHANGE.viewModels");

    $(document).ready(function () {
        ns.initializePage();
        ns.wireupJqueryEvents();
    });

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $(document).on('keydown', '#zipCode', function (e) {
            if (e.keyCode === 13) {
                $('#findPlans').click();
            }
        });

        $('#findPlans').live('click', function () {

            if (_gaq) {
                _gaq.push(['_trackEvent', 'Start Search', 'Enter Zip', 'Home Page']);
            }

            var location = "find-plans.aspx?zip=" + $('#zipCode').val();
            app.functions.redirectToRelativeUrlFromSiteBase(location);
        });

        $('#heroPane').live('click', function () {
            var location = "find-plans.aspx";
            app.functions.redirectToRelativeUrlFromSiteBase(location);
        });
    };

    ns.initializePage = function initializePage() {
        EXCHANGE.viewModels.HomeViewModel = EXCHANGE.models.HomeViewModel();
        ko.applyBindings(EXCHANGE.viewModels, $('.container').get(0));


        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.Home.HomeClientViewModel");

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Home/HomeClientViewModel",
            dataType: "json",
            success: function (data) {
                EXCHANGE.viewModels.HomeViewModel = EXCHANGE.viewModels.HomeViewModel.LoadFromJSON(data);
                EXCHANGE.placeholder.applyPlaceholder();
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.Home.HomeClientViewModel");
            },
            error: function (data) {
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.Home.HomeClientViewModel");
            }
        });
    };

} (EXCHANGE, this));

