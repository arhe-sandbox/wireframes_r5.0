(function (app) {
    // use "strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.PhoneNumberHeaderViewModel = function PhoneNumberHeaderViewModel() {
        if (!(this instanceof PhoneNumberHeaderViewModel)) {
            return new PhoneNumberHeaderViewModel();
        }

        var self = this;

        self.PhoneNumberHtml = ko.observable('');
        self.SuffixHtml = ko.observable('');

        PhoneNumberHeaderViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.PhoneNumberHtml(viewModel.PhoneNumberHtml);
            protoSelf.SuffixHtml(viewModel.SuffixHtml);

            return protoSelf;
        };
    };
} (EXCHANGE));

