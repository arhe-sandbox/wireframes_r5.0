(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.optionalCoverage');

    EXCHANGE.namespace('EXCHANGE.viewModels');

    ns.initializeOptionalCoverage = function initializeoptionalCoverage() {
        app.viewModels.OptionalCoverageViewModel = EXCHANGE.models.OptionalCoverageViewModel();
        var optionalLb = new EXCHANGE.lightbox.Lightbox({
            name: 'optional',
            divSelector: '#optional',
            openButtonSelector: '#optional-open-button',
            closeButtonSelector: '#optional-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#optional').get(0));
                ns.bindJqueryEvents();
                return true;
            },
            afterOpen: ns.optionalCoveragePopupLoad,
            showWaitPopup: true
        });


    };

    ns.bindJqueryEvents = function bindJqueryEvents() {
        $(document).on('click', '#optional-done-button', ns.addToCart);
    };

    ns.fixInputs = function fixInputs() {
        $('.optional-coverage-custom-input').find('input').customInput();
    };

    ns.addToCart = function addToCart() {
        app.cart.CartAPI.setSupplementsInCart(app.viewModels.OptionalCoverageViewModel.plan().planGuid(), app.viewModels.OptionalCoverageViewModel.selectedSupplements(), ns.closeLightbox);
    };

    ns.closeLightbox = function closeLightbox() {
        $.publish("EXCHANGE.lightbox.optional.back");
    };

    ns.optionalCoveragePopupLoad = function optionalCoveragePopupLoad() {
        if (!EXCHANGE.viewModels.OptionalCoverageViewModel.hasBeenLoaded) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/SharedPopup/OptionalCoverageViewModel",
                dataType: "json",
                success: function (data) {
                    var serverViewModel = data;
                    app.viewModels.OptionalCoverageViewModel.loadFromJSON(serverViewModel.OptionalCoverageViewModel);
                    app.viewModels.OptionalCoverageViewModel.hasBeenLoaded = true;
                    $.publish("EXCHANGE.lightbox.optional.loaded");
                }
            });
        }
        else {
            $.publish("EXCHANGE.lightbox.optional.loaded");
        }

        app.viewModels.OptionalCoverageViewModel.selectedSupplements(app.cart.CartAPI.getSupplementsInCartByPlan(app.viewModels.OptionalCoverageViewModel.plan().planGuid()));
        $('.optional-coverage-custom-input').find('input').trigger('updateState');
    };

} (EXCHANGE));

