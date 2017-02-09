(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.YBRSSO');
    app.namespace("EXCHANGE.viewModels");

    ns.afterCartMerge = null;

    $(document).ready(function () {
        var postArgs = {};

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/YBRSSO/Inbound",
            data: JSON.stringify(postArgs),
            dataType: "json",
            success: function (data) {
                var serverViewModel = data;
                switch (serverViewModel.YBRResultCd) {
                    case 0:
                        window.location.href = "../my-account.aspx";
                        //                $submitDataSpinner.Stop();
                    default:
                        window.location.href = "../ybr-sorry?ReturnCd=" + serverViewModel.YBRResultCd;
                }
            },
            error: function () {
                //                $submitDataSpinner.Stop();
                window.location.href = "../ybr-sorry";
            }
        });
    });
} (EXCHANGE));
