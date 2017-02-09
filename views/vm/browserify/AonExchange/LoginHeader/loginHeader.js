(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.loginHeader');

    $(document).ready(function () {
        ns.initializeLoginHeader();
        ns.setupJqueryBindings();
    });

    ns.initializeLoginHeader = function initializeLoginHeader() {
        //this logic is done in pageSetup.js

    };

    ns.logOutAjaxRequest = function logOutAjaxRequest(successFn) {
        EXCHANGE.ButtonSpinner = $("#btnLogout").ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.SMALLLIGHTGRAY });
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Login/Logout",
            dataType: "json",
            success: successFn
        });
    }

    ns.successRedirectToHome = function successRedirectToHome() {
        app.functions.redirectToRelativeUrlFromSiteBase("home.aspx");
        EXCHANGE.ButtonSpinner.Stop();
    };

    ns.selectMenu = function selectMenu() {
        var curID = $(this).attr('id');
        var curMenuItem = curID.split('-');
        var curMenu = "#menu-" + curMenuItem[3];
        $(".pre65-hide-menu").hide();
        $(".pre65-main-menu-item").hide();
        $(curMenu).show();
    }
    ns.hideMenu = function hideMenu() {
        $(this).show();
        $(".pre65-hide-menu").hide();
        $(".pre65-main-menu-item").show();
    }

    ns.showSubMenu = function showSubMenu() {
        var curMenu = EXCHANGE.functions.getKeyValueFromUrl("m", window.location.href);
        $(".pre65-hide-menu").hide();
        $(".pre65-main-menu-item").hide();
        $("#menu-" + curMenu).show();
        $("#pre65-menu-item-" + curMenu).addClass('pre65-menu-current');
    }

    ns.highlightMenu = function highlightMenu() {
        var curMenu = EXCHANGE.functions.getKeyValueFromUrl('aliaspath', document.forms[0].action) + ".aspx";
        var menuItems = app.viewModels.MenuHeaderViewModel.menuItems();
        var mainMenuIndex = -1;
        switch (curMenu) {
            case "/my-action-needed.aspx":
            case "/my-coverage.aspx":
            case "/my-hra-allocation.aspx":
            case "/my-application-status.aspx":
            case "/my-appointments.aspx":
            case "/update-profile.aspx":
            case "/my-account/My-Coverage.aspx":
                curMenu = "/my-account.aspx";
                break;
            case "/othercoverage/find-anc-plan.aspx":
                curMenu = "/othercoverage.aspx";
                break;
            case "/aon-hewitt-navigators-will-help.aspx":
            case "/deciding-which-coverage-fits-best.aspx":
            case "/medicare-advantage-plans.aspx":
            case "/medicare-part-a.aspx":
            case "/medicare-part-b.aspx":
            case "/medicare-prescription-drug-plan-part-d.aspx":
            case "/medicare-supplemental-plans.aspx":
            case "/original-medicare-not-complete-coverage.aspx":
            case "/building-complete-coverage.aspx":
            case "/deciding-which-coverage-fits.aspx":
            case "/medicare-prescription-drug-plans.aspx":
            case "/medicare-supplement-plans.aspx":
            case "/learn-about-options/aon-hewitt-navigators-will-help.aspx":
            case "/learn-about-options/deciding-which-coverage-fits-best.aspx":
            case "/learn-about-options/medicare-advantage-plans.aspx":
            case "/learn-about-options/medicare-part-a.aspx":
            case "/learn-about-options/medicare-part-b.aspx":
            case "/learn-about-options/medicare-prescription-drug-plan-part-d.aspx":
            case "/learn-about-options/medicare-supplemental-plans.aspx":
            case "/learn-about-options/original-medicare-not-complete-coverage.aspx":
            case "/learn-about-options/building-complete-coverage.aspx":

            case "/learn-about-options/deciding-which-coverage-fits.aspx":
            case "/learn-about-options/medicare-prescription-drug-plans.aspx":
            case "/learn-about-options/medicare-supplement-plans.aspx":

            case "/learn-about-medicare/deciding-which-coverage-fits.aspx":
            case "/learn-about-medicare/medicare-prescription-drug-plans.aspx":
            case "/learn-about-medicare/medicare-supplement-plans.aspx":
                curMenu = "/Medicare/home.aspx";
                break;

            default:
                break;
        }
        for (var i = 0; i < menuItems.length && mainMenuIndex === -1; i++) {
            if (menuItems[i].Url === curMenu) {
                mainMenuIndex = i + 1;
                break;
            } else {
                for (var j = 0; j < menuItems[i].SubMenuItem.length; j++) {
                    if (menuItems[i].SubMenuItem[j].Url === curMenu) {
                        mainMenuIndex = i + 1;
                        break;
                    }
                }
            }
        }
        if (mainMenuIndex !== -1) {
            $(".pre65-hide-menu").hide();
            $(".pre65-main-menu-item").hide();
            $("#menu-" + mainMenuIndex).show();
            $("#pre65-menu-item-" + mainMenuIndex).addClass('pre65-menu-current');
        }
    }

    ns.setupJqueryBindings = function setupJqueryBindings() {
        $('#btnLogout').live('click', function () {
            ns.logOutAjaxRequest(ns.successRedirectToHome);
            return false;
        });

        //$('.pre65-menu-select').live('hover', ns.selectMenu);
        //$(document).on("click", ".pre65-menu-select", ns.selectMenu);
        //$(".pre65-hide-menu").live('hover', ns.hideMenu);

    };

} (EXCHANGE));
