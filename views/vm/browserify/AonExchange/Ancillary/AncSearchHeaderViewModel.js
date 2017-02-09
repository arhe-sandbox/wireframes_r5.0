(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.AncSearchHeaderViewModel = function AncSearchHeaderViewModel() {
        if (!(this instanceof AncSearchHeaderViewModel)) {
            return new AncSearchHeaderViewModel();
        }
        var self = this;

        self.ancCoverageTypeLbl = ko.observable('');
        self.ancChooseCovLbl = ko.observable('');
        self.ancFamilyMemberLbl = ko.observable('');
        self.ancRelationshipLbl = ko.observable('');
        self.ancDOBLbl = ko.observable('');
        self.ancRelationshipLbl = ko.observable('');
        self.ancMoreCoverage_lbl = ko.observable('');
        self.ancbtnAddFamilyMember = ko.observable('');
        self.ancbtnUpdateFamilyMember = ko.observable('');
        self.ancFindPlansLbl = ko.observable('');
        self.ancZipCodeLbl = ko.observable('');
        self.ancCovEffDateLbl = ko.observable('');
        self.ancbtnPlan = ko.observable('');
        self.action = ko.observable('add'); //edit
        self.editId = ko.observable(''); //edit
        self.primaryUserName = ko.observable('');
        self.customerId = ko.observable('');
        self.primaryUserRealtionShip = ko.observable('');
        self.primaryUserBirthDate = ko.observable('');
        self.findPlanZipCode = ko.observable('');
        self.findPlanCoverageBeginsDate = ko.observable('');
        self.Family = ko.observableArray([]);
        self.ancDentalCoverageTypeLbl = ko.observable("Dental Coverage");
        self.ancGenderLbl = ko.observable('');
        self.ancHoverAddFamilyMember = ko.observable("Once you’ve added Dependents, you will be returned to this page and will need to click “Update Plans” in order for the family profile to reflect the addition.");

        AncSearchHeaderViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoself = this;
            protoself.Family([]);
            if (viewModel.Family !== null) {
                $.each(viewModel.Family, function (index, Family) {
                    var obj = ko.mapping.fromJS(Family);
                    obj.DateOfBirth(moment(Family.DateOfBirth).format("MM/DD/YYYY"));
                    protoself.Family.push(obj);
                });
            }

            if (EXCHANGE.user.UserSession.UserProfile.family()) {
                for (i = 0; i < EXCHANGE.user.UserSession.UserProfile.family().length; i++) {
                    protoself.Family()[i].IsDentalCoverage(EXCHANGE.user.UserSession.UserProfile.family()[i].IsDentalCoverage);
                    protoself.Family()[i].IsVisionCoverage(EXCHANGE.user.UserSession.UserProfile.family()[i].IsVisionCoverage);
                }
            }

            protoself.ancCoverageTypeLbl(viewModel.ancCoverageTypeLbl);
            protoself.ancChooseCovLbl(viewModel.ancChooseCovLbl);
            protoself.ancFamilyMemberLbl(viewModel.ancFamilyMemberLbl);
            protoself.ancRelationshipLbl(viewModel.ancRelationshipLbl);
            protoself.ancDOBLbl(viewModel.ancDOBLbl);
            protoself.ancRelationshipLbl(viewModel.ancRelationshipLbl);
            protoself.ancMoreCoverage_lbl(viewModel.ancMoreCoverage_lbl);
            protoself.ancbtnAddFamilyMember(viewModel.ancbtnAddFamilyMember);
            protoself.ancbtnUpdateFamilyMember(viewModel.ancbtnUpdateFamilyMember);
            protoself.ancFindPlansLbl(viewModel.ancFindPlansLbl);
            protoself.ancZipCodeLbl(viewModel.ancZipCodeLbl);
            protoself.ancCovEffDateLbl(viewModel.ancCovEffDateLbl);
            protoself.ancbtnPlan(viewModel.ancbtnPlan);
            protoself.primaryUserName(viewModel.primaryUserName);
            protoself.customerId(viewModel.customerId);
            protoself.primaryUserRealtionShip(viewModel.primaryUserRealtionShip);
            protoself.primaryUserBirthDate(viewModel.primaryUserBirthDate);
            protoself.findPlanZipCode(viewModel.findPlanZipCode);
            protoself.findPlanCoverageBeginsDate(viewModel.findPlanCoverageBeginsDate);
            protoself.ancGenderLbl(viewModel.ancGenderLbl);
            //protoself.ancHoverAddFamilyMember(viewModel.ancHoverAddFamilyMember);
            protoself.action("add");
            protoself.editId("");

            return protoself;
        };
    };

} (EXCHANGE));
