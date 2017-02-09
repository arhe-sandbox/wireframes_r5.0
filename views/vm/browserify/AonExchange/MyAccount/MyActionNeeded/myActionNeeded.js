(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.myActionNeeded");

    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializePage();
    });

    ns.initializePage = function initializePage() {
        ns.setupViewModels();
        ns.bindEvents();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/MyActionNeededViewModel",
            dataType: "json",
            success: function (response) {
                app.viewModels.MyActionNeededViewModel.loadFromJSON(response);
                //app.decisionSupport.initializeDecisionSupport();
            }
        });
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.MyActionNeededViewModel = new app.models.MyActionNeededViewModel();
        ko.applyBindings(app.viewModels, $('#my-action-needed-container').get(0));
    };

    ns.markAlertsRead = function markMessageRead(alerts) {
        if (alerts.length > 0) {
            var plainAlrts = $.map(alerts, function (alert, index) {
                return ko.mapping.toJS(alert);
            });
            var alertArgs = JSON.stringify(plainAlrts);
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/MarkActionNeededAlertsRead",
                dataType: "json",
                data: alertArgs,
                success: function (response) {
                    if (response != true) {
                        alert("failed");
                    }
                }
            });
        }
    };


    ns.markAlertsInActive = function markMessageinActive(alert) {
        var alerts = [alert];

        if (alerts.length > 0) {
            var plainAlrts = $.map(alerts, function (alert, index) {
                return ko.mapping.toJS(alert);
            });
            var alertArgs = JSON.stringify(plainAlrts);

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/MarkActionNeededAlertsInActive",
                dataType: "json",
                data: alertArgs,
                success: function (response) {
                    if (response != true) {
                        alert("failed");
                    }
                }
            });
        }

        return true;
    };

    ns.toggleBodySingle = function toggleBodySingle(item) {
        var curElement = $('#action-needed-alert-' + item.Id());
        if (!$(curElement).hasClass("open")) {
            if (item.IsNew()) {
                ns.markAlertsRead([item]);
            }
            $(curElement).find(".pre65-expand-body").show();
            var curCarets = $(".pre65-ac-action .fa-caret-right");
            curCarets.toggleClass("fa-caret-right");
            curCarets.toggleClass("fa-caret-down");
            //Update icon
            var curI = curElement.find(".fa-plus-square");
            curI.toggleClass("fa-plus-square");
            curI.toggleClass("fa-minus-square");
        }
        else {
            $(curElement).find(".pre65-expand-body").hide();
             //Update caret classes
            var curCarets = $(".pre65-ac-action .fa-caret-down");
            curCarets.toggleClass("fa-caret-down");
            curCarets.toggleClass("fa-caret-right");
            //Update icon
            var curI = curElement.find(".fa-minus-square");
            curI.toggleClass("fa-minus-square");
            curI.toggleClass("fa-plus-square");
        }
        $('#action-needed-alert-' + item.Id()).toggleClass("open");
    };

    ns.bindEvents = function bindEvents() {
        $(document).on('click', '.open-savedplans-alert', function () {
            if (app.user.UserSession && app.user.UserSession.UserProfile && app.user.UserSession.UserProfile.zipCode && app.viewModels.ShoppingCartViewModel) {
                var $spinner = $(this).ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGELIGHTGRAY });
                app.shoppingCart.setupPlans(function () {
                    ns.openSavedPlans($spinner);
                });
            }
            return false;
        });

        $(document).on('click', '.open-cart-alert', function () {
            if (app.user.UserSession && app.user.UserSession.UserProfile && app.user.UserSession.UserProfile.zipCode && app.viewModels.ShoppingCartViewModel) {
                var $spinner = $(this).ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGELIGHTGRAY });
                app.shoppingCart.setupPlans(function () {
                    ns.openShoppingCart($spinner);
                });
            }
            return false;
        });

        $(document).on('click', '.open-helpmechoose-alert', function () {
            var $spinner = $(this).ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGELIGHTGRAY });
            ns.openHelpMeChoose($spinner);
            return false;
        });

        $(document).on('click', '.open-prescriptionregime-alert', function () {
            var $spinner = $(this).ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGELIGHTGRAY });
            ns.openPrescriptionRegime($spinner);
            return false;
        });
    };

    ns.openSavedPlans = function openSavedPLans($spinner) {
        $spinner.Stop();
        $.publish("EXCHANGE.lightbox.savedplans.open");
    };

    ns.openShoppingCart = function openShoppingCart($spinner) {
        $spinner.Stop();
        $.publish("EXCHANGE.lightbox.viewcart.open");
    };

    ns.openHelpMeChoose = function openHelpMeChoose($spinner) {
        $spinner.Stop();
        $.publish("EXCHANGE.lightbox.helpchoose.open");
    };

    ns.openPrescriptionRegime = function openPrescriptionRegime($spinner) {
        $spinner.Stop();
        if (app.decisionSupport) {
            app.decisionSupport.initializeDecisionSupport();
            app.decisionSupport.tabForLoad = "medication";
        }
        $.publish("EXCHANGE.lightbox.helpchoose.open");
    };

    ns.expandAll = function expandAll() {
        //$("div.messages table tbody").addClass("open");
        //check for the "open" class
        //if "open", expand all areas. Otherwise, hide them all.
        var curElement = $("#expandAll");
        if (curElement.hasClass("open")) {
            //Display areas
            $(".pre65-expand-body").show();
            //Update caret classes
            var curCarets = $(".pre65-ac-action .fa-caret-right");
            curCarets.toggleClass("fa-caret-right");
            curCarets.toggleClass("fa-caret-down");
            //Change item text
            curElement.find("span").text("Collapse All");
            //Update icon
            var curI = curElement.find(".fa-plus-square");
            curI.toggleClass("fa-plus-square");
            curI.toggleClass("fa-minus-square");
        } else {
            //Display areas
            $(".pre65-expand-body").hide();
            //Update caret classes
            var curCarets = $(".pre65-ac-action .fa-caret-down");
            curCarets.toggleClass("fa-caret-down");
            curCarets.toggleClass("fa-caret-right");
            //Change item text
            curElement.find("span").text("Expand All");
            //Update icon
            var curI = curElement.find(".fa-minus-square");
            curI.toggleClass("fa-minus-square");
            curI.toggleClass("fa-plus-square");
        }

        //Update the class on the element for the next click function
        curElement.toggleClass("open");
        curElement.toggleClass("close");
        ns.markAlertsRead(app.viewModels.MyActionNeededViewModel.NewAlerts());
    };

    ns.collapseAll = function collapseAll() {
        $("div.messages table tbody").removeClass("open");
    };


    ns.optOut = function optOut(alert) {
        ns.markAlertsInActive(alert);
        var alertArgs = JSON.stringify(ko.mapping.toJS(alert));
        EXCHANGE.viewModels.MyActionNeededViewModel.Alerts.remove(alert);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/Optout",
            dataType: "json",
            data: alertArgs,
            success: function (response) {
                if (response != true) {
                    alert("failed");
                }
            }
        });
        $('#continueBtn').click();
    }
    ns.linkFromAlert = function linkFromAlert(linkType) {


        switch (linkType) {
            case app.enums.ActionNeededLinkEnum.ApplicationStatus:
                return "/my-account.aspx";
            case app.enums.ActionNeededLinkEnum.Appointments:
                return "/my-appointments.aspx";
            case app.enums.ActionNeededLinkEnum.CommunicationPreferences:
                return "/communication-preferences.aspx";
            case app.enums.ActionNeededLinkEnum.FindPlans:
                return "/find-plans.aspx";
            case app.enums.ActionNeededLinkEnum.HRAAllocation:
                return "/my-hra-allocation.aspx";
            case app.enums.ActionNeededLinkEnum.MyCoverage:
                return "/my-coverage.aspx";
            case app.enums.ActionNeededLinkEnum.MyProfile:
                return "/update-profile.aspx";
            case app.enums.ActionNeededLinkEnum.Cart:
                return "#";
            case app.enums.ActionNeededLinkEnum.SavedPlans:
                return "#";
            case app.enums.ActionNeededLinkEnum.HelpMeChoose:
                return "#";
            case app.enums.ActionNeededLinkEnum.PrescriptionRegime:
                return "/update-profile.aspx#dvMedCab";
            case app.enums.ActionNeededLinkEnum.POA:
                return "/update-profile.aspx#poa-readonly";
            default:
                return "#";
        }
    };

    ns.linkClassFromAlert = function linkClassFromAlert(linkType) {
        switch (linkType) {
            case app.enums.ActionNeededLinkEnum.Cart:
                return "open-cart-alert";
            case app.enums.ActionNeededLinkEnum.SavedPlans:
                return "open-savedplans-alert";
            case app.enums.ActionNeededLinkEnum.HelpMeChoose:
                return "open-helpmechoose-alert";
                //            case app.enums.ActionNeededLinkEnum.PrescriptionRegime:
                //                return "open-prescriptionregime-alert";
            default:
                return "";
        }
    };
   
    ns.GuidedAction = function GuidedAction(alert) {
        var alerts = [alert];

        if (alerts.length > 0) {
            var plainAlrts = $.map(alerts, function (alert, index) {
                return ko.mapping.toJS(alert);
            });
            switch (alert.Link()) {
                case EXCHANGE.enums.ActionNeededLinkEnum.Appointments:
                case app.enums.ActionNeededLinkEnum.POA:
                case app.enums.ActionNeededLinkEnum.PrescriptionRegime:
                case app.enums.ActionNeededLinkEnum.CommunicationPreferences:
                case app.enums.ActionNeededLinkEnum.MyProfile:
                case app.enums.ActionNeededLinkEnum.Physicians:
                    {
                        var alertArgs = ko.toJSON(alert);

                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: "/API/Account/BeginGuidedTour",
                            dataType: "json",
                            data: alertArgs,
                            success: function (response) {
                                ns.beginGuidedTour(response);
                            }
                        });
                        break;
                    }

                default:

                    ns.markAlertsInActive(alert);
                    app.functions.redirectToRelativeUrlFromSiteBase(EXCHANGE.myActionNeeded.linkFromAlert(alert.Link()));


            }
        }

        return true;
    };

} (EXCHANGE));
