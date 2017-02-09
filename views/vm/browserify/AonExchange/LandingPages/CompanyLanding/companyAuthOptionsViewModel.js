(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.CompanyAuthOptionsViewModel = function CompanyAuthOptionsViewModel() {
        if (!(this instanceof CompanyAuthOptionsViewModel)) {
            return new CompanyAuthOptionsViewModel();
        }
        var self = this;

        self.AccountHeaderHtml = ko.observable('');

        self.AccountExistsHeaderHtml = ko.observable('');
        self.AccountExistsHelpHtml = ko.observable('');
        self.AccountExistsContinueText = ko.observable('');

        self.FirstAccessHeaderHtml = ko.observable('');
        self.FirstAccessHelpHtml = ko.observable('');
        self.FirstAccessContinueText = ko.observable('');

        self.FindAccountViewModel = new app.models.FindAccountViewModel();

        self.RedirectToMyActionNeededFlag = false;

        CompanyAuthOptionsViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.AccountHeaderHtml(viewModel.AccountHeaderHtml);
            protoSelf.AccountExistsHeaderHtml(viewModel.AccountExistsHeaderHtml);
            protoSelf.AccountExistsHelpHtml(viewModel.AccountExistsHelpHtml);
            protoSelf.AccountExistsContinueText(viewModel.AccountExistsContinueText);
            protoSelf.FirstAccessHeaderHtml(viewModel.FirstAccessHeaderHtml);
            protoSelf.FirstAccessHelpHtml(viewModel.FirstAccessHelpHtml);
            protoSelf.FirstAccessContinueText(viewModel.FirstAccessContinueText);

            protoSelf.FindAccountViewModel.loadFromJSON(viewModel.FindAccountViewModel);

            // do we need this?
            return protoSelf;
        };

        CompanyAuthOptionsViewModel.prototype.clearData = function clearData() {
            var protoSelf = this;

            protoSelf.FindAccountViewModel.clearData();
        };
    };

} (EXCHANGE));
