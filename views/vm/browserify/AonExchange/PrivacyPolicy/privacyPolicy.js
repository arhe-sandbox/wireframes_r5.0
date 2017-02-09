(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.privacyPolicy');

    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializePrivacyPolicy();
    });


    ns.initializePrivacyPolicy = function initializePrivacyPolicy() {
        EXCHANGE.viewModels.PrivacyPolicyPopupViewModel = EXCHANGE.models.PrivacyPolicyPopupViewModel();

        var privacyLb = new EXCHANGE.lightbox.Lightbox({
            name: 'privacy',
            divSelector: '#privacy-policy-popup',
            openButtonSelector: '#privacy-open-button',
            closeButtonSelector: '#privacy-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#privacy-policy-popup').get(0));
                return true;
            },
            afterOpen: ns.privacyPolicyPopupLoad,
            showWaitPopup: true
        });

    };

    ns.privacyPolicyPopupLoad = function privacyPolicyPopupLoad() {
        if (!EXCHANGE.viewModels.PrivacyPolicyPopupViewModel.hasBeenLoaded) {

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/PrivacyPolicy/PrivacyPolicyPopupClientViewModel",
                dataType: "json",
                success: function (data) {
                    var serverViewModel = data;
                    EXCHANGE.viewModels.PrivacyPolicyPopupViewModel.loadFromJSON(serverViewModel.PrivacyPolicyPopupViewModel);

                    EXCHANGE.viewModels.PrivacyPolicyPopupViewModel.hasBeenLoaded = true;
                    EXCHANGE.placeholder.applyPlaceholder();
                    $.publish("EXCHANGE.lightbox.privacy.loaded");
                },
                failure: function (data) {
                    alert('failure loading lightbox');
                }
            });
        }
        else {
            $.publish("EXCHANGE.lightbox.privacy.loaded");
        }
    };

} (EXCHANGE, this));

