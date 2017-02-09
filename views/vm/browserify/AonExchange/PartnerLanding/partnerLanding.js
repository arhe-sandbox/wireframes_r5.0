(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.partnerlanding'); //// ?

    EXCHANGE.namespace("EXCHANGE.viewModels");

    $(document).ready(function () {
        ns.initializePage();
        ns.wireupJqueryEvents();
    });

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $('.pre65_lg_urlbox').bind('click', ns.trackPre65Pt);
        $(document).on('keydown', '#zipCode', function (e) {
            if (e.keyCode === 13) {
                $('#findPlans').click();
            }
        });

        $('#findPlans').live('click', function () {
            var location = "find-plans.aspx?zip=" + $('#zipCode').val();
            app.functions.redirectToRelativeUrlFromSiteBase(location);
        });

        $('#heroPane').live('click', function () {
            var location = "find-plans.aspx";
            app.functions.redirectToRelativeUrlFromSiteBase(location);
        });
    };

    ns.initializePage = function initializePage() {
        EXCHANGE.viewModels.PartnerLandingViewModel = EXCHANGE.models.PartnerLandingViewModel();
        ko.applyBindings(EXCHANGE.viewModels, $('.container').get(0));


        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.Home.HomeClientViewModel");

        var argsObj =
            {
                PartnerCode: EXCHANGE.functions.getPartnerCode(),
                CampaignCode: app.functions.getKeyValueFromWindowLocation("camp"),
                TrackingCode1: app.functions.getKeyValueFromWindowLocation("t1"),
                TrackingCode2: app.functions.getKeyValueFromWindowLocation("t2")
            };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/PartnerLanding/PartnerLandingClientViewModel",
            data: JSON.stringify(argsObj),
            dataType: "json",
            success: function (data) {
                EXCHANGE.viewModels.PartnerLandingViewModel = EXCHANGE.viewModels.PartnerLandingViewModel.LoadFromJSON(data);
                EXCHANGE.placeholder.applyPlaceholder();
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.Home.HomeClientViewModel");
            },
            error: function (data) {
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.Home.HomeClientViewModel");
            }
        });
    };
    ns.trackPre65Pt = function trackPre65Pt() {
        if (typeof _gaq !== 'undefined') {
            _gaq.push(['_trackEvent', 'Pre 65 Partner Promotion', app.viewModels.Pre65VM.Pre65Url(), EXCHANGE.functions.getPartnerCode()]);
        }
    };
} (EXCHANGE, this));

