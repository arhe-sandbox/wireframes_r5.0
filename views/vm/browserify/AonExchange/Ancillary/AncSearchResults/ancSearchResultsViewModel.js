(function (app) {
    //"use strict";
    var currentPlan = 0;
    var curPage;

    var ns = app.namespace('EXCHANGE.models');
    function GetTypeOfPlan() {
        var curMenuIndex = window.location.pathname.lastIndexOf("/") + 1;
        var curMenu = window.location.pathname.substr(curMenuIndex);
        if (curMenu === "search-vision-results.aspx") {
            curPage = EXCHANGE.enums.OtherCoverageEnumID.VISION;
            currentPlan = EXCHANGE.enums.OtherCoverageEnum.VISION;
        } else if (curMenu === "search-dental-results.aspx") {
            curPage = EXCHANGE.enums.OtherCoverageEnumID.DENTAL;
            currentPlan = EXCHANGE.enums.OtherCoverageEnum.DENTAL;
        }
    };


    ns.AncSearchResultsViewModel = function AncSearchResultsViewModel() {
        GetTypeOfPlan();
        if (!(this instanceof AncSearchResultsViewModel)) {
            return new AncSearchResultsViewModel();
        }
        var self = this;

        self.DoTargetDtUpdate = ko.observable(false);
        self.searchResultsDoneLoading = ko.observable(false);

        self.dentalPlans = ko.observableArray([]);
        self.visionPlans = ko.observableArray([]);
        self.displayPlans = ko.observableArray([]);

        self.allPlansInSearchResults = ko.computed({
            read: function () {
                return this.dentalPlans().concat(this.visionPlans());
            }, owner: this
        });

        self.zipCode = ko.observable('');
        self.coverageBeginsDate = ko.observable('');
        self.dateOfBirth = ko.observable('');
        self.Gender = ko.observable('');
        self.Tobacco = ko.observable('');
        self.Disabled = ko.observable('');
        self.KidneyFailure = ko.observable('');

        //Start
        self.SortOptionsDefaultOption = ko.observable('Sort Options');
        self.helpMeChoose_lbl = ko.observable('');
        self.helpMeChoose_desc = ko.observable('');
        self.noPlans_lbl = ko.observable('');

        self.insurer_lbl = ko.observable('');
        self.choosewhosCovered_lbl = ko.observable('');
        self.clearAllFilters_lbl = ko.observable('');
        self.compareSideBySide_lbl = ko.observable('');
        self.showComparison_lbl = ko.observable('');        
        self.sortBy_lbl = ko.observable('');

        self.updateBtn_lbl = ko.observable('');
        self.InEligiblePlan = ko.observable({});
        self.DoTargetDtUpdate = ko.observable(false);

        self.sortBySortOptions_lbl = ko.observable("");
        self.sortByPremium_lbl = ko.observable("");
        self.sortByInsurer_lbl = ko.observable("Insurer");
        //End
        self.Family = ko.observableArray([]);

        self.isDental = ko.observable(false);
        self.isVision = ko.observable(false);
        self.resultsLbl = ko.computed({
            read: function () {
                var lbl = "";
                if (self.isDental() === true) {
                    lbl = "Dental Plans";
                } else if (self.isVision() === true) {
                    lbl = "Vision Plans";
                }
                return lbl;
            }, owner: this,
            deferEvaluation: true
        });
        self.coverageLbl = ko.computed({
            read: function () {
                var lbl = "";
                if (self.isDental() === true) {
                    lbl = "Dental Coverage";
                } else if (self.isVision() === true) {
                    lbl = "Vision Coverage";
                }
                return lbl;
            }, owner: this,
            deferEvaluation: true
        });
        self.noPlans_lbl = ko.observable('');
        self.noPlans_lbl_Formatted = ko.computed({
            read: function () {
                var lbl = self.noPlans_lbl();
                var formatted = "";
                if (self.isDental() === true) {
                    formatted = lbl.format("Dental");
                } else if (self.isVision() === true) {
                    formatted = lbl.format("Vision");
                }
                return formatted;
            }, owner: this,
            deferEvaluation: true
        });

        //R-Start
        self.sortByOptionsLists = ko.observableArray();


        self.sortByOptionsValuesLists = ko.observableArray();


        self.sortByOptionsCurrentTab = ko.computed({
            read: function () {
                return self.sortByOptionsLists()[0];
            },
            owner: this,
            deferEvaluation: true
        });
        self.sortByOptionsValuesCurrentTab = ko.computed({
            read: function () {
                return self.sortByOptionsValuesLists()[0];
            },
            owner: this,
            deferEvaluation: true
        });
        //R-End
        self.InEligiblePlan = ko.observable({});

        AncSearchResultsViewModel.prototype.loadFromJSON = function loadFromJSON(searchResults, planLists) {
            var protoSelf = this;

            protoSelf.noPlans_lbl(searchResults.NoPlans_Lbl);

            protoSelf.zipCode(app.user.UserSession.UserProfile.zipCode);
            protoSelf.coverageBeginsDate(((new Date(app.user.UserSession.UserProfile.coverageBeginsDate)).getMonth() + 1) + '/' + (new Date(app.user.UserSession.UserProfile.coverageBeginsDate)).getDate() + '/' + (new Date(app.user.UserSession.UserProfile.coverageBeginsDate)).getFullYear());
            protoSelf.dateOfBirth(((new Date(moment(EXCHANGE.user.UserSession.UserProfile.dateOfBirth).utc())).getMonth() + 1) + '/' + ((new Date(moment(EXCHANGE.user.UserSession.UserProfile.dateOfBirth).utc())).getDate()) + '/' + ((new Date(moment(EXCHANGE.user.UserSession.UserProfile.dateOfBirth).utc())).getFullYear()));

            if (app.user.UserSession.UserProfile.isGenderMale) {
                protoSelf.Gender('Male');
            }
            else {
                protoSelf.Gender('Female');
            }
            if (app.user.UserSession.UserProfile.isTobaccoUser) {
                protoSelf.Tobacco('Yes');
            }
            else {
                protoSelf.Tobacco('No');
            }
            if (app.user.UserSession.UserProfile.isDisabled) {
                protoSelf.Disabled('Yes');
            }
            else {
                protoSelf.Disabled('No');
            }
            if (app.user.UserSession.UserProfile.isKidneyFailure) {
                protoSelf.KidneyFailure('Yes');
            }
            else {
                protoSelf.KidneyFailure('No');
            }

            protoSelf.Family(searchResults.Family);
            // LoadPlanSection

            var dental = [];
            var vision = [];


            //R Start
            var sortOptionsLists = [];
            var sortValuesLists = [];
            var tbLists = [];
            $.each(searchResults.SortByValues, function (index, sorts) {
                var currentOptions = [];
                var currentValues = [];
                $.each(sorts, function (j, item) {
                    currentOptions[j] = item.DisplayName;
                    currentValues[j] = item;
                });
                tbLists[index] = currentOptions[0];
                sortOptionsLists[index] = ko.observableArray(currentOptions);
                sortValuesLists[index] = ko.observableArray(currentValues);
            });
            protoSelf.sortByOptionsLists(sortOptionsLists);
            protoSelf.sortByOptionsValuesLists(sortValuesLists);

            protoSelf.sortBySortOptions_lbl(searchResults.SortBySortOptions_Lbl);

            protoSelf.helpMeChoose_lbl(searchResults.HelpMeChoose_Lbl);
            protoSelf.helpMeChoose_desc(searchResults.HelpMeChoose_Desc);
            protoSelf.noPlans_lbl(searchResults.NoPlans_Lbl);
            protoSelf.compareSideBySide_lbl(searchResults.CompareSideBySide_Lbl);
            protoSelf.showComparison_lbl(searchResults.ShowComparison_Lbl);
            protoSelf.insurer_lbl(searchResults.Insurer_Lbl);
            protoSelf.updateBtn_lbl(searchResults.UpdateBtn_Lbl);
            protoSelf.sortBy_lbl(searchResults.SortBy_Lbl);
            protoSelf.clearAllFilters_lbl(searchResults.ClearAllFilters_Lbl);
            protoSelf.choosewhosCovered_lbl(searchResults.ChooseWhosCovered_lbl);

            //R End


            // 1st List == Dental Plans &&& 2nd List === Vision Plans
            for (var j = 0; j < planLists[EXCHANGE.enums.OtherCoverageEnum.DENTAL].length; j++) {
                var planViewModel = app.models.PlanSearchResultsViewModel(1);
                var plan = planViewModel.loadFromPlanDomainEntity(planLists[EXCHANGE.enums.OtherCoverageEnum.DENTAL][j]);
                dental.push(plan);
            }

            for (var j = 0; j < planLists[EXCHANGE.enums.OtherCoverageEnum.VISION].length; j++) {
                var planViewModel = app.models.PlanSearchResultsViewModel(1);
                var plan = planViewModel.loadFromPlanDomainEntity(planLists[EXCHANGE.enums.OtherCoverageEnum.VISION][j]);
                vision.push(plan);
            }

            protoSelf.dentalPlans(dental);
            protoSelf.visionPlans(vision);

            protoSelf.InEligiblePlan({});

            //End Of LoadPlanSection
            protoSelf.searchResultsDoneLoading(true);
            return protoSelf;
        };


        AncSearchResultsViewModel.prototype.getPlanByPlanGuid = function getPlanByPlanGuid(planGuid) {

            var protoSelf = this;
            return protoSelf.allPlansInSearchResults().find(function (element) {
                if (element.planGuid == planGuid)
                    return true;
                else
                    return false;
            });
        };
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
                    var insurers = self.allInsurersLists(), currentTab = currentPlan;
                    if (insurers.length <= currentTab) {
                        return [];
                    }
                    return insurers[currentTab];
                },
                owner: this
            });

            self.activeInsurersCurrentTab = ko.computed({
                read: function () {
                    var insurers = self.activeInsurersLists(), currentTab = currentPlan;
                    if (insurers.length <= currentTab) {
                        return [];
                    }
                    return insurers[currentTab];
                },
                write: function (list) {
                    self.activeInsurersLists()[currentPlan](list);
                },
                owner: this
            });

            self.savedInsurersCurrentTab = ko.computed({
                read: function () {
                    var insurers = self.savedInsurersLists(), currentTab = currentPlan;
                    if (insurers.length <= currentTab) {
                        return [];
                    }
                    return insurers[currentTab];
                },
                write: function (list) {
                    self.savedInsurersLists()[currentPlan](list);
                },
                owner: this
            });

            self.dropdown_lbl = ko.computed(function () {
                if (typeof (self.activeInsurersCurrentTab()) !== "function") {
                    return self.noneSelectedText().format(0);
                }
                if (self.activeInsurersCurrentTab()().length > 0) {
                    return self.someSelectedText().format(self.activeInsurersCurrentTab()().length);
                } else {
                    return self.noneSelectedText().format(self.allInsurersCurrentTab()().length);
                }
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
                var oldAll = protoSelf.allInsurersLists()[currentPlan]();
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

                var protoSelf = this,
                allInsuerersTempList = [], activeInsurersTempList = [], savedInsurersTempList = [];
                protoSelf.leftTitle_lbl(insurerModel.LeftTitle_Lbl);
                protoSelf.leftDesc_lbl(insurerModel.LeftDesc_Lbl);
                protoSelf.selectAll_lbl(insurerModel.SelectAll_Lbl);
                protoSelf.selectNone_lbl(insurerModel.SelectNone_Lbl);
                protoSelf.cancelBtn_lbl(insurerModel.CancelBtn_Lbl);
                protoSelf.okBtn_lbl(insurerModel.OkBtn_Lbl);

                protoSelf.errorHdr_lbl(insurerModel.ErrorHdr_Lbl);
                protoSelf.errorDesc_lbl(insurerModel.ErrorDesc_Lbl);

                //Vision
                var length = insurerModel.AllInsurersVision.length;
                var AllInsurersVision = [];
                for (var i = 0; i < length; i++) {
                    AllInsurersVision.push(ns.InsurerViewModel().loadFromJSON(insurerModel.AllInsurersVision[i], EXCHANGE.enums.OtherCoverageEnumID.VISION, protoSelf));
                }
                allInsuerersTempList[1] = ko.observableArray(AllInsurersVision);

                length = insurerModel.ActiveInsurersVision.length;
                var ActiveInsurersVision = [];
                for (i = 0; i < length; i++) {
                    ActiveInsurersVision.push(insurerModel.ActiveInsurersVision[i].Id);
                }
                activeInsurersTempList[1] = ko.observableArray(ActiveInsurersVision);
                savedInsurersTempList[1] = ko.observableArray([]);
                //Vision End

                //}
                //Dental
                length = insurerModel.AllInsurersDental.length;
                var AllInsurersDental = [];
                for (i = 0; i < length; i++) {
                    AllInsurersDental.push(ns.InsurerViewModel().loadFromJSON(insurerModel.AllInsurersDental[i], EXCHANGE.enums.OtherCoverageEnumID.DENTAL, protoSelf));
                }
                allInsuerersTempList[0] = ko.observableArray(AllInsurersDental);

                length = insurerModel.ActiveInsurersDental.length;
                var ActiveInsurersDental = [];
                for (i = 0; i < length; i++) {
                    ActiveInsurersDental.push(insurerModel.ActiveInsurersDental[i].Id);
                }
                activeInsurersTempList[0] = ko.observableArray(ActiveInsurersDental);
                savedInsurersTempList[0] = ko.observableArray([]);
                //}
                //Dental End

                protoSelf.allInsurersLists(allInsuerersTempList);
                protoSelf.activeInsurersLists(activeInsurersTempList);
                protoSelf.savedInsurersLists(savedInsurersTempList);

                return protoSelf;
            };

            SelectInsurersViewModel.prototype.updateFromSearchState = function updateFromSearchState(viewModel) {
                var protoSelf = this;
                //For dental
                if (currentPlan == EXCHANGE.enums.OtherCoverageEnum.DENTAL) {
                    protoSelf.activeInsurersLists()[EXCHANGE.enums.OtherCoverageEnum.DENTAL](viewModel.AncSelectedInsurersDental[EXCHANGE.enums.OtherCoverageEnum.DENTAL]);
                }

                //For Vision
                else if (currentPlan == EXCHANGE.enums.OtherCoverageEnum.VISION) {
                    protoSelf.activeInsurersLists()[EXCHANGE.enums.OtherCoverageEnum.VISION](viewModel.AncSelectedInsurersVision[EXCHANGE.enums.OtherCoverageEnum.VISION]);
                }

                return protoSelf;
            };

        };

    };

} (EXCHANGE));
