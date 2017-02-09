(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.PlanDetailsViewModel = function PlanDetailsViewModel() {
        if (!(this instanceof PlanDetailsViewModel)) {
            return new PlanDetailsViewModel();
        }
        var self = this;

        self.plan = new Object();
        self.planId = "";
        self.tceHeader_lbl = "";
        self.tceHowIsCalculated_hdr = "";
        self.tceHowIsCalculated_body = "";
        self.tceWhenWillPay_hdr = "";
        self.tceWhenWillPay_body = "";
        self.tceIncludeMyEstimated = "";
        self.tceChooseAtLeastOne = "";
        self.rxExpenseNotCovered_lbl = "";
        self.medExpenseNotCovered_lbl = "";
        self.tceRxExpenses_lbl = "";
        self.tceMedExpenses_lbl = "";
        self.tceAnnExpenses_lbl = "";
        self.tceBottom_lbl = "";
        self.deductible_lbl = "";
        self.medicareCoverageGap_lbl = "";
        self.catastrophicCoverage_lbl = "";
        self.tceHaveYourHealthcareNeedsChanged_lbl = "";
        self.tceChangeMedications_lbl = "";
        self.tceChangeMedExpenses_lbl = "";
        self.tceAddInfo_lbl = "";
        self.FromJanuary_Text = "";
        self.tceCalculate_lbl = "";
        self.addPharmacyText = 'Add a Pharmacy';
        self.preferredPharmacyText = 'Preferred Pharmacy';
        self.changePharmacyText = 'Change Pharmacy';
        self.mailOrderPharmacyText = 'Mail Order';
        self.showMedicationCostsForText = 'Show medication costs for:';
        self.header_lbl = '';
        self.expandAll_lbl = '';
        self.collapseAll_lbl = '';
        self.planOverviewHeader_lbl = '';
        self.getPlanDocuments_lbl = '';
        self.coversMedical_lbl = '';
        self.coversPrescription_lbl = '';
        self.dental_lbl = '';
        self.vision_lbl = '';
        self.includedCoverage_lbl = '';
        self.includedCoverageBrowse_lbl = '';
        self.optionalCoverage_lbl = '';
        self.optionalCoverageBrowse_lbl = '';
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
        self.planDetailsHeader_lbl = '';
        self.printDetails_lbl = '';
        self.printTempId_lbl = '';
        self.contactInfo_lbl = '';
        self.contactInformation_lbl = '';
        self.helpWithCoverage_lbl = '';
        self.contactInsurer_lbl = '';
        self.getStarted_lbl = '';
        self.showPremiums_lbl = '';
        self.browseMedicationsText_lbl = '';
        self.browsePlansHtml_lbl = '';
        self.findPlansText_lbl = '';

        self.printTempIdLink = '';

        self.medicationsChanged_lbl = '';
        self.areMedicationsCovered_html = '';
        self.myMedicationTeaser_lbl = '';
        self.addMyMedications_lbl = '';

        self.yourAdvisor_lbl = '';
        self.yourAdvisorFull_lbl = '';
        self.phoneWithExt_lbl = '';
        self.TTY_lbl = ko.observable('');
        self.advisorChanged_lbl = '';

        self.FromEffectiveBase = ko.observable("");
        self.tcePharmacy_radio = ko.observable('');

        self.medicareQuestions_lbl = '';
        self.medicareContact_lbl = '';
        self.SSQuestions_lbl = '';
        self.SSContact_lbl = '';
        self.MedicationCostTable_Header_Html = '';
        self.MedicationCostTable_DeductibleHeader_Text = '';
        self.MedicationCostTable_DeductibleCell_Text = '';
        self.MedicationCostTable_ZeroDeductibleCell_Text = '';
        self.MedicationCostTable_InitialCoverageHeader_Text = '';
        self.MedicationCostTable_InitialCoverageCell_Text = '';
        self.MedicationCostTable_CoverageGapHeader_Text = '';
        self.MedicationCostTable_CoverageGapReachedCell_Text = '';
        self.MedicationCostTable_CoverageGapNotReachedCell_Html = '';
        self.MedicationCostTable_CatastrophicCoverageHeader_Text = '';
        self.MedicationCostTable_CatastrophicCoverageReachedCell_Text = '';
        self.MedicationCostTable_CatastrophicCoverageNotReachedCell_Html = '';
        self.tceFromStartOfYear_radio = ko.observable("true");
        self.maxDrugTier = 5
        self.DrugCosts = ko.observableArray([]);
        self.TotalRetailCost = ko.observable('');
        self.TotalOOPCost = ko.observable('');
        self.TotalMailOOPCost = ko.observable('');
        self.CoverageDateString = ko.observable('');
        self.PreferredPharmacy = ko.observableArray([]);
        self.medicalCostDescription = ko.observable('');
        self.drug_lbl = ko.observable('');
        self.genericAvail_lbl = ko.observable('');
        self.tier_lbl = ko.observable('');
        self.costBreakdownDeductible_lbl = ko.observable('');
        self.costBreakdownInitialCoverage_lbl = ko.observable('');
        self.costBreakdownCoverageGap_lbl = ko.observable('');
        self.costBreakdownCatastrophicCoverage_lbl = ko.observable('');
        self.planDrugs = ko.observableArray([]);

        self.costBreakdownDeductible_lblDisplay = ko.computed({
            read: function () {

                return self.costBreakdownDeductible_lbl().format("<br/>" + "month");

            },
            owner: this,
            deferEvaluation: true
        });

        self.costBreakdownInitialCoverage_lblDisplay = ko.computed({
            read: function () {

                return self.costBreakdownInitialCoverage_lbl().format("<br/>" + "month");

            },
            owner: this,
            deferEvaluation: true
        });

        self.costBreakdownCoverageGap_lblDisplay = ko.computed({
            read: function () {

                return self.costBreakdownCoverageGap_lbl().format("<br/>" + "month");

            },
            owner: this,
            deferEvaluation: true
        });


        self.planDrugVms = ko.computed({
            read: function () {
                var vms = [];
                if (!app.user || !app.user.UserSession || !app.user.UserSession.UserDrugs || !app.user.UserSession.UserDrugs.drugs()) return null;
                var userDrugs = app.user.UserSession.UserDrugs.drugs();
                var planDrugs = self.planDrugs();
                var found;
                for (var i = 0; i < userDrugs.length; i++) {
                    found = false;
                    for (var j = 0; j < planDrugs.length; j++) {
                        if (userDrugs[i].SelectedDosage.Id == planDrugs[j].DosageId) {
                            vms.push(new ns.PlanDrugViewModel(planDrugs[j], self.maxDrugTier));
                            found = true;
                        }
                    }
                    if (!found) {
                        var emptyPlanDrug = { Tier: 0, DrugId: userDrugs[i].Drug.Id, DosageId: userDrugs[i].SelectedDosage.Id, PlanId: self.plan.Id };
                        vms.push(new ns.PlanDrugViewModel(emptyPlanDrug, self.maxDrugTier));
                    }
                }
                return vms;
            },
            owner: this,
            deferEvaluation: true
        });

        self.FromEffectiveDate_Text = ko.computed({
            read: function () {
                if (app.user.UserSession && app.user.UserSession.UserProfile && app.constants && app.constants.monthNames()) {
                    var date = moment(app.user.UserSession.UserProfile.coverageBeginsDate).utc();
                    if (date) {
                        return self.FromEffectiveBase().format(app.constants.monthNames()[date.month() + 1].LongMonthName);
                    }
                }

                return self.FromEffectiveBase();
            },
            owner: this,
            deferEvaluation: true
        });


        self.tceTotalDisplayPlanDetails = ko.computed({
            read: function () {
                if (app.sharedPlanDetails) {
                    var totals = app.sharedPlanDetails.getCorrectTotalsFromCostEstimate(self.plan.tceCost());
                    if (totals) {
                        var total = 0;
                        if (self.plan.rxCovered_bool && self.includePrescription()) {
                            total += totals.DrugCost;
                        }

                        if (self.plan.medCovered_bool && self.includeMedical()) {
                            total += totals.MedicalCost;
                        }

                        if (self.includeAnnual()) {
                            total += totals.PremiumCost;
                        }

                        return app.exchangeContext.ExchangeContext.currencySymbol() + total.toFixed(0);
                    }
                    return "";
                }
                return "";
            },
            owner: this,
            deferEvaluation: true
        });



        self.tceTotalDisplayPlanDetailsNoRounding = ko.computed({
            read: function () {
                if (app.sharedPlanDetails) {
                    var totals = app.sharedPlanDetails.getCorrectTotalsFromCostEstimate(self.plan.tceCost());
                    if (totals) {
                        var total = 0;
                        if (self.plan.rxCovered_bool && self.includePrescription()) {
                            total += totals.DrugCost;
                        }

                        if (self.plan.medCovered_bool && self.includeMedical()) {
                            total += totals.MedicalCost;
                        }

                        if (self.includeAnnual()) {
                            total += totals.PremiumCost;
                        }

                        return app.exchangeContext.ExchangeContext.currencySymbol() + total.toFixed(2);
                    }
                    return "";
                }
                return "";
            },
            owner: this,
            deferEvaluation: true
        });



        self.tceFromStartOfYear = ko.computed({
            read: function () {
                if (self.tceFromStartOfYear_radio() === "true") {
                    return true;
                }
                return false;
            },
            owner: this,
            deferEvaluation: true
        });

        self.printPlanDetailsLink = ko.computed({
            read: function () {
                var link = "/print-plan-details.aspx?planid=" + self.plan.planGuid;
                if (self.tceFromStartOfYear()) {
                    link += '&fromyearstart=' + self.tceFromStartOfYear() + '&PharmacyId=' + app.user.UserSession.UserPharmacies.selectedPharmacy().Id;

                }

                return link;
            },
            deferEvaluation: true,
            owner: this
        });




        self.startOfDeductibleMonth = ko.computed({
            read: function () {
                var month = 1;
                if (!self.tceFromStartOfYear() && app.user && app.user.UserSession && app.user.UserSession.UserProfile) {
                    var date = moment(app.user.UserSession.UserProfile.coverageBeginsDate).utc();
                    if (date) {
                        month = date.month() + 1;
                    }
                }

                if (app.constants && app.constants.monthNames()) {
                    return app.constants.monthNames()[month].LongMonthName;
                }

                return "";
            },
            owner: this,
            deferEvaluation: true
        });

        self.deductibleMetMonth = ko.computed({
            read: function () {
                var month = 12;
                if (app.planDetails) {
                    var overlay = app.sharedPlanDetails.getCorrectOverlaysFromCostEstimate(self.plan.tceCost());
                    if (overlay && overlay.WillHitDeductible) {
                        month = overlay.DeductibleHitMonthId;
                    }
                }

                if (app.constants && app.constants.monthNames()) {
                    return app.constants.monthNames()[month].LongMonthName;
                }

                return "";
            },
            owner: this,
            deferEvaluation: true
        });

//        self.coverageGapHitMonth = ko.computed({
//            read: function () {
//                var month = null;
//                if (app.planDetails) {
//                    var overlay = app.sharedPlanDetails.getCorrectOverlaysFromCostEstimate(self.plan.tceCost());
//                    if (overlay && overlay.WillHitCoverageGap) {
//                        month = overlay.CoverageGapStartMonthId;
//                    }
//                }

//                if (month && app.constants && app.constants.monthNames()) {
//                    return app.constants.monthNames()[month].LongMonthName;
//                }

//                return "";
//            },
//            owner: this,
//            deferEvaluation: true
//        });
       


//        self.catastrophicCoverageHitMonth = ko.computed({
//            read: function () {
//                var month = 12;
//                if (app.planDetails) {
//                    var overlay = app.sharedPlanDetails.getCorrectOverlaysFromCostEstimate(self.plan.tceCost());
//                    if (overlay && overlay.WillHitCatastropicCoverage) {
//                        month = overlay.CatastropicCoverageStartMonthId;
//                    }
//                }

//                if (month && app.constants && app.constants.monthNames()) {
//                    return app.constants.monthNames()[month].LongMonthName;
//                }

//                return "";
//            },
//            owner: this,
//            deferEvaluation: true
//        });

      
        // Bug 77220: Modified the above commented code to below
        self.coverageGapHitMonth = ko.computed({
            read: function () {
                var month = null;
                if (app.planDetails) {
                    var overlay = app.sharedPlanDetails.getCorrectOverlaysFromCostEstimate(self.plan.tceCost());
                    if (overlay && overlay.WillHitCoverageGap) {
                        month = overlay.CoverageGapStartMonthId;
                        if (!self.tceFromStartOfYear()) {
                            //                            var hitDate = new Date(EXCHANGE.viewModels.PlanDetailsViewModel.coverageGapHitMonth());
                            var coveragebeginsDate = moment(app.user.UserSession.UserProfile.coverageBeginsDate).utc();
                            CovBeginmonth = coveragebeginsDate.month() + 1;
                            if (month < CovBeginmonth) {
                                month = CovBeginmonth;
                            }

                        }

                    }
                }

                if (month && app.constants && app.constants.monthNames()) {
                    return app.constants.monthNames()[month].LongMonthName;
                }

                return "";
            },
            owner: this,
            deferEvaluation: true
        });

        self.catastrophicCoverageHitMonth = ko.computed({
            read: function () {
                var month = 12;
                if (app.planDetails) {
                    var overlay = app.sharedPlanDetails.getCorrectOverlaysFromCostEstimate(self.plan.tceCost());
                    if (overlay && overlay.WillHitCatastropicCoverage) {
                        month = overlay.CatastropicCoverageStartMonthId;
                        if (!self.tceFromStartOfYear()) {
                            //var hitDate = new Date(EXCHANGE.viewModels.PlanDetailsViewModel.coverageGapHitMonth());
                            var coveragebeginsDate = moment(app.user.UserSession.UserProfile.coverageBeginsDate).utc();
                            CovBeginmonth = coveragebeginsDate.month() + 1;
                            if (month < CovBeginmonth) {
                                month = CovBeginmonth;
                            }
                            var date = moment(app.user.UserSession.UserProfile.coverageBeginsDate).utc();

                        }




                    }
                }

                if (month && app.constants && app.constants.monthNames()) {
                    return app.constants.monthNames()[month].LongMonthName;
                }

                return "";
            },
            owner: this,
            deferEvaluation: true
        });
        // Bug 77220: Ends here
        self.hitsCatastrophicCoverage = ko.computed({
            read: function () {
                if (app.planDetails) {
                    var overlay = app.sharedPlanDetails.getCorrectOverlaysFromCostEstimate(self.plan.tceCost());
                    if (overlay && overlay.WillHitCatastropicCoverage) {
                        return true;
                    }
                }

                return false;
            },
            owner: this,
            deferEvaluation: true
        });

        self.catastrophicCoverageEndMonth = ko.computed({
            read: function () {
                var month = 12;
                if (app.constants && app.constants.monthNames()) {
                    return app.constants.monthNames()[month].LongMonthName;
                }

                return "";
            },
            owner: this,
            deferEvaluation: true
        });
        self.showOptionalCoverageRow = ko.computed({
            read: function () {
                if (self.plan.riderDentIndicator_bool() || self.plan.riderVisIndicator_bool()) {
                    return true;
                }
                return false;
            },
            owner: this,
            deferEvaluation: true
        });
        self.includePrescription = ko.observable(true);
        self.includeMedical = ko.observable(true);
        self.includeAnnual = ko.observable(true);
        self.includeAnnual.subscribe(function (val) {
            if (!val) {
                self.includeAnnual(true);
            }
        });


        self.contactInsurer = ko.computed({
            read: function () {
                return self.contactInsurer_lbl.format(self.plan.insurerName);
            },
            owner: this,
            deferEvaluation: true
        });
        self.insurerPhone = ko.computed({
            read: function () {
                return self.plan.insurerPhone;
            },
            owner: this,
            deferEvaluation: true
        });
        self.insurerUrl = ko.computed({
            read: function () {
                return self.plan.insurerUrl;
            },
            owner: this,
            deferEvaluation: true
        });

        self.showYourAdvisorName = ko.computed({
            read: function () {
                if (app.user && app.user.UserSession && app.user.UserSession.UserProfile) {
                    return app.user.UserSession.UserProfile.advisorName() == '' || typeof app.user.UserSession.UserProfile.advisorName() == "undefined";
                }
                return '';
            },
            owner: this,
            deferEvaluation: true
        });
        self.yourAdvisorName = ko.computed({
            read: function () {
                if (app.user && app.user.UserSession && app.user.UserSession.UserProfile) {
                    return app.user.UserSession.UserProfile.advisorName();
                }
                return '';
            },
            owner: this,
            deferEvaluation: true
        });
        self.yourAdvisorPhone = ko.computed({
            read: function () {
                if (app.user && app.user.UserSession && app.user.UserSession.UserProfile) {
                    if (app.user.UserSession.UserProfile.advisorExtension() != '') {
                        return self.phoneWithExt_lbl.format(app.user.UserSession.UserProfile.advisorPhone(), app.user.UserSession.UserProfile.advisorExtension());
                    }
                    return app.user.UserSession.UserProfile.advisorPhone();
                }
                return '';
            },
            owner: this,
            deferEvaluation: true
        });
        self.showYourAdvisorTTY = ko.computed({
            read: function () {
                if (app.user && app.user.UserSession && app.user.UserSession.UserProfile) {
                    return app.user.UserSession.UserProfile.advisorTTY() != '' && typeof app.user.UserSession.UserProfile.advisorTTY() != "undefined";
                }
                return '';
            },
            owner: this,
            deferEvaluation: true
        });
        self.yourAdvisorTTY = ko.computed({
            read: function () {
                if (app.user && app.user.UserSession && app.user.UserSession.UserProfile) {
                    return self.TTY_lbl().format(app.user.UserSession.UserProfile.advisorTTY());
                }
                return '';
            },
            owner: this,
            deferEvaluation: true
        });
        self.showAdvisorChanged = ko.computed({
            read: function () {
                if (app.user && app.user.UserSession && app.user.UserSession.UserProfile) {
                    return app.user.UserSession.UserProfile.advisorChangedInLast90Days() != '' && typeof app.user.UserSession.UserProfile.advisorChangedInLast90Days != "undefined" && app.user.UserSession.UserProfile.advisorChangedInLast90Days() == true;
                }
                return '';
            },
            owner: this,
            deferEvaluation: true
        });


        self.xofYCoveredCount_lbl = ko.computed({
            read: function () {
                var planDrugs = self.planDrugs();
                if (planDrugs == null) return '';
                var covered = 0;
                for (var i = 0; i < planDrugs.length; i++) {
                    var planDrug = planDrugs[i];
                    if (planDrug.Tier > 0) {
                        covered++;
                    }
                }
                var str = app.viewModels.PlanSharedResourceStrings.xofYCovered_lbl;
                var myMedCount = 0;
                if (app.user && app.user.UserSession && app.user.UserSession.UserDrugs && app.user.UserSession.UserDrugs.drugs()) {
                    myMedCount = app.user.UserSession.UserDrugs.drugs().length;
                }
                str = str.format(covered, myMedCount);
                return str;
            },
            owner: this
        });
        self.medsCoveredCount_lbl = ko.computed({
            read: function () {
                var planDrugs = self.planDrugs();
                if (planDrugs == null) return '';
                var covered = 0;
                for (var i = 0; i < planDrugs.length; i++) {
                    var planDrug = planDrugs[i];
                    if (planDrug.Tier > 0) {
                        covered++;
                    }
                }
                var str = app.viewModels.PlanSharedResourceStrings.medsCoveredCount_lbl;
                var myMedCount = 0;
                if (app.user && app.user.UserSession && app.user.UserSession.UserDrugs && app.user.UserSession.UserDrugs.drugs()) {
                    myMedCount = app.user.UserSession.UserDrugs.drugs().length;
                }
                str = str.format(covered, myMedCount);
                return str;
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
            owner: this,
            deferEvaluation: true
        });

        self.medicationCount = ko.computed({
            read: function () {
                if (app.user && app.user.UserSession && app.user.UserSession.UserDrugs && app.user.UserSession.UserDrugs.drugs()) {
                    return app.user.UserSession.UserDrugs.drugs().length;
                }
                return 0;
            },
            owner: this,
            deferEvaluation: true
        });



        self._getAttributeValue = function getAttributeValue(attribute, valueName) {
            for (var i = 0; i < attribute.AttributeValues.length; i++) {
                if (attribute.AttributeValues[i].Name === valueName) {
                    return attribute.AttributeValues[i].FormattedValue;
                }
            }

            return null;
        };

        self.getDetailsAttributeValue = function getDetailsAttributeValue(plan, attributeName) {
            var setLength = plan.detailsAttributeTemplate.AttributeGroups ? plan.detailsAttributeTemplate.AttributeGroups.length : 0;
            for (var j = setLength - 1; j >= 0; j--) {
                var attLength = plan.detailsAttributeTemplate.AttributeGroups[j].Attributes ? plan.detailsAttributeTemplate.AttributeGroups[j].Attributes.length : 0;
                for (var k = attLength - 1; k >= 0; k--) {
                    if (plan.detailsAttributeTemplate.AttributeGroups[j].Attributes[k].Name == attributeName) {
                        return plan.detailsAttributeTemplate.AttributeGroups[j].Attributes[k];
                    }
                }
            }
            return null;
        };

        self.ShowCoverageGap = ko.observable(true);
        self.ShowCatastrophicCoverage = ko.observable(true);
        self.DeductibleCost = ko.computed({
            read: function () {
                if (self.plan && self.plan.detailsAttributeTemplate) {
                    var attribute = self.getDetailsAttributeValue(self.plan, "Annual Drug Deductible");
                    //check truthiness on attribute before passing into get values
                    if (attribute) {
                        var deductible = null;
                        deductible = self._getAttributeValue(attribute, "Drug Deductible");

                        if (deductible) {
                            return deductible;
                        }
                    }
                }

                return "";
            },
            owner: this,
            deferEvaluation: true
        });
        self.MedicationCostTable_DeductibleCell_Text_Formatted = ko.computed({
            read: function () {
                if (self.plan && self.plan.detailsAttributeTemplate) {
                    var attribute = self.getDetailsAttributeValue(self.plan, "Annual Drug Deductible");
                    //check truthiness on attribute before passing into get values
                    if (attribute) {
                        var deductible = null;
                        deductible = self._getAttributeValue(attribute, "Drug Deductible");
                    }
                }

                if (deductible && deductible != "$0")
                    return self.MedicationCostTable_DeductibleCell_Text.format(self.DeductibleCost());
                else
                    return self.MedicationCostTable_ZeroDeductibleCell_Text;
            },
            owner: this,
            deferEvaluation: true
        });

        self.tceTeaser_hdr = '';
        self.tceTeaserBody_lbl = '';
        self.tceEnable_lbl = '';

        self.shouldShowTceTeaser = ko.computed({
            read: function () {
                var show = true;
                if (self.plan.tceLoaded() && self.plan.haveTceData()) {
                    show = false;
                }
                else if (self.plan.tceLoading()) {
                    show = false;
                }

                return show;
            },
            owner: this,
            deferEvaluation: true
        });

        self.shouldShowDrugTeaser = ko.computed({
            read: function () {
                var show = true;
                if (self.plan.tceLoaded() && self.plan.haveTceData() && app.viewModels.PlanDetailsViewModel.medicationsInCabinet()) {
                    show = false;
                }
                else if (self.plan.tceLoading()) {
                    show = false;
                }

                return show;
            },
            owner: this,
            deferEvaluation: true
        });

        self.totalBeforeDeductibleCost = ko.computed({
            read: function () {
                var totalCost = 0;
                if (self.plan && self.plan.tceCost()) {
                    for (var i = 0; i < self.plan.tceCost().InNetworkDrugCosts.length; i++) {
                        totalCost = totalCost + self.plan.tceCost().InNetworkDrugCosts[i].BeforeDeductibleCost;
                    }
                }
                return totalCost.toFixed(2);

            },
            owner: this,
            deferEvaluation: true
        });

        self.totalInitialCoverageCost = ko.computed({
            read: function () {
                var totalCost = 0;
                if (self.plan && self.plan.tceCost()) {
                    for (var i = 0; i < self.plan.tceCost().InNetworkDrugCosts.length; i++) {
                        totalCost = totalCost + self.plan.tceCost().InNetworkDrugCosts[i].InitialCoverageCost;
                    }
                }
                return totalCost.toFixed(2);

            },
            owner: this,
            deferEvaluation: true
        });

        self.totalCatastrophicCoverageCost = ko.computed({
            read: function () {
                var totalCost = 0;
                if (self.plan && self.plan.tceCost()) {
                    for (var i = 0; i < self.plan.tceCost().InNetworkDrugCosts.length; i++) {
                        totalCost = totalCost + self.plan.tceCost().InNetworkDrugCosts[i].CatastrophicCoverageCost;
                    }
                }
                return totalCost.toFixed(2);

            },
            owner: this,
            deferEvaluation: true
        });

        self.totalCoverageGapCost = ko.computed({
            read: function () {
                var totalCost = 0;
                if (self.plan && self.plan.tceCost()) {
                    for (var i = 0; i < self.plan.tceCost().InNetworkDrugCosts.length; i++) {
                        totalCost = totalCost + self.plan.tceCost().InNetworkDrugCosts[i].CoverageGapCost;
                    }
                }
                return totalCost.toFixed(2);

            },
            owner: this,
            deferEvaluation: true
        });


        PlanDetailsViewModel.prototype.shouldShowAttributeRow = function shouldShowAttributeRow(AttributeValues) {
            for (var i = 0; i < AttributeValues.length; i++) {
                if (!AttributeValues[i].NoAttributeValue) {
                    return true;
                }
            }
            return false;
        };

        PlanDetailsViewModel.prototype.shouldShowAttributeGroup = function shouldShowAttributeGroup(AttributeGroup) {
            for (var i = 0; i < AttributeGroup.Attributes.length; i++) {
                var attribute = AttributeGroup.Attributes[i];
                for (var j = 0; j < attribute.AttributeValues.length; j++) {
                    var attributeVal = attribute.AttributeValues[j];
                    if (!attributeVal.NoAttributeValue) {
                        if (EXCHANGE.user.UserSession.Agent().Id === undefined) {
                            if (attributeVal.HideFromCustomer)
                                return false;
                            else
                                return true;
                        }
                        if (EXCHANGE.user.UserSession.Agent().Id() === "00000000-0000-0000-0000-000000000000" && attributeVal.HideFromCustomer)
                            return false;
                        else
                            return true;
                    }
                }
            }
            return false;
        };

        PlanDetailsViewModel.prototype.loadPlanDetails = function loadFromPlanId(planGuid, planDetails) {
            var protoself = this;
            if (planGuid) {

                var plan = null;

                if (EXCHANGE.viewModels.SearchResultsViewModel)
                    plan = EXCHANGE.viewModels.SearchResultsViewModel.getPlanByPlanGuid(planGuid);
                if ((planDetails.PlanDetails.PlanType === 4 || planDetails.PlanDetails.PlanType === 3) && EXCHANGE.viewModels.AncSearchResultsViewModel) {
                    plan = EXCHANGE.viewModels.AncSearchResultsViewModel.getPlanByPlanGuid(planGuid);
                }
                if (plan == undefined || plan == null) {
                    var planSRVM = new EXCHANGE.models.PlanSearchResultsViewModel(planDetails.PlanDetails.PlanType);
                    plan = planSRVM.loadFromPlanDomainEntity(planDetails);
                }

                protoself.plan = plan;


                //  protoself.plan["planDrugsLoading"] = function () { };


                protoself.plan["detailsAttributeTemplate"] = [];

                for (var i = 0; i < planDetails.PlanDetails.AttributeTemplates.length; i++) {
                    if (planDetails.PlanDetails.AttributeTemplates[i].TemplateCode == app.enums.TemplateCodeEnum.SUMMARYPLANDETAILS) {
                        protoself.plan["detailsAttributeTemplate"] = planDetails.PlanDetails.AttributeTemplates[i];
                    }
                }

                protoself.plan["documents"] = typeof planDetails.PlanDetails.Documents != 'undefined' ? planDetails.PlanDetails.Documents : [];


                protoself.plan["tceTotalDisplayPlanDetails"] = '';
                protoself.plan["tceTotalDisplayPlanDetailsNoRounding"] = '';



            }
            else if (protoself.planId) {

                //TODO Perf - Commenting now
                // protoself.plan(EXCHANGE.plans.AllPlanViewModels[protoself.planId]);
            }
            protoself = loadPlanDetails(protoself, planDetails);

            return protoself;
        };

        PlanDetailsViewModel.prototype.isPreferredPharmacy = function isPreferredPharmacy(pharmacyId) {
            var self = this;

            if (self.plan && self.plan.tceCost() && self.plan.tceCost().Pharmacy) {
                if ((self.plan.tceCost().Pharmacy.Id == pharmacyId) && (self.plan.tceCost().IsPreferredPharmacy))
                    return true;
            }
            return false;

        };

        PlanDetailsViewModel.prototype.loadFromPlanViewModel = function loadFromPlanViewModel(planViewModel, planDetails) {
            var protoself = this;
            app.plans.AllPlanViewModels.push(planViewModel);
            protoself.plan(planViewModel);
            protoself = loadPlanDetails(protoself, planDetails);

            return protoself;
        };

        PlanDetailsViewModel.prototype.loadCoverageCostDetails = function loadCoverageCostDetails(planCosts) {
            var protoself = this;
            protoself.DrugCosts(planCosts.DrugCosts);
            protoself.TotalRetailCost(parseFloat(planCosts.TotalRetailCost));
            protoself.TotalOOPCost(parseFloat(planCosts.TotalOOPCost));
            protoself.TotalMailOOPCost(parseFloat(planCosts.TotalMailOOPCost));
            protoself.CoverageDateString(planCosts.CoverageDateString);
            protoself.PreferredPharmacy(planCosts.MyPharmacy);

            return protoself;
        };

        function loadPlanDetails(protoself, planDetails) {

            protoself.header_lbl = planDetails.Header_Lbl;
            protoself.expandAll_lbl = planDetails.ExpandAll_Lbl;
            protoself.collapseAll_lbl = planDetails.CollapseAll_Lbl;
            protoself.planOverviewHeader_lbl = planDetails.PlanOverviewHeader_Lbl;
            protoself.getPlanDocuments_lbl = planDetails.GetPlanDocuments_Lbl;
            protoself.coversMedical_lbl = planDetails.CoversMedical_Lbl;
            protoself.coversPrescription_lbl = planDetails.CoversPrescription_Lbl;
            protoself.dental_lbl = planDetails.Dental_Lbl;
            protoself.vision_lbl = planDetails.Vision_Lbl;
            protoself.includedCoverage_lbl = planDetails.IncludedCoverage_Lbl;
            protoself.includedCoverageBrowse_lbl = planDetails.IncludedCoverageBrowse_Lbl;
            protoself.optionalCoverage_lbl = planDetails.OptionalCoverage_Lbl;
            protoself.optionalCoverageBrowse_lbl = planDetails.OptionalCoverageBrowse_Lbl;
            protoself.myMedications_lbl = planDetails.MyMedications_Lbl;
            protoself.planRange_lbl = planDetails.PlanRange_Lbl;
            protoself.tierDetails_lbl = planDetails.TierDetails_Lbl;
            protoself.priorAuth_Lbl = planDetails.PriorAuth_Lbl;
            protoself.quantityLimit_Lbl = planDetails.QuantityLimit_Lbl;
            protoself.stepTherapy_Lbl = planDetails.StepTherapy_Lbl;
            protoself.priorAuthDesc_Lbl = planDetails.PriorAuthDesc_Lbl;
            protoself.quantityLimitDesc_Lbl = planDetails.QuantityLimitDesc_Lbl;
            protoself.stepTherapyDesc_Lbl = planDetails.StepTherapyDesc_Lbl;
            protoself.noRestrictions_lbl = planDetails.NoRestrictions_Lbl;
            protoself.drug_lbl = planDetails.Drug_Lbl;
            protoself.genericAvail_lbl = planDetails.GenericAvail_Lbl;
            protoself.tier_lbl = planDetails.Tier_Lbl;
            protoself.costBreakdownDeductible_lbl(planDetails.CostBreakdownDeductible_Lbl);
            protoself.costBreakdownInitialCoverage_lbl(planDetails.CostBreakdownInitialCoverage_Lbl);
            protoself.costBreakdownCoverageGap_lbl(planDetails.CostBreakdownCoverageGap_Lbl);
            protoself.costBreakdownCatastrophicCoverage_lbl = planDetails.CostBreakdownCatastrophicCoverage_Lbl;
            protoself.tierAttributeLink_lbl = planDetails.TierAttributeLink_Lbl;
            protoself.forDetails_lbl = planDetails.ForDetails_Lbl;
            protoself.notCovered_lbl = planDetails.NotCovered_Lbl;
            protoself.chooseMedications_lbl = planDetails.ChooseMedications_Lbl;
            protoself.changeMedications_lbl = planDetails.ChangeMedications_Lbl;
            protoself.xofYCovered_lbl = planDetails.XofYCovered_Lbl;
            protoself.myMedicationsCovered_lbl = planDetails.MyMedicationsCovered_Lbl;
            protoself.backBtn_lbl = planDetails.BackBtn_Lbl;
            protoself.footer_lbl = planDetails.Footer_Lbl;
            protoself.checkoutBtn_lbl = planDetails.CheckoutBtn_Lbl;
            protoself.planDetailsHeader_lbl = planDetails.PlanDetailsHeader_lbl;
            protoself.printDetails_lbl = planDetails.PrintDetails_lbl;
            protoself.printTempId_lbl = planDetails.PrintTempId_Lbl;
            protoself.contactInfo_lbl = planDetails.ContactInfo_Lbl;
            protoself.contactInformation_lbl = planDetails.ContactInformation_Lbl;
            protoself.helpWithCoverage_lbl = planDetails.HelpWithCoverage_Lbl;
            protoself.contactInsurer_lbl = planDetails.ContactInsurer_Lbl;
            protoself.yourAdvisor_lbl = planDetails.YourAdvisor_Lbl;
            protoself.yourAdvisorFull_lbl = planDetails.YourAdvisorFull_Lbl;
            protoself.phoneWithExt_lbl = planDetails.PhoneWithExt_Lbl;
            protoself.TTY_lbl(planDetails.TTY_Lbl);
            protoself.advisorChanged_lbl = planDetails.AdvisorChanged_Lbl;
            protoself.medicareQuestions_lbl = planDetails.MedicareQuestions_Lbl;
            protoself.medicareContact_lbl = planDetails.MedicareContact_Lbl;
            protoself.SSQuestions_lbl = planDetails.SSQuestions_Lbl;
            protoself.SSContact_lbl = planDetails.SSContact_Lbl;

            protoself.getStarted_lbl = planDetails.GetStarted_Lbl;
            protoself.showPremiums_lbl = planDetails.ShowPremiums_Lbl;
            protoself.browseMedicationsText_lbl = planDetails.BrowseMedicationsText_Lbl;
            protoself.browsePlansHtml_lbl = planDetails.BrowsePlansHtml_Lbl;
            protoself.findPlansText_lbl = planDetails.FindPlansText_Lbl;

            protoself.medicationsChanged_lbl = planDetails.MedicationsChanged_Lbl;
            protoself.areMedicationsCovered_html = planDetails.AreMedicationsCovered_Html;
            protoself.myMedicationTeaser_lbl = planDetails.MyMedicationTeaser_Lbl;
            protoself.addMyMedications_lbl = planDetails.AddMyMedications_Lbl;

            if (!protoself.plan.rxCovered_bool || !(app.user && app.user.UserSession && app.user.UserSession.UserDrugs && app.user.UserSession.UserDrugs.drugs().length > 0)) {
                protoself.includePrescription(false);
            }

            if (!protoself.plan.medCovered_bool || !(app.user && app.user.UserSession && app.user.UserSession.UserProfile && app.user.UserSession.UserProfile.doneMedQuestions())) {
                protoself.includeMedical(false);
            }
            protoself.MedicationCostTable_Header_Html = planDetails.MedicationCostTable_Header_Html;
            protoself.MedicationCostTable_DeductibleHeader_Text = planDetails.MedicationCostTable_DeductibleHeader_Text;
            protoself.MedicationCostTable_DeductibleCell_Text = planDetails.MedicationCostTable_DeductibleCell_Text;
            protoself.MedicationCostTable_ZeroDeductibleCell_Text = planDetails.MedicationCostTable_ZeroDeductibleCell_Text;
            protoself.MedicationCostTable_InitialCoverageHeader_Text = planDetails.MedicationCostTable_InitialCoverageHeader_Text;
            protoself.MedicationCostTable_InitialCoverageCell_Text = planDetails.MedicationCostTable_InitialCoverageCell_Text;
            protoself.MedicationCostTable_CoverageGapHeader_Text = planDetails.MedicationCostTable_CoverageGapHeader_Text;
            protoself.MedicationCostTable_CoverageGapReachedCell_Text = planDetails.MedicationCostTable_CoverageGapReachedCell_Text;
            protoself.MedicationCostTable_CoverageGapNotReachedCell_Html = planDetails.MedicationCostTable_CoverageGapNotReachedCell_Html;
            protoself.MedicationCostTable_CatastrophicCoverageHeader_Text = planDetails.MedicationCostTable_CatastrophicCoverageHeader_Text;
            protoself.MedicationCostTable_CatastrophicCoverageReachedCell_Text = planDetails.MedicationCostTable_CatastrophicCoverageReachedCell_Text;
            protoself.MedicationCostTable_CatastrophicCoverageNotReachedCell_Html = planDetails.MedicationCostTable_CatastrophicCoverageNotReachedCell_Html;

            protoself.tceTeaser_hdr = planDetails.TceTeaser_Hdr;
            protoself.tceTeaserBody_lbl = planDetails.TceTeaserBody_Lbl;
            protoself.tceEnable_lbl = planDetails.TceEnable_Lbl;
            protoself.tceCalculate_lbl = planDetails.TceCalculate_Lbl;

            protoself.tceHeader_lbl = planDetails.TceHeader_Lbl;
            protoself.tceHowIsCalculated_hdr = planDetails.TceHowIsCalculated_Hdr;
            protoself.tceHowIsCalculated_body = planDetails.TceHowIsCalculated_Body;

            protoself.tceWhenWillPay_hdr = planDetails.TceWhenWillPay_Hdr;
            protoself.tceWhenWillPay_body = planDetails.TceWhenWillPay_Body;

            protoself.tceIncludeMyEstimated = planDetails.TceIncludeMyEstimated;
            protoself.tceChooseAtLeastOne = planDetails.TceChooseAtLeastOne;

            protoself.rxExpenseNotCovered_lbl = planDetails.RxExpenseNotCovered_Lbl;
            protoself.medExpenseNotCovered_lbl = planDetails.MedExpenseNotCovered_Lbl;

            protoself.tceRxExpenses_lbl = planDetails.TceRxExpenses_Lbl;
            protoself.tceMedExpenses_lbl = planDetails.TceMedExpenses_Lbl;
            protoself.tceAnnExpenses_lbl = planDetails.TceAnnExpenses_Lbl;

            protoself.tceBottom_lbl = planDetails.TceBottom_Lbl;

            protoself.deductible_lbl = planDetails.Deductible_Lbl;
            protoself.medicareCoverageGap_lbl = planDetails.MedicareCoverageGap_Lbl;
            protoself.catastrophicCoverage_lbl = planDetails.CatastrophicCoverage_Lbl;

            protoself.tceHaveYourHealthcareNeedsChanged_lbl = planDetails.TceHaveYourHealthcareNeedsChanged_Lbl;
            protoself.tceChangeMedications_lbl = planDetails.TceChangeMedications_Lbl;
            protoself.tceChangeMedExpenses_lbl = planDetails.TceChangeMedExpenses_Lbl;

            protoself.tceAddInfo_lbl = planDetails.TceAddInfo_Lbl;
            protoself.FromJanuary_Text = planDetails.FromJanuary_Text;
            protoself.FromEffectiveBase(planDetails.FromEffectiveBase);

            protoself.addPharmacyText = planDetails.AddPharmacyText;
            protoself.changePharmacyText = planDetails.ChangePharmacyText;
            protoself.mailOrderPharmacyText = planDetails.MailOrderPharmacyText;
            protoself.showMedicationCostsForText = planDetails.ShowMedicationCostsForText;
            protoself.preferredPharmacyText = planDetails.PreferredPharmacyText;

            protoself.medicalCostDescription = planDetails.MedicalCostDescription;
            return protoself;
        }

        return self;
    };

} (EXCHANGE));
