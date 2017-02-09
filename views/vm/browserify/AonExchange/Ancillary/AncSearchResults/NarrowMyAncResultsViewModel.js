(function (app, global) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");
    var currentPlan = 0;
    var curMenuIndex = window.location.pathname.lastIndexOf("/") + 1;
    var curMenu = window.location.pathname.substr(curMenuIndex);
    var curPage;
    if (curMenu === "search-vision-results.aspx") {
        curPage = EXCHANGE.enums.OtherCoverageEnumID.VISION;
        currentPlan = EXCHANGE.enums.OtherCoverageEnum.VISION;
    } else if (curMenu === "search-dental-results.aspx") {
        curPage = EXCHANGE.enums.OtherCoverageEnumID.DENTAL;
        currentPlan = EXCHANGE.enums.OtherCoverageEnum.DENTAL;
    }

    ns.NarrowMyAncResultsViewModel = function NarrowMyAncResultsViewModel() {
        if (!(this instanceof NarrowMyAncResultsViewModel)) {
            return new NarrowMyAncResultsViewModel();
        }
        var self = this;
        self.filterOptionsLists = ko.observableArray();
        self.sortBySortOptions_lbl = ko.observable("");
        self.sortByPremium_lbl = ko.observable("");
        self.sortByInsurer_lbl = ko.observable("Insurer");
        self.filterOptionsCurrentTab = ko.computed({
            read: function () {
                return self.filterOptionsLists()[currentPlan];
            },
            owner: this,
            deferEvaluation: true
        });

        self.sortByOptionsLists = ko.observableArray();
        self.sortByOptionsCurrentTab = ko.computed({
            read: function () {
                return self.sortByOptionsLists()[currentPlan];
            },
            owner: this,
            deferEvaluation: true
        });

        self.sortByOptionsValuesLists = ko.observableArray();
        self.sortByOptionsValuesCurrentTab = ko.computed({
            read: function () {
                return self.sortByOptionsValuesLists()[currentPlan];
            },
            owner: this,
            deferEvaluation: true
        });

        self.sortByTbLists = ko.observableArray();

        self.sortByTbCurrentTab = ko.computed({
            read: function () {
                return self.sortByTbLists()[currentPlan];
            },
            owner: this,
            deferEvaluation: true
        });
        self.sortBySortOptions_lbl = ko.observable("");

        NarrowMyAncResultsViewModel.prototype.getResultingFilters = function getResultingFilters() {
            var protoSelf = this;
            var length = protoSelf.filterOptionsCurrentTab()().length;
            var filters = [], newFilter;
            for (var i = 0; i < length; i++) {// As we have only two plans i.e dental and vision
                newFilter = protoSelf.filterOptionsCurrentTab()()[currentPlan].getFilterRule();
                if (newFilter) {
                    filters.push(newFilter);
                }
            }

            return filters;
        };
        NarrowMyAncResultsViewModel.prototype.loadFromJSON = function loadFromJSON(narrowResults) {
            var protoSelf = this;
            protoSelf.sortByOptionsLists(EXCHANGE.viewModels.AncSearchResultsViewModel.sortByOptionsLists);
            protoSelf.sortBySortOptions_lbl(narrowResults.SortBySortOptions_Lbl);
            protoSelf.sortByPremium_lbl(narrowResults.SortByPremium_Lbl);
            protoSelf.sortByInsurer_lbl(narrowResults.SortByInsurer_Lbl);
            for (var i = 0; i < narrowResults.FilterOptionsLists.length; i++) {
                var currentList = [];
                for (var j = 0; j < narrowResults.FilterOptionsLists[i].length; j++) {
                    currentList.push(new ns.FilterOptionViewModel().loadFromJSON(narrowResults.FilterOptionsLists[i][j]));
                }
                protoSelf.filterOptionsLists.push(ko.observableArray(currentList));
            }
            return protoSelf;
        };
        NarrowMyAncResultsViewModel.prototype.getResultingSorts = function getResultingSorts() {
            var protoSelf = this;
            var selectedOption = app.functions.getDropdownSelectedOption('#sortBy');
            var optionsList = EXCHANGE.viewModels.AncSearchResultsViewModel.sortByOptionsCurrentTab()();
            var valuesList = EXCHANGE.viewModels.AncSearchResultsViewModel.sortByOptionsValuesCurrentTab()();

            var index = optionsList.indexOf(selectedOption);
            if (index < 0 || index > valuesList.length) {
                return null;
            }
            var value = valuesList[index];
            if (!value) {
                return null;
            }

            var sortRuleEngine = EXCHANGE.plans.SortRules();
            sortRuleEngine.useOrderArray = false;
            sortRuleEngine.useOverride = false;
            sortRuleEngine.sortAttributeName = value.AttributeName;
            sortRuleEngine.useAttributes = value.UseAttributes;
            sortRuleEngine.attributeValueName = value.AttributeValueName;
            sortRuleEngine.asc = value.Asc;
            sortRuleEngine.sortFrom = "narrow";

            return sortRuleEngine;
        };
        NarrowMyAncResultsViewModel.prototype.fixSortLabels = function fixSortLabls() {
            var protoSelf = this;
            //            protoSelf.sortByMedigap_tb(EXCHANGE.functions.getDropdownSelectedOption('#Sortmedigap'));
            //            protoSelf.sortByPrescriptionDrug_tb(EXCHANGE.functions.getDropdownSelectedOption('#Sortdrugs'));
            //            protoSelf.sortByMedicareAdvantage_tb(EXCHANGE.functions.getDropdownSelectedOption('#Sortadvantage'));
        };
        NarrowMyAncResultsViewModel.prototype.fixFilterLabels = function fixFilterLabels() {
            var protoSelf = this;
            for (var i = 0; i < protoSelf.filterOptionsCurrentTab()().length; i++) {
                protoSelf.filterOptionsCurrentTab()()[i].fixLabel();
            }
        };

        NarrowMyAncResultsViewModel.prototype.clearFilterRules = function clearFilterRules(engine) {
            var protoSelf = this;
            for (var i = 0; i < protoSelf.filterOptionsCurrentTab()().length; i++) {
                protoSelf.filterOptionsCurrentTab()()[i].clearFilterRules(engine);
            }
        };
        NarrowMyAncResultsViewModel.prototype.getResultingFiltersByTab = function getResultingFiltersByTab(tab) {
            var protoSelf = this;
            var length = protoSelf.filterOptionsLists()[tab]().length;
            var filters = [], newFilter;
            for (var i = 0; i < length; i++) {
                newFilter = protoSelf.filterOptionsLists()[tab]()[i].getFilterRule();
                if (newFilter) {
                    filters.push(newFilter);
                }
            }

            return filters;
        };

        NarrowMyAncResultsViewModel.prototype.updateFromSearchState = function updateFromSearchState(searchState) {
            var protoSelf = this;
            if (curPage === EXCHANGE.enums.OtherCoverageEnumID.DENTAL) {
                currentPlan = EXCHANGE.enums.OtherCoverageEnum.DENTAL
            }
            else if (curPage === EXCHANGE.enums.OtherCoverageEnumID.VISION) {
                currentPlan = EXCHANGE.enums.OtherCoverageEnum.VISION
            }

            if (EXCHANGE.viewModels.AncSearchStateDental.DentalSortBy) {
                switch (EXCHANGE.viewModels.AncSearchStateDental.DentalSortBy.sortAttributeName.toLowerCase()) {
                    case 'premium':
                        protoSelf.sortByTbLists.splice(currentPlan, 1, protoSelf.sortByPremium_lbl());
                        break;
                    case 'insurername':
                        protoSelf.sortByTbLists.splice(currentPlan, 1, protoSelf.sortByInsurer_lbl());
                        break;
                    default:
                        console.log("Unknown sort method Dental: " + EXCHANGE.viewModels.AncSearchStateDental.DentalSortBy.sortAttributeName);
                        break;
                }
            }
            else {
                protoSelf.sortByTbLists.splice(currentPlan, 1, protoSelf.sortBySortOptions_lbl());
            }
            if (EXCHANGE.viewModels.AncSearchStateDental.VisionSortBy) {
                switch (EXCHANGE.viewModels.AncSearchStateDental.VisionSortBy.sortAttributeName.toLowerCase()) {
                    case 'premium':
                        protoSelf.sortByTbLists.splice(currentPlan, 1, protoSelf.sortByPremium_lbl());
                        break;
                    case 'insurername':
                        protoSelf.sortByTbLists.splice(currentPlan, 1, protoSelf.sortByInsurer_lbl());
                        break;
                    default:
                        console.log("Unknown sort method Vision: " + EXCHANGE.viewModels.AncSearchStateDental.VisionSortBy.sortAttributeName);
                        break;
                }
            }
            else {
                protoSelf.sortByTbLists.splice(currentPlan, 1, protoSelf.sortBySortOptions_lbl());
            }

            return protoSelf;
        };
    }
} (EXCHANGE));
