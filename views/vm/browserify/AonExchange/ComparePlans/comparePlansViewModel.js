(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.ComparePlansViewModel = function ComparePlansViewModel() {
        if (!(this instanceof ComparePlansViewModel)) {
            return new ComparePlansViewModel();
        }
        var self = this;
        var emptyTemplate = ko.observable({ AttributeGroups: [{ Attributes: [{ AttributeValues: []}]}] });
        // var planVmArray = [new app.models.PlanSearchResultsViewModel(0), new app.models.PlanSearchResultsViewModel(0), new app.models.PlanSearchResultsViewModel(0)];
        var planVmArray = [];
        //        planVmArray[0].detailsAttributeTemplate = emptyTemplate;
        //        planVmArray[1].detailsAttributeTemplate = emptyTemplate;
        //        planVmArray[2].detailsAttributeTemplate = emptyTemplate;

        self.planList = ko.observableArray(planVmArray);

        self.numberOfPlans = function () {
            if (self.planList && self.planList())
                return self.planList().length;

            return 0;
        };
        self.tabId = ko.observable(0);
        self.header_lbl = '';
        self.fullHeader_lbl = ko.computed({
            read: function () {
                return self.header_lbl.format(self.numberOfPlans()).replace("{2}", self.tabId());
            },
            owner: this
        });
        self.highlightDifferences_lbl = '';
        self.expandAll_lbl = '';
        self.collapseAll_lbl = '';
        self.printBtn_lbl = '';
        self.removeBtn_lbl = '';
        self.addBtn_lbl = '';
        self.planOverviewHeader_lbl = '';
        self.getPlanDocuments_lbl = '';
        self.coversMedical_lbl = '';
        self.coversPrescription_lbl = '';
        self.dental_lbl = '';
        self.vision_lbl = '';
        self.includedCoverage_lbl = '';
        self.optionalCoverage_lbl = '';
        self.myMedications_lbl = '';
        self.planRange_lbl = '';
        self.tierDetails_lbl = '';
        self.tierAttributeLink_lbl = '';
        self.priorAuth_Lbl = '';
        self.quantityLimit_Lbl = '';
        self.stepTherapy_Lbl = '';
        self.priorAuthDesc_Lbl = '';
        self.quantityLimitDesc_Lbl = '';
        self.stepTherapyDesc_Lbl = '';
        self.noRestrictions_lbl = '';

        self.forDetails_lbl = '';
        self.notCovered_lbl = '';
        self.chooseMedications_lbl = '';
        self.changeMedications_lbl = '';
        self.xofYCovered_lbl = '';
        self.myMedicationsCovered_lbl = '';
        self.backBtn_lbl = '';
        self.footer_lbl = '';
        self.checkoutBtn_lbl = '';
        self.rightSidePlaceholder_lbl = ko.observable('');

        self.whatWillTotalCostsBe_lbl = '';
        self.tceDetails_lbl = '';
        self.estimatedTotalCost_lbl = '';
        self.includePrescriptionToggle = ko.observable(true);
        self.includePrescription = ko.computed({
            read: function () {
                if (self.includePrescriptionToggle()) {
                    if (self.planList() && self.planList().length > 0) {
                        var haveRxData = self.planList()[0].haveRxData();
                        return haveRxData;
                    }
                }
                return false;
            },
            owner: this
        });
        self.showTcePrescriptionData = function () {
            if (self.includePrescriptionToggle()) {
                self.includePrescriptionToggle(false);
                return;
            } else if (self.includePrescriptionToggle() == false) {
                if (self.planList() && self.planList().length > 0) {
                    var haveRxData = self.planList()[0].haveRxData;
                    if (haveRxData) {
                        self.includePrescriptionToggle(true);
                        return;
                    }
                }
            }
            if (app.decisionSupport) {
                app.decisionSupport.initializeDecisionSupport();
                app.decisionSupport.tabForLoad = "medication";
            }
            $.publish("EXCHANGE.lightbox.helpchoose.open");
        };
        self.includeMedicalToggle = ko.observable(true);
        self.includeMedical = ko.computed({
            read: function () {
                if (self.includeMedicalToggle()) {
                    if (self.planList() && self.planList().length > 0) {
                        var haveMedData = self.planList()[0].haveMedData();
                        return haveMedData;
                    }
                }
                return false;
            },
            owner: this
        });
        self.showTceMedicalData = function (e) {
            if (self.includeMedicalToggle()) {
                self.includeMedicalToggle(false);
                return;
            } else if (self.includeMedicalToggle() == false) {
                if (self.planList() && self.planList().length > 0) {
                    var haveMedData = self.planList()[0].haveMedData();
                    if (haveMedData) {
                        self.includeMedicalToggle(true);
                        return;
                    }
                }
            }
            $.publish("EXCHANGE.lightbox.medquestions.open");
        };

        self.printComparePlansLink = ko.computed({
            read: function () {
                var link = "/print-compare-plans.aspx?type=" + self.planList()[0].planType;
                if (app.user.UserSession.UserPharmacies && app.user.UserSession.UserPharmacies.selectedPharmacy()) {
                    link += '&PharmacyId=' + app.user.UserSession.UserPharmacies.selectedPharmacy().Id;
                }

                return link;
            },
            deferEvaluation: true,
            owner: this
        });

        self.tceNeedInfo_lbl = '';
        self.tceNotSelected_html = '';
        self.tceNotCovered_html = '';

        self.tceIncludePrescription_lbl = '';
        self.tceIncludeMedical_lbl = '';
        self.tceIncludeAnnual_lbl = '';

        self.tcePrescriptionExpenses_lbl = '';
        self.tceMedicalExpenses_lbl = '';
        self.tceAnnualPremium_lbl = '';

        self.tceTeaser_hdr = '';
        self.tceTeaserBody_lbl = '';
        self.tceEnable_lbl = '';

        self.medTeaser_hdr = '';
        self.medTeaserBody_lbl = '';
        self.medTeaserAddMeds_lbl = '';

        self.changeDrugsOrMedicalExpenses_lbl = '';

        self.includeAnnual = ko.observable(true);
        self.includeAnnual.subscribe(function (val) {
            if (!val) {
                self.includeAnnual(true);
            }
        });

        self.rightSide_lbl = ko.computed({
            read: function () {
                return self.rightSidePlaceholder_lbl().format(self.numberOfPlans());
            },
            owner: this
        });

        self.medicationsInCabinet = ko.computed({
            read: function () {
                if (app.user && app.user.UserSession && app.user.UserSession.UserDrugs && app.user.UserSession.UserDrugs.drugs()) {
                    if (app.user.UserSession.UserDrugs.drugs().length > 0) {
                        return true;
                    }
                }
                return false;
            },
            owner: this
        });

        self.compareClass = function () {
            return 'compare' + self.numberOfPlans();
        };

        self.showOptionalCoverageRow = ko.computed({
            read: function () {
                if (!self.planList())
                    return false;
                for (var i = 0; i < self.planList().length; i++) {
                    if (self.planList()[i] && self.planList()[i].riderDentIndicator_bool() || self.planList()[i].riderVisIndicator_bool()) {
                        return true;
                    }
                }
                return false;
            }, owner: this,
            deferEvaluation: true
        });
        self.rxIndicator_bool = ko.computed({
            read: function () {
                for (var i = 0; i < self.planList().length; i++) {
                    if (self.planList()[i] && self.planList()[i].rxIndicator_bool) {
                        return true;
                    }
                }
                return false;
            }, owner: this,
            deferEvaluation: true
        });
        self.showDoctorFinderRow = ko.computed({
            read: function () {
                if (!self.planList())
                    return false;
                for (var i = 0; i < self.planList().length; i++) {
                    if (self.planList()[i] && self.planList()[i].PPCID) {
                        return true;
                    }
                }
                return false;
            }, owner: this,
            deferEvaluation: true
        });
        self.showRxCoveredRow = ko.computed({
            read: function () {

                if (!self.planList())
                    return false;
                for (var i = 0; i < self.planList().length; i++) {
                    if (self.planList()[i] && self.planList()[i].showDrugsCovered()) {
                        return true;
                    }
                }
                return false;
            }, owner: this,
            deferEvaluation: true
        });
        self.showPlanDocumentsRow = ko.computed({
            read: function () {
                if (!self.planList())
                    return false;

                var planVms = self.planList();

                for (var i = 0; i < self.planList().length; i++) {
                    if (planVms[i] && planVms[i].documents) {
                        if (planVms[i].documents.length > 0) {
                            return true;
                        }
                    }
                }
                return false;
            }, owner: this,
            deferEvaluation: true
        });

        self.showPlanDocumentsPlan0 = ko.computed({
            read: function () {

                if (!self.planList())
                    return false;

                if (self.planList().length > 0) {
                    var planVm = self.planList()[0];
                    if (planVm.documents && planVm.documents.length > 0) {
                        return true;
                    }
                }
                return false;
            }, owner: this,
            deferEvaluation: true
        });
        self.showPlanDocumentsPlan1 = ko.computed({
            read: function () {
                if (!self.planList())
                    return false;

                if (self.planList().length > 1) {
                    var planVm = self.planList()[1];
                    if (planVm.documents && planVm.documents.length > 0) {
                        return true;
                    }
                }
                return false;
            }, owner: this,
            deferEvaluation: true
        });
        self.showPlanDocumentsPlan2 = ko.computed({
            read: function () {

                if (!self.planList())
                    return false;

                if (self.planList().length > 2) {
                    var planVm = self.planList()[2];
                    if (planVm.documents && planVm.documents.length > 0) {
                        return true;
                    }
                }
                return false;
            }, owner: this,
            deferEvaluation: true
        });
        self.shouldShowMedicationSection = ko.computed({
            read: function () {
                var show = false;
                $.each(self.planList(), function (index, plan) {
                    if (plan.rxCovered_bool) {
                        show = true;
                        return false;
                    }
                });
                return show;
            },
            owner: this,
            deferEvaluation: true
        });
        self.shouldShowMedicalSection = ko.computed({
            read: function () {
                var show = false;
                /* commenting out until medical tce get enabled.
                
                $.each(self.planList(), function (index, plan) {
                if (plan.medCovered_bool()) {
                show = true;
                return false;
                }
                });
                */
                return show;
            },
            owner: this,
            deferEvaluation: true
        });

        self.shouldShowTceTeaser = ko.computed({
            read: function () {
                var show = true;
                $.each(self.planList(), function (index, plan) {
                    if (!plan.hasBeenLoaded) {
                        return true; //continue
                    }
                    if (plan.haveTceData()) {
                        show = false;
                        return false; //break
                    }
                });

                return show;
            },
            owner: this,
            deferEvaluation: true
        });

        self.shouldShowTceSpinner = ko.computed({
            read: function () {
                if ((self.planList().length > 0 && self.planList()[0].tceLoading)
                    || (self.planList().length > 1 && self.planList()[1].tceLoading)
                    || (self.planList().length > 2 && self.planList()[2].tceLoading)) {
                    return true;
                }
                return false;
            },
            owner: this,
            deferEvaluation: true
        });

        self.shouldShowPlanDrugsSpinner = ko.computed({
            read: function () {
                if ((self.planList().length > 0 && self.planList()[0].planDrugsLoading())
                    || (self.planList().length > 1 && self.planList()[1].planDrugsLoading())
                    || (self.planList().length > 2 && self.planList()[2].planDrugsLoading())) {
                    return true;
                }
                return false;
            },
            owner: this,
            deferEvaluation: true
        });


        ComparePlansViewModel.prototype.shouldShowAttributeCell = function shouldShowAttributeCell(planIndex, parentIndex, index) {
            var protoself = this;
            var attributeValues = EXCHANGE.viewModels.ComparePlansViewModel.planList()[planIndex].detailsAttributeTemplate.AttributeGroups[parentIndex].Attributes[index].AttributeValues;
            for (var i = 0; i < attributeValues.length; i++) {
                if (!attributeValues[i].NoAttributeValue) {
                    return true;
                }
            }
            return false;
        };


        ComparePlansViewModel.prototype.shouldShowAttributeRow = function shouldShowAttributeRow(parentIndex, index) {
            var protoself = this;
            var plan0Attributes = [];
            var plan1Attributes = [];
            var plan2Attributes = [];
            if (protoself.numberOfPlans() > 0) {
                plan0Attributes = protoself.planList()[0].detailsAttributeTemplate.AttributeGroups[parentIndex].Attributes[index].AttributeValues;
            }
            if (protoself.numberOfPlans() > 1) {
                plan1Attributes = protoself.planList()[1].detailsAttributeTemplate.AttributeGroups[parentIndex].Attributes[index].AttributeValues;
            }
            if (protoself.numberOfPlans() > 2) {
                plan2Attributes = protoself.planList()[2].detailsAttributeTemplate.AttributeGroups[parentIndex].Attributes[index].AttributeValues;
            }
            for (var i = 0; i < plan0Attributes.length; i++) {
                if (!plan0Attributes[i].NoAttributeValue) {
                    return true;
                }
            }
            for (var i = 0; i < plan1Attributes.length; i++) {
                if (!plan1Attributes[i].NoAttributeValue) {
                    return true;
                }
            }
            for (var i = 0; i < plan2Attributes.length; i++) {
                if (!plan2Attributes[i].NoAttributeValue) {
                    return true;
                }
            }
            return false;
        };

        ComparePlansViewModel.prototype.shouldShowAttributeGroup = function shouldShowAttributeGroup(index) {
            var protoself = this;
            var plan0AttributeGroup = [];
            var plan1AttributeGroup = [];
            var plan2AttributeGroup = [];
            if (protoself.numberOfPlans() > 0) {
                plan0AttributeGroup = protoself.planList()[0].detailsAttributeTemplate.AttributeGroups[index];
            }
            if (protoself.numberOfPlans() > 1) {
                plan1AttributeGroup = protoself.planList()[1].detailsAttributeTemplate.AttributeGroups[index];
            }
            if (protoself.numberOfPlans() > 2) {
                plan2AttributeGroup = protoself.planList()[2].detailsAttributeTemplate.AttributeGroups[index];
            }
            if (plan0AttributeGroup.Attributes) {
                for (var i = 0; i < plan0AttributeGroup.Attributes.length; i++) {
                    var attribute = plan0AttributeGroup.Attributes[i];
                    for (var j = 0; j < attribute.AttributeValues.length; j++) {
                        var attributeVal = attribute.AttributeValues[j];
                        if (!attributeVal.NoAttributeValue) {
                            return true;
                        }
                    }
                }
            }
            if (plan1AttributeGroup.Attributes) {
                for (var i = 0; i < plan1AttributeGroup.Attributes.length; i++) {
                    var attribute = plan1AttributeGroup.Attributes[i];
                    for (var j = 0; j < attribute.AttributeValues.length; j++) {
                        var attributeVal = attribute.AttributeValues[j];
                        if (!attributeVal.NoAttributeValue) {
                            return true;
                        }
                    }
                }
            }
            if (plan2AttributeGroup.Attributes) {
                for (var i = 0; i < plan2AttributeGroup.Attributes.length; i++) {
                    var attribute = plan2AttributeGroup.Attributes[i];
                    for (var j = 0; j < attribute.AttributeValues.length; j++) {
                        var attributeVal = attribute.AttributeValues[j];
                        if (!attributeVal.NoAttributeValue) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };

        ComparePlansViewModel.prototype.loadFromJSON = function loadFromJSON(comparedPlans) {
            var protoself = this;

            //Loop through the returned plans and update the AttributeGroups in AllPlansViewModels' corresponding plans
            var planList = [];
            for (var i = 0; i < comparedPlans.ComparedPlans.length; i++) {
                // var planVM = EXCHANGE.viewModels.SearchResultsViewModel.getPlanByPlanGuid(comparedPlans.ComparedPlans[i].Id);

                var planVM = EXCHANGE.models.PlanDetailsViewModel();
                var plan = {};
                plan["PlanDetails"] = comparedPlans.ComparedPlans[i];
                planVM = planVM.loadPlanDetails(comparedPlans.ComparedPlans[i].Id, plan);
                planList[i] = planVM.plan;  // PlanList holds list of PlanSearchResultsVMs
                planList[i]["PlanDetailsVM"] = planVM; // planList[i].PlanDetailsVM would hold PlanDetailsVM
            }


            protoself.planList(planList);

            loadLabels(protoself, comparedPlans);
            if (self.planList() && self.planList().length > 0) {
                protoself.includeMedicalToggle(self.planList()[0].haveMedData());
                protoself.includePrescriptionToggle(self.planList()[0].haveRxData());
            }
        };

        function loadLabels(protoself, comparedPlans) {
            protoself.header_lbl = comparedPlans.Header_Lbl;
            protoself.highlightDifferences_lbl = comparedPlans.HighlightDifferences_Lbl;
            protoself.expandAll_lbl = comparedPlans.ExpandAll_Lbl;
            protoself.collapseAll_lbl = comparedPlans.CollapseAll_Lbl;
            protoself.printBtn_lbl = comparedPlans.PrintBtn_Lbl;
            protoself.removeBtn_lbl = comparedPlans.RemoveBtn_Lbl;
            protoself.addBtn_lbl = comparedPlans.AddBtn_Lbl;
            protoself.planOverviewHeader_lbl = comparedPlans.PlanOverviewHeader_Lbl;
            protoself.getPlanDocuments_lbl = comparedPlans.GetPlanDocuments_Lbl;
            protoself.coversMedical_lbl = comparedPlans.CoversMedical_Lbl;
            protoself.coversPrescription_lbl = comparedPlans.CoversPrescription_Lbl;
            protoself.dental_lbl = comparedPlans.Dental_Lbl;
            protoself.vision_lbl = comparedPlans.Vision_Lbl;
            protoself.includedCoverage_lbl = comparedPlans.IncludedCoverage_Lbl;
            protoself.optionalCoverage_lbl = comparedPlans.OptionalCoverage_Lbl;
            protoself.myMedications_lbl = comparedPlans.MyMedications_Lbl;
            protoself.planRange_lbl = comparedPlans.PlanRange_Lbl;
            protoself.tierDetails_lbl = comparedPlans.TierDetails_Lbl;
            protoself.tierAttributeLink_lbl = comparedPlans.TierAttributeLink_Lbl;
            protoself.forDetails_lbl = comparedPlans.ForDetails_Lbl;
            protoself.notCovered_lbl = comparedPlans.NotCovered_Lbl;
            protoself.chooseMedications_lbl = comparedPlans.ChooseMedications_Lbl;
            protoself.changeMedications_lbl = comparedPlans.ChangeMedications_Lbl;
            protoself.xofYCovered_lbl = comparedPlans.XofYCovered_Lbl;
            protoself.myMedicationsCovered_lbl = comparedPlans.MyMedicationsCovered_Lbl;
            protoself.backBtn_lbl = comparedPlans.BackBtn_Lbl;
            protoself.footer_lbl = comparedPlans.Footer_Lbl;
            protoself.checkoutBtn_lbl = comparedPlans.CheckoutBtn_Lbl;
            protoself.rightSidePlaceholder_lbl(comparedPlans.RightSide_Lbl);
            protoself.tceDetails_lbl = comparedPlans.TceDetails_Lbl;
            protoself.estimatedTotalCost_lbl = comparedPlans.EstimatedTotalCost_Lbl;
            protoself.tceNeedInfo_lbl = comparedPlans.TceNeedInfo_Lbl;
            protoself.tceNotSelected_html = comparedPlans.TceNotSelected_Html;
            protoself.tceNotCovered_html = comparedPlans.TceNotCovered_Html;
            protoself.tceIncludePrescription_lbl = comparedPlans.TceIncludePrescription_Lbl;
            protoself.tceIncludeMedical_lbl = comparedPlans.TceIncludeMedical_Lbl;
            protoself.tceIncludeAnnual_lbl = comparedPlans.TceIncludeAnnual_Lbl;
            protoself.tcePrescriptionExpenses_lbl = comparedPlans.TcePrescriptionExpenses_Lbl;
            protoself.tceMedicalExpenses_lbl = comparedPlans.TceMedicalExpenses_Lbl;
            protoself.tceAnnualPremium_lbl = comparedPlans.TceAnnualPremium_Lbl;
            protoself.whatWillTotalCostsBe_lbl = comparedPlans.WhatWillTotalCostsBe_Lbl;
            protoself.changeDrugsOrMedicalExpenses_lbl = comparedPlans.ChangeDrugsOrMedicalExpenses_Lbl;
            protoself.tceTeaser_hdr = comparedPlans.TceTeaser_Hdr;
            protoself.tceTeaserBody_lbl = comparedPlans.TceTeaserBody_Lbl;
            protoself.tceEnable_lbl = comparedPlans.TceEnable_Lbl;
            protoself.medTeaser_hdr = comparedPlans.MedTeaser_Hdr;
            protoself.medTeaserBody_lbl = comparedPlans.MedTeaserBody_Lbl;
            protoself.medTeaserAddMeds_lbl = comparedPlans.MedTeaserAddMeds_Lbl;
            protoself.priorAuth_lbl = comparedPlans.PriorAuth_Lbl;
            protoself.quantityLimit_lbl = comparedPlans.QuantityLimit_Lbl;
            protoself.stepTherapy_lbl = comparedPlans.StepTherapy_Lbl;
            protoself.priorAuthDesc_lbl = comparedPlans.PriorAuthDesc_Lbl;
            protoself.quantityLimitDesc_lbl = comparedPlans.QuantityLimitDesc_Lbl;
            protoself.stepTherapyDesc_lbl = comparedPlans.StepTherapyDesc_Lbl;
            protoself.noRestrictions_lbl = comparedPlans.NoRestrictions_Lbl;

        }

        ComparePlansViewModel.prototype.loadFromJSONWithViewModelParams = function loadFromJSON(viewmodel, planViewModels) {
            var protoself = this;

            //change these bits
            //Loop through the returned plans and update the AttributeGroups in AllPlansViewModels' corresponding plans
            for (var i = 0; i < viewmodel.ComparedPlans.length; i++) {
                var planVM = planViewModels[i]; //the order will be the same between viewModel.ComparedPlans and planViewModels
                for (var j = 0; j < viewmodel.ComparedPlans[i].AttributeTemplates.length; j++) {
                    if (viewmodel.ComparedPlans[i].AttributeTemplates[j].TemplateCode == 1) {
                        planVM.detailsAttributeTemplate.AttributeGroups = viewmodel.ComparedPlans[i].AttributeTemplates[j].AttributeGroups;
                        protoself.planList()[i] = planVM;
                    }
                }
            }
            protoself.numberOfPlans(viewmodel.ComparedPlans.length);
            loadLabels(protoself, viewmodel);
        };

        return self;
    };

})(EXCHANGE);

(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.createPlanViewModel = function createPlanViewModel(plan) {
        var planModelCs = { Plan: plan };
        var planModelJs = new EXCHANGE.plans.PlanModel(planModelCs);
        var planVM = new app.models.PlanViewModel(app.viewModels.SearchResultsViewModel.currentTabIndex());
        planVM = planVM.loadFromPlan(planModelJs);
        return planVM;
    };
})(EXCHANGE);
