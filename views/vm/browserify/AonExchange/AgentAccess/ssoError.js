(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.ssoError');

    $(document).ready(function () {
        var message = app.functions.getKeyValueFromWindowLocation("message");
        if (message.length > 0) {
            $('.ssoform').text(message);
        }
    });
    
} (EXCHANGE));