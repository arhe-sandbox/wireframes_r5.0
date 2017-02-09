(function (app) {
    // use "strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.pre65VM = function pre65VM() {
        if (!(this instanceof pre65VM)) {
            return new pre65VM();
        }

        var self = this;
        self.Pre65Html = ko.observable('');
        self.Pre65Display = ko.observable(false);
        self.AssistanceInfoHtml = ko.observable('');
        self.pre65Img = ko.observable('');
        self.Pre65Url = ko.observable('#');

        pre65VM.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;
            protoSelf.Pre65Display(viewModel.Pre65Display);
            protoSelf.Pre65Html(viewModel.Pre65Html);
            protoSelf.AssistanceInfoHtml(viewModel.AssistanceInfoHtml);
            self.pre65Img(viewModel.Pre65Img);
            self.Pre65Url(viewModel.Pre65Url);
            return protoSelf;
        };
    };

} (EXCHANGE));
