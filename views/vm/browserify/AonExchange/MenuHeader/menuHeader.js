(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.menuHeader');

    $(document).ready(function () {
        ns.setupJqueryBindings();
    });

    ns.successRedirectToHome = function successRedirectToHome() {
        app.functions.redirectToRelativeUrlFromSiteBase("home.aspx");
    };

    ns.setupJqueryBindings = function setupJqueryBindings() {
        
    };

} (EXCHANGE));