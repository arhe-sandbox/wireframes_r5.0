(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.Pre65TransitionInfo");
    app.namespace('EXCHANGE.viewModels');


    $(document).ready(function () {
        ns.initializePage();
    });

    ns.initializePage = function initializePage() {
        app.viewModels.Pre65TransitionInfoViewModel = EXCHANGE.models.Pre65TransitionInfoViewModel();
        ko.applyBindings(EXCHANGE.viewModels, $('.container').get(0));

        ns.pre65TransitionInfoModelLoad();

    };

    ns.pre65TransitionInfoModelLoad = function pre65TransitionInfoModelLoad() {


        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Pre65/GetPre65TransitionInfoViewModel",

            dataType: "json",
            success: function (data) {

                app.viewModels.Pre65TransitionInfoViewModel = app.viewModels.Pre65TransitionInfoViewModel.loadFromJSON(data);
                var url = EXCHANGE.functions.getKeyValueFromWindowLocation("link");
                var time = Number(data.TransitionWaitTime);

                $("#clickhere").attr('href', url);
                $("#clickhere").attr("target", "_blank");

                setTimeout(function () {
                    var a = document.createElement("a");
                    a.setAttribute("href", url);
                    a.setAttribute("target", "_blank");

                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.click();
                }, time);

                setTimeout(function () {
                    var a2 = document.createElement("a");
                    a2.setAttribute("href", "/pre65myaccount.aspx");
                    a2.style.display = "none";
                    document.body.appendChild(a2);
                    a2.click();
                }, 30000);
            },
            error: function (data) {

            }
        });

    };

})(EXCHANGE);