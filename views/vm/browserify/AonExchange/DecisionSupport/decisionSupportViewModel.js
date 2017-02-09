(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.DecisionSupportViewModel = function DecisionSupportViewModel() {
        if (!(this instanceof DecisionSupportViewModel)) {
            return new DecisionSupportViewModel();
        }
        var self = this;

        self.topLeftTitle_lbl = ko.observable('');
        self.topLeftInstructions_lbl = ko.observable('');
        self.medCabinet_lbl = ko.observable('');

        self.myCoverageHdr_lbl = ko.observable('');
        self.myCoverageDesc_lbl = ko.observable('');

        self.myMedicationsHdr_lbl = ko.observable('');
        self.myMedicationsDesc_lbl = ko.observable('');

        self.accountHdr_lbl = ko.observable('');
        self.accountDesc_lbl = ko.observable('');
        self.accountDescLoggedIn_lbl = ko.observable('');
        self.bottomMidInstructions_lbl = ko.observable('');

        self.cancelBtn_lbl = ko.observable('');
        self.goBackBtn_lbl = ko.observable('');
        self.continueBtn_lbl = ko.observable('');
        self.okBtn_lbl = ko.observable('');

        self.old_answers = null;

        self.loadedFromJson = false;
        self.currentTab = ko.observable('coverage');

        self.wasPharmacyLightboxOpen = false;
        self.drugsOnLightboxOpen = ko.observableArray([]);
        self.shouldOpenPharmacyLightbox = ko.computed({
            read: function () {
                var shouldShow = false;
                if (EXCHANGE.viewModels.MyDrugsVM != undefined) {
                    shouldShow = false;
                }
                else{
                    if (app.user.UserSession && app.user.UserSession.UserDrugs && app.user.UserSession.UserDrugs.drugs && self.drugsOnLightboxOpen) {
                        if (app.user.UserSession.UserDrugs.drugs().length == 0) {
                            shouldShow = false;
                        } else if (app.user.UserSession.UserDrugs.drugs().length == self.drugsOnLightboxOpen().length) {
                            $.each(app.user.UserSession.UserDrugs.drugs(), function (index, item) {
                                var previousDrug = self.drugsOnLightboxOpen()[index];
                                var drug = item;

                                if (drug.Id != previousDrug.Id || drug.RefillQuantity != previousDrug.RefillQuantity
                                    || drug.RefillOccurance != previousDrug.RefillOccurance || drug.Drug.Id != previousDrug.Drug.Id
                                        || drug.SelectedDosage.Id != previousDrug.SelectedDosage.Id) {
                                    shouldShow = true;
                                    return false;
                                }

                                if ((drug.SelectedPackage == null && previousDrug.SelectedPackage != null) || (drug.SelectedPackage != null && previousDrug.SelectedPackage == null)) {
                                    shouldShow = true;
                                    return false;
                                }

                                if (drug.SelectedPackage != null && previousDrug.SelectedPackage != null && drug.SelectedPackage.Id != previousDrug.SelectedPackage.Id) {
                                    shouldShow = true;
                                    return false;
                                }
                            });
                        } else {
                            shouldShow = true;
                        }
                    } else {
                        shouldShow = true;
                    }
                }

                return shouldShow;
            },
            owner: this,
            deferEvaluation: true
        });

        DecisionSupportViewModel.prototype.loadFromJSON = function loadFromJSON(helpChoose) {
            var protoSelf = this;

            protoSelf.topLeftTitle_lbl(helpChoose.TopLeftTitle_Lbl);
            protoSelf.topLeftInstructions_lbl(helpChoose.TopLeftInstructions_Lbl);
            protoSelf.medCabinet_lbl(helpChoose.MedCabinet_Lbl);

            protoSelf.myCoverageHdr_lbl(helpChoose.MyCoverageHdr_Lbl);
            protoSelf.myCoverageDesc_lbl(helpChoose.MyCoverageDesc_Lbl);

            protoSelf.myMedicationsHdr_lbl(helpChoose.MyMedicationsHdr_Lbl);
            protoSelf.myMedicationsDesc_lbl(helpChoose.MyMedicationsDesc_Lbl);

            protoSelf.accountHdr_lbl(helpChoose.AccountHdr_Lbl);
            protoSelf.accountDesc_lbl(helpChoose.AccountDesc_Lbl);
            protoSelf.accountDescLoggedIn_lbl(helpChoose.AccountDescLoggedIn_Lbl);
            protoSelf.bottomMidInstructions_lbl(helpChoose.BottomMidInstructions_Lbl);

            protoSelf.cancelBtn_lbl(helpChoose.CancelBtn_Lbl);
            protoSelf.goBackBtn_lbl(helpChoose.GoBackBtn_Lbl);
            protoSelf.continueBtn_lbl(helpChoose.ContinueBtn_Lbl);
            protoSelf.okBtn_lbl(helpChoose.OkBtn_Lbl);
            return protoSelf;
        };
    };

} (EXCHANGE, this));
