(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.Pre65Transition");
    app.namespace('EXCHANGE.viewModels');


    $(document).ready(function () {
        $('div.copyright').hide();
        $("#pre65multiplantxt").html('Disclaimer:  HRA amount represents plans administered by Aon Hewitt and could be inclusive of multiple employer contributions which could be subject to different plan rules.  Please see your specific employer(s) HRA plan details for further information');
        ns.initializePage();
        if (EXCHANGE.viewModels.Pre65TransitionViewModel.DisplayAgentAccessScript() == true) {
            $('#individualandfamily-edit-section').css('padding-top', '80px');
        }
    });

    ns.initializePage = function initializePage() {
        //$('#waitPopup-maskwrapper1').remove();
        app.viewModels.Pre65TransitionViewModel = EXCHANGE.models.Pre65TransitionViewModel();
        ko.applyBindings(EXCHANGE.viewModels, $('.container').get(0));
        ns.pre65TransitionModelLoad();
    };

    ns.pre65TransitionModelLoad = function pre65TransitionModelLoad() {
        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.Pre65Transition.Pre65TransitionViewModel");
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Pre65/GetPre65TransitionViewModel",

            dataType: "json",
            success: function (data) {
                app.viewModels.Pre65TransitionViewModel = app.viewModels.Pre65TransitionViewModel.loadFromJSON(data);
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.Pre65Transition.Pre65TransitionViewModel");
                var maxHeight = 0;
                //adjust height and width
                $(".pre65-client-section").each(function () {
                    var hgt = $(this).height();
                    if (hgt > maxHeight)
                        maxHeight = hgt;
                });
                $(".pre65-client-section").each(function () {
                    $(this).css("height", maxHeight);
                });

                if ($("div.pre65-client-section").filter(":visible").length == 1) {
                    $(".pre65-client-section").each(function () {
                        if ($(this).is(':visible'))
                            $(this).parents(".pre65-col-6").css("padding-left", "250px");
                    });
                    // only one section is visible. Center align it
                }

                if (EXCHANGE.viewModels.Pre65TransitionViewModel != undefined && $('.colmL').length > 0)
                    $('.colmL').attr('style', 'padding-top:20px');

            },
            error: function (data) {
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.Pre65Transition.Pre65TransitionViewModel");  
            }
        });
       
    };

    ns.viewOver65Plans = function viewOver65Plans(sender, event) {

        EXCHANGE.ButtonSpinner = $(event.target).ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
        EXCHANGE.ButtonSpinner.Start();
        var a = document.createElement("a");
        a.setAttribute("href", "/integrated-guidance.aspx");
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();

    };

    ns.getConnectionTypeName = function getConnectionTypeName(conType) {
        switch (conType) {
            case 0:
                return "Primary";

            case 1:
                return "Spouse";
            case 2:
                return "Dependant";


        }
        return "";
    };

    ns.getGenderName = function getConnectionTypeName(isGenderMale) {
        if (isGenderMale)
            return "Male";
        else
            return "Female";
    };


    ns.selectUnder65Plans = function selectUnder65Plans(sender, event) {

        EXCHANGE.ButtonSpinner = $(event.target).ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
        EXCHANGE.ButtonSpinner.Start();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Pre65/ShowUnder65Plans",
            dataType: "json",
            success: function (data) {

                EXCHANGE.ButtonSpinner.Stop();

                if (data.ErrorMsg == null || data.ErrorMsg == "") {
                    if (EXCHANGE.user.UserSession.Agent().Id() === "00000000-0000-0000-0000-000000000000") {


                        //Take to Transition Info  Pre65-Transition-Info
                        var a2 = document.createElement("a");
                        a2.setAttribute("href", "/TransitionInfo.aspx?link=" + data.RedirectUrl);
                        a2.style.display = "none";
                        document.body.appendChild(a2);
                        a2.click();
                    } else {
                        //read script to user about the creation of eHealth account
                        app.viewModels.Pre65TransitionViewModel.DisplayAgentAccessScript(true);
                    }

                } else {
                    app.viewModels.Pre65TransitionViewModel.errorMsg_lbl(data.ErrorMsg);
                }
            }
        });
    };
})(EXCHANGE);
