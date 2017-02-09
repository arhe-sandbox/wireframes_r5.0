(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.browsePlans.landingZipBox');

    $(document).ready(function () {
        ns.wireupJqueryBindings();
        
    });

    ns.wireupJqueryBindings = function wireupJqueryBindings() {
        $(document).on('click', '.landing-zip-box-submit', function () {

            if (_gaq) {
                var clicked_from = 'Browse Plan Page';
                if ($(this).attr('id').indexOf('CtrlZipBox_footer') != -1) clicked_from = "Bottom Plan Details";
                if ($(this).attr('id').indexOf('CtrlZipBox_hdr') != -1) clicked_from = "Top Plan Details";
                _gaq.push(['_trackEvent', 'Start Search', 'Enter Zip', clicked_from]);

            }

            var zip = $(this).siblings('.landing-zip-box-input').val();
            app.functions.redirectToRelativeUrlFromSiteBase("/find-plans.aspx?zip=" + zip);
        });
    };

} (EXCHANGE));
