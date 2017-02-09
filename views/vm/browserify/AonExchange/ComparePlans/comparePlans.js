(function (app) {
    //    "use strict";
    var ns = app.namespace('EXCHANGE.comparePlans');
    var haveAccordionsBeenSetup = false;

    ns.initializeComparePlans = function initializeComparePlans() {

        ns.setupViewModels();
        app.functions.setupScrollBindings('.compare-main');
        //app.functions.setupScrollBindings('.acc-container-plan-details');
        app.functions.setupScrollBindings('.acc-container-comp-plans');
        self.headerLbl = ko.observable('');
        ns.setupBindings();


        //To open the compare lightbox for a certain Plan Type, give the link a 'plan-type' attribute corresponding to the one you want.
        var comparePlansLb = new app.lightbox.Lightbox({
            name: 'compareplans',
            divSelector: '#compare-plans-popup',
            openButtonSelector: '#compare-plans-open-button',
            closeButtonSelector: '#compare-plans-close-button',
            beforeOpen: function (clickedItem) {
                //  app.viewModels.ComparePlansViewModel.planList([new app.models.PlanSearchResultsViewModel(), new app.models.PlanSearchResultsViewModel(), new app.models.PlanSearchResultsViewModel()]);

                try {
                    // The following line would fail for the first time because the viewModel 
                    //will be populated after ajax call. But we need to have this here so that 
                    // the LB size can be calculated correctly only after the binding has taken place
                    ko.applyBindings(EXCHANGE.viewModels.ComparePlansViewModel, $('#comparePlansTemplates').get(0));
                }
                catch (e) {
                    //We expect the try block to throw exception. This is an expected behavior. So do nothing

                }

                app.functions.setupScrollBindings('.compare-main');

                if (clickedItem) {
                    var tabIndex = clickedItem.getAttribute('plan-type');
                }
                
                if (tabIndex == null) {
                    if (app.viewModels.AncSearchResultsViewModel) {
                        if (app.viewModels.AncSearchResultsViewModel.isVision()) {
                            tabIndex = app.enums.PlanTypeEnum.VISION;
                        } else if (app.viewModels.AncSearchResultsViewModel.isDental()) {
                            tabIndex = app.enums.PlanTypeEnum.DENTAL;
                        }
                    } 
                    if (tabIndex == null && app.viewModels.SearchResultsViewModel) {
                        tabIndex = app.viewModels.SearchResultsViewModel.currentTabIndex();
                    }
                }

                /*
                //Modified the tabIndex to fix the bug 22714 Saved plans: Compare plans button not refreshed between plan types(compareplans.js)
                if (tabIndex == 2) {
                tabIndex = 1;
                }
                else if (tabIndex == 1) {
                tabIndex = 2;
                }
                //  bug 22714 end here 
                */

                if (tabIndex == app.enums.PlanTypeEnum.MEDICAREADVANTAGE && app.plans.MedicareAdvantageCompareList.plans().length == 0) {
                    return false;
                }
                if (tabIndex == app.enums.PlanTypeEnum.MEDIGAP && app.plans.MedigapCompareList.plans().length == 0) {
                    return false;
                }
                if (tabIndex == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG && app.plans.PrescriptionDrugCompareList.plans().length == 0) {
                    return false;
                }
                if (tabIndex == app.enums.PlanTypeEnum.VISION && app.plans.VisionCompareList.plans().length == 0) {
                    return false;
                }
                if (tabIndex == app.enums.PlanTypeEnum.DENTAL && app.plans.DentalCompareList.plans().length == 0) {
                    return false;
                }
                return true;
            },
            afterOpen: function (clickedItem) {
                var searchResultsViewModel = app.viewModels.SearchResultsViewModel;
                //   app.viewModels.ComparePlansViewModel.planList([new app.models.PlanSearchResultsViewModel(), new app.models.PlanSearchResultsViewModel(), new app.models.PlanSearchResultsViewModel()]);

                var tabIndex;
                if (clickedItem) {
                    tabIndex = clickedItem.getAttribute('plan-type');
                }
                
                if (tabIndex == null) {
                    if (app.viewModels.AncSearchResultsViewModel) {
                        if (app.viewModels.AncSearchResultsViewModel.isVision()) {
                            tabIndex = app.enums.PlanTypeEnum.VISION;
                        } else if (app.viewModels.AncSearchResultsViewModel.isDental()) {
                            tabIndex = app.enums.PlanTypeEnum.DENTAL;
                        }
                    } 
                    if (tabIndex == null && app.viewModels.SearchResultsViewModel) {
                        tabIndex = app.viewModels.SearchResultsViewModel.currentTabIndex();
                    }
                }
                //Modified the tabIndex to fix the bug 22714 Saved plans: Compare plans button not refreshed between plan types(compareplans.js)
                //  bug 22714 end here 
                    
                var tabName = '';
                var tabId = '';
                if (tabIndex == app.enums.PlanTypeEnum.MEDICAREADVANTAGE) {
                    tabName = app.enums.PlanTypeNameEnum.MEDICAREADVANTAGE;
                    tabId = app.enums.TabIdEnum.MEDICAREADVANTAGE;
                } else if (tabIndex == app.enums.PlanTypeEnum.MEDIGAP) {
                    tabName = app.enums.PlanTypeNameEnum.MEDIGAP;
                    tabId = app.enums.TabIdEnum.MEDIGAP;
                } else if (tabIndex == app.enums.PlanTypeEnum.PRESCRIPTIONDRUG) {
                    tabName = app.enums.PlanTypeNameEnum.PRESCRIPTIONDRUG;
                    tabId = app.enums.TabIdEnum.PRESCRIPTIONDRUG;
                } else if (tabIndex == app.enums.PlanTypeEnum.VISION) {
                    tabName = app.enums.PlanTypeNameEnum.VISION;
                    tabId = app.enums.PlanTypeNameEnum.VISION;
                } else if (tabIndex == app.enums.PlanTypeEnum.DENTAL) {
                    tabName = app.enums.PlanTypeNameEnum.DENTAL;
                    tabId = app.enums.PlanTypeNameEnum.DENTAL;
                }
                var args = { PlanType: tabIndex, TabName: tabName };
                args = JSON.stringify(args);
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/API/SharedPopup/ComparePlansClientViewModel",
                    data: args,
                    dataType: "json",
                    success: function (data) {
                        var serverViewModel = data;
                        app.viewModels.ComparePlansViewModel.loadFromJSON(serverViewModel.ComparePlansPopupViewModel);
                        app.viewModels.ComparePlansViewModel.rightSide_lbl = app.viewModels.ComparePlansViewModel.rightSidePlaceholder_lbl().format(app.viewModels.ComparePlansViewModel.numberOfPlans());
                        ko.applyBindings(EXCHANGE.viewModels.ComparePlansViewModel, $('#comparePlansTemplates').get(0));
                        $('.accordionButton').addClass('on');
                        app.viewModels.ComparePlansViewModel.tabId(tabId);
                        ns.setupAccordions();
                        ns.setupUiExtensions();

                        var scrollTo = $(clickedItem).attr('scrolltodiv');
                        if (scrollTo != null) {
                            var scrollOffset = 0;
                            if ($(clickedItem).attr('data-scrolloffset')) {
                                scrollOffset = parseInt($(clickedItem).attr('data-scrolloffset'));
                            }
                            app.functions.scrollToDiv(scrollTo, '.compare-main', scrollOffset);
                        }

                        $.publish("EXCHANGE.lightbox.compareplans.loaded");
                        ns.setupUiExtensions();
                        app.functions.fitLightboxToScreen('#compare-plans-container');
                        var cntnHeight = $('#compare-plans-container').height();
                        var cmpPlanHeight = cntnHeight - 210;
                        $('.acc-container-comp-plans').css("height", cmpPlanHeight + "px");
                        var finalCntnHeight = $('#compare-plans-container .provd-info').height() + $('#compare-plans-container .acc-container-comp-plans').height();
                        if (cntnHeight > finalCntnHeight) {
                            $('#compare-plans-container').height(finalCntnHeight);
                        }
                        $('#compare-plans-container .compare-main.compare3').width($('#compare-plans-container').width());

                    },
                    error: function () {
                        //alert('Data Retrieval Error');                       
                        //$.publish('EXCHANGE.lightbox.closeAll');
                    }

                });
            },
            showWaitPopup: true
        });
    };


    ns.applyCustomInputTce = function applyCustomInputTce() {
        $('.for-cost input').customInput();
        $('.for-cost input').trigger('updateState');
    };

    ns.setupViewModels = function setupViewModels() {
        if (!app.viewModels.ComparePlansViewModel) {
            app.viewModels.ComparePlansViewModel = app.models.ComparePlansViewModel();
        }

    };

    ns.setupBindings = function setupBindings() {
        $(document).on('click', '.remove', function () {
            var index = parseInt($(this).attr('removeindex'), 10);
            var planId = app.viewModels.ComparePlansViewModel.planList()[index].planGuid;

            var removedPlan = app.viewModels.ComparePlansViewModel.planList().splice(index, 1);
            var numberOfPlans = app.viewModels.ComparePlansViewModel.planList().length;
            //app.viewModels.ComparePlansViewModel.planList().push(removedPlan[0]);
            var planVM;
            if (EXCHANGE.viewModels.SearchResultsViewModel) {
                planVM = EXCHANGE.viewModels.SearchResultsViewModel.getPlanByPlanGuid(removedPlan[0].planGuid);
            } else if (EXCHANGE.viewModels.AncSearchResultsViewModel) {
                planVM = EXCHANGE.viewModels.AncSearchResultsViewModel.getPlanByPlanGuid(removedPlan[0].planGuid);
            }
            if (planVM) {
                planVM.explicitRemoveFromCompare();
            }

            if (app.viewModels.RecResultsViewModel != undefined) {
                EXCHANGE.recResults.refreshPlansUI();
            }
            else {
                if (EXCHANGE.searchResults) {
                    EXCHANGE.searchResults.refreshPlansUI();
                } else if (EXCHANGE.ancSearchResults) {
                    EXCHANGE.ancSearchResults.refreshPlansUI();
                }
            }

            if (app.viewModels.ComparePlansViewModel.planList().length < 1) {
                $.publish('EXCHANGE.lightbox.compareplans.back');
            }
            else {

                app.viewModels.ComparePlansViewModel.rightSide_lbl = app.viewModels.ComparePlansViewModel.rightSidePlaceholder_lbl().format(app.viewModels.ComparePlansViewModel.numberOfPlans());

                ko.applyBindings(app.viewModels.ComparePlansViewModel, $('#comparePlansTemplates').get(0));

                ns.setupAccordions();
                ns.setupUiExtensions();

                $.publish("EXCHANGE.lightbox.compareplans.loaded");
                ns.setupUiExtensions();
                app.functions.fitLightboxToScreen('#compare-plans-container');
                var cntnHeight = $('#compare-plans-container').height();
                var cmpPlanHeight = cntnHeight - 210;
                $('.acc-container-comp-plans').css("height", cmpPlanHeight + "px");
                var finalCntnHeight = $('#compare-plans-container .provd-info').height() + $('#compare-plans-container .acc-container-comp-plans').height();
                if (cntnHeight > finalCntnHeight) {
                    $('#compare-plans-container').height(finalCntnHeight);
                }
            }

        });

        $(document).on('click', '#include-pres', function (e) {
            app.viewModels.ComparePlansViewModel.showTcePrescriptionData();

            var label = $('label[for=include-pres]');

            if (app.viewModels.ComparePlansViewModel.includePrescription()) {
                if (!label.hasClass('checked')) {
                    label.addClass('checked');
                }
            }
            else {
                label.removeClass('checked');
            }
        });

        $(document).on('click', '#include-ann-div', function (e) {
            e.preventDefault();
        });
    };

    ns.setupAccordions = function setupAccordions() {
        if (!haveAccordionsBeenSetup) {
            $(document).on("click", ".toggle-highlights", function () {
                if (this.checked)
                    $(".comparemodal").find("tr.was-selected").removeClass("was-selected").addClass("selected");
                else
                    $(".comparemodal").find("tr.selected").removeClass("selected").addClass("was-selected");
            });

            $(document).on('click', '.accordionButton', function () {
                if ($(this).next().is(':hidden') == true) {
                    $(this).addClass('on');
                    $(this).next().slideDown('normal');
                } else {
                    $(this).next().slideUp('normal');
                    $(this).removeClass('on');

                }
            });

            $(document).on('click', '.expand-premium', function () {
                $('.accordionButton').addClass('on');
                $('.accordionContent').slideDown('normal');
            });

            $(document).on('click', '.collapse-premium', function () {
                $('.accordionButton').removeClass('on');
                $('.accordionContent').slideUp('normal');
            });


            $(document).on('mouseover', '.accordionButton', function () {
                $(this).addClass('over');
            }).mouseout(function () {
                $(this).removeClass('over');
            });
            $('.accordionButton').addClass('on');

            $(document).on('hover', 'div.providerinfo', function () {
                $(this).addClass('providerhover');
            }, function () {
                $(this).removeClass("providerhover");
            });

            haveAccordionsBeenSetup = true;
        }

    };

    ns.setupUiExtensions = function setupUiExtensions() {
        function showtip3() {
            $(this).parent().addClass("show-tip ratinghover");
        }

        function hidetip3() {
            $(this).parent().removeClass("show-tip ratinghover");
        }

        function showtip2() {
            $(this).parent().addClass("show-tip");
        }

        function hidetip2() {
            $(this).parent().removeClass("show-tip");
        }

        function showtip() {
            if ($(this).hasClass("rating")) {
                $(this).addClass('ratinghover');
            } else if ($(this).hasClass("covericon")) {
                $(this).addClass('covericonhover');
            } else if ($(this).hasClass("add-to-cart") || $(this).hasClass("addtocompare")) {
                $(this).addClass('show-tip');
            } else if ($(this).hasClass("compare-side")) {
                $(this).addClass('show-tip');
            } else if ($(this).hasClass("moreoption-wrap")) {
                $(this).addClass('show-menu');
            } else if ($(this).hasClass("sec-title")) {
                $(this).addClass('show-tip');
            } else if ($(this).hasClass("plan-detail-attribute")) {
                $(this).addClass('plan-detail-attribute-hover');
                setPlanAttributeHoverPosition($(this));
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
            } else if ($(this).hasClass("compare-side")) {
                $(this).removeClass('show-tip');
            } else if ($(this).hasClass("moreoption-wrap")) {
                $(this).removeClass('show-menu');
            } else if ($(this).hasClass("sec-title")) {
                $(this).removeClass('show-tip');
            } else if ($(this).hasClass("plan-detail-attribute")) {
                $(this).removeClass('plan-detail-attribute-hover');
            } else {
                $(this).removeClass('logosinfo');
            }
        }

        function setPlanAttributeHoverPosition($anchor) {
            var tooltip = $anchor.children('.tooltip');
            var toolTipRect = $(tooltip)[0].getBoundingClientRect();
            var toolTipHeight = toolTipRect.bottom - toolTipRect.top;
            var cellContent = $anchor.children('.cell-cont');
            var cellContentRect = $(cellContent)[0].getBoundingClientRect();
            var attNameCenter = cellContentRect.top + ($(cellContent).height() / 2) - (toolTipHeight / 2);
            $(tooltip).css('top', attNameCenter);
        }

        var config = {
            sensitivity: 4,
            interval: 250,
            over: showtip,
            out: hidetip
        };

        var config2 = {
            sensitivity: 4,
            interval: 250,
            over: showtip2,
            out: hidetip2
        };

        var config3 = {
            sensitivity: 4,
            interval: 250,
            over: showtip3,
            out: hidetip3
        };

        $("div.providerinfo div.providerlogo").smartHover(config);
        $("div.providerinfo div.providerdetail h3").smartHover(config);
        $("div.providerinfo .price").smartHover(config);
        $("div.providerinfo div.rating").smartHover(config);
        $("div.providerinfo div.covericon").smartHover(config);
        $("div.rating").smartHover(config);

        $(".sec-title").smartHover(config);
        $("a.add-to-cart").smartHover(config);
        $(".addtocompare").smartHover(config);
        $(".compare-side").smartHover(config);
        $(".pricebar li a").smartHover(config2);
        $("a.med-covered").smartHover(config2);
        $("a.find-doc").smartHover(config2);
        $(".moreoption-wrap").smartHover(config);
        $(".plan-detail-attribute").smartHover(config);

        $('.accordionButton img').smartHover(config3);
    };

    ns.setupUiExtensionsAfterRender = function setupUiExtensionsAfterRender() {
        function showtip() {
            $(this).parent().addClass("show-tip");
            //For Bug#31847
            // Checking when tooltip is visible for active links
            if ($('.drugRest.show-tip .tooltip').offset() != null && $('.acc-container-comp-plans').offset() != null) {
                var active_tooltip = $('.drugRest.show-tip .tooltip');
                var rightoffset_tooltip = (active_tooltip.offset().left + active_tooltip.outerWidth());
                var active_container = $('.acc-container-comp-plans');
                var rightoffset_container = (active_container.offset().left + active_container.outerWidth());
                //if difference between container's right offset and tooltip's right offset is negative
                if (rightoffset_container - rightoffset_tooltip < 0) {
                    $('.drugRest.show-tip .tooltip').css("left", "-335px");
                    $('.drugRest.show-tip .tooltip').css("width", "420px");
                    $('.drugRest.show-tip .tip-pointer').css("left", "78%");
                }

            }
            // Checking when tooltip is visible for inactive(gray) links
            if ($('.drugRestGray.show-tip .tooltip').offset() != null && $('.acc-container-comp-plans').offset() != null) {
                var active_tooltip = $('.drugRestGray.show-tip .tooltip');
                var rightoffset_tooltip = (active_tooltip.offset().left + active_tooltip.outerWidth());
                var active_container = $('.acc-container-comp-plans');
                var rightoffset_container = (active_container.offset().left + active_container.outerWidth());
                //if difference between container's right offset and tooltip's right offset is negative
                if (rightoffset_container - rightoffset_tooltip < 0) {
                    $('.drugRestGray.show-tip .tooltip').css("left", "-335px");
                    $('.drugRestGray.show-tip .tooltip').css("width", "420px");
                    $('.drugRestGray.show-tip .tip-pointer').css("left", "78%");
                }

            }
        }

        function hidetip() {
            $(this).parent().removeClass("show-tip");
        }

        var config = {
            sensitivity: 4,
            interval: 250,
            over: showtip,
            out: hidetip
        };
        if (app.print === undefined)
            $("p.nothing").smartHover(config);
    };

    ns.calculateTCECompare = function calculateTCECompare(costEstimate) {
        if (costEstimate) {
            var total = 0;
            if (app.viewModels.ComparePlansViewModel.includePrescription()) {
                total += costEstimate.InNetworkCalendarYearTotals.DrugCost;
            }
            if (app.viewModels.ComparePlansViewModel.includeMedical()) {
                total += costEstimate.InNetworkCalendarYearTotals.MedicalCost;
            }
            if (app.viewModels.ComparePlansViewModel.includeAnnual()) {
                total += costEstimate.InNetworkCalendarYearTotals.PremiumCost;
            }
            return app.exchangeContext.ExchangeContext.currencySymbol() + total.toFixed(2) + "<sup>†</sup>";
        }

        return "";
    };

    ns.formatTceDetailsValue = function formatTceDetailsValue(value, includePlus) {
        var amount = value.toFixed(0);

        return (includePlus ? "+" : "") + app.exchangeContext.ExchangeContext.currencySymbol() + amount;
    };



    ns.showNoRestrictionsLabel = function showNoRestrictionsLabel(planList, planIndex, drugIndex) {
        if (null === planList || undefined == planList)
            return false;

        if (planList[planIndex].planDrugVms()[drugIndex].showNotCovered())
            return false;  // don't display No restrictions label if the drug is not covered in this plan

        if (planList[planIndex].planDrugVms()[drugIndex].hasRestrictions()) {
            //$('.drugRest').css("background", "gray");
            return false;  // don't display No restrictions label if the drug has restrictions
        }

        var maxNoOfPlansCompared = 3;

        if (planList.length < maxNoOfPlansCompared)
            maxNoOfPlansCompared = planList.length;


        for (i = 0; i < maxNoOfPlansCompared; i++) {
            // If any of the plans has restrictions, return true
            if (planList[i].planDrugVms()[drugIndex].hasRestrictions())
                return true;

        }


        return false;




    };


})(EXCHANGE);

