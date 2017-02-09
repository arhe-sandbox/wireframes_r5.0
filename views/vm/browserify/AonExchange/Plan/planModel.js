
(function (app, global) {
    var ns = app.namespace('EXCHANGE.plans');

    ns.EmptyPlanModel = function EmptyPlanModel() {
        if (!(this instanceof EmptyPlanModel)) {
            return new EmptyPlanModel();
        }
        var self = this;

        self.insurerLogoUrl_Main = '';
        self.insurerLogoUrl_Small = '';
    };

    ns.PlanModel__ = function PlanModel__(params) {
        if (!(this instanceof PlanModel)) {
            return new PlanModel(params);
        }
        var self = this;

        if (typeof params == 'undefined' || typeof params.Plan == 'undefined') {
            self.planGuid = '';
            self.planId = '';
            self.planName = '';
            self.planRank = '';
            self.planType = '';
            self.medigapType = '';
            self.insurerId = '';
            self.insurerName = '';
            self.insurerPhone = '';
            self.insurerUrl = '';
            self.premiumFrequency = '';
            self.premiumValue = '';
            self.premiumValue_lbl = '';
            self.premiumFound = false;
            self.cmsRating = '';
            self.insurerLogoUrl_Main = '';
            self.insurerLogoUrl_Small = '';
            self.medicalIndicator = '';
            self.prescriptionIndicator = '';
            self.PPCID = '';
            self.planDrugs = '';
            self.isInCart = '';
            self.isSaved = '';
            self.isCompared = '';
            self.supplements = [];
            self.attributeTemplates = [];
            self.documents = [];
            self.readyToSell = '';
            self.cannotSell_lbl = '';
            self.urlSafePlanId = '';
            self.urlSafePlanName = '';
            self.TCE = '';
            self.Sig = '';
            self.MedicarePlanId = '';
            self.DRXPlanID = '';
            self.MedicareSegmentId = '';
            self.CartPrecheckId = '';
            self.MedicareContractId = '';
            self.EffectiveDate = '';
        } else {
            self.planGuid = typeof params.Plan.Id != 'undefined' ? params.Plan.Id : '';
            self.planId = typeof params.Plan.PlanId != 'undefined' ? params.Plan.PlanId : '';
            self.MedicarePlanId = typeof params.Plan.MedicarePlanId != 'undefined' ? params.Plan.MedicarePlanId : '';
            self.DRXPlanID = typeof params.Plan.DRXPlanID != 'undefined' ? params.Plan.DRXPlanID : '';
            self.MedicareSegmentId = typeof params.Plan.MedicareSegmentId != 'undefined' ? params.Plan.MedicareSegmentId : '';
            self.CartPrecheckId = typeof params.Plan.CartPrecheckId != 'undefined' ? params.Plan.CartPrecheckId : '';
            self.MedicareContractId = typeof params.Plan.MedicareContractId != 'undefined' ? params.Plan.MedicareContractId : '';
            self.EffectiveDate = typeof params.Plan.EffectiveDate != 'undefined' ? params.Plan.EffectiveDate : '';

            self.planName = typeof params.Plan.Name != 'undefined' ? params.Plan.Name : '';
            self.planRank = typeof params.Plan.Rank != 'undefined' ? params.Plan.Rank : '';
            self.planType = typeof params.Plan.PlanType != 'undefined' ? params.Plan.PlanType : '';
            self.medigapType = typeof params.Plan.MedigapLetter != 'undefined' ? params.Plan.MedigapLetter : '';
            self.insurerId = typeof params.Plan.Insurer != 'undefined' && typeof params.Plan.Insurer.Id != 'undefined' ? params.Plan.Insurer.Id : '';
            self.insurerName = typeof params.Plan.Insurer != 'undefined' && typeof params.Plan.Insurer.Name != 'undefined' ? params.Plan.Insurer.Name : '';
            self.insurerPhone = typeof params.Plan.Insurer != 'undefined' && typeof params.Plan.Insurer.Phone != 'undefined' ? params.Plan.Insurer.Phone : '';
            self.insurerUrl = typeof params.Plan.Insurer != 'undefined' && typeof params.Plan.Insurer.Url != 'undefined' ? params.Plan.Insurer.Url : '';
            self.premiumFrequency = typeof params.Plan.PremiumFrequency != 'undefined' ? params.Plan.PremiumFrequency : '';
            self.premiumValue = typeof params.Plan.PremiumAmount != 'undefined' ? params.Plan.PremiumAmount : '';
            self.premiumValue_lbl = typeof params.PremiumLbl != 'undefined' ? params.PremiumLbl : '';
            self.premiumFound = typeof params.Plan.PremiumFound != 'undefined' ? params.Plan.PremiumFound : false;
            self.cmsRating = typeof params.Plan.CmsRating != 'undefined' ? params.Plan.CmsRating : '';
            self.insurerLogoUrl_Main = typeof params.InsurerLogoUrl_Main != 'undefined' ? params.InsurerLogoUrl_Main : '';
            self.insurerLogoUrl_Small = typeof params.InsurerLogoUrl_Small != 'undefined' ? params.InsurerLogoUrl_Small : '';
            self.medicalIndicator = typeof params.Plan.IsMedical != 'undefined' ? params.Plan.IsMedical : '';
            self.prescriptionIndicator = typeof params.Plan.IsPdp != 'undefined' ? params.Plan.IsPdp : '';
            self.PPCID = typeof params.Plan.PPCID != 'undefined' ? params.Plan.PPCID : '';
            self.planDrugs = typeof params.PlanDrugs != 'undefined' ? params.PlanDrugs : '';
            self.isInCart = false;
            self.isSaved = false;
            self.isCompared = false;
            self.supplements = typeof params.Plan.Supplements != 'undefined' ? params.Plan.Supplements : [];
            self.attributeTemplates = typeof params.Plan.SearchResultsAttributeTemplates != 'undefined' ? params.Plan.SearchResultsAttributeTemplates : [];
            self.documents = typeof params.Plan.Documents != 'undefined' ? params.Plan.Documents : [];
            self.readyToSell = typeof params.Plan.ReadyToSell != 'undefined' ? params.Plan.ReadyToSell : '';
            self.cannotSell_lbl = typeof params.CannotSellLbl != 'undefined' ? params.CannotSellLbl : '';
            self.urlSafePlanId = typeof params.UrlSafePlanId != 'undefined' ? params.UrlSafePlanId : '';
            self.urlSafePlanName = typeof params.UrlSafePlanName != 'undefined' ? params.UrlSafePlanName : '';
            self.TCE = typeof params.TCE != 'undefined' ? params.TCE : '';
            self.Sig = typeof params.Sig != 'undefined' ? params.Sig : '';
        }

        //object of PlanAttributeModel objects
        // We use an object so we can access directly by attributeName.
        self.attributes = {
            length: 0,
            push: function (attr) {
                if (attr) {
                    this[attr.Name] = attr;
                    this.length++;
                }
            },
            toArray: function () {
                var arr = [];
                for (var attr in this) {
                    if (typeof this[attr] !== 'object' || this[attr] === undefined) {
                        continue;
                    }
                    arr.push(this[attr]);
                }

                return arr;
            }
        };

        if (params && params.Plan && params.CannotSellLbl != null) {
            var templatesLength = params.Plan.SearchResultsAttributeTemplates.length;
            // Attribute Templates have a list of attribute sets, which have a list of attributes, which have a list of attribute values.
            // We want to add each of those attributes (with their list of values) to the outer list of attributes.
            for (var i = templatesLength - 1; i >= 0; i--) { // Start at the back, move to the front, overwrite as we go.
                var setLength = params.Plan.SearchResultsAttributeTemplates[i].AttributeGroups ? params.Plan.SearchResultsAttributeTemplates[i].AttributeGroups.length : 0;
                for (var j = setLength - 1; j >= 0; j--) {
                    var attLength = params.Plan.SearchResultsAttributeTemplates[i].AttributeGroups[j].Attributes ? params.Plan.SearchResultsAttributeTemplates[i].AttributeGroups[j].Attributes.length : 0;
                    for (var k = attLength - 1; k >= 0; k--) {
                        self.attributes.push(params.Plan.SearchResultsAttributeTemplates[i].AttributeGroups[j].Attributes[k]);
                    }
                }
            }
        }

        PlanModel.prototype.equals = function equals(other) {
            var protoSelf = this;
            if (other.planGuid !== protoSelf.planGuid) {
                return false;
            }
            if (other.planId !== protoSelf.planId) {
                return false;
            }

            if (other.MedicarePlanId !==protoSelf.MedicarePlanId){
                  return false;
            }
            if (other.DRXPlanID !==protoSelf.DRXPlanID){
                  return false;
            }
            if (other.MedicareSegmentId !==protoSelf.MedicareSegmentId){
                  return false;
            }
              if (other.CartPrecheckId !== protoSelf.CartPrecheckId) {
                  return false;
            }
             if (other.MedicareContractId !==protoSelf.MedicareContractId){
                  return false;
            }
            if (other.EffectiveDate !==protoSelf.EffectiveDate){
                  return false;
            }

            if (other.planName !== protoSelf.planName) {
                return false;
            }
            if (other.planRank !== protoSelf.planRank) {
                return false;
            }
            if (other.planType !== protoSelf.planType) {
                return false;
            }
            if (other.medigapType !== protoSelf.medigapType) {
                return false;
            }
            if (other.insurerId !== protoSelf.insurerId) {
                return false;
            }
            if (other.insurerName !== protoSelf.insurerName) {
                return false;
            }
            if (other.insurerPhone !== protoSelf.insurerPhone) {
                return false;
            }
            if (other.insurerUrl !== protoSelf.insurerUrl) {
                return false;
            }
            if (other.insurerLogoUrl_Main !== protoSelf.insurerLogoUrl_Main) {
                return false;
            }
            if (other.insurerLogoUrl_Small !== protoSelf.insurerLogoUrl_Small) {
                return false;
            }
            if (other.premiumFrequency !== protoSelf.premiumFrequency) {
                return false;
            }
            if (other.premiumValue !== protoSelf.premiumValue) {
                return false;
            }
            if (other.premiumValue_lbl !== protoSelf.premiumValue_lbl) {
                return false;
            }
            if (other.premiumFound !== protoSelf.premiumFound) {
                return false;
            }
            if (other.cmsRating !== protoSelf.cmsRating) {
                return false;
            }
            if (other.medicalIndicator !== protoSelf.medicalIndicator) {
                return false;
            }
            if (other.prescriptionIndicator !== protoSelf.prescriptionIndicator) {
                return false;
            }
            if (other.PPCID !== protoSelf.PPCID) {
                return false;
            }
            if (other.planDrugs !== protoSelf.planDrugs) {
                return false;
            }
            if (other.isInCart !== protoSelf.isInCart) {
                return false;
            }
            if (other.isSaved !== protoSelf.isSaved) {
                return false;
            }
            if (other.isCompared !== protoSelf.isCompared) {
                return false;
            }
            if (other.readyToSell !== protoSelf.readyToSell) {
                return false;
            }
            if (other.cannotSell_lbl !== protoSelf.cannotSell_lbl) {
                return false;
            }
            if (other.urlSafePlanId !== protoSelf.urlSafePlanId) {
                return false;
            }
            if (other.urlSafePlanName !== protoSelf.urlSafePlanName) {
                return false;
            }
            if (other.TCE !== protoSelf.TCE) {
                return false;
            }
            if (other.Sig !== protoSelf.Sig) {
                return false;
            }


            var supArray = protoSelf.supplements;
            var otherSupArray = other.supplements;
            if (supArray.length != otherSupArray.length) {
                return false;
            }

            var attrArray = protoSelf.attributes.toArray();
            var otherArray = other.attributes.toArray();
            if (attrArray.length != otherArray.length) {
                return false;
            }

            return true;
        };

        PlanModel.prototype.clone = function clone() {
            var protoSelf = this;
            var newItem = new PlanModel({
                Plan: {
                    Id: protoSelf.planGuid,
                    PlanId: protoSelf.planId,
                    MedicarePlanId: protoSelf.MedicarePlanId,
                    DRXPlanID: protoSelf.DRXPlanID,
                    MedicareSegmentId: protoSelf.MedicareSegmentId,
                    CartPrecheckId: protoSelf.CartPrecheckId,
                    MedicareContractId: protoSelf.MedicareContractId,
                    EffectiveDate: protoSelf.EffectiveDate,

                    Name: protoSelf.planName,
                    Rank: protoSelf.planRank,
                    PlanType: protoSelf.planType,
                    MedigapLetter: protoSelf.medigapType,
                    Insurer: {
                        Id: protoSelf.insurerId,
                        Name: protoSelf.insurerName,
                        Phone: protoSelf.insurerPhone,
                        Url: protoSelf.insurerUrl
                    },
                    PremiumFrequency: protoSelf.premiumFrequency,
                    PremiumAmount: protoSelf.premiumValue,
                    PremiumFound: protoSelf.premiumFound,
                    CmsRating: protoSelf.cmsRating,
                    IsMedical: protoSelf.medicalIndicator,
                    IsPdp: protoSelf.prescriptionIndicator,
                    PPCID: protoSelf.PPCID,
                    ReadyToSell: protoSelf.readyToSell,

                    Supplements: $.extend(true, [], protoSelf.supplements),
                    AttributeTemplates: $.extend(true, [], protoSelf.attributeTemplates),
                    Documents: $.extend(true, [], protoSelf.documents)

                },
                InsurerLogoUrl_Main: protoSelf.insurerLogoUrl_Main,
                InsurerLogoUrl_Small: protoSelf.insurerLogoUrl_Small,
                PremiumLbl: protoSelf.premiumValue_lbl,
                PlanDrugs: protoSelf.planDrugs,
                CannotSellLbl: protoSelf.cannotSell_lbl,
                UrlSafePlanId: protoSelf.urlSafePlanId,
                UrlSafePlanName: protoSelf.urlSafePlanName,
                TCE: protoSelf.TCE,
                Sig: protoSelf.Sig
            });

            newItem.isInCart = protoSelf.isInCart;
            newItem.isSaved = protoSelf.isSaved;
            newItem.isCompared = protoSelf.isCompared;

            return newItem;
        };

        PlanModel.prototype.addToCompared = function addToCompared() {
            var protoSelf = this;
            if (protoSelf.planType == app.enums.PlanTypeEnum.MEDIGAP) {
                ns.MedigapCompareList.addPlan(protoSelf);
            } else if (protoSelf.planType == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
                ns.PrescriptionDrugCompareList.addPlan(protoSelf);
            } else if (protoSelf.planType == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
                ns.MedicareAdvantageCompareList.addPlan(protoSelf);
            }
            protoSelf.isCompared = true;
        };

        PlanModel.prototype.removeFromCompared = function removeFromCompared() {
            var protoSelf = this;
            if (protoSelf.planType == app.enums.PlanTypeEnum.MEDIGAP) {
                ns.MedigapCompareList.removePlan(protoSelf);
            } else if (protoSelf.planType == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
                ns.PrescriptionDrugCompareList.removePlan(protoSelf);
            } else if (protoSelf.planType == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
                ns.MedicareAdvantageCompareList.removePlan(protoSelf);
            }
            protoSelf.isCompared = false;
        };

        PlanModel.prototype.getComparedPlansCount = function getComparedPlansCount() {
            var protoSelf = this;
            if (protoSelf.planType == app.enums.PlanTypeEnum.MEDIGAP) {
                return ns.MedigapCompareList.getComparedPlansCount();
            } else if (protoSelf.planType == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
                return ns.PrescriptionDrugCompareList.getComparedPlansCount();
            } else if (protoSelf.planType == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
                return ns.MedicareAdvantageCompareList.getComparedPlansCount();
            }
            return 0;
        };

        PlanModel.prototype.addToShoppingCart = function addToShoppingCart(doIntelligentSwap, doOptionalCoverage) {
            var protoSelf = this;
            app.cart.CartAPI.addPlanToCart(protoSelf, doIntelligentSwap, doOptionalCoverage);
        };

        PlanModel.prototype.removeFromShoppingCart = function removeFromShoppingCart() {
            var protoSelf = this;
            protoSelf.isInCart = false;
        };

        PlanModel.prototype.addToSavedPlans = function addToSavedPlans() {
            var protoSelf = this;
            if (app.user.UserSession.IsLoggedIn) {
                app.user.UserSession.SavedPlans.addPlan(protoSelf);
            }
            else {
                $.publish("EXCHANGE.lightbox.login.open");
            }
        };

        PlanModel.prototype.removeFromSavedPlans = function removeFromSavedPlans() {
            var protoSelf = this;
            app.user.UserSession.SavedPlans.removePlan(protoSelf);
            app.plans.AllPlanViewModels[protoSelf.planGuid].isSaved(false);
            app.plans.AllPlanViewModels[protoSelf.planGuid].plan().isSaved = false;
        };

        PlanModel.prototype.loadFromPlanDomainEntity = function loadFromPlanDomainEntity(params) {
            var protoSelf = this;

            self.planGuid = typeof params.Id != 'undefined' ? params.Id : '';
            self.planId = typeof params.PlanId != 'undefined' ? params.PlanId : '';

            self.MedicarePlanId = typeof params.MedicarePlanId != 'undefined' ? params.MedicarePlanId : '';
            self.DRXPlanID = typeof params.DRXPlanID != 'undefined' ? params.DRXPlanID : '';
            self.MedicareSegmentId = typeof params.MedicareSegmentId != 'undefined' ? params.MedicareSegmentId : '';
            self.CartPrecheckId = typeof params.CartPrecheckId != 'undefined' ? params.CartPrecheckId : '';
            self.MedicareContractId = typeof params.MedicareContractId != 'undefined' ? params.MedicareContractId : '';
            self.EffectiveDate = typeof params.EffectiveDate != 'undefined' ? params.EffectiveDate : '';

            self.planName = typeof params.Name != 'undefined' ? params.Name : '';
            self.planRank = typeof params.Rank != 'undefined' ? params.Rank : '';
            self.planType = typeof params.PlanType != 'undefined' ? params.PlanType : '';
            self.medigapType = typeof params.MedigapLetter != 'undefined' ? params.MedigapLetter : '';
            self.insurerId = typeof params.Insurer != 'undefined' && typeof params.Insurer.Id != 'undefined' ? params.Insurer.Id : '';
            self.insurerName = typeof params.Insurer != 'undefined' && typeof params.Insurer.Name != 'undefined' ? params.Insurer.Name : '';
            self.insurerPhone = typeof params.Insurer != 'undefined' && typeof params.Insurer.Phone != 'undefined' ? params.Insurer.Phone : '';
            self.insurerUrl = typeof params.Insurer != 'undefined' && typeof params.Insurer.Url != 'undefined' ? params.Insurer.Url : '';
            self.premiumFrequency = typeof params.PremiumFrequency != 'undefined' ? params.PremiumFrequency : '';
            self.premiumValue = typeof params.PremiumAmount != 'undefined' ? params.PremiumAmount : '';
            self.premiumFound = typeof params.PremiumFound != 'undefined' ? params.PremiumFound : false;
            self.cmsRating = typeof params.CmsRating != 'undefined' ? params.CmsRating : '';
            self.medicalIndicator = typeof params.IsMedical != 'undefined' ? params.IsMedical : '';
            self.prescriptionIndicator = typeof params.IsPdp != 'undefined' ? params.IsPdp : '';
            self.PPCID = typeof params.PPCID != 'undefined' ? params.PPCID : '';
            self.isInCart = false;
            self.isSaved = false;
            self.isCompared = false;

            return protoSelf;
        };


    };

} (EXCHANGE, this));
