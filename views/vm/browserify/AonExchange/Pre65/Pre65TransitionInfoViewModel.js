(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.Pre65TransitionInfoViewModel = function Pre65TransitionInfoViewModel() {
        if (!(this instanceof Pre65TransitionInfoViewModel)) {
            return new Pre65TransitionInfoViewModel();

        }
        var self = this;

        self.transfer_lbl = ko.observable('');
        self.steps_lbl = ko.observable('');
        self.step1_lbl = ko.observable('');
        self.step2_lbl = ko.observable('');
        self.step3_lbl = ko.observable('');
        self.leaving_lbl = ko.observable('');
        self.clickhere_lbl = ko.observable('');

        Pre65TransitionInfoViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoself = this;

            protoself.transfer_lbl(viewModel.transfer_lbl);
            protoself.steps_lbl(viewModel.steps_lbl);
            protoself.step1_lbl(viewModel.step1_lbl);
            protoself.step2_lbl(viewModel.step2_lbl);
            protoself.step3_lbl(viewModel.step3_lbl);
            protoself.leaving_lbl(viewModel.leaving_lbl);
            protoself.clickhere_lbl(viewModel.clickhere_lbl);
            return protoself;
        };

    };

} (EXCHANGE));
