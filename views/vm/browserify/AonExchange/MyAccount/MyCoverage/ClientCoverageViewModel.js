(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.ClientCoverageViewModel = function ClientCoverageViewModel() {
        if (!(this instanceof ClientCoverageViewModel)) {
            return new ClientCoverageViewModel();
        }
        var self = this;

        self.planName_lbl = ko.observable('');
        self.planType_lbl = ko.observable('');
        self.myMonthlyPremium_lbl = ko.observable('');
        self.deductible_lbl = ko.observable('');
        self.moopCost_lbl = ko.observable('');
        self.officeVisit_lbl = ko.observable('');
        self.specialistVisit_lbl = ko.observable('');
        self.inpatientHospitalCare_lbl = ko.observable('');
        self.costSharingAfterDeductible_lbl = ko.observable('');
        self.rxProvider_lbl = ko.observable('');
        self.rxDrugDeductible_lbl = ko.observable('');
        self.rxDrugTierLevel_lbl = ko.observable('');
        self.planTypeName_lbl = ko.computed({
            read: function () {
                switch (self.planType_lbl) {
                    case app.enums.GroupHealthPlanTypeEnum.Dental:
                        return app.enums.GroupHealthPlanTypeEnumName.Dental;
                    case app.enums.GroupHealthPlanTypeEnum.Medical:
                        return app.enums.GroupHealthPlanTypeEnumName.Medical;
                    case app.enums.GroupHealthPlanTypeEnum.Post65Medical:
                        return app.enums.GroupHealthPlanTypeEnumName.Post65Medical;
                    case app.enums.GroupHealthPlanTypeEnum.PrescriptionDrug:
                        return app.enums.GroupHealthPlanTypeEnumName.PrescriptionDrug;
                    case app.enums.GroupHealthPlanTypeEnum.Vision:
                        return app.enums.GroupHealthPlanTypeEnumName.Vision;
                    default:
                        return "";
                }
            },
            owner: this,
            deferEvaluation: false
        });


        ClientCoverageViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.planName_lbl(viewModel.Plan_Name);
            protoSelf.planType_lbl = (viewModel.Plan_Type);
            protoSelf.planTypeName_lbl = (PlanTypeNameConverter(viewModel.Plan_Type));
            protoSelf.myMonthlyPremium_lbl = (viewModel.Monthly_Premium);
            protoSelf.deductible_lbl = (viewModel.Deductible);
            protoSelf.moopCost_lbl = (viewModel.MOOP_Cost);
            protoSelf.officeVisit_lbl = (viewModel.Office_Visit);
            protoSelf.specialistVisit_lbl = (viewModel.Specialist_Visit);
            protoSelf.inpatientHospitalCare_lbl = (viewModel.Inpatient_HospitalCare);
            protoSelf.costSharingAfterDeductible_lbl = (viewModel.CostSharing_AfterDeductible);
            protoSelf.rxProvider_lbl = (viewModel.Rx_Provider);
            protoSelf.rxDrugDeductible_lbl = (viewModel.Rx_DrugDedutible);
            protoSelf.rxDrugTierLevel_lbl = (viewModel.Rx_DrugTierLevel);
            return protoSelf;
        };

        return self;
    };

    function PlanTypeNameConverter(planType) {
        if (!(this instanceof PlanTypeNameConverter)) {
            return new PlanTypeNameConverter(playType);
        }

        switch (playType) {
            case app.enums.GroupHealthPlanTypeEnum.Dental:
                return app.enums.GroupHealthPlanTypeEnumName.Dental;
            case app.enums.GroupHealthPlanTypeEnum.Medical:
                return app.enums.GroupHealthPlanTypeEnumName.Medical;
            case app.enums.GroupHealthPlanTypeEnum.Post65Medical:
                return app.enums.GroupHealthPlanTypeEnumName.Post65Medical;
            case app.enums.GroupHealthPlanTypeEnum.PrescriptionDrug:
                return app.enums.GroupHealthPlanTypeEnumName.PrescriptionDrug;
            case app.enums.GroupHealthPlanTypeEnum.Vision:
                return app.enums.GroupHealthPlanTypeEnumName.Vision;
            default:
                return "";
        }
    };


} (EXCHANGE));

(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.ClientCoverageViewModel = function ClientCoverageViewModel() {
        if (!(this instanceof ClientCoverageViewModel)) {
            return new ClientCoverageViewModel();
        }
        var self = this;

        self.planName_lbl = ko.observable('');
        self.planType_lbl = ko.observable('');
        self.myMonthlyPremium_lbl = ko.observable('');
        self.deductible_lbl = ko.observable('');
        self.moopCost_lbl = ko.observable('');
        self.officeVisit_lbl = ko.observable('');
        self.specialistVisit_lbl = ko.observable('');
        self.inpatientHospitalCare_lbl = ko.observable('');
        self.costSharingAfterDeductible_lbl = ko.observable('');
        self.rxProvider_lbl = ko.observable('');
        self.rxDrugDeductible_lbl = ko.observable('');
        self.rxDrugTierLevel_lbl = ko.observable('');
        self.planTypeName_lbl = ko.observable('');


        ClientCoverageViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.planName_lbl(viewModel.Plan_Name);
            protoSelf.planType_lbl = (viewModel.Plan_Type);
            protoSelf.planTypeName_lbl = (PlanTypeNameConverter(viewModel.Plan_Type));
            protoSelf.myMonthlyPremium_lbl = (viewModel.Monthly_Premium);
            protoSelf.deductible_lbl = (viewModel.Deductible);
            protoSelf.moopCost_lbl = (viewModel.MOOP_Cost);
            protoSelf.officeVisit_lbl = (viewModel.Office_Visit);
            protoSelf.specialistVisit_lbl = (viewModel.Specialist_Visit);
            protoSelf.inpatientHospitalCare_lbl = (viewModel.Inpatient_HospitalCare);
            protoSelf.costSharingAfterDeductible_lbl = (viewModel.CostSharing_AfterDeductible);
            protoSelf.rxProvider_lbl = (viewModel.Rx_Provider);
            protoSelf.rxDrugDeductible_lbl = (viewModel.Rx_DrugDedutible);
            protoSelf.rxDrugTierLevel_lbl = (viewModel.Rx_DrugTierLevel);
            return protoSelf;
        };

        return self;
    };

    function PlanTypeNameConverter(planType) {

        switch (planType) {
            case app.enums.GroupHealthPlanTypeEnum.Dental:
                return app.enums.GroupHealthPlanTypeEnumName.Dental;
            case app.enums.GroupHealthPlanTypeEnum.Medical:
                return app.enums.GroupHealthPlanTypeEnumName.Medical;
            case app.enums.GroupHealthPlanTypeEnum.Post65Medical:
                return app.enums.GroupHealthPlanTypeEnumName.Post65Medical;
            case app.enums.GroupHealthPlanTypeEnum.PrescriptionDrug:
                return app.enums.GroupHealthPlanTypeEnumName.PrescriptionDrug;
            case app.enums.GroupHealthPlanTypeEnum.Vision:
                return app.enums.GroupHealthPlanTypeEnumName.Vision;
            default:
                return "";
        }
    };


} (EXCHANGE));

