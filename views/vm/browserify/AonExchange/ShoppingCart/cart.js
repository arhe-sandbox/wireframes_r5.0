(function (app, global) {
	//"use strict";
	var ns = app.namespace('EXCHANGE.models');

	ns.ShoppingCartViewModel = function ShoppingCartViewModel() {
		if (!(this instanceof ShoppingCartViewModel)) {
			return new ShoppingCartViewModel();
		}
		var self = this;

		self.findPlans_lbl = ko.observable('');
		self.checkout_lbl = ko.observable('');
		self.cartEmpty_lbl = ko.observable('');
		self.cartNotEmpty_lbl = ko.observable('');
		self.cartNotEmptySingular_lbl = ko.observable('');


		self.gotPlanData = ko.observable(false);
		self.useAPIPlanCount = ko.observable(true);
		self.planCountFromAPI = ko.observable(app.user.ShoppingCart.planCountFromAPI());

		self.plansInCart = ko.computed({
			read: function () {
				var count;
				if (EXCHANGE.user.UserSession != null) {
					count = EXCHANGE.user.UserSession.ShoppingCartPlans.plans().length;
				}
				if (count > 0) {
					$('.cartblock').addClass('incart');
				}
				return count;
			},
			owner: this
		});

        self.cartButton_lbl = ko.computed(function () {
            if (!EXCHANGE || !EXCHANGE.cart || !self || (self.plansInCart() === 0)) {
                return self.cartEmpty_lbl();
            }
            else {
                if (self.plansInCart() <= 1) {
                    self.cartNotEmptySingular_lbl(self.cartNotEmptySingular_lbl());
                    return self.cartNotEmptySingular_lbl().format(self.plansInCart());
                }
                else {
                    self.cartNotEmpty_lbl(self.cartNotEmpty_lbl());
                    return self.cartNotEmpty_lbl().format(self.plansInCart());
                }
            }
        });

		ShoppingCartViewModel.prototype.getCartViewModel = function getCartViewModel() {
			var protoSelf = this;
			$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "/API/UserProfile/GetShoppingCartSummaryViewModel",
				dataType: "json",
				success: function (data) {
					var result = data;
					self.findPlans_lbl(result.FindPlansLbl);
					self.checkout_lbl(result.CheckoutLbl);
					self.cartEmpty_lbl(result.CartEmptyLbl);
					self.cartNotEmpty_lbl(result.CartNotEmptyLbl);
					self.cartNotEmptySingular_lbl(result.CartNotEmptySingularLbl);
					protoSelf.planCountFromAPI(result.PlanCount);
				},
	            error: function (data) {

                }
			});
		};

		ShoppingCartViewModel.prototype.modifyCart = function modifyCart(callback) {
			//            var protoSelf = this;
			//            protoSelf.useAPIPlanCount(false);
			//            if (!protoSelf.gotPlanData()) {
			//                app.user.ShoppingCart.getCartDetails(callback);
			//                protoSelf.gotPlanData(true);
			//            } else {
			//                callback();
			//            }

			callback();
		};

	};
})(EXCHANGE, this);

(function (app, global) {
	//"use strict";
	var ns = app.namespace('EXCHANGE.models');

	ns.ShoppingCart = function ShoppingCart() {
		if (!(this instanceof ShoppingCart)) {
			return new ShoppingCart();
		}
		var self = this;

		//self.plans = ko.observableArray([]);
		self.planCountFromAPI = ko.observable(0);
		
		/**
		* Public method for adding a plan to the shopping cart.
		*
		* @namespace EXCHANGE
		* @param  {PlanModel} the plan that we want to add to our cart
		*/
		ShoppingCart.prototype.addPlanToCart = function addPlanToCart(planGuid, checkIntSwap, checkOptCov, ajaxCallback) {
			var protoSelf = this;

			var buttonElem = $('.add-to-cart[data-planid=' + planGuid + ']');
			if(buttonElem.length > 0) {
				EXCHANGE.ButtonSpinner = buttonElem.ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
			}
		    if (EXCHANGE.viewModels.SearchResultsViewModel) {
		        var parameters = JSON.stringify({ PlanId: planGuid, DoIntelligentSwap: checkIntSwap, DoOptionalCoverage: checkOptCov, DoTargetDtUpdate: app.viewModels.SearchResultsViewModel.DoTargetDtUpdate() });
		    } else if (EXCHANGE.viewModels.AncSearchResultsViewModel) {
		        var parameters = JSON.stringify({ PlanId: planGuid, DoIntelligentSwap: checkIntSwap, DoOptionalCoverage: checkOptCov, DoTargetDtUpdate: app.viewModels.AncSearchResultsViewModel.DoTargetDtUpdate() });
		    }
		    $.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "/API/UserProfile/AddToShoppingCart",
				data: parameters,
				dataType: "json",
				success: function (data) {
					var result = data;
					if(result) {
					    if (EXCHANGE.viewModels.SearchResultsViewModel) {
					        app.viewModels.SearchResultsViewModel.DoTargetDtUpdate(false);
					    } else if (EXCHANGE.viewModels.AncSearchResultsViewModel) {
                            app.viewModels.AncSearchResultsViewModel.DoTargetDtUpdate(false);
					    }
					    EXCHANGE.cart.CartAPI.addToCartCallback(result, planGuid);
					}
					if($.isFunction(ajaxCallback)) {
						ajaxCallback(result);
					}
				}
			});
		};
   		ShoppingCart.prototype.addPlanToCart = function addPlanToCart(planGuid, checkIntSwap, checkOptCov, tracker,ajaxCallback) {
			var protoSelf = this;

			var buttonElem = $('.add-to-cart[data-planid=' + planGuid + ']');
                        
           //  Modified to clear the Bug Id: 25484 (SSO > Spinner not on add to cart button from plan detail)
            if(buttonElem.length > 0) {           
            if ($( "#spanAddCart" ).hasClass( "add-to-cart hide-print hide-browse" ))
            {EXCHANGE.ButtonSpinner = $('#spanAddCart').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });}
            else
            {EXCHANGE.ButtonSpinner = buttonElem.ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });}                
            }
            //  bug 25484 end here 

//			if(buttonElem.length > 0) {
//				EXCHANGE.ButtonSpinner = buttonElem.ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
//			}

			var parameters = JSON.stringify({PlanId: planGuid, DoIntelligentSwap: checkIntSwap, DoOptionalCoverage: checkOptCov, DoTargetDtUpdate:app.viewModels.SearchResultsViewModel.DoTargetDtUpdate()});
			$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "/API/UserProfile/AddToShoppingCart",
				data: parameters,
				dataType: "json",
				success: function (data) {
					var result = data;
					if(result) {
						app.viewModels.SearchResultsViewModel.DoTargetDtUpdate(false);
						EXCHANGE.cart.CartAPI.addToCartCallback(result, planGuid);
					}
					if($.isFunction(ajaxCallback)) {
						ajaxCallback(result);
					}
				}
			});
		};

		//ancillary
ShoppingCart.prototype.addAncillaryPlanToCart = function addAncillaryPlanToCart(planGuid, checkIntSwap, checkOptCov, ajaxCallback) {
			var protoSelf = this;
             if (!EXCHANGE.viewModels.IntelligentSwapViewModel) {
            app.intelligentSwap.initializeIntelligentSwap();
        }

			var buttonElem = $('.add-to-cart[data-planid=' + planGuid + ']');
			if(buttonElem.length > 0) {
				EXCHANGE.ButtonSpinner = buttonElem.ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
			}

			var parameters = JSON.stringify({PlanId: planGuid, DoIntelligentSwap: checkIntSwap, DoOptionalCoverage: checkOptCov, DoTargetDtUpdate:app.viewModels.AncSearchResultsViewModel.DoTargetDtUpdate()});
			$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "/API/UserProfile/AddToShoppingCart",
				data: parameters,
				dataType: "json",
				success: function (data) {
					var result = data;
					if(result) {
						app.viewModels.AncSearchResultsViewModel.DoTargetDtUpdate(false);
						EXCHANGE.cart.CartAPI.addAncillaryToCartCallback(result, planGuid);
					}
					if($.isFunction(ajaxCallback)) {
						ajaxCallback(result);
					}
				}
			});
		};
		
		/**
		* Public method for adding a plan to the shopping cart.
		*
		* @namespace EXCHANGE
		* @param  {swapArgs} the intelligent swap args that we want to add to our cart
		*/
		ShoppingCart.prototype.addSwappedPlanToCart = function addSwappedPlanToCart(swapArgs, ajaxCallback) {
			var protoSelf = this;
			var parameters = JSON.stringify({ Swap: swapArgs });
			$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "/API/UserProfile/PerformIntelligentSwap",
				data: parameters,
				dataType: "json",
				success: function(data) {
					var result = data;
					if (result) {
						var removePlan1 = function() {
							app.user.ShoppingCart.removeFromPlanListById(swapArgs.OldPlanId1);
							if (swapArgs.OldPlanId2) {
								app.viewModels.ShoppingCartViewModel.modifyCart(removePlan2);
							} else {
								app.cart.CartAPI.addToCartCallback(result, swapArgs.NewPlanId);
							}
						};
						var removePlan2 = function() {
							app.user.ShoppingCart.removeFromPlanListById(swapArgs.OldPlanId2);
							app.cart.CartAPI.addToCartCallback(result, swapArgs.NewPlanId);
						};
						app.viewModels.ShoppingCartViewModel.modifyCart(removePlan1);
					}
					if ($.isFunction(ajaxCallback)) {
						ajaxCallback(result);
					}
				}
			});
		};

        //ancillary
        ShoppingCart.prototype.addSwappedAncillaryPlanToCart = function addSwappedAncillaryPlanToCart(swapArgs, ajaxCallback) {
			var protoSelf = this;
			var parameters = JSON.stringify({ Swap: swapArgs });
			$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "/API/UserProfile/PerformIntelligentSwap",
				data: parameters,
				dataType: "json",
				success: function(data) {
					var result = data;
					if (result) {
						var removePlan1 = function() {
							app.user.ShoppingCart.removeFromAncillaryPlanListById(swapArgs.OldPlanId1);
							if (swapArgs.OldPlanId2) {
								app.viewModels.ShoppingCartViewModel.modifyCart(removePlan2);
							} else {
								app.cart.CartAPI.addAncillaryToCartCallback(result, swapArgs.NewPlanId);
							}
						};
						var removePlan2 = function() {
							app.user.ShoppingCart.removeFromAncillaryPlanListById(swapArgs.OldPlanId2);
							app.cart.CartAPI.addAncillaryToCartCallback(result, swapArgs.NewPlanId);
						};
						app.viewModels.ShoppingCartViewModel.modifyCart(removePlan1);
					}
					if ($.isFunction(ajaxCallback)) {
						ajaxCallback(result);
					}
				}
			});
		};

		/**
		* Public method for canceling the pending intelligent swap from a login conflict scenario
		*
		* @namespace EXCHANGE
		* @param  {PlanModel} the plan that we want to add to our cart
		*/
		ShoppingCart.prototype.cancelLoginConflictIntelligentSwap = function cancelLoginConflictIntelligentSwap(swapArgs, ajaxCallback) {
			var protoSelf = this;
			var parameters = JSON.stringify({ Swap: swapArgs });

			$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "/API/UserProfile/CancelIntelligentSwapForLoginConflict",
				data: parameters,
				dataType: "json",
				success: function(result) {
					if ($.isFunction(ajaxCallback)) {
						ajaxCallback(result);
					}
				}
			});
		};
		
		/**
		* Public method for adding a supplement to a plan in the shopping cart.
		*
		* @namespace EXCHANGE
		* @param  {PlanModel} the plan that we want to add to our cart
		* @param  {Supplement} the plan that we want to add to our cart
		*/
		ShoppingCart.prototype.setSupplementsInCart = function addSupplementToCart(planGuid, supplementGuids, ajaxCallback) {
			if (!EXCHANGE.ButtonSpinner){
				EXCHANGE.ButtonSpinner = $('#optional-done-button').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
			}
		   

			var protoSelf = this;
			var parameters = JSON.stringify({ PlanId: planGuid, SupplementIds: supplementGuids, DoIntelligentSwap: false, DoOptionalCoverage: false });
			$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "/API/UserProfile/AddToShoppingCart",
				data: parameters,
				dataType: "json",
				success: function(data) {
					var result = data;
					if (result && result.AddedPlan === true) {
						EXCHANGE.cart.CartAPI.addToCartCallback(result, planGuid);
					}
					if (result && result.AddedSupplement === true) {
						app.viewModels.ShoppingCartViewModel.modifyCart(callback);
					}
					if ($.isFunction(ajaxCallback)) {
						ajaxCallback();
					}
					EXCHANGE.ButtonSpinner.Stop();
				},
				error: function(data) {
					EXCHANGE.ButtonSpinner.Stop();
				}
			});
			var callback = function() {
				var planSummary = null;
				for (var i = 0; i < protoSelf.plans().length; i++) {
					if (protoSelf.plans()[i].PlanId == planGuid) {
						planSummary = protoSelf.plans()[i];
						planSummary.SupplementIds = supplementGuids;
						protoSelf.plans().splice(i, 1, planSummary);
						return;
					}
				}
				if (!planSummary) {
					planSummary = {
						PlanId: planGuid,
						SupplementIds: supplementGuids
					};
					protoSelf.plans().push(planSummary);
				}
			};
		};

		ShoppingCart.prototype.removePlanFromJavascriptCartOnly = function removePlanFromJavascriptCartOnly(planId) {
			var protoSelf = this;
			var callback = function() {
				EXCHANGE.user.ShoppingCart.removeFromPlanListById(planId);
			};

			app.viewModels.ShoppingCartViewModel.modifyCart(callback);
		};

		/**
		* Public method for removing a plan from the shopping cart.
		*
		* @namespace EXCHANGE
		* @param  {PlanModel} the plan that we want to remove from our cart
		*/
		ShoppingCart.prototype.removePlanFromCart = function removePlanFromCart(planGuid, ajaxCallback) {
			var protoSelf = this;
			var parameters = JSON.stringify({PlanId: planGuid});

			var buttonElem = $('.add-to-cart[data-planid=' + planGuid + ']');
			if(buttonElem.length > 0) {
				EXCHANGE.ButtonSpinner = buttonElem.ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
			}

			$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "/API/UserProfile/RemoveFromShoppingCart",
				data: parameters,
				dataType: "json",
				success: function (data) {
					var result = data;
					if(result && result === true) {
						var callback = function() {
							EXCHANGE.user.ShoppingCart.removeFromPlanListById(planGuid);
						};
						app.viewModels.ShoppingCartViewModel.modifyCart(callback);
					}
					if($.isFunction(ajaxCallback)) {
						ajaxCallback();
					}
				}
			});
			

		};

        //ancillary
        ShoppingCart.prototype.removeAncillaryPlanFromCart = function removeAncillaryPlanFromCart(planGuid, ajaxCallback) {
			var protoSelf = this;
			var parameters = JSON.stringify({PlanId: planGuid});

			var buttonElem = $('.add-to-cart[data-planid=' + planGuid + ']');
			if(buttonElem.length > 0) {
				EXCHANGE.ButtonSpinner = buttonElem.ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
			}

			$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "/API/UserProfile/RemoveFromShoppingCart",
				data: parameters,
				dataType: "json",
				success: function (data) {
					var result = data;
					if(result && result === true) {
						var callback = function() {
							EXCHANGE.user.ShoppingCart.removeFromAncillaryPlanListById(planGuid);
						};
						app.viewModels.ShoppingCartViewModel.modifyCart(callback);
					}
					if($.isFunction(ajaxCallback)) {
						ajaxCallback();
					}
				}
			});			

		};
		
	    ShoppingCart.prototype.removeFromCartSavedPlan = function removeFromCartSavedPlan(planGuid) {
            if (app.user.UserSession.SavedPlans && app.user.UserSession.SavedPlans.plans()) {
                var savedPlan = app.user.UserSession.SavedPlans.plans().find(function(element) {
                    if (element.planGuid === planGuid) {
                        element.isInCart(false); 
                    }
                });
            }
        };

		ShoppingCart.prototype.removeFromPlanListById = function removeFromPlanListById(planGuid) {
			var protoSelf = this;
			var plans = EXCHANGE.user.UserSession.ShoppingCartPlans.plans();
			var textChanged = false;
			for (var i = 0; i < plans.length; i++) {
				if (plans[i].PlanId == planGuid) {
					plans.splice(i, 1);
					EXCHANGE.user.UserSession.ShoppingCartPlans.plans(plans);
					var planVM;
			        if (EXCHANGE.viewModels.SearchResultsViewModel) {
			            planVM = EXCHANGE.viewModels.SearchResultsViewModel.getPlanByPlanGuid(planGuid);
			        } 
                    if (planVM === undefined && EXCHANGE.viewModels.AncSearchResultsViewModel) {
			            planVM = EXCHANGE.viewModels.AncSearchResultsViewModel.getPlanByPlanGuid(planGuid);
			        }
					if (planVM) {
						planVM.isInCart(false);
					    protoSelf.removeFromCartSavedPlan(planVM.planGuid);
					}
					textChanged = true;
					if (EXCHANGE.ButtonSpinner) EXCHANGE.ButtonSpinner.Stop({ textChanged: textChanged });
					return;
				}
			}
		};

        //ancillary
        ShoppingCart.prototype.removeFromAncillaryPlanListById = function removeFromAncillaryPlanListById(planGuid) {
			var protoSelf = this;
			var plans = EXCHANGE.user.UserSession.ShoppingCartPlans.plans();
			var textChanged = false;
			for (var i = 0; i < plans.length; i++) {
				if (plans[i].PlanId == planGuid) {
					plans.splice(i, 1);
					EXCHANGE.user.UserSession.ShoppingCartPlans.plans(plans);
					 var planVM  = EXCHANGE.viewModels.AncSearchResultsViewModel.getPlanByPlanGuid(planGuid);
					if (planVM) {
						planVM.isInCart(false);
					    protoSelf.removeFromCartSavedPlan(planVM.planGuid);
					}
					textChanged = true;
					if (EXCHANGE.ButtonSpinner) EXCHANGE.ButtonSpinner.Stop({ textChanged: textChanged });
					return;
				}
			}
		};
		
		
		/**
		* Public method for getting our shopping cart from the server
		*
		* @namespace EXCHANGE
		* @param  {function} A callback function that will be executed after the server 
		*       response with our cart
		*/
		ShoppingCart.prototype.getCartDetails = function getCartDetails(callback) {
			var protoSelf = this;
			$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: "/API/UserProfile/GetShoppingCart",
				dataType: "json",
				success: function (data) {
					var result = data;
					EXCHANGE.user.UserSession.ShoppingCartPlans.plans([]);
					for(var i = 0; i < result.length; i++) {

						var planSummary = {
						PlanId: result[i].Plan.Id,
						SupplementIds: []
					};
						EXCHANGE.user.UserSession.ShoppingCartPlans.plans.push(planSummary);
					}
					if($.isFunction(callback)) {
						callback();
					}
				}
			});
		};

		return self;
	};
})(EXCHANGE, this);


(function (app, global) {
	//"use strict";
	var ns = app.namespace('EXCHANGE.models');

	ns.CartAPI = function CartAPI() {
		if (!(this instanceof CartAPI)) {
			return new CartAPI();
		}

		var self = this;
		
		ns.loginConflictPlansToAdd = ko.observableArray([]);
		ns.pendingLoginConflictIntelligentSwap = false;

		//#region CartAPI Functions

		/**
		* Public method for adding a plan to the shopping cart.  When we add plan to cart, there
		*   are 3 possible outcomes
		*       - There is optional coverages available, so show the lightbox to allow them to choose
		*       - There is intelligent swapping being done, so show the lightbox suggesting a swap
		*       - No optional coverage and no intelligent swapping, so just add it to the cart
		*
		* @namespace EXCHANGE
		* @param  {PlanModel} the plan that we want to add to our cart
		*/
		CartAPI.prototype.addPlanToCart = function addPlanToCart(newPlanGuid, checkIntSwap, checkOptCov, ajaxCallback) {
			var protoSelf = this;
			var plansInCart =EXCHANGE.user.UserSession.ShoppingCartPlans.plans();
			var found = false;
			$.each(plansInCart, function(i, plan) {
				if(plan.PlanId == newPlanGuid) {
					found = true;
					return true;
				}
			});
			if(!found) {
				app.user.ShoppingCart.addPlanToCart(newPlanGuid, checkIntSwap, checkOptCov, ajaxCallback);
			}
			else {
				if ($.isFunction(ajaxCallback)) {
					ajaxCallback();
				}
			}
		};
        		CartAPI.prototype.addPlanToCart = function addPlanToCart(newPlanGuid, checkIntSwap, checkOptCov, tracker,ajaxCallback) {
			var protoSelf = this;
			var plansInCart =EXCHANGE.user.UserSession.ShoppingCartPlans.plans();
			var found = false;
			$.each(plansInCart, function(i, plan) {
				if(plan.PlanId == newPlanGuid) {
					found = true;
					return true;
				}
			});
			if(!found) {
				app.user.ShoppingCart.addPlanToCart(newPlanGuid, checkIntSwap, checkOptCov, tracker, ajaxCallback);
			}
			else {
				if ($.isFunction(ajaxCallback)) {
					ajaxCallback();
				}
			}
		};

		//Ancillary
		CartAPI.prototype.addAncillaryPlanToCart = function addAncillaryPlanToCart(newPlanGuid, checkIntSwap, checkOptCov, ajaxCallback) {
			var protoSelf = this;
			var plansInCart =EXCHANGE.user.UserSession.ShoppingCartPlans.plans();
			var found = false;
			$.each(plansInCart, function(i, plan) {
				if(plan.PlanId == newPlanGuid) {
					found = true;
					return true;
				}
			});
			if(!found) {
				app.user.ShoppingCart.addAncillaryPlanToCart(newPlanGuid, checkIntSwap, checkOptCov, ajaxCallback);
			}
			else {
				if ($.isFunction(ajaxCallback)) {
					ajaxCallback();
				}
			}
		};
		
		CartAPI.prototype.addAndRemovePlansForIntelligentSwap = function addAndRemovePlansForIntelligentSwap(swap, ajaxCallback) {
			app.user.ShoppingCart.addSwappedPlanToCart(swap, ajaxCallback);
		};
        //Acnillary
        CartAPI.prototype.addAndRemoveAncillaryPlansForIntelligentSwap = function addAndRemoveAncillaryPlansForIntelligentSwap(swap, ajaxCallback) {
			app.user.ShoppingCart.addSwappedAncillaryPlanToCart(swap, ajaxCallback);
		};
		
		CartAPI.prototype.cancelLoginConflictIntelligentSwap = function cancelLoginConflictIntelligentSwap(swap, ajaxCallback) {
			app.user.ShoppingCart.cancelLoginConflictIntelligentSwap(swap, ajaxCallback);
		};

		//fires off the intellgient swap from login conflict scenario
		CartAPI.prototype.startLoginConflictIntelligentSwap = function startLoginConflictIntelligentSwap(serverSidePlanModels) {
			app.intelligentSwap.cancelLoginConflictSwap = true;
			ns.pendingLoginConflictIntelligentSwap = true;
			
			$.each(serverSidePlanModels, function(i, planModel) {
				ns.loginConflictPlansToAdd.push(planModel.Plan.Id);
			});

			if (ns.loginConflictPlansToAdd().length > 0) {
				app.cart.CartAPI.addPlanToCart(ns.loginConflictPlansToAdd()[0], true, true, function() { });
			}
		};
		
		CartAPI.prototype.nextLoginConflictIntelligentSwap = function nextLoginConflictIntelligentSwap() {
			if (ns.pendingLoginConflictIntelligentSwap) {
				if (ns.loginConflictPlansToAdd().length > 0) {
					ns.loginConflictPlansToAdd.splice(0, 1);
					if (ns.loginConflictPlansToAdd().length > 0) {
						app.cart.CartAPI.addPlanToCart(ns.loginConflictPlansToAdd()[0], true, true);
					}
				} else {
					ns.pendingLoginConflictIntelligentSwap = false;
				}
			}
		};
		
		/**
		* Public method for adding a supplement to a plan that is already in our shopping cart
		*
		* @namespace EXCHANGE
		* @param  {PlanModel} the plan that we want to add to our cart
		*/
		CartAPI.prototype.setSupplementsInCart = function addSupplementToCart(planGuid, newSupplementGuids, ajaxCallback) {
			var protoSelf = this;
			app.user.ShoppingCart.setSupplementsInCart(planGuid, newSupplementGuids, ajaxCallback);
		};

		/**
		* Public method for removing a plan to the shopping cart.
		*
		* @namespace EXCHANGE
		* @param  {PlanModel} the plan that we want to remove from our cart
		*/
		CartAPI.prototype.removePlanFromCart = function removePlanFromCart(plan, ajaxCallback) {
			var protoSelf = this;
			app.user.ShoppingCart.removePlanFromCart(plan, ajaxCallback);
		};


        //ancillary
        CartAPI.prototype.removeAncillaryPlanFromCart = function removeAncillaryPlanFromCart(plan, ajaxCallback) {
			var protoSelf = this;
			app.user.ShoppingCart.removeAncillaryPlanFromCart(plan, ajaxCallback);
		};
		
		/**
		* Public method for removing a plan from the javascript shopping cart. Does not make an ajax clal to server.
		*
		* @namespace EXCHANGE
		* @param  {PlanModel} the plan that we want to remove to our javascript cart
		*/
		CartAPI.prototype.removePlanFromJavascriptCartOnly = function removePlanFromJavascriptCartOnly(planId) {
			var protoSelf = this;
			app.user.ShoppingCart.removePlanFromJavascriptCartOnly(planId);
		};
		
		//#endregion

		//#region Public Lightbox methods

		/**
		* Public method for opening the Optional Coverage Lightbox
		*
		* @namespace EXCHANGE
		* @param  {PlanModel} the plan that we want to add to our cart
		*/
		CartAPI.prototype.openOptionalCoverageLightbox = function openOptionalCoverageLightbox(newPlan) {
			var vm = EXCHANGE.plans.AllPlanViewModels[newPlan.planGuid];
			app.viewModels.OptionalCoverageViewModel.plan(vm);
			$.publish("EXCHANGE.lightbox.optional.open");
		};

		/**
		* Public method for opening the Intelligent Swapping Lightbox
		*
		* @namespace EXCHANGE
		* @param  {PlanModel} the plan that we want to add to our cart
		*/
		CartAPI.prototype.openIntelligentSwappingLightbox = function openIntelligentSwappingLightbox(intelligentSwapServerViewModel) {
			app.viewModels.IntelligentSwapViewModel.loadFromJSON(intelligentSwapServerViewModel.IntelligentSwapPopupViewModel);
			
			//open Intelligent Swapping Lightbox
			$.publish('EXCHANGE.lightbox.intelligentswap.open');
		};        
		

		  CartAPI.prototype.openInvalidPlanComboLightbox = function openInvalidPlanComboLightbox() {
			
			//open Intelligent Swapping Lightbox
			$.publish('EXCHANGE.lightbox.planComboErrMsg.open');
		};        
		
		CartAPI.prototype.openPreEligLightbox = function openPreEligLightbox() {
			$.publish('EXCHANGE.lightbox.PreEligMsg.open');
		};        

		  CartAPI.prototype.openpreEligFailLightbox = function openInvalidPlanComboLightbox() {
			$.publish('EXCHANGE.lightbox.preEligFail.open');
		};        
		
		CartAPI.prototype.addToCartCallback = function addToCartCallback(response, planGuid) {
			var protoSelf = this;
			var textChanged = false;

			if(response.PreEligMsg ){
			  var plan = EXCHANGE.viewModels.SearchResultsViewModel.getPlanByPlanGuid(planGuid);
			  app.viewModels.SearchResultsViewModel.InEligiblePlan(plan);
			  if(response.preEligGoodNews){
				var swap_orig = response.Swap;
				var response_orig = response;
				response_orig.PreEligMsg = false;
				  protoSelf.openPreEligLightbox();
			  }
			  else{
				protoSelf.openpreEligFailLightbox();
			  }
			}
			else if(response.HasInValidPlanscombo){
			protoSelf.openInvalidPlanComboLightbox();
			}

			else if (response.Swap) {
				protoSelf.openIntelligentSwappingLightbox(response.Swap);
			} else if (response.OptionalCov) {
				protoSelf.openOptionalCoverageLightbox(plan);
			} else if (response.AddedPlan) {
			    var planVM;
			    if (EXCHANGE.viewModels.SearchResultsViewModel) {
			        planVM = EXCHANGE.viewModels.SearchResultsViewModel.getPlanByPlanGuid(planGuid);
			    } 
                if (planVM === undefined && EXCHANGE.viewModels.AncSearchResultsViewModel) {
			        planVM = EXCHANGE.viewModels.AncSearchResultsViewModel.getPlanByPlanGuid(planGuid);
			    }
			    if(planVM) {
			    		var tracker = CreateEnrollmentTracker(planVM);
                        var parameters = JSON.stringify({PlanId: planGuid, DoIntelligentSwap: false, DoOptionalCoverage: false, EnrollmentTracker: tracker, DoTargetDtUpdate:app.viewModels.SearchResultsViewModel.DoTargetDtUpdate()});
			            $.ajax({
				        type: "POST",
				        contentType: "application/json; charset=utf-8",
				        url: "/API/UserProfile/TrackEnrollment",
				        data: parameters,
				        dataType: "json",
				        success: function (data) {
					        var result = data;
					        if(result) {
						
						
					        }
					
				        }
			        });
					planVM.isInCart(true);
			        protoSelf.addToCartSavedPlan(planVM.planGuid);
			    }
				var callback = function() {
					var planSummary = {
						PlanId: planGuid,
						SupplementIds: []
					};
					EXCHANGE.user.UserSession.ShoppingCartPlans.plans.push(planSummary);
					
					protoSelf.nextLoginConflictIntelligentSwap();
				};
				app.viewModels.ShoppingCartViewModel.modifyCart(callback);
				textChanged = true;
				if(EXCHANGE.ButtonSpinner) EXCHANGE.ButtonSpinner.Stop( {textChanged: textChanged} );
			}
			else {
			}
		};

        CartAPI.prototype.addToCartSavedPlan = function addToCartFromSavedPlan(planGuid) {
            if (app.user.UserSession.SavedPlans && app.user.UserSession.SavedPlans.plans()) {
                var savedPlan = app.user.UserSession.SavedPlans.plans().find(function(element) {
                    if (element.planGuid === planGuid) {
                        element.isInCart(true);
                    }
                });
            }
        };

		//ancillary
		CartAPI.prototype.addAncillaryToCartCallback = function addAncillaryToCartCallback(response, planGuid) {
			var protoSelf = this;
			var textChanged = false;

			if(response.PreEligMsg ){
			  var plan = EXCHANGE.viewModels.AncSearchResultsViewModel.getPlanByPlanGuid(planGuid);
			  app.viewModels.AncSearchResultsViewModel.InEligiblePlan(plan);
			  if(response.preEligGoodNews){
				var swap_orig = response.Swap;
				var response_orig = response;
				response_orig.PreEligMsg = false;
				  protoSelf.openPreEligLightbox();
			  }
			  else{
				protoSelf.openpreEligFailLightbox();
			  }
			}
			else if(response.HasInValidPlanscombo){
			protoSelf.openInvalidPlanComboLightbox();
			}

			else if (response.Swap) {
				protoSelf.openIntelligentSwappingLightbox(response.Swap);
			} else if (response.OptionalCov) {
				protoSelf.openOptionalCoverageLightbox(plan);
			} else if (response.AddedPlan) {
				
				var planVM  = EXCHANGE.viewModels.AncSearchResultsViewModel.getPlanByPlanGuid(planGuid);

				if(planVM) {
					planVM.isInCart(true);
					protoSelf.addToCartSavedPlan(planVM.planGuid);
				}
				var callback = function() {
					var planSummary = {
						PlanId: planGuid,
						SupplementIds: []
					};
					EXCHANGE.user.UserSession.ShoppingCartPlans.plans.push(planSummary);
					
					protoSelf.nextLoginConflictIntelligentSwap();
				};
				app.viewModels.ShoppingCartViewModel.modifyCart(callback);
				textChanged = true;
				if(EXCHANGE.ButtonSpinner) EXCHANGE.ButtonSpinner.Stop( {textChanged: textChanged} );
			}
			else {
			}
		};

		CartAPI.prototype.getSupplementsInCartByPlan = function getSupplementsInCartByPlan(planId) {
			var plans = EXCHANGE.user.UserSession.ShoppingCartPlans.plans();
			for (var i = 0; i < plans.length; i++) {
				if (plans[i].PlanId == planId) {
					return plans[i].SupplementIds;
				}
			}
			return [];
		};

		$.subscribe("EXCHANGE.lightbox.closeAll", function() {
			if(EXCHANGE.ButtonSpinner) EXCHANGE.ButtonSpinner.Stop({  textChanged: true });
		});

		$.subscribe("EXCHANGE.lightbox.intelligentswap.back", function() {
			if(EXCHANGE.ButtonSpinner) EXCHANGE.ButtonSpinner.Stop();
		});
		
		//#endregion
		
		//#region private methods
		function CreateEnrollmentTracker(plan) {
            var picwellTracker = '';
            var AgentID = "00000000-0000-0000-0000-000000000000";
            var PicwellUserId = "";
            var PlanRank = 0;
            var TopPlanId = "N/A";
            var TopPlan = "N/A";
            var PlanScore = 0;
            var TopScore = 0;
            var filter = "";

            if (EXCHANGE.user.UserSession.IsAgentAccess()) {

                AgentID = EXCHANGE.user.UserSession.Agent().Id();

                if (EXCHANGE.models.RecResultsViewModel != undefined) {
                    var topPlanId;
                    var topPlanScore;

                    switch (plan.RecommendationInfo.PlanType) {
                        case 0:
                            topPlanId = EXCHANGE.viewModels.RecResultsViewModel.maTopPlan;
                            topPlanScore = EXCHANGE.viewModels.RecResultsViewModel.maTopPlan;
                            break;
                        case 1:
                            topPlanId = EXCHANGE.viewModels.RecResultsViewModel.gapTopPlan;
                            topPlanScore = EXCHANGE.viewModels.RecResultsViewModel.gapTopScore;
                            break;
                        case 2:
                            topPlanId = EXCHANGE.viewModels.RecResultsViewModel.pdpTopPlan;
                            topPlanScore = EXCHANGE.viewModels.RecResultsViewModel.pdpTopScore;
                            break;
                        case 3:
                            topPlanId = EXCHANGE.viewModels.RecResultsViewModel.mapdTopPlan;
                            topPlanScore = EXCHANGE.viewModels.RecResultsViewModel.mapdTopScore;
                            break;
                    }

                    PicwellUserId = EXCHANGE.viewModels.RecResultsViewModel.UserPicwellId;
                    PlanRank = plan.RecommendationInfo.PicWellRank;
                    TopPlanId = topPlanId;
                    TopPlan = EXCHANGE.viewModels.RecResultsViewModel.LeastCostPlanId;
                    PlanScore = plan.RecommendationInfo.PWScoreAdj;
                    TopScore = topPlanScore;

                    ////Build string for Filter on selected Tabs
                    switch (app.viewModels.RecResultsViewModel.currentTabIndex()) {
                        case app.enums.TabEnum.MEDICAREADVANTAGE:
                            // Network, Financial Risk, Carrier, Travel, Doctor
                            var NetworkValue = "";
                            var RiskValue = "";
                            var InsurerValue = "";
                            var TravelValue = "";
                            var DoctorValue = "";

                            var validInsurer = EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE];
                            var validDoctors = EXCHANGE.viewModels.SearchState.SelectedDoctorsForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE];
                            var FiltersForMA = EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE];

                            if (FiltersForMA.length > 0) {
                                $.each(FiltersForMA, function (index, data) {
                                    if (data.FilterName == "Network") {
                                        NetworkValue = data.SelectedValue;
                                    }
                                    if (data.FilterName == "FinancialRisk") {
                                        RiskValue = data.SelectedValue;
                                    }
                                    if (data.FilterName == "TravelFilterForMedicare") {
                                        TravelValue = data.SelectedValue;
                                    }
                                });
                            }

                            if (validInsurer.length > 0) {
                                var insurerColl = EXCHANGE.viewModels.RecSelectInsurersViewModel.allInsurersCurrentTab()();
                                if (insurerColl.length > 0) {
                                    for (var i = 0; i < validInsurer.length; i++) {
                                        for (var j = 0; j < insurerColl.length; j++) {
                                            if (validInsurer[i] === insurerColl[j].id()) {
                                                if (InsurerValue == "") {
                                                    InsurerValue = insurerColl[j].name();
                                                }
                                                else {
                                                    InsurerValue = InsurerValue + "|" + insurerColl[j].name();
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            if (validDoctors.length > 0) {
                                var doctorColl = EXCHANGE.viewModels.RecSelectDoctorsViewModel.allDoctorsCurrentTab()();
                                if (doctorColl.length > 0) {
                                    for (var i = 0; i < validDoctors.length; i++) {
                                        for (var j = 0; j < doctorColl.length; j++) {
                                            if (validDoctors[i] === doctorColl[j].id()) {
                                                if (DoctorValue == "") {
                                                    DoctorValue = doctorColl[j].name();
                                                }
                                                else {
                                                    DoctorValue = DoctorValue + "|" + doctorColl[j].name();
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            var filterString = "";
                            if (NetworkValue != "") //"{\\\"Agent\\\":\\\""
                                filterString = "{\\\"FilterType\\\":\\\"Network\\\",\\\"FilterValue\\\":\\\"" + NetworkValue + "\\\"}";
                            if (RiskValue != "") {
                                if (filterString == "") {
                                    filterString = "{\\\"FilterType\\\":\\\"Risk\\\",\\\"FilterValue\\\":\\\"" + RiskValue + "\\\"}";
                                }
                                else {
                                    filterString = filterString + ",{\\\"FilterType\\\":\\\"Risk\\\",\\\"FilterValue\\\":\\\"" + RiskValue + "\\\"}";
                                }
                            }
                            if (InsurerValue != "")
                                if (filterString == "") {
                                    filterString = "{\\\"FilterType\\\":\\\"Insurer\\\",\\\"FilterValue\\\":\\\"" + InsurerValue + "\\\"}";
                                }
                                else {
                                    filterString = filterString + ",{\\\"FilterType\\\":\\\"Insurer\\\",\\\"FilterValue\\\":\\\"" + InsurerValue + "\\\"}";
                                }
                            if (TravelValue != "")
                                if (filterString == "") {
                                    filterString = "{\\\"FilterType\\\":\\\"Travel\\\",\\\"FilterValue\\\":\\\"" + TravelValue + "\\\"}";
                                }
                                else {
                                    filterString = filterString + ",{\\\"FilterType\\\":\\\"Travel\\\",\\\"FilterValue\\\":\\\"" + TravelValue + "\\\"}";
                                }
                            if (DoctorValue != "")
                                if (filterString == "") {
                                    filterString = "{\\\"FilterType\\\":\\\"Doctor\\\",\\\"FilterValue\\\":\\\"" + DoctorValue + "\\\"}";
                                }
                                else {
                                    filterString = filterString + ",{\\\"FilterType\\\":\\\"Doctor\\\",\\\"FilterValue\\\":\\\"" + DoctorValue + "\\\"}";
                                }
                            filter = "[" + filterString + "]}";
                            break;

                        case app.enums.TabEnum.PRESCRIPTIONDRUG:
                            // Carrier
                            var InsurerValue = "";
                            var validInsurer = EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG];

                            if (validInsurer.length > 0) {
                                var insurerColl = EXCHANGE.viewModels.RecSelectInsurersViewModel.allInsurersCurrentTab()();
                                if (insurerColl.length > 0) {
                                    for (var i = 0; i < validInsurer.length; i++) {
                                        for (var j = 0; j < insurerColl.length; j++) {
                                            if (validInsurer[i] === insurerColl[j].id()) {
                                                if (InsurerValue == "") {
                                                    InsurerValue = insurerColl[j].name();
                                                }
                                                else {
                                                    InsurerValue = InsurerValue + "|" + insurerColl[j].name();
                                                }
                                            }
                                        }
                                    }
                                }
                                filter = "[{\\\"FilterType\\\":\\\"Insurer\\\",\\\"FilterValue\\\":\\\"" + InsurerValue + "\\\"}]}";
                            }
                            break;

                        case app.enums.TabEnum.MEDIGAP:
                            //carrier, Financial Risk, Letter, Travel
                            var RiskValue = "";
                            var LetterValue = "";
                            var InsurerValue = "";
                            var TravelValue = "";

                            var validInsurer = EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.MEDIGAP];
                            var FiltersForMediGap = EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.MEDIGAP];

                            if (FiltersForMediGap.length > 0) {
                                $.each(FiltersForMediGap, function (index, data) {
                                    if (data.FilterName == "FinancialRiskForMediGap") {
                                        RiskValue = data.SelectedValue;
                                    }
                                    if (data.FilterName == "PlanLetter") {
                                        LetterValue = data.SelectedValue;
                                    }
                                    if (data.FilterName == "TravelFilterForMediGap") {
                                        TravelValue = data.SelectedValue;
                                    }
                                });
                            }

                            if (validInsurer.length > 0) {
                                var insurerColl = EXCHANGE.viewModels.RecSelectInsurersViewModel.allInsurersCurrentTab()();
                                if (insurerColl.length > 0) {
                                    for (var i = 0; i < validInsurer.length; i++) {
                                        for (var j = 0; j < insurerColl.length; j++) {
                                            if (validInsurer[i] === insurerColl[j].id()) {
                                                if (InsurerValue == "") {
                                                    InsurerValue = insurerColl[j].name();
                                                }
                                                else {
                                                    InsurerValue = InsurerValue + "|" + insurerColl[j].name();
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            var filterString = "";
                            if (LetterValue != "")
                                filterString = "{\\\"FilterType\\\":\\\"MediGapLetter\\\",\\\"FilterValue\\\":\\\"" + LetterValue + "\\\"}";
                            if (InsurerValue != "")
                                if (filterString == "") {
                                    filterString = "{\\\"FilterType\\\":\\\"Insurer\\\",\\\"FilterValue\\\":\\\"" + InsurerValue + "\\\"}";
                                }
                                else {
                                    filterString = filterString + ",{\\\"FilterType\\\":\\\"Insurer\\\",\\\"FilterValue\\\":\\\"" + InsurerValue + "\\\"}";
                                }
                            if (RiskValue != "")
                                if (filterString == "") {
                                    filterString = filterString + "{\\\"FilterType\\\":\\\"Risk\\\",\\\"FilterValue\\\":\\\"" + RiskValue + "\\\"}";
                                }
                                else {
                                    filterString = filterString + ",{\\\"FilterType\\\":\\\"Risk\\\",\\\"FilterValue\\\":\\\"" + RiskValue + "\\\"}";
                                }
                            if (TravelValue != "")
                                if (filterString == "") {
                                    filterString = filterString + "{\\\"FilterType\\\":\\\"Travel\\\",\\\"FilterValue\\\":\\\"" + TravelValue + "\\\"}";
                                }
                                else {
                                    filterString = filterString + ",{\\\"FilterType\\\":\\\"Travel\\\",\\\"FilterValue\\\":\\\"" + TravelValue + "\\\"}";
                                }
                            filter = "[" + filterString + "]}";
                            break;
                    }
                }
            }

            if (filter == "")
                filter = "[]}";

            picwellTracker = "{\\\"Agent\\\":\\\"" + AgentID + "\\\",\\\"PwUser\\\":\\\"" + PicwellUserId + "\\\",\\\"PlanRank\\\":" + PlanRank + ",\\\"TopPlanForGroup\\\":\\\"" + TopPlanId + "\\\",\\\"TopPlan\\\":\\\"" + TopPlan + "\\\",\\\"PlanScore\\\":" + PlanScore + ",\\\"TopScore\\\":" + TopScore + ",\\\"Filters\\\":"  + filter;
            return picwellTracker;
        };

		
		function checkForOptionalSupplements(plan) {
			var foundOptional = false;
			$.each(plan.supplements, function(i, sup) {
				if(sup.Availability == app.enums.SupplementAvailabilityEnum.OPTIONAL) {
					foundOptional = true;
					return true;
				}
			});
			return foundOptional;
		};
		
		//#endregion
		
		return self;
	};
})(EXCHANGE, this);

