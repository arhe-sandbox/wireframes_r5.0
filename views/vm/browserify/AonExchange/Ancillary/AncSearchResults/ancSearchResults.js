(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.ancSearchResults");
    var speedBumpTimeInMilliseconds = 250; //set to 0 to disable the SR speed bump
    var currentPlan = 0;
    var curPage;

    $(document).ready(function () {
        ns.initializePage();
        $('.moreMedigapPlans').hide();
        ns.getTypeOfPlan();
    });

    ns.getTypeOfPlan = function GetTypeOfPlan() {
        var curMenuIndex = window.location.pathname.lastIndexOf("/") + 1;
        var curMenu = window.location.pathname.substr(curMenuIndex);
        if (curMenu === "search-vision-results.aspx") {
            curPage = EXCHANGE.enums.OtherCoverageEnumID.VISION;
            currentPlan = EXCHANGE.enums.OtherCoverageEnum.VISION;
        } else if (curMenu === "search-dental-results.aspx") {
            curPage = EXCHANGE.enums.OtherCoverageEnumID.DENTAL;
            currentPlan = EXCHANGE.enums.OtherCoverageEnum.DENTAL;
            $('.moreMedigapPlans').show();
            $('.moreMedigapPlans').css('height', '115px');
            $("a.more-link").on("click", function (e) {
                if ($(this).text() == "More") {
                    $('.more-text').show();
                    $(this).text('Less');
                    $('.moreMedigapPlans').css('height', '340px');
                }
                else if ($(this).text() == "Less") {
                    $('.more-text').hide();
                    $('.moreMedigapPlans').css('height', '115px');
                    $(this).text('More');
                }
            });
        }
    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {

        $('#UpdatePlanListButton').live('click', ns.updatePlanListWithFilters);
        $('#CloseInsurerPopup').live('click', ns.closeInsurerPopup);

        $('#clear-all-filters').live('click', function () {

            app.viewModels.SelectInsurersViewModel.selectNone_fnc();
            app.functions.setDropdownSelectedOption('#sortBy', EXCHANGE.viewModels.AncSearchResultsViewModel.sortBySortOptions_lbl());
            $('#UpdatePlanListButton').click();
        });
        
        $(document).on("click", "#addToSavedHelpMeChoose", function () {
            if (EXCHANGE.user.UserSession.IsLoggedIn()) {
                $.publish("EXCHANGE.lightbox.savedplans.open");
            } else {
                $.publish("EXCHANGE.lightbox.login.open");
            }
        });
    };

    ns.refreshPlansUI = function refreshPlansUI() {
        setTimeout(function () {
            ns.setupPlugins();
            ns.setupSmartHover();
            $('.custom-checkbox').trigger('updateState');
            return false;
        }, 50);
    };


    ns.setupPlugins = function setupPlugins() {
        $('.dropdown').dropkick();
        $('.dropdownsmall').dropkick();
        $('#searchResultsTemplates input').customInput();
    };

    ns.redoDropkick = function redoDropkick(item) {
        $(item).dropkick();
    };

    ns.refreshInput = function refreshInput(item) {
        $(item).customInput();
    };

    ns.startSpeedBumpSpinner = function () {
        if (speedBumpTimeInMilliseconds != 0) {
            $('#search-results-spinner').show();
        }
    };


    ns.showtip = function showtip() {
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
    };

    ns.hidetip = function hidetip() {
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
        $("div.providerinfo").hover(function () {
            $(this).addClass('providerhover');
        }, function () {
            $(this).removeClass("providerhover");
        });

        $("div.providerlogo").hover(function () {
            $(this).addClass('logosinfo');
        }, function () {
            $(this).removeClass("logosinfo");
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
    };
    ns.stopSpeedBumpSpinner = function () {
        if (speedBumpTimeInMilliseconds != 0) {
            $('#search-results-spinner').hide();
        }
    };
    ns.ShowHideAARP = function ShowHideAARP() {
        var validInsurers = EXCHANGE.viewModels.SelectInsurersViewModel.activeInsurersCurrentTab()();
        if (validInsurers.length > 0) {
            if (validInsurers.length == EXCHANGE.viewModels.SelectInsurersViewModel.allInsurersCurrentTab()().length) {
                $("#AARPMedigapBanner").show();
            }
            else {
                $("#AARPMedigapBanner").hide();
            }
        }
        else {
            $("#AARPMedigapBanner").show();
        }
    }
    ns.updatePlanListWithFilters = function updatePlanListWithFilters(dontSaveSearch) {
        var validInsurers, visionSortEngine, dentalSortEngine;
        if (_gaq) {
            _gaq.push(['_trackEvent', 'SideBar-Update Plan List', 'Click', 'Update Plan List']);
        }
        $('#advantage').hide();
        ns.startSpeedBumpSpinner();

        setTimeout(function () {

            var otherFilters = EXCHANGE.models.NarrowMyAncResultsViewModel.getResultingFilters();
            var sorts = EXCHANGE.models.NarrowMyAncResultsViewModel.getResultingSorts(currentPlan);
            validInsurers = EXCHANGE.viewModels.SelectInsurersViewModel.activeInsurersCurrentTab()();
            if (validInsurers.length > 0) {
                var filterRule = new EXCHANGE.plans.FilterRuleObject({
                    attributeName: "insurerId",
                    useAttributes: false,
                    filterGroup: "insurer",
                    filterFunction: function (insurer) {
                        return validInsurers.indexOf(insurer) != -1;
                    }
                });
            }
            switch (currentPlan) {

                case EXCHANGE.enums.OtherCoverageEnum.DENTAL:
                    ns.ShowHideAARP();
                    EXCHANGE.plans.DentalFilterEngine.clearFilterByGroup("insurer");
                    EXCHANGE.viewModels.AncSearchStateDental.AncSelectedInsurersDental[EXCHANGE.enums.OtherCoverageEnum.DENTAL] = validInsurers;
                    if (filterRule) {
                        EXCHANGE.plans.DentalFilterEngine.addFilter(filterRule);
                    }
                    EXCHANGE.models.NarrowMyAncResultsViewModel.clearFilterRules(EXCHANGE.plans.DentalFilterEngine);
                    //                    EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.OtherCoverageEnum.DENTAL].length = 0;  //--Should Check
                    for (var i = 0; i < otherFilters.length; i++) {
                        EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.OtherCoverageEnumID.DENTAL].push(
                    {
                        FilterName: otherFilters[i].filterGroup,
                        SelectedValue: otherFilters[i].allowedValues[0]
                    });
                        EXCHANGE.plans.DentalFilterEngine.addFilter(otherFilters[i]);
                    }

                    dentalSortEngine = sorts;
                    break;
                case EXCHANGE.enums.OtherCoverageEnum.VISION:
                    EXCHANGE.plans.VisionFilterEngine.clearFilterByGroup("insurer");
                    EXCHANGE.viewModels.AncSearchStateVision.AncSelectedInsurersVision[EXCHANGE.enums.OtherCoverageEnum.VISION] = validInsurers;
                    if (filterRule) {
                        EXCHANGE.plans.VisionFilterEngine.addFilter(filterRule);
                    }
                    EXCHANGE.models.NarrowMyAncResultsViewModel.clearFilterRules(EXCHANGE.plans.VisionCompareList);
                    //                    EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.OtherCoverageEnum.VISION].length = 0;  //--Should Check
                         for (var i = 0; i < otherFilters.length; i++) {
                        EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.OtherCoverageEnumID.MEDICAREADVANTAGE].push(
                    {
                        FilterName: otherFilters[i].filterGroup,
                        SelectedValue: otherFilters[i].allowedValues[0]
                    });
                        EXCHANGE.plans.VisionCompareList.addFilter(otherFilters[i]);
                    }
                    visionSortEngine = sorts;
                    break;
                default:
                    break;
            }

            if (curPage === EXCHANGE.enums.OtherCoverageEnumID.DENTAL) {
                EXCHANGE.plans.applyFiltering(true, undefined, true);

                EXCHANGE.plans.applySorting(undefined, undefined, undefined, true, undefined, dentalSortEngine);
            }
            else if (curPage === EXCHANGE.enums.OtherCoverageEnumID.VISION) {
                EXCHANGE.plans.applyFiltering(true, true, undefined);

                EXCHANGE.plans.applySorting(undefined, undefined, undefined, true, visionSortEngine, undefined);
            }
            if (dentalSortEngine) { //-- Should Check
                EXCHANGE.viewModels.AncSearchStateDental.DentalSortBy = dentalSortEngine;
            }
            if (visionSortEngine) { //-- Should Check
                EXCHANGE.viewModels.AncSearchStateVision.VisionSortBy = visionSortEngine;
            }
            //Scroll to top of document because they could have scrolled down prior to filter.
            $(window).scrollTop(0);
            //Reset height in case changing from more plans to fewer plans.  
            $(".sidebar-holder").css({ height: (490) + 'px' });

            ns.stopSpeedBumpSpinner();
            $('#advantage').show();
            if (curPage === EXCHANGE.enums.OtherCoverageEnumID.DENTAL) {
                ns.saveAncSearchStateDental();
            }
            else if (curPage === EXCHANGE.enums.OtherCoverageEnumID.VISION) {
                ns.saveAncSearchStateVision();
            }

        }, speedBumpTimeInMilliseconds);
    };

    ns.setupModals = function setupModals() {

        var selectInsurersLb = new EXCHANGE.lightbox.Lightbox({
            name: 'selectinsurers',
            divSelector: '#insurers-popup',
            openButtonSelector: '#select-insurers-open-button',
            closeButtonSelector: '#select-insurers-close-button',
            beforeSubmit: function () {
                var validInsurers = EXCHANGE.viewModels.SelectInsurersViewModel.activeInsurersCurrentTab()();
                if (validInsurers && validInsurers.length === 0) {
                    EXCHANGE.viewModels.SelectInsurersViewModel.hasErrors(true);
                    return false;
                }
                EXCHANGE.viewModels.SelectInsurersViewModel.saveCurrentInsurers();
                return true;
            },
            afterClose: function () {
                EXCHANGE.viewModels.SelectInsurersViewModel.resetActiveInsurers();
                EXCHANGE.viewModels.SelectInsurersViewModel.hasErrors(false);
            }
        });
    };

    ns.closeInsurerPopup = function closeInsurerPopup() {
        var validInsurers = EXCHANGE.viewModels.SelectInsurersViewModel.activeInsurersCurrentTab()();
        var allInsurers = EXCHANGE.viewModels.SelectInsurersViewModel.allInsurersCurrentTab()();
        if (validInsurers && validInsurers.length === 0 && allInsurers && allInsurers.length !== 0) {
            EXCHANGE.viewModels.SelectInsurersViewModel.hasErrors(true);
            return false;
        } else {
            $('#selectInsurersCloseButton').click();
        }
    };

    ns.initializePage = function initializePage() {
        ns.setupViewModels();
        app.shoppingCart.initializeLightboxes();
        app.ancPlanDetails.initializePlanDetails();
        ns.setupPlugins();
        ns.setupSmartHover();
        ns.setupModals();
        ns.wireupJqueryEvents();

//        app.ancPlanDetails.initializePlanDetails();
//        app.comparePlans.initializeComparePlans();
//        app.savedPlans.initializeSavedPlansPopup();

        //app.intelligentSwap.initializeIntelligentSwap();
        //app.viewCart.initializeViewCart();
        //app.comparisonLimit.initializeComparisonLimit();
    };

    window.onscroll = function () {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var scrollVisibleHeight = window.innerHeight || document.documentElement.clientHeight;
        var scrollTotalHeight = document.body.offsetHeight;
        //Recompute height
        $(".sidebar-holder").css({ height: (scrollTotalHeight - (490 + 262)) + 'px' });
        $("#sidebar").toggleClass("persistentHelpTop", scrollTop > 360 && scrollTop < scrollTotalHeight - 898).toggleClass("persistentHelpBottom", scrollTop >= scrollTotalHeight - 898);

    }

    ns.redoDropkick = function redoDropkick(item) {
        $(item).dropkick();
    };

    ns.refreshInput = function refreshInput(item) {
        $(item).customInput();
    };

    ns.afterPlansLoaded = function afterCartAndPlansLoaded() {

        ns.setPlansInCart();
        ns.setComparedPlans();
        ns.setSavedPlans();
        /*
        ns.setPhysiciansData(); */
        if (app.functions.isIE8OrLower()) {
            setTimeout(function () {
                ns.applySortingAndFiltering();
            }, 100);
        } else {
            ns.applySortingAndFiltering();
        }
    };

    ns.setPlansInCart = function setPlansInCart() {
        var planSums = EXCHANGE.user.UserSession.ShoppingCartPlans.plans();
        var allPlans = EXCHANGE.viewModels.AncSearchResultsViewModel.allPlansInSearchResults();
        var foundPlan;
        if (null != allPlans) {
            for (var i = 0; i < planSums.length; i++) {
                var plan = planSums[i];
                foundPlan = false;
                for (var j = 0; j < allPlans.length; j++) {
                    if (allPlans[j].planGuid == plan.PlanId) {
                        allPlans[j].isInCart(true);
                        foundPlan = true;
                        break;
                    }
                }
            }
        }
    };

    ns.setComparedPlans = function setComparedPlans() {
        var planSums = EXCHANGE.user.UserSession.ComparedPlans.plans();
        var allPlans = EXCHANGE.viewModels.AncSearchResultsViewModel.allPlansInSearchResults();
        var foundPlan;
        if (null != allPlans) {
            for (var i = 0; i < planSums.length; i++) {
                var plan = planSums[i];
                foundPlan = false;
                for (var j = 0; j < allPlans.length; j++) {
                    if (allPlans[j].planGuid == plan.PlanId) {
                        allPlans[j].isCompared(true);
                        foundPlan = true;
                        break;
                    }
                }
            }
        }
    }

    ns.setSavedPlans = function setSavedPlans() {
        var plansSaved = EXCHANGE.user.UserSession.SavedPlans.plans();
        var allPlans = EXCHANGE.viewModels.AncSearchResultsViewModel.allPlansInSearchResults();
        var foundPlan;
        if (null != allPlans) {
            for (var i = 0; i < plansSaved.length; i++) {
                var plan = plansSaved[i];
                foundPlan = false;
                for (var j = 0; j < allPlans.length; j++) {
                    if (allPlans[j].planGuid == plan.planGuid) {
                        allPlans[j].isSaved(true);
                        foundPlan = true;
                        break;
                    }
                }
            }
        }
    };

    ns.setupViewModels = function setupViewModels() {

        var curMenuIndex = window.location.pathname.lastIndexOf("/") + 1;
        var curMenu = window.location.pathname.substr(curMenuIndex);

        EXCHANGE.viewModels.AncSearchResultsViewModel = EXCHANGE.models.AncSearchResultsViewModel();
        EXCHANGE.viewModels.PlanSharedResourceStrings = EXCHANGE.models.PlanSharedResourceStrings();
        EXCHANGE.viewModels.AncSearchHeaderViewModel = EXCHANGE.models.AncSearchHeaderViewModel();
        EXCHANGE.viewModels.NarrowMyResultsViewModel = EXCHANGE.models.NarrowMyResultsViewModel();
        //EXCHANGE.viewModels.NarrowMyAncResultsViewModel = EXCHANGE.models.NarrowMyAncResultsViewModel();
        EXCHANGE.viewModels.SearchState = EXCHANGE.models.SearchState();
        EXCHANGE.viewModels.AncSearchStateDental = EXCHANGE.models.AncSearchStateDental();
        EXCHANGE.viewModels.AncSearchStateVision = EXCHANGE.models.AncSearchStateVision();
        EXCHANGE.models.NarrowMyAncResultsViewModel = EXCHANGE.models.NarrowMyAncResultsViewModel();
        //EXCHANGE.viewModels.SearchResultsViewModel = EXCHANGE.models.SearchResultsViewModel();
        EXCHANGE.viewModels.SelectInsurersViewModel = EXCHANGE.models.SelectInsurersViewModel();

        $('#search-results-ancillary').hide();
        $('#search-results-spinner').show();
        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.AncSearchResults.AncSearchResultsClientViewModel");
        //ko.applyBindings(EXCHANGE.viewModels, $('#searchResultsTemplates').get(0));
        //ko.applyBindings(EXCHANGE.viewModels, $('.container').get(0));

        var searchArgs = {
            PlaceholderArg: "1234"
        };
        searchArgs = JSON.stringify(searchArgs);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Ancillary/AncSearchResultsClientViewModel",
            data: searchArgs,
            dataType: "json",
            success: function (serverPageViewModels) {
                if (!serverPageViewModels.HasValidSearchCriteria) {
                    if (curPage === EXCHANGE.enums.OtherCoverageEnumID.DENTAL) {
                        app.functions.redirectToRelativeUrlFromSiteBase("find-anc-plan.aspx?p=d");
                    } else if (curPage === EXCHANGE.enums.OtherCoverageEnumID.VISION) {
                        app.functions.redirectToRelativeUrlFromSiteBase("find-anc-plan.aspx?p=v");
                    }
                    return;
                }
                /*
                if (serverPageViewModels.HasAnyPlans == false) {
                app.functions.redirectToRelativeUrlFromSiteBase("/find-plans.aspx?ShowNoPlansLB=true");
                returnupdateFromSearchState
                } */
                app.viewModels.PlanSharedResourceStrings.loadFromJSON(serverPageViewModels.PlanSharedResourceStrings);
                app.viewModels.AncSearchResultsViewModel.loadFromJSON(serverPageViewModels.AncSearchResultsViewModel, serverPageViewModels.PlanLists);
                app.viewModels.NarrowMyResultsViewModel.loadFromJSON(serverPageViewModels.NarrowMyResultsViewModel);
                app.viewModels.SelectInsurersViewModel.loadFromJSON(serverPageViewModels.SelectInsurersViewModel);
                app.models.NarrowMyAncResultsViewModel.loadFromJSON(serverPageViewModels.NarrowMyResultsViewModel);

                if (curPage === EXCHANGE.enums.OtherCoverageEnumID.DENTAL) {
                    EXCHANGE.viewModels.AncSearchStateDental.loadSearchState(serverPageViewModels.AncSearchStateDental);
                    app.viewModels.SelectInsurersViewModel.updateFromSearchState(app.viewModels.AncSearchStateDental);
                    if (EXCHANGE.viewModels.AncSearchStateDental.DentalSortBy.sortAttributeName.toLowerCase() === "insurername") {
                        $("div.dk_options ul.dk_options_inner>li").removeClass("dk_option_current");
                        $("div.dk_options ul.dk_options_inner li:last-child").addClass("dk_option_current");
                        $("div#dk_container_Sort a.dk_toggle span.dk_label").text("Insurer");
                    }
                    else if (EXCHANGE.viewModels.AncSearchStateDental.DentalSortBy.sortAttributeName.toLowerCase() === "premiumamount") {
                        $("div.dk_options ul.dk_options_inner>li").removeClass("dk_option_current");
                        $("div.dk_options ul.dk_options_inner li:first-child").addClass("dk_option_current");
                        $("div#dk_container_Sort a.dk_toggle span.dk_label").text("Premium");
                    }
                    else {
                        EXCHANGE.models.NarrowMyAncResultsViewModel.updateFromSearchState(EXCHANGE.viewModels.AncSearchStateDental);
                    }
                    ns.ShowHideAARP();
                }
                else {
                    EXCHANGE.viewModels.AncSearchStateVision.loadSearchState(serverPageViewModels.AncSearchStateVision);
                    app.viewModels.SelectInsurersViewModel.updateFromSearchState(app.viewModels.AncSearchStateVision);
                    if (EXCHANGE.viewModels.AncSearchStateVision.VisionSortBy.sortAttributeName.toLowerCase() === "insurername") {
                        $("div.dk_options ul.dk_options_inner>li").removeClass("dk_option_current");
                        $("div.dk_options ul.dk_options_inner li:last-child").addClass("dk_option_current");
                        $("div#dk_container_Sort a.dk_toggle span.dk_label").text("Insurer");
                    }
                    else if (EXCHANGE.viewModels.AncSearchStateVision.VisionSortBy.sortAttributeName.toLowerCase() === "premiumamount") {
                        $("div.dk_options ul.dk_options_inner>li").removeClass("dk_option_current");
                        $("div.dk_options ul.dk_options_inner li:first-child").addClass("dk_option_current");
                        $("div#dk_container_Sort a.dk_toggle span.dk_label").text("Premium");
                    }
                    else {
                        EXCHANGE.models.NarrowMyAncResultsViewModel.updateFromSearchState(EXCHANGE.viewModels.AncSearchStateVision);
                    }
                }

                //app.viewModels.SearchState.loadSearchState(serverPageViewModels.SearchState);
                //app.viewModels.SelectInsurersViewModel.updateFromSearchState(app.viewModels.SearchState);

                app.placeholder.applyPlaceholder();
                ns.afterPlansLoaded();
                if (curPage === EXCHANGE.enums.OtherCoverageEnumID.VISION) {
                    app.viewModels.AncSearchResultsViewModel.isVision(true);
                    app.viewModels.AncSearchResultsViewModel.displayPlans(app.viewModels.AncSearchResultsViewModel.visionPlans());
                } else if (curPage === EXCHANGE.enums.OtherCoverageEnumID.DENTAL) {
                    app.viewModels.AncSearchResultsViewModel.isDental(true);
                    app.viewModels.AncSearchResultsViewModel.displayPlans(app.viewModels.AncSearchResultsViewModel.dentalPlans());
                }

                ns.refreshPlansUI();

                $('div.medtab-content-wrapper').show();
                $('.page-loading').removeClass('page-loading');
                $('#search-results-spinner').hide();
                $('#search-results-ancillary').show();
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.AncSearchResults.AncSearchResultsClientViewModel");
            },
            error: function (data) {
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.AncSearchResults.AncSearchResultsClientViewModel");
            }
        });
    };
    ns.saveAncSearchStateDental = function saveAncSearchStateDental() {
        var parameters = JSON.stringify(EXCHANGE.viewModels.AncSearchStateDental.toJS());

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SearchResult/SaveAncSearchStateDental",
            data: parameters,
            dataType: "json",
            success: function (dataStr) {
            }
        });
    };

    ns.saveAncSearchStateVision = function saveAncSearchStateVision() {
        var parameters = JSON.stringify(EXCHANGE.viewModels.AncSearchStateVision.toJS());
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SearchResult/SaveAncSearchStateVision",
            data: parameters,
            dataType: "json",
            success: function (dataStr) {
            }
        });
    };

    ns.applySortingAndFiltering = function applySortingAndFiltering() {
        ns.applySortsFromLoad();
        ns.applyFiltersFromLoad();
        //        EXCHANGE.viewModels.SearchResultsViewModel.loadFromActivePlans();
        //        app.login.loadAfterLogin();
        ns.refreshPlansUI();
        //        app.coverageCost.getSearchResultsPlanCoverageCosts();
        //        app.user.loginConflictIntelligentSwap();
    };

    ns.applySortsFromLoad = function applySortsFromLoad() {
        var dentalSortEngine, visionSortEngine;

        if (EXCHANGE.viewModels.AncSearchStateDental.DentalSortBy) {
            dentalSortEngine = EXCHANGE.plans.SortRules().loadFromJson(EXCHANGE.viewModels.AncSearchStateDental.DentalSortBy);
        }
        if (EXCHANGE.viewModels.AncSearchStateVision.VisionSortBy) {
            visionSortEngine = EXCHANGE.plans.SortRules().loadFromJson(EXCHANGE.viewModels.AncSearchStateVision.VisionSortBy);
        }


        if (curPage === EXCHANGE.enums.OtherCoverageEnumID.DENTAL) {
            EXCHANGE.plans.applySorting(undefined, undefined, undefined, true, undefined, dentalSortEngine);
        }
        else if (curPage === EXCHANGE.enums.OtherCoverageEnumID.VISION) {
            EXCHANGE.plans.applySorting(undefined, undefined, undefined, true, visionSortEngine, undefined);
        }
        //EXCHANGE.plans.applySorting(dentalSortEngine, visionSortEngine, false);
    };

    ns.applyFiltersFromLoad = function applyFiltersFromLoad() {
        var filterRule;

        if (EXCHANGE.viewModels.AncSearchStateDental.AncSelectedInsurersDental[EXCHANGE.enums.OtherCoverageEnum.DENTAL]
                    && EXCHANGE.viewModels.AncSearchStateDental.AncSelectedInsurersDental[EXCHANGE.enums.OtherCoverageEnum.DENTAL].length > 0) {
            filterRule = new EXCHANGE.plans.FilterRuleObject({
                attributeName: "insurerId",
                useAttributes: false,
                filterGroup: "insurer",
                filterFunction: function (insurer) {
                    return EXCHANGE.viewModels.AncSearchStateDental.AncSelectedInsurersDental[EXCHANGE.enums.OtherCoverageEnum.DENTAL].indexOf(insurer) != -1;
                }
            });

            EXCHANGE.plans.DentalFilterEngine.addFilter(filterRule);
        }
        if (EXCHANGE.viewModels.AncSearchStateVision.AncSelectedInsurersVision[EXCHANGE.enums.OtherCoverageEnum.VISION]
                    && EXCHANGE.viewModels.AncSearchStateVision.AncSelectedInsurersVision[EXCHANGE.enums.OtherCoverageEnum.VISION].length > 0) {
            filterRule = new EXCHANGE.plans.FilterRuleObject({
                attributeName: "insurerId",
                useAttributes: false,
                filterGroup: "insurer",
                filterFunction: function (insurer) {
                    return EXCHANGE.viewModels.AncSearchStateVision.AncSelectedInsurersVision[EXCHANGE.enums.OtherCoverageEnum.VISION].indexOf(insurer) != -1;
                }
            });

            EXCHANGE.plans.VisionFilterEngine.addFilter(filterRule);
        }
        if (curPage === EXCHANGE.enums.OtherCoverageEnumID.DENTAL) {
            EXCHANGE.plans.applyFiltering(true, undefined, true);
        }
        else if (curPage === EXCHANGE.enums.OtherCoverageEnumID.VISION) {
            EXCHANGE.plans.applyFiltering(true, true, undefined);
        }
        //EXCHANGE.plans.applyFiltering(true);
    };


} (EXCHANGE));
