(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.searchResults');

    EXCHANGE.namespace('EXCHANGE.viewModels');
    EXCHANGE.namespace('EXCHANGE.exchangeContext');

    var inlineErrors = new Array();
    var userZip = "";
    var plansInCartCount = 0;
    var speedBumpTimeInMilliseconds = 250; //set to 0 to disable the SR speed bump

    $(document).ready(function () {
        ns.initializePage();
    });

    ns.checkForFindPlansData = function checkForFindPlansData() {
        var isValid = true;
        if (app.user && app.user.UserSession && app.user.UserSession.UserProfile) {
            if (!app.user.UserSession.UserProfile.zipCode || app.user.UserSession.UserProfile.zipCode === "") {
                isValid = false;
            }
            if (!app.user.UserSession.UserProfile.coverageBeginsDate || app.user.UserSession.UserProfile.coverageBeginsDate === "") {
                isValid = false;
            }
            if (!app.user.UserSession.UserProfile.dateOfBirth || app.user.UserSession.UserProfile.dateOfBirth === "") {
                isValid = false;
            }
        }
        else {
            isValid = false;
        }

        return isValid;
    };

    ns.initializePage = function initializePage() {
        ns.setupViewModels();
        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.SearchResult.initializePage");
        app.shoppingCart.initializeLightboxes();
        ns.setupPlugins();
        ns.setupSmartHover();
        ns.setupModals();
        ns.selectFindPlansTab();
        ns.wireupJqueryEvents();
        ns.setupBindings();
        $('.filter-btn').addClass('open').next('.narrow-filters').show();
        EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.SearchResult.initializePage");
    };


    window.onscroll = function () {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var scrollVisibleHeight = window.innerHeight || document.documentElement.clientHeight;
        var scrollTotalHeight = document.body.offsetHeight;
        //Recompute height
        $(".sidebar-holder").css({ height: (scrollTotalHeight - (490 + 262)) + 'px' });
        $("#sidebar").toggleClass("persistentHelpTop", scrollTop > 490 && scrollTop < scrollTotalHeight - 898).toggleClass("persistentHelpBottom", scrollTop >= scrollTotalHeight - 898);

    }

    ns.selectTabFromQueryString = function () {
        var tab = EXCHANGE.functions.getKeyValueFromWindowLocation('tab');
        ns.setCurrentTab(tab);
    };

    ns.selectFindPlansTab = function selectFindPlansTab() {
        $('.FindPlansMenuItem').removeClass('CMSListMenuLI').addClass('CMSListMenuHighlightedLI');
        $('.FindPlansMenuItem > a').removeClass('CMSListMenuLink').addClass('CMSListMenuLinkHighlighted');
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


        var planComboErrMsgLB = new EXCHANGE.lightbox.Lightbox({
            name: 'planComboErrMsg',
            divSelector: '#planComboErrMsg-popup',
            openButtonSelector: '#planComboErrMsg-open-button',
            closeButtonSelector: '#planComboErrMsg-close-button'

        });

        var preEligFail = new EXCHANGE.lightbox.Lightbox({
            name: 'preEligFail',
            divSelector: '#preEligFail-popup',
            openButtonSelector: '#preEligFail-open-button',
            closeButtonSelector: '#preEligFail-close-button'

        });

        var esrdconfirmpopup = new EXCHANGE.lightbox.Lightbox({
            name: 'esrdconfirm',
            divSelector: '#esrd-confirm-popup',
            openButtonSelector: '#esrdconfirm-open-button',
            closeButtonSelector: '#esrdconfirm-close-button',
            beforeOpen: function () {
                $('.formpage').find('.custom-radio .checked').removeClass('checked');
                $('.formpage').find('.esrdselect').removeClass('error-field');
                return true;
            }
        });

        var esrdconfirmhelpopup = new EXCHANGE.lightbox.Lightbox({
            name: 'esrdconfirmhelp',
            divSelector: '#esrd-confirmhelp-popup',
            openButtonSelector: '#esrdconfirmhelp-open-button',
            closeButtonSelector: '#esrdconfirmhelp-close-button',
        });


    };

    ns.setupBindings = function setupBindings() {

        $('#esrd-confirm-popup').on('click', '#continue-btn', function (e) {

            if (EXCHANGE.viewModels.ESRDConfirmationViewModel.HasESRDSituation_radio() === null) {

                $('.formpage').find('.esrdselect').addClass('error-field');

            } else {

                if (!EXCHANGE.viewModels.ESRDConfirmationViewModel.IsEGHP()) {

                    if (EXCHANGE.viewModels.ESRDConfirmationViewModel.HasESRDSituation_radio() == "Yes") {
                        EXCHANGE.viewModels.ESRDConfirmationViewModel.Plan().addToShoppingCart(true, true);
                        $.publish("EXCHANGE.lightbox.esrdconfirm.done");
                    } else {

                        $.publish("EXCHANGE.lightbox.esrdconfirmhelp.open");
                    }

                } else {

                    if (EXCHANGE.viewModels.ESRDConfirmationViewModel.HasESRDSituation_radio() == "No") {
                        EXCHANGE.viewModels.ESRDConfirmationViewModel.Plan().addToShoppingCart(true, true);
                        $.publish("EXCHANGE.lightbox.esrdconfirm.done");

                    } else {

                        $.publish("EXCHANGE.lightbox.esrdconfirmhelp.open");
                    }

                }

            }
        });

    };

    ns.afterCartAndPlansLoaded = function afterCartAndPlansLoaded() {

        EXCHANGE.plans.PlanLoader.setPlansInCart();
        EXCHANGE.plans.PlanLoader.setComparedPlans();
        EXCHANGE.plans.PlanLoader.setSavedPlans();

        EXCHANGE.plans.PlanLoader.initializeActivePlans();
        if (app.functions.isIE8OrLower()) {
            setTimeout(function () {
                ns.applySortingAndFiltering();
            }, 100);
        } else {
            ns.applySortingAndFiltering();
        }
    };

    ns.applySortingAndFiltering = function applySortingAndFiltering() {
        ns.applySortsFromLoad();
        ns.applyFiltersFromLoad();
        EXCHANGE.viewModels.SearchResultsViewModel.loadFromActivePlans();
        app.login.loadAfterLogin();
        if(EXCHANGE.viewModels.SearchResultsViewModel.tab0)
           EXCHANGE.user.UserSession.DoctorFinder.changeProviderLabels(EXCHANGE.viewModels.SearchResultsViewModel.tab0.allPlans());

        ns.refreshPlansUI();
        if(EXCHANGE.user.UserSession.ShowRxPreloadLb() === false) {
            app.coverageCost.getSearchResultsPlanCoverageCosts();
        }
        app.user.loginConflictIntelligentSwap();
    };

    ns.setupViewModels = function setupViewModels() {
        EXCHANGE.viewModels.SearchResultsViewModel = EXCHANGE.models.SearchResultsViewModel();
        EXCHANGE.viewModels.PlanSharedResourceStrings = EXCHANGE.models.PlanSharedResourceStrings();
        EXCHANGE.viewModels.SelectInsurersViewModel = EXCHANGE.models.SelectInsurersViewModel();
        EXCHANGE.viewModels.NarrowMyResultsViewModel = EXCHANGE.models.NarrowMyResultsViewModel();
        EXCHANGE.viewModels.BottomBarViewModel = EXCHANGE.models.BottomBarViewModel();
        EXCHANGE.viewModels.SearchState = EXCHANGE.models.SearchState();
        EXCHANGE.viewModels.ESRDConfirmationViewModel = EXCHANGE.models.ESRDConfirmationViewModel();

        if (!EXCHANGE.exchangeContext.ExchangeContext) {
            EXCHANGE.exchangeContext.ExchangeContext = new EXCHANGE.classes.ExchangeContext();
        }
        EXCHANGE.viewModels.InvalidNdcViewModel = new EXCHANGE.models.InvalidNdcViewModel();
        ko.applyBindings(EXCHANGE.viewModels, $('#searchResultsTemplates').get(0));

        var searchArgs = {
            PlaceholderArg: "1234"
        };

        searchArgs = JSON.stringify(searchArgs);

        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.SearchResult.SearchResultsClientViewModel");

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SearchResult/SearchResultsClientViewModel",
            data: searchArgs,
            dataType: "json",
            success: function (serverPageViewModels) {
                if (!serverPageViewModels.HasValidSearchCriteria) {
                    app.functions.redirectToRelativeUrlFromSiteBase("/find-plans.aspx");
                    return;
                }
                app.exchangeContext.ExchangeContext.tabOrder(serverPageViewModels.TabOrder);
                EXCHANGE.viewModels.SearchResultsViewModel.loadFromJSON(serverPageViewModels.SearchResultsViewModel);
                EXCHANGE.viewModels.PlanSharedResourceStrings.loadFromJSON(serverPageViewModels.PlanSharedResourceStrings);
                EXCHANGE.viewModels.BottomBarViewModel.loadFromJSON(serverPageViewModels.BottomBarViewModel);
                EXCHANGE.viewModels.NarrowMyResultsViewModel.loadFromJSON(serverPageViewModels.NarrowMyResultsViewModel);
                EXCHANGE.viewModels.SelectInsurersViewModel.loadFromJSON(serverPageViewModels.SelectInsurersViewModel);
                EXCHANGE.plans.PlanLoader.loadAllPlansFromJson(serverPageViewModels, ns.afterCartAndPlansLoaded);
                EXCHANGE.plans.PlanLoader.initializeActivePlans();
                EXCHANGE.viewModels.SearchState.loadSearchState(serverPageViewModels.SearchState);
                EXCHANGE.viewModels.SelectInsurersViewModel.updateFromSearchState(EXCHANGE.viewModels.SearchState);
                EXCHANGE.viewModels.NarrowMyResultsViewModel.updateFromSearchState(EXCHANGE.viewModels.SearchState);
                EXCHANGE.viewModels.ESRDConfirmationViewModel.loadFromJSON(serverPageViewModels.ESRDConfirmationViewModel);
                EXCHANGE.placeholder.applyPlaceholder();

                ns.setupProductTabGroup();
                ns.selectFirstTabWithPlans();
                ns.refreshPlansUI();

                ns.selectTabFromQueryString();

                $('div.medtab-content-wrapper').show();
                ns.checkDrugsForIcon();
                $('.page-loading').removeClass('page-loading');

                if (EXCHANGE.user.UserSession.IsLoggedIn() && ( EXCHANGE.user.UserSession.ShowInvalidNdcLb() || EXCHANGE.user.UserSession.ShowRxPreloadLb() )) {
                    $.publish("EXCHANGE.lightbox.helpchoose.open");
                    if (EXCHANGE.user.UserSession.ShowRxPreloadLb()) {
                        ns.sideBarRemoveDrugIcon();
                    }
                }
               
            },
            error: function (data) {
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.SearchResult.SearchResultsClientViewModel");
            }
        });
    };


    ns.selectFirstTabWithPlans = function selectFirstTabWithPlans() {
        $('.container').find('.plantabs').find('li').each(function () {
            var self = $(this);
            if (app.viewModels.SearchResultsViewModel.tab0.planCount() > 0) {
                $('#srtab0').click();
                return false;
            } else if (app.viewModels.SearchResultsViewModel.tab1.planCount() > 0) {
                $('#srtab1').click();
                return false;
            } else if (app.viewModels.SearchResultsViewModel.tab2.planCount() > 0) {
                $('#srtab2').click();
                return false;
            } else {
                $('#srtab0').click();
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

    ns.applySortsFromLoad = function applySortsFromLoad() {
        var medigapSortEngine, prescriptionDrugSortEngine, medicareAdvantageSortEngine;

        if (EXCHANGE.viewModels.SearchState.MedigapSortBy) {
            medigapSortEngine = EXCHANGE.plans.SortRules().loadFromJson(EXCHANGE.viewModels.SearchState.MedigapSortBy);
        }
        if (EXCHANGE.viewModels.SearchState.PrescriptionDrugSortBy) {
            prescriptionDrugSortEngine = EXCHANGE.plans.SortRules().loadFromJson(EXCHANGE.viewModels.SearchState.PrescriptionDrugSortBy);
        }
        if (EXCHANGE.viewModels.SearchState.MedicareAdvantageSortBy) {
            medicareAdvantageSortEngine = EXCHANGE.plans.SortRules().loadFromJson(EXCHANGE.viewModels.SearchState.MedicareAdvantageSortBy);
        }

        EXCHANGE.plans.applySorting(medigapSortEngine, prescriptionDrugSortEngine, medicareAdvantageSortEngine, false);
    };

    ns.applyFiltersFromLoad = function applyFiltersFromLoad() {
        var filterRule;
        ns.updatePlansWithGenericFiltersOnLoad();

        if (EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.MEDIGAP]
                    && EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.MEDIGAP].length > 0) {
            filterRule = new EXCHANGE.plans.FilterRuleObject({
                attributeName: "insurerId",
                useAttributes: false,
                filterGroup: "insurer",
                filterFunction: function (insurer) {
                    return EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.MEDIGAP].indexOf(insurer) != -1;
                }
            });

            EXCHANGE.plans.MedigapFilterEngine.addFilter(filterRule);
        }
        if (EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG]
                    && EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG].length > 0) {
            filterRule = new EXCHANGE.plans.FilterRuleObject({
                attributeName: "insurerId",
                useAttributes: false,
                filterGroup: "insurer",
                filterFunction: function (insurer) {
                    return EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG].indexOf(insurer) != -1;
                }
            });

            EXCHANGE.plans.PrescriptionDrugFilterEngine.addFilter(filterRule);
        }
        if (EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE]
                    && EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE].length > 0) {
            filterRule = new EXCHANGE.plans.FilterRuleObject({
                attributeName: "insurerId",
                useAttributes: false,
                filterGroup: "insurer",
                filterFunction: function (insurer) {
                    return EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE].indexOf(insurer) != -1;
                }
            });

            EXCHANGE.plans.MedicareAdvantageFilterEngine.addFilter(filterRule);
        }

        EXCHANGE.plans.applyFiltering(true);
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

    ns.stopSpeedBumpSpinner = function () {
        if (speedBumpTimeInMilliseconds != 0) {
            $('#search-results-spinner').hide();
        }
    };

    ns.setupProductTabGroup = function setupProductTabGroup() {
        var tabContainers = $('.results').find('div.medtab-content-wrapper > div');
        var tabDescriptions = $('div.medtabs > div.plan-desc');

        $('.container').find('div.medtabs ul.tabNavigation li').click(function () {
            var clickedItem = $(this);
            var ids = clickedItem.children('a').attr('href').match(/#([^\?]+)/)[0].substr(1);

            //tabContainers.hide(); -- move to inside setTimeout for defect 7675
            ns.startSpeedBumpSpinner();

            tabDescriptions.filter("." + ids).addClass('current').siblings().removeClass("current");
            $('.container').find('div.medtabs ul.tabNavigation li').removeClass('current');
            clickedItem.addClass('current');

            setTimeout(function () {

                if ($(this).hasClass("medigap")) {
                    $("p.for-others").hide();
                    $("p.for-medigap").show();
                } else {
                    $("p.for-others").show();
                    $("p.for-medigap").hide();
                }

                tabContainers.hide();
                EXCHANGE.viewModels.SearchResultsViewModel.currentTab(ids);
                tabContainers.filter("#" + ids).show();

                $('#search-results-spinner').hide();
            }, speedBumpTimeInMilliseconds);

            return false;
        }).filter(':first').click();
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
        //$(".total-cost a").smartHover(config2);
        $("div.total-cost").smartHover(config);
    };

    ns.saveSearchState = function saveSearchState() {
        var parameters = JSON.stringify(EXCHANGE.viewModels.SearchState.toJS());
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SearchResult/SaveSearchState",
            data: parameters,
            dataType: "json",
            success: function (dataStr) {

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

    ns.updatePlansWithGenericFiltersOnLoad = function updatePlansWithGenericFilters(saveSearch) {
        var otherFilters;
        ns.updateSelectedDropdowns();
        otherFilters = EXCHANGE.viewModels.NarrowMyResultsViewModel.getResultingFiltersByTab(EXCHANGE.enums.TabEnum.MEDIGAP);
        EXCHANGE.viewModels.NarrowMyResultsViewModel.clearFilterRules(EXCHANGE.plans.MedigapFilterEngine);
        EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.MEDIGAP] = [];
        for (var i = 0; i < otherFilters.length; i++) {
            EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.MEDIGAP].push(
                {
                    FilterName: otherFilters[i].filterGroup,
                    SelectedValue: otherFilters[i].allowedValues[0]
                });
            EXCHANGE.plans.MedigapFilterEngine.addFilter(otherFilters[i]);
        }
        otherFilters = EXCHANGE.viewModels.NarrowMyResultsViewModel.getResultingFiltersByTab(EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG);
        EXCHANGE.viewModels.NarrowMyResultsViewModel.clearFilterRules(EXCHANGE.plans.PrescriptionDrugFilterEngine);
        for (var i = 0; i < otherFilters.length; i++) {
            EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG].push(
                {
                    FilterName: otherFilters[i].filterGroup,
                    SelectedValue: otherFilters[i].allowedValues[0]
                });
            EXCHANGE.plans.PrescriptionDrugFilterEngine.addFilter(otherFilters[i]);
        }
        otherFilters = EXCHANGE.viewModels.NarrowMyResultsViewModel.getResultingFiltersByTab(EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE);
        EXCHANGE.viewModels.NarrowMyResultsViewModel.clearFilterRules(EXCHANGE.plans.MedicareAdvantageFilterEngine);
        for (var i = 0; i < otherFilters.length; i++) {
            EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE].push(
                {
                    FilterName: otherFilters[i].filterGroup,
                    SelectedValue: otherFilters[i].allowedValues[0]
                });
            EXCHANGE.plans.MedicareAdvantageFilterEngine.addFilter(otherFilters[i]);
        }

    };

    ns.updatePlanListWithFilters = function updatePlanListWithFilters(dontSaveSearch) {
        var currentTab = EXCHANGE.viewModels.SearchResultsViewModel.currentTab(), validInsurers, medigapSortEngine, prescriptionDrugSortEngine, medicareAdvantageSortEngine;

        if (_gaq) {

            _gaq.push(['_trackEvent', 'SideBar-Update Plan List', 'Click', 'Update Plan List']);
        }

        $('#' + app.viewModels.SearchResultsViewModel.currentTab()).hide();
        ns.startSpeedBumpSpinner();

        setTimeout(function () {


            ns.updateSelectedDropdowns();
            var otherFilters = EXCHANGE.viewModels.NarrowMyResultsViewModel.getResultingFilters(currentTab);
            var sorts = EXCHANGE.viewModels.NarrowMyResultsViewModel.getResultingSorts(currentTab);
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
            switch (currentTab) {
                case EXCHANGE.enums.TabIdEnum.MEDIGAP:
                    EXCHANGE.plans.MedigapFilterEngine.clearFilterByGroup("insurer");
                    EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.MEDIGAP] = validInsurers;
                    if (filterRule) {
                        EXCHANGE.plans.MedigapFilterEngine.addFilter(filterRule);
                    }
                    EXCHANGE.viewModels.NarrowMyResultsViewModel.clearFilterRules(EXCHANGE.plans.MedigapFilterEngine);
                    EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.MEDIGAP].length = 0;
                    for (var i = 0; i < otherFilters.length; i++) {
                        EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.MEDIGAP].push(
                        {
                            FilterName: otherFilters[i].filterGroup,
                            SelectedValue: otherFilters[i].allowedValues[0]
                        });
                        EXCHANGE.plans.MedigapFilterEngine.addFilter(otherFilters[i]);
                    }

                    medigapSortEngine = sorts;
                    break;
                case EXCHANGE.enums.TabIdEnum.PRESCRIPTIONDRUG:
                    EXCHANGE.plans.PrescriptionDrugFilterEngine.clearFilterByGroup("insurer");
                    EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG] = validInsurers;
                    if (filterRule) {
                        EXCHANGE.plans.PrescriptionDrugFilterEngine.addFilter(filterRule);
                    }
                    EXCHANGE.viewModels.NarrowMyResultsViewModel.clearFilterRules(EXCHANGE.plans.PrescriptionDrugFilterEngine);
                    EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG].length = 0;
                    for (var i = 0; i < otherFilters.length; i++) {
                        EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG].push(
                    {
                        FilterName: otherFilters[i].filterGroup,
                        SelectedValue: otherFilters[i].allowedValues[0]
                    });
                        EXCHANGE.plans.PrescriptionDrugFilterEngine.addFilter(otherFilters[i]);
                    }

                    prescriptionDrugSortEngine = sorts;
                    break;
                case EXCHANGE.enums.TabIdEnum.MEDICAREADVANTAGE:
                    EXCHANGE.plans.MedicareAdvantageFilterEngine.clearFilterByGroup("insurer");
                    EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE] = validInsurers;
                    if (filterRule) {
                        EXCHANGE.plans.MedicareAdvantageFilterEngine.addFilter(filterRule);
                        // ns.pushGA("insurer", filterRule.allowedValues[0]);
                    }
                    EXCHANGE.viewModels.NarrowMyResultsViewModel.clearFilterRules(EXCHANGE.plans.MedicareAdvantageFilterEngine);
                    EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE].length = 0;
                    for (var i = 0; i < otherFilters.length; i++) {
                        EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE].push(
                    {
                        FilterName: otherFilters[i].filterGroup,
                        SelectedValue: otherFilters[i].allowedValues[0]
                    });
                        EXCHANGE.plans.MedicareAdvantageFilterEngine.addFilter(otherFilters[i]);
                        //ns.pushGA(otherFilters[i].filterGroup, otherFilters[i].allowedValues[0]);
                    }
                    //ns.pushGA("Sort",sorts.sortAttributeName);
                    medicareAdvantageSortEngine = sorts;
                    break;
                default:
                    break;
            }


            EXCHANGE.plans.applyFiltering(true);
            if (medigapSortEngine) {
                EXCHANGE.viewModels.SearchState.MedigapSortBy = medigapSortEngine;
            }
            if (prescriptionDrugSortEngine) {
                EXCHANGE.viewModels.SearchState.PrescriptionDrugSortBy = prescriptionDrugSortEngine;
            }
            if (medicareAdvantageSortEngine) {
                EXCHANGE.viewModels.SearchState.MedicareAdvantageSortBy = medicareAdvantageSortEngine;
            }
            EXCHANGE.plans.applySorting(medigapSortEngine, prescriptionDrugSortEngine, medicareAdvantageSortEngine, true);
            //Scroll to top of document because they could have scrolled down prior to filter.
            $(window).scrollTop(0);
            //Reset height in case changing from more plans to fewer plans.  
            $(".sidebar-holder").css({ height: (490) + 'px' });

            ns.stopSpeedBumpSpinner();
            $('#' + app.viewModels.SearchResultsViewModel.currentTab()).show();

            ns.saveSearchState();
            ns.setupSmartHover();
        }, speedBumpTimeInMilliseconds);
    };

    ns.updateSelectedDropdowns = function updateSelectedDropdowns() {
        EXCHANGE.viewModels.NarrowMyResultsViewModel.fixFilterLabels();
        EXCHANGE.viewModels.NarrowMyResultsViewModel.fixSortLabels();
        if (app.user && app.user.UserSession && app.user.UserSession.UserDrugs && app.user.UserSession.UserDrugs.drugs().length == 0) {
            var maSortList = EXCHANGE.viewModels.NarrowMyResultsViewModel.sortByOptionsLists()[0]();
            var pdpSortList = EXCHANGE.viewModels.NarrowMyResultsViewModel.sortByOptionsLists()[2]();
            var maIndex = maSortList.indexOf("Total Cost");
            var pdpIndex = pdpSortList.indexOf("Total Cost");
            if (maIndex != -1) {
                maSortList.splice(maIndex, 1);
            }
            if (pdpIndex != -1) {
                pdpSortList.splice(pdpIndex, 1);
            }
        }
    };

    //    ns.addPlanToCart = function addPlanToCart(add) {
    //        if (add) {
    //            $('.cartblock').addClass('incart');
    //        }
    //    };


    ns.goToCart = function goToCart() {
        if (EXCHANGE.viewModels.ShoppingCartViewModel.plansInCart() === 0) {
            return false;
        }
    };

    ns.setCurrentTab = function setCurrentTab(tab) {
        if (tab) {
            $('div.medtabs ul.tabNavigation li > a').each(function (index, element) {
                var href = $(element).attr("href");
                if (href.indexOf(tab) !== -1) {
                    $(element).click();
                }
            });
        }
    };

    ns.calculateSRTotalCosts = function calculateSRTotalCosts(costEstimate) {

    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $('.switch-to-drug-tab').live('click', function () {
            ns.setCurrentTab(EXCHANGE.enums.TabIdEnum.PRESCRIPTIONDRUG);
        });

        $('.switch-to-advantage-tab').live('click', function () {
            ns.setCurrentTab(EXCHANGE.enums.TabIdEnum.MEDICAREADVANTAGE);
        });

        $('.gotocart').live('click', ns.goToCart);
        $('#UpdatePlanListButton').live('click', ns.updatePlanListWithFilters);
        $('#CloseInsurerPopup').live('click', ns.closeInsurerPopup);
        $('.searchResultsLearnAboutOptions').live('click', function () {
            javascript: window.location = 'learn-about-options.aspx';
        });
        //Narrow Results
        //$('.filter-btn').live('click', function () {
        //    $(this).toggleClass('open').next('.narrow-filters').slideToggle();
        //});
        //Stick icon on sidebar button when a drug is added
        $('#add-drug-to-profile-button').live('click', function () {
            ns.sideBarAddDrugIcon();
        });
        $('#decision-support-med-remove').live('click', function () {
            if (EXCHANGE.user.UserSession.UserDrugs.drugs().length == 1) {
                ns.sideBarRemoveDrugIcon();
            }
        });
        $('#helpMeChooseOkayButton').live('click', function () {
            if (EXCHANGE.user.UserSession.UserDrugs.drugs().length === 0) {
                ns.sideBarRemoveDrugIcon();
            }
        });
        
        $('#clear-all-filters').live('click', function () {
            $.each(app.viewModels.NarrowMyResultsViewModel.filterOptionsCurrentTab()(), function (index, item) {
                // filterDiv_id
                var defaultValue = item.filter_options()[0];
                app.functions.setDropdownSelectedOption(item.filterDiv_id, defaultValue);
                item.filter_tb(defaultValue);
            });

            app.viewModels.SelectInsurersViewModel.selectNone_fnc();
            $('#UpdatePlanListButton').click();
        });

        /* commenting out until the medical questionaire is built
        $('.lightbox-open-medquestions').live('click', function () {
        if (app.user && app.user.UserSession && app.user.UserSession.UserProfile) {
        if (app.user.UserSession.UserProfile.doneMedQuestions()) {
        app.user.UserSession.UserProfile.doneMedQuestions(false);
        } else {
        app.user.UserSession.UserProfile.doneMedQuestions(true);
        }
        }
        return false;
        });
        //end remove
        */
    };

    ns.checkDrugsForIcon = function checkDrugsForIcon() {
        if (EXCHANGE.user.UserSession.UserDrugs.drugs().length == 0) {
            ns.sideBarRemoveDrugIcon();
        } else {
            ns.sideBarAddDrugIcon();
        }
    };

    ns.sideBarAddDrugIcon = function sideBarAddDrugIcon() {
        $('#sidebar-helpchoose-icon').addClass('icon');
    };

    ns.sideBarRemoveDrugIcon = function sideBarRemoveDrugIcon() {
        $('#sidebar-helpchoose-icon').removeClass('icon');
    };

    ns.ChangeTargetDt = function ChangeTargetDt(planid) {
        $('#PreEligMsg-close-button').click();
        $.publish("EXCHANGE.lightbox.closeAll");
        app.viewModels.SearchResultsViewModel.DoTargetDtUpdate(true);
        app.cart.CartAPI.addPlanToCart(planid.InEligiblePlan(), true, true, function () {
            //EXCHANGE.ButtonSpinner.Stop();
            return;
        });
    };


    ns.pushGA = function pushGA(tool, selectedOption) {
        if (_gaq) {

            var virtualPageName = tool + "/" + selectedOption;
            _gaq.push(['_trackPageview', virtualPageName]);
        }
    };
    $(document).on("click", "#addToSavedHelpMeChoose", function () {
        if (EXCHANGE.user.UserSession.IsLoggedIn()) {
            $.publish("EXCHANGE.lightbox.savedplans.open");
        } else {
            $.publish("EXCHANGE.lightbox.login.open");
        }
    });
} (EXCHANGE, this));
