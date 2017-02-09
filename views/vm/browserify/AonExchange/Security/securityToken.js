(function (app) {
    var ns = app.namespace('EXCHANGE.securityToken');

    $(document).ready(function () {
        ns.initializeSecurityTokenSetup();
    });

    ns.initializeSecurityTokenSetup = function initializeSecurityTokenSetup() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SecurityToken/GetSecurityTokenViewModel",
            async: false,
            dataType: "json",
            success: function (serverViewModel) {
                // Insert AntiForgeryToken into the html document by replacing the placeholder div tag.
                $('div#antiForgeryToken').append(serverViewModel.SecurityToken);
            },
            error: function (data) {
                //alert('Data Retrieval Error');                
            }
        });
    };

} (EXCHANGE));