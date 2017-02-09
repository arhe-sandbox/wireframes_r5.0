(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.browsePlans.zipSearchBar');

    $(document).ready(function () {
        ns.wireupJqueryBindings();
        
    });

    ns.wireupJqueryBindings = function wireupJqueryBindings() {
        $(document).on('click', '.zip-search-bar-submit', function() {
            var zip = $(this).siblings('.zip-search-bar-input').val();
            app.functions.redirectToRelativeUrlFromSiteBase("/find-plans.aspx?zip=" + zip);
        });
    };

} (EXCHANGE));
