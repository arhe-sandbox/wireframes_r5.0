(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.resetPassword');


    $(document).ready(function () {
        ns.setupJqueryBindings();
    });


    ns.setupJqueryBindings = function setupJqueryBindings() {
        $(document).on('click', '.open-reset-password', function() {
            $.publish("EXCHANGE.lightbox.login.open");
            app.login.showResetPasswordForm();
        }); 
    };

} (EXCHANGE));