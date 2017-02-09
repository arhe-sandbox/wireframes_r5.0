(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.activateAccount');

    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializeActivateAccount();
    });

    ns.initializeActivateAccount = function initializeActivateAccount() {
        EXCHANGE.viewModels.ActivateAccountViewModel = EXCHANGE.models.ActivateAccountViewModel();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/ActivateAccountClientViewModel",
            dataType: "json",
            success: function (data) {
                var viewModel = data;
                EXCHANGE.viewModels.ActivateAccountViewModel.loadFromJSON(viewModel.ActivateAccountViewModel);
            }
        });
    };

} (EXCHANGE));

