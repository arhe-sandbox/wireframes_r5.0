(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.SearchResultsViewModel = function SearchResultsViewModel() {
        if (!(this instanceof SearchResultsViewModel)) {
            return new SearchResultsViewModel();
        }
        var self = this;

        self.searchResultsDoneLoading = ko.observable(false);
        self.moreMedigapPlansFlag = ko.observable(false);

        self.currentTab = ko.observable('medigap');
        self.tabOrder = ko.observableArray([]);
        self.currentTabIndex = ko.computed({
            read: function () {
                //Reset height in case changing from more plans to fewer plans
                $(".sidebar-holder").css({ height: (490) + 'px' });
                if (self.currentTab() == app.enums.TabIdEnum.MEDICAREADVANTAGE) {
                    return app.enums.TabEnum.MEDICAREADVANTAGE;
                } else if (self.currentTab() == app.enums.TabIdEnum.PRESCRIPTIONDRUG) {
                    return app.enums.TabEnum.PRESCRIPTIONDRUG;
                } else if (self.currentTab() == app.enums.TabIdEnum.MEDIGAP) {
                    return app.enums.TabEnum.MEDIGAP;
                } else {
                    return 0;
                }
            },
            owner: this
        });

        self.tab0 = new app.models.SearchResultsTabGroupViewModel(0);
        self.tab1 = new app.models.SearchResultsTabGroupViewModel(1);
        self.tab2 = new app.models.SearchResultsTabGroupViewModel(2);

        self.isSRDoneLoading = ko.computed({
            read: function () {
                if (!this.searchResultsDoneLoading()) {
                    if (this.tab0.planCount() > 0 ||
                        this.tab1.planCount() > 0 ||
                        this.tab2.planCount() > 0) {
                        this.searchResultsDoneLoading(true);
                        EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.SearchResult.SearchResultsClientViewModel");
                    }
                }
                return false;
            },
            owner: this
        });


        self.allPlansInSearchResults = ko.computed({
            read: function () {

                return this.tab0.allPlans().concat(this.tab1.allPlans()).concat(this.tab2.allPlans());

            }, owner: this

        });

        self.weFoundXPlans_lbl = ko.observable('');
        self.weFoundXPlans_desc = ko.observable('');
        self.helpMeChoose_lbl = ko.observable('');
        self.helpMeChoose_desc = ko.observable('');
        self.noPlans_lbl = ko.observable('');
        self.myCoverage_lbl = ko.observable('');
        self.myCoverage_desc = ko.observable('');
        self.myMedications_lbl = ko.observable('');
        self.myMedications_medigap_desc = ko.observable('');
        self.myMedications_other_desc = ko.observable('');
        self.compareUpTo_lbl = ko.observable('');
        self.compareUpTo_desc = ko.observable('');
        self.compareUpTo_desc_lbl = ko.computed({
            read: function () {
                var lbl = self.compareUpTo_desc();
                var medigapProductType, drugProductType, medicareAdvantageProductType;
                for (var i = 0; i < app.exchangeContext.ExchangeContext.tabOrder().length; i++) {
                    if (app.exchangeContext.ExchangeContext.tabOrder()[i] == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
                        medicareAdvantageProductType = getProductTypeName(i);
                    } else if (app.exchangeContext.ExchangeContext.tabOrder()[i] == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
                        drugProductType = getProductTypeName(i);
                    } else if (app.exchangeContext.ExchangeContext.tabOrder()[i] == app.enums.PlanTypeEnum.MEDIGAP) {
                        medigapProductType = getProductTypeName(i);
                    }
                }
                if (self.currentTab() == 'medigap') {
                    lbl = lbl.format(app.plans.MedigapCompareList.getComparedPlansCount(), medigapProductType);
                }
                else if (self.currentTab() == 'drugs') {
                    lbl = lbl.format(app.plans.PrescriptionDrugCompareList.getComparedPlansCount(), drugProductType);
                }
                else if (self.currentTab() == 'advantage') {
                    lbl = lbl.format(app.plans.MedicareAdvantageCompareList.getComparedPlansCount(), medicareAdvantageProductType);
                }
                return lbl;
            },
            owner: this,
            deferEvaluation: true
        });

        function getProductTypeName(i) {
            switch (i) {
                case 0:
                    return self.tab0.productType();
                case 1:
                    return self.tab1.productType();
                case 2:
                    return self.tab2.productType();
            }
        };
        self.learn_lbl = ko.observable('');
        self.learn_desc = ko.observable('');
        self.breadcrumb1_lbl = ko.observable('');
        self.breadcrumb2_lbl = ko.observable('');
        self.breadcrumb3_lbl = ko.observable('');

        self.plansInCart = ko.observable(0);

        self.medigapLongDesc_lbl = ko.observable('');
        self.prescriptionDrugLongDesc_lbl = ko.observable('');
        self.medicareAdvantageLongDesc_lbl = ko.observable('');

        self.totalCostEstimator_lbl = ko.observable('');
        self.estimateMedicationCosts_lbl = ko.observable('');
        self.showComparison_lbl = ko.observable('');
        self.compareSideBySide_lbl = ko.observable('');
        self.showMorePlans_lbl = ko.observable('');
        self.showMoreRecPlans_lbl = ko.observable('');
        self.chooseInsuranceType_lbl = ko.observable('');
        self.InvalidPlanComboInCartErrMsg_Lbl = ko.observable('');
        self.InvalidPlanComboInCartErrTitle_Lbl = ko.observable('');
        self.PreEligMsgTitle_Lbl = ko.observable('');
        self.PreEligMsg_Lbl = ko.observable('');
        self.PreEligFailMsg_Lbl = ko.observable('');
        self.NoPharmacyErrMsg_Lbl = ko.observable('');
        self.InEligiblePlan = ko.observable({});
        self.DoTargetDtUpdate = ko.observable(false);
        self.goBack_Lbl = ko.observable('');
        self.medigapAgentLongDesc_lbl = ko.observable('');
        self.medigapLongDesc_lblFormatted = ko.computed({
            read: function () {
                var formattedText = "";
                if (app.user.UserSession.Agent && app.user.UserSession.Agent().Id && app.user.UserSession.Agent().Id() !== app.constants.blankGuid) {
                    formattedText += self.medigapAgentLongDesc_lbl();
                }
                else {
                    formattedText += self.medigapLongDesc_lbl();
                }
                return formattedText;
            },
            owner: this,
            deferEvaluation: true
        });

        self.zipCode = ko.observable('');
        self.coverageBeginsDate = ko.observable('');
        self.dateOfBirth = ko.observable('');
        self.Gender = ko.observable('');
        self.Tobacco = ko.observable('');
        self.Disabled = ko.observable('');
        self.KidneyFailure = ko.observable('');
        
        SearchResultsViewModel.prototype.loadFromJSON = function loadFromJSON(searchResults, planLists) {
            var protoSelf = this;
            protoSelf.weFoundXPlans_lbl(searchResults.WeFoundXPlans_Lbl);
            protoSelf.weFoundXPlans_desc(searchResults.WeFoundXPlans_Desc);
            protoSelf.helpMeChoose_lbl(searchResults.HelpMeChoose_Lbl);
            protoSelf.helpMeChoose_desc(searchResults.HelpMeChoose_Desc);
            protoSelf.noPlans_lbl(searchResults.NoPlans_Lbl);
            protoSelf.myCoverage_lbl(searchResults.MyCoverage_Lbl);
            protoSelf.myCoverage_desc(searchResults.MyCoverage_Desc);
            protoSelf.myMedications_lbl(searchResults.MyMedications_Lbl);
            protoSelf.myMedications_medigap_desc(searchResults.MyMedications_Medigap_Desc);
            protoSelf.myMedications_other_desc(searchResults.MyMedications_Other_Desc);
            protoSelf.compareUpTo_lbl(searchResults.CompareUpTo_Lbl);
            protoSelf.compareUpTo_desc(searchResults.CompareUpTo_Desc);
            protoSelf.learn_lbl(searchResults.Learn_Lbl);
            protoSelf.learn_desc(searchResults.Learn_Desc);
            protoSelf.breadcrumb1_lbl(searchResults.Breadcrumb1_Lbl);
            protoSelf.breadcrumb2_lbl(searchResults.Breadcrumb2_Lbl);
            protoSelf.breadcrumb3_lbl(searchResults.Breadcrumb3_Lbl);
            protoSelf.InvalidPlanComboInCartErrMsg_Lbl(searchResults.InvalidPlanComboInCartErrMsg_Lbl);
            protoSelf.InvalidPlanComboInCartErrTitle_Lbl(searchResults.InvalidPlanComboInCartErrTitle_Lbl);
            protoSelf.PreEligMsgTitle_Lbl(searchResults.PreEligMsgTitle_Lbl);
            protoSelf.PreEligFailMsg_Lbl(searchResults.PreEligFailMsg_Lbl);
            protoSelf.PreEligMsg_Lbl(searchResults.PreEligMsg_Lbl);
            protoSelf.NoPharmacyErrMsg_Lbl(searchResults.NoPharmacyErrMsg_Lbl);
            protoSelf.InEligiblePlan({});
            protoSelf.goBack_Lbl(searchResults.GoBack_Lbl);
            protoSelf.tab0 = protoSelf.tab0.loadFromJSON(searchResults.SearchResultsTabViewModels[0]);
            protoSelf.tab0.productTypeEnum(app.exchangeContext.ExchangeContext.tabOrder()[0]);
            protoSelf.tab1 = protoSelf.tab1.loadFromJSON(searchResults.SearchResultsTabViewModels[1]);
            protoSelf.tab1.productTypeEnum(app.exchangeContext.ExchangeContext.tabOrder()[1]);
            protoSelf.tab2 = protoSelf.tab2.loadFromJSON(searchResults.SearchResultsTabViewModels[2]);
            protoSelf.tab2.productTypeEnum(app.exchangeContext.ExchangeContext.tabOrder()[2]);

            protoSelf.medigapLongDesc_lbl(searchResults.MedigapLongDesc_Lbl);
            protoSelf.medigapAgentLongDesc_lbl(searchResults.MedigapAgentLongDesc_Lbl);

            protoSelf.prescriptionDrugLongDesc_lbl(searchResults.PrescriptionDrugLongDesc_Lbl);
            protoSelf.medicareAdvantageLongDesc_lbl(searchResults.MedicareAdvantageLongDesc_Lbl);

            protoSelf.totalCostEstimator_lbl(searchResults.TotalCostEstimator_Lbl);
            protoSelf.estimateMedicationCosts_lbl(searchResults.EstimateMedicationCosts_Lbl);
            protoSelf.showComparison_lbl(searchResults.ShowComparison_Lbl);
            protoSelf.compareSideBySide_lbl(searchResults.CompareSideBySide_Lbl);
            protoSelf.showMorePlans_lbl(searchResults.ShowMorePlans_Lbl);
            protoSelf.showMoreRecPlans_lbl(searchResults.ShowMoreRecPlans_Lbl);
            protoSelf.chooseInsuranceType_lbl(searchResults.ChooseInsuranceType_Lbl);

            protoSelf.moreMedigapPlansFlag(searchResults.moreMedigapPlansFlag);


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

            // LoadPlanSection

            var tabOrder = app.exchangeContext.ExchangeContext.tabOrder();
            var medigap = [];
            var prescriptionDrug = [];
            var medicareAdvantage = [];

            for (var i = 0; i < tabOrder.length; i++) {
                if (tabOrder[i] == app.enums.PlanTypeEnum.MEDIGAP) {
                    for (var j = 0; j < planLists[i].length; j++) {
                        var planViewModel = app.models.PlanSearchResultsViewModel(2);
                        var medigapPlan = planViewModel.loadFromPlanDomainEntity(planLists[i][j]);
                        // var medigapPlan = new EXCHANGE.plans.PlanModel(planLists[i][j]);
                        medigap.push(medigapPlan);
                    }
                    protoSelf.tab2 = protoSelf.tab2.setAllPlans(medigap);
                    protoSelf.tab2.planCount_lbl(medigap.length);
                    protoSelf.tab2.displayPlansCountStart(0);



                } else if (tabOrder[i] == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
                    for (var j = 0; j < planLists[i].length; j++) {
                        var planViewModel = app.models.PlanSearchResultsViewModel(1);
                        var prescriptionDrugPlan = planViewModel.loadFromPlanDomainEntity(planLists[i][j]);
                        prescriptionDrug.push(prescriptionDrugPlan);
                    }
                    protoSelf.tab1 = protoSelf.tab1.setAllPlans(prescriptionDrug);
                    protoSelf.tab1.planCount_lbl(prescriptionDrug.length);
                    protoSelf.tab1.displayPlansCountStart(0);

                } else if (tabOrder[i] == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
                    for (var j = 0; j < planLists[i].length; j++) {
                        var planViewModel = app.models.PlanSearchResultsViewModel(1);
                        var medicareAdvantagePlan = planViewModel.loadFromPlanDomainEntity(planLists[i][j]);
                        medicareAdvantage.push(medicareAdvantagePlan);
                    }


                    protoSelf.tab0 = protoSelf.tab0.setAllPlans(medicareAdvantage);
                    protoSelf.tab0.planCount_lbl(medicareAdvantage.length);
                    protoSelf.tab0.displayPlansCountStart(0);
                }
            }
            //End Of LoadPlanSection

            //call TCE
            app.coverageCost.getSearchResultsPlanCoverageCosts();


        };


        SearchResultsViewModel.prototype.getPlanByPlanGuid = function getPlanByPlanGuid(planGuid) {

            var protoSelf = this;
            return protoSelf.allPlansInSearchResults().find(function (element) {
                if (element.planGuid == planGuid)
                    return true;
                else
                    return false;
            });
        };


        SearchResultsViewModel.prototype.getPlanByPlanId = function getPlanByPlanId(planId) {

            var protoSelf = this;
            return protoSelf.allPlansInSearchResults().find(function (element) {
                if (element.planId == planId)
                    return true;
                else
                    return false;
            });
        };



        SearchResultsViewModel.prototype.loadFromActivePlans = function loadFromActivePlans() {
            //            var protoSelf = this;
            //            protoSelf.tab0 = protoSelf.tab0.setAllPlans(app.plans.ActivePlans.Tab0Plans);
            //            protoSelf.tab0.planCount_lbl(app.plans.AllPlans.Tab0Plans.length);
            //            protoSelf.tab0.displayPlansCountStart(0);
            //            protoSelf.tab1 = protoSelf.tab1.setAllPlans(app.plans.ActivePlans.Tab1Plans);
            //            protoSelf.tab1.planCount_lbl(app.plans.AllPlans.Tab1Plans.length);
            //            protoSelf.tab1.displayPlansCountStart(0);
            //            protoSelf.tab2 = protoSelf.tab2.setAllPlans(app.plans.ActivePlans.Tab2Plans);
            //            protoSelf.tab2.planCount_lbl(app.plans.AllPlans.Tab2Plans.length);
            //            protoSelf.tab2.displayPlansCountStart(0);

            //            protoSelf.tabOrder(app.exchangeContext.ExchangeContext.tabOrder());
            //            return protoSelf;
        };
    };

} (EXCHANGE, this));


(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.SearchResultsTabGroupViewModel = function SearchResultsTabGroupViewModel(index) {
        if (!(this instanceof SearchResultsTabGroupViewModel)) {
            return new SearchResultsTabGroupViewModel(index);
        }
        var self = this;

        self.tabIndex = ko.observable(index);

        self.productType = ko.observable('');
        self.productTypeEnum = ko.observable('');
        self.getTabCodeName = ko.computed({
            read: function () {
                if (self.productTypeEnum() == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
                    return 'advantage';
                } else if (self.productTypeEnum() == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
                    return 'drugs';
                } else if (self.productTypeEnum() == app.enums.PlanTypeEnum.MEDIGAP) {
                    return 'medigap';
                }
                return '';
            }, owner: this,
            deferEvaluation: true
        });
        self.getTabAnchor = ko.computed({
            read: function () {
                return '#' + self.getTabCodeName();
            },
            owner: this,
            deferEvaluation: true
        });

        self.coverageType = ko.observable('');
        self.showMedicalIndicator = ko.observable(false);
        self.showPrescriptionIndicator = ko.observable(false);
        self.plansPerPage = ko.observable(5);
        self.comparePlans = ko.observable('');
        self.compareXPlans = ko.observable('');
        self.compareXPlans_lbl = ko.computed({
            read: function () {
                if (self.tabIndex() == 0) {
                    var count = app.plans.MedicareAdvantageCompareList.getComparedPlansCount();
                } else if (self.tabIndex() == 1) {
                    var count = app.plans.PrescriptionDrugCompareList.getComparedPlansCount();
                } else if (self.tabIndex() == 2) {
                    var count = app.plans.MedigapCompareList.getComparedPlansCount();
                }
                return (count && count > 0) ? self.compareXPlans().format(count) : self.comparePlans();
            },
            owner: this
        });
        self.previousPage_lbl = ko.observable('');
        self.nextPage_lbl = ko.observable('');
        self.noPlans = ko.observable('');
        self.noPlans_lbl = ko.computed({
            read: function () {
                if (self.noPlans() && self.productType()) {
                    return self.noPlans().format(self.productType());
                }
                else {
                    return "";
                }
            },
            owner: this
        });

        self.allPlans = ko.observableArray([]);

        self.planCount = ko.computed({
            read: function () {
                if (this.allPlans().length > 0) {

                }
                return this.allPlans().length;
            },
            owner: this
        });

        self.planCount_lbl = ko.observable(0);

        self.displayPlansCountEnd = ko.observable(0);
        self.displayPlansCountEnd_lbl = ko.computed(function () {
            return self.displayPlansCountEnd() + 1;
        });

        self.displayPlansCountStart = ko.observable(0);
        self.displayPlansCountStart_lbl = ko.computed(function () {
            var countEnd = self.displayPlansCountEnd();
            return countEnd == -1 ? self.displayPlansCountStart() : self.displayPlansCountStart() + 1;
        });

        self.showPreviousPageLink = ko.computed(function () {
            return self.displayPlansCountStart() >= self.plansPerPage();
        });

        self.showNextPageLink = ko.computed(function () {
            return (((self.displayPlansCountEnd() - self.displayPlansCountStart()) == self.plansPerPage() - 1) && self.displayPlansCountEnd() != self.planCount() - 1);
        });

        self.showAll = ko.observable(false);
        self.MaxPlanNumber = ko.observable(5);

        self.maxPlanNumberComputed = ko.computed({
            read: function () {
                var numberOfPlans = self.allPlans().length;
                var max = self.MaxPlanNumber();

                return max < numberOfPlans ? max : numberOfPlans;
            },
            owner: this,
            deferEvaluation: true
        });

        self.displayPlans = ko.computed({
            read: function () {

                if (self.showAll()) {
                    return self.allPlans();
                } else {
                    var plans = [];
                    for (var i = 0; i < self.maxPlanNumberComputed(); i++) {
                        plans.push(self.allPlans()[i]);
                    }

                    return plans;
                }
            },
            owner: this
        });

        self.showAllClick = function showAllClick() {

            setTimeout(function() {
                  self.showAll(true)
             },10);

            setTimeout(function() {
            app.searchResults.setupSmartHover()},150);


            app.planDetails.setupUiExtensions();
        };

        self.comparedPlans = ko.observableArray([]);
        self.comparedPlansCount = ko.computed(function () {
            return self.comparedPlans().length;
        });

        SearchResultsTabGroupViewModel.prototype.loadFromJSON = function loadFromJSON(searchResultsTabViewModel) {
            var protoSelf = this;
            protoSelf.productType(searchResultsTabViewModel.ProductTypeLbl);
            protoSelf.coverageType(searchResultsTabViewModel.CoversLbl);
            protoSelf.showMedicalIndicator(searchResultsTabViewModel.ShowMedicalIndicator);
            protoSelf.showPrescriptionIndicator(searchResultsTabViewModel.ShowPrescriptionIndicator);
            protoSelf.comparePlans(searchResultsTabViewModel.ComparePlans_Lbl);
            protoSelf.compareXPlans(searchResultsTabViewModel.CompareXPlans_Lbl);
            protoSelf.previousPage_lbl(searchResultsTabViewModel.PreviousPage_Lbl);
            protoSelf.nextPage_lbl(searchResultsTabViewModel.NextPage_Lbl);
            protoSelf.noPlans(searchResultsTabViewModel.NoPlans_Lbl);
            return protoSelf;
        };

        SearchResultsTabGroupViewModel.prototype.setAllPlans = function setAllPlans(plans) {
            var protoSelf = this, plan;
            var newPlans = [];
            for (var i = 0; i < plans.length; i++) {
                plan = plans[i];
                newPlans.push(plan);
                   
            }
            protoSelf.allPlans(newPlans);

            protoSelf.displayPlansCountEnd(protoSelf.plansPerPage() > protoSelf.planCount() ? protoSelf.planCount() - 1 : protoSelf.plansPerPage() - 1);
            return protoSelf;
        };

        SearchResultsTabGroupViewModel.prototype.loadNextPageOfPlans = function loadNextPageOfPlans() {
            var protoSelf = this;
            var nextStartCount = protoSelf.displayPlansCountStart() + protoSelf.plansPerPage();
            protoSelf.displayPlansCountStart(nextStartCount);
            var nextEndCount = protoSelf.displayPlansCountEnd() + protoSelf.plansPerPage();
            if (nextEndCount >= protoSelf.planCount()) {
                nextEndCount = protoSelf.planCount() - 1;
            }
            protoSelf.displayPlansCountEnd(nextEndCount);
            if (app && app.searchResults && $.isFunction(app.searchResults.setupSmartHover)) app.searchResults.setupSmartHover();
            $('html,body').animate({ scrollTop: 0 }, 0);
            return protoSelf;
        };

        SearchResultsTabGroupViewModel.prototype.loadPreviousPageOfPlans = function loadPreviousPageOfPlans() {
            var protoSelf = this;
            protoSelf.displayPlansCountStart(protoSelf.displayPlansCountStart() - protoSelf.plansPerPage());
            protoSelf.displayPlansCountEnd(protoSelf.displayPlansCountStart() + protoSelf.plansPerPage() - 1);
            if (app && app.searchResults && $.isFunction(app.searchResults.setupSmartHover)) app.searchResults.setupSmartHover();
            $('html,body').animate({ scrollTop: 0 }, 0);
            return protoSelf;
        };
    };

} (EXCHANGE, this));
