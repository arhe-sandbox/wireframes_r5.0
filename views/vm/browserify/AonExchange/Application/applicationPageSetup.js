//// Open the wait popup while the page is initializing and enable auto-adjust
//EXCHANGE.WaitPopup = $(window).WaitPopup({ hide: true, pageSetup: true });
//EXCHANGE.AutoAdjustWaitPopupMask();

(function (app) {
    var ns = app.namespace('EXCHANGE.applicationPageSetup');
    app.namespace("EXCHANGE.user");
    app.namespace("EXCHANGE.exchangeContext");
    app.namespace("EXCHANGE.viewModels");
    $(document).ready(function () {
        ns.initializeApplicationPageSetup();
    });

    ns.initializeApplicationPageSetup = function initializePageSetup() {
        app.user.UserSession = app.classes.UserSession();
        app.exchangeContext.ExchangeContext = new app.classes.ExchangeContext();
        app.viewModels.LoginHeaderViewModel = app.models.LoginHeaderViewModel();
        app.viewModels.MenuHeaderViewModel = app.models.MenuHeaderViewModel();

        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.PageSetup.GetApplicationPageSetupClientViewModel");

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/PageSetup/GetApplicationPageSetupClientViewModel",
            dataType: "json",
            success: function (viewModel) {
                app.user.UserSession.loadFromJSONMinimal(viewModel.UserSession);
                app.exchangeContext.ExchangeContext.currencySymbol(viewModel.CurrencySymbol);
                app.exchangeContext.ExchangeContext.medicareMinAge(viewModel.MedicareMinAge);
                app.constants.loadMonthNames(viewModel.MonthNames);
                app.agentAccess.hideAndDisable();

                app.viewModels.LoginHeaderViewModel.loginEnabled(false);
                app.viewModels.LoginHeaderViewModel.loadFromJSON(viewModel.LoginHeaderViewModel);
                app.viewModels.MenuHeaderViewModel.loadFromJSON(viewModel.MenuHeaderViewModel);
             
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.PageSetup.GetApplicationPageSetupClientViewModel");
            },
            error: function (data) {
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.PageSetup.GetApplicationPageSetupClientViewModel");
            }
        });
    };


} (EXCHANGE));
