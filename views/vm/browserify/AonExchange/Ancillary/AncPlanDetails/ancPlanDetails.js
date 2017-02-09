(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.ancPlanDetails');

    ns.lastPlanGuid = '';
    ns.lastEffDate = '';

    ns.oopGraph = null;

    ns.initializePlanDetails = function initializePlanDetails() {

        ns.setupViewModels();
        app.functions.setupScrollBindings('.compare-main');
        app.functions.setupScrollBindings('.acc-container-plan-details');
        app.functions.setupScrollBindings('.acc-container-comp-plans');
        app.functions.setupScrollBindings('.planDetailsAndContact');
        ns.subscribeToObservables();
        ns.setupJqueryBindings();
        var preEligLB = new EXCHANGE.lightbox.Lightbox({
            name: 'PreEligMsg',
            divSelector: '#PreEligMsg-popup',
            openButtonSelector: '#PreEligMsg-open-button',
            closeButtonSelector: '#PreEligMsg-close-button'

        });
        var planDetailsLb = new EXCHANGE.lightbox.Lightbox({
            name: 'ancplandetails',
            divSelector: '#anc-plan-details-popup',
            openButtonSelector: '#anc-plan-details-open-button',
            closeButtonSelector: '#anc-plan-details-close-button',
            beforeOpen: function () {

                app.functions.setupScrollBindings('.compare-main');
                ns.subscribeToObservables();
                ns.setupJqueryBindings();
                try {
                    // The following line would fail for the first time because the viewModel 
                    //will be populated after ajax call. But we need to have this here so that 
                    // the LB size can be calculated correctly only after the binding has taken place
                    ko.applyBindings(EXCHANGE.viewModels.AncPlanDetailsViewModel, $('#anc-planDetailsTemplates').get(0));
                }
                catch (e) {
                    //We expect the try block to throw exception. This is an expected behavior. So do nothing
                }

                return true;
            },
            afterOpen: function (item) {
                var planGuid = $(item).attr('id');

                if (planGuid != null) {
                    ns.lastPlanGuid = planGuid;
                } else {
                    planGuid = ns.lastPlanGuid;
                }

                var effDate = $(item).attr('effdate');

                if (effDate != null) {
                    ns.lastEffDate = effDate;
                } else {
                    effDate = ns.lastEffDate;
                }

                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/API/SharedPopup/PlanDetailsClientViewModel",
                    data: JSON.stringify({ planGuid: planGuid, effectiveDate: effDate }),
                    dataType: "json",
                    success: function (data) {
                        var serverViewModel = data;
                        app.viewModels.AncPlanDetailsViewModel = EXCHANGE.models.AncPlanDetailsViewModel();
                        app.viewModels.AncPlanDetailsViewModel.loadPlanDetails(ns.lastPlanGuid, serverViewModel.PlanDetailsPopupViewModel);
                        ko.applyBindings(EXCHANGE.viewModels.AncPlanDetailsViewModel, $('#anc-planDetailsTemplates').get(0));
                        ns.setupPharmacyRadioButtons();
                        ns.setupUiExtensions();
                        ns.changeDrugRestDisplay();
                        app.coverageCost.getPlanDetailsCoverageCosts(serverViewModel.PlanDetailsPopupViewModel);
                        //$('.for-medications .switchblock input').customInput();

                        var scrollTo = $(item).attr('scrolltodiv');
                        if (scrollTo != null) {
                            var scrollOffset = 0;
                            if ($(item).attr('data-scrolloffset')) {
                                scrollOffset = parseInt($(item).attr('data-scrolloffset'));
                            }
                            app.functions.scrollToDiv(scrollTo, '.compare-main', scrollOffset);
                        }

                        $.publish("EXCHANGE.lightbox.ancplandetails.loaded"); 
                        app.functions.fitLightboxToScreen('#plan-details-container');
                        var cntnHeight = $('#plan-details-container').height();
                        var planDetailsHeight = cntnHeight - 255;
                        if (planDetailsHeight > 350)
                            planDetailsHeight = 350; // max height
                        if (planDetailsHeight < 35)
                            planDetailsHeight = 35; // min height

                        $('.acc-container-plan-details').css("height", planDetailsHeight + "px");
                        $('.acc-container-plan-details').css("overflow", "auto");
                        $('.acc-container-plan-details').css("overflow-x", "hidden");

                        var finalCntnHeight = $('#plan-details-container .provd-info').height() +
                                              $('#plan-details-container .comparemodal.show-print-block').height() +
                                              $('#plan-details-container .plandetail').height();
                        if (cntnHeight > finalCntnHeight) {
                            $('#plan-details-container').height(finalCntnHeight);
                        }
                    }
                });
            },
            afterClose: function () {
                $('.compare-main').scrollTop(0);
                $('.acc-container-plan-details').css("height", "0px");
            },
            showWaitPopup: true
        });
    };

    ns.setupPharmacyRadioButtons = function setupPharmacyRadioButtons() {
        //app.viewModels.PlanDetailsViewModel.tcePharmacy_radio(app.user.UserSession.UserPharmacies.selectedPharmacy().Id);
        ns.refreshPharmacyRadioButtons(app.user.UserSession.UserPharmacies.selectedPharmacy().Id);
    };

    ns.changeDrugRestDisplay = function changeDrugRestDisplay() {
        var planDrugs = app.viewModels.AncPlanDetailsViewModel.planDrugs;

        for (var i = 0; i < planDrugs.length; i++) {
            if (!planDrugs[i].HasPriorAuthorization) {
                $('.plandetails-hasPA').css("background", "gray");
            }
            else {
                $('.plandetails-hasPA').css("background", "#59b9dd");
            }

            if (!planDrugs[i].HasQuantityLimit) {
                $('.plandetails-hasQL').css("background", "gray");
            }
            else {
                $('.plandetails-hasQL').css("background", "#59b9dd");
            }

            if (!planDrugs[i].HasStepTherapy) {
                $('.plandetails-hasST').css("background", "gray");
            }
            else {
                $('.plandetails-hasST').css("background", "#59b9dd");
            }
        }

    }

    ns.drawOutOfPocketGraph = function drawOutOfPocketGraph() {
        ns.oopGraph = new app.costEstimator.OutOfPocketGraph('#out-of-pocket-graph');
        var viewModel = app.viewModels.AncPlanDetailsViewModel;
        var costEstimate = viewModel.plan.tceCost();
        if (costEstimate) {
            var months = viewModel.tceFromStartOfYear() ? costEstimate.CalendarYearMonths : costEstimate.CoverageBeginsMonths;
            if (app.viewModels.RecResultsViewModel != undefined) {
                for (var i = 0; i < months.length; i++) {
                    months[i].InNetworkDrugCost = viewModel.plan.RecommendationInfo.InNetwork / 12;
                }
            }
            ns.oopGraph.drawGraph(months, viewModel.includePrescription(), viewModel.includeMedical(), viewModel.includeAnnual());
        }
    };

    ns.subscribeToObservables = function subscribeToObservables() {
        if (ns.subscriptions) {
            $.each(ns.subscriptions, function (index, sub) {
                sub.dispose();
            });
        }
        ns.subscriptions = [];

        var viewModel = app.viewModels.AncPlanDetailsViewModel;
        ns.subscriptions.push(viewModel.includePrescription.subscribe(function (val) {

            //TODO: Perf
            //            if (viewModel.plan.drawGraph()) {
            //                ns.drawOutOfPocketGraph();
            //            }
        }));
        ns.subscriptions.push(viewModel.includeMedical.subscribe(function (val) {

            //TODO: Perf
            //            if (viewModel.plan.drawGraph()) {
            //                ns.drawOutOfPocketGraph();
            //            }
        }));
        ns.subscriptions.push(viewModel.includeAnnual.subscribe(function (val) {

            //TODO: Perf
            //            if (viewModel.plan.drawGraph()) {
            //                ns.drawOutOfPocketGraph();
            //            }
        }));
        // once we have the med questionarrie lightbox, this will not be necessary
        if (app.user.UserSession && app.user.UserSession.UserProfile) {
            ns.subscriptions.push(app.user.UserSession.UserProfile.doneMedQuestions.subscribe(function (val) {
                if (val && viewModel.plan && viewModel.plan.medCovered_bool()) {
                    viewModel.includeMedical(true);
                }
            }));
        }

        //        ns.subscriptions.push(viewModel.tcePharmacy_radio.subscribe(function (pharmacyId) {


        //            if (app.user.UserSession && app.user.UserSession.UserPharmacies && app.user.UserSession.UserPharmacies.selectedPharmacy()) {
        //                if (app.user.UserSession.UserPharmacies.selectedPharmacy().Id != pharmacyId) {
        //                    ns.updateSelectedPharmacy(pharmacyId);

        //                    app.coverageCost.getPlanDetailsCoverageCosts();
        //                    ns.refreshPharmacyRadioButtons(pharmacyId);

        //                }
        //            }

        //        }));
    };

    ns.pharmacyChanged = function pharmacyChanged(data, event) {
        var pharmacyId = data.Id;
        app.viewModels.AncPlanDetailsViewModel.tcePharmacy_radio(pharmacyId);


        if (app.user.UserSession && app.user.UserSession.UserPharmacies && app.user.UserSession.UserPharmacies.selectedPharmacy()) {
            if (app.user.UserSession.UserPharmacies.selectedPharmacy().Id != pharmacyId) {

                ns.updateSelectedPharmacy(pharmacyId);

                app.coverageCost.getPlanDetailsCoverageCosts();
                //                // app.viewModels.PlanDetailsViewModel.tcePharmacy_radio(pharmacyId);
                ns.refreshPharmacyRadioButtons(pharmacyId);

            }
        }

        return true;

    };


    ns.refreshPharmacyRadioButtons = function refreshPharmacyRadioButtons(pharmacyId) {
        app.functions.refreshRadioButtonSelection('pharmacyRadioMedicationTable', pharmacyId);
        app.functions.refreshRadioButtonSelection('pharmacyRadioTce', pharmacyId);
    };

    ns.updateSelectedPharmacy = function updateSelectedPharmacy(pharmacyId) {
        //updated selected pharmacy in usersession js
        if (app.user.UserSession && app.user.UserSession.UserPharmacies) {
            if (pharmacyId == app.constants.mailOrderPharmacyId()) {
                app.user.UserSession.UserPharmacies.selectedPharmacy(app.exchangeContext.ExchangeContext.mailOrderPharmacy());
            }
            else {
                $.each(app.user.UserSession.UserPharmacies.pharmacies(), function (index, item) {
                    if (item.Id == pharmacyId) {
                        app.user.UserSession.UserPharmacies.selectedPharmacy(item);
                        return 0;
                    }
                });
            }
        }
    };

    ns.drawDrugCostTable = function drawDrugCostTable() {
        var viewModel = app.viewModels.AncPlanDetailsViewModel;
        var costEstimate = viewModel.plan.tceCost();

        if (costEstimate) {
            if (viewModel.tceFromStartOfYear()) {
                viewModel.ShowCoverageGap(costEstimate.InNetworkCalendarYearOverlay.WillHitCoverageGap);
                viewModel.ShowCatastrophicCoverage(costEstimate.InNetworkCalendarYearOverlay.WillHitCatastropicCoverage);

            } else if (!viewModel.tceFromStartOfYear()) {
                viewModel.ShowCoverageGap(costEstimate.InNetworkCoverageBeginsOverlay.WillHitCoverageGap);
                viewModel.ShowCatastrophicCoverage(costEstimate.InNetworkCoverageBeginsOverlay.WillHitCatastropicCoverage);
            }
        }

    };

    ns.toggleCoverageGap = function toggleCoverageGap() {
        app.viewModels.AncPlanDetailsViewModel.ShowCoverageGap(true);
    };

    ns.toggleCatastrophicCoverage = function toggleCatastrophicCoverage() {
        app.viewModels.AncPlanDetailsViewModel.ShowCatastrophicCoverage(true);
    };

    ns.setupJqueryBindings = function setupJqueryBindings() {
        $(document).on('click', '.include-premium .include-check', stopEvent);
        $(document).on('click', '.include-prescription .include-check', function (e) {
            var plan = app.viewModels.AncPlanDetailsViewModel.plan;
            if (!plan.rxCovered_bool || !plan.haveRxData()) {
                stopEvent(e);
            }
        });
        $(document).on('click', '.include-medical .include-check', function (e) {
            var plan = app.viewModels.AncPlanDetailsViewModel.plan;
            if (!plan.medCovered_bool() || !plan.haveMedData()) {
                stopEvent(e);
            }
        });
        $(document).on('click', '#ToggleShowCoverageGap', ns.toggleCoverageGap);
        $(document).on('click', '#ToggleShowCatastrophicCoverage', ns.toggleCatastrophicCoverage);
    };

    function stopEvent(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
    }

    ns.setupViewModels = function setupViewModels() {
        if (!app.viewModels.AncPlanDetailsViewModel) {
            app.viewModels.AncPlanDetailsViewModel = EXCHANGE.models.AncPlanDetailsViewModel();
        }
    };

    ns.tceApplyCustomInput = function tceApplyCustomInput() {
        $('.for-cost .include-list input').customInput();
    };

    ns.tceMonthsApplyCustomInput = function tceMonthsApplyCustomInput() {
        $('.for-cost .switchblock input').customInput();
        $('.for-medications .switchblock input').customInput();

    };

    ns.drugTableApplyCustomInput = function drugTableApplyCustomInput() {
        $('.for-medications .switchblock input').customInput();
        //  ns.refreshPharmacyRadioButtons(app.viewModels.AncPlanDetailsViewModel.tcePharmacy_radio());
    };

    ns.shouldShowEffectiveDateSwitch = function shouldShowEffectiveDateSwitch() {
        if (app.user && app.user.UserSession && app.user.UserSession.UserProfile.coverageBeginsDate) {
            var date = moment(app.user.UserSession.UserProfile.coverageBeginsDate).utc();
            if (date.month() === 0) {
                return false;
            }

            return true;
        }
        return false;
    };

    ns.getCostEstimatorIndexForDrugVm = function getCostEstimatorIndexForDrugVm(planDrugVms) {
        var plan = app.viewModels.AncPlanDetailsViewModel.plan;
        var inNetworkDrugCosts = plan.tceCost().InNetworkDrugCosts;

        for (i = 0; i < inNetworkDrugCosts.length; i++) {
            if (planDrugVms.drugVm().userDrug().SelectedDosage.Id == inNetworkDrugCosts[i].UserDrug.SelectedDosage.Id)
                return i;
        }
        return -1;
    };


    ns.setupUiExtensions = function setupUiExtensions() {
        app.functions.setupAccordions();

        $('.expand-premium').click();

        $(".expand-premium").on('click', function () {
            $('.accordionButton').addClass('on');
            $('.accordionContent').slideDown('normal');
        });

        $(".collapse-premium").on('click', function () {
            $('.accordionButton').removeClass('on');
            $('.accordionContent').slideUp('normal');
        });

        var config = {
            sensitivity: 4,
            interval: 250,
            over: showtip,
            out: hidetip
        };

        function showtip() {
            if ($(this).hasClass("ratingbig")) {
                $(this).addClass('ratinghover');
            } else if ($(this).hasClass("covericonbig")) {
                $(this).addClass('covericonhover');
            } else if ($(this).hasClass("add-to-cart") || $(this).hasClass("addtocompare")) {
                $(this).addClass('show-tip');
            } else if ($(this).hasClass("compare-side")) {
                $(this).addClass('show-tip');
            } else if ($(this).hasClass("moreoption-wrap")) {
                $(this).addClass('show-menu');
            } else if ($(this).hasClass("rating")) {
                $(this).addClass('ratinghover');
            } else if ($(this).hasClass("plan-detail-attribute")) {
                $(this).addClass('plan-detail-attribute-hover');
                setPlanAttributeHoverPosition($(this));
            } else {
                $(this).addClass('logosinfo');
            }
        }
        function hidetip() {
            if ($(this).hasClass("ratingbig")) {
                $(this).removeClass('ratinghover');
            } else if ($(this).hasClass("covericonbig")) {
                $(this).removeClass('covericonhover');
            } else if ($(this).hasClass("add-to-cart") || $(this).hasClass("addtocompare")) {
                $(this).removeClass('show-tip');
            } else if ($(this).hasClass("compare-side")) {
                $(this).removeClass('show-tip');
            } else if ($(this).hasClass("moreoption-wrap")) {
                $(this).removeClass('show-menu');
            } else if ($(this).hasClass("rating")) {
                $(this).removeClass('ratinghover');
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

        $("div.providerlogo").hover(function () {
            $(this).addClass('logosinfo');
        }, function () {
            $(this).removeClass("logosinfo");
        });

        $("div.provd-logo").smartHover(config);
        $("div.provd-detail h3").smartHover(config);
        $("div.ratingbig").smartHover(config);
        $("div.rating").smartHover(config);
        $("div.covericonbig").smartHover(config);
        $("a.add-to-cart").smartHover(config);
        $(".addtocompare").smartHover(config);
        $(".compare-side").smartHover(config);
        $(".plan-price").smartHover(config);
        $("a.med-covered").smartHover(config2);
        $("a.find-doc").smartHover(config2);
        $(".plan-detail-attribute").smartHover(config);
        $(".switchblock label").smartHover(config);
    };

    ns.setupUiExtensionsAfterRender = function setupUiExtensionsAfterRender() {
        function showtip() {
            $(this).parent().addClass("show-tip");
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

        $("p.nothing").smartHover(config);
        $("a.med-covered").smartHover(config);
    };

} (EXCHANGE));

