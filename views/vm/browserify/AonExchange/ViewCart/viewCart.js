(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.viewCart');

    EXCHANGE.namespace('EXCHANGE.viewModels');

    var viewCartLb = null;
    var checkoutPreventedLb = null;
    var requiresCarrierPortalLb = null;

    ns.submittingPage = false;

    ns.initializeViewCart = function initializeviewCart() {

        app.viewModels.ViewCartViewModel = EXCHANGE.models.ViewCartViewModel();
        app.viewModels.IneligibleCheckoutViewModel = EXCHANGE.models.IneligibleCheckoutViewModel();
        app.viewModels.RequiresCarrierPortalViewModel = EXCHANGE.models.RequiresCarrierPortalViewModel();
        viewCartLb = new EXCHANGE.lightbox.Lightbox({
            name: 'viewcart',
            divSelector: '#viewcart',
            openButtonSelector: '#viewcart-open-button',
            closeButtonSelector: '#viewcart-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#viewcart').get(0));
                return true;
            },
            afterOpen: ns.viewCartPopupLoad,
            beforeSubmit: ns.checkoutNavigate,
            afterClose: function () {
                $('#zipErrorBlock').hide();
            },
            showWaitPopup: true
        });

        checkoutPreventedLb = new app.lightbox.Lightbox({
            name: 'checkoutprevented',
            divSelector: '#checkout-prevented-popup',
            openButtonSelector: '#checkout-prevented-popup-open-button',
            closeButtonSelector: '#checkout-prevented-popup-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#checkout-prevented-popup').get(0));
                return true;
            }
            // afterOpen: ns.checkoutPreventedPopupLoad
        });

        requiresCarrierPortalLb = new app.lightbox.Lightbox({
            name: 'requirescarrierportal',
            divSelector: '#requires-carrier-portal-popup',
            openButtonSelector: '#requires-carrier-portal-popup-open-button',
            closeButtonSelector: '#requires-carrier-portal-popup-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#requires-carrier-portal-popup').get(0));
                return true;
            }
        });

        ns.setupJqueryEvents();
    };

    ns.showtip = function showtip() {
        if ($(this).hasClass("rating")) {
            $(this).addClass('ratinghover');
        } else if ($(this).hasClass("covericon")) {
            $(this).addClass('covericonhover');
        } else if ($(this).hasClass("add-to-cart") || $(this).hasClass("addtocompare")) {
            $(this).addClass('show-tip');
        } else if ($(this).hasClass("moreoption-wrap")) {
            $(this).addClass('show-menu');
        } else if ($(this).hasClass("cartcovericon")) {
            $(this).addClass('covericonhover');
        } else {
            $(this).addClass('logosinfo');
        }
    };

    ns.hidetip = function hidetip() {
        if ($(this).hasClass("rating")) {
            $(this).removeClass('ratinghover');
        } else if ($(this).hasClass("covericon")) {
            $(this).removeClass('covericonhover');
        } else if ($(this).hasClass("add-to-cart") || $(this).hasClass("addtocompare")) {
            $(this).removeClass('show-tip');
        } else if ($(this).hasClass("moreoption-wrap")) {
            $(this).removeClass('show-menu');
        } else if ($(this).hasClass("cartcovericon")) {
            $(this).removeClass('covericonhover');
        } else {
            $(this).removeClass('logosinfo');
        }
    };

    ns.showtip2 = function showtip2() {
        $(this).parent().addClass("show-tip");
    };

    ns.hidetip2 = function hidetip2() {
        $(this).parent().removeClass("show-tip");
    };

    var config = {
        sensitivity: 4,
        interval: 250,
        over: ns.showtip,
        out: ns.hidetip
    };

    var config2 = {
        sensitivity: 4,
        interval: 250,
        over: ns.showtip2,
        out: ns.hidetip2
    };

    ns.setupSmartHover = function setupSmartHover() {
        $("td.planinfo span.cartcovericon").smartHover(config);
    };

    ns.setupJqueryEvents = function setupJqueryEvents() {
        $(document).on('click', '.remove-from-cart', function () {
            var planGuid = $(this).attr('data-planid');
            ns.removePlanFromCart(planGuid);
        });

        $(document).on("click", "#divNothankUDentalMain", function () {
            ns.fnOpenpopupDental();
        });

        $(document).on("click", "#btnDentalSubmit", function () {
            ns.fnDentalSubmit();
        });

        $(document).on("click", "#divNothankUVisionMain", function () {
            ns.fnOpenpopupVision();
        });

        $(document).on("click", "#btnVisionSubmit", function () {
            ns.fnVisionSubmit();
        });
    };

    ns.isAncillaryInelligible = function isAncillaryInelligible(AncillaryInelligible) {
        var userProfile = app.user.UserSession.UserProfile;
        var ProductType = " ";
        dateSplit = userProfile.dateOfBirth.split("T")[0].split("-");
        edateSplit = EXCHANGE.viewModels.ViewCartViewModel.planVms()[0].effectiveDate.split("T")[0].split("-");
        var effectiveDate = new Date(edateSplit[0], edateSplit[1] - 1, edateSplit[2]);
        var birthDate = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2]);
        var age = effectiveDate.getFullYear() - birthDate.getFullYear();
        var m = effectiveDate.getMonth() - birthDate.getMonth();

        age = (age * 12) + m;
        var PlanType1 = " ";
        var PlanType2 = " ";


        for (j = 0; j < EXCHANGE.viewModels.ViewCartViewModel.planVms().length; j++) {
            var MinAge = EXCHANGE.viewModels.ViewCartViewModel.planVms()[j].primaryMinAge();
            if (MinAge > 0) {
                //if Age rule is MOnth end
                if (EXCHANGE.viewModels.ViewCartViewModel.planVms()[j].primaryAgeRule() == 0) {
                    if (MinAge * 12 > age) {
                        if (EXCHANGE.viewModels.ViewCartViewModel.planVms()[j].planType == EXCHANGE.enums.PlanTypeEnum.DENTAL) {
                            PlanType1 = 'Dental';
                            AncillaryInelligible = true;
                        }
                        else if (EXCHANGE.viewModels.ViewCartViewModel.planVms()[j].planType == EXCHANGE.enums.PlanTypeEnum.VISION) {
                            PlanType2 = 'Vision';
                            AncillaryInelligible = true;
                        }
                    }
                }
                //if Age rule is Year end
                else if (EXCHANGE.viewModels.ViewCartViewModel.planVms()[j].primaryAgeRule() == 1) {
                    if (MinAge > effectiveDate.getFullYear() - birthDate.getFullYear()) {

                        if (EXCHANGE.viewModels.ViewCartViewModel.planVms()[j].planType == EXCHANGE.enums.PlanTypeEnum.DENTAL) {
                            PlanType1 = 'Dental';
                            AncillaryInelligible = true;
                        }
                        else if (EXCHANGE.viewModels.ViewCartViewModel.planVms()[j].planType == EXCHANGE.enums.PlanTypeEnum.VISION) {
                            PlanType2 = 'Vision';
                            AncillaryInelligible = true;
                        }
                    }
                }
            }
        }

        if (PlanType1 != " ") { ProductType += PlanType1; }
        if (PlanType2 != " ") { ProductType += PlanType2; }

        if (EXCHANGE.viewModels.ViewCartViewModel.planVms().length > 1) {
            app.viewModels.IneligibleCheckoutViewModel.errorMessages()[0] = 'Aon Retiree Health Exchange only offers the <Product> plan you chose, to people who meet the minimum age requirements of the carriers.  To continue checkout of other plans, remove the<Product> plan from your cart.'.replace(/<Product>/g, ProductType);
        }
        else {
            app.viewModels.IneligibleCheckoutViewModel.errorMessages()[0] = "Aon Retiree Health Exchange only offers plans of this type for people who meet the minimum age requirements of the carriers.  You may continue to search for plans but will not be able to enroll.";
        }

        return AncillaryInelligible;


    };

    ns.checkoutNavigate = function checkoutNavigate() {
        $('#zipErrorBlock').hide();
        var userSession = app.user.UserSession;
        var userProfile = userSession.UserProfile;
        //bug 105100 checkout issue for ancillary
        var NonAncillaryPlanExists = false;
        var AncillaryInelligible = false;

        for (i = 0; i < EXCHANGE.viewModels.ViewCartViewModel.planVms().length; i++) {
            if (EXCHANGE.viewModels.ViewCartViewModel.planVms()[i].planType != EXCHANGE.enums.PlanTypeEnum.DENTAL && EXCHANGE.viewModels.ViewCartViewModel.planVms()[i].planType != EXCHANGE.enums.PlanTypeEnum.VISION)
                NonAncillaryPlanExists = true;
        }
        //Product Backlog Item 119396: Ancillary Improvement when Primary customer is Underage
        if (NonAncillaryPlanExists == false) {
            AncillaryInelligible = ns.isAncillaryInelligible(AncillaryInelligible);

        }

        if (AncillaryInelligible == true) { $.publish("EXCHANGE.lightbox.checkoutprevented.open"); }
        else if (app.viewModels.IneligibleCheckoutViewModel.isIneligibleForCheckout() && NonAncillaryPlanExists == true) {
            $.publish("EXCHANGE.lightbox.checkoutprevented.open");
        } else if (app.viewModels.RequiresCarrierPortalViewModel.isRequired()) {
            $.publish("EXCHANGE.lightbox.requirescarrierportal.open");
        } else {
            if (userSession.IsLoggedIn()) {
                if (userProfile.primaryAddressZip == userProfile.zipCode ||
                    userProfile.primaryAddressZip == '') {
                    if (!ns.submittingPage) {
                        ns.submittingPage = true;
                        EXCHANGE.ButtonSpinner = $('#btnCheckout').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });

                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: "/API/Application/BeginApplication",
                            dataType: "json",
                            success: function (data) {
                                //button spinner intentionally not stopped, leave it spinning while page redirects
                                ns.redirectToOverviewPage();
                            }
                        });
                    }
                } else {
                    $('#zipErrorBlock').show();
                    return false;
                }
            } else {
                app.viewModels.ViewCartViewModel.viewCartPostLoginFlag(true);
                $.publish("EXCHANGE.lightbox.login.open");
            }
        }
    };

    ns.redirectToOverviewPage = function redirectToOverviewPage() {
        app.functions.redirectToRelativeUrlFromSiteBase("application/application-overview.aspx?PreviousBasePage=" + window.location.pathname);
    };

    ns.removePlanFromCart = function removePlanFromCart(planGuid) {

        app.cart.CartAPI.removePlanFromCart(planGuid, function () { ns.removePlanFromCartUICleanup(planGuid); });
        ns.hideCheckoutButtonIfInvalid(planGuid);
    };

    ns.removePlanFromCartUICleanup = function removePlanFromCartUICleanup(planGuid) {
        $.each(app.viewModels.ViewCartViewModel.planVms(), function (index, item) {
            if (item.planGuid == planGuid) {
                app.viewModels.ViewCartViewModel.planVms.splice(index, 1);
                return false; //breaks out of loop
            }
        });
        $.each(app.viewModels.ViewCartViewModel.planSummaries(), function (index, item) {
            if (item.PlanId == planGuid) {
                app.viewModels.ViewCartViewModel.planSummaries.splice(index, 1);
                return false; //breaks out of loop
            }
        });

        if (app.viewModels.ViewCartViewModel.planVms().length == 0 && app.viewModels.ViewCartViewModel.planSummaries().length == 0) {
            if (app.viewModels.ViewCartViewModel.removedPlanIds != null && app.viewModels.ViewCartViewModel.removedPlanIds.length == 0) {
                $.publish("EXCHANGE.lightbox.viewcart.back");
            }
        }
    };

    ns.openOptionalCoverage = function openOptionalCoverage(plan) {
        app.viewModels.OptionalCoverageViewModel.plan(plan);
        $.publish("EXCHANGE.lightbox.optional.open");
    };

    ns.viewCartPopupLoad = function viewCartPopupLoad() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/ViewCartViewModel",
            dataType: "json",
            success: function (serverViewModel) {
                app.viewModels.ViewCartViewModel.setPlans(serverViewModel.CartPlans);
                app.viewModels.ViewCartViewModel.loadFromJSON(serverViewModel.ViewCartViewModel);
                app.viewModels.IneligibleCheckoutViewModel.loadFromJSON(serverViewModel.IneligibleCheckoutViewModel);
                app.viewModels.RequiresCarrierPortalViewModel.loadFromJSON(serverViewModel.RequiresCarrierPortalViewModel);
                if (app.viewModels.ViewCartViewModel.removedPlanIds != null && app.viewModels.ViewCartViewModel.removedPlanIds.length > 0) {
                    app.viewModels.ViewCartViewModel.setRemovedPlans();
                }
                setTimeout(function () {
                    ns.setupSmartHover();
                    return false;
                }, 50);
                ns.hideCheckoutButtonIfInvalid(null);
                $.publish("EXCHANGE.lightbox.viewcart.loaded");

                //if automated removal took out plans, make sure JS cart reflects that
                if (app.viewModels.ViewCartViewModel.removedPlanIds != null && app.viewModels.ViewCartViewModel.removedPlanIds.length > 0) {
                    $.each(app.viewModels.ViewCartViewModel.removedPlanIds, function (index, item) {
                        app.cart.CartAPI.removePlanFromJavascriptCartOnly(item);
                    });
                }

                if (app.viewModels.ViewCartViewModel.planVms().length == 0 && (app.viewModels.ViewCartViewModel.removedPlanIds != null && app.viewModels.ViewCartViewModel.removedPlanIds.length == 0)) {
                    $.publish("EXCHANGE.lightbox.viewcart.back");
                }

                //fitLightboxToScreen('#viewCart-container');
            }
        });
    };

    function fitLightboxToScreen(container) {
        var yOffset = getScrollTop() + 10;
        var popupHeight = $(window).height() - 280;
        $(container).parents().eq(3).css({ "position": "absolute", "top": yOffset + "px" });
        $(container).css("height", popupHeight + "px");
    };
    function getScrollTop() {
        if (typeof pageYOffset != 'undefined') {
            //most browsers
            return pageYOffset;
        } else {
            var B = document.body; //IE 'quirks'
            var D = document.documentElement; //IE with doctype
            D = (D.clientHeight) ? D : B;
            return D.scrollTop;
        }
    };
    ns.hideCheckoutButtonIfInvalid = function hideCheckoutButtonIfInvalid(removedPlanGuid) {
        var planVms = app.viewModels.ViewCartViewModel.planVms();
        var validPlanFound = false;
        for (var i = 0; i < planVms.length; i++) {
            if (planVms[i].readyToSell == app.enums.ReadyToSellEnum.CanSell) {
                // If eligible plan is the one we just removed, ignore it and continue
                if (planVms[i].planGuid == removedPlanGuid) {
                    continue;
                }
                $('#btnCheckout').show();
                validPlanFound = true;
                break;
            }
        }
        if (!validPlanFound) {
            $('#btnCheckout').hide();
            $('#bottomSavehelpText').hide();
        }
    };

    ns.fnOpenpopupDental = function fnOpenpopupDental() {
        $("#tblNoThnxDental").show();
        $("#divNothankUDental").hide();
        ns.SaveDentalOrVisionOptOut("Dental");

    };

    ns.fnOpenpopupVision = function fnOpenpopupVision() {

        $("#tblNoThnxVision").show();
        $("#divNothankUVision").hide();
        ns.SaveDentalOrVisionOptOut("Vision");
    };

    ns.SaveDentalOrVisionOptOut = function SaveDentalOrVisionOptOut(dentalOrVision) {

        var ancCartUpsellPreference = {
            DentalOrVision: dentalOrVision
        };
        ancCartUpsellPreference = JSON.stringify(ancCartUpsellPreference);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Ancillary/SaveDentalOrVisionOptOutInterest",
            dataType: "json",
            data: ancCartUpsellPreference,
            success: function (jsonString) {
                //alert('success');
            },
            error: function (data) {
            }
        });

    }

    ns.fnDentalSubmit = function fnDentalSubmit() {
        $("#divNothankUDentalMain").hide();
        ns.SaveAncReason($("select[id$=SelectDental]").val(), "Dental");
        $("#divAncDentalMainTile").hide();
    };

    ns.fnVisionSubmit = function fnVisionSubmit() {
        $("#divNothankUVisionMain").hide();
        ns.SaveAncReason($("select[id$=SelectVision]").val(), "Vision");
        $("#divAncVisionMainTile").hide();
    };

    ns.SaveAncReason = function SaveAncReason(selectedOption, dentalOrVision) {
        var ancCartUpsellPreference = {
            SelectedDentalOrVisionOption: selectedOption,
            DentalOrVision: dentalOrVision
        };
        ancCartUpsellPreference = JSON.stringify(ancCartUpsellPreference);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Ancillary/SaveDentalOrVisionReason",
            dataType: "json",
            data: ancCartUpsellPreference,
            success: function (jsonString) {
                // alert('success');
            },
            error: function (data) {
            }
        });
    }
} (EXCHANGE, this));



