(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.savedPlans');

    ns.initializeSavedPlansPopup = function initializeSavedPlansPopup() {

        ns.setupViewModels();
        ns.setupBindings();

        var savedPlansLb = new EXCHANGE.lightbox.Lightbox({
            name: 'savedplans',
            divSelector: '#saved-plans-popup',
            openButtonSelector: '#saved-plans-open-button',
            closeButtonSelector: '#saved-plans-close-button',
            beforeOpen: function () {
                ns.preparePlans();
                ko.applyBindings(EXCHANGE.viewModels, $('#saved-plans-popup').get(0));
                return true;
            },
            afterOpen: function (item) {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/API/SharedPopup/SavedPlansClientViewModel",
                    dataType: "json",
                    success: function (data) {
                        var serverViewModel = data;
                        // US- Be cautious
                        //EXCHANGE.plans.PlanLoader.setSavedPlans();
                        EXCHANGE.viewModels.SavedPlansViewModel.loadFromJSON(serverViewModel.SavedPlansPopupViewModel);
                        if (EXCHANGE.searchResults) {
                            EXCHANGE.searchResults.setSavedPlans();
                        } else if (EXCHANGE.ancSearchResults) {
                            EXCHANGE.ancSearchResults.setSavedPlans();
                        }
                        EXCHANGE.user.UserSession.SavedPlans.loadFromJSON(serverViewModel.SavedPlansPopupViewModel.SavedPlans);
                        if (EXCHANGE.user.UserSession.SavedPlans.plans() && EXCHANGE.user.UserSession.SavedPlans.plans().length > 0) {
                            EXCHANGE.user.UserSession.DoctorFinder.changeProviderLabels(EXCHANGE.user.UserSession.SavedPlans.plans());
                        }
                        ns.setSavedPlanStatuses(); 
                        ns.prepareUI();
                        ns.selectFirstTabWithPlans();
                        //ko.applyBindings(EXCHANGE.viewModels.SavedPlansViewModel, $('#saved-plans-popup').get(0));
                        //$('.save-for').hide();
                        $.publish("EXCHANGE.lightbox.savedplans.loaded");
                    },
                    error: function () {
                        $.publish('EXCHANGE.lightbox.closeAll');
                    }
                });
            },
            afterClose: function () {
                //$('.save-for').show();
            },
            showWaitPopup: true
        });
    };


    ns.setupViewModels = function setupViewModels() {
        if (!EXCHANGE.viewModels.SavedPlansViewModel) {
            EXCHANGE.viewModels.SavedPlansViewModel = EXCHANGE.models.SavedPlansViewModel();
        }
    };

    ns.preparePlans = function preparePlans() {
        var savedPlans = EXCHANGE.user.UserSession.SavedPlans.plans();
        var newSavedPlans = [];
        setTimeout(function () { }, 5000);
        for (var i = 0; i < savedPlans.length; i++) {
            if (EXCHANGE.viewModels.SearchResultsViewModel && savedPlans && savedPlans[0]) {
                var planVm = EXCHANGE.viewModels.SearchResultsViewModel.getPlanByPlanGuid(savedPlans[i].planGuid);
                if (planVm) {
                    newSavedPlans.push(planVm);
                }
            }
        }
        if (newSavedPlans && newSavedPlans.length > 0) {
            EXCHANGE.user.UserSession.SavedPlans.plans().length = 0;
            EXCHANGE.user.UserSession.SavedPlans.plans(newSavedPlans);
        }
    };

    ns.prepareUI = function prepareUI() {
        var tabContainers = $('#savedplanscol').find('div.medtabs > div');
        // tabContainers.hide().filter(':first').show();

        $('#savedplanscol').find('div.medtabs ul.tabNavigation li').click(function () {
            //alert($(this).child('a').hash);
            tabContainers.hide();

            ids = $(this).children('a').attr('href').match(/#([^\?]+)/)[0].substr(1);
            EXCHANGE.viewModels.SavedPlansViewModel.currentTab(ids);
            tabContainers.filter("#" + ids).show();
            $('#savedplanspopup').find('div.medtabs ul.tabNavigation li').removeClass('current');
            $(this).addClass('current');

            return false;
        }).filter(':first').click();

        var config = {
            sensitivity: 4,
            interval: 250,
            over: showtip,
            out: hidetip
        };

        function showtip() {
            if ($(this).hasClass("rating")) {
                $(this).addClass('ratinghover');
            } else if ($(this).hasClass("covericon")) {
                $(this).addClass('covericonhover');
            } else if ($(this).hasClass("add-to-cart") || $(this).hasClass("addtocompare")) {
                $(this).addClass('show-tip');
            } else if ($(this).hasClass("show-details")) {
                $(this).addClass('show-tip');
            } else if ($(this).hasClass("compare-side")) {
                $(this).addClass('show-tip');
            } else if ($(this).hasClass("med-covered")) {
                $(this).addClass('show-tip');
            } else if ($(this).hasClass("total-cost")) {
                $(this).addClass('show-tip');
            } else if ($(this).hasClass("moreoption-wrap")) {
                $(this).addClass('show-menu');
            } else {
                $(this).addClass('logosinfo');
            }
        }

        function hidetip() {
            if ($(this).hasClass("rating")) {
                $(this).removeClass('ratinghover');
            } else if ($(this).hasClass("covericon")) {
                $(this).removeClass('covericonhover');
            } else if ($(this).hasClass("add-to-cart") || $(this).hasClass("addtocompare")) {
                $(this).removeClass('show-tip');
            } else if ($(this).hasClass("show-details")) {
                $(this).removeClass('show-tip');
            } else if ($(this).hasClass("compare-side")) {
                $(this).removeClass('show-tip');
            } else if ($(this).hasClass("med-covered")) {
                $(this).removeClass('show-tip');
            } else if ($(this).hasClass("total-cost")) {
                $(this).removeClass('show-tip');
            } else if ($(this).hasClass("moreoption-wrap")) {
                $(this).removeClass('show-menu');
            } else {
                $(this).removeClass('logosinfo');
            }
        }

        var config2 = {
            sensitivity: 4,
            interval: 250,
            over: showtip2,
            out: hidetip2
        };

        function showtip2() {
            $(this).parent().addClass("show-tip");
        }


        function hidetip2() {
            $(this).parent().removeClass("show-tip");
        }

        $("div.providerinfo").hover(function () {
            $(this).addClass('providerhover');
        }, function () {
            $(this).removeClass("providerhover");
        });

        $("div.providerinfo div.providerlogo").smartHover(config);
        $("div.providerinfo div.providerdetail h3").smartHover(config);
        $("div.providerinfo .price").smartHover(config);
        $("div.providerinfo div.rating").smartHover(config);
        $("div.providerinfo a.covericon").smartHover(config);

        $("a.add-to-cart").smartHover(config);
        $(".addtocompare").smartHover(config);
        $(".compare-side").smartHover(config);
        $(".pricebar li a").smartHover(config2);
        $("a.med-covered").smartHover(config2);
        $("a.find-doc").smartHover(config2);
        $(".moreoption-wrap").smartHover(config);
        $("div.total-cost").smartHover(config);

        $(".planscontent").wrap("<div class='content' id='planscontentwrapper'></div>");
        $(".planscontent").parent(".content").css({ "overflow": "hidden" });

    };

    ns.selectFirstTabWithPlans = function selectFirstTabWithPlans() {
        $('#savedplanspopup').find('.tabNavigation').find('li').each(function () {
            var self = $(this);
            if (self.hasClass(EXCHANGE.viewModels.SavedPlansViewModel.tab0Class())) {
                if (EXCHANGE.viewModels.SavedPlansViewModel.tab0Count() > 0) {
                    self.click();
                    return false;
                }
            } else if (self.hasClass(EXCHANGE.viewModels.SavedPlansViewModel.tab1Class())) {
                if (EXCHANGE.viewModels.SavedPlansViewModel.tab1Count() > 0) {
                    self.click();
                    return false;
                }
            } else if (self.hasClass(EXCHANGE.viewModels.SavedPlansViewModel.tab2Class())) {
                if (EXCHANGE.viewModels.SavedPlansViewModel.tab2Count() > 0) {
                    self.click();
                    return false;
                }
            }
        });
        $('#savedplanspopup .not-available').width($('#savedplanspopup .providerinfo').width());
    };

    ns.setupBindings = function setupBindings() {
        $(document).on("click", ".add-to-cart", function () {
            
        });
    };

    ns.updateCompareStatus = function updateCompareStatus(compPlans, svPlan) {
        for (var c = 0; c < compPlans.length; c++) {
            if (compPlans[c].planGuid === svPlan.planGuid) {
                svPlan.isCompared(true);
                break;
            }
        }
    };

    ns.setSavedPlanStatuses = function setSavedPlanStatuses() {
        var cartPlans = EXCHANGE.user.UserSession.ShoppingCartPlans.plans();
        var savedPlans = EXCHANGE.user.UserSession.SavedPlans.plans();
        for (var s = 0; s < savedPlans.length; s++) {
            var svPlan = savedPlans[s];
            for (var i = 0; i < cartPlans.length; i++) {
                var ctPlan = cartPlans[i];
                if (ctPlan.PlanId === svPlan.planGuid) {
                    svPlan.isInCart(true);
                    break;
                }
            }
            svPlan.isSaved(true);
            var maCompPlans = EXCHANGE.plans.MedicareAdvantageCompareList.plans();
            var pdpCompPlans = EXCHANGE.plans.PrescriptionDrugCompareList.plans();
            var gapCompPlans = EXCHANGE.plans.MedigapCompareList.plans();
            var dentalCompPlans = EXCHANGE.plans.DentalCompareList.plans();
            var visionCompPlans = EXCHANGE.plans.VisionCompareList.plans();
            switch (svPlan.planType) {
            case EXCHANGE.enums.PlanTypeEnum.MEDICAREADVANTAGE:
                ns.updateCompareStatus(maCompPlans, svPlan);
                break;
            case EXCHANGE.enums.PlanTypeEnum.PRESCRIPTIONDRUG:
                ns.updateCompareStatus(pdpCompPlans, svPlan);
                break;
            case EXCHANGE.enums.PlanTypeEnum.MEDIGAP:
                ns.updateCompareStatus(gapCompPlans, svPlan);
                break;
            case EXCHANGE.enums.PlanTypeEnum.DENTAL:
                ns.updateCompareStatus(dentalCompPlans, svPlan);
                break;
            case EXCHANGE.enums.PlanTypeEnum.VISION:
                ns.updateCompareStatus(visionCompPlans, svPlan);
                break;
            }
        }
    };

} (EXCHANGE));

