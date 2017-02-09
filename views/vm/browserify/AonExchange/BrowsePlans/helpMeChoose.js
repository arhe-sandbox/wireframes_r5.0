(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.browsePlans.helpMeChoose');

    $(document).ready(function () {
        ns.wireupJqueryBindings();
    });

    ns.wireupJqueryBindings = function wireupJqueryBindings() {
        $(document).on('click', '.browse-help-me-choose-submit', function () {
            var zip = $(this).siblings('.browse-help-me-choose-input').val();
            app.functions.redirectToRelativeUrlFromSiteBase("/find-plans.aspx?zip=" + zip);
            return false;
        });
    };

} (EXCHANGE));
