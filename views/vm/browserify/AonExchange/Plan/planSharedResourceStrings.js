(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.PlanSharedResourceStrings = function PlanSharedResourceStrings() {
        if (!(this instanceof PlanSharedResourceStrings)) {
            return new PlanSharedResourceStrings();
        }
        var self = this;

        self.estimatedTotalCosts_lbl = '';
        self.totalCosts_lbl = '';
        self.whatWillTotalCostsBe_lbl = '';
        self.whatWillTotalCostsBeHover_lbl = '';
        self.whatWillTotalHealthcareCostsBe_lbl = '';
        self.howIsThisCalculated_lbl = '';

        self.planDetailsHover_lbl = '';
        self.cmsRating_lbl = '';
        self.cmsRatingOutOf_lbl = '';
        self.cmsRatingHoverBodySummary_lbl = '';
        self.cmsRatingDescriptions = '';
        self.planIdText = '';
        self.remove_lbl = '';
        self.premium_lbl = '';
        self.frequencyPremium_lbl = '';
        self.doctorFinder_lbl = ko.observable();
        self.doctorFinderNoLink_lbl = ko.observable();
        self.doctorFinderHover_lbl = ko.observable();
        self.areMyMedicinesCovered_lbl = '';
        self.areMyMedicinesCoveredHover_lbl = '';
        self.dentalProvider_lbl = ko.observable();
        self.visionProvider_lbl = ko.observable();
        self.moreOptions_lbl = '';
        self.moreOptsPlanDetails_lbl = '';
        self.moreOptsSave_lbl = '';
        self.moreOptsSaved_lbl = '';
        self.compare_lbl = '';
        self.inComparison_lbl = '';
        self.compareTrueHover_lbl = '';
        self.compareFalseHover_lbl = '';
        self.compareTooManyError_lbl = '';
        self.attributeClickforInfo_lbl = '';
        self.addToCartBtn_lbl = '';
        self.inCartBtn_lbl = '';
        self.addNotInCartHover_lbl = '';
        self.addIsInCartHover_lbl = '';
        self.includedInPlan_lbl = '';

        self.coversMedical_lbl = '';
        self.coversPrescription_lbl = '';
        self.medical_lbl = '';
        self.prescription_lbl = '';
        self.optionalDental_lbl = '';
        self.optionalVision_lbl = '';
        self.coverageIncluded_lbl = '';
        self.coverageAdditionalCost_lbl = '';
        self.clickForSupplementInfo_lbl = '';

        self.xofYCovered_lbl = '';
        self.medsCoveredCount_lbl = '';
        self.medsCoveredMoreInfo_lbl = '';
        self.medsCoveredMoreInfoHover_lbl = '';

        self.planPremiumFrequency_lbls = ko.observableArray([]);
        self.planPremiumFrequencyAlternate_lbls = ko.observableArray([]);
        self.supplementFrequency_lbls = ko.observableArray([]);
        self.supplementFrequencyAlternate_lbls = ko.observableArray([]);

        self.findPlans_lbl = '';
        self.browseText_lbl = '';
        self.noAttributeValue_lbl = '';
        self.PriorYearPlan_Lbl = '';

        self.tceDagger_lbl = "†";
        self.physicianFinderNetwork = '';
        self.physicianUnknownNetwork = '';
        self.physicianUnknownNetworkDesc = '';
        self.physicianNeedToUpdate = '';
        self.physicianFinderLinkText = '';
        self.physicianFinderNoLinkText = '';
        self.physicianInNetwork = '';
        self.physicianOutOfNetwork = '';
        self.RecPlanTooltip = ''
        PlanSharedResourceStrings.prototype.loadFromJSON = function loadFromJSON(planSharedResourceStrings) {
            var protoSelf = this;

            protoSelf.estimatedTotalCosts_lbl = planSharedResourceStrings.EstimatedTotalCosts_Lbl;
            protoSelf.totalCosts_lbl = planSharedResourceStrings.TotalCosts_Lbl;
            protoSelf.whatWillTotalCostsBe_lbl = planSharedResourceStrings.WhatWillTotalCostsBe_Lbl;
            protoSelf.whatWillTotalCostsBeHover_lbl = planSharedResourceStrings.WhatWillTotalCostsBeHover_Lbl;
            protoSelf.whatWillTotalHealthcareCostsBe_lbl = planSharedResourceStrings.WhatWillTotalHealthcareCostsBe_Lbl;
            protoSelf.howIsThisCalculated_lbl = planSharedResourceStrings.HowIsThisCalculated_Lbl;

            protoSelf.planDetailsHover_lbl = planSharedResourceStrings.PlanDetailsHoverLbl;
            protoSelf.cmsRating_lbl = planSharedResourceStrings.CmsRatingLbl;
            protoSelf.cmsRatingOutOf_lbl = planSharedResourceStrings.CmsRatingOutOfLbl;
            protoSelf.cmsRatingHoverBodySummary_lbl = planSharedResourceStrings.CmsRatingHoverBodySummaryLbl;
            protoSelf.cmsRatingDescriptions = planSharedResourceStrings.CmsRatingDescriptions;
            protoSelf.planIdText = planSharedResourceStrings.PlanIdText;
            protoSelf.remove_lbl = planSharedResourceStrings.RemoveLbl;
            protoSelf.premium_lbl = planSharedResourceStrings.PlanPremiumLbl;
            protoSelf.frequencyPremium_lbl = planSharedResourceStrings.FrequencyPremiumText;
            protoSelf.doctorFinder_lbl = planSharedResourceStrings.DoctorFinderLbl;
            protoSelf.doctorFinderNoLink_lbl = planSharedResourceStrings.DoctorFinderNoLinkLbl;
            protoSelf.doctorFinderHover_lbl = planSharedResourceStrings.DoctorFinderHoverText;
            protoSelf.areMyMedicinesCovered_lbl = planSharedResourceStrings.AreMyMedicinesCoveredLbl;
            protoSelf.areMyMedicinesCoveredHover_lbl = planSharedResourceStrings.AreMyMedicinesCoveredHoverText;
            protoSelf.moreOptions_lbl = planSharedResourceStrings.MoreOptionsLbl;
            protoSelf.moreOptsPlanDetails_lbl = planSharedResourceStrings.MoreOptsPlanDetailsLbl;
            protoSelf.moreOptsSave_lbl = planSharedResourceStrings.MoreOptsSaveLbl;
            protoSelf.moreOptsSaved_lbl = planSharedResourceStrings.MoreOptsSavedLbl;
            protoSelf.compare_lbl = planSharedResourceStrings.CompareLbl;
            protoSelf.inComparison_lbl = planSharedResourceStrings.InComparisonLbl;
            protoSelf.compareTrueHover_lbl = planSharedResourceStrings.CompareTrueHoverLbl;
            protoSelf.compareFalseHover_lbl = planSharedResourceStrings.CompareFalseHoverLbl;
            protoSelf.compareTooManyError_lbl = planSharedResourceStrings.CompareTooManyErrorLbl;
            protoSelf.attributeClickforInfo_lbl = planSharedResourceStrings.AttributeClickforInfoLbl;
            protoSelf.addToCartBtn_lbl = planSharedResourceStrings.AddToCartBtnLbl;
            protoSelf.inCartBtn_lbl = planSharedResourceStrings.InCartBtnLbl;
            protoSelf.addNotInCartHover_lbl = planSharedResourceStrings.AddNotInCartHoverLbl;
            protoSelf.addIsInCartHover_lbl = planSharedResourceStrings.AddIsInCartHoverLbl;
            protoSelf.includedInPlan_lbl = planSharedResourceStrings.IncludedInPlanLbl;

            protoSelf.coversMedical_lbl = planSharedResourceStrings.CoversMedicalLbl;
            protoSelf.coversPrescription_lbl = planSharedResourceStrings.CoversPrescriptionLbl;
            protoSelf.medical_lbl = planSharedResourceStrings.MedicalLbl;
            protoSelf.prescription_lbl = planSharedResourceStrings.PrescriptionLbl;
            protoSelf.optionalDental_lbl = planSharedResourceStrings.OptionalDentalLbl;
            protoSelf.optionalVision_lbl = planSharedResourceStrings.OptionalVisionLbl;
            protoSelf.coverageIncluded_lbl = planSharedResourceStrings.CoverageIncludedLbl;
            protoSelf.coverageAdditionalCost_lbl = planSharedResourceStrings.CoverageAdditionalCostLbl;
            protoSelf.clickForSupplementInfo_lbl = planSharedResourceStrings.ClickForSupplementInfoLbl;

            protoSelf.xofYCovered_lbl = planSharedResourceStrings.XofYCoveredLbl;
            protoSelf.medsCoveredCount_lbl = planSharedResourceStrings.MedsCoveredCountLbl;
            protoSelf.medsCoveredMoreInfo_lbl = planSharedResourceStrings.MedsCoveredMoreInfoLbl;
            protoSelf.medsCoveredMoreInfoHover_lbl = planSharedResourceStrings.MedsCoveredMoreInfoHoverLbl;


            protoSelf.findPlans_lbl = planSharedResourceStrings.FindPlansLbl;
            protoSelf.browseText_lbl = planSharedResourceStrings.BrowseTextLbl;
            protoSelf.noAttributeValue_lbl = planSharedResourceStrings.NoAttributeValueLbl;



            protoSelf.planPremiumFrequency_lbls = planSharedResourceStrings.PlanPremiumFrequencyLbls;
            protoSelf.planPremiumFrequencyAlternate_lbls = planSharedResourceStrings.PlanPremiumFrequencyAlternateLbls;
            protoSelf.supplementFrequency_lbls = planSharedResourceStrings.SupplementFrequencyLbls;
            protoSelf.supplementFrequencyAlternate_lbls = planSharedResourceStrings.SupplementFrequencyAlternateLbls;
            protoSelf.PriorYearPlan_Lbl = planSharedResourceStrings.PriorYearPlan_Lbl;

            protoSelf.physicianFinderNetwork = planSharedResourceStrings.PhysicianFinderNetwork;
            protoSelf.physicianUnknownNetwork = planSharedResourceStrings.PhysicianUnknownNetwork;
            protoSelf.physicianUnknownNetworkDesc = planSharedResourceStrings.PhysicianUnknownNetworkDesc;
            protoSelf.physicianNeedToUpdate = planSharedResourceStrings.PhysicianNeedToUpdate;
            protoSelf.physicianFinderLinkText = planSharedResourceStrings.PhysicianFinderLinkText;
            protoSelf.physicianFinderNoLinkText = planSharedResourceStrings.PhysicianFinderNoLinkText;
            protoSelf.physicianInNetwork = planSharedResourceStrings.PhysicianInNetwork;
            protoSelf.physicianOutOfNetwork = planSharedResourceStrings.PhysicianOutOfNetwork;

            protoSelf.dentalProvider_lbl = planSharedResourceStrings.DentalProvider_Lbl;
            protoSelf.visionProvider_lbl = planSharedResourceStrings.VisionProvider_Lbl;
            protoSelf.RecPlanTooltip = planSharedResourceStrings.RecPlanToolTipLbl;
            return protoSelf;
        };

    };

} (EXCHANGE, this));
