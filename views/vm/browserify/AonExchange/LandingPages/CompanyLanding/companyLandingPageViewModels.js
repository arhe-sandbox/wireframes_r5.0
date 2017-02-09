(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.CompanyLandingPageViewModels = function CompanyLandingPageViewModels() {
        if (!(this instanceof CompanyLandingPageViewModels)) {
            return new CompanyLandingPageViewModels();
        }
        var self = this;

        self.CompanyAuthOptionsViewModel = new app.models.CompanyAuthOptionsViewModel();
        self.HelpBoxViewModel = new app.models.HelpBoxViewModel();
       
        self.CreateAccountAuthViewModel = new app.models.CreateAccountAuthViewModel();

        CompanyLandingPageViewModels.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.CompanyAuthOptionsViewModel.loadFromJSON(viewModel.CompanyAuthOptionsViewModel);
            protoSelf.HelpBoxViewModel.loadFromJSON(viewModel.HelpBoxViewModel);
           
            protoSelf.CreateAccountAuthViewModel.loadFromJSON(viewModel.CreateAccountAuthViewModel);

            return protoSelf;
        };
    };

} (EXCHANGE));
