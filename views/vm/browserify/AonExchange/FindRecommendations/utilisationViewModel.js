(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.UtilisationViewModel = function UtilisationViewModel() {
        if (!(this instanceof UtilisationViewModel)) {
            return new UtilisationViewModel();
        }
        var self = this;

        self.validationMessage = ko.observable('');
        self.SavedMessage = ko.observable();
        self.primaryCareList = ko.observableArray();
        self.specialistVisitList = ko.observableArray();
        self.hospitalVisitList = ko.observableArray();
        self.primaryCare_boundToSelectValue = ko.observable('');
        self.specialistVisit_boundToSelectValue = ko.observable('');
        self.hospitalVisit_boundToSelectValue = ko.observable('');

        self.hospitalVisitQuestion_lbl = ko.observable('');
        self.primaryCareQuestion_lbl = ko.observable('');
        self.specialistVisitQuestion_lbl = ko.observable('');

        self.PlanPrefrences_lbl = ko.observable('');
        self.PharmacyQuestion_lbl = ko.observable('');
        self.PlanPrefrencesDesc_lbl = ko.observable('');
        self.PlanPrefrencesHelpBestFit_lbl = ko.observable('');
        self.PlanPrefrencesInsuranceApproaches_lbl = ko.observable('');
        self.PlanPrefrencesFirstApproach_lbl = ko.observable('');
        self.PlanPrefrencesSecondApproach_lbl = ko.observable('');
        self.PlanPrefrencesPreferApproach_lbl = ko.observable('');
        self.PlanPrefrencesLowestCost_lbl = ko.observable('');
        self.PlanPrefrencesPotentiallyHigher_lbl = ko.observable('');
        self.PreferApproachValidationMessage_lbl = ko.observable('');
        self.planPreference_selectedValue = ko.observable('');
        self.pharmacyPreference_selectedValue = ko.observable('');
        self.planPrefernce_radioList = ko.observableArray([]);
        self.pharmacyPreference_RadioList = ko.observableArray([]);
        
        UtilisationViewModel.prototype.loadFromJSON = function loadFromJSON(serverViewModel) {
            var protoself = this;
            return protoself;
        };

        UtilisationViewModel.prototype.loadUtilizationDefaults = function loadUtilizationDefaults(serverViewModel) {
            var protoself = this;

            protoself.primaryCareList(serverViewModel.PrimaryCarePhysician);
            protoself.specialistVisitList(serverViewModel.SpecialistVisit);
            protoself.hospitalVisitList(serverViewModel.HospitalVisit);
            protoself.primaryCare_boundToSelectValue(serverViewModel.SelectedPrimaryCarePhysician);
            protoself.specialistVisit_boundToSelectValue(serverViewModel.SelectedSpecialistVisit);
            protoself.hospitalVisit_boundToSelectValue(serverViewModel.SelectedHospitalVisit);

            protoself.hospitalVisitQuestion_lbl(serverViewModel.HospitalVisitQuestion_lbl);
            protoself.primaryCareQuestion_lbl(serverViewModel.PrimaryCareQuestion_lbl);
            protoself.specialistVisitQuestion_lbl(serverViewModel.SpecialistVisitQuestion_lbl);
      
            protoself.PlanPrefrences_lbl(serverViewModel.PlanPrefrences_lbl);
            protoself.PharmacyQuestion_lbl(serverViewModel.PharmacyQuestion_lbl);
            protoself.PlanPrefrencesDesc_lbl(serverViewModel.PlanPrefrencesDesc_lbl);
            protoself.PlanPrefrencesHelpBestFit_lbl(serverViewModel.PlanPrefrencesHelpBestFit_lbl);
            protoself.PlanPrefrencesInsuranceApproaches_lbl(serverViewModel.PlanPrefrencesInsuranceApproaches_lbl);
            protoself.PlanPrefrencesFirstApproach_lbl(serverViewModel.PlanPrefrencesFirstApproach_lbl);
            protoself.PlanPrefrencesSecondApproach_lbl(serverViewModel.PlanPrefrencesSecondApproach_lbl);
            protoself.PlanPrefrencesPreferApproach_lbl(serverViewModel.PlanPrefrencesPreferApproach_lbl);
            protoself.PlanPrefrencesLowestCost_lbl(serverViewModel.PlanPrefrencesLowestCost_lbl);
            protoself.PlanPrefrencesPotentiallyHigher_lbl(serverViewModel.PlanPrefrencesPotentiallyHigher_lbl);
            protoself.PreferApproachValidationMessage_lbl(serverViewModel.PreferApproachValidationMessage_lbl);
            protoself.planPreference_selectedValue(serverViewModel.SelectedPlanPreference);
            protoself.pharmacyPreference_selectedValue(serverViewModel.SelectedPharmacyPreference);
            protoself.planPrefernce_radioList(serverViewModel.lstPlanPreferenceQues);
            protoself.pharmacyPreference_RadioList(serverViewModel.lstPharmacyPreference);


            return protoself;
        };
    };

} (EXCHANGE, this));


