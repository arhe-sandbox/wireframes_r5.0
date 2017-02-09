(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.shoppingCart');

    app.namespace('EXCHANGE.cart');
    app.namespace('EXCHANGE.viewModels');

    ns.haveLightboxesBeenInitialized = false;

    $(function () {
        ns.initializePage();
        //// Bind the Pre65 cart 
        if ($('.pre65-shopping').length > 0) 
            ko.applyBindings(EXCHANGE.viewModels.ShoppingCartViewModel, $('.pre65-shopping').get(0));
    });

    ns.initializePage = function initializePage() {
        ns.buildShoppingCart();
        ns.updateCartWebpartUI();
        ns.bindEvents();
    };

    ns.initializeLightboxes = function initializeLightboxes() {
        if (!ns.haveLightboxesBeenInitialized) {

            if (!app.viewModels.SearchResultsViewModel) {
                app.viewModels.SearchResultsViewModel = app.models.SearchResultsViewModel();
            }
            if (!app.viewModels.PlanSharedResourceStrings && EXCHANGE.viewModels.findRecommendationsViewModel != undefined) {
                app.viewModels.PlanSharedResourceStrings = app.models.PlanSharedResourceStrings();
            }
            app.planDetails.initializePlanDetails();
            app.comparePlans.initializeComparePlans();
            app.savedPlans.initializeSavedPlansPopup();
            app.intelligentSwap.initializeIntelligentSwap();
            //  app.optionalCoverage.initializeOptionalCoverage();
            app.viewCart.initializeViewCart();
            app.comparisonLimit.initializeComparisonLimit();
            app.decisionSupport.initializeDecisionSupport();
            ns.haveLightboxesBeenInitialized = true;
        }
    };

    ns.buildShoppingCart = function buildShoppingCart() {
        if (!app.user.ShoppingCart) {
            app.user.ShoppingCart = new app.models.ShoppingCart();
        }
        app.cart.CartAPI = new app.models.CartAPI();
        app.viewModels.ShoppingCartViewModel = app.models.ShoppingCartViewModel();
        app.viewModels.ShoppingCartViewModel.getCartViewModel();


    };

    function getFormattedAction(evt) {

        var target, targetText;

        if (!evt.target)
            target = evt.srcElement; //IE
        else
            target = evt.target; //Firefox

        if (target.nodeType == 3)
            target = target.parentNode; //safari 

        if (target.nodeType == 3) {
            targetText = target.nodeValue;
        } else {
            targetText = target.firstChild.nodeValue;
        }

        if (targetText.contains('View Cart')) {
            return 'View Cart';
        } else if (targetText.contains('Checkout')) {
            return 'Checkout';
        } else {
            return '';
        }
    }

    function getFormattedShoppingCartLabel() {

        if (EXCHANGE.lightbox.currentLightbox == null) {

            if (window.location.pathname.contains('search-results')) {
                return 'Search Results';
            }

            if (window.location.pathname.contains('home')) {
                return 'Home';
            }
        }
        else {

            var lightboxName = EXCHANGE.lightbox.currentLightbox.name;

            switch (lightboxName) {

                case 'plandetails':
                    return 'Plan Details';
                    break;
                case 'compareplans':
                    return 'Compare Plans';
                    break;
                case 'viewcart':
                    return 'View Cart';
                    break;
            }
        }

        return 'Home'
    }

    ns.bindEvents = function bindEvents() {
        $(document).on('click', '#view-cart-btn, #cart-webpart-checkout-btn, .lightbox-open-viewcart', function (event) {
            // && app.user.UserSession.UserProfile.zipCode
            // add Google Analytic 


            if (_gaq) {

                var capturedAction = getFormattedAction(event);

                if (capturedAction != '') {
                    _gaq.push(['_trackEvent', capturedAction, 'Click', getFormattedShoppingCartLabel()]);
                }
            }

            if (app.user.UserSession && app.user.UserSession.UserProfile && app.viewModels.ShoppingCartViewModel && app.viewModels.ShoppingCartViewModel.plansInCart() && app.viewModels.ShoppingCartViewModel.plansInCart() > 0) {
                var $spinner = $(this).ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGELIGHTGRAY });

                ns.initializeLightboxes();
                //                $spinner.Stop();
                //                ns.openViewCart();
                ns.setupPlans(function () {
                    $spinner.Stop();
                    ns.openViewCart();
                });
            }
            return false;
        });
    };

    ns.openViewCart = function openViewCart() {
        $.publish("EXCHANGE.lightbox.viewcart.open");
    };

    ns.setupPlans = function setupPlans(callback) {
        if (!app.viewModels.SearchResultsViewModel) {
            app.viewModels.SearchResultsViewModel = app.models.SearchResultsViewModel();
        }
        if (!app.viewModels.PlanSharedResourceStrings) {

            // app.viewModels.PlanSharedResourceStrings = app.models.PlanSharedResourceStrings();
            ns.loadPlanSharedResourceString(callback);

        }
        //        if (!app.plans.AllPlanViewModels || app.plans.AllPlanViewModels.length == 0) {
        //            ns.loadPlans(callback);
        //        }
        else if ($.isFunction(callback)) {
            callback();
        }
    };

    ns.afterCartAndPlansLoaded = function afterCartAndPlansLoaded(callback) {
        ns.initializeLightboxes();
        EXCHANGE.searchResults.setPlansInCart();
        EXCHANGE.searchResults.setComparedPlans();
        EXCHANGE.searchResults.setSavedPlans();
        app.plans.PlanLoader.initializeActivePlans();
        app.viewModels.SearchResultsViewModel.loadFromActivePlans();
        if ($.isFunction(callback)) {
            callback();
        }
    };


    ns.loadPlanSharedResourceString = function loadPlanSharedResourceString(callback) {

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/GetPlanSharedResourceStrings",
            dataType: "json",
            success: function (data) {
                app.viewModels.PlanSharedResourceStrings = app.models.PlanSharedResourceStrings()
                app.viewModels.PlanSharedResourceStrings.loadFromJSON(data);
                if ($.isFunction(callback)) {
                    callback();
                }
            }
        });
    };

    ns.loadPlans = function loadPlans(callback) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SearchResult/GetPlansForShoppingCart",
            dataType: "json",
            success: function (data) {
                var viewModel = data;
                app.viewModels.SearchResultsViewModel.loadFromJSON(viewModel.SearchResultsViewModel, viewModel.PlanLists);
                app.viewModels.PlanSharedResourceStrings.loadFromJSON(viewModel.PlanSharedResourceStrings);

                var cb = function () {
                    ns.afterCartAndPlansLoaded(callback);
                };

                // app.plans.PlanLoader.loadAllPlansFromJson(viewModel, cb);
                //app.plans.PlanLoader.initializeActivePlans();
            }
        });
    };

    ns.updateCartWebpartUI = function updateCartWebpartUI() {
        var cart = $('.cartblock');
        if (cart.length > 0) {
            ko.applyBindings({}, cart[0]);
        }
    };


} (EXCHANGE, this));

(function (app) {
    var ns = app.namespace('EXCHANGE.cart');

    $(function () {

        var cart = $('.cartblock');
        if (cart.length > 0) {
            
            ko.applyBindings({}, cart[0]);
        }



    });


} (EXCHANGE));
