(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.MyMedicationViewModel = function MyMedicationViewModel() {
        if (!(this instanceof MyMedicationViewModel)) {
            return new MyMedicationViewModel();
        }
        var self = this;
        self.instructions_lbl = ko.observable("");
        self.searchPlaceholder_text = ko.observable("");
        self.added_msg = ko.observable("");

        self.lastAddedMed = ko.observable('');
        self.frequencyString = ko.observable("");

        self.hasExistingDosageError = ko.observable(false);
        self.existingDosageError_lbl = ko.observable("");
        self.errorTitle_lbl = ko.observable("");

        self.showEnterDosage = ko.observable(false);
        self.showEnterDrug = ko.observable(true);
        self.showGenericSwitch = ko.observable(false);

        self.noMedsFound_lbl = ko.observable("");
        self.invalidDrugFound_lbl = ko.observable("");
        self.showInvalidDrugMessage = ko.observable(false);

        self.drugs = ko.computed({
            read: function () {
                var drugs = [], userDrugs = app.user.UserSession.UserDrugs.drugs();
                for (var i = 0; i < userDrugs.length; i++) {
                    var drugVm = new ns.DrugViewModel().loadFromUserDrug(userDrugs[i]);
                    app.drugs.AllDrugViewModels.push(drugVm);
                    drugs.push(drugVm);
                }

                return drugs;
            },
            owner: this,
            deferEvaluation: true
        });

        self.loadedFromJson = false;

        self.formattedAdded_msg = ko.computed({
            read: function () {
                if (self.lastAddedMed().length === 0) {
                    return "";
                }
                else {
                    return self.added_msg().format(self.lastAddedMed());
                }
            },
            owner: this,
            deferEvaluation: true
        });

        MyMedicationViewModel.prototype.loadFromJSON = function loadFromJSON(meds) {
            var protoSelf = this;

            protoSelf.instructions_lbl(meds.Instructions_Lbl);
            protoSelf.searchPlaceholder_text(meds.SearchPlaceholder_Text);
            protoSelf.added_msg(meds.Added_Msg);
            protoSelf.frequencyString(meds.FrequencyString);
            protoSelf.existingDosageError_lbl(meds.ExistingDosageError_Lbl);
            protoSelf.errorTitle_lbl(meds.ErrorTitle_Lbl);
            protoSelf.noMedsFound_lbl(meds.NoMedsFound_Lbl);
            protoSelf.invalidDrugFound_lbl(meds.InvalidDrugFound_Lbl);

            return protoSelf;
        };
    };

} (EXCHANGE, this));

