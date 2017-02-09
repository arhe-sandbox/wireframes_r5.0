/**
 * Lightbox that displays the clicked FAQ question along with its answer. 
 * Requires that the clicked link's 'answer' attribute is equal to the question's answer.
 * The link's text will be used as the Header (question) and the 'answer' attribute is used as the Desc (answer).
 */
(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.faq');

    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializeFaq();
    });

    ns.initializeFaq = function initializeFaq() {
        app.viewModels.FaqPopupViewModel = EXCHANGE.models.FaqPopupViewModel();

        ko.applyBindings(EXCHANGE.viewModels, $('#faq-popup').get(0));

        var faqLb = new app.lightbox.Lightbox({
            name: 'faq',
            divSelector: '#faq-popup',
            openButtonSelector: '#faq-open-button',
            closeButtonSelector: '#faq-close-button',
            potentialChildren: ['gethelp'],
            afterOpen: function (clickedItem) {
                if (!app.viewModels.FaqPopupViewModel.hasBeenLoaded) {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/API/Application/FaqClientViewModel",
                        dataType: "json",
                        success: function (data) {
                            var serverViewModel = data;
                            app.viewModels.FaqPopupViewModel.loadFromJSON(serverViewModel.FaqPopupViewModel);
                        }
                    });
                }
                if (clickedItem) {
                    app.viewModels.FaqPopupViewModel.setHeader($(clickedItem).text());
                    app.viewModels.FaqPopupViewModel.setDesc($(clickedItem).attr('answer'));
                }
            }
        });
    };

} (EXCHANGE));

