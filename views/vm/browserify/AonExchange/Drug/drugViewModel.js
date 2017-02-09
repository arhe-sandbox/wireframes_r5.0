(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.DrugViewModel = function DrugViewModel() {
        if (!(this instanceof DrugViewModel)) {
            return new DrugViewModel();
        }
        var self = this;
        self.id = ko.observable("");
        self.name = ko.observable("");
        self.dosage = ko.observable(0),
        self.refillQuantity = ko.observable("");
        self.refillFrequency = ko.observable(0);
        self.userDrug = ko.observable({});
        self.genericAvailable = ko.observable("");

        self.formattedFrequency = ko.computed({
            read: function () {
                if (self.refillFrequency() > 1) {
                    return app.viewModels.MyMedicationViewModel.frequencyString().format(self.refillFrequency() + " ") + "s";
                } else {
                    return app.viewModels.MyMedicationViewModel.frequencyString().format("");
                }
            },
            owner: this,
            deferEvaluation: true
        });

        self.formattedRefill = ko.computed({
            read: function () {
                return self.refillQuantity(); // +" " + self.refillUnits(); //if we end up getting this from dynamics at some point
            },
            owner: this,
            deferEvaluation: true
        });

        self.formattedGenericAvailable = ko.computed({
            read: function () {
                if (self.genericAvailable() == undefined || self.genericAvailable() == null) {
                    return "-";
                } else if (self.genericAvailable() == true) {
                    return "Yes";
                }
                else if (self.genericAvailable() == false) {
                    return "No";
                }
            },
            owner: this,
            deferEvaluation: true
        });

        DrugViewModel.prototype.loadFromUserDrug = function loadFromUserDrug(userDrug) {
            var protoSelf = this;
            protoSelf.id(userDrug.SelectedDosage.Id);
            protoSelf.name(userDrug.Drug.Name);
            protoSelf.dosage(userDrug.SelectedDosage.Name);
            protoSelf.refillQuantity(userDrug.RefillQuantity);
            protoSelf.refillFrequency(userDrug.RefillOccurance);
            protoSelf.genericAvailable(userDrug.IsGenericAvailable);

            protoSelf.userDrug(userDrug);
            return protoSelf;
        };

        DrugViewModel.prototype.removeMedication = function removeMedication(sender, event) {
            EXCHANGE.ButtonSpinner = $(event.target).ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.SMALLLIGHTGRAY });
            var protoSelf = this;
            var userDrugs = app.user.UserSession.UserDrugs.drugs();
            for (var i = 0; i < userDrugs.length; i++) {
                if (userDrugs[i].Drug.Name == protoSelf.name()) {
                    app.drugs.DrugAPI.removeDrugFromMedCabinet(userDrugs[i]);
                    break;
                }
            }

            return protoSelf;
        };
    };

} (EXCHANGE, this));

(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.PlanDrugViewModel = function PlanDrugViewModel(planDrug, maxDrugTier) {
        if (!(this instanceof PlanDrugViewModel)) {
            return new PlanDrugViewModel(planDrug, maxDrugTier);
        }
        var self = this;

        self.maxDrugTier = ko.observable(maxDrugTier);
        self.drugVm = ko.computed({
            read: function () {
                var drugs = app.user.UserSession.UserDrugs.drugs();
                var drug = new ns.DrugViewModel();
                if(!planDrug.DrugId) return drug;
                for(var i = 0; i < drugs.length; i++) {
                    if(drugs[i].SelectedDosage.Id == planDrug.DosageId) {
                        var userDrug = drugs[i];
                        return drug.loadFromUserDrug(userDrug);
                    }
                }
                return drug;
            },
            owner: this,
            deferEvaluation: true
        });

        self.showNotCovered = ko.computed({
            read: function () {
                return self.tier() == 0;
            },
            owner: this,
            deferEvaluation: true
        });

        self.notCoveredText = ko.observable('Not Covered');

        self.tier = ko.observable(planDrug.Tier);
        self.hasPriorAuthorization= ko.observable(planDrug.HasPriorAuthorization);
        self.hasQuantityLimit= ko.observable(planDrug.HasQuantityLimit);
        self.hasStepTherapy= ko.observable(planDrug.HasStepTherapy);
        self.quantityLimitAmount = ko.observable(planDrug.QuantityLimitAmount);
        self.quantityLimitDays= ko.observable(planDrug.QuantityLimitDays);
        self.quantityLimitDescription= ko.observable(planDrug.QuantityLimitDescription);
        self.quantityLimitToolTip = ko.computed({
            read: function () {
                String.format(EXCHANGE.viewModels.ComparePlansViewModel.quantityLimitDesc_Lbl(),self.quantityLimitDescription(),self.quantityLimitDays(),self.quantityLimitAmount())
            },
            owner: this,
            deferEvaluation: true
        });

         self.hasRestrictions = ko.computed({
            read: function () {
                return (self.hasPriorAuthorization() || self.hasQuantityLimit() || self.hasStepTherapy() );
            },
            owner: this,
            deferEvaluation: true
        });

        return self;
    };

} (EXCHANGE, this));
