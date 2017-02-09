(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.ancillary');
    ns.ancProviderUrl = '';

    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializeAncillary();
    });


    ns.initializeAncillary = function initializeAncillary() {
        EXCHANGE.viewModels.AncillaryPopupViewModel = EXCHANGE.models.AncillaryPopupViewModel();

        var ancillaryLb = new EXCHANGE.lightbox.Lightbox({
            name: 'ancillary',
            divSelector: '#ancillary-popup',
            openButtonSelector: '#ancillary-open-button',
            closeButtonSelector: '#ancillary-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#ancillary-popup').get(0));
                return true;
            },
            afterOpen: function (item) {

                var ancProviderUrl = $(item).attr('href');

                if (ancProviderUrl != null) {
                    ns.ancProviderUrl = ancProviderUrl;
                } else {
                    ancProviderUrl = ns.ancProviderUrl;
                }

                if (!EXCHANGE.viewModels.AncillaryPopupViewModel.hasBeenLoaded) {

                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/API/Ancillary/AncillaryPopupClientViewModel",
                        dataType: "json",
                        success: function (data) {
                            var serverViewModel = data;
                            EXCHANGE.viewModels.AncillaryPopupViewModel.loadFromJSON(serverViewModel.AncillaryPopupViewModel);

                            EXCHANGE.viewModels.AncillaryPopupViewModel.hasBeenLoaded = true;
                            EXCHANGE.placeholder.applyPlaceholder();
                            $.publish("EXCHANGE.lightbox.ancillary.loaded");
                        },
                        failure: function (data) {
                            alert('failure loading lightbox');
                        }
                    });
                }
                else {
                    $.publish("EXCHANGE.lightbox.ancillary.loaded");
                }
            },
            beforeSubmit: ns.NavigateToAncillaryURL
            //showWaitPopup: true
        });

    };

    ns.NavigateToAncillaryURL = function NavigateToAncillaryURL() {
        $.publish("EXCHANGE.lightbox.closeAll");

        var url = "";
        var index = ns.ancProviderUrl.indexOf("http");
        if (index == 0)
            url = ns.ancProviderUrl;
        else
            url = "http://" + ns.ancProviderUrl;
                
        window.open(url, "_blank");
    };


} (EXCHANGE, this));

