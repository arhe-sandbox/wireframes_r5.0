(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.myAccount");

    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializePage();
        SetCssClassForSelectedtab();
    });

    $('#changingcoverageimage').live('click', function () {
        window.open('/videos/chg-coverage', 'popUpWindow', 'left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes,width=660,height=430');
    });

    $('#changingcoveragetext').live('click', function () {
        window.open('/videos/chg-coverage', 'popUpWindow', 'left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes,width=660,height=430');
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
                app.viewModels.MyAccountSidebarViewModel.loadFromJSON(response);
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
                app.agentAccess.hideAndDisable();
                SetCssClassForSelectedtab();
                //temp fix for my account & login in kentico 8
                ns.openLoginLB();
            },
            error: function (data) {
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
                SetCssClassForSelectedtab();
                //temp fix for my account & login in kentico 8
                ns.openLoginLB();
            }
        });
    };

    ns.openLoginLB = function openLoginLB() {
        if (!EXCHANGE.user.UserSession.IsLoggedIn()) {
            EXCHANGE.dst = window.location.pathname;
            var queryString = "?lightboxName=login&dst=" + EXCHANGE.dst;
            app.loginHeader.logOutAjaxRequest(app.functions.redirectToRelativeUrlFromSiteBase(queryString));
        }
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.MyAccountSidebarViewModel = new app.models.MyAccountSidebarViewModel();
        ko.applyBindings(app.viewModels, $('#my-account-sidebar').get(0));
    };

    ns.selectMyAccountTab = function selectMyAccountTab() {
        $('.MyAccountMenuItem').removeClass('CMSListMenuLI').addClass('CMSListMenuHighlightedLI');
        $('.MyAccountMenuItem > a').removeClass('CMSListMenuLink').addClass('CMSListMenuLinkHighlighted');
    };

    function SetCssClassForSelectedtab() {
        var curSubMenuIndex = window.location.pathname.lastIndexOf("/") + 1;
        var curSubMenu = window.location.pathname.substr(curSubMenuIndex);
        switch (curSubMenu) {
            case "my-account.aspx":
                $('.pre65-ic-myperinf').attr('class', 'pre65-ac-perfinfo')
                break;
            case "my-action-needed.aspx":
                $('.pre65-ic-exclam').attr('class', 'pre65-ac-myactned')
                break;
            case "my-coverage.aspx":
                $('.pre65-ic-medbag').attr('class', 'pre65-ac-mycvrg')
                break;
            case "my-hra-allocation.aspx":
                $('.pre65-ic-hra').attr('class', 'pre65-ac-hraside')
                break;
            case "my-appointments.aspx":
                $('.pre65-ic-myapp').attr('class', 'pre65-ac-myapp')
                break;
            case "update-profile.aspx":
                $('.pre65-ic-myprof').attr('class', 'pre65-ac-myprof')
                break;
        }
    }

} (EXCHANGE));
