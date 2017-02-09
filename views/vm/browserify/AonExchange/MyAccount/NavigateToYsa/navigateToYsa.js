(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.navigateToYsa");

    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializePage();
    });

    ns.initializePage = function initializePage() {
        var ysaSsoArgs = { ClientId: app.functions.getKeyValueFromWindowLocation("clientId") };
        ysaSsoArgs = JSON.stringify(ysaSsoArgs);
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/NavigateToYsaViewModel",
            dataType: "json",
            data: ysaSsoArgs,
            success: function (ysaSsoPageViewModels) {
                var hfimVm = { "partner": ysaSsoPageViewModels.YsaSsoViewModel.Partner, "token": ysaSsoPageViewModels.YsaSsoViewModel.Token, "keyVer": ysaSsoPageViewModels.YsaSsoViewModel.KeyVersion, "appCd": ysaSsoPageViewModels.YsaSsoViewModel.AppCode };
                ns.post_to_url(ysaSsoPageViewModels.Url, hfimVm, "post");
            }
        });
    };

    // This method creates a hidden form that contains the params and posts it to the specified path
    ns.post_to_url = function post_to_url(path, params, method) {
        method = method || "post"; // Set method to post by default, if not specified.

        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", path);

        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);

                form.appendChild(hiddenField);
            }
        }

        document.body.appendChild(form);
        form.submit();
    };

} (EXCHANGE));
