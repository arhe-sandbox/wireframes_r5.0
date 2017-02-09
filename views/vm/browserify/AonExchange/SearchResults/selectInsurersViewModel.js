(function (app, global) {
    //"use strict";

    var ns = app.namespace("EXCHANGE.models");

    ns.SelectInsurersViewModel = function SelectInsurersViewModel() {
        if (!(this instanceof SelectInsurersViewModel)) {
            return new SelectInsurersViewModel();
        }
        var self = this;

        self.leftTitle_lbl = ko.observable('Select Insurers');
        self.leftDesc_lbl = ko.observable('Narrow the list to plans<br/>from companies selected<br/>here.');
        self.selectAll_lbl = ko.observable('Select All');
        self.selectNone_lbl = ko.observable('Select None');
        self.cancelBtn_lbl = ko.observable('Cancel');
        self.okBtn_lbl = ko.observable('OK');
        self.hasErrors = ko.observable(false);
        self.noneSelectedText = ko.observable('All ({0})');
        self.someSelectedText = ko.observable('{0} selected');

        self.errorHdr_lbl = ko.observable('');
        self.errorDesc_lbl = ko.observable('');

        self.allInsurersLists = ko.observableArray([]);
        self.activeInsurersLists = ko.observableArray([]);
        self.savedInsurersLists = ko.observableArray([]);

        self.allInsurersCurrentTab = ko.computed({
            read: function () {
                if (app.viewModels.SearchResultsViewModel) {
                    var insurers = self.allInsurersLists(), currentTab = app.viewModels.SearchResultsViewModel.currentTabIndex();
                    if (insurers.length <= currentTab) {
                        return [];
                    }
                    return insurers[currentTab];
                }
                return '';
            },
            owner: this
        });

        self.activeInsurersCurrentTab = ko.computed({
            read: function () {
                if (app.viewModels.SearchResultsViewModel) {
                    var insurers = self.activeInsurersLists(), currentTab = app.viewModels.SearchResultsViewModel.currentTabIndex();
                    if (insurers.length <= currentTab) {
                        return [];
                    }
                    return insurers[currentTab];
                }
                return '';
            },
            write: function (list) {
                self.activeInsurersLists()[app.viewModels.SearchResultsViewModel.currentTabIndex()](list);
            },
            owner: this
        });

        self.savedInsurersCurrentTab = ko.computed({
            read: function () {
                if (app.viewModels.SearchResultsViewModel) {
                    var insurers = self.savedInsurersLists(), currentTab = app.viewModels.SearchResultsViewModel.currentTabIndex();
                    if (insurers.length <= currentTab) {
                        return [];
                    }
                    return insurers[currentTab];
                } else if (EXCHANGE.models.AncSearchResultsViewModel !== null) {
                    var i = 0;
                }
                return '';
            },
            write: function (list) {
                self.savedInsurersLists()[app.viewModels.SearchResultsViewModel.currentTabIndex()](list);
            },
            owner: this
        });

        self.dropdown_lbl = ko.computed(function () {
            if (app.viewModels.SearchResultsViewModel !== null) {
                if (typeof (self.activeInsurersCurrentTab()) !== "function") {
                    return self.noneSelectedText().format(0);
                }
                if (self.activeInsurersCurrentTab()().length > 0) {
                    return self.someSelectedText().format(self.activeInsurersCurrentTab()().length);
                } else {
                    return self.noneSelectedText().format(self.allInsurersCurrentTab()().length);
                }
            }
            return '';
        });

        SelectInsurersViewModel.prototype.saveCurrentInsurers = function saveCurrentInsurers() {
            var protoSelf = this;
            var insurers = ko.utils.unwrapObservable(protoSelf.activeInsurersCurrentTab()).slice();
            protoSelf.savedInsurersCurrentTab(insurers);

            return protoSelf;
        };

        SelectInsurersViewModel.prototype.resetActiveInsurers = function resetActiveInsurers() {
            var protoSelf = this;
            var insurers = ko.utils.unwrapObservable(protoSelf.savedInsurersCurrentTab()).slice();
            
            protoSelf.activeInsurersCurrentTab(insurers);

            return protoSelf;
        };

        SelectInsurersViewModel.prototype.selectAll_fnc = function () {
            var protoSelf = this;
            var allInsurers = [];
            var oldAll = protoSelf.allInsurersLists()[app.viewModels.SearchResultsViewModel.currentTabIndex()]();
            for (var i = 0; i < oldAll.length; i++) {
                allInsurers.push(oldAll[i].id());
            }
            protoSelf.activeInsurersCurrentTab(allInsurers);
        };

        SelectInsurersViewModel.prototype.selectNone_fnc = function () {
            var protoSelf = this;
            protoSelf.activeInsurersCurrentTab([]);
        };

        SelectInsurersViewModel.prototype.loadFromJSON = function loadFromJSON(insurerModel) {
            var protoSelf = this, medigapTabIndex = app.enums.TabEnum.MEDIGAP, prescriptionDrugTabIndex = app.enums.TabEnum.PRESCRIPTIONDRUG, medicareAdvantageTabIndex = app.enums.TabEnum.MEDICAREADVANTAGE,
                allInsuerersTempList = [], activeInsurersTempList = [], savedInsurersTempList = [];
            protoSelf.leftTitle_lbl(insurerModel.LeftTitle_Lbl);
            protoSelf.leftDesc_lbl(insurerModel.LeftDesc_Lbl);
            protoSelf.selectAll_lbl(insurerModel.SelectAll_Lbl);
            protoSelf.selectNone_lbl(insurerModel.SelectNone_Lbl);
            protoSelf.cancelBtn_lbl(insurerModel.CancelBtn_Lbl);
            protoSelf.okBtn_lbl(insurerModel.OkBtn_Lbl);

            protoSelf.errorHdr_lbl(insurerModel.ErrorHdr_Lbl);
            protoSelf.errorDesc_lbl(insurerModel.ErrorDesc_Lbl);

            var length = insurerModel.AllInsurersMedigap.length;
            var allInsurersMedigap = [];
            for (var i = 0; i < length; i++) {
                allInsurersMedigap.push(ns.InsurerViewModel().loadFromJSON(insurerModel.AllInsurersMedigap[i], 'medigap', protoSelf));
            }
            allInsuerersTempList[medigapTabIndex] = ko.observableArray(allInsurersMedigap);

            length = insurerModel.ActiveInsurersMedigap.length;
            var activeInsurersMedigap = [];
            for (i = 0; i < length; i++) {
                activeInsurersMedigap.push(insurerModel.ActiveInsurersMedigap[i].Id);
            }
            activeInsurersTempList[medigapTabIndex] = ko.observableArray(activeInsurersMedigap);
            savedInsurersTempList[medigapTabIndex] = ko.observableArray([]);

            length = insurerModel.AllInsurersPrescriptionDrug.length;
            var allInsurersPrescriptionDrug = [];
            for (i = 0; i < length; i++) {
                allInsurersPrescriptionDrug.push(ns.InsurerViewModel().loadFromJSON(insurerModel.AllInsurersPrescriptionDrug[i], 'drugs', protoSelf));
            }
            allInsuerersTempList[prescriptionDrugTabIndex] = ko.observableArray(allInsurersPrescriptionDrug);

            length = insurerModel.ActiveInsurersPrescriptionDrug.length;
            var activeInsurersPrescriptionDrug = [];
            for (i = 0; i < length; i++) {
                activeInsurersPrescriptionDrug.push(insurerModel.ActiveInsurersPrescriptionDrug[i].Id);
            }
            activeInsurersTempList[prescriptionDrugTabIndex] = ko.observableArray(activeInsurersPrescriptionDrug);
            savedInsurersTempList[prescriptionDrugTabIndex] = ko.observableArray([]);

            length = insurerModel.AllInsurersMedicareAdvantage.length;
            var allInsurersMedicareAdvantage = [];
            for (i = 0; i < length; i++) {
                allInsurersMedicareAdvantage.push(ns.InsurerViewModel().loadFromJSON(insurerModel.AllInsurersMedicareAdvantage[i], 'advantage', protoSelf));
            }
            allInsuerersTempList[medicareAdvantageTabIndex] = ko.observableArray(allInsurersMedicareAdvantage);

            length = insurerModel.ActiveInsurersMedicareAdvantage.length;
            var activeInsurersMedicareAdvantage = [];
            for (i = 0; i < length; i++) {
                activeInsurersMedicareAdvantage.push(insurerModel.ActiveInsurersMedicareAdvantage[i].Id);
            }
            activeInsurersTempList[medicareAdvantageTabIndex] = ko.observableArray(activeInsurersMedicareAdvantage);
            savedInsurersTempList[medicareAdvantageTabIndex] = ko.observableArray([]);

            protoSelf.allInsurersLists(allInsuerersTempList);
            protoSelf.activeInsurersLists(activeInsurersTempList);
            protoSelf.savedInsurersLists(savedInsurersTempList);

            return protoSelf;
        };

        SelectInsurersViewModel.prototype.updateFromSearchState = function updateFromSearchState(viewModel) {
            var protoSelf = this, medigapTabIndex = app.enums.TabEnum.MEDIGAP, prescriptionDrugTabIndex = app.enums.TabEnum.PRESCRIPTIONDRUG, medicareAdvantageTabIndex = app.enums.TabEnum.MEDICAREADVANTAGE;

            if (viewModel.SelectedInsurersForTabs[medigapTabIndex]) {
                protoSelf.activeInsurersLists()[medigapTabIndex](viewModel.SelectedInsurersForTabs[medigapTabIndex]);
            }

            if (viewModel.SelectedInsurersForTabs[medicareAdvantageTabIndex]) {
                protoSelf.activeInsurersLists()[medicareAdvantageTabIndex](viewModel.SelectedInsurersForTabs[medicareAdvantageTabIndex]);
            }

            if (viewModel.SelectedInsurersForTabs[prescriptionDrugTabIndex]) {
                protoSelf.activeInsurersLists()[prescriptionDrugTabIndex](viewModel.SelectedInsurersForTabs[prescriptionDrugTabIndex]);
            }

            return protoSelf;
        };

    };
} (EXCHANGE, this));

(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.InsurerViewModel = function InsurerViewModel() {
        if (!(this instanceof InsurerViewModel)) {
            return new InsurerViewModel();
        }
        this._self = this;
        var self = this._self;

        self.id = ko.observable('aetna');
        self.name = ko.observable('Aetna Medicare CVS');
        self.radioId = ko.observable('aetnamedigap');
        self.parent = ko.observable();

        self.checked = ko.computed({
            read: function() {
                if (self.parent() && self.parent().activeInsurersCurrentTab()) {
                    return self.parent().activeInsurersCurrentTab().indexOf(self.id()) != -1;
                }
            },
            write: function(val) {
            }
        });

        self.setChecked = ko.computed({
            read: function() {
            },
            write: function(val) {
                if (self.parent() && self.parent().activeInsurersCurrentTab()) {
                    var index = self.parent().activeInsurersCurrentTab().indexOf(val.id());
                    if (index != -1) {
                        self.parent().activeInsurersCurrentTab().splice(index, 1);
                    } else {
                        self.parent().activeInsurersCurrentTab().push(val.id());
                    }
                }
            }
        });

        InsurerViewModel.prototype.loadFromJSON = function loadFromJSON(insurerModel, type, parent) {
            var protoSelf = this;
            protoSelf.id(insurerModel.Id);
            protoSelf.name(insurerModel.Name);
            protoSelf.radioId(insurerModel.Id + type);
            protoSelf.parent(parent);
            return protoSelf;
        };
    };

}(EXCHANGE));
