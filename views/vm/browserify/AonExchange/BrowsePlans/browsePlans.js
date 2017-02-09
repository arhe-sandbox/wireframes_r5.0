(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.browsePlans');

    $(document).ready(function () {
        
        $('#btnZipSearch').live('click', function () {
            var location = "find-plans.aspx?zip=" + $('#txtZip').val();
            app.functions.redirectToRelativeUrlFromSiteBase(location);
            return false;
        });
        $('#browsePlanDetailZipSearch').live('click', function () {
            var location = "find-plans.aspx?zip=" + $('.search-zip').val();
            app.functions.redirectToRelativeUrlFromSiteBase(location);
            return false;
        });
    });



} (EXCHANGE));
