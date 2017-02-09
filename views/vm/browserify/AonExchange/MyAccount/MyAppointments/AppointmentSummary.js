(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.AppointmentSummary");

    app.namespace('EXCHANGE.viewModels');
    ns.summaryId = "";

    $(document).ready(function () {
        ns.initializePage();
    });

    ns.initializePage = function initializePage() {
        ns.selectMyAccountTab();
        EXCHANGE.decisionSupport.initializeDecisionSupport()

        ns.summaryId = app.functions.getKeyValueFromWindowLocation("summaryId");

        if (ns.summaryId != "") {
          if (ns.summaryId.length < 36) {
               app.functions.redirectToRelativeUrlFromSiteBase("my-account.aspx");
          }
        }

        var summaryArgs = {
            SummaryId: ns.summaryId
        };

        summaryArgs = JSON.stringify(summaryArgs);

        ns.setupViewModels();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/AppointmentSummaryViewModel",
            dataType: "json",
            data: summaryArgs,
            success: function (response) {
                if (response == "") {
                    app.functions.redirectToRelativeUrlFromSiteBase("my-account.aspx");
                } else {
                    app.viewModels.AppointmentSummaryViewModel.loadFromJSON(response);
                    ns.wireupJqueryEvents();
                }
            }
        });
    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $('#appt-summary').on('click', '.callMedicineCabinet', function (e) {


            if (_gaq) {

                _gaq.push(['_trackEvent', 'Appt Summary Learning', 'Click', 'Medicine Cabinet']);
            
                }

            $.publish("EXCHANGE.lightbox.helpchoose.open");

        });

        $('#appt-summary').on('click', '.perferredPlanClick', function (e) {

            var planTypeName = $(this).attr("name");
            var virtualPageName = '';

            if (planTypeName != "") {
                if (_gaq) {

                    _gaq.push(['_trackEvent', 'Appt Summary Learning', 'Click', planTypeName]);

                }

                switch (planTypeName) {
                    case 'Medigap plan':
                        virtualPageName = 'Documents/BAT_Understanding_Medigap_Plans.aspx';
                        break;
                    case 'Medicare Advantage plan':
                        virtualPageName = 'Documents/BAT_Understanding_Medicare_Advantage_Plans.aspx';
                        break;
                    default:
                        virtualPageName = 'Documents/BAT_Understanding_Original_Medicare.aspx';
                        break;
                }

                window.open(virtualPageName, '_blank');

            }

        });

        $('#appt-summary').on('click', '.notDecidePlanClick', function (e) {

            var virtualPageName = 'Documents/BAT_Advantage_Or_Medigap_Choice.aspx';

                if (_gaq) {

                    _gaq.push(['_trackEvent', 'Appt Summary Learning', 'Click', 'Medigap or Medicare Advantage']);

                }

                window.open(virtualPageName, '_blank');

        });

    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.AppointmentSummaryViewModel = new app.models.AppointmentSummaryViewModel();
        ko.applyBindings(app.viewModels, $('#appt-summary').get(0));
    };

    ns.selectMyAccountTab = function selectMyAccountTab() {
        $('.MyAccountMenuItem').removeClass('CMSListMenuLI').addClass('CMSListMenuHighlightedLI');
        $('.MyAccountMenuItem > a').removeClass('CMSListMenuLink').addClass('CMSListMenuLinkHighlighted');
    };

} (EXCHANGE));
