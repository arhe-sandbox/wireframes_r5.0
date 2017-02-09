(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');
    //    ns.PlanDrugCostViewModel = function PlanDrugCostViewModel() {
    //        if (!(this instanceof PlanDrugCostViewModel)) {
    //            return new PlanDrugCostViewModel();
    //        }
    //        var self = this;

    //        self.PPharmacyCost = ko.observable(EXCHANGE.viewModels.PlanDetailsViewModel.plan.detailsAttributeTemplate.AttributeGroups[3].Attributes[2].AttributeValues[0].Value.split('$')[1]);

    //    }
    ns.PlanDrugCostsViewModel = function PlanDrugCostsViewModel() {
        if (!(this instanceof PlanDrugCostsViewModel)) {
            return new PlanDrugCostsViewModel();
        }
        var self = this;
        self.DrugCosts = {};
        self.items = ko.observableArray([]);
        self.addItem = function addItem(item) {
            self.items.push(item);
        };
    }
    ns.RecResultsViewModel = function RecResultsViewModel() {
        if (!(this instanceof RecResultsViewModel)) {
            return new RecResultsViewModel();
        }
        var self = this;

        self.recResultsDoneLoading = ko.observable(false);
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
                if (!this.recResultsDoneLoading()) {
                    if (this.tab0.planCount() > 0 ||
                        this.tab1.planCount() > 0 ||
                        this.tab2.planCount() > 0) {
                        this.recResultsDoneLoading(true);
                        EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.RecResult.RecResultsClientViewModel");
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
        self.gapTabCost = ko.observable('');
        self.maTabCost = ko.observable('');
        self.pdpTabCost = ko.observable('');

        self.mapdTopPlan = ko.observable('');
        self.gapTopPlan = ko.observable('');
        self.maTopPlan = ko.observable('');
        self.pdpTopPlan = ko.observable('');

        self.mapdTopScore = ko.observable('');
        self.maTopScore = ko.observable('');
        self.gapTopScore = ko.observable('');
        self.pdpTopScore = ko.observable('');
        self.UserPicwellId = ko.observable('');
        self.TxnId = ko.observable('');
        self.LeastCostPlanId = ko.observable('');

        self.totalMAPDPCost = ko.observable('');

        self.recommendedTab = ko.observable('');
        self.recCoverageDesired = ko.observable('');        //answer to desired coverage type on profile page
        self.coverageBeginsDate = ko.observable('');
        self.planPreference = ko.observable('');
        self.dentalAns = ko.observable('');
        self.visionAns = ko.observable('');
        self.location = ko.observable('');
        /* self.weFoundXPlans_desc = ko.observable('');
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
        */
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
        /*
        self.learn_lbl = ko.observable('');
        self.learn_desc = ko.observable('');
        self.breadcrumb1_lbl = ko.observable('');
        self.breadcrumb2_lbl = ko.observable('');
        self.breadcrumb3_lbl = ko.observable('');

        self.plansInCart = ko.observable(0);

        self.medigapLongDesc_lbl = ko.observable('');
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

        self.prescriptionDrugLongDesc_lbl = ko.observable('');
        self.medicareAdvantageLongDesc_lbl = ko.observable('');

        self.totalCostEstimator_lbl = ko.observable('');
        self.estimateMedicationCosts_lbl = ko.observable('');
        self.showComparison_lbl = ko.observable('');
        self.compareSideBySide_lbl = ko.observable('');
        */
        self.showMoreRecPlans_lbl = ko.observable('');
        self.chooseInsuranceType_lbl = ko.observable('');
        self.InvalidPlanComboInCartErrMsg_Lbl = ko.observable('');
        self.InvalidPlanComboInCartErrTitle_Lbl = ko.observable('');
        self.PreEligMsgTitle_Lbl = ko.observable('');
        self.PreEligMsg_Lbl = ko.observable('');
        self.PreEligFailMsg_Lbl = ko.observable('');
        self.InEligiblePlan = ko.observable({});
        self.DoTargetDtUpdate = ko.observable(false);
        self.goBack_Lbl = ko.observable('');

        RecResultsViewModel.prototype.loadFromJSON = function loadFromJSON(RecResults, planLists, recProfile) {
            var protoSelf = this;
            if (RecResults.GapTabCost != "") {
                protoSelf.gapTabCost("#1 Plan: ${0} Total Annual Cost".format(RecResults.GapTabCost));
            }
            else {
                protoSelf.gapTabCost("");
            }
            if (RecResults.MaTabCost != "") {
                protoSelf.maTabCost("#1 Plan: ${0} Total Annual Cost".format(RecResults.MaTabCost));
            }
            else {
                protoSelf.maTabCost("");
            }
            if (RecResults.PdpTabCost != "") {
                protoSelf.pdpTabCost("#1 Plan: ${0} Total Annual Cost".format(RecResults.PdpTabCost));
            }
            else {
                protoSelf.pdpTabCost("");
            }

            protoSelf.mapdTopPlan = RecResults.mapdTopPlan;
            protoSelf.gapTopPlan = RecResults.gapTopPlan;
            protoSelf.maTopPlan = RecResults.maTopPlan;
            protoSelf.pdpTopPlan = RecResults.pdpTopPlan;

            protoSelf.mapdTopScore = RecResults.mapdTopScore;
            protoSelf.maTopScore = RecResults.maTopScore;
            protoSelf.gapTopScore = RecResults.gapTopScore;
            protoSelf.pdpTopScore = RecResults.pdpTopScore;
            protoSelf.UserPicwellId = RecResults.UserPicwellId;
            protoSelf.TxnId = RecResults.TrxId;
            protoSelf.LeastCostPlanId = RecResults.LeastCostPlanId;


            protoSelf.totalMAPDPCost(parseFloat(RecResults.GapTabCost) + parseFloat(RecResults.PdpTabCost));
            protoSelf.recommendedTab(RecResults.RecommendedTab);

            protoSelf.recCoverageDesired(RecResults.DesiredCoverage);
            protoSelf.location(recProfile.CountyName);
            protoSelf.coverageBeginsDate(recProfile.CoverageBegins_Tb);

            protoSelf.planPreference(recProfile.PlanPreference_Ans);
            protoSelf.dentalAns(recProfile.Dental_Ans);
            protoSelf.visionAns(recProfile.Vision_Ans);

            protoSelf.tab0 = protoSelf.tab0.loadFromJSON(RecResults.SearchResultsTabViewModels[0]);
            protoSelf.tab0.productTypeEnum(app.exchangeContext.ExchangeContext.tabOrder()[0]);
            protoSelf.tab1 = protoSelf.tab1.loadFromJSON(RecResults.SearchResultsTabViewModels[1]);
            protoSelf.tab1.productTypeEnum(app.exchangeContext.ExchangeContext.tabOrder()[1]);
            protoSelf.tab2 = protoSelf.tab2.loadFromJSON(RecResults.SearchResultsTabViewModels[2]);
            protoSelf.tab2.productTypeEnum(app.exchangeContext.ExchangeContext.tabOrder()[2]);

            // protoSelf.medigapLongDesc_lbl(RecResults.MedigapLongDesc_Lbl);
            //  protoSelf.medigapAgentLongDesc_lbl(RecResults.MedigapAgentLongDesc_Lbl);
            //  protoSelf.prescriptionDrugLongDesc_lbl(RecResults.PrescriptionDrugLongDesc_Lbl);
            //   protoSelf.medicareAdvantageLongDesc_lbl(RecResults.MedicareAdvantageLongDesc_Lbl);

            //  protoSelf.totalCostEstimator_lbl(RecResults.TotalCostEstimator_Lbl);
            //   protoSelf.estimateMedicationCosts_lbl(RecResults.EstimateMedicationCosts_Lbl);
            //    protoSelf.showComparison_lbl(RecResults.ShowComparison_Lbl);
            //    protoSelf.compareSideBySide_lbl(RecResults.CompareSideBySide_Lbl);
            protoSelf.showMoreRecPlans_lbl(RecResults.ShowMoreRecPlans_Lbl);
            protoSelf.chooseInsuranceType_lbl(RecResults.ChooseInsuranceType_Lbl);
            // LoadPlanSection
            /*
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
            */
        };
        RecResultsViewModel.prototype.getPlanByPlanGuid = function getPlanByPlanGuid(planGuid) {

            var protoSelf = this;
            return protoSelf.allPlansInSearchResults().find(function (element) {
                if (element.planGuid == planGuid)
                    return true;
                else
                    return false;
            });
        };


        RecResultsViewModel.prototype.loadFromActivePlans = function loadFromActivePlans() {
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

}(EXCHANGE, this));


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

        self.recommended = ko.computed({
            read: function () {
                if (self.productTypeEnum() == app.enums.PlanTypeEnum.MEDICAREADVANTAGE && app.viewModels.RecResultsViewModel.recommendedTab() == "advantage") {
                    return true;
                } else if (self.productTypeEnum() == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG && app.viewModels.RecResultsViewModel.recommendedTab() == "drugs") {
                    return true;
                } else if (self.productTypeEnum() == app.enums.PlanTypeEnum.MEDIGAP && app.viewModels.RecResultsViewModel.recommendedTab() == "medigap") {
                    return true;
                }
                return false;
            }, owner: this,
            deferEvaluation: true
        });

        self.isDisabled = ko.computed({
            read: function () {

                if (app.viewModels.RecResultsViewModel.recCoverageDesired() == "2") {
                    if (self.productTypeEnum() == app.enums.PlanTypeEnum.MEDICAREADVANTAGE ||
                    self.productTypeEnum() == app.enums.PlanTypeEnum.MEDIGAP) {
                        return true;
                    }
                }

                if (app.viewModels.RecResultsViewModel.recCoverageDesired() == "1") {
                    if (self.productTypeEnum() == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
                        return true;
                    }
                }
                return false;
            }, owner: this,
            deferEvaluation: true
        });

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

        self.TotalOOPwCart = ko.computed({
            read: function () {
                var curTab = app.viewModels.RecResultsViewModel.currentTabIndex();
                var ShowTotal = false;
                var OtherPlanLbl = "";
                var OtherPlanOOP = 0;
                for (var ii = 0; ii < app.user.UserSession.ShoppingCartPlans.plans().length; ii++) {
                    var otherPlan = app.viewModels.SearchResultsViewModel.getPlanByPlanGuid(app.user.UserSession.ShoppingCartPlans.plans()[ii].PlanId);
                    if (otherPlan) {

                        if ((otherPlan.planType == app.enums.PlanTypeEnum.MEDIGAP && curTab == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) ||
                     (otherPlan.planType == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG && curTab == app.enums.PlanTypeEnum.MEDIGAP)) {

                            ShowTotal = true;
                            OtherPlanLbl = "Total Out of Pocket with {0} ".format(otherPlan.planName_lbl);
                            OtherPlanOOP = otherPlan.PW.RecommendationInfo.AnnualCost;
                            break;
                        }
                    }
                }
                var OppositePlanLink = { show: ShowTotal, label: OtherPlanLbl, OOP: OtherPlanOOP };
                return OppositePlanLink;
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
                    for (var i = 0; i < self.maxPlanNumberComputed() ; i++) {
                        plans.push(self.allPlans()[i]);
                    }

                    return plans;
                }
            },
            owner: this
        });

        self.showAllClick = function showAllClick() {
            self.showAll(true);
            app.recResults.setupSmartHover();
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

}(EXCHANGE, this));
