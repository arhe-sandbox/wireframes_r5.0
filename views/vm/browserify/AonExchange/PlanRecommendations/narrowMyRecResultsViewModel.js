(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.NarrowMyRecResultsViewModel = function NarrowMyRecResultsViewModel() {
        if (!(this instanceof NarrowMyRecResultsViewModel)) {
            return new NarrowMyRecResultsViewModel();
        }
        var self = this;

        self.header_lbl = ko.observable('');
        self.header_desc = ko.observable('');
        self.DisplaySNP = ko.observable(false);
        self.DisplaySNPLabel = ko.observable("Show SNP");
        self.insurer_lbl = ko.observable('');
        self.CarrierPreference_Lbl = ko.observable('');
        self.doctor_lbl = ko.observable('');
        self.updateBtn_lbl = ko.observable('');
        self.sortBy_lbl = ko.observable('');

        self.sortByPremium_lbl = ko.observable("");
        self.sortByDeductible_lbl = ko.observable("");
        self.sortByPlanType_lbl = ko.observable("Plan Type");
        self.sortByCoPay_lbl = ko.observable("Copay");
        self.sortByTotalCost_lbl = ko.observable("Total Cost");
        self.sortByInsurer_lbl = ko.observable("Insurer");
        self.sortByPlanLetter_lbl = ko.observable("Plan Letter");

        self.sortByBrandNameCost_lbl = ko.observable("");
        self.sortByGenericCost_lbl = ko.observable("");

        self.sortBySortOptions_lbl = ko.observable("");

        self.filterOptionsLists = ko.observableArray();

        self.filterOptionsCurrentTab = ko.computed({
            read: function () {
                var filters = self.filterOptionsLists(), currentTab = app.viewModels.RecResultsViewModel.currentTabIndex();
                if (filters.length <= currentTab) {
                    return [];
                }
                return filters[currentTab];
            },
            owner: this,
            deferEvaluation: true
        });

        self.sortByOptionsLists = ko.observableArray();

        self.sortByOptionsCurrentTab = ko.computed({
            read: function () {
                var options = self.sortByOptionsLists(), currentTab = app.viewModels.RecResultsViewModel.currentTabIndex();
                if (options.length <= currentTab) {
                    return [];
                }
                return options[currentTab];
            },
            owner: this,
            deferEvaluation: true
        });

        self.sortByOptionsValuesLists = ko.observableArray();

        self.sortByOptionsValuesCurrentTab = ko.computed({
            read: function () {
                var values = self.sortByOptionsValuesLists(), currentTab = app.viewModels.RecResultsViewModel.currentTabIndex();
                if (values.length <= currentTab) {
                    return [];
                }
                return values[currentTab];
            },
            owner: this,
            deferEvaluation: true
        });

        self.sortByTbLists = ko.observableArray();

        self.sortByTbCurrentTab = ko.computed({
            read: function () {
                var tbs = self.sortByTbLists(), currentTab = app.viewModels.RecResultsViewModel.currentTabIndex();
                if (tbs.length <= currentTab) {
                    return '';
                }
                return tbs[currentTab];
            },
            owner: this,
            deferEvaluation: true
        });

        self.sortingAndFilters_lbl = ko.observable('');
        self.on_lbl = ko.observable('');
        self.clearAllFilters_lbl = ko.observable('');

        NarrowMyRecResultsViewModel.prototype.updateFromSearchState = function updateFromSearchState(searchState) {
            var protoSelf = this, medigapTabIndex = app.enums.TabEnum.MEDIGAP, prescriptionDrugTabIndex = app.enums.TabEnum.PRESCRIPTIONDRUG, medicareAdvantageTabIndex = app.enums.TabEnum.MEDICAREADVANTAGE;
            if (searchState.MedigapSortBy && searchState.MedigapSortBy.sortFrom === "narrow") {
                switch (searchState.MedigapSortBy.sortAttributeName.toLowerCase()) {
                    case 'premium':
                        protoSelf.sortByTbLists.splice(medigapTabIndex, 1, protoSelf.sortByPremium_lbl());
                        break;
                    case 'medigaptype':
                        protoSelf.sortByTbLists.splice(medigapTabIndex, 1, protoSelf.sortByPlanLetter_lbl());
                        break;
                    case 'insurername':
                        protoSelf.sortByTbLists.splice(medigapTabIndex, 1, protoSelf.sortByInsurer_lbl());
                        break;
                    case 'recommendationinfo':
                        protoSelf.sortByTbLists.splice(medigapTabIndex, 1, protoSelf.sortBySortOptions_lbl());
                        break;
                    default:
                        console.log("Unknown sort method Medigap: " + searchState.MedigapSortBy.sortAttributeName);
                        break;
                }
            }
            else {
                protoSelf.sortByTbLists.splice(medigapTabIndex, 1, protoSelf.sortBySortOptions_lbl());
            }
            if (searchState.PrescriptionDrugSortBy && searchState.PrescriptionDrugSortBy.sortFrom === "narrow") {
                switch (searchState.PrescriptionDrugSortBy.sortAttributeName.toLowerCase()) {
                    case 'rx med':
                        if (searchState.PrescriptionDrugSortBy.attributeValueName.toLowerCase() == 'generic rx') {
                            protoSelf.sortByTbLists.splice(prescriptionDrugTabIndex, 1, protoSelf.sortByGenericCost_lbl());
                        }
                        else if (searchState.PrescriptionDrugSortBy.attributeValueName.toLowerCase() == 'brand name rx') {
                            protoSelf.sortByTbLists.splice(prescriptionDrugTabIndex, 1, protoSelf.sortByBrandNameCost_lbl());
                        }
                        break;
                    case 'deductible':
                        protoSelf.sortByTbLists.splice(prescriptionDrugTabIndex, 1, protoSelf.sortByDeductible_lbl());
                        break;
                    case 'insurername':
                        protoSelf.sortByTbLists.splice(prescriptionDrugTabIndex, 1, protoSelf.sortByInsurer_lbl());
                        break;
                    case 'premiumvalue':
                        protoSelf.sortByTbLists.splice(prescriptionDrugTabIndex, 1, protoSelf.sortByPremium_lbl());
                        break;
                    case 'recommendationinfo':
                        protoSelf.sortByTbLists.splice(prescriptionDrugTabIndex, 1, protoSelf.sortBySortOptions_lbl());
                        break;
                    default:
                        console.log("Unknown sort method PDP: " + searchState.PrescriptionDrugSortBy.sortAttributeName);
                        break;
                }
            }
            else {
                protoSelf.sortByTbLists.splice(prescriptionDrugTabIndex, 1, protoSelf.sortBySortOptions_lbl());
            }
            if (searchState.MedicareAdvantageSortBy && searchState.MedicareAdvantageSortBy.sortFrom === "narrow") {
                switch (searchState.MedicareAdvantageSortBy.sortAttributeName.toLowerCase()) {
                    case 'premiumvalue':
                        protoSelf.sortByTbLists.splice(medicareAdvantageTabIndex, 1, protoSelf.sortByPremium_lbl());
                        break;
                    case 'deductible':
                        protoSelf.sortByTbLists.splice(medicareAdvantageTabIndex, 1, protoSelf.sortByDeductible_lbl());
                        break;
                    case 'type':
                        protoSelf.sortByTbLists.splice(medicareAdvantageTabIndex, 1, protoSelf.sortByPlanType_lbl());
                        break;
                    case 'insurername':
                        protoSelf.sortByTbLists.splice(medicareAdvantageTabIndex, 1, protoSelf.sortByInsurer_lbl());
                        break;
                    case 'doctor visit':
                        protoSelf.sortByTbLists.splice(medicareAdvantageTabIndex, 1, protoSelf.sortByCoPay_lbl());
                        break;
                    case 'total-cost':
                        protoSelf.sortByTbLists.splice(medicareAdvantageTabIndex, 1, protoSelf.sortByTotalCost_lbl());
                        break;
                    case 'recommendationinfo':
                        protoSelf.sortByTbLists.splice(medicareAdvantageTabIndex, 1, protoSelf.sortBySortOptions_lbl());
                        break;
                    default:
                        console.log("Unknown sort method MedicareAdvantage: " + searchState.MedicareAdvantageSortBy.sortAttributeName);
                        break;
                }
            }
            else {
                protoSelf.sortByTbLists.splice(medicareAdvantageTabIndex, 1, protoSelf.sortBySortOptions_lbl());
            }

            if (searchState.FiltersForTabs) {
                for (var tab in app.enums.TabEnum) {
                    if (app.enums.TabEnum.hasOwnProperty(tab)) {
                        var index = app.enums.TabEnum[tab];
                        var filters = searchState.FiltersForTabs[index];

                        if (filters) {
                            $.each(filters, function (filterIndex, filter) {
                                for (var i = 0; i < protoSelf.filterOptionsLists()[index]().length; i++) {
                                    var currentFilter = protoSelf.filterOptionsLists()[index]()[i];
                                    if (currentFilter.filter_name() === filter.FilterName) {
                                        currentFilter.setFromValue(filter.SelectedValue);
                                    }
                                }
                            });
                        }
                    }

                };
            }

            return protoSelf;
        };

        NarrowMyRecResultsViewModel.prototype.loadFromJSON = function loadFromJSON(narrowResults) {
            var protoSelf = this;
            protoSelf.header_lbl(narrowResults.Header_Lbl);
            protoSelf.header_desc(narrowResults.Header_Desc);
            protoSelf.DisplaySNP(narrowResults.DisplaySNP);
            protoSelf.insurer_lbl(narrowResults.Insurer_Lbl);
            protoSelf.CarrierPreference_Lbl(narrowResults.CarrierPreference_Lbl);
            protoSelf.doctor_lbl("Doctor Preferences");
            protoSelf.updateBtn_lbl(narrowResults.UpdateBtn_Lbl);
            protoSelf.sortBy_lbl(narrowResults.SortBy_Lbl);

            protoSelf.sortByPremium_lbl(narrowResults.SortByPremium_Lbl);
            protoSelf.sortByDeductible_lbl(narrowResults.SortByDeductible_Lbl);
            protoSelf.sortByBrandNameCost_lbl(narrowResults.SortByBrandNameCost_Lbl);
            protoSelf.sortByGenericCost_lbl(narrowResults.SortByGenericCost_Lbl);
            protoSelf.sortByPlanType_lbl(narrowResults.SortByPlanType_Lbl);
            protoSelf.sortByCoPay_lbl(narrowResults.SortByCoPay_Lbl);
            protoSelf.sortByTotalCost_lbl(narrowResults.SortByTotalCost_Lbl);
            protoSelf.sortByInsurer_lbl(narrowResults.SortByInsurer_Lbl);
            protoSelf.sortByPlanLetter_lbl(narrowResults.SortByPlanLetter_Lbl);
            protoSelf.sortBySortOptions_lbl(narrowResults.SortBySortOptions_Lbl);

            var sortOptionsLists = [];
            var sortValuesLists = [];
            var tbLists = [];
            $.each(narrowResults.SortByValues, function (index, sorts) {
                var currentOptions = [];
                var currentValues = [];
                $.each(sorts, function (j, item) {
                    currentOptions[j] = item.DisplayName;
                    currentValues[j] = item;
                });
                tbLists[index] = currentOptions[0];
                sortOptionsLists[index] = ko.observableArray(currentOptions);
                sortValuesLists[index] = ko.observableArray(currentValues);
                var remIndex = sortOptionsLists[index].indexOf("Sort Options");
                if (remIndex != -1) {
                    sortOptionsLists[index].splice(remIndex, 1);
                }
            });
            protoSelf.sortByOptionsLists(sortOptionsLists);
            protoSelf.sortByOptionsValuesLists(sortValuesLists);
            protoSelf.sortByTbLists(tbLists);

            for (var i = 0; i < narrowResults.FilterOptionsLists.length; i++) {
                var currentList = [];
                for (var j = 0; j < narrowResults.FilterOptionsLists[i].length; j++) {
                    currentList.push(new ns.FilterOptionViewModel().loadFromJSON(narrowResults.FilterOptionsLists[i][j]));
                }
                protoSelf.filterOptionsLists.push(ko.observableArray(currentList));
            }

            protoSelf.sortingAndFilters_lbl(narrowResults.SortingAndFilters_Lbl);
            protoSelf.on_lbl(narrowResults.On_Lbl);
            protoSelf.clearAllFilters_lbl(narrowResults.ClearAllFilters_Lbl);

            return protoSelf;
        };

        NarrowMyRecResultsViewModel.prototype.fixFilterLabels = function fixFilterLabels() {
            var protoSelf = this;
            for (var i = 0; i < protoSelf.filterOptionsCurrentTab()().length; i++) {
                protoSelf.filterOptionsCurrentTab()()[i].fixLabel();
            }
        };

        NarrowMyRecResultsViewModel.prototype.fixSortLabels = function fixSortLabls() {
            var protoSelf = this;
            //            protoSelf.sortByMedigap_tb(EXCHANGE.functions.getDropdownSelectedOption('#Sortmedigap'));
            //            protoSelf.sortByPrescriptionDrug_tb(EXCHANGE.functions.getDropdownSelectedOption('#Sortdrugs'));
            //            protoSelf.sortByMedicareAdvantage_tb(EXCHANGE.functions.getDropdownSelectedOption('#Sortadvantage'));
        };

        NarrowMyRecResultsViewModel.prototype.clearFilterRules = function clearFilterRules(engine) {
            var protoSelf = this;
            for (var i = 0; i < protoSelf.filterOptionsCurrentTab()().length; i++) {
                protoSelf.filterOptionsCurrentTab()()[i].clearFilterRules(engine);
            }
        };

        NarrowMyRecResultsViewModel.prototype.getResultingFilters = function getResultingFilters() {
            var protoSelf = this;
            var length = protoSelf.filterOptionsCurrentTab()().length;
            var filters = [], newFilter;
            for (var i = 0; i < length; i++) {
                newFilter = protoSelf.filterOptionsCurrentTab()()[i].getFilterRule();
                if (newFilter) {
                    filters.push(newFilter);
                }
            }

            return filters;
        };

        NarrowMyRecResultsViewModel.prototype.getResultingFiltersByTab = function getResultingFiltersByTab(tab) {
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

        NarrowMyRecResultsViewModel.prototype.getResultingSorts = function getResultingSorts() {
            var protoSelf = this;
            var selectedOption = app.functions.getDropdownSelectedOption('#sortBy');
            var optionsList = protoSelf.sortByOptionsCurrentTab()();
            var valuesList = protoSelf.sortByOptionsValuesCurrentTab()();
            optionsList.push(self.sortBySortOptions_lbl());

            var index = optionsList.indexOf(selectedOption);
            if (index < 0 || index > valuesList.length) {
                return null;
            }
            var value = valuesList[index];
            if (!value) {
                return null;
            }

            var remIndex = optionsList.indexOf(self.sortBySortOptions_lbl());
            if (remIndex != -1) {
                optionsList.splice(remIndex, 1);
            }

            var sortRuleEngine = EXCHANGE.plans.SortRules();
            sortRuleEngine.useOrderArray = false;
            sortRuleEngine.useOverride = false;
            sortRuleEngine.sortAttributeName = value.AttributeName;
            sortRuleEngine.secondAttributeName = value.SecondAttributeName;
            sortRuleEngine.useAttributes = value.UseAttributes;
            sortRuleEngine.attributeValueName = value.AttributeValueName;
            sortRuleEngine.asc = value.Asc;
            sortRuleEngine.sortFrom = "narrow";

            return sortRuleEngine;
        };

        return self;
    };

} (EXCHANGE, this));

(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.FilterOptionViewModel = function FilterOptionViewModel() {
        if (!(this instanceof FilterOptionViewModel)) {
            return new FilterOptionViewModel();
        }
        var self = this;

        self.filter_lbl = ko.observable('');
        self.filter_name = ko.observable('');
        self.filterDiv_id = ko.observable('');
        // open = PPO, closed = HMO
        self.filter_options = ko.observableArray(['', '', '']);
        self.filter_tb = ko.observable('');
        self.selectedOption = ko.computed({
            read: function () {
                return EXCHANGE.functions.getDropdownSelectedOption('#' + self.filterDiv_id());
            },
            owner: this
        });
        self.filterDefault_tb = ko.observable('');
        self.attributeName = ko.observable('');
        self.attributeValueName = ko.observable('');
        self.useAttributes = ko.observable(true);

        self.filterOptionValues = ko.observableArray([]);

        self.delayDropkick = function delayDropkick(item) {
            setTimeout(function () {
                $(item).dropkick({
                    change: function (value, label) {
                        var filterOption = ko.dataFor($(item)[0]);
                        filterOption.filter_tb(value);
                    }
                });
            }, 50);
        };

        FilterOptionViewModel.prototype.resetFilterTb = function resetFilterTb() {
            var protoSelf = this;
            EXCHANGE.functions.setDropdownSelectedOption('#' + protoSelf.filterDiv_id(), protoSelf.filterDefault_tb());
        };

        FilterOptionViewModel.prototype.fixLabel = function fixLabel() {
            var protoSelf = this;
            protoSelf.filter_tb(EXCHANGE.functions.getDropdownSelectedOption('#' + protoSelf.filterDiv_id()));
        };

        FilterOptionViewModel.prototype.setLabel = function setLabel() {
            var protoSelf = this;
            EXCHANGE.functions.setDropdownSelectedOption('#' + protoSelf.filterDiv_id(), protoSelf.filter_tb());
        };

        FilterOptionViewModel.prototype.setFromValue = function setFromValue(value) {
            var protoSelf = this;
            for (var i = 0; i < protoSelf.filterOptionValues().length; i++) {
                if (protoSelf.filterOptionValues()[i] === value) {
                    protoSelf.filter_tb(protoSelf.filter_options()[i]);
                }
            }

            //            protoSelf.setLabel();
        };

        // This can return null. If it does, that means we don't want to add a filter rule.
        FilterOptionViewModel.prototype.getFilterRule = function getFilterRule() {
            var protoSelf = this;
            var selectedOptionIndex = protoSelf.filter_options().indexOf(protoSelf.filter_tb());

            if (selectedOptionIndex < 0 || selectedOptionIndex > protoSelf.filterOptionValues().length) {
                return null;
            }
            var filterOption = protoSelf.filterOptionValues()[selectedOptionIndex];
            if (filterOption === '') {
                return null;
            }

            var filterRule = EXCHANGE.plans.FilterRuleObject({
                attributeName: protoSelf.attributeName(),
                attributeValueName: protoSelf.attributeValueName(),
                useAttributes: protoSelf.useAttributes(),
                filterGroup: protoSelf.filter_name(),
                allowedValues: [filterOption],
                filterFunction: function (value) {
                if(protoSelf.attributeName() == "Annual Max")
                {
                    value = parseInt(value.substring(value.indexOf('$')+1));
                    return value <= filterOption;
                } 
                 if((protoSelf.attributeName() == "medigapType")  &&  (protoSelf.filter_name()=="TravelFilterForMediGap"))  
                {
                    var filterValues = filterOption.split(",");
                        for(j=0; j< filterValues.length; j++)
                        {
                            if( value === filterValues[j])
                                return true;
                        }
                        return false;               
                } 
                if((protoSelf.attributeName() == "Network Type")  &&  (protoSelf.filter_name()=="TravelFilterForMedicare"))  
                {
                     var filterValues = filterOption.split(",");
                        for(j=0; j< filterValues.length; j++)
                        {
                            if( value === filterValues[j])
                                return true;
                        }
                        return false; 
                }                                             
                else  
                {                
                    if(protoSelf.filter_name()=="FinancialRiskForMediGap")
                    {
                        var filterValues = filterOption.split(",");

                        for(j=0; j< filterValues.length; j++)
                        {
                            if( value === filterValues[j])
                                return true;
                        }
                        return false;               
                    }
                    else
                        return value === filterOption;
                }                    
              }
            });

            return filterRule;
        };

        FilterOptionViewModel.prototype.clearFilterRules = function clearFilterRules(engine) {
            var protoSelf = this;
            engine.clearFilterByGroup(protoSelf.filter_name());
        };

        FilterOptionViewModel.prototype.loadFromJSON = function loadFromJSON(filterOption) {
            var protoSelf = this;
            protoSelf.filter_lbl(filterOption.Filter_Lbl);
            protoSelf.filter_name(filterOption.Filter_Name);
            protoSelf.filterDiv_id(filterOption.Filter_Name + 'Div');
            protoSelf.filter_tb(filterOption.Filter_Tb);
            protoSelf.attributeName(filterOption.AttributeName);
            protoSelf.attributeValueName(filterOption.AttributeValueName);
            protoSelf.useAttributes(filterOption.UseAttributes);
            protoSelf.filterDefault_tb(filterOption.Filter_Tb);

            var options = [], optionValues = [], i;
            for (i = 0; i < filterOption.Filter_Options.length; i++) {
                options.push(filterOption.Filter_Options[i]);
            }
            protoSelf.filter_options(options);

            for (i = 0; i < filterOption.FilterOptionValues.length; i++) {
                optionValues.push(filterOption.FilterOptionValues[i]);
            }
            protoSelf.filterOptionValues(optionValues);

            return protoSelf;
        };

        return self;
    };

} (EXCHANGE, this));
