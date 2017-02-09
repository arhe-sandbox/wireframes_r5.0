(function (app, global) {
    //"use strict";

    var ns = app.namespace("EXCHANGE.models");

    ns.RecSelectDoctorsViewModel = function RecSelectDoctorsViewModel() {
        if (!(this instanceof RecSelectDoctorsViewModel)) {
            return new RecSelectDoctorsViewModel();
        }
        var self = this;

        self.leftTitle_lbl = ko.observable('Select Doctor Preferences');
        self.leftDesc_lbl = ko.observable('Narrow the list to plans<br/>from doctors selected<br/>here.');
        self.selectAll_lbl = ko.observable('Select All');
        self.selectNone_lbl = ko.observable('Select None');
        self.cancelBtn_lbl = ko.observable('Cancel');
        self.okBtn_lbl = ko.observable('OK');
        self.hasErrors = ko.observable(false);
        self.noneSelectedText = ko.observable('All ({0})');
        self.someSelectedText = ko.observable('{0} selected');

        self.errorHdr_lbl = ko.observable('');
        self.errorDesc_lbl = ko.observable('');

        self.allDoctorsLists = ko.observableArray([]);
        self.activeDoctorsLists = ko.observableArray([]);
        self.savedDoctorsLists = ko.observableArray([]);

        self.allDoctorsCurrentTab = ko.computed({
            read: function () {
                var Doctors = self.allDoctorsLists(), currentTab = app.viewModels.RecResultsViewModel.currentTabIndex();
                if (Doctors.length <= currentTab) {
                    return [];
                }
                return Doctors[currentTab];
            },
            owner: this
        });

        self.activeDoctorsCurrentTab = ko.computed({
            read: function () {
                var Doctors = self.activeDoctorsLists(), currentTab = app.viewModels.RecResultsViewModel.currentTabIndex();
                if (Doctors.length <= currentTab) {
                    return [];
                }
                return Doctors[currentTab];
            },
            write: function (list) {
                self.activeDoctorsLists()[app.viewModels.RecResultsViewModel.currentTabIndex()](list);
            },
            owner: this
        });

        self.savedDoctorsCurrentTab = ko.computed({
            read: function () {
                var Doctors = self.savedDoctorsLists(), currentTab = app.viewModels.RecResultsViewModel.currentTabIndex();
                if (Doctors.length <= currentTab) {
                    return [];
                }
                return Doctors[currentTab];
            },
            write: function (list) {
                self.savedDoctorsLists()[app.viewModels.RecResultsViewModel.currentTabIndex()](list);
            },
            owner: this
        });

        self.dropdown_lbl = ko.computed(function () {
            if (app.viewModels.RecResultsViewModel.currentTabIndex() == app.enums.TabEnum.MEDICAREADVANTAGE) {
                if ($(".doctors")) {
                    $(".doctors").show();
                }
                if (typeof (self.activeDoctorsCurrentTab()) !== "function") {
                    return self.noneSelectedText().format(0);
                }
                if (self.activeDoctorsCurrentTab()().length > 0) {
                    return self.someSelectedText().format(self.activeDoctorsCurrentTab()().length);
                } else {
                    return self.noneSelectedText().format(self.allDoctorsCurrentTab()().length);
                }
            }
            else {
                if ($(".doctors")) {
                    $(".doctors").hide();
                }
            }
        });

        RecSelectDoctorsViewModel.prototype.saveCurrentDoctors = function saveCurrentDoctors() {
            var protoSelf = this;
            var Doctors = ko.utils.unwrapObservable(protoSelf.activeDoctorsCurrentTab()).slice();
            protoSelf.savedDoctorsCurrentTab(Doctors);

            return protoSelf;
        };

        RecSelectDoctorsViewModel.prototype.resetActiveDoctors = function resetActiveDoctors() {
            var protoSelf = this;
            var Doctors = ko.utils.unwrapObservable(protoSelf.savedDoctorsCurrentTab()).slice();

            protoSelf.activeDoctorsCurrentTab(Doctors);

            return protoSelf;
        };

        RecSelectDoctorsViewModel.prototype.selectAll_fnc = function () {
            var protoSelf = this;
            var allDoctors = [];
            var oldAll = protoSelf.allDoctorsLists()[app.viewModels.RecResultsViewModel.currentTabIndex()]();
            for (var i = 0; i < oldAll.length; i++) {
                allDoctors.push(oldAll[i].id());
            }
            protoSelf.activeDoctorsCurrentTab(allDoctors);
        };

        RecSelectDoctorsViewModel.prototype.selectNone_fnc = function () {
            var protoSelf = this;
            protoSelf.activeDoctorsCurrentTab([]);
        };

        RecSelectDoctorsViewModel.prototype.loadFromJSON = function loadFromJSON(doctorModel) {
            var protoSelf = this, medigapTabIndex = app.enums.TabEnum.MEDIGAP, prescriptionDrugTabIndex = app.enums.TabEnum.PRESCRIPTIONDRUG, medicareAdvantageTabIndex = app.enums.TabEnum.MEDICAREADVANTAGE,
                allInsuerersTempList = [], activeDoctorsTempList = [], savedDoctorsTempList = [];
            protoSelf.leftTitle_lbl(doctorModel.LeftTitle_Lbl);
            protoSelf.leftDesc_lbl(doctorModel.LeftDesc_Lbl);
            protoSelf.selectAll_lbl(doctorModel.SelectAll_Lbl);
            protoSelf.selectNone_lbl(doctorModel.SelectNone_Lbl);
            protoSelf.cancelBtn_lbl(doctorModel.CancelBtn_Lbl);
            protoSelf.okBtn_lbl(doctorModel.OkBtn_Lbl);

            protoSelf.errorHdr_lbl(doctorModel.ErrorHdr_Lbl);
            protoSelf.errorDesc_lbl(doctorModel.ErrorDesc_Lbl);

            //var length = doctorModel.AllDoctorsMedigap.length;
            //            var allDoctorsMedigap = [];
            //            for (var i = 0; i < length; i++) {
            //                allDoctorsMedigap.push(ns.DoctorViewModel().loadFromJSON(doctorModel.AllDoctorsMedigap[i], 'medigap', protoSelf));
            //            }
            //            allInsuerersTempList[medigapTabIndex] = ko.observableArray(allDoctorsMedigap);

            //            length = doctorModel.ActiveDoctorsMedigap.length;
            //            var activeDoctorsMedigap = [];
            //            for (i = 0; i < length; i++) {
            //                activeDoctorsMedigap.push(doctorModel.ActiveDoctorsMedigap[i].Id);
            //            }
            //            activeDoctorsTempList[medigapTabIndex] = ko.observableArray(activeDoctorsMedigap);
            //            savedDoctorsTempList[medigapTabIndex] = ko.observableArray([]);

            //            length = doctorModel.AllDoctorsPrescriptionDrug.length;
            //            var allDoctorsPrescriptionDrug = [];
            //            for (i = 0; i < length; i++) {
            //                allDoctorsPrescriptionDrug.push(ns.DoctorViewModel().loadFromJSON(doctorModel.AllDoctorsPrescriptionDrug[i], 'drugs', protoSelf));
            //            }
            //            allInsuerersTempList[prescriptionDrugTabIndex] = ko.observableArray(allDoctorsPrescriptionDrug);

            //            length = doctorModel.ActiveDoctorsPrescriptionDrug.length;
            //            var activeDoctorsPrescriptionDrug = [];
            //            for (i = 0; i < length; i++) {
            //                activeDoctorsPrescriptionDrug.push(doctorModel.ActiveDoctorsPrescriptionDrug[i].Id);
            //            }
            //            activeDoctorsTempList[prescriptionDrugTabIndex] = ko.observableArray(activeDoctorsPrescriptionDrug);
            //            savedDoctorsTempList[prescriptionDrugTabIndex] = ko.observableArray([]);

            var length = doctorModel.AllDoctorsMedicareAdvantage.length;
            var allDoctorsMedicareAdvantage = [];
            for (i = 0; i < length; i++) {
                allDoctorsMedicareAdvantage.push(ns.DoctorViewModel().loadFromJSON(doctorModel.AllDoctorsMedicareAdvantage[i], 'advantage', protoSelf));
            }
            allInsuerersTempList[medicareAdvantageTabIndex] = ko.observableArray(allDoctorsMedicareAdvantage);

            length = doctorModel.ActiveDoctorsMedicareAdvantage.length;
            var activeDoctorsMedicareAdvantage = [];
            for (i = 0; i < length; i++) {
                activeDoctorsMedicareAdvantage.push(doctorModel.ActiveDoctorsMedicareAdvantage[i].Id);
            }
            activeDoctorsTempList[medicareAdvantageTabIndex] = ko.observableArray(activeDoctorsMedicareAdvantage);
            savedDoctorsTempList[medicareAdvantageTabIndex] = ko.observableArray([]);

            protoSelf.allDoctorsLists(allInsuerersTempList);
            protoSelf.activeDoctorsLists(activeDoctorsTempList);
            protoSelf.savedDoctorsLists(savedDoctorsTempList);

            return protoSelf;
        };

        RecSelectDoctorsViewModel.prototype.updateFromSearchState = function updateFromSearchState(viewModel) {
            var protoSelf = this, medigapTabIndex = app.enums.TabEnum.MEDIGAP, prescriptionDrugTabIndex = app.enums.TabEnum.PRESCRIPTIONDRUG, medicareAdvantageTabIndex = app.enums.TabEnum.MEDICAREADVANTAGE;

            //            if (viewModel.SelectedDoctorsForTabs[medigapTabIndex]) {
            //                protoSelf.activeDoctorsLists()[medigapTabIndex](viewModel.SelectedDoctorsForTabs[medigapTabIndex]);
            //            }

            if (viewModel.SelectedDoctorsForTabs[medicareAdvantageTabIndex]) {
                protoSelf.activeDoctorsLists()[medicareAdvantageTabIndex](viewModel.SelectedDoctorsForTabs[medicareAdvantageTabIndex]);
            }

            //            if (viewModel.SelectedDoctorsForTabs[prescriptionDrugTabIndex]) {
            //                protoSelf.activeDoctorsLists()[prescriptionDrugTabIndex](viewModel.SelectedDoctorsForTabs[prescriptionDrugTabIndex]);
            //            }

            return protoSelf;
        };

    };
} (EXCHANGE, this));

(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.DoctorViewModel = function DoctorViewModel() {
        if (!(this instanceof DoctorViewModel)) {
            return new DoctorViewModel();
        }
        this._self = this;
        var self = this._self;

        self.id = ko.observable('aetna');
        self.name = ko.observable('Aetna Medicare CVS');
        self.radioId = ko.observable('aetnamedigap');
        self.parent = ko.observable();

        self.checked = ko.computed({
            read: function () {
                if (self.parent() && self.parent().activeDoctorsCurrentTab()) {
                    return self.parent().activeDoctorsCurrentTab().indexOf(self.id()) != -1;
                }
            },
            write: function (val) {
            }
        });

        self.setChecked = ko.computed({
            read: function () {
            },
            write: function (val) {
                if (self.parent() && self.parent().activeDoctorsCurrentTab()) {
                    var index = self.parent().activeDoctorsCurrentTab().indexOf(val.id());
                    if (index != -1) {
                        self.parent().activeDoctorsCurrentTab().splice(index, 1);
                    } else {
                        self.parent().activeDoctorsCurrentTab().push(val.id());
                    }
                }
            }
        });

        DoctorViewModel.prototype.loadFromJSON = function loadFromJSON(doctorModel, type, parent) {
            var protoSelf = this;
            protoSelf.id(doctorModel.Id);
            protoSelf.name("Dr. " + ((doctorModel.FirstName==null || doctorModel.FirstName == undefined)?"":doctorModel.FirstName) + " " + 
            ((doctorModel.LastName == null || doctorModel.LastName== undefined)?"":doctorModel.LastName));
            protoSelf.radioId(doctorModel.Id + type);
            protoSelf.parent(parent);
            return protoSelf;
        };
    };

} (EXCHANGE));
