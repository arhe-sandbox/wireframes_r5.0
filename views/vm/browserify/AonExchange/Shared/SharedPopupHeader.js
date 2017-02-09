(function (app) {
    var ns = app.namespace("EXCHANGE.sharedPopupHeader");
    app.namespace("EXCHANGE.viewModels");

    ns.loadSharedPopupHeader = function loadSharedPopupHeader() {
        app.viewModels.SharedPopupHeaderViewModel = new app.models.SharedPopupHeaderViewModel();

        var sharedPopupArgs =
            {
                ClientCode: EXCHANGE.functions.getClientCode(),
                PartnerCode: EXCHANGE.functions.getPartnerCode() 
            };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/HeaderViewModel",
            dataType: "json",
            data: JSON.stringify(sharedPopupArgs),
            success: function (viewModel) {
                app.viewModels.SharedPopupHeaderViewModel.loadFromJSON(viewModel);
            }
        });
    };

    $(document).ready(function () {
        ns.loadSharedPopupHeader();
    });



} (EXCHANGE));
