(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.pre65Sidebar");

    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializePage();
    });

    ns.initializePage = function initializePage() {
        ns.setupViewModels();
        ns.selectMyAccountTab();
        
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/SidebarClientViewModel",
            dataType: "json",
            success: function (response) {
                app.viewModels.Pre65MyAccountSidebarViewModel.loadFromJSON(response);
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
                //app.agentAccess.hideAndDisable();
            },
            error: function (data) {
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            }
        });
        
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.Pre65MyAccountSidebarViewModel = new app.models.Pre65MyAccountSidebarViewModel();
        ko.applyBindings(app.viewModels, $('#pre65-my-account-sidebar').get(0));
    };

    ns.selectMyAccountTab = function selectMyAccountTab() {
        //$('.MyAccountMenuItem').removeClass('CMSListMenuLI').addClass('CMSListMenuHighlightedLI');
        //$('.MyAccountMenuItem > a').removeClass('CMSListMenuLink').addClass('CMSListMenuLinkHighlighted');
    };

} (EXCHANGE));