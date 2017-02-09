(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.webChat');
    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializeWebChat();
    });

    ns.initializeWebChat = function initializeWebChat() {
        var e = document.getElementById('__VIEWSTATE');
        if (e != null) {
            if (e.parentNode && e.parentNode.removeChild) { e.parentNode.removeChild(e); }
        }

        $('#btnSubmitInitialWebChatForm').click();
    };
} (EXCHANGE));

