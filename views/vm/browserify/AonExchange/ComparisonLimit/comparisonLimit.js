(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.comparisonLimit');

    ns.initializeComparisonLimit = function initializeComparisonLimit() {

        ns.setupViewModels();

        var compairsonLb = new EXCHANGE.lightbox.Lightbox({
            name: 'comparisonlimit',
            divSelector: '#comparison-limit-popup',
            openButtonSelector: '#comparison-limit-open-button',
            closeButtonSelector: '#comparison-limit-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#comparison-limit-popup').get(0));
                return true;
            },
            afterOpen: function (item) {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/API/SharedPopup/ComparisonLimitClientViewModel",
                    dataType: "json",
                    success: function (data) {
                        var serverViewModel = data;
                        EXCHANGE.viewModels.ComparisonLimitViewModel.loadFromJSON(serverViewModel.ComparisonLimitViewModel);

                        $.publish("EXCHANGE.lightbox.comparisonlimit.loaded");
                    },
                    error: function () {
                        $.publish('EXCHANGE.lightbox.closeAll');
                    }
                });
            },
            showWaitPopup: true
        });
    };


    ns.setupViewModels = function setupViewModels() {
        if (!EXCHANGE.viewModels.ComparisonLimitViewModel) {
            EXCHANGE.viewModels.ComparisonLimitViewModel = EXCHANGE.models.ComparisonLimitViewModel();
        }
    };

} (EXCHANGE));

