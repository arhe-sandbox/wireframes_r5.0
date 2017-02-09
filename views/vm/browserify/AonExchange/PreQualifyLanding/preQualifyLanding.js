(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.preQualifylanding'); //// ?

    EXCHANGE.namespace("EXCHANGE.viewModels");

    $(document).ready(function () {
        // this will remove the header and footer for advance pre -landing page
        if ($('.header1').length > 0) {
            $('.header').css("display", "none");
            $('.footer').css("display", "none");
        }
        ns.initializePage();
        ns.loadPreQual();

    });

    ns.loadPreQual = function loadPreQual() {
        $("#Q2").css("display", "none");
        $("#Q3").css("display", "none");
        $("#Q4").css("display", "none");
        $("#Q5").css("display", "none");
        $("#Q6").css("display", "none");
        $("#Welcome").css("display", "none");
        $("#Sorry").css("display", "none");


        $("#Q1").click(function () {
            var Q1Radio = $('input[name=older]');
            var q1Value = Q1Radio.filter(':checked').val();

            if (q1Value == "Yes") {
                $("#Q2").css("display", "inline");
                Q1Radio.attr("disabled", true);
            }
            if (q1Value == "No") {
                $("#Q3").css("display", "inline");
                Q1Radio.attr("disabled", true);
            }
        });
        $("#Q2").click(function () {
            var Q2Radio = $('input[name=lostemployer]');
            var q2Value = Q2Radio.filter(':checked').val();

            if (q2Value == "Yes") {
                $("#Q6").css("display", "inline");
                Q2Radio.attr("disabled", true);
            }
            if (q2Value == "No") {
                $("#Q4").css("display", "inline");
                Q2Radio.attr("disabled", true);
            }
        });
        $("#Q3").click(function () {
            var Q3Radio = $('input[name=approach65]');
            var q3Value = Q3Radio.filter(':checked').val();

            if (q3Value == "Yes") {
                $("#Q5").css("display", "inline");
                Q3Radio.attr("disabled", true);
            }
            if (q3Value == "No") {
                $("#Sorry").css("display", "inline");
                Q3Radio.attr("disabled", true);
            }
        });
        $("#Q4").click(function () {
            var Q4Radio = $('input[name=medicarecov]');
            var q4Value = Q4Radio.filter(':checked').val();

            if (q4Value == "Yes") {
                $("#Q5").css("display", "inline");
                Q4Radio.attr("disabled", true);
            }
            if (q4Value == "No") {
                $("#Q5").css("display", "inline");
                Q4Radio.attr("disabled", true);
            }
        });
        $("#Q5").click(function () {
            var Q5Radio = $('input[name=partcov]');
            var q5Value = Q5Radio.filter(':checked').val();

            if (q5Value == "Yes") {
                $("#Q6").css("display", "inline");
                Q5Radio.attr("disabled", true);
            }
            if (q5Value == "No") {
                $("#Sorry").css("display", "inline");
                Q5Radio.attr("disabled", true);
            }
        });
        $("#Q6").click(function () {
            var Q6Radio = $('input[name=renaldis]');
            var q6Value = Q6Radio.filter(':checked').val();

            if (q6Value == "Yes") {
                $("#Sorry").css("display", "inline");
                Q6Radio.attr("disabled", true);
            }
            if (q6Value == "No") {
                $("#Welcome").css("display", "inline");
                Q6Radio.attr("disabled", true);
            }
        });
        $("#Clicktoenter").click(function () {
            var urlstr = window.location.href;
            var newurltocall = urlstr.replace(/^(.*)-qua(.*?)$/, '$1$2');
            if (urlstr != newurltocall)
                window.location.href = newurltocall;
            else
                window.location = "home.aspx";
        });
        $("#Tryagain").click(function () {
            window.location.reload();
        });
    }

    ns.initializePage = function initializePage() {
        EXCHANGE.viewModels.PreQualifyLandingViewModel = EXCHANGE.models.PreQualifyLandingViewModel();
        ko.applyBindings(EXCHANGE.viewModels, $('.container').get(0));
        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.Home.HomeClientViewModel");

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/PreQualifyLanding/PreQualifyLandingClientViewModel",
            dataType: "json",
            success: function (data) {
                EXCHANGE.viewModels.PreQualifyLandingViewModel = EXCHANGE.viewModels.PreQualifyLandingViewModel.LoadFromJSON(data);
                EXCHANGE.placeholder.applyPlaceholder();
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.Home.HomeClientViewModel");
            },
            error: function (data) {
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.Home.HomeClientViewModel");
            }
        });
    };

} (EXCHANGE, this));

