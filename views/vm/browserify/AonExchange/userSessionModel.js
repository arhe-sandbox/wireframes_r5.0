(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.classes');

    ns.UserSession = function UserSession() {
        if (!(this instanceof UserSession)) {
            return new UserSession();
        }
        var self = this;

        self.UserProfile = ns.UserProfile();
        self.SearchState = ns.SearchState();
        self.SavedPlans = ns.SavedPlans();
        self.ComparedPlans = ns.ComparedPlans();
        self.UserDrugs = ns.UserDrugs();
        self.IsLoggedIn = ko.observable(false);
        self.loadedPlans = ko.observable(false);
        self.Agent = ko.observable({});
        self.UserPharmacies = ns.UserPharmacies();
        self.ShoppingCartPlans = ns.ShoppingCartPlans();
        self.DoctorFinder=ns.DoctorFinder(); 
        ///<summary>
        // This is the observable for whether we've need to show Invalid NDC drugs Lightbox or not. It defaults to yes. Once we show the LB, we make it to no.
        ///</summary>
        self.ShowInvalidNdcLb = ko.observable();
        self.RemovedUserDrugs = ko.observable([]);
        ///<summary>
        // This is the observable for whether we've need to show Rx Preload Lightbox or not. It defaults to yes. Once we show the LB, we make it to no.
        ///</summary>
        self.ShowRxPreloadLb = ko.observable();

        //You can subscribe to this observable in the standard knockout fashion and it is updated at the end of the .loadFromJSON function of the JS usersession.
        //Currently, the only place this is used is in printplandetails.js, but it can be used in other places.
        self.doneLoading = ko.observable(false);

        self.IsAgentAccess = ko.computed({
            read: function () {
                if (self.Agent() && self.Agent().Id && self.Agent().Id() != "00000000-0000-0000-0000-000000000000") {
                    $('.pre65-menu-items').css('background', '#fab936');
                    return true;
                }
                return false;
            }, owner: this,
            deferEvaluation: true
        });
      

        UserSession.prototype.loadFromJSON = function loadFromJSON(userSession) {
            var protoself = this;

            protoself.UserProfile = protoself.UserProfile.loadFromJSON(userSession.UserProfile);
            protoself.SearchState = protoself.SearchState.loadFromJSON(userSession.SearchState);
            protoself.SavedPlans = protoself.SavedPlans.loadFromJSON(userSession.SavedPlans.Plans);
            protoself.ComparedPlans = protoself.ComparedPlans.loadFromJSON(userSession.ComparedPlans.PlansCompared);
            protoself.UserDrugs = protoself.UserDrugs.loadFromJSON(userSession.UserDrugs);
            protoself.IsLoggedIn(userSession.IsLoggedIn);
            protoself.Agent(ko.mapping.fromJS(userSession.Agent));
            protoself.UserPharmacies = protoself.UserPharmacies.loadFromJSON(userSession.UserProfile.Pharmacies, userSession.UserProfile.SelectedPharmacy);
            protoself.DoctorFinder = protoself.DoctorFinder.loadFromJSON(userSession.PhysicianPlanMapper);
            protoself.ShoppingCartPlans = protoself.ShoppingCartPlans.loadFromJSON(userSession.ShoppingCart.Plans);
            //            if(EXCHANGE.searchResults){
            //            EXCHANGE.searchResults.setPlansInCart();
            //            }
            //            if(!protoself.loadedPlans() && app.plans.AllPlanViewModels && app.plans.AllPlanViewModels.length > 0) {
            //                //app.plans.PlanLoader.setPlansInCart();
            //		        app.plans.ComparedPlans = userSession.ComparedPlans.Plans;
            //		        app.plans.PlanLoader.setComparedPlans();
            //		        app.plans.PlanLoader.setSavedPlans();
            //            }

            if (userSession.Agent == null) {
                app.functions.disableFooterLinks();
            }

            protoself.doneLoading(true);
            protoself.ShowInvalidNdcLb(userSession._HaveRemovedDrugsFromUserProfile);
            protoself.RemovedUserDrugs(userSession.RemovedUserDrugs);
            protoself.ShowRxPreloadLb(userSession._IsRxPreloadAuthPending);
            return protoself;
        };

        UserSession.prototype.loadFromJSONMinimal = function loadFromJSONMinimal(userSession) {
            var protoself = this;

            protoself.UserProfile = protoself.UserProfile.loadFromJSON(userSession.UserProfile);
            protoself.IsLoggedIn(userSession.IsLoggedIn);
            protoself.Agent(ko.mapping.fromJS(userSession.Agent));

            protoself.doneLoading(true);

            return protoself;
        };

        return self;
    };
})(EXCHANGE);

(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.classes');

    ns.UserProfile = function UserProfile() {
        if (!(this instanceof UserProfile)) {
            return new UserProfile();
        }
        var self = this;

        self.kenticoId = '';
        self.dynamicsId = '';
        self.userName = '';
        self.firstName = '';
        self.middleName = '';
        self.lastName = '';
        self.phone = '';
        self.email = '';
        self.address1 = '';
        self.address2 = '';
        self.city = '';
        self.state = '';
        self.country = '';
        self.zipCode = '';
        self.countyId = '';
        self.coverageBeginsDate = '';
        self.dateOfBirth = '';
        self.age = '';
        self.isGenderMale = '';
        self.isTobaccoUser = '';
        self.isDisabled = '';
        self.isKidneyFailure = '';
        self.advisorName = ko.observable('');
        self.advisorPhone = ko.observable('');
        self.advisorExtension = ko.observable('');
        self.advisorTTY = ko.observable('');
        self.advisorChangedInLast90Days = ko.observable('');
        self.primaryAddressZip = '';
        self.clients = ko.observableArray([]);
        self.primaryConnection = ko.observable();
        self.isPre65 = ko.observable(false);
        self.IsEappInValidationMode=ko.observable(false);
        self.isAgeIn = ko.observable(false);
        self.isActivatePre65=ko.observable();
        self.isActivateAnciliary=ko.observable();
        self.partnerCode=ko.observable();
        

        self.family = ko.observableArray([]);

//        var loggedInUser = "Myself";

//                if (EXCHANGE.user !== null && EXCHANGE.user.UserSession !== null && EXCHANGE.user.UserSession.UserProfile !== undefined) {
//                    if (EXCHANGE.user.UserSession.UserProfile.firstName !== "" || EXCHANGE.user.UserSession.UserProfile.lastName !== "") {
//                        loggedInUser = EXCHANGE.user.UserSession.UserProfile.firstName + " " + EXCHANGE.user.UserSession.UserProfile.lastName;
//                    }
//                    if(self.family().length ==0 )
//                        self.family.push(loggedInUser);                   
//                } 

        
        ///<summary>
        // This is the observable for whether we've done medquestions or not. It defaults to no.
        ///</summary>
        self.doneMedQuestions = ko.observable(false);

        UserProfile.prototype.loadFromJSON = function loadFromJSON(userProfile) {
            var protoself = this;

            protoself.kenticoId = userProfile.KenticoId ? userProfile.KenticoId : '';
            protoself.dynamicsId = userProfile.DynamicsId ? userProfile.DynamicsId : '';
            protoself.userName = userProfile.UserName ? userProfile.UserName : '';
            protoself.firstName = userProfile.FirstName ? userProfile.FirstName : '';
            protoself.middleName = userProfile.MiddleName ? userProfile.MiddleName : '';
            protoself.lastName = userProfile.LastName ? userProfile.LastName : '';
            protoself.phone = userProfile.Phone ? userProfile.Phone : '';
            protoself.email = userProfile.Email ? userProfile.Email : '';
            protoself.address1 = userProfile.Address1 ? userProfile.Address1 : '';
            protoself.address2 = userProfile.Address2 ? userProfile.Address2 : '';
            protoself.city = userProfile.City ? userProfile.City : '';
            protoself.state = userProfile.PrimaryAddressState ? userProfile.PrimaryAddressState : '';
            protoself.country = userProfile.Country ? userProfile.Country : '';
            protoself.zipCode = userProfile.ZipCode ? userProfile.ZipCode : '';
            protoself.countyId = userProfile.CountyId ? userProfile.CountyId : '';
            protoself.coverageBeginsDate = userProfile.CoverageBeginsDate ? userProfile.CoverageBeginsDate : '';
            protoself.dateOfBirth = userProfile.DateOfBirth ? userProfile.DateOfBirth : '';
            protoself.age = userProfile.Age ? userProfile.Age : '';
            protoself.isGenderMale = userProfile.IsGenderMale ? userProfile.IsGenderMale : '';
            protoself.isTobaccoUser = userProfile.IsTobaccoUser ? userProfile.IsTobaccoUser : '';
            protoself.isDisabled = userProfile.IsDisabled ? userProfile.IsDisabled : '';
            protoself.IsEappInValidationMode=userProfile.IsEappInValidationMode ? userProfile.IsEappInValidationMode : false;
            protoself.isKidneyFailure = userProfile.IsKidneyFailure ? userProfile.IsKidneyFailure : '';
            protoself.advisorName(userProfile.Advisor && userProfile.Advisor.FullName ? userProfile.Advisor.FullName : '');
            protoself.advisorPhone(userProfile.Advisor && userProfile.Advisor.Phone ? userProfile.Advisor.Phone : '');
            protoself.advisorExtension(userProfile.Advisor && userProfile.Advisor.Extension ? userProfile.Advisor.Extension : '');
            protoself.advisorTTY(userProfile.Advisor && userProfile.Advisor.TTY ? userProfile.Advisor.TTY : '');
            protoself.advisorChangedInLast90Days(userProfile.Advisor && userProfile.Advisor.ChangedInLast90Days ? userProfile.Advisor.ChangedInLast90Days : '');
            protoself.primaryAddressZip = userProfile.PrimaryAddressZip ? userProfile.PrimaryAddressZip : '';
            protoself.doneMedQuestions(userProfile.MedicalQuestionnaire.DoneMedQuestions);

            protoself.clients(userProfile.Connections);
            protoself.primaryConnection(userProfile.PrimaryConnection);
            if (userProfile.IsPre65 != null) {
                protoself.isPre65(userProfile.IsPre65);
            }

            if (userProfile.IsAgeIn != null) {
                protoself.isAgeIn(userProfile.IsAgeIn);
            }
            protoself.isActivatePre65 = userProfile.IsAllowedNM;
            protoself.isActivateAnciliary = userProfile.IsAnciliary;

            protoself.family(userProfile.Family);            
            protoself.partnerCode = userProfile.PartnerCode;
            return protoself;
        };

        return self;
    };

})(EXCHANGE);


(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.classes');

    ns.SearchState = function SearchState() {
        if (!(this instanceof SearchState)) {
            return new SearchState();
        }
        var self = this;

        self.MedigapNetwork = [];
        self.PrescriptionDrugNetwork = [];
        self.MedicareAdvantageNetwork = [];

        self.MedigapInsurer = [];
        self.PrescriptionDrugInsurer = [];
        self.MedicareAdvantageInsurer = [];

        self.MedigapSortBy = '';
        self.PrescriptionDrugSortBy = '';
        self.MedicareAdvantageSortBy = '';

        SearchState.prototype.loadFromJSON = function loadFromJSON(params) {
            var protoSelf = this;

            protoSelf.MedigapNetwork = params.MedigapNetwork || '';
            protoSelf.PrescriptionDrugNetwork = params.PrescriptionDrugNetwork || '';
            protoSelf.MedicareAdvantageNetwork = params.MedicareAdvantageNetwork || '';

            protoSelf.MedigapInsurer = params.MedigapInsurer ? params.MedigapInsurer : [];
            protoSelf.PrescriptionDrugInsurer = params.PrescriptionDrugInsurer ? params.PrescriptionDrugInsurer : [];
            protoSelf.MedicareAdvantageInsurer = params.MedicareAdvantageInsurer ? params.MedicareAdvantageInsurer : [];

            protoSelf.MedigapSortBy = params.MedigapSortBy || '';
            protoSelf.PrescriptionDrugSortBy = params.PrescriptionDrugSortBy || '';
            protoSelf.MedicareAdvantageSortBy = params.MedicareAdvantageSortBy || '';

            return protoSelf;
        };

        SearchState.prototype.toJS = function toJS() {
            var protoSelf = this;

            return {
                MedigapCompare: protoSelf.MedigapCompare,
                PrescriptionDrugCompare: protoSelf.PrescriptionDrugCompare,
                MedicareAdvantageCompare: protoSelf.MedicareAdvantageCompare,

                MedigapNetwork: protoSelf.MedigapNetwork,
                PrescriptionDrugNetwork: protoSelf.PrescriptionDrugNetwork,
                MedicareAdvantageNetwork: protoSelf.MedicareAdvantageNetwork,

                MedigapInsurer: protoSelf.MedigapInsurer,
                PrescriptionDrugInsurer: protoSelf.PrescriptionDrugInsurer,
                MedicareAdvantageInsurer: protoSelf.MedicareAdvantageInsurer,

                MedigapSortBy: protoSelf.MedigapSortBy ? protoSelf.MedigapSortBy.toJS() : null,
                PrescriptionDrugSortBy: protoSelf.PrescriptionDrugSortBy ? protoSelf.PrescriptionDrugSortBy.toJS() : null,
                MedicareAdvantageSortBy: protoSelf.MedicareAdvantageSortBy ? protoSelf.MedicareAdvantageSortBy.toJS() : null
            };
        };

        return self;
    };
})(EXCHANGE);

(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.classes');

    ns.ComparedPlans = function ComparedPlans() {
        if (!(this instanceof ComparedPlans)) {
            return new ComparedPlans();
        }
        var self = this;

        self.plans = ko.observableArray([]);

        ComparedPlans.prototype.loadFromJSON = function loadFromJSON(params) {

            var protoself = this;
            if (!params) return protoself;
            protoself.plans([]);
            for (var i = 0; i < params.length; i++) {
               var planIds = {
                    PlanId: params[i].PlanId
                };
                protoself.plans.push(planIds);
                var plan = params[i];
                var compPlan = { planGuid :plan.PlanId, planType:plan.PlanType};
                if (plan.PlanType == app.enums.PlanTypeEnum.MEDIGAP) {
                        EXCHANGE.plans.MedigapCompareList.addPlan(compPlan);
                } else if (plan.PlanType == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
                        EXCHANGE.plans.PrescriptionDrugCompareList.addPlan(compPlan);
                } else if (plan.PlanType == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
                      EXCHANGE.plans.MedicareAdvantageCompareList.addPlan(compPlan);
                } else if (plan.PlanType == app.enums.PlanTypeEnum.VISION) {
                      EXCHANGE.plans.VisionCompareList.addPlan(compPlan);
                } else if (plan.PlanType == app.enums.PlanTypeEnum.DENTAL) {
                      EXCHANGE.plans.DentalCompareList.addPlan(compPlan);
                }

                  var planVM;
                  if(EXCHANGE.viewModels.SearchResultsViewModel){
                      planVM = EXCHANGE.viewModels.SearchResultsViewModel.getPlanByPlanGuid(plan.PlanId);
                      if (planVM) {
                          planVM.isCompared(true);
                      }
                  }
                  if(EXCHANGE.viewModels.AncSearchResultsViewModel){
                      planVM = EXCHANGE.viewModels.AncSearchResultsViewModel.getPlanByPlanGuid(plan.PlanId);
                      if (planVM) {
                          planVM.isCompared(true);
                      }
                  }
            }
            return protoself;
        };
        return self;
    };
})(EXCHANGE);


(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.classes');

    ns.ShoppingCartPlans = function ShoppingCartPlans() {
        if (!(this instanceof ShoppingCartPlans)) {
            return new ShoppingCartPlans();
        }
        var self = this;

        self.plans = ko.observableArray([]);

        ShoppingCartPlans.prototype.loadFromJSON = function loadFromJSON(cartPlans) {
            var protoself = this;
            if (!cartPlans) return protoself;
            protoself.plans([]);
            for (var i = 0; i < cartPlans.length; i++) {

                var planSummary = {
                    PlanId: cartPlans[i].Plan.Id,
                    PlanType:cartPlans[i].Plan.PlanType,
                    SupplementIds: []
                };
                protoself.plans.push(planSummary);
            }


            return protoself;
        };
        return self;
    };
})(EXCHANGE);

(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.classes');

    ns.UserDrugs = function UserDrugs() {
        if (!(this instanceof UserDrugs)) {
            return new UserDrugs();
        }
        var self = this;

        self.drugs = ko.observableArray([]);



        self.sortDrugs = function sortDrugs() {
            self.drugs().sort(function (firstUserDrug, secondUserDrug) {
                return firstUserDrug.Drug.Name.toLowerCase() > secondUserDrug.Drug.Name.toLowerCase() ? 1 : -1;
            });

            self.drugs.valueHasMutated()
        };

        UserDrugs.prototype.loadFromJSON = function loadFromJSON(userDrugs) {
            var protoself = this;
            if (!userDrugs) return protoself;
            var drugs = [];
            for (var i = 0; i < userDrugs.length; i++) {
                drugs.push(userDrugs[i]);
            }
            protoself.drugs(drugs);
            protoself.sortDrugs();

            return protoself;
        };
        return self;
    };
})(EXCHANGE);


(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.classes');

    ns.UserPharmacies = function UserPharmacies() {
        if (!(this instanceof UserPharmacies)) {
            return new UserPharmacies();
        }
        var self = this;

        self.pharmacies = ko.observableArray([]);
        self.selectedPharmacy = ko.observable();
        self.mailOrderPharmacy = ko.observable();

        UserPharmacies.prototype.loadFromJSON = function loadFromJSON(userProfilePharmacies, userProfileSelectedPharmacy) {
            var protoself = this;
            if (!userProfilePharmacies) return protoself;
            var pharmacies = [];
            for (var i = 0; i < userProfilePharmacies.length; i++) {
                pharmacies.push(userProfilePharmacies[i]);
            }

            protoself.pharmacies(pharmacies);
            protoself.selectedPharmacy(userProfileSelectedPharmacy);

            return protoself;
        };
        return self;
    };
})(EXCHANGE);

(function (app) {
    //"use strict";
	var ns = app.namespace('EXCHANGE.classes');

	ns.DoctorFinder = function DoctorFinder() {
		if (!(this instanceof DoctorFinder)) {
			return new DoctorFinder();
		}
	    var self = this;
	    self.customerPhysicians = ko.observableArray([]);
        self.planProviderLabels = ko.observableArray([]);
        self.physiciansAdded=ko.observable(false);
	    self.changeProviderLabels = function changeProviderLabels(planList) {            
            if (!planList) return;
            for (var i = 0; i < planList.length; i++) {
                if (planList[i] && planList[i].doctorFinder_lbl && planList[i].doctorFinderNoLink_lbl) {
                        planList[i].doctorFinder_lbl('Physician');
                        planList[i].doctorFinderNoLink_lbl('Lookup');                
                }
            }            
            for (var i = 0; i < planList.length; i++) {
                if (planList[i] && planList[i].PPCID == null) {
                    if(planList[i].doctorFinder_lbl && planList[i].doctorFinderNoLink_lbl){
                        planList[i].doctorFinder_lbl('Physician Network Status Unavailable');
                        planList[i].doctorFinderNoLink_lbl('');
                    }
                }
                if (planList[i] && planList[i].PPCID && planList[i].PPCID != "" && self.planProviderLabels && self.planProviderLabels().length>0) {
                    var planTileLabelObj = getPlanTilePhysLabel(self.planProviderLabels(), planList[i].PPCID);
                    if(planTileLabelObj){
                        planList[i].doctorFinder_lbl(planTileLabelObj.PlanTileLabel);
                        if (EXCHANGE.models.RecResultsViewModel != undefined) {

                            var hoverText= planTileLabelObj.HoverText;
                            var finalHoverTextAfterSort="";
                            if(hoverText.lastIndexOf("In#")!=-1)
                            {                       
                                var outlist=hoverText.substring((hoverText.lastIndexOf("In#")+3),hoverText.length).split("#");
                                for(var m=0;m<outlist.length;m++)
                                {
                                    if(outlist[m].trim()!="")
                                    {
                                        finalHoverTextAfterSort+= "<li><strong>"+outlist[m] + "</strong></li>";
                                    }
                                }
                            }
                            if(hoverText.lastIndexOf("In#")==-1 && hoverText.lastIndexOf("Out#") !=-1)
                            {                       
                                var outlist=hoverText.split("#");
                                for(var m=0;m<outlist.length;m++)
                                {
                                    if(outlist[m].trim()!="")
                                    {
                                        finalHoverTextAfterSort+= "<li><strong>"+outlist[m] + "</strong></li>";
                                    }
                                }
                            }
                            if(finalHoverTextAfterSort=="" && planTileLabelObj.HoverText.indexOf("Out")!=-1)
                            {
                                finalHoverTextAfterSort= planTileLabelObj.HoverText;
                            }
                        
                            if(finalHoverTextAfterSort.trim()!="" && finalHoverTextAfterSort.length>0)
                            {
                                finalHoverTextAfterSort="<ul class='no-coverage-doctors'>"+finalHoverTextAfterSort+"</ul>"
                            }

                            if(hoverText.lastIndexOf("In#")!=-1)
                            {
                                var inlist=hoverText.substring(0,(hoverText.lastIndexOf("In#")+3)).split("#");
                                 for(var k=0;k<inlist.length;k++)
                                {
                                    
                                    if(inlist[k].trim()!="")
                                    {
                                        if(k==0)
                                        {
                                            finalHoverTextAfterSort+="<ul>";
                                        }
                                        
                                        finalHoverTextAfterSort+=  "<li>"+ inlist[k] + "</li>";

                                            if(k==inlist.length)
                                        {
                                            finalHoverTextAfterSort+="</ul>";
                                        }
                                    }
                                    
                                }
                            }
                       
                           //finalHoverTextAfterSort=finalHoverTextAfterSort.replace(/#/gi, "<br/>").trim('<br/>');
//                           if(finalHoverTextAfterSort.substring(0,4)=="<br/>" )
//                           {
//                            finalHoverTextAfterSort=finalHoverTextAfterSort.substring(5,finalHoverTextAfterSort.length);
//                           }
//                           if(finalHoverTextAfterSort.indexOf("<div class='no-coverage-doctors'><br/>")!=-1)
//                           {
//                                finalHoverTextAfterSort=finalHoverTextAfterSort.replace("<div class='no-coverage-doctors'><br/>","<div class='no-coverage-doctors'>");
//                           }

                            //planList[i].doctorFinderHover_lbl(planTileLabelObj.HoverText.replace(/#/gi, "\n"));
                            planList[i].doctorFinderHover_lbl(finalHoverTextAfterSort);
                        }
                        else
                        {
                            planList[i].doctorFinderHover_lbl(planTileLabelObj.HoverText.replace(/#/gi, "\n"));
                        }
                        planList[i].doctorFinderNoLink_lbl('');
                    }
                }
	        }
        };
        function getPlanTilePhysLabel(obj, ppcidLocal) {
            var newObj;
            $.each(obj, function (index) {
                if (obj[index].PPCID == ppcidLocal) {
                    newObj = obj[index];
                    return false;
                }
            });
            return newObj;
        }

		DoctorFinder.prototype.loadFromJSON = function loadFromJSON(physPlanMapp) {
			var protoself = this;
            if(!physPlanMapp || !physPlanMapp.PlanProviderLabel) return protoself;
		    var planProviderLabels = [];
            for(var i = 0; i < physPlanMapp.PlanProviderLabel.length; i++) {
                planProviderLabels.push(physPlanMapp.PlanProviderLabel[i]);
            }
		    protoself.planProviderLabels(planProviderLabels);
            if(!physPlanMapp || !physPlanMapp.CustomerPhysicians) return protoself;
            var customerPhysicians = [];            
            for(var j = 0; j < physPlanMapp.CustomerPhysicians.length; j++) {
                customerPhysicians.push(physPlanMapp.CustomerPhysicians[j]);
            }
            protoself.customerPhysicians(customerPhysicians);
            if(physPlanMapp.CustomerPhysicians.length>0)
                protoself.physiciansAdded(true);
			return protoself;
		};
		return self;
	};
})(EXCHANGE);
