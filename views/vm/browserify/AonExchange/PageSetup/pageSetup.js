// Open the wait popup while the page is initializing and enable auto-adjust
//EXCHANGE.WaitPopup = $(window).WaitPopup({ hide: true, pageSetup: true });
//EXCHANGE.AutoAdjustWaitPopupMask();

(function (app) {
    //"use strict";
    app.namespace('EXCHANGE.viewModels');
    app.namespace('EXCHANGE.models');
    app.namespace('EXCHANGE.exchangeContext');
    var ns = app.namespace('EXCHANGE.user');

    ns.authenticatedCart = [];
    ns.webChatStarted = false;

    $(document).ready(function () {
        ns.initializePageSetup();
        ns.setupModals();
        
    });

    function OpenIECompatibleLightBox() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/PageSetup/UpdateIncompatibleStatusbool",
            dataType: "json",
            success: function (data) {
                $.publish("EXCHANGE.lightbox.incompatibleBrowser.open");
            },
            error: function (data) {
            }
        });
        
    }

    ns.setupModals = function setupModals() {
        EXCHANGE.viewModels.IncompatibleBrowserViewModel = EXCHANGE.viewModels.IncompatibleBrowserViewModel();

        var openincompatibleBrowser = new EXCHANGE.lightbox.Lightbox({
            name: 'incompatibleBrowser',
            divSelector: '#incompatibleBrowser-popup',
            openButtonSelector: '#incompatibleBrowser-open-button',
            closeButtonSelector: '#incompatibleBrowser-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#incompatibleBrowser-popup').get(0));
                return true;
            }
        });
    };

    ns.initializePageSetup = function initializePageSetup() {
        EXCHANGE.AdjustWaitPopupMask(); // manual adjustment for pages stubborn to auto-adjust
        ns.UserSession = app.classes.UserSession();
        app.viewModels.LoginHeaderViewModel = app.models.LoginHeaderViewModel();
        app.viewModels.MenuHeaderViewModel = app.models.MenuHeaderViewModel();

        app.exchangeContext.ExchangeContext = new app.classes.ExchangeContext();
        if (app.models.pre65VM != undefined)
            app.viewModels.Pre65VM = new app.models.pre65VM();

        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.PageSetup.GetPageSetupClientViewModel");

        // The client context of the page (if that value exists) is necessary for page setup
        var setupArgs =
            {
                clientCode: EXCHANGE.functions.getClientCode(),
                partnerCode: EXCHANGE.functions.getPartnerCode(),
                campaignCode: EXCHANGE.functions.getKeyValueFromWindowLocation("camp")
            };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/PageSetup/GetPageSetupClientViewModel",
            dataType: "json",
            data: JSON.stringify(setupArgs),
            success: function (data) {
                var serverViewModel = data;
                app.exchangeContext.ExchangeContext.tabOrder(serverViewModel.TabOrder);
                app.exchangeContext.ExchangeContext.currencySymbol(serverViewModel.CurrencySymbol);
                app.exchangeContext.ExchangeContext.medicareMinAge(serverViewModel.MedicareMinAge);
                app.exchangeContext.ExchangeContext.mailOrderPharmacy(serverViewModel.MailOrderPharmacy);
                if (typeof app.viewModels.PlanSharedResourceStrings == "undefined") {
                    app.viewModels.PlanSharedResourceStrings = app.models.PlanSharedResourceStrings();
                    app.viewModels.PlanSharedResourceStrings.loadFromJSON(serverViewModel.PlanSharedResourceStrings);
                }
                if (app.viewModels.SavedPlansViewModel) {
                    app.viewModels.SavedPlansViewModel.threeTabOrder(serverViewModel.TabOrder);
                }
                ns.UserSession.loadFromJSON(serverViewModel.UserSession);

                if (app.models.pre65VM != undefined) {
                    if (serverViewModel.UserSession.CustomerSupportContext.PageClient != null)
                        app.viewModels.Pre65VM.loadFromJSON(serverViewModel.UserSession.CustomerSupportContext.PageClient);
                    if (serverViewModel.UserSession.CustomerSupportContext.PagePartner != null)
                        app.viewModels.Pre65VM.loadFromJSON(serverViewModel.UserSession.CustomerSupportContext.PagePartner);
                }
                app.agentAccess.hideAndDisable();
                app.viewModels.LoginHeaderViewModel.loadFromJSON(serverViewModel.LoginHeaderViewModel);
                app.viewModels.MenuHeaderViewModel.loadFromJSON(serverViewModel.MenuHeaderViewModel);
                app.constants.loadMonthNames(serverViewModel.MonthNames);
                EXCHANGE.viewModels.MenuHeaderViewModel.phoneNumberHtml(serverViewModel.LoginHeaderViewModel.PhoneNumberHtml);

                EXCHANGE.viewModels.IncompatibleBrowserViewModel.loadFromJSON(serverViewModel.incompatibleBrowserViewModel);
                //deal with int swap login conflict, what about timing?
                //if on search results page, the aftercartandplansloadedfunction will do this logic
                ns.authenticatedCart = serverViewModel.AuthenticatedCart;
                ns.webChatStarted = serverViewModel.WebChatStarted;
                if (!app.searchResults) {
                    ns.loginConflictIntelligentSwap();
                }
                //
                if (EXCHANGE.user.webChatStarted === true) {
                    $('.helpOptions').click();
                }
                if ($('#login-header').length > 0) {
                    ko.applyBindings(app.viewModels, $('#login-header').get(0));
                }
                if ($('#btnLogout').length > 0) {
                    ko.applyBindings(EXCHANGE.user.UserSession, $('#btnLogout').get(0));
                } if ($('.lightbox-open-login').length > 0) {
                    ko.applyBindings(EXCHANGE.user.UserSession, $('.lightbox-open-login').get(0));
                }
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.PageSetup.GetPageSetupClientViewModel");

                if (app.dental) {
                    app.dental.displayOrHide();
                    app.dental.dentalHelpNumber();
                }
                if (app.loginHeader) {
                    //app.loginHeader.showSubMenu();
                    app.loginHeader.highlightMenu();
                }

                if (EXCHANGE.functions.isIE8OrLower() && serverViewModel.UserSession != undefined && !serverViewModel.UserSession._HasCompatibleLightboxShown) {
                    setTimeout(OpenIECompatibleLightBox, 2000);
                }
            },
            error: function (data) {
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.PageSetup.GetPageSetupClientViewModel");
            }
        });
    };

    ns.loginConflictIntelligentSwap = function loginConflictIntelligentSwap() {
        if (ns.authenticatedCart && ns.authenticatedCart.length > 0) {
            app.intelligentSwap.cancelLoginConflictSwap = true;
            EXCHANGE.shoppingCart.setupPlans(function () {
                app.cart.CartAPI.startLoginConflictIntelligentSwap(ns.authenticatedCart);
            });
        }
    };


} (EXCHANGE));
