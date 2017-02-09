(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.myHraAllocation");

    app.namespace('EXCHANGE.viewModels');
    $(document).ready(function () {
        app.viewModels.Pre65FamilyViewModel = EXCHANGE.models.Pre65FamilyViewModel();
        //        ko.applyBindings(EXCHANGE.viewModels, $('.container').get(0));


        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Pre65/GetPre65FamilyViewModel",

            dataType: "json",
            success: function (data) {
                app.viewModels.Pre65FamilyViewModel = app.viewModels.Pre65FamilyViewModel.loadFromJSON(data);
            },
            error: function (data) {

            }
        });

        if (!app.user.UserSession.UserProfile.isPre65())
            $('.pre65-hra-plans').first().hide();


        /*** START account-action EXPAND AREAS ***/
        //Bind the click event for the header of the expandable area
        $(document).on("click", ".pre65-expand-header", function () {           
            //Target the child div to expand
            var curDiv = $(this).nextAll(".pre65-expand-body").first();
            //After setting visibility, update the classes to adjust the direction of the caret
            if (curDiv.is(":visible")) {
                curDiv.hide();
                var curHeader = $(this).find(".fa-caret-down");
                curHeader.toggleClass("fa-caret-down");
                curHeader.toggleClass("fa-caret-right");
            } else {
                curDiv.show();
                var curHeader = $(this).find(".fa-caret-right");
                curHeader.toggleClass("fa-caret-right");
                curHeader.toggleClass("fa-caret-down");
            }
        });

        /*** END account-action EXPAND AREAS ***/
    });

    $(document).ready(function () {
        ns.initializePage();
        // $('#modalPopLite-wrapper1').hide();
    });

    ns.initializePage = function initializePage() {
        ns.setupViewModels();
        EXCHANGE.WaitPopup.Close();
        EXCHANGE.ButtonSpinner = $("#my-hra-allocation-container").ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEBLUE });
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/MyHraAllocationViewModel",
            dataType: "json",
            success: function (response) {
                app.viewModels.MyHraAllocationViewModel.loadFromJSON(response);
                EXCHANGE.ButtonSpinner.Stop();
            },
            error: function () {
                EXCHANGE.ButtonSpinner.Stop();
            }
        });
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.MyAccountSidebarViewModel = new app.models.MyAccountSidebarViewModel();
        app.viewModels.MyHraAllocationViewModel = new app.models.MyHraAllocationViewModel();
        ko.applyBindings(app.viewModels, $('#my-hra-allocation-container').get(0));
    };

    ns.GetPre65FindPlansViewModel = function GetPre65FindPlansViewModel() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Pre65/GetPre65FindPlansViewModel",
            dataType: "json",
            success: function (data) {

                if (data != "") {

                    var a = document.createElement("a");

                    a.setAttribute("href", data.RedirectUrl);

                    if (data.OpenInNewWindow) {
                        a.setAttribute("target", "_blank");
                    }
                    a.style.display = "none";
                    document.body.appendChild(a);

                    a.click();
                }


            }
        });
    };
} (EXCHANGE));
