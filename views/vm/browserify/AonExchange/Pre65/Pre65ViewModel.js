(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.Pre65ViewModel = function Pre65ViewModel() {
        if (!(this instanceof Pre65ViewModel)) {
            return new Pre65ViewModel();
        }
        var self = this;

        self.pre65IndividualIntroHeader = ko.observable('');
        self.pre65IndividualIntro = ko.observable('');
        self.pre65IndividualGetStartedButton = ko.observable('');
        self.pre65IndividualTopPlansHeaderLine1 = ko.observable('');
        self.pre65IndividualTopPlansHeaderLine2 = ko.observable('');
        self.pre65IndividualThirdSectionHeader = ko.observable('');
        self.pre65IndividualThirdSectionContent = ko.observable('');

/*  Commented Code for Product Backlog Item 79184:Remove Carrier logos from IFP Landing Page              
        self.pre65IndividualTopPlansColumn1 = ko.observable('');
        self.pre65IndividualTopPlansColumn2 = ko.observable('');
        self.pre65IndividualTopPlansColumn3 = ko.observable('');        
        self.pre65IndividualGetReady = ko.observable('');
        self.pre65IndividualHelpfulResources = ko.observable('');
        self.pre65IndividualHelpfulResourcesColumn1 = ko.observable('');
        self.pre65IndividualHelpfulResourcesColumn2 = ko.observable('');
        self.pre65IndividualHelpfulResourcesColumn3 = ko.observable('');
*/
        self.pre65IndividualGetCovered = ko.observable('');

        Pre65ViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;
            protoSelf.pre65IndividualIntroHeader(viewModel.Pre65IndividualIntroHeader);
            protoSelf.pre65IndividualIntro(viewModel.Pre65IndividualIntro);
            protoSelf.pre65IndividualGetStartedButton(viewModel.Pre65IndividualGetStartedButton);
            protoSelf.pre65IndividualTopPlansHeaderLine1(viewModel.Pre65IndividualTopPlansHeaderLine1);
            protoSelf.pre65IndividualTopPlansHeaderLine2(viewModel.Pre65IndividualTopPlansHeaderLine2);
            protoSelf.pre65IndividualThirdSectionHeader(viewModel.Pre65IndividualThirdSectionHeader);
            protoSelf.pre65IndividualThirdSectionContent(viewModel.Pre65IndividualThirdSectionContent);

/*  Commented Code for Product Backlog Item 79184:Remove Carrier logos from IFP Landing Page   
            protoSelf.pre65IndividualTopPlansColumn1(viewModel.Pre65IndividualTopPlansColumn1);
            protoSelf.pre65IndividualTopPlansColumn2(viewModel.Pre65IndividualTopPlansColumn2);
            protoSelf.pre65IndividualTopPlansColumn3(viewModel.Pre65IndividualTopPlansColumn3);            
            protoSelf.pre65IndividualGetReady(viewModel.Pre65IndividualGetReady);
            protoSelf.pre65IndividualHelpfulResources(viewModel.Pre65IndividualHelpfulResources);
            protoSelf.pre65IndividualHelpfulResourcesColumn1(viewModel.Pre65IndividualHelpfulResourcesColumn1);
            protoSelf.pre65IndividualHelpfulResourcesColumn2(viewModel.Pre65IndividualHelpfulResourcesColumn2);
            protoSelf.pre65IndividualHelpfulResourcesColumn3(viewModel.Pre65IndividualHelpfulResourcesColumn3);
*/
            protoSelf.pre65IndividualGetCovered(viewModel.Pre65IndividualGetCovered);


            return protoSelf;
        };
    };

} (EXCHANGE));
