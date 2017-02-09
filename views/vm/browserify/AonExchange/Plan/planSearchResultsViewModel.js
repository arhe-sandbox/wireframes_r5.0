(function (app, global) {
    var ns = app.namespace('EXCHANGE.models');

    ns.RecommendationViewModel = function RecommendationViewModel() {
        var self = this;
        self.Info = {};
        OppCost = function TotalwOppCost(oppCost) {
            if (self.RecommendationInfo != null)
                return self.RecommendationInfo.AnnualCost + oppCost;
        }

    };

    ns.PlanSearchResultsViewModel = function PlanSearchResultsViewModel(parentTabIndex) {
        if (!(this instanceof PlanSearchResultsViewModel)) {
            return new PlanSearchResultsViewModel(parentTabIndex);
        }
        var self = this;

        self.compID = ko.observable('');
        self.compPlan = {};
        self.hasBeenLoaded = ko.observable(false);
        self.drawGraph = ko.observable(false);
        self.parentTabIndex = ko.observable(parentTabIndex);
        self.effectiveDate = '';
        self.insurerMainLogoUrl = '';
        self.insurerSmallLogoUrl = '';
        self.signatureType = '';
        self.planType = '';
        self.medigapType = '';
        self.medicareContractId = '';
        self.medicarePlanId = '';
        self.medicareSegmentId = '';
        self.TCE = '';
        self.DRXPlanID = '';
        self.insurerId = '';
        self.insurerName = '';
        self.insurerPhone = '';
        self.insurerUrl = '';
        self.planGuid = '';
        self.planName_lbl = '';


        self.PPCID = '';
        self.readyToSell = '';
        self.cannotSell_lbl = '';
        self.planId = '';
        self.medIndicator_bool = false;
        self.medCovered_bool = false;
        self.rxIndicator_bool = false;
        self.rxCovered_bool = false;
        self.frequencyPremiumValue = '';
        self.frequencyPremiumValue_lbl = '';
        self.fullPremium_lbl = '';
        self.premiumFound = false;
        self.urlSafePlanName = '';
        self.PremiumAmount = '';

        self.planType = '';
        self.cartPrecheckId = '';

        self.areMyMedicinesCoveredHover_lbl = '';

        self.srAttributeTemplate = '';
        self.planTileAnchorHref = '';

        self.AncProviderUrl = '';


        self.Visible = ko.observable(true);
        self.tceLoading = ko.observable(false);
        self.tceLoaded = ko.observable(false);
        self.planDrugsLoading = ko.observable(false);
        self.planDrugsLoaded = ko.observable(true);
        self.needNewCoverageCost = ko.observable(false);

        self.doctorFinder_lbl = ko.observable('');
        self.doctorFinderNoLink_lbl = ko.observable('');
        self.doctorFinderHover_lbl = ko.observable('');
        self.priorYearPlan = ko.observable(false);

        self.dentalProvider_lbl = ko.observable('');
        self.visionProvider_lbl = ko.observable('');

        self.primaryMinAge = ko.observable(0);
        self.primaryMaxAge = ko.observable(0);
        self.primaryAgeRule = ko.observable("NA");

        self.spouseMinAge = ko.observable(0);
        self.spouseMaxAge = ko.observable(0);
        self.spouseAgeRule = ko.observable("NA");

        self.dependentMinAge = ko.observable(0);
        self.dependentMaxAge = ko.observable(0);
        self.dependentAgeRule = ko.observable("NA");

        self.coveredMembers = ko.observable([]);
        self.unCoveredMembers = ko.observable([]);


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

                if (self.priorYearPlan())
                    return false;
                else {
                    return (self.rxCovered_bool &&
                    (app.user && app.user.UserSession && app.user.UserSession.UserDrugs &&
                        app.user.UserSession.UserDrugs.drugs().length > 0) && !EXCHANGE.user.UserSession.ShowRxPreloadLb());
                }
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

        self.tceTotalDisplaySearchResults = ko.computed({
            read: function () {
                var total = 0;
                var tceLoaded = self.tceLoaded();
                if (self.TCE) {
                    total = self.TCE;

                }
                return app.exchangeContext.ExchangeContext.currencySymbol() + total.toFixed(2) + "<sup>†</sup>";


            },
            owner: this,
            deferEvaluation: true
        });

        self.tceTotalDisplayComparePlans = ko.computed({
            read: function () {
                var costEstimate = self.tceCost();
                if (costEstimate) {
                    var total = 0;
                    if (self.rxCovered_bool && app.viewModels.ComparePlansViewModel.includePrescription() && app.viewModels.ComparePlansViewModel.shouldShowMedicationSection() && self.haveRxData()) {
                        total += costEstimate.InNetworkCalendarYearTotals.DrugCost;
                    }
                    if (self.medCovered_bool && app.viewModels.ComparePlansViewModel.includeMedical() && app.viewModels.ComparePlansViewModel.shouldShowMedicalSection() && self.haveMedData()) {
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
                    if (self.rxCovered_bool && app.viewModels.ComparePlansViewModel.includePrescription() && app.viewModels.ComparePlansViewModel.shouldShowMedicationSection() && self.haveRxData()) {
                        total += costEstimate.InNetworkCalendarYearTotals.DrugCost;
                    }
                    if (self.medCovered_bool && app.viewModels.ComparePlansViewModel.includeMedical() && app.viewModels.ComparePlansViewModel.shouldShowMedicalSection() && self.haveMedData()) {
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

        self.planIdText = app.viewModels.PlanSharedResourceStrings.planIdText;
        self.planId_lbl = '';

        self.premium_lbl = app.viewModels.PlanSharedResourceStrings.premium_lbl;

        self.frequencyPremium = '';
        self.frequency_lbl = '';
        self.frequencyAlternate_lbl = ko.computed({
            read: function () {
                var frequency = self.frequencyPremium;
                if (frequency >= app.enums.PremiumFrequency.length) {
                    return '';
                } else {
                    return app.viewModels.PlanSharedResourceStrings.planPremiumFrequencyAlternate_lbls[frequency];
                }
            },
            owner: this
        });
        self.frequencyPremiumText = '';
        self.frequencyPremium_lbl = ''


        self.cmsRating_int = ko.observable(null);
        self.cmsRatingStarsShow = ko.computed({
            read: function () {
                return self.cmsRating_int() && self.cmsRating_int() > 0;
            },
            owner: this
        });

        self.cmsRatingHover_lbl = ko.computed({
            read: function () {
                return EXCHANGE.viewModels.PlanSharedResourceStrings.cmsRatingOutOf_lbl.format(self.cmsRating_int(), app.viewModels.PlanSharedResourceStrings.cmsRatingDescriptions[Math.round(self.cmsRating_int())]);
            },
            owner: this
        });
        self.cmsRatingHoverBodySummary_lbl = app.viewModels.PlanSharedResourceStrings.cmsRatingHoverBodySummary_lbl;
        self.cmsRatingHoverBody_lbl = ko.computed({
            read: function () {
                return self.cmsRatingHoverBodySummary_lbl.format(self.cmsRating_int());
            },
            owner: this
        });

        self.supplements = ko.observableArray([]);


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
                            return app.viewModels.PlanSharedResourceStrings.supplementFrequency_lbls[frequency];
                        }
                    }
                }
            },
            owner: this
        });
        self.riderDentCoveredHoverBody_lbl = ko.computed({
            read: function () {
                return app.viewModels.PlanSharedResourceStrings.coverageAdditionalCost_lbl.format(self.riderDentCost(), self.riderDentFrequency());
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
        self.riderVisCoveredHoverBody_lbl = ko.computed({
            read: function () {
                return app.viewModels.PlanSharedResourceStrings.coverageAdditionalCost_lbl.format(self.riderVisCost(), self.riderVisFrequency());
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

        self.isInCart = ko.observable(false);
        self.addToCart_lbl = ko.computed({
            read: function () {
                if (self.isInCart()) {
                    return app.viewModels.PlanSharedResourceStrings.inCartBtn_lbl;
                } else {
                    return app.viewModels.PlanSharedResourceStrings.addToCartBtn_lbl;
                }
            },
            owner: this
        });


        self.addToCartToolTip_lbl = ko.computed({
            read: function () {
                if (self.isInCart()) {
                    return app.viewModels.PlanSharedResourceStrings.addIsInCartHover_lbl;
                } else {
                    return app.viewModels.PlanSharedResourceStrings.addNotInCartHover_lbl;
                }
            },
            owner: this
        });

        function getFormattedLabel() {

            var formattedLightboxName = 'Search Results';

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

            var lable = '';
            if (EXCHANGE.ancSearchResults) {
                lable = EXCHANGE.viewModels.AncSearchResultsViewModel.isDental() ? 'dental' : 'vision';
            } else if (EXCHANGE.searchResults) {
                lable = EXCHANGE.viewModels.SearchResultsViewModel.currentTab();
            }
            switch (lable) {

                case 'advantage':
                    return formattedLightboxName + ' - ' + 'MA';
                case 'drugs':
                    return formattedLightboxName + ' - ' + 'PDP';
                case 'medigap':
                    return formattedLightboxName + ' - ' + 'Gap';
                case 'dental':
                    return formattedLightboxName + ' - ' + 'DENTAL';
                case 'vision':
                    return formattedLightboxName + ' - ' + 'VISION';
                default:
                    return formattedLightboxName + ' - ' + 'MA';
            }

        }

        self.toggleCosts = function toggleCosts() {
            //$('.providerpricing #' + self.planGuid + '').toggle();
            $('.retailcost').find('#' + self.planGuid).toggle();
            $('.mailcost').find('#' + self.planGuid).toggle();
            $('.togglecost #' + self.planGuid + '').text($('.togglecost #' + self.planGuid + '').text() == "Show Mail Cost" ? "Show Retail Cost" : "Show Mail Cost");
        };

        self.addToCart = function addToCart() {

            if (_gaq) {
                _gaq.push(['_trackEvent', 'Add To Cart', 'Click', getFormattedLabel()]);
            }

            if (!self.isInCart()) {

                if (app.user.UserSession.UserProfile.isKidneyFailure && self.cartPrecheckId == 'ESRD') {
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.IsEGHP(false);
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.ESRD_Id('esrd-switchblock');
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.PlanName_Lbl(self.planName_lbl);
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.Plan(self);
                    $.publish("EXCHANGE.lightbox.esrdconfirm.open");

                } else if (self.planType == 1 && self.cartPrecheckId == 'Loss EGHP') {
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.IsEGHP(true);
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.ESRD_Id('eghp-switchblock');
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.PlanName_Lbl(self.planName_lbl);
                    EXCHANGE.viewModels.ESRDConfirmationViewModel.Plan(self);
                    $.publish("EXCHANGE.lightbox.esrdconfirm.open");
                } else {
                    app.cart.CartAPI.addPlanToCart(self.planGuid, true, true);
                }

            } else {
                app.cart.CartAPI.removePlanFromCart(self.planGuid);
                //self.isInCart(false);

            }
        };

        self.inEligibleMemberCheck = function inEligibleMemberCheck() {

            if (EXCHANGE.user.UserSession.UserProfile.family() != null) {
                var family = [];
                family = EXCHANGE.user.UserSession.UserProfile.family();
                var foundInArray = false;
                var showLB = false;
                switch (self.planType) {
                    case EXCHANGE.enums.PlanTypeEnum.DENTAL:
                        if (family.length > 0) {
                            $.each(family, function (index, data) {
                                // for each of the plan uncovered self.unCoveredMembers
                                if (data.IsDentalCoverage) {

                                    foundInArray = false;
                                    for (i = 0; i < self.coveredMembers.length; i++) {
                                        if (data.CustomerNumber == self.coveredMembers[i].CustomerNumber) {
                                            foundInArray = true;
                                        }
                                    }

                                    if (!foundInArray) {
                                        for (i = 0; i < self.unCoveredMembers.length; i++) {
                                            if (data.CustomerNumber == self.unCoveredMembers[i].CustomerNumber) {

                                                foundInArray = true;
                                            }
                                        }
                                    }

                                    if (foundInArray) {
                                        showLB = false;
                                    }
                                    else {
                                        showLB = true;
                                    }
                                }

                            });


                        }

                        return showLB;
                        break;

                    case EXCHANGE.enums.PlanTypeEnum.VISION:
                        if (family.length > 0) {
                            $.each(family, function (index, data) {
                                // for each of the plan uncovered self.unCoveredMembers
                                if (data.IsVisionCoverage) {
                                    foundInArray = false;
                                    //data.CustomerNumber, self.coveredMembers
                                    for (i = 0; i < self.coveredMembers.length; i++) {
                                        if (data.CustomerNumber == self.coveredMembers[i].CustomerNumber) {
                                            foundInArray = true;
                                        }
                                    }

                                    if (!foundInArray) {
                                        for (i = 0; i < self.unCoveredMembers.length; i++) {
                                            if (data.CustomerNumber == self.unCoveredMembers[i].CustomerNumber) {

                                                foundInArray = true;
                                            }
                                        }
                                    }

                                    if (foundInArray) {
                                        showLB = false;
                                    }
                                    else {
                                        showLB = true;
                                    }
                                }

                            });

                        }
                        return showLB;
                        break;

                    default:
                        break;
                }
            }
            else {
                return false;
            }
        }



        self.addAncillaryPlanToCart = function addAncillaryPlanToCart() {

            if (_gaq) {
                _gaq.push(['_trackEvent', 'Add To Cart', 'Click', getFormattedLabel()]);
            }

            if (!self.isInCart()) {

                if (self.inEligibleMemberCheck()) {
                    EXCHANGE.models.AddToCartInEligibleFamilyMemberViewModel.planGuid = self.planGuid;
                    //Call add cart dependent lightbox  
                    $.publish("EXCHANGE.lightbox.addToCartInEligibleFamilyMember.open");

                }
                else {
                    if (app.user.UserSession.UserProfile.isKidneyFailure && self.cartPrecheckId == 'ESRD') {
                        EXCHANGE.viewModels.ESRDConfirmationViewModel.IsEGHP(false);
                        EXCHANGE.viewModels.ESRDConfirmationViewModel.ESRD_Id('esrd-switchblock');
                        EXCHANGE.viewModels.ESRDConfirmationViewModel.PlanName_Lbl(self.planName_lbl);
                        EXCHANGE.viewModels.ESRDConfirmationViewModel.Plan(self);
                        $.publish("EXCHANGE.lightbox.esrdconfirm.open");

                    } else if (self.planType == 1 && self.cartPrecheckId == 'Loss EGHP') {
                        EXCHANGE.viewModels.ESRDConfirmationViewModel.IsEGHP(true);
                        EXCHANGE.viewModels.ESRDConfirmationViewModel.ESRD_Id('eghp-switchblock');
                        EXCHANGE.viewModels.ESRDConfirmationViewModel.PlanName_Lbl(self.planName_lbl);
                        EXCHANGE.viewModels.ESRDConfirmationViewModel.Plan(self);
                        $.publish("EXCHANGE.lightbox.esrdconfirm.open");
                    } else {
                        app.cart.CartAPI.addAncillaryPlanToCart(self.planGuid, true, true);
                        $('#span' + self.planGuid).text = EXCHANGE.viewModels.PlanSharedResourceStrings.inCartBtn_lbl;
                    }

                }

            } else {
                app.cart.CartAPI.removeAncillaryPlanFromCart(self.planGuid);
                //self.isInCart(false);

            }
        };

        self.isCompared = ko.observable(false);

        self.compareHover_lbl = ko.computed({
            read: function () {
                if (self.isCompared()) {
                    return app.viewModels.PlanSharedResourceStrings.compareTrueHover_lbl;
                } else {
                    return app.viewModels.PlanSharedResourceStrings.compareFalseHover_lbl;
                }
            },
            owner: this
        });

        self.explicitRemoveFromCompare = function explicitRemoveFromCompare() {
            EXCHANGE.plans.removeFromCompared(self);
            self.isCompared(false);
        };

        self.addToCompare = function addToCompare() {
            var shouldCompare = EXCHANGE.plans.getComparedPlansCount(self.planType) < 3;
            if (!self.isCompared()) {

                if (shouldCompare)
                    EXCHANGE.plans.addToCompared(self);
                else {
                    self.isCompared(false);
                    var PlanTypeName;
                    if (app.viewModels.RecResultsViewModel != undefined && EXCHANGE.viewModels.ComparisonLimitViewModel.selected3PlansBody_lbl() != "") {
                        if (app.viewModels.RecResultsViewModel.currentTabIndex() == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
                            PlanTypeName = app.enums.PlanTypeNameEnum.MEDICAREADVANTAGE;
                        } else if (app.viewModels.RecResultsViewModel.currentTabIndex() == app.enums.PlanTypeEnum.MEDIGAP) {
                            PlanTypeName = app.enums.PlanTypeNameEnum.MEDIGAP;
                        } else if (app.viewModels.RecResultsViewModel.currentTabIndex() == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
                            PlanTypeName = app.enums.PlanTypeNameEnum.PRESCRIPTIONDRUG;
                        } else {
                            PlanTypeName = EXCHANGE.viewModels.ComparisonLimitViewModel.selected3PlansBody_lbl();
                        }
                        EXCHANGE.viewModels.ComparisonLimitViewModel.selected3PlansBody_lbl_formatted = EXCHANGE.viewModels.ComparisonLimitViewModel.selected3PlansBody_lbl().format(PlanTypeName);
                    }
                    $.publish("EXCHANGE.lightbox.comparisonlimit.open");
                }

            } else {
                EXCHANGE.plans.removeFromCompared(self);
            }

        };

        self.isSaved = ko.observable(false);
        self.moreOptsSaved_lbl = ko.computed({
            read: function () {
                if (self.isSaved()) {
                    return EXCHANGE.viewModels.PlanSharedResourceStrings.moreOptsSaved_lbl;
                } else {
                    return EXCHANGE.viewModels.PlanSharedResourceStrings.moreOptsSave_lbl;
                }
            },
            owner: this
        });

        self.addToSaved = function addToSaved() {
            if (EXCHANGE.user.UserSession.IsLoggedIn()) {
                if (!self.isSaved()) {
                    app.user.UserSession.SavedPlans.addPlan(self);
                } else {
                    $.publish("EXCHANGE.lightbox.savedplans.open");
                }
            } else {
                $.publish("EXCHANGE.lightbox.login.open");
            }
        };

        self.removeFromSaved = function removeFromSaved(data, ev) {
            app.user.UserSession.SavedPlans.removePlan(data);
            app.user.UserSession.SavedPlans.tabGroups(app.user.UserSession.SavedPlans.tabGroups());
            ev.preventDefault();
            ev.stopPropagation();
        };


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

        self.attributes = [];

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


        self.showBrowsePlansDrugPrompt = ko.computed({
            read: function () {
                if (self.rxIndicator_bool && app.browsePlans) {
                    return true;
                }
                return false;
            },
            owner: this
        });
        self.RecommendationInfo = {};
        self.PW = ko.observable(new EXCHANGE.models.RecommendationViewModel());


        PlanSearchResultsViewModel.prototype.showAttributeCell = function showAttributeCell(AttributeValues) {


            for (var i = 0; i < AttributeValues.length; i++) {
                if (!AttributeValues[i].NoAttributeValue) {
                    return true;
                }
            }
            return false;


        };

        PlanSearchResultsViewModel.prototype.formatAttributeValue = function formatAttributeValue(AttributeValues) {


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




        PlanSearchResultsViewModel.prototype.loadFromPlanDomainEntity = function loadFromPlan(params) {
            var protoSelf = this;

            var plan = params.Plan;
            if (null == plan || undefined == plan) {
                plan = params.PlanDetails;
            }

            if (null == plan || undefined == plan) {
                return;
            }




            protoSelf.insurerId = plan.Insurer.Id;
            protoSelf.insurerName = plan.Insurer.Name;
            protoSelf.insurerPhone = plan.Insurer.Phone;
            protoSelf.insurerUrl = plan.Insurer.Url;
            protoSelf.planGuid = plan.Id;
            protoSelf.planName_lbl = plan.Name;
            protoSelf.effectiveDate = plan.EffectiveDate;
            protoSelf.medicareContractId = plan.MedicareContractId;
            protoSelf.medicarePlanId = plan.MedicarePlanId;
            protoSelf.medicareSegmentId = plan.MedicareSegmentId;

            protoSelf.insurerMainLogoUrl = plan.Insurer.MainLogoUrl;
            protoSelf.insurerSmallLogoUrl = plan.Insurer.SmallLogoUrl;
            protoSelf.signatureType = plan.SignatureType;
            protoSelf.planType = plan.PlanType;
            protoSelf.medigapType = plan.MedigapLetter;
            protoSelf.planId = plan.PlanId;
            protoSelf.planId_lbl = app.viewModels.PlanSharedResourceStrings.planIdText.format(protoSelf.planId);

            protoSelf.frequencyPremium = plan.PremiumFrequency;
            protoSelf.frequencyPremiumText = app.viewModels.PlanSharedResourceStrings.frequencyPremium_lbl;

            protoSelf.frequency_lbl = (protoSelf.frequencyPremium >= app.enums.PremiumFrequency.length) ? '' :
                                app.viewModels.PlanSharedResourceStrings.planPremiumFrequency_lbls[protoSelf.frequencyPremium];
            protoSelf.frequencyPremium_lbl = protoSelf.frequencyPremiumText.format(protoSelf.frequency_lbl);


            protoSelf.frequencyPremiumValue = plan.PremiumAmount;
            protoSelf.PremiumAmount = plan.PremiumAmount;

            if (params.PremiumLbl) {
                protoSelf.frequencyPremiumValue_lbl = params.PremiumLbl;
            } else {
                var showAsterick = plan.HasMultiplePremiums || plan.PlanType == app.enums.PlanTypeEnum.Medigap;

                protoSelf.frequencyPremiumValue_lbl = "$" + (plan.PremiumAmount).toFixed(2);
                if (showAsterick) {
                    protoSelf.frequencyPremiumValue_lbl = protoSelf.frequencyPremiumValue_lbl + "*";
                }
            }


            protoSelf.premiumFound = plan.PremiumFound;

            protoSelf.cmsRating_int(plan.CmsRating);

            protoSelf.medIndicator_bool = plan.IsMedical;
            protoSelf.medCovered_bool = plan.IsMedical;

            protoSelf.rxIndicator_bool = plan.IsPdp;
            protoSelf.rxCovered_bool = plan.IsPdp;

            protoSelf.cartPrecheckId = plan.CartPrecheckId;
            //protoSelf.planDrugs(planDrugs);

            protoSelf.PPCID = plan.PPCID;
            protoSelf.readyToSell = plan.ReadyToSell;
            protoSelf.cannotSell_lbl = params.CannotSellLbl;

            protoSelf.isInCart(false);
            protoSelf.isCompared(false);
            protoSelf.isSaved(false);


            if (plan.SearchResultsAttributeTemplates && plan.SearchResultsAttributeTemplates.length > 0) {
                protoSelf.srAttributeTemplate = plan.SearchResultsAttributeTemplates[0];
            }
            else if (plan.AttributeTemplates && plan.AttributeTemplates.length == 1) {
                //treat the default as SearchResultsAttribute
                protoSelf.srAttributeTemplate = plan.AttributeTemplates[0];
            }

            protoSelf.urlSafePlanName = typeof params.UrlSafePlanName != 'undefined' ? params.UrlSafePlanName : '';
            protoSelf.planTileAnchorHref = EXCHANGE.countyPlanList ? '/find-plans/' + self.urlSafePlanName + '|' + self.planId : '';

            protoSelf.AncProviderUrl = typeof plan.ProviderLookupUrl != 'undefined' ? plan.ProviderLookupUrl : '';

            protoSelf.dentalProvider_lbl(app.viewModels.PlanSharedResourceStrings.dentalProvider_lbl);
            protoSelf.visionProvider_lbl(app.viewModels.PlanSharedResourceStrings.visionProvider_lbl);

            protoSelf.doctorFinder_lbl(app.viewModels.PlanSharedResourceStrings.doctorFinder_lbl);
            protoSelf.doctorFinderNoLink_lbl(app.viewModels.PlanSharedResourceStrings.doctorFinderNoLink_lbl);
            protoSelf.doctorFinderHover_lbl(app.viewModels.PlanSharedResourceStrings.doctorFinderHover_lbl);

            if (plan.ProductEligibility != null) {
                protoSelf.primaryMinAge(plan.ProductEligibility.PrimaryMinAge);
                protoSelf.primaryMaxAge(plan.ProductEligibility.PrimaryMaxAge);
                protoSelf.primaryAgeRule(plan.ProductEligibility.PrimaryAgeRule);  //CoverageMonthEnd

                protoSelf.spouseMinAge(plan.ProductEligibility.SpouseMinAge);
                protoSelf.spouseMaxAge(plan.ProductEligibility.SpouseMaxAge);
                protoSelf.spouseAgeRule(plan.ProductEligibility.SpouseAgeRule);

                protoSelf.dependentMinAge(plan.ProductEligibility.DependentMinAge);
                protoSelf.dependentMaxAge(plan.ProductEligibility.DependentMaxAge);
                protoSelf.dependentAgeRule(plan.ProductEligibility.DependentAgeRule);
            }


            var loggedInUserFirstName = "Myself";
            var loggedInUserLastName = "";

            if (EXCHANGE.user !== null && EXCHANGE.user.UserSession !== null && EXCHANGE.user.UserSession.UserProfile !== undefined) {
                if (EXCHANGE.user.UserSession.UserProfile.firstName !== "" || EXCHANGE.user.UserSession.UserProfile.lastName !== "") {
                    loggedInUserFirstName = EXCHANGE.user.UserSession.UserProfile.firstName;
                    loggedInUserLastName = EXCHANGE.user.UserSession.UserProfile.lastName;
                }
            }

            if (plan.CoveredMembers == null) {
                plan.CoveredMembers = [];
                plan.UnCoveredMembers = [];
            }

            if (plan.CoveredMembers.length == 0)
                plan.CoveredMembers.push({ FirstName: loggedInUserFirstName, LastName: loggedInUserLastName, ConnectionType: "Primary" });
            else if (plan.CoveredMembers.length >= 1)
                //to add the primary user at first position, used splice
                plan.CoveredMembers.splice(0, 0, { FirstName: loggedInUserFirstName, LastName: loggedInUserLastName, ConnectionType: "Primary" });


            protoSelf.coveredMembers = plan.CoveredMembers;
            protoSelf.unCoveredMembers = plan.UnCoveredMembers;



            //protoSelf.attributes(params.attributes);
            protoSelf.hasBeenLoaded(true);
            if (EXCHANGE.viewModels.RecResultsViewModel) {

                protoSelf.RecommendationInfo = plan.RecommendationInfo;
                protoSelf.PW.RecommendationInfo = plan.RecommendationInfo;
                protoSelf.compID(plan.RecommendationInfo.CompID);
                var otherPlan = EXCHANGE.viewModels.SearchResultsViewModel.getPlanByPlanGuid(protoSelf.compID());
                protoSelf.compPlan = ((otherPlan));
                if (protoSelf.RecommendationInfo != null)
                    protoSelf.RecommendationInfo.OppCost = function TotalwOppCost(oppCost) {
                        return parseFloat(oppCost) + parseFloat(protoSelf.RecommendationInfo.AnnualCost);
                    };
            }
            return protoSelf;
        };


    };


}(EXCHANGE, this));

