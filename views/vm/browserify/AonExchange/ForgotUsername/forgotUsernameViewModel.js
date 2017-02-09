(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.ForgotUsernameViewModel = function ForgotUsernameViewModel() {
        if (!(this instanceof ForgotUsernameViewModel)) {
            return new ForgotUsernameViewModel();
        }
        var self = this;

        // Not observables because they are basically "constants" that we've put
        // here just to encourage clients to use the same string that  
        // configurePanelType (further below) depends on. 
        self.INITIAL_PANEL_TYPE = "initial";
        self.MULTIMATCH_PANEL_TYPE = "multiple";
        self.FOUNDACCOUNT_PANEL_TYPE = "found";

        self.PopupHeaderTitleHtml = ko.observable('');

        self.InitialPanelHeaderHtml = '';
        self.MultiplePanelHeaderHtml = '';
        self.FoundPanelHeaderHtml = '';
        self.PanelHeaderHtml = ko.observable('');

        self.InitialBottomBarBackText = '';
        self.MultipleBottomBarBackText = '';
        self.FoundBottomBarBackText = '';
        self.BottomBarBackText = ko.observable('');

        self.InitialBottomBarHelpHtml = '';
        self.MultipleBottomBarHelpHtml = '';
        self.FoundBottomBarHelpHtml = '';
        self.BottomBarHelpHtml = ko.observable('');

        self.InitialBottomBarForwardText = '';
        self.MultipleBottomBarForwardText = '';
        self.FoundBottomBarForwardText = '';
        self.BottomBarForwardText = ko.observable('');

        self.FullNameLblHtml = ko.observable('');
        self.UserNameLblHtml = ko.observable('');

        self.FirstName = ko.observable('');
        self.LastName = ko.observable('');
        self.UserName = ko.observable('');

        self.FindAccountViewModel = new app.models.FindAccountViewModel();
        self.PanelTemplateName = ko.observable('');

        self.FoundAccountViaMultiMatch = ko.observable(false);

        ForgotUsernameViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.PopupHeaderTitleHtml(viewModel.PopupHeaderTitleHtml);

            // obtain text for all three panel variants at once on initial page load
            // clients should not use any of these directly; only the prefix-free versions
            // which are observables and which are set by configurePanelType (see below).
            protoSelf.InitialPanelHeaderHtml = viewModel.InitialPanelHeaderHtml;
            protoSelf.MultiplePanelHeaderHtml = viewModel.MultiplePanelHeaderHtml;
            protoSelf.FoundPanelHeaderHtml = viewModel.FoundPanelHeaderHtml;
            protoSelf.InitialBottomBarBackText = viewModel.InitialBottomBarBackText;
            protoSelf.MultipleBottomBarBackText = viewModel.MultipleBottomBarBackText;
            protoSelf.FoundBottomBarBackText = viewModel.FoundBottomBarBackText;
            protoSelf.InitialBottomBarHelpHtml = viewModel.InitialBottomBarHelpHtml;
            protoSelf.MultipleBottomBarHelpHtml = viewModel.MultipleBottomBarHelpHtml;
            protoSelf.FoundBottomBarHelpHtml = viewModel.FoundBottomBarHelpHtml;
            protoSelf.InitialBottomBarForwardText = viewModel.InitialBottomBarForwardText;
            protoSelf.MultipleBottomBarForwardText = viewModel.MultipleBottomBarForwardText;
            protoSelf.FoundBottomBarForwardText = viewModel.FoundBottomBarForwardText;

            protoSelf.FullNameLblHtml(viewModel.FullNameLblHtml);
            protoSelf.UserNameLblHtml(viewModel.UserNameLblHtml);

            protoSelf.FindAccountViewModel.loadFromJSON(viewModel.FindAccountViewModel);

            return protoSelf;
        };

        ForgotUsernameViewModel.prototype.loadAccountFromJSON = function loadAccountFromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.FirstName(viewModel.FirstName);
            protoSelf.LastName(viewModel.LastName);
            protoSelf.UserName(viewModel.UserName);

            return protoSelf;
        };


        ForgotUsernameViewModel.prototype.configurePanelType = function configurePanelType(panelType) {
            var protoSelf = this;

            if (panelType == protoSelf.INITIAL_PANEL_TYPE) {
                protoSelf.PanelHeaderHtml(protoSelf.InitialPanelHeaderHtml);
                protoSelf.BottomBarBackText(protoSelf.InitialBottomBarBackText);
                protoSelf.BottomBarHelpHtml(protoSelf.InitialBottomBarHelpHtml);
                protoSelf.BottomBarForwardText(protoSelf.InitialBottomBarForwardText);
            } else if (panelType == protoSelf.MULTIMATCH_PANEL_TYPE) {
                protoSelf.PanelHeaderHtml(protoSelf.MultiplePanelHeaderHtml);
                protoSelf.BottomBarBackText(protoSelf.MultipleBottomBarBackText);
                protoSelf.BottomBarHelpHtml(protoSelf.MultipleBottomBarHelpHtml);
                protoSelf.BottomBarForwardText(protoSelf.MultipleBottomBarForwardText);
            } else if (panelType == protoSelf.FOUNDACCOUNT_PANEL_TYPE) {
                protoSelf.PanelHeaderHtml(protoSelf.FoundPanelHeaderHtml);
                protoSelf.BottomBarBackText(protoSelf.FoundBottomBarBackText);
                protoSelf.BottomBarHelpHtml(protoSelf.FoundBottomBarHelpHtml);
                protoSelf.BottomBarForwardText(protoSelf.FoundBottomBarForwardText);
            }
        };

        ForgotUsernameViewModel.prototype.clearData = function clearData() {
            var protoSelf = this;

            protoSelf.FirstName('');
            protoSelf.LastName('');
            protoSelf.UserName('');

            protoSelf.FindAccountViewModel.clearData();
        };
    };

} (EXCHANGE));
