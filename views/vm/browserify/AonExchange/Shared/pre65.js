(function (app) {
    // use "strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.loadPre65 = function loadPre65() {
        app.viewModels.Pre65VM = new app.models.pre65VM();
        var sharedPopupArgs =
            {
                ClientCode: EXCHANGE.functions.getClientCode(),
                PartnerCode: EXCHANGE.functions.getPartnerCode()
            };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/Pre65ViewModel",
            dataType: "json",
            data: JSON.stringify(sharedPopupArgs),
            success: function (viewModel) {
                app.viewModels.Pre65VM.loadFromJSON(viewModel);
            }
        });

    };
    $(document).ready(function () {
        ns.loadPre65();
    });
} (EXCHANGE));
