(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.EnterDosageViewModel = function EnterDosageViewModel() {
        if (!(this instanceof EnterDosageViewModel)) {
            return new EnterDosageViewModel();
        }
        var self = this;
        self.dosageFieldName = ko.observable("");
        self.packageFieldName = ko.observable("");
        self.quantityFieldName = ko.observable("");
        self.frequencyFieldName = ko.observable("");
        self.inlineErrorRequired = ko.observable("");
        self.inlineErrorNumber = ko.observable("");
        self.inlineErrorMaxNumber = ko.observable("{0}");
        self.inlineErrorsExist = ko.observable(false);
        self.inlineErrors = ko.observableArray([]);
        self.inlineErrorsWereSorry_lbl = ko.observable('');
        self.inlineErrorsBody_lbl = ko.observable('');
        self.inlineErrorFields = ko.observableArray([]);
        self.dosageQuestion = ko.observable("");
        self.packageQuestion = ko.observable("");
        self.dosage_radio = ko.observable("");
        self.dosage_radio.subscribe(function (newValue) {
            var dosages = self.drug().Dosages, selectedDosage;
            for (var i = 0; i < dosages.length; i++) {
                if (dosages[i].Id === newValue) {
                    selectedDosage = dosages[i];
                    break;
                }
            }
            if (selectedDosage) {

                self.quantity_tb(selectedDosage.DefaultQuantity);
                var refillOptions = self.frequency_options();
                for (var i = 0; i < refillOptions.length; i++) {
                    if (refillOptions[i].Option_Value === selectedDosage.DefaultOccurance) {
                        self.frequency_radio(refillOptions[i].Option_Id);
                        break;
                    }
                }

            }
        });
        self.package_radio = ko.observable("");

        self.quantityQuestion = ko.observable("");
        self.packageQuantityQuestion = ko.observable("");
        self.quantity_tb = ko.observable("");

        self.frequencyQuestion = ko.observable("");
        self.frequency_radio = ko.observable("");
        self.frequency_tb = ko.observable("");
        self.frequency_options = ko.observableArray([]);

        self.pharmacyQuestion = ko.observable("");
        self.pharmacy_retail = ko.observable("");
        self.pharmacy_mail = ko.observable("");
        self.pharmacy_radio = ko.observable("retailPharmacy");

        self.cancel_lbl = ko.observable("");
        self.add_lbl = ko.observable("");
        self.save_lbl = ko.observable("");
        self.refillEvery_lbl = ko.observable("");
        self.days_lbl = ko.observable("");
        self.userDrugIdToChage = ko.observable("");
        self.addBtn_formatted = ko.computed({
            read: function () {
                if (self.isExisting()) {
                    return self.save_lbl();
                }
                return self.add_lbl();
            },
            owner: this,
            deferEvaluation: true
        });

        self.hide = function () {
            app.viewModels.MyMedicationViewModel.showEnterDosage(false);
            app.viewModels.MyMedicationViewModel.showEnterDrug(true);
            self.dosage_radio("");
            self.package_radio("");
            self.showHidePackages(false);
            self.quantity_tb("");
            self.frequency_tb("");
            self.frequency_radio("");
            self.isExisting(false);
            self.drug({});
           
            var obj = $('#help-me-choose-popup').parent();
            var obj_h = $('#help-me-choose-popup').outerHeight();
            var max_top = EXCHANGE.functions.getScrollTop();

            $('#helpMeChooseOkayButton').show();
           
            return false;
        };
        self.showHidePackages = ko.observable(false);
        self.hidePackagesQuantity = ko.observable(true);

        self.drug = ko.observable({});
        self.isExisting = ko.observable(false);

        self.get_packages = ko.computed({
            read: function () {
                //gets packages collection for currently selected dosage
                var dosages = self.drug().Dosages, selectedDosage;
                var pkg = {};
                pkg.package_radio = "";
                pkg.packages = {};
                pkg.packages.length = 0;

                if (dosages !== null && dosages !== undefined) {
                    for (var i = 0; i < dosages.length; i++) {
                        if (self.dosage_radio() === "" && dosages[i].IsDefaultDosage) {
                            //  self.dosage_radio(dosages[i].Id);
                        }
                        if (dosages[i].Id === self.dosage_radio() && dosages[i].Packages !== undefined && dosages[i].Packages !== null) {
                            pkg.packages = dosages[i].Packages;
                            break;
                        }
                    } // end dosage loop
                }
                else {
                    self.package_radio("");
                    self.showHidePackages(false);
                    self.hidePackagesQuantity(true);
                }

                if (pkg.packages.length > 0) {
                    var radio_index = false;
                    for (var k = 0; k < pkg.packages.length; k++) { if (self.package_radio() === pkg.packages[k].Id) break; else radio_index = radio_index + 1; }
                    if (radio_index == pkg.packages.length) self.package_radio("");

                    for (var j = 0; j < pkg.packages.length; j++) {
                        if (self.package_radio() !== "")
                            break;
                        if (self.package_radio() === pkg.packages[j].Id) {
                            pkg.package_radio = pkg.packages[j].Id;
                            break;
                        }
                        if (pkg.packages[j].IsDefaultPackage === true) {
                            pkg.package_radio = pkg.packages[j].Id;
                            self.package_radio(pkg.packages[j].Id);
                        }
                    }
                    self.showHidePackages(true);
                    self.hidePackagesQuantity(false);
                }
                else {
                    self.showHidePackages(false);
                    self.hidePackagesQuantity(true);
                }

                return pkg;

            },
            owner: this
        });

        EnterDosageViewModel.prototype.loadFromJSON = function loadFromJSON(dosage) {
            var protoSelf = this;
            protoSelf.dosageFieldName(dosage.DosageFieldName);
            protoSelf.packageFieldName(dosage.PackageFieldName);
            protoSelf.quantityFieldName(dosage.QuantityFieldName);
            protoSelf.frequencyFieldName(dosage.FrequencyFieldName);
            protoSelf.inlineErrorRequired(dosage.InlineErrorRequired);
            protoSelf.inlineErrorNumber(dosage.InlineErrorNumber);
            protoSelf.inlineErrorMaxNumber(dosage.InlineErrorMaxNumber);
            protoSelf.inlineErrorsWereSorry_lbl(dosage.InlineErrorsWereSorry_Lbl);
            protoSelf.inlineErrorsBody_lbl(dosage.InlineErrorsBody_Lbl);
            protoSelf.dosageQuestion(dosage.DosageQuestion);
            protoSelf.packageQuestion(dosage.PackageQuestion);
            protoSelf.quantityQuestion(dosage.QuantityQuestion);
            protoSelf.packageQuantityQuestion(dosage.PackageQuantityQuestion);
            protoSelf.frequencyQuestion(dosage.FrequencyQuestion);
            protoSelf.frequency_options(dosage.Frequency_Options);
            protoSelf.pharmacyQuestion(dosage.PharmacyQuestion);
            protoSelf.pharmacy_retail(dosage.PharmacyRetail);
            protoSelf.pharmacy_mail(dosage.PharmacyMail);
            protoSelf.cancel_lbl(dosage.Cancel_Lbl);
            protoSelf.add_lbl(dosage.Add_Lbl);
            protoSelf.save_lbl(dosage.Save_Lbl);
            protoSelf.refillEvery_lbl(dosage.RefillEvery_Lbl);
            protoSelf.days_lbl(dosage.Days_Lbl);
            return protoSelf;
        };

        EnterDosageViewModel.prototype.loadFromUserDrug = function loadFromUserDrug(userDrug) {
            var protoSelf = this;
            protoSelf.showHidePackages(false);
            protoSelf.hidePackagesQuantity(true);
            protoSelf.dosage_radio(userDrug.SelectedDosage.Id);
            if (userDrug.SelectedPackage !== null)
                protoSelf.package_radio(userDrug.SelectedPackage.Id);
            var refillOptions = protoSelf.frequency_options(), found = false;
            for (var i = 0; i < refillOptions.length; i++) {
                if (refillOptions[i].Option_Value === userDrug.RefillOccurance) {
                    protoSelf.frequency_radio(refillOptions[i].Option_Id);
                    found = true;
                    break;
                }
            }
            if (!found) {
                protoSelf.frequency_tb(userDrug.RefillOccurance);
            }
            if (userDrug.PharmacyType == app.enums.PharmacyType.MailOrder) {
                protoSelf.pharmacy_radio('mailPharmacy');
            } else {
                protoSelf.pharmacy_radio('retailPharmacy');
            }
            $('.pharmacy-radio').trigger('updateState');

            protoSelf.quantity_tb(userDrug.RefillQuantity);
        };

        EnterDosageViewModel.prototype.getUserDrug = function getUserDrug() {
            var protoSelf = this;
            var userDrug = {};
            userDrug.Drug = protoSelf.drug();

            var dosages = protoSelf.drug().Dosages, selectedDosage;
            var selectedPackage;

            for (var i = 0; i < dosages.length; i++) {
                if (dosages[i].Id === protoSelf.dosage_radio()) {
                    selectedDosage = dosages[i];
                    var packages = dosages[i].Packages === undefined || dosages[i].Packages === null ? { length: 0} : dosages[i].Packages;
                    for (var k = 0; k < packages.length; k++) {
                        if (dosages[i].Packages[k].Id === protoSelf.package_radio()) {
                            selectedPackage = dosages[i].Packages[k];
                        }
                    }
                    break;
                }
            }
            if (selectedDosage) {
                userDrug.SelectedDosage = selectedDosage;
                if (selectedPackage) {
                    userDrug.SelectedPackage = selectedPackage;
                }
            }
            else {
                protoSelf.inlineErrorsExist(true);
                protoSelf.inlineErrors.push(protoSelf.inlineErrorRequired().format(protoSelf.dosageFieldName()));
                protoSelf.inlineErrorFields.push("dosage-field");
            }
            if (protoSelf.isExisting()) {
                userDrug.Id = protoSelf.userDrugIdToChage();
            }

            userDrug.RefillQuantity = protoSelf.quantity_tb();
            if (userDrug.RefillQuantity.length == 0) {
                protoSelf.inlineErrorsExist(true);
                protoSelf.inlineErrors.push(protoSelf.inlineErrorRequired().format(protoSelf.quantityFieldName()));
                protoSelf.inlineErrorFields.push("quantity-field");
            }
            else if (isNaN(userDrug.RefillQuantity)) {
                protoSelf.inlineErrorsExist(true);
                protoSelf.inlineErrors.push(protoSelf.inlineErrorNumber().format(protoSelf.quantityFieldName()));
                protoSelf.inlineErrorFields.push("quantity-field");
            }
            else if (+userDrug.RefillQuantity > 999999999) {
                protoSelf.inlineErrorsExist(true);
                protoSelf.inlineErrors.push(protoSelf.inlineErrorMaxNumber().format(protoSelf.quantityFieldName()));
                protoSelf.inlineErrorFields.push("quantity-field");
            }

            var refillOptions = protoSelf.frequency_options(), refillOccurance;
            for (var i = 0; i < refillOptions.length; i++) {
                if (refillOptions[i].Option_Id === protoSelf.frequency_radio()) {
                    refillOccurance = refillOptions[i].Option_Value;
                    break;
                }
            }
            if (refillOccurance) {
                userDrug.RefillOccurance = refillOccurance;
            }
            else {
                userDrug.RefillOccurance = protoSelf.frequency_tb();
                if (userDrug.RefillOccurance.length == 0) {
                    protoSelf.inlineErrorsExist(true);
                    protoSelf.inlineErrors.push(protoSelf.inlineErrorRequired().format(protoSelf.frequencyFieldName()));
                    protoSelf.inlineErrorFields.push("frequency-field");
                }
                else if (isNaN(userDrug.RefillOccurance)) {
                    protoSelf.inlineErrorsExist(true);
                    protoSelf.inlineErrors.push(protoSelf.inlineErrorNumber().format(protoSelf.frequencyFieldName()));
                    protoSelf.inlineErrorFields.push("frequency-field");
                }
                else if (+userDrug.RefillOccurance > 999999999) {
                    protoSelf.inlineErrorsExist(true);
                    protoSelf.inlineErrors.push(protoSelf.inlineErrorMaxNumber().format(protoSelf.frequencyFieldName()));
                    protoSelf.inlineErrorFields.push("frequency-field");
                }
            }

            if (protoSelf.inlineErrorsExist()) {
                return false;
            }

            var pharmacyType = protoSelf.pharmacy_radio();
            if (pharmacyType == "mailPharmacy") {
                userDrug.PharmacyType = app.enums.PharmacyType.MailOrder;
            } else {
                userDrug.PharmacyType = app.enums.PharmacyType.Retail;
            }

            return userDrug;
        };

        return self;
    };

} (EXCHANGE, this));
