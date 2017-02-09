(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.AncLandingPage');

    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        $('#pre65multiplantxt').remove();
        $('#AncMultiplantxt').show();
        $('div.copyright').each(function () { $(this).find('p:not(:first)').remove() });
        $('div.copyright').find('br').remove();
        $("#externallinkpopup").remove();
        ns.initializePage();
        ns.setupViewModels();

    });

    ns.initializePage = function initializePage() {
        ns.setupViewModels();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Ancillary/GetAncillaryLandingPageViewModel",
            dataType: "json",
            success: function (response) {
                app.viewModels.AncLandingPageViewModel.loadFromJSON(response);
            }
        });
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.AncLandingPageViewModel = new app.models.AncLandingPageViewModel();
        ko.applyBindings(app.viewModels, $('#Anc-LandingPage').get(0));
    };
} (EXCHANGE));


