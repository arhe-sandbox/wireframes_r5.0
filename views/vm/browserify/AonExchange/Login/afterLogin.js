(function (app, global) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.login");

    $(function () {
        ns.loadAfterLoginCart();
    });

    ns.currentLightboxName = "";
    ns.currentPlanId = "";

    ns.loadedLightbox = "";
    ns.loadedPlanId = "";
    ns.loadedTab = "";

    ns.loadAfterLoginCart = function loadAfterLoginBase() {
        if (app.searchResults) {
            return;
        }
        else {
            ns.loadFromQueryString();
            if (ns.loadedLightbox) {
                if (ns.loadedLightbox.toLowerCase() === 'helpchoose') {
                    ns.loadAfterLogin();
                }

                if (ns.loadedLightbox.toLowerCase() === 'login') {
                    ns.loadAfterLogin();
                }
                else {
                    app.shoppingCart.setupPlans(ns.loadAfterLogin);

                }
            }
        }
    };

    ns.loadFromQueryString = function loadFromQueryString() {
        ns.loadedLightbox = app.functions.getKeyValueFromWindowLocation("lightboxName");
        ns.loadedPlanId = app.functions.getKeyValueFromWindowLocation("planId");
        ns.loadedTab = app.functions.getKeyValueFromWindowLocation("tab");
    };

    ns.loadAfterLogin = function loadAfterLogin() {
        if (!ns.loadedLightbox) {
            ns.loadFromQueryString();
            if (!ns.loadedLightbox) {
                return;
            }
        }
        if (ns.loadedLightbox.toLowerCase() === 'plandetails') {
            if (ns.loadedPlanId && app.viewModels.PlanDetailsViewModel) {
                app.viewModels.PlanDetailsViewModel.planId = ns.loadedPlanId;
            }
            else {
                //If we're trying to load the planDetails lightbox, but we don't have a plan id just give up and don't open anything.
                return;
            }
        }
        if (ns.loadedLightbox.toLowerCase() === 'helpchoose') {
            if (app.decisionSupport) {
                app.decisionSupport.initializeDecisionSupport();
                app.decisionSupport.tabForLoad = ns.loadedTab || "";
            }
        }
        $.publish("EXCHANGE.lightbox." + ns.loadedLightbox + ".open");
    };

    ns.getQueryString = function getQueryString() {
        // redirect to my action needed if pre65 and client is configured
        if (app.viewModels.FirstTimeUserViewModel && app.viewModels.FirstTimeUserViewModel.IsPre65 && app.viewModels.FirstTimeUserViewModel.AlertsAvaiable) {
            return "my-action-needed.aspx";
        }
        // redirect to Medicare home page if pre65 and client not configured
        if (app.viewModels.FirstTimeUserViewModel && app.viewModels.FirstTimeUserViewModel.IsPre65 && !app.viewModels.FirstTimeUserViewModel.AlertsAvaiable) {
            return "my-account.aspx";
        }
        // redirect to Medicare home page if post65
        if (app.viewModels.FirstTimeUserViewModel && !app.viewModels.FirstTimeUserViewModel.IsPre65) {
            return "Medicare/home.aspx";
        }
        //Coming from CompanyLandingPage
        if (app.viewModels.CompanyLandingPageViewModels) {
            //if logged in from Company Landing Page
            if (app.viewModels.LoginValidationViewModel.loginForwardResult && app.viewModels.LoginValidationViewModel.loginForwardResult()){
                // redirect to my action needed if pre65 and CURRENT client (eg. /att) is configured
                if (app.viewModels.LoginValidationViewModel.loginForwardResult().IsUserPre65 && app.viewModels.LoginValidationViewModel.loginForwardResult().IsUsersCurrentClientPre65Config) {
                    return "Pre65-Master/Pre65-Transition.aspx";
                }
                // redirect to Medicare home page if pre65 and CURRENT client (eg /att) not configured
                if (app.viewModels.LoginValidationViewModel.loginForwardResult().IsUserPre65 && !app.viewModels.LoginValidationViewModel.loginForwardResult().IsUsersCurrentClientPre65Config) {
                    return "Medicare/home.aspx";
                }
                // redirect to Medicare home page if post65
                if (!app.viewModels.LoginValidationViewModel.loginForwardResult().IsUserPre65) {
                    return "Medicare/home.aspx";
                }
            }
            //if created account and logged in
            if (app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel) {
                // redirect to my action needed if pre65 and CURRENT client (eg. /att) is configured
                if (app.viewModels.CompanyLandingPageViewModels && app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.IsPre65 && app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.IsCurrentClientConfig) {
                    return "Pre65-Master/Pre65-Transition.aspx";
                }
                // redirect to Medicare home page if pre65 and CURRENT client (eg /att) not configured
                if (app.viewModels.CompanyLandingPageViewModels && app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.IsPre65 && !app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.IsCurrentClientConfig) {
                    return "Medicare/home.aspx";
                }
                // redirect to Medicare home page if post65
                if (app.viewModels.CompanyLandingPageViewModels && !app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.IsPre65) {
                    return "Medicare/home.aspx";
                }
            }
        }
        // redirect to home page if we are done with creating account
        if (ns.currentLightboxName === "createaccountpersonalinfo") {
            return "Medicare/home.aspx";
        }

        // redirect to the dst parameter
        if (global.location.href.indexOf("&dst=") !== -1) {
            var loc = global.location.href.substr(global.location.href.indexOf("&dst=") + 5);
            if (loc.indexOf("application.aspx") !== -1) {
                loc = "Medicare/home.aspx";
            }
            return loc;
        }

        // redirect to checkout/application page if we logged in from view cart
        if (app.viewModels.ViewCartViewModel && app.viewModels.ViewCartViewModel.viewCartPostLoginFlag()) {
            ns.currentLightboxName = "viewcart";
            return (global.location.pathname + "?lightboxName=" + ns.currentLightboxName);
        }
        // redirect to a lightbox
        if (ns.currentLightboxName !== "") {
            return (global.location.pathname + "?lightboxName=" + ns.currentLightboxName);
        }

        // redirect and keep the planId in the query string
        if (ns.currentPlanId !== "") {
            return (global.location.pathname + "?planId=" + ns.currentPlanId);
        }
        //if post 65
        if (app.viewModels.LoginValidationViewModel && app.viewModels.LoginValidationViewModel.loginForwardResult && app.viewModels.LoginValidationViewModel.loginForwardResult() && !app.viewModels.LoginValidationViewModel.loginForwardResult().IsUserPre65) {
            return "Medicare/find-plans.aspx";
        }
        // if pre65 and Action needed alert configured
        if (app.viewModels.LoginValidationViewModel && app.viewModels.LoginValidationViewModel.loginForwardResult && app.viewModels.LoginValidationViewModel.loginForwardResult() && app.viewModels.LoginValidationViewModel.loginForwardResult().IsUserPre65 && app.viewModels.LoginValidationViewModel.loginForwardResult().AlertsAvaiable) {
            return "my-action-needed.aspx";
        }

        //if pre65 and client is configured go to myaccount
        if (app.viewModels.LoginValidationViewModel && app.viewModels.LoginValidationViewModel.loginForwardResult && app.viewModels.LoginValidationViewModel.loginForwardResult() && app.viewModels.LoginValidationViewModel.loginForwardResult().IsUserPre65 && app.viewModels.LoginValidationViewModel.loginForwardResult().IsUsersPrimaryClientPre65Config) {
            return "my-account.aspx";
        }
        //if pre65 and client is not configured go to medicare home page
        if (app.viewModels.LoginValidationViewModel && app.viewModels.LoginValidationViewModel.loginForwardResult && app.viewModels.LoginValidationViewModel.loginForwardResult() && app.viewModels.LoginValidationViewModel.loginForwardResult().IsUserPre65 && !app.viewModels.LoginValidationViewModel.loginForwardResult().IsUsersPrimaryClientPre65Config) {
            return "Medicare/home.aspx";
        }
        // default behavior to redirect to the pathname
        return (global.location.pathname);
    };


    // Redirect to a new page based on the previous page and state variables
    ns.setQueryStringAndReload = function setQueryStringAndReload() {
        var queryString = ns.getQueryString();
        app.functions.redirectToRelativeUrlFromSiteBase(queryString);
    };

} (EXCHANGE, typeof global !== 'undefined' ? global : window));
