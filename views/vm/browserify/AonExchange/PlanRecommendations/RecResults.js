(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.recResults');

    EXCHANGE.namespace('EXCHANGE.viewModels');
    EXCHANGE.namespace('EXCHANGE.exchangeContext');

    ns.CoverageType = {
        MAPD: 0,
        Medical: 1,
        Prescription: 2

    };

    var inlineErrors = new Array();
    var userZip = "";
    var plansInCartCount = 0;
    var speedBumpTimeInMilliseconds = 250; //set to 0 to disable the SR speed bump

    $(document).ready(function () {
        ns.initializePage();

        //bug 144043: kentico 8 temp fix
        $('.rec-header').parent().removeClass('greybtn');

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
        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.RecResult.initializePage");
        app.shoppingCart.initializeLightboxes();
        ns.setupPlugins();
        //        ns.setupSmartHover();
        ns.setupModals();
        ns.selectFindPlansTab();
        ns.wireupJqueryEvents();
        ns.setupBindings();
        $('.filter-btn').addClass('open').next('.narrow-filters').show();
        EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.RecResult.initializePage");
    };


    window.onscroll = function () {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var scrollVisibleHeight = window.innerHeight || document.documentElement.clientHeight;
        var scrollTotalHeight = document.body.offsetHeight;
        //Recompute height
        $(".sidebar-holder").css({ height: (scrollTotalHeight - (490 + 262)) + 'px' });
        $("#sidebar").toggleClass("persistentHelpTop", scrollTop > 490 && scrollTop < scrollTotalHeight - 898).toggleClass("persistentHelpBottom", scrollTop >= scrollTotalHeight - 898);
        $(".persistentHelpTop").attr("style", "top:-70px");
        $(".persistentHelpBottom").removeAttr("style", "top:-70px");
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
                var validInsurers = EXCHANGE.viewModels.RecSelectInsurersViewModel.activeInsurersCurrentTab()();
                if (validInsurers && validInsurers.length === 0) {
                    EXCHANGE.viewModels.RecSelectInsurersViewModel.hasErrors(true);
                    return false;
                }
                EXCHANGE.viewModels.RecSelectInsurersViewModel.saveCurrentInsurers();
                return true;
            },
            afterClose: function () {
                EXCHANGE.viewModels.RecSelectInsurersViewModel.resetActiveInsurers();
                EXCHANGE.viewModels.RecSelectInsurersViewModel.hasErrors(false);
            }
        });

        var selectDoctorsLb = new EXCHANGE.lightbox.Lightbox({
            name: 'selectdoctors',
            divSelector: '#doctors-popup',
            openButtonSelector: '#select-doctors-open-button',
            closeButtonSelector: '#select-doctors-close-button',
            beforeSubmit: function () {
                var validDoctors = EXCHANGE.viewModels.RecSelectDoctorsViewModel.activeDoctorsCurrentTab()();
                if (validDoctors && validDoctors.length === 0) {
                    EXCHANGE.viewModels.RecSelectDoctorsViewModel.hasErrors(true);
                    return false;
                }
                EXCHANGE.viewModels.RecSelectDoctorsViewModel.saveCurrentDoctors();
                return true;
            },
            afterClose: function () {
                EXCHANGE.viewModels.RecSelectDoctorsViewModel.resetActiveDoctors();
                EXCHANGE.viewModels.RecSelectDoctorsViewModel.hasErrors(false);
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
                        EXCHANGE.cart.CartAPI.addPlanToCart(EXCHANGE.viewModels.ESRDConfirmationViewModel.Plan().planGuid, true, true);
                        $.publish("EXCHANGE.lightbox.esrdconfirm.done");
                    } else {

                        $.publish("EXCHANGE.lightbox.esrdconfirmhelp.open");
                    }

                } else {

                    if (EXCHANGE.viewModels.ESRDConfirmationViewModel.HasESRDSituation_radio() == "No") {
                        EXCHANGE.cart.CartAPI.addPlanToCart(EXCHANGE.viewModels.ESRDConfirmationViewModel.Plan().planGuid, true, true);
                        $.publish("EXCHANGE.lightbox.esrdconfirm.done");

                    } else {

                        $.publish("EXCHANGE.lightbox.esrdconfirmhelp.open");
                    }

                }

            }
        });

    };

    ns.afterPlansLoaded = function afterCartAndPlansLoaded() {

        ns.setPlansInCart();
        ns.setComparedPlans();
        ns.setSavedPlans();
        ns.setPhysiciansData();

        //        EXCHANGE.plans.PlanLoader.setComparedPlans();
        //        EXCHANGE.plans.PlanLoader.setSavedPlans();

        //        EXCHANGE.plans.PlanLoader.initializeActivePlans();
        //        if (app.functions.isIE8OrLower()) {
        //            setTimeout(function () {
        //                ns.applySortingAndFiltering();
        //            }, 100);
        //        } else {
        //            ns.applySortingAndFiltering();
        //        }
    };

    ns.setPlansInCart = function setPlansInCart() {
        var planSums = EXCHANGE.user.UserSession.ShoppingCartPlans.plans();
        var allPlans = EXCHANGE.viewModels.SearchResultsViewModel.allPlansInSearchResults();
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
    }

    ns.setSavedPlans = function setSavedPlans() {
        var plansSaved = EXCHANGE.user.UserSession.SavedPlans.plans();
        var allPlans = EXCHANGE.viewModels.SearchResultsViewModel.allPlansInSearchResults();
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
    }

    ns.setPhysiciansData = function setPhysiciansData() {
        var mediPlans = EXCHANGE.viewModels.SearchResultsViewModel.tab0.allPlans();
        var drugPlans = EXCHANGE.viewModels.SearchResultsViewModel.tab1.allPlans();
        var mdPlans = EXCHANGE.viewModels.SearchResultsViewModel.tab2.allPlans();
        if (drugPlans) {
            for (var i = 0; i < drugPlans.length; i++) {
                drugPlans[i].doctorFinder_lbl('');
                drugPlans[i].doctorFinderNoLink_lbl('');
            }
        }
        if (mdPlans) {
            for (var i = 0; i < mdPlans.length; i++) {
                mdPlans[i].doctorFinder_lbl('');
                mdPlans[i].doctorFinderNoLink_lbl('');
            }
        }
        if (mediPlans) {
            EXCHANGE.user.UserSession.DoctorFinder.changeProviderLabels(mediPlans);
        }
        if (EXCHANGE.user.UserSession.SavedPlans.plans() && EXCHANGE.user.UserSession.SavedPlans.plans().length > 0) {
            EXCHANGE.user.UserSession.DoctorFinder.changeProviderLabels(EXCHANGE.user.UserSession.SavedPlans.plans());
        }
    }




    ns.setComparedPlans = function setComparedPlans() {
        var planSums = EXCHANGE.user.UserSession.ComparedPlans.plans();
        var allPlans = EXCHANGE.viewModels.SearchResultsViewModel.allPlansInSearchResults();
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

    ns.applySortingAndFiltering = function applySortingAndFiltering() {
        ns.applySortsFromLoad();
        ns.applyFiltersFromLoad();
        EXCHANGE.viewModels.RecResultsViewModel.loadFromActivePlans();
        app.login.loadAfterLogin();
        ns.refreshPlansUI();

        app.coverageCost.getSearchResultsPlanCoverageCosts();

        app.user.loginConflictIntelligentSwap();
    };

    ns.setupViewModels = function setupViewModels() {
        EXCHANGE.viewModels.UtilisationViewModel = EXCHANGE.models.UtilisationViewModel();
        EXCHANGE.viewModels.SearchResultsViewModel = EXCHANGE.models.SearchResultsViewModel();
        EXCHANGE.viewModels.RecResultsViewModel = EXCHANGE.models.RecResultsViewModel();
        EXCHANGE.viewModels.PlanSharedResourceStrings = EXCHANGE.models.PlanSharedResourceStrings();
        EXCHANGE.viewModels.RecSelectInsurersViewModel = EXCHANGE.models.RecSelectInsurersViewModel();
        EXCHANGE.viewModels.RecSelectDoctorsViewModel = EXCHANGE.models.RecSelectDoctorsViewModel();
        EXCHANGE.viewModels.NarrowMyRecResultsViewModel = EXCHANGE.models.NarrowMyRecResultsViewModel();
        EXCHANGE.viewModels.BottomBarViewModel = EXCHANGE.models.BottomBarViewModel();
        EXCHANGE.viewModels.SearchState = EXCHANGE.models.SearchState();
        EXCHANGE.viewModels.ESRDConfirmationViewModel = EXCHANGE.models.ESRDConfirmationViewModel();

        if (!EXCHANGE.exchangeContext.ExchangeContext) {
            EXCHANGE.exchangeContext.ExchangeContext = new EXCHANGE.classes.ExchangeContext();
        }
        EXCHANGE.viewModels.InvalidNdcViewModel = new EXCHANGE.models.InvalidNdcViewModel();
        ko.applyBindings(EXCHANGE.viewModels, $('#searchResultsTemplates').get(0));

        var CoverageAnswer = "0";
        if ($('#medicPrescrip').attr('checked') == "checked") {
            CoverageAnswer = ns.CoverageType.MAPD;
        }
        var recArgs = {
            recommendedCoverageAnswer: CoverageAnswer
        };
        var currentTab = EXCHANGE.viewModels.SearchResultsViewModel.currentTab();
        recArgs = JSON.stringify(recArgs);

        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.RecResult.RecResultsClientViewModel");

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Recommendations/GetRecommendations",
            dataType: "json",
            success: function (serverPageViewModels) {
                if (!serverPageViewModels.HasValidSearchCriteria) {
                    app.functions.redirectToRelativeUrlFromSiteBase("/integrated-guidance.aspx");
                    return;
                }
                app.exchangeContext.ExchangeContext.tabOrder(serverPageViewModels.TabOrder);
                EXCHANGE.viewModels.PlanSharedResourceStrings.loadFromJSON(serverPageViewModels.PlanSharedResourceStrings);

                EXCHANGE.viewModels.SearchResultsViewModel.loadFromJSON(serverPageViewModels.SearchResultsViewModel, serverPageViewModels.sPlanLists);
                EXCHANGE.viewModels.RecResultsViewModel.loadFromJSON(serverPageViewModels.RecResultsViewModel, serverPageViewModels.PlanLists, serverPageViewModels.TargetDateAndLocationViewModel);
                EXCHANGE.viewModels.BottomBarViewModel.loadFromJSON(serverPageViewModels.BottomBarViewModel);
                EXCHANGE.viewModels.NarrowMyRecResultsViewModel.loadFromJSON(serverPageViewModels.NarrowMyResultsViewModel);
                EXCHANGE.viewModels.RecSelectInsurersViewModel.loadFromJSON(serverPageViewModels.SelectInsurersViewModel);
                EXCHANGE.viewModels.RecSelectDoctorsViewModel.loadFromJSON(serverPageViewModels.SelectDoctorsViewModel);

                //                EXCHANGE.plans.PlanLoader.loadAllPlansFromJson(serverPageViewModels, ns.afterCartAndPlansLoaded);
                //                EXCHANGE.plans.PlanLoader.initializeActivePlans();
                EXCHANGE.viewModels.SearchState.loadSearchState(serverPageViewModels.SearchState);
                EXCHANGE.viewModels.RecSelectInsurersViewModel.updateFromSearchState(EXCHANGE.viewModels.SearchState);
                EXCHANGE.viewModels.RecSelectDoctorsViewModel.updateFromSearchState(EXCHANGE.viewModels.SearchState);
                EXCHANGE.viewModels.NarrowMyRecResultsViewModel.updateFromSearchState(EXCHANGE.viewModels.SearchState);
                EXCHANGE.viewModels.ESRDConfirmationViewModel.loadFromJSON(serverPageViewModels.ESRDConfirmationViewModel);
                EXCHANGE.placeholder.applyPlaceholder();
                ns.afterPlansLoaded();
                ns.setupProductTabGroup();
                ns.selectFirstTabWithPlans();
                ns.refreshPlansUI();

                ns.selectTabFromQueryString();

                $('div.medtab-content-wrapper').show();
                ns.checkDrugsForIcon();
                $('.page-loading').removeClass('page-loading');
                if (currentTab == EXCHANGE.enums.TabIdEnum.MEDIGAP) {
                    ns.ShowHideAARP();
                }
                if (EXCHANGE.user.UserSession.IsLoggedIn() && (EXCHANGE.user.UserSession.ShowInvalidNdcLb() || EXCHANGE.user.UserSession.ShowRxPreloadLb())) {
                    $.publish("EXCHANGE.lightbox.helpchoose.open");
                    ns.sideBarRemoveDrugIcon();
                }
                EXCHANGE.WaitPopup.Close();

            },
            error: function (data) {
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.RecResult.RecResultsClientViewModel");
            }
        });
    };


    ns.selectFirstTabWithPlans = function selectFirstTabWithPlans() {
        $('.container').find('.plantabs').find('li').each(function () {
            var self = $(this);
            if (app.viewModels.RecResultsViewModel.recommendedTab() == "drugs") {
                $('#srtab1').removeClass('tab-disable');
                $('#srtab1').addClass('current')
                $('#srtab1').click();
                return false;
            } if (app.viewModels.RecResultsViewModel.recommendedTab() == "advantage") {
                $('#srtab0').removeClass('tab-disable');
                $('#srtab0').addClass('current')
                $('#srtab0').click();
                return false;
            } if (app.viewModels.RecResultsViewModel.recommendedTab() == "medigap") {
                $('#srtab2').removeClass('tab-disable');
                $('#srtab2').removeClass('current')
                $('#srtab2').click();
                return false;
            } else {
                $('#srtab0').removeClass('tab-disable');
                $('#srtab0').addClass('current')

                $('#srtab0').click();
            }

        });
    };

    ns.refreshPlansUI = function refreshPlansUI() {
        setTimeout(function () {
            ns.setupPlugins();
            //            ns.setupSmartHover();
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
        EXCHANGE.plans.applySorting(medigapSortEngine, prescriptionDrugSortEngine, medicareAdvantageSortEngine, true);
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
        //         if (EXCHANGE.viewModels.SearchState.SelectedDoctorsForTabs[EXCHANGE.enums.TabEnum.MEDIGAP]
        //                    && EXCHANGE.viewModels.SearchState.SelectedDoctorsForTabs[EXCHANGE.enums.TabEnum.MEDIGAP].length > 0) {
        //            filterRule = new EXCHANGE.plans.FilterRuleObject({
        //                attributeName: "doctorsId",
        //                useAttributes: false,
        //                filterGroup: "doctor",
        //                filterFunction: function (doctor) {
        //                    return EXCHANGE.viewModels.SearchState.SelectedDoctorsForTabs[EXCHANGE.enums.TabEnum.MEDIGAP].indexOf(doctor) != -1;
        //                }
        //            });

        //            //EXCHANGE.plans.MedigapFilterEngine.addFilter(filterRule);
        //        }
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
        //doctor
        //        if (EXCHANGE.viewModels.SearchState.SelectedDoctorsForTabs[EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG]
        //                    && EXCHANGE.viewModels.SearchState.SelectedDoctorsForTabs[EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG].length > 0) {
        //            filterRule = new EXCHANGE.plans.FilterRuleObject({
        //                attributeName: "doctorId",
        //                useAttributes: false,
        //                filterGroup: "doctor",
        //                filterFunction: function (doctor) {
        //                    return EXCHANGE.viewModels.SearchState.SelectedDoctorsForTabs[EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG].indexOf(doctor) != -1;
        //                }
        //            });

        //            //EXCHANGE.plans.PrescriptionDrugFilterEngine.addFilter(filterRule);
        //        }

        //doctor end

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
        //doctr start
        if (EXCHANGE.viewModels.SearchState.SelectedDoctorsForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE]
                    && EXCHANGE.viewModels.SearchState.SelectedDoctorsForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE].length > 0) {
            filterRule = new EXCHANGE.plans.FilterRuleObject({
                attributeName: "doctorId",
                useAttributes: false,
                filterGroup: "doctor",
                filterFunction: function (doctor) {
                    return EXCHANGE.viewModels.SearchState.SelectedDoctorsForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE].indexOf(doctor) != -1;
                }
            });

        }
        //doctor end

        EXCHANGE.plans.applyRecFiltering(true);
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
                EXCHANGE.viewModels.RecResultsViewModel.currentTab(ids);
                tabContainers.filter("#" + ids).show();

                $('#search-results-spinner').hide();
                //ns.setDollarsAndCents();
                ns.setupSmartHover();

            }, speedBumpTimeInMilliseconds);

            return false;
        }).filter(':first').click();
    };

    ns.setDollarsAndCents = function setDollarsAndCents() {
        $('.price').number(true, 2);
        $('.rec-prices').number(true, 2);
    };

    ns.showtip = function showtip() {
        if ($(this).hasClass("rating")) {
            $(this).addClass('ratinghover');
        } else if ($(this).hasClass("tab-combined")) {
            $(this).addClass('toprate');
        } else if ($(this).hasClass("covericon")) {
            // $(this).addClass('covericonhover');
        } else if ($(this).hasClass("add-to-cart") || $(this).hasClass("addtocompare")) {
            $(this).addClass('show-tip');
        } else if ($(this).hasClass("show-details")) {
            $(this).addClass('show-tip');
        } else if ($(this).hasClass("compare-side")) {
            $(this).addClass('show-tip');
        } else if ($(this).hasClass("med-covered")) {
            //   $(this).addClass('show-tip');
        } else if ($(this).hasClass("total-cost")) {
            $(this).addClass('show-tip');
        } else if ($(this).hasClass("moreoption-wrap")) {
            $(this).addClass('show-menu');
        } else if ($(this).hasClass("rec-tooltip")) {
            $(this).addClass('show-tip');
        } else if ($(this).hasClass("total-price")) {
            $(this).addClass('show-tip');
        } else {
            $(this).addClass('logosinfo');
        }
    };

    ns.hidetip = function hidetip() {
        if ($(this).hasClass("rating")) {
            $(this).removeClass('ratinghover');
        } else if ($(this).hasClass("tab-combined")) {
            $(this).removeClass('toprate');
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
        } else if ($(this).hasClass("total-price")) {
            $(this).removeClass('show-tip');
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
        $("#PlanLetterDiv #dk_container_PlanLetter .dk_toggle").attr("style", "width:210px !important");
        $("#FinancialRiskForMediGapDiv #dk_container_FinancialRiskForMediGap .dk_toggle").attr("style", "width:210px !important");
        $("#TravelFilterForMediGapDiv #dk_container_TravelFilterForMediGap .dk_toggle").attr("style", "width:210px !important");
        $("#NetworkDiv #dk_container_Network .dk_toggle").attr("style", "width:210px !important");
        $("#FinancialRiskDiv #dk_container_FinancialRisk .dk_toggle").attr("style", "width:210px !important");
        $("#TravelFilterForMedicareDiv #dk_container_TravelFilterForMedicare .dk_toggle").attr("style", "width:210px !important");
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

        $("li.tab-combined").hover(function () {
            $(this).addClass('toprate');
        }, function () {
            $(this).removeClass("toprate");
        });

        $("div.providerinfo div.providerlogo").smartHover(config);
        $("div.providerinfo div.providerdetail h3").smartHover(config);
        $("div.providerinfo .price").smartHover(config);
        $("div.providerinfo div.rating").smartHover(config);
        //$("div.providerinfo a.covericon").smartHover(config);
        $("li.tab-combined").smartHover(config);

        $("a.add-to-cart").smartHover(config);
        $(".addtocompare").smartHover(config);
        $(".compare-side").smartHover(config);
        $(".pricebar li a").smartHover(config2);
        $("a.med-covered").smartHover(config2);
        //$("a.find-doc").smartHover(config2);
        $("a#doctorfinder").smartHover(config2);
        $("a#prescriptiondrug").smartHover(config2);
        $(".moreoption-wrap").smartHover(config);
        //$(".total-cost a").smartHover(config2);
        $("div.total-cost").smartHover(config);
        $("span.rec-tooltip").smartHover(config2);
        $("div.total-price").smartHover(config);
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
        var validInsurers = EXCHANGE.viewModels.RecSelectInsurersViewModel.activeInsurersCurrentTab()();
        var allInsurers = EXCHANGE.viewModels.RecSelectInsurersViewModel.allInsurersCurrentTab()();
        if (validInsurers && validInsurers.length === 0 && allInsurers && allInsurers.length !== 0) {
            EXCHANGE.viewModels.RecSelectInsurersViewModel.hasErrors(true);
            return false;
        } else {
            $('#selectInsurersCloseButton').click();
        }
    };

    ns.closeDoctorPopup = function closeDoctorPopup() {
        var validDoctors = EXCHANGE.viewModels.RecSelectDoctorsViewModel.activeDoctorsCurrentTab()();
        var allDoctors = EXCHANGE.viewModels.RecSelectDoctorsViewModel.allDoctorsCurrentTab()();
        if (validDoctors && validDoctors.length === 0 && allDoctors && allDoctors.length !== 0) {
            EXCHANGE.viewModels.RecSelectDoctorsViewModel.hasErrors(true);
            return false;
        } else {
            $('#selectDoctorsCloseButton').click();
        }
    };
    ns.ShowHideAARP = function ShowHideAARP() {
        var validInsurers = EXCHANGE.viewModels.RecSelectInsurersViewModel.activeInsurersCurrentTab()();
        if (validInsurers.length > 0) {
            if (validInsurers.length == EXCHANGE.viewModels.RecSelectInsurersViewModel.allInsurersCurrentTab()().length) {
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
    ns.updatePlansWithGenericFiltersOnLoad = function updatePlansWithGenericFilters(saveSearch) {
        var otherFilters;
        ns.updateSelectedDropdowns();
        otherFilters = EXCHANGE.viewModels.NarrowMyRecResultsViewModel.getResultingFiltersByTab(EXCHANGE.enums.TabEnum.MEDIGAP);
        EXCHANGE.viewModels.NarrowMyRecResultsViewModel.clearFilterRules(EXCHANGE.plans.MedigapFilterEngine);
        EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.MEDIGAP] = [];
        for (var i = 0; i < otherFilters.length; i++) {
            EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.MEDIGAP].push(
                {
                    FilterName: otherFilters[i].filterGroup,
                    SelectedValue: otherFilters[i].allowedValues[0]
                });
            EXCHANGE.plans.MedigapFilterEngine.addFilter(otherFilters[i]);
        }
        otherFilters = EXCHANGE.viewModels.NarrowMyRecResultsViewModel.getResultingFiltersByTab(EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG);
        EXCHANGE.viewModels.NarrowMyRecResultsViewModel.clearFilterRules(EXCHANGE.plans.PrescriptionDrugFilterEngine);
        for (var i = 0; i < otherFilters.length; i++) {
            EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG].push(
                {
                    FilterName: otherFilters[i].filterGroup,
                    SelectedValue: otherFilters[i].allowedValues[0]
                });
            EXCHANGE.plans.PrescriptionDrugFilterEngine.addFilter(otherFilters[i]);
        }
        otherFilters = EXCHANGE.viewModels.NarrowMyRecResultsViewModel.getResultingFiltersByTab(EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE);
        EXCHANGE.viewModels.NarrowMyRecResultsViewModel.clearFilterRules(EXCHANGE.plans.MedicareAdvantageFilterEngine);
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
        var currentTab = EXCHANGE.viewModels.RecResultsViewModel.currentTab(), validInsurers, validDoctors, medigapSortEngine, prescriptionDrugSortEngine, medicareAdvantageSortEngine;

        if (_gaq) {

            _gaq.push(['_trackEvent', 'SideBar-Update Plan List', 'Click', 'Update Rec List']);
        }

        $('#' + app.viewModels.RecResultsViewModel.currentTab()).hide();
        ns.startSpeedBumpSpinner();

        setTimeout(function () {


            ns.updateSelectedDropdowns();
            var otherFilters = EXCHANGE.viewModels.NarrowMyRecResultsViewModel.getResultingFilters(currentTab);
            var sorts = EXCHANGE.viewModels.NarrowMyRecResultsViewModel.getResultingSorts(currentTab);
            validInsurers = EXCHANGE.viewModels.RecSelectInsurersViewModel.activeInsurersCurrentTab()();
            if (app.viewModels.RecResultsViewModel.currentTabIndex() == app.enums.TabEnum.MEDICAREADVANTAGE) {
                validDoctors = EXCHANGE.viewModels.RecSelectDoctorsViewModel.activeDoctorsCurrentTab()();

                if (validDoctors.length > 0) {
                    var doc_filterRule = new EXCHANGE.plans.FilterRuleObject({
                        attributeName: "PPCID",
                        useAttributes: false,
                        filterGroup: "doctor",
                        filterFunction: function (PPCID) {
                            if (PPCID != null) {
                                var PlanProviderLabelsList = EXCHANGE.user.UserSession.DoctorFinder.planProviderLabels();
                                var selectedDcotorsListIDs = validDoctors;
                                var PPCIDRelatedlst = new Array();

                                for (var j = 0; j < PlanProviderLabelsList.length; j++) {
                                    if (PlanProviderLabelsList[j].PPCID === PPCID) {
                                        $.each(PlanProviderLabelsList[j].InDoctorsList, function (index, item) {
                                            PPCIDRelatedlst.push(item);
                                        });
                                    }
                                }

                                for (var k = 0; k < selectedDcotorsListIDs.length; k++) {
                                    for (j = 0; j < PPCIDRelatedlst.length; j++) {
                                        if (selectedDcotorsListIDs[k] == PPCIDRelatedlst[j]) {
                                            return true;
                                        }
                                    }
                                }
                            }
                            return false;
                        }
                    });
                }
            }
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
                    ns.ShowHideAARP();
                    EXCHANGE.plans.MedigapFilterEngine.clearFilterByGroup("insurer");
                    EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.MEDIGAP] = validInsurers;
                    if (filterRule) {
                        EXCHANGE.plans.MedigapFilterEngine.addFilter(filterRule);
                    }

                    EXCHANGE.viewModels.NarrowMyRecResultsViewModel.clearFilterRules(EXCHANGE.plans.MedigapFilterEngine);
                    EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.MEDIGAP].length = 0;
                    for (var i = 0; i < otherFilters.length; i++) {
                        EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.MEDIGAP].push(
                        {
                            FilterName: otherFilters[i].filterGroup,
                            SelectedValue: otherFilters[i].allowedValues[0]
                        });
                        EXCHANGE.plans.MedigapFilterEngine.addFilter(otherFilters[i]);
                    }

                    EXCHANGE.viewModels.SearchResultsViewModel.tab2.showAll(true);

                    medigapSortEngine = sorts;
                    break;
                case EXCHANGE.enums.TabIdEnum.PRESCRIPTIONDRUG:
                    EXCHANGE.plans.PrescriptionDrugFilterEngine.clearFilterByGroup("insurer");
                    EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG] = validInsurers;
                    if (filterRule) {
                        EXCHANGE.plans.PrescriptionDrugFilterEngine.addFilter(filterRule);
                    }

                    EXCHANGE.viewModels.NarrowMyRecResultsViewModel.clearFilterRules(EXCHANGE.plans.PrescriptionDrugFilterEngine);
                    EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG].length = 0;
                    for (var i = 0; i < otherFilters.length; i++) {
                        EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.PRESCRIPTIONDRUG].push(
                    {
                        FilterName: otherFilters[i].filterGroup,
                        SelectedValue: otherFilters[i].allowedValues[0]
                    });
                        EXCHANGE.plans.PrescriptionDrugFilterEngine.addFilter(otherFilters[i]);
                    }

                    EXCHANGE.viewModels.SearchResultsViewModel.tab1.showAll(true);

                    prescriptionDrugSortEngine = sorts;
                    break;
                case EXCHANGE.enums.TabIdEnum.MEDICAREADVANTAGE:
                    EXCHANGE.plans.MedicareAdvantageFilterEngine.clearFilterByGroup("insurer");
                    EXCHANGE.plans.MedicareAdvantageFilterEngine.clearFilterByGroup("doctor");
                    EXCHANGE.viewModels.SearchState.SelectedInsurersForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE] = validInsurers;
                    EXCHANGE.viewModels.SearchState.SelectedDoctorsForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE] = validDoctors;
                    if (filterRule) {
                        EXCHANGE.plans.MedicareAdvantageFilterEngine.addFilter(filterRule);
                        ns.pushGA("Rec insurer", filterRule.allowedValues[0]);
                    }
                    if (doc_filterRule) {
                        EXCHANGE.plans.MedicareAdvantageFilterEngine.addFilter(doc_filterRule);
                        ns.pushGA("Rec doctor", doc_filterRule.allowedValues[0]);
                    }
                    EXCHANGE.viewModels.NarrowMyRecResultsViewModel.clearFilterRules(EXCHANGE.plans.MedicareAdvantageFilterEngine);
                    EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE].length = 0;
                    for (var i = 0; i < otherFilters.length; i++) {
                        EXCHANGE.viewModels.SearchState.FiltersForTabs[EXCHANGE.enums.TabEnum.MEDICAREADVANTAGE].push(
                    {
                        FilterName: otherFilters[i].filterGroup,
                        SelectedValue: otherFilters[i].allowedValues[0]
                    });
                        EXCHANGE.plans.MedicareAdvantageFilterEngine.addFilter(otherFilters[i]);
                        ns.pushGA(otherFilters[i].filterGroup, otherFilters[i].allowedValues[0]);
                    }

                    EXCHANGE.viewModels.SearchResultsViewModel.tab2.showAll(true);
                    if (sorts != null)
                        ns.pushGA("Rec Sort", sorts.sortAttributeName);
                    medicareAdvantageSortEngine = sorts;
                    break;
                default:
                    break;
            }


            EXCHANGE.plans.applyRecFiltering(true);
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

            //// Sort MAPD and MA plans separately
            if (medicareAdvantageSortEngine) {
                $("#hdnRecMATabShown").val(false);
                $("#hdnRecMAPDTabShown").val(false);
                var plans = EXCHANGE.viewModels.SearchResultsViewModel.tab0.allPlans();
                var mapdPlans = [];
                var maPlans = [];
                var totalPlans = [];

                for (var i = 0; i < plans.length; i++) {
                    if (plans[i].RecommendationInfo.PlanType == 3) {
                        mapdPlans.push(plans[i]);
                    }
                    else {
                        maPlans.push(plans[i]);
                    }
                }
                totalPlans = $.merge(mapdPlans, maPlans);
                EXCHANGE.viewModels.SearchResultsViewModel.tab0.allPlans(totalPlans);
            }

            //Scroll to top of document because they could have scrolled down prior to filter.
            $(window).scrollTop(0);
            //Reset height in case changing from more plans to fewer plans.  
            $(".sidebar-holder").css({ height: (490) + 'px' });

            ns.stopSpeedBumpSpinner();
            $('#' + app.viewModels.RecResultsViewModel.currentTab()).show();

            ns.saveSearchState();
            ns.setupSmartHover();
        }, speedBumpTimeInMilliseconds);
    };

    ns.updateSelectedDropdowns = function updateSelectedDropdowns() {
        EXCHANGE.viewModels.NarrowMyRecResultsViewModel.fixFilterLabels();
        EXCHANGE.viewModels.NarrowMyRecResultsViewModel.fixSortLabels();
        if (app.user && app.user.UserSession && app.user.UserSession.UserDrugs && app.user.UserSession.UserDrugs.drugs().length == 0) {
            var maSortList = EXCHANGE.viewModels.NarrowMyRecResultsViewModel.sortByOptionsLists()[0]();
            var pdpSortList = EXCHANGE.viewModels.NarrowMyRecResultsViewModel.sortByOptionsLists()[2]();
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
        $('#CloseDoctorPopup').live('click', ns.closeDoctorPopup);
        //        $('.searchResultsLearnAboutOptions').live('click', function () {
        //            javascript: window.location = 'learn-about-options.aspx';
        //        });
        //        //Narrow Results
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

            var currentTab = EXCHANGE.viewModels.RecResultsViewModel.currentTab();
            switch (currentTab) {
                case EXCHANGE.enums.TabIdEnum.MEDIGAP:
                    app.functions.setDropdownSelectedOption('#PlanLetterDiv', EXCHANGE.viewModels.NarrowMyRecResultsViewModel.filterOptionsCurrentTab()()[0].filter_options()[0]);
                    app.functions.setDropdownSelectedOption('#FinancialRiskForMediGapDiv', EXCHANGE.viewModels.NarrowMyRecResultsViewModel.filterOptionsCurrentTab()()[1].filter_options()[0]);
                    app.functions.setDropdownSelectedOption('#TravelFilterForMediGapDiv', EXCHANGE.viewModels.NarrowMyRecResultsViewModel.filterOptionsCurrentTab()()[2].filter_options()[0]);
                    break;
                case EXCHANGE.enums.TabIdEnum.PRESCRIPTIONDRUG:
                    break;
                case EXCHANGE.enums.TabIdEnum.MEDICAREADVANTAGE:
                    app.functions.setDropdownSelectedOption('#NetworkDiv', EXCHANGE.viewModels.NarrowMyRecResultsViewModel.filterOptionsCurrentTab()()[0].filter_options()[0]);
                    app.functions.setDropdownSelectedOption('#FinancialRiskDiv', EXCHANGE.viewModels.NarrowMyRecResultsViewModel.filterOptionsCurrentTab()()[1].filter_options()[0]);
                    app.functions.setDropdownSelectedOption('#TravelFilterForMedicareDiv', EXCHANGE.viewModels.NarrowMyRecResultsViewModel.filterOptionsCurrentTab()()[2].filter_options()[0]);
                    app.viewModels.RecSelectDoctorsViewModel.selectNone_fnc();
                    break;
                default:
                    break;
            }

            /*
            $.each(EXCHANGE.viewModels.NarrowMyRecResultsViewModel.filterOptionsCurrentTab()(), function (index, item) {
                // filterDiv_id
                var defaultValue = item.filter_options()[0];
                app.functions.setDropdownSelectedOption(item.filterDiv_id, defaultValue);
                item.filter_tb(defaultValue);
            });
            */
            app.viewModels.RecSelectInsurersViewModel.selectNone_fnc();
            app.functions.setDropdownSelectedOption('#sortBy', EXCHANGE.viewModels.NarrowMyRecResultsViewModel.sortBySortOptions_lbl());
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
}(EXCHANGE, this));
