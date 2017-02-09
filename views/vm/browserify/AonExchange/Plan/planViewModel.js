(function (app, global) {
    var ns = app.namespace('EXCHANGE.models');

    ns.PlanViewModel___ = function PlanViewModel__(parentTabIndex) {
        if (!(this instanceof PlanViewModel)) {
            return new PlanViewModel(parentTabIndex);
        }
        var self = this;

        self.plan = ko.observable(app.plans.EmptyPlanModel());
        self.hasBeenLoaded = ko.observable(false);
        self.drawGraph = ko.observable(false);

        self.parentTabIndex = ko.observable(parentTabIndex);

        self.insurerName = ko.observable('');
        self.insurerPhone = ko.observable('');
        self.insurerUrl = ko.observable('');

        self.planGuid = ko.observable('');
        self.compID = ko.observable('');
        self.compDesc = ko.observable('');

        self.planName_lbl = ko.observable('');
        self.planType = ko.observable('');
        self.cartPrecheckId = ko.observable('');

        self.maxDrugTier = ko.observable(5);

        self.tceLoading = ko.observable(false);
        self.tceLoaded = ko.observable(false);
        self.planDrugsLoading = ko.observable(false);
        self.planDrugsLoaded = ko.observable(true);
        self.needNewCoverageCost = ko.observable(false);

        self.haveMedData = ko.computed({
            read: function () {
                return app.user && app.user.UserSession && app.user.UserSession.UserProfile && app.user.UserSession.UserProfile.doneMedQuestions();
            },
            owner: this,
            deferEvaluation: true
        });

        self.haveRxData = ko.computed({
            read: function () {
                return app.user && app.user.UserSession && app.user.UserSession.UserDrugs && app.user.UserSession.UserDrugs.drugs().length > 0;
            },
            owner: this,
            deferEvaluation: true
        });

        ///indicates whether we have enough information (drugs, medical questionaire) to get TCE data for a plan
        self.haveTceData = ko.computed({
            read: function () {
                return (self.rxCovered_bool() &&
                    (app.user && app.user.UserSession && app.user.UserSession.UserDrugs &&
                        app.user.UserSession.UserDrugs.drugs().length > 0 && !EXCHANGE.user.UserSession.ShowRxPreloadLb()));
                /*|| (self.medCovered_bool() && true
                /*(app.user && app.user.UserSession && app.user.UserSession.UserProfile && 
                app.user.UserSession.UserProfile.doneMedQuestions())*/
            },
            owner: this,
            deferEvaluation: true
        });
        self.tceCost = ko.observable();

        self.prescriptionCostDetails = ko.computed({
            read: function () {
                if (app.sharedPlanDetails) {
                    var totals = app.sharedPlanDetails.getCorrectTotalsFromCostEstimate(self.tceCost());
                    if (totals) {
                        return app.exchangeContext.ExchangeContext.currencySymbol() + totals.DrugCost.toFixed(0);
                    }

                    return "";
                }

                return "";
            },
            owner: this,
            deferEvaluation: true
        });

        self.medicalCostDetails = ko.computed({
            read: function () {
                if (app.sharedPlanDetails) {
                    var totals = app.sharedPlanDetails.getCorrectTotalsFromCostEstimate(self.tceCost());
                    if (totals) {
                        return app.exchangeContext.ExchangeContext.currencySymbol() + totals.MedicalCost.toFixed(0);
                    }

                    return "";
                }

                return "";
            },
            owner: this,
            deferEvaluation: true
        });

        self.annualCostDetails = ko.computed({
            read: function () {
                if (app.sharedPlanDetails) {
                    var totals = app.sharedPlanDetails.getCorrectTotalsFromCostEstimate(self.tceCost());
                    if (totals) {
                        return app.exchangeContext.ExchangeContext.currencySymbol() + totals.PremiumCost.toFixed(0);
                    }

                    return "";
                }

                return "";
            },
            owner: this,
            deferEvaluation: true
        });

        self.tceTotalDisplayPlanDetails = ko.computed({
            read: function () {
                if (app.sharedPlanDetails) {
                    var totals = app.sharedPlanDetails.getCorrectTotalsFromCostEstimate(self.tceCost());
                    if (totals) {
                        var total = 0;
                        if (self.rxCovered_bool() && app.viewModels.PlanDetailsViewModel.includePrescription()) {
                            total += totals.DrugCost;
                        }

                        if (self.medCovered_bool() && app.viewModels.PlanDetailsViewModel.includeMedical()) {
                            total += totals.MedicalCost;
                        }

                        if (app.viewModels.PlanDetailsViewModel.includeAnnual()) {
                            total += totals.PremiumCost;
                        }

                        return app.exchangeContext.ExchangeContext.currencySymbol() + total.toFixed(0);
                    }
                    return "";
                }
                return "";
            },
            owner: this
        });

        self.tceTotalDisplayPlanDetailsNoRounding = ko.computed({
            read: function () {
                if (app.sharedPlanDetails) {
                    var totals = app.sharedPlanDetails.getCorrectTotalsFromCostEstimate(self.tceCost());
                    if (totals) {
                        var total = 0;
                        if (self.rxCovered_bool() && app.viewModels.PlanDetailsViewModel.includePrescription()) {
                            total += totals.DrugCost;
                        }

                        if (self.medCovered_bool() && app.viewModels.PlanDetailsViewModel.includeMedical()) {
                            total += totals.MedicalCost;
                        }

                        if (app.viewModels.PlanDetailsViewModel.includeAnnual()) {
                            total += totals.PremiumCost;
                        }

                        return app.exchangeContext.ExchangeContext.currencySymbol() + total.toFixed(2);
                    }
                    return "";
                }
                return "";
            },
            owner: this
        });

        self.tceTotalDisplaySearchResults = ko.computed({
            read: function () {
                //                var costEstimate = self.tceCost();
                //                if (costEstimate) {
                //                    var total = 0;
                //                    if (self.rxCovered_bool() && self.haveRxData()) {
                //                        total += costEstimate.InNetworkCalendarYearTotals.DrugCost;
                //                    }
                //                    if (self.medCovered_bool() && self.haveMedData()) {
                //                        total += costEstimate.InNetworkCalendarYearTotals.MedicalCost;
                //                    }
                //                    total += costEstimate.InNetworkCalendarYearTotals.PremiumCost;

                var total = 0;

                var tceLoaded = self.tceLoaded();
                if (self.plan().TCE) {
                    {
                        total = self.plan().TCE;
                        return app.exchangeContext.ExchangeContext.currencySymbol() + total.toFixed(2) + "<sup>†</sup>";
                    }
                    return "";

                }


            },
            owner: this,
            deferEvaluation: true
        });

        self.tceTotalDisplayComparePlans = ko.computed({
            read: function () {
                var costEstimate = self.tceCost();
                if (costEstimate) {
                    var total = 0;
                    if (self.rxCovered_bool() && app.viewModels.ComparePlansViewModel.includePrescription() && app.viewModels.ComparePlansViewModel.shouldShowMedicationSection() && self.haveRxData()) {
                        total += costEstimate.InNetworkCalendarYearTotals.DrugCost;
                    }
                    if (self.medCovered_bool() && app.viewModels.ComparePlansViewModel.includeMedical() && app.viewModels.ComparePlansViewModel.shouldShowMedicalSection() && self.haveMedData()) {
                        total += costEstimate.InNetworkCalendarYearTotals.MedicalCost;
                    }
                    if (app.viewModels.ComparePlansViewModel.includeAnnual()) {
                        total += costEstimate.InNetworkCalendarYearTotals.PremiumCost;
                    }
                    return app.exchangeContext.ExchangeContext.currencySymbol() + total.toFixed(2) + "<sup>†</sup>";
                }

                return "";
            },
            owner: this,
            deferEvaluation: true
        });

        self.tceTotalDisplayDetailsComparePlans = ko.computed({
            read: function () {
                var costEstimate = self.tceCost();
                if (costEstimate) {
                    var total = 0;
                    if (self.rxCovered_bool() && app.viewModels.ComparePlansViewModel.includePrescription() && app.viewModels.ComparePlansViewModel.shouldShowMedicationSection() && self.haveRxData()) {
                        total += costEstimate.InNetworkCalendarYearTotals.DrugCost;
                    }
                    if (self.medCovered_bool() && app.viewModels.ComparePlansViewModel.includeMedical() && app.viewModels.ComparePlansViewModel.shouldShowMedicalSection() && self.haveMedData()) {
                        total += costEstimate.InNetworkCalendarYearTotals.MedicalCost;
                    }
                    if (app.viewModels.ComparePlansViewModel.includeAnnual()) {
                        total += costEstimate.InNetworkCalendarYearTotals.PremiumCost;
                    }
                    return app.exchangeContext.ExchangeContext.currencySymbol() + total.toFixed(0);
                }

                return "";
            },
            owner: this,
            deferEvaluation: true
        });

        self.PPCID = ko.observable('');
        self.readyToSell = ko.observable('');
        self.cannotSell_lbl = ko.observable('');
        self.planId = ko.observable('');
        self.planIdText = ko.observable('');
        self.planId_lbl = ko.computed({
            read: function () {
                return self.planIdText().format(self.planId());
            },
            owner: this
        });
        self.remove_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.remove_lbl());

        self.planDetailsHover_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.planDetailsHover_lbl());

        self.premium_lbl = ko.computed({
            read: function () {
                return app.viewModels.PlanSharedResourceStrings.premium_lbl();
            },
            owner: this
        });
        self.frequencyPremium = ko.observable(0);
        self.frequency_lbl = ko.computed({
            read: function () {
                var frequency = self.frequencyPremium();
                if (frequency >= app.enums.PremiumFrequency.length) {
                    return '';
                } else {
                    return app.viewModels.PlanSharedResourceStrings.planPremiumFrequency_lbls()[frequency];
                }
            },
            owner: this
        });
        self.frequencyAlternate_lbl = ko.computed({
            read: function () {
                var frequency = self.frequencyPremium();
                if (frequency >= app.enums.PremiumFrequency.length) {
                    return '';
                } else {
                    return app.viewModels.PlanSharedResourceStrings.planPremiumFrequencyAlternate_lbls()[frequency];
                }
            },
            owner: this
        });
        self.frequencyPremiumText = ko.observable('');
        self.frequencyPremium_lbl = ko.computed({
            read: function () {
                return self.frequencyPremiumText().format(self.frequency_lbl());
            },
            owner: this
        });
        self.frequencyPremiumValue = ko.observable('');
        self.frequencyPremiumValue_lbl = ko.observable('');
        self.fullPremium_lbl = ko.observable('');
        self.premiumFound = ko.observable(false);

        self.cmsRating_int = ko.observable(null);
        self.cmsRating_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.cmsRating_lbl());
        self.cmsRatingOutOf_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.cmsRatingOutOf_lbl());
        self.cmsRatingStarsShow = ko.computed({
            read: function () {
                return self.cmsRating_int() && self.cmsRating_int() > 0;
            },
            owner: this
        });

        self.cmsRatingHover_lbl = ko.computed({
            read: function () {
                return self.cmsRatingOutOf_lbl().format(self.cmsRating_int(), app.viewModels.PlanSharedResourceStrings.cmsRatingDescriptions()[Math.round(self.cmsRating_int())]);
            },
            owner: this
        });
        self.cmsRatingHoverBodySummary_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.cmsRatingHoverBodySummary_lbl());
        self.cmsRatingHoverBody_lbl = ko.computed({
            read: function () {
                return self.cmsRatingHoverBodySummary_lbl().format(self.cmsRating_int());
            },
            owner: this
        });

        self.supplements = ko.observableArray([]);

        self.medIndicator_bool = ko.observable(false);
        self.medCovered_bool = ko.observable(false);
        self.medCoveredHoverTitle_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.coversMedical_lbl());
        self.medCoveredHoverBody_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.coverageIncluded_lbl());
        self.medCoveredHoverBody2_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.clickForSupplementInfo_lbl());

        self.rxIndicator_bool = ko.observable(false);
        self.rxCovered_bool = ko.observable(false);
        self.rxCoveredHoverTitle_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.coversPrescription_lbl());
        self.rxCoveredHoverBody_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.coverageIncluded_lbl());
        self.rxCoveredHoverBody2_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.clickForSupplementInfo_lbl());

        self.riderDentIndicator_bool = ko.computed({
            read: function () {
                var supplements = self.supplements();
                for (var i = 0; i < supplements.length; i++) {
                    if (supplements[i].planType() == app.enums.PlanTypeEnum.DENTAL || supplements[i].planType() == app.enums.PlanTypeEnum.DENTALANDVISION) {
                        return true;
                    }
                }
                return false;
            },
            owner: this
        });
        self.riderDentCovered_bool = ko.computed({
            read: function () {
                var supplements = self.supplements();
                for (var i = 0; i < supplements.length; i++) {
                    if (supplements[i].planType() == app.enums.PlanTypeEnum.DENTAL || supplements[i].planType() == app.enums.PlanTypeEnum.DENTALANDVISION) {
                        if (supplements[i].isIncluded())
                            return true;
                    }
                }
                return false;
            },
            owner: this
        });
        self.riderDentCost = ko.computed({
            read: function () {
                var supplements = self.supplements();
                for (var i = 0; i < supplements.length; i++) {
                    if (supplements[i].planType() == app.enums.PlanTypeEnum.DENTAL) {
                        return supplements[i].formattedPremium();
                    }
                }
                return '';
            },
            owner: this
        });
        self.riderDentFrequency = ko.computed({
            read: function () {
                var supplements = self.supplements();
                for (var i = 0; i < supplements.length; i++) {
                    if (supplements[i].PlanType == app.enums.PlanTypeEnum.DENTAL) {
                        var frequency = supplements[i].frequency();
                        if (frequency >= app.enums.PremiumFrequency.length) {
                            return '';
                        } else {
                            return app.viewModels.PlanSharedResourceStrings.supplementFrequency_lbls()[frequency];
                        }
                    }
                }
            },
            owner: this
        });
        self.riderDentCoveredHoverTitle_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.optionalDental_lbl());
        self.riderDentCoveredHoverBody_lbl = ko.computed({
            read: function () {
                return app.viewModels.PlanSharedResourceStrings.coverageAdditionalCost_lbl().format(self.riderDentCost(), self.riderDentFrequency());
            },
            owner: this
        });
        self.riderDentCoveredHoverBodyVisible = ko.computed({
            read: function () {
                var supplements = self.supplements();
                var foundFirst = false;
                for (var i = 0; i < supplements.length; i++) {
                    if (supplements[i].planType() == app.enums.PlanTypeEnum.DENTALANDVISION) {
                        return false;
                    } else if (supplements[i].planType() == app.enums.PlanTypeEnum.DENTAL) {
                        if (supplements[i].premium() < 0.01) {
                            return false;
                        }
                        if (foundFirst) {
                            return false;
                        }
                        foundFirst = true;
                    }
                }
                return true;
            },
            owner: this
        });
        self.riderDentCoveredHoverBody2_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.clickForSupplementInfo_lbl());

        self.riderVisIndicator_bool = ko.computed({
            read: function () {
                var supplements = self.supplements();
                for (var i = 0; i < supplements.length; i++) {
                    if (supplements[i].planType() == app.enums.PlanTypeEnum.VISION || supplements[i].planType() == app.enums.PlanTypeEnum.DENTALANDVISION) {
                        return true;
                    }
                }
                return false;
            },
            owner: this
        });
        self.riderVisCovered_bool = ko.computed({
            read: function () {
                var supplements = self.supplements();
                for (var i = 0; i < supplements.length; i++) {
                    if (supplements[i].planType() == app.enums.PlanTypeEnum.VISION || supplements[i].planType() == app.enums.PlanTypeEnum.DENTALANDVISION) {
                        if (supplements[i].isIncluded()) {
                            return true;
                        }
                    }
                }
                return false;
            },
            owner: this
        });
        self.riderVisCost = ko.computed({
            read: function () {
                var supplements = self.supplements();
                for (var i = 0; i < supplements.length; i++) {
                    if (supplements[i].planType() == app.enums.PlanTypeEnum.VISION) {
                        return supplements[i].formattedPremium();
                    }
                }
                return '';
            },
            owner: this
        });
        self.riderVisFrequency = ko.computed({
            read: function () {
                var supplements = self.supplements();
                for (var i = 0; i < supplements.length; i++) {
                    if (supplements[i].planType() == app.enums.PlanTypeEnum.VISION) {
                        var frequency = supplements[i].frequency();
                        if (frequency >= app.enums.PremiumFrequency.length) {
                            return '';
                        } else {
                            return app.viewModels.PlanSharedResourceStrings.supplementFrequency_lbls()[frequency];
                        }
                    }
                }
            },
            owner: this
        });
        self.riderVisCoveredHoverTitle_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.optionalVision_lbl());
        self.riderVisCoveredHoverBody_lbl = ko.computed({
            read: function () {
                return app.viewModels.PlanSharedResourceStrings.coverageAdditionalCost_lbl().format(self.riderVisCost(), self.riderVisFrequency());
            },
            owner: this
        });
        self.riderVisCoveredHoverBodyVisible = ko.computed({
            read: function () {
                var supplements = self.supplements();
                var foundFirst = false;
                for (var i = 0; i < supplements.length; i++) {
                    if (supplements[i].planType() == app.enums.PlanTypeEnum.DENTALANDVISION) {
                        return false;
                    } else if (supplements[i].planType() == app.enums.PlanTypeEnum.VISION) {
                        if (supplements[i].premium() < 0.01) {
                            return false;
                        }
                        if (foundFirst) {
                            return false;
                        }
                        foundFirst = true;
                    }
                }
                return true;
            },
            owner: this
        });
        self.riderVisCoveredHoverBody2_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.clickForSupplementInfo_lbl());
        self.riderIncluded_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.includedInPlan_lbl());

        self.isInCart = ko.observable(false);
        self.addToCart_lbl = ko.computed({
            read: function () {
                if (self.isInCart()) {
                    return app.viewModels.PlanSharedResourceStrings.inCartBtn_lbl();
                } else {
                    return app.viewModels.PlanSharedResourceStrings.addToCartBtn_lbl();
                }
            },
            owner: this
        });
        self.addToCartHover_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.addNotInCartHover_lbl());
        self.inCartHover_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.addIsInCartHover_lbl());

        self.addToCartToolTip_lbl = ko.computed({
            read: function () {
                if (self.isInCart()) {
                    return self.inCartHover_lbl();
                } else {
                    return self.addToCartHover_lbl();
                }
            },
            owner: this
        });

        function getFormattedLabel() {

            var formattedLightboxName = 'Search Results';

            if (app.viewModels.RecResultsViewModel != undefined) {
                formattedLightboxName = 'Recommendation ';
            }

            if (EXCHANGE.lightbox.currentLightbox !== null) {

                var lightboxName = EXCHANGE.lightbox.currentLightbox.name;
                if (lightboxName) {

                    switch (lightboxName) {

                        case 'plandetails':
                            formattedLightboxName = 'Plan Details';
                            break;
                        case 'compareplans':
                            formattedLightboxName = 'Compare Plans';
                            break;
                        default:
                            formattedLightboxName = 'Search Results';

                    }
                }

            }

            var lable = EXCHANGE.viewModels.SearchResultsViewModel.currentTab();
            switch (lable) {

                case 'advantage':
                    return formattedLightboxName + ' - ' + 'MA';
                case 'drugs':
                    return formattedLightboxName + ' - ' + 'PDP';
                case 'medigap':
                    return formattedLightboxName + ' - ' + 'Gap';
                default:
                    return formattedLightboxName + ' - ' + 'MA';
            }
        }

        self.addToCart = function addToCart() {

            if (_gaq) {

                _gaq.push(['_trackEvent', 'Add To Cart', 'Click', getFormattedLabel()]);

            }

            if (!self.isInCart()) {

                if (app.user.UserSession.UserProfile.isKidneyFailure && self.cartPrecheckId() == 'ESRD') {
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.IsEGHP(false);
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.ESRD_Id('esrd-switchblock');
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.PlanName_Lbl(self.planName_lbl());
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.Plan(self.plan());
                    $.publish("EXCHANGE.lightbox.esrdconfirm.open");

                } else if (self.planType() == 1 && self.cartPrecheckId() == 'Loss EGHP') {
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.IsEGHP(true);
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.ESRD_Id('eghp-switchblock');
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.PlanName_Lbl(self.planName_lbl());
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.Plan(self.plan());
                    $.publish("EXCHANGE.lightbox.esrdconfirm.open");
                } else {
                    self.plan().addToShoppingCart(true, true);
                }

            } else {
                self.plan().removeFromShoppingCart();
            }
        };

        self.isCompared = ko.observable(false);
        self.compare_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.compare_lbl());
        self.inComparison_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.inComparison_lbl());
        self.compareNotCheckedHover_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.compareFalseHover_lbl());
        self.compareCheckedHover_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.compareTrueHover_lbl());

        self.compareHover_lbl = ko.computed({
            read: function () {
                if (self.isCompared()) {
                    return self.compareCheckedHover_lbl();
                } else {
                    return self.compareNotCheckedHover_lbl();
                }
            },
            owner: this
        });

        self.explicitRemoveFromCompare = function explicitRemoveFromCompare() {
            self.plan().removeFromCompared();
            self.isCompared(false);
        };

        self.addToCompare = function addToCompare() {
            var shouldCompare = self.plan().getComparedPlansCount() < 3;
            if (!self.isCompared()) {
                self.plan().addToCompared();
            } else {
                self.plan().removeFromCompared();
            }
            if (shouldCompare) {
                self.isCompared(!self.isCompared());
            }
        };

        self.moreOptions_lbl = ko.observable('');
        self.planDetails_lbl = ko.observable('');
        self.isSaved = ko.observable(false);
        self.saveForLater_lbl = ko.observable('');
        self.savedForLater_lbl = ko.observable('');
        self.moreOptsSaved_lbl = ko.computed({
            read: function () {
                if (self.isSaved()) {
                    return self.savedForLater_lbl();
                } else {
                    return self.saveForLater_lbl();
                }
            },
            owner: this
        });

        self.addToSaved = function addToSaved() {
            if (EXCHANGE.user.UserSession.IsLoggedIn()) {
                if (!self.isSaved()) {
                    self.plan().addToSavedPlans();
                } else {
                    $.publish("EXCHANGE.lightbox.savedplans.open");
                }
            } else {
                $.publish("EXCHANGE.lightbox.login.open");
            }
        };

        self.removeFromSaved = function removeFromSaved(data, ev) {
            self.plan().removeFromSavedPlans();
            app.user.UserSession.SavedPlans.tabGroups(app.user.UserSession.SavedPlans.tabGroups());
            ev.preventDefault();
            ev.stopPropagation();
        };

        self.planDrugs = ko.observableArray([]);
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
                            vms.push(new ns.PlanDrugViewModel(planDrugs[j], self.maxDrugTier()));
                            found = true;
                        }
                    }
                    if (!found) {
                        var emptyPlanDrug = { Tier: 0, DrugId: userDrugs[i].Drug.Id, DosageId: userDrugs[i].SelectedDosage.Id, PlanId: self.planGuid() };
                        vms.push(new ns.PlanDrugViewModel(emptyPlanDrug, self.maxDrugTier()));
                    }
                }
                return vms;
            },
            owner: this,
            deferEvaluation: true
        });
        self.areMyMedicinesCovered_lbl = ko.observable('');
        self.areMyMedicinesCoveredHover_lbl = ko.observable('');
        self.showDrugsCovered = ko.computed({
            read: function () {
                if (app.countyPlanList) {
                    return false;
                }
                var count = 0;
                if (app.user && app.user.UserSession && app.user.UserSession.UserDrugs && app.user.UserSession.UserDrugs.drugs()) {
                    count = app.user.UserSession.UserDrugs.drugs().length;
                }
                return count > 0;
            }, owner: this
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
                var str = app.viewModels.PlanSharedResourceStrings.xofYCovered_lbl();
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
                var str = app.viewModels.PlanSharedResourceStrings.medsCoveredCount_lbl();
                var myMedCount = 0;
                if (app.user && app.user.UserSession && app.user.UserSession.UserDrugs && app.user.UserSession.UserDrugs.drugs()) {
                    myMedCount = app.user.UserSession.UserDrugs.drugs().length;
                }
                str = str.format(covered, myMedCount);
                return str;
            },
            owner: this
        });
        self.medsCoveredMoreInfo_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.medsCoveredMoreInfo_lbl());
        self.medsCoveredMoreInfoHover_lbl = ko.observable(app.viewModels.PlanSharedResourceStrings.medsCoveredMoreInfoHover_lbl());

        self.doctorFinder_lbl = ko.observable('');
        self.doctorFinderNoLink_lbl = ko.observable('');
        self.doctorFinderHover_lbl = ko.observable('');

        self.srAttributeTemplate = ko.observable('');
        self.detailsAttributeTemplate = ko.observable('');

        self.attributes = ko.observableArray([]);

        self.optionalSupplements = ko.computed({
            read: function () {
                var supplements = self.supplements();
                var optional = [];
                for (var i = 0; i < supplements.length; i++) {
                    if (supplements[i].isOptional()) {
                        optional.push(supplements[i]);
                    }
                }

                return optional;
            },
            deferEvaluation: true,
            owner: this
        });

        self.optionalSupplementsByType = ko.computed({
            read: function () {
                var supplements = self.supplements();
                var optional = [];
                for (var i = 0; i < supplements.length; i++) {
                    var supp = supplements[i];
                    if (supplements[i].isOptional()) {
                        if (!hasAnyByType(optional, supp.planType())) {
                            optional.push(supplements[i]);
                        }
                    }
                }

                return optional;
            },
            deferEvaluation: true,
            owner: this
        });

        function hasAnyByType(supplements, type) {
            var found = false;
            $.each(supplements, function (index, item) {
                if (item.planType() === type) {
                    found = true;
                    return;
                }
            });

            return found;
        }

        self.includedSupplements = ko.computed({
            read: function () {
                var supplements = self.supplements();
                var included = [];
                for (var i = 0; i < supplements.length; i++) {
                    if (supplements[i].isIncluded()) {
                        included.push(supplements[i]);
                    }
                }

                return included;
            },
            deferEvaluation: true,
            owner: this
        });

        self.includedSupplementsByType = ko.computed({
            read: function () {
                var supplements = self.supplements();
                var included = [];
                for (var i = 0; i < supplements.length; i++) {
                    var supp = supplements[i];
                    if (supplements[i].isIncluded()) {
                        if (!hasAnyByType(included, supp.planType())) {
                            included.push(supplements[i]);
                        }
                    }
                }

                return included;
            },
            deferEvaluation: true,
            owner: this
        });

        self.printPlanDetailsLink = ko.computed({
            read: function () {
                var link = "/print-plan-details.aspx?planid=" + self.planGuid();
                if (app.viewModels.PlanDetailsViewModel.tceFromStartOfYear()) {
                    link += '&fromyearstart=' + app.viewModels.PlanDetailsViewModel.tceFromStartOfYear() + '&PharmacyId=' + app.user.UserSession.UserPharmacies.selectedPharmacy().Id;

                }

                return link;
            },
            deferEvaluation: true,
            owner: this
        });

        self.planTileAnchorHref = ko.computed({
            read: function () {
                var href = 'javascript:;';
                if (EXCHANGE.countyPlanList && self.plan()) {
                    href = '/find-plans/' + self.plan().urlSafePlanName + '|' + self.plan().planId;
                }

                return href;
            },
            owner: this
        });

        self.showBrowsePlansDrugPrompt = ko.computed({
            read: function () {
                if (self.rxIndicator_bool() && app.browsePlans) {
                    return true;
                }
                return false;
            },
            owner: this
        });

        PlanViewModel.prototype.showAttributeCell = function showAttributeCell(AttributeValues) {
            for (var i = 0; i < AttributeValues.length; i++) {
                if (!AttributeValues[i].NoAttributeValue) {
                    return true;
                }
            }
            return false;
        };

        PlanViewModel.prototype.formatAttributeValue = function formatAttributeValue(AttributeValues) {
            var formattedValue = '';
            var first = true;
            for (var i = 0; i < AttributeValues.length; i++) {
                if (!AttributeValues[i].NoAttributeValue) {
                    if (!first) {
                        formattedValue += " / ";
                    }
                    formattedValue += AttributeValues[i].FormattedValue;
                    first = false;
                }
            }
            return formattedValue;
        };

        PlanViewModel.prototype.loadFromPlan = function loadFromPlan(params) {
            var protoSelf = this;
            protoSelf.plan(params);

            protoSelf.insurerName(params.insurerName);
            protoSelf.insurerPhone(params.insurerPhone);
            protoSelf.insurerUrl(params.insurerUrl);

            protoSelf.planGuid(params.planGuid);
            protoSelf.planName_lbl(params.planName);
            protoSelf.compID(params.compID);

            protoSelf.planType(params.planType);
            protoSelf.cartPrecheckId(params.CartPrecheckId);

            protoSelf.planId(params.planId);
            protoSelf.planIdText(app.viewModels.PlanSharedResourceStrings.planIdText());

            protoSelf.frequencyPremium(params.premiumFrequency);
            protoSelf.frequencyPremiumText(app.viewModels.PlanSharedResourceStrings.frequencyPremium_lbl());
            protoSelf.frequencyPremiumValue(params.premiumValue);
            protoSelf.frequencyPremiumValue_lbl(params.premiumValue_lbl);
            protoSelf.premiumFound(params.premiumFound);

            protoSelf.cmsRating_int(params.cmsRating);

            protoSelf.medIndicator_bool(params.medicalIndicator);
            protoSelf.medCovered_bool(params.medicalIndicator);

            protoSelf.rxIndicator_bool(params.prescriptionIndicator);
            protoSelf.rxCovered_bool(params.prescriptionIndicator);
            if (app.viewModels.RecResultsViewModel != undefined) {
                protoSelf.rxIndicator_bool(true);
            }

            protoSelf.planDrugs(params.planDrugs);
            protoSelf.areMyMedicinesCovered_lbl(app.viewModels.PlanSharedResourceStrings.areMyMedicinesCovered_lbl());
            protoSelf.areMyMedicinesCoveredHover_lbl(app.viewModels.PlanSharedResourceStrings.areMyMedicinesCoveredHover_lbl());
            protoSelf.doctorFinder_lbl(app.viewModels.PlanSharedResourceStrings.doctorFinder_lbl());
            protoSelf.doctorFinderNoLink_lbl(app.viewModels.PlanSharedResourceStrings.doctorFinderNoLink_lbl());
            protoSelf.doctorFinderHover_lbl(app.viewModels.PlanSharedResourceStrings.doctorFinderHover_lbl());

            protoSelf.moreOptions_lbl(app.viewModels.PlanSharedResourceStrings.moreOptions_lbl());
            protoSelf.planDetails_lbl(app.viewModels.PlanSharedResourceStrings.moreOptsPlanDetails_lbl());
            protoSelf.saveForLater_lbl(app.viewModels.PlanSharedResourceStrings.moreOptsSave_lbl());
            protoSelf.savedForLater_lbl(app.viewModels.PlanSharedResourceStrings.moreOptsSaved_lbl());
            protoSelf.PPCID(params.PPCID);
            protoSelf.readyToSell(params.readyToSell);
            protoSelf.cannotSell_lbl(params.cannotSell_lbl);

            protoSelf.isInCart(params.isInCart);
            protoSelf.isCompared(params.isCompared);
            protoSelf.isSaved(params.isSaved);
            var supplements = [];
            if (params.supplements) {
                for (var i = 0; i < params.supplements.length; i++) {
                    supplements.push(new ns.SupplementsViewModel().loadFromJSON(params.supplements[i], protoSelf.planGuid()));
                }
            }

            protoSelf.supplements(supplements);

            for (var i = 0; i < params.attributeTemplates.length; i++) {
                if (params.attributeTemplates[i].TemplateCode == app.enums.TemplateCodeEnum.SEARCHSUMMARY) {
                    protoSelf.srAttributeTemplate(params.attributeTemplates[i]);
                } else if (params.attributeTemplates[i].TemplateCode == app.enums.TemplateCodeEnum.SUMMARYPLANDETAILS) {
                    protoSelf.detailsAttributeTemplate(params.attributeTemplates[i]);
                }
            }

            //protoSelf.attributes(params.attributes);
            protoSelf.hasBeenLoaded(true);

            return protoSelf;
        };
    };

} (EXCHANGE, this));

