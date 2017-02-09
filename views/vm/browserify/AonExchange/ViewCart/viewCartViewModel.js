(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");
    ns.ViewCartViewModel = function ViewCartViewModel() {
        if (!(this instanceof ViewCartViewModel)) {
            return new ViewCartViewModel();
        }
        var self = this;

        self.planVms = ko.observableArray([]);
        self.planSummaries = ko.observableArray([]);

        self.coveredByText = ko.observable("");
        self.availableWithText = ko.observable("");
        self.alsoIncludedText = ko.observable("");
        self.notCoveredText = ko.observable("");
        self.notSelectedText = ko.observable("");

        self.includedCoverageText = ko.observable("");

        self.optionalCoverageText = ko.observable("");
        self.included_lbl = ko.observable("");

        self.header_lbl = ko.observable("");
        self.headerSingular_lbl = ko.observable("");

        self.covers_lbl = ko.observable("");
        self.change_lbl = ko.observable("");

        self.backBtn_lbl = ko.observable("");
        self.bottomInstructions_html = ko.observable("");
        self.saveCart_lbl = ko.observable("");
        self.doneBtn_lbl = ko.observable("");
        self.medAddPlan_html = ko.observable("");
        self.rxAddPlan_html = ko.observable("");

        self.zipMismatchError_lbl = ko.observable("");
        self.viewCartPostLoginFlag = ko.observable(false);
        self.removedPlanIds = [];
        self.removedPlanNames = [];
        self.planRemove_CoveragePassed = ko.observable("");
        self.planRemove_CoveragePassedFlag = ko.observable("");
        self.planRemove_HasPremium = ko.observable("");
        self.planRemove_HasPremiumFlag = ko.observable("");
        self.planRemove_NotValidAnymore = ko.observable("");
        self.planRemove_NotValidAnymoreFlag = ko.observable("");
        self.planRemove_Plana = ko.observable("");
        self.planRemove_PlanaFlag = ko.observable("");
        self.removedPlans = ko.observableArray([]);

        //Ancillary Products observable Start here
        self.DtlCngts_Html = ko.observable("");
        self.DtlViewbtn_Lbl = ko.observable("");
        self.DtlOr_Html = ko.observable("");
        self.DtlNoThxbtn_Lbl = ko.observable("");
        self.DtlNotintrstbtn_Lbl = ko.observable("");
        self.Dtladditionalbtn_Lbl = ko.observable("");
        self.DtlPlansAvail_Html = ko.observable("");

        self.VsnCngts_Html = ko.observable("");
        self.VsnViewbtn_Lbl = ko.observable("");
        self.VsnOr_Html = ko.observable("");
        self.VsnNoThxbtn_Lbl = ko.observable("");
        self.VsnNotintrstbtn_Lbl = ko.observable("");
        self.Vsnadditionalbtn_Lbl = ko.observable("");
        self.VsnPlansAvail_Html = ko.observable("");
        self.ToShowDentalTile = ko.observable("");
        self.ToShowVisionTile = ko.observable("");
        //Ancillary Products observable end here

        // for select option in detal and vision question popup
        self.DentalVisionReasonSet = ko.observableArray([]);

        // for Question Content in detal and vision question popup
        self.DentalQue_Lbl = ko.observable("");
        self.VisionQue_Lbl = ko.observable("");
        self.Submit_Lbl = ko.observable("");

        self.headerFormatted_lbl = ko.computed({
            read: function () {
                if (self.planVms().length <= 1) {
                    return self.headerSingular_lbl().format(self.planVms().length);
                }
                else {
                    return self.header_lbl().format(self.planVms().length);
                }

                
            },
            deferEvaluation: true,
            owner: this
        });

        self.areIncludedCoverages = ko.computed({
            read: function () {
                var plans = self.planVms();
                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].includedSupplements.length > 0) {
                        return true;
                    }
                }

                return false;
            },
            deferEvaluation: true,
            owner: this
        });

        self.areOptionalCoverages = ko.computed({
            read: function () {
                var plans = self.planVms();
                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].optionalSupplements.length > 0) {
                        return true;
                    }
                }

                return false;
            },
            deferEvaluation: true,
            owner: this
        });

        self.medCovered = ko.computed({
            read: function () {
                var plans = self.planVms();
                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].medCovered_bool) {
                        return true;
                    }
                }

                return false;
            },
            deferEvaluation: true,
            owner: this
        });

        self.medNotCovered = ko.computed({
            read: function () {
                var plans = self.planVms();
                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].medCovered_bool) {
                        return false;
                    }
                }

                return true;
            },
            deferEvaluation: true,
            owner: this
        });

        self.medCoveredByText = ko.computed({
            read: function () {
                var plans = self.planVms();
                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].medCovered_bool) {
                        return self.coveredByText().format(i + 1);
                    }
                }

                return "";
            }
        });

        self.rxCovered = ko.computed({
            read: function () {
                var plans = self.planVms();
                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].rxCovered_bool) {
                        return true;
                    }
                }

                return false;
            },
            deferEvaluation: true,
            owner: this
        });

        self.rxNotCovered = ko.computed({
            read: function () {
                var plans = self.planVms();
                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].rxCovered_bool) {
                        return false;
                    }
                }

                return true;
            },
            deferEvaluation: true,
            owner: this
        });

        self.rxCoveredByText = ko.computed({
            read: function () {
                var plans = self.planVms();
                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].rxCovered_bool) {
                        return self.coveredByText().format(i + 1);
                    }
                }

                return "";
            }
        });



        self.dentalCovered = ko.computed({
            read: function () {
                var plans = self.planVms();
                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].planType == app.enums.PlanTypeEnum.DENTAL) {
                        return true;
                    }
                }

                return false;
            },
            deferEvaluation: true,
            owner: this
        });

        self.dentalNotCovered = ko.computed({
            read: function () {
                var plans = self.planVms();
                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].planType == app.enums.PlanTypeEnum.DENTAL) {
                        return false;
                    }
                }

                return true;
            },
            deferEvaluation: true,
            owner: this
        });

        self.dentalCoveredByText = ko.computed({
            read: function () {
                var plans = self.planVms();
                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].planType == app.enums.PlanTypeEnum.DENTAL) {
                        return self.coveredByText().format(i + 1);
                    }
                }

                return "";
            }
        });

        self.ShowDentalTile = ko.computed({
            read: function () {
                if (self.ToShowDentalTile() == true && self.dentalCovered() == false) {
                    return true;
                }
                else {
                    return false;
                }
            },
            deferEvaluation: true,
            owner: this
        });

        self.ShowVisionTile = ko.computed({
            read: function () {
                if (self.ToShowVisionTile() == true && self.visionCovered() == false) {
                    return true;
                }
                else {
                    return false;
                }
            },
            deferEvaluation: true,
            owner: this
        });
        self.visionCovered = ko.computed({
            read: function () {
                var plans = self.planVms();
                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].planType == app.enums.PlanTypeEnum.VISION) {
                        return true;
                    }
                }

                return false;
            },
            deferEvaluation: true,
            owner: this
        });

        self.visionNotCovered = ko.computed({
            read: function () {
                var plans = self.planVms();
                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].planType == app.enums.PlanTypeEnum.VISION) {
                        return false;
                    }
                }

                return true;
            },
            deferEvaluation: true,
            owner: this
        });

        self.visionCoveredByText = ko.computed({
            read: function () {
                var plans = self.planVms();
                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].planType == app.enums.PlanTypeEnum.VISION) {
                        return self.coveredByText().format(i + 1);
                    }
                }

                return "";
            }
        });


        self.coverageType = function (type) {
            switch (type) {
                case app.enums.PlanTypeEnum.MEDICAREADVANTAGE:
                    return app.enums.PlanTypeNameEnum.MEDICAREADVANTAGE;
                case app.enums.PlanTypeEnum.PRESCRIPTIONDRUG:
                    return app.enums.PlanTypeNameEnum.PRESCRIPTIONDRUG;
                case app.enums.PlanTypeEnum.MEDIGAP:
                    return app.enums.PlanTypeNameEnum.MEDIGAP;
                case app.enums.PlanTypeEnum.DENTAL:
                    return app.enums.PlanTypeNameEnum.DENTAL;
                case app.enums.PlanTypeEnum.VISION:
                    return app.enums.PlanTypeNameEnum.VISION;
                case app.enums.PlanTypeEnum.DENTALANDVISION:
                    return app.enums.PlanTypeNameEnum.DENTALANDVISION;
                default:
                    return "";
            }
        };

        self.coverageTypeIncluded = function (type) {
            return self.coverageType(type) + ": " + self.included_lbl();
        };

        self.coverageTypeClass = function (type) {
            return self.coverageType(type).toLowerCase();
        };

        ViewCartViewModel.prototype.loadFromJSON = function loadFromJSON(viewCart) {
            var protoSelf = this;
            protoSelf.coveredByText(viewCart.CoveredByText);
            protoSelf.availableWithText(viewCart.AvailableWithText);
            protoSelf.alsoIncludedText(viewCart.AlsoIncludedText);
            protoSelf.notCoveredText(viewCart.NotCoveredText);
            protoSelf.notSelectedText(viewCart.NotSelectedText);
            protoSelf.includedCoverageText(viewCart.IncludedCoverageText);

            protoSelf.optionalCoverageText(viewCart.OptionalCoverageText);
            protoSelf.included_lbl(viewCart.Included_Lbl);

            protoSelf.header_lbl(viewCart.Header_Lbl);
            protoSelf.headerSingular_lbl(viewCart.HeaderSingular_Lbl);

            protoSelf.covers_lbl(viewCart.Covers_Lbl);
            protoSelf.change_lbl(viewCart.Change_Lbl);

            protoSelf.backBtn_lbl(viewCart.BackBtn_Lbl);
            protoSelf.bottomInstructions_html(viewCart.BottomInstructions_Html);
            protoSelf.saveCart_lbl(viewCart.SaveCart_Lbl);
            protoSelf.doneBtn_lbl(viewCart.DoneBtn_Lbl);
            protoSelf.medAddPlan_html(viewCart.MedAddPlan_Html);
            protoSelf.rxAddPlan_html(viewCart.RxAddPlan_Html);

            protoSelf.zipMismatchError_lbl(viewCart.ZipMismatchError_lbl);

            protoSelf.planRemove_CoveragePassed(viewCart.PlanRemove_CoveragePassed);
            protoSelf.planRemove_CoveragePassedFlag(viewCart.PlanRemove_CoveragePassedFlag);
            protoSelf.planRemove_HasPremium(viewCart.PlanRemove_HasPremium);
            protoSelf.planRemove_HasPremiumFlag(viewCart.PlanRemove_HasPremiumFlag);
            protoSelf.planRemove_NotValidAnymore(viewCart.PlanRemove_NotValidAnymore);
            protoSelf.planRemove_NotValidAnymoreFlag(viewCart.PlanRemove_NotValidAnymoreFlag);
            protoSelf.planRemove_Plana(viewCart.PlanRemove_Plana);
            protoSelf.planRemove_PlanaFlag(viewCart.PlanRemove_PlanaFlag);
            protoSelf.removedPlanNames = viewCart.RemovedPlanNames;
            protoSelf.removedPlanIds = viewCart.RemovedPlanIds;

            //Ancillary products protoSelf start here
            protoSelf.DtlCngts_Html(viewCart.DtlCngts_Html);
            protoSelf.DtlViewbtn_Lbl(viewCart.DtlViewbtn_Lbl);
            protoSelf.DtlOr_Html(viewCart.DtlOr_Html);
            protoSelf.DtlNoThxbtn_Lbl(viewCart.DtlNoThxbtn_Lbl);
            protoSelf.DtlNotintrstbtn_Lbl(viewCart.DtlNotintrstbtn_Lbl);
            protoSelf.Dtladditionalbtn_Lbl(viewCart.Dtladditionalbtn_Lbl);
            protoSelf.DtlPlansAvail_Html(viewCart.DtlPlansAvail_Html);

            protoSelf.VsnCngts_Html(viewCart.VsnCngts_Html);
            protoSelf.VsnViewbtn_Lbl(viewCart.VsnViewbtn_Lbl);
            protoSelf.VsnOr_Html(viewCart.VsnOr_Html);
            protoSelf.VsnNoThxbtn_Lbl(viewCart.VsnNoThxbtn_Lbl);
            protoSelf.VsnNotintrstbtn_Lbl(viewCart.VsnNotintrstbtn_Lbl);
            protoSelf.Vsnadditionalbtn_Lbl(viewCart.Vsnadditionalbtn_Lbl);
            protoSelf.VsnPlansAvail_Html(viewCart.VsnPlansAvail_Html);
            protoSelf.ToShowDentalTile(viewCart.ToShowDentalTile);
            protoSelf.ToShowVisionTile(viewCart.ToShowVisionTile);
            //Ancillary products protoSelf end here

            // for select option in detal and vision question popup
            protoSelf.DentalVisionReasonSet(viewCart.DentalVisionReasonSet);

            // for Question Content in detal and vision question popup
            protoSelf.DentalQue_Lbl(viewCart.DentalQue_Lbl);
            protoSelf.VisionQue_Lbl(viewCart.VisionQue_Lbl);
            protoSelf.Submit_Lbl(viewCart.Submit_Lbl);

            return protoSelf;
        };

        ViewCartViewModel.prototype.setPlans = function setPlans(cartPlans) {
            var protoSelf = this;
            protoSelf.planVms([]);
            protoSelf.planSummaries([]);
            //            var plansList = app.user.ShoppingCart.plans();
            for (var i = 0; i < cartPlans.length; i++) {
                var planSRVM = new EXCHANGE.models.PlanSearchResultsViewModel(cartPlans[i].Plan.PlanType);
                var planVm = planSRVM.loadFromPlanDomainEntity(cartPlans[i]);

                var included = [];
                var optional = [];
                for (var j = 0; j < cartPlans[i].Plan.Supplements.length; j++) {
                    if (cartPlans[i].Plan.Supplements[j].isIncluded()) {
                        included.push(cartPlans[i].Plan.Supplements[j]);
                    }
                    if (cartPlans[i].Plan.Supplements[j].isOptional()) {
                        optional.push(cartPlans[i].Plan.Supplements[j]);
                    }

                }
                planVm["includedSupplements"] = included;
                planVm["optionalSupplements"] = optional;


                // planVm.fullPremium_lbl(cartPlans[i].FullPremium);
                protoSelf.planVms.push(planVm);
                protoSelf.planSummaries.push(cartPlans[i]);
            }
        };

        ViewCartViewModel.prototype.setRemovedPlans = function setRemovedPlans() {
            var protoSelf = this;
            protoSelf.removedPlans([]);
            //if automated removal took out plans, make sure JS cart reflects that
            if (protoSelf.removedPlanIds.length > 0) {
                $.each(protoSelf.removedPlanIds, function (index, item) {
                    //var planVm2 = EXCHANGE.plans.AllPlanViewModels[item];
                    protoSelf.removedPlans.push("PLAN");
                });
            }
        };

        self.availableTextFormatted = function availableTextFormatted(index) {
            return self.availableWithText().format(index);
        };

        self.includedTextFormatted = function includedTextFormatted(index) {
            return self.alsoIncludedText().format(index);
        };

        self.isSupplementPartOfPlan = function isSupplementPartOfPlan(planId, supplementId) {
            var found = false;
            $.each(self.planSummaries(), function (index, item) {
                if (item.PlanId === planId) {
                    if (item.SupplementIds.indexOf(supplementId) != -1) {
                        found = true;
                        return;
                    }
                }
            });

            return found;
        };

        self.planTypeFull_html = function (supp) {
            var text = self.coverageType(supp.planType());
            if (!(self.isSupplementPartOfPlan(supp.planId(), supp.id()))) {
                text += " (<em class='red'>" + self.notSelectedText() + "</em>)";
            }

            return text;
        };

        self.planHasDental = function (plan) {
            var supps = plan.supplements();
            for (var i = 0; i < supps.length; i++) {
                if (supps[i].planType() === app.enums.PlanTypeEnum.DENTAL || supps[i].planType() === app.enums.PlanTypeEnum.DENTALANDVISION) {
                    if (self.isSupplementPartOfPlan(plan.planGuid(), supps[i].id()) || supps[i].isIncluded()) {
                        return true;
                    }
                }
            }

            return false;
        };

        self.planHasVision = function (plan) {
            var supps = plan.supplements();
            for (var i = 0; i < supps.length; i++) {
                if (supps[i].planType() === app.enums.PlanTypeEnum.VISION || supps[i].planType() === app.enums.PlanTypeEnum.DENTALANDVISION) {
                    if (self.isSupplementPartOfPlan(plan.planGuid(), supps[i].id()) || supps[i].isIncluded()) {
                        return true;
                    }
                }
            }

            return false;
        };

        return self;

    };
} (EXCHANGE));

(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");
    ns.IneligibleCheckoutViewModel = function IneligibleCheckoutViewModel() {
        if (!(this instanceof IneligibleCheckoutViewModel)) {
            return new IneligibleCheckoutViewModel();
        }
        var self = this;

        self.pleaseCallUsText = ko.observable('');
        self.errorMessages = ko.observableArray([]);
        self.callUsText = ko.observable('');
        self.otherOptionsText = ko.observable('');
        self.requestCallBackLinkText = ko.observable('');
        self.chatLinkText = ko.observable('');
        self.emailHelpLinkText = ko.observable('');
        self.goBack = ko.observable('');
        self.home = ko.observable('');
        self.moreHelp = ko.observable('');
        self.isIneligibleForCheckout = ko.observable(true);

        IneligibleCheckoutViewModel.prototype.loadFromJSON = function loadFromJSON(getHelp) {
            self.pleaseCallUsText(getHelp.PleaseCallUsText);
            self.errorMessages(getHelp.ErrorMessages);
            self.callUsText(getHelp.CallUsText);
            self.otherOptionsText(getHelp.OtherOptionsText);
            self.requestCallBackLinkText(getHelp.RequestCallBackLinkText);
            self.chatLinkText(getHelp.ChatLinkText);
            self.emailHelpLinkText(getHelp.EmailHelpLinkText);
            self.goBack(getHelp.GoBack);
            self.home(getHelp.Home);
            self.moreHelp(getHelp.MoreHelp);
            self.isIneligibleForCheckout(getHelp.IsIneligibleForCheckout);

            return self;
        };


        IneligibleCheckoutViewModel.prototype.setErrorText = function loadFromJSON(errText) {
            self.errorText(errText);

            return self;
        };

        return self;
    };

} (EXCHANGE));

(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");
    ns.RequiresCarrierPortalViewModel = function RequiresCarrierPortalViewModel() {
        if (!(this instanceof RequiresCarrierPortalViewModel)) {
            return new RequiresCarrierPortalViewModel();
        }
        var self = this;

        self.pleaseCallUsText = ko.observable('');
        self.bodyText = ko.observable('');
        self.goBack = ko.observable('');
        self.moreHelp = ko.observable('');
        self.isRequired = ko.observable(true);

        RequiresCarrierPortalViewModel.prototype.loadFromJSON = function loadFromJSON(serverViewModel) {
            self.pleaseCallUsText(serverViewModel.PleaseCallUsText);
            self.bodyText(serverViewModel.BodyText);
            self.goBack(serverViewModel.GoBack);
            self.moreHelp(serverViewModel.MoreHelp);
            self.isRequired(serverViewModel.IsRequired);

            return self;
        };

        return self;
    };

} (EXCHANGE));
