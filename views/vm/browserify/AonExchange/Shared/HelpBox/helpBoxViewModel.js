(function (app) {
    // use "strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.HelpBoxViewModel = function HelpBoxViewModel() {
        if (!(this instanceof HelpBoxViewModel)) {
            return new HelpBoxViewModel();
        }

        var self = this;
        self.AlertHtml = ko.observable('');
        self.AssistanceInfoHtml = ko.observable('');

        HelpBoxViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.AlertHtml(viewModel.AlertHtml);
            protoSelf.AssistanceInfoHtml(viewModel.AssistanceInfoHtml);
        };
    };

} (EXCHANGE));
