(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.planDetails');

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
            name: 'plandetails',
            divSelector: '#plan-details-popup',
            openButtonSelector: '#plan-details-open-button',
            closeButtonSelector: '#plan-details-close-button',
            beforeOpen: function () {

                app.functions.setupScrollBindings('.compare-main');
                ns.subscribeToObservables();
                ns.setupJqueryBindings();
                try {
                    // The following line would fail for the first time because the viewModel 
                    //will be populated after ajax call. But we need to have this here so that 
                    // the LB size can be calculated correctly only after the binding has taken place
                    ko.applyBindings(EXCHANGE.viewModels, $('#planDetailsTemplates').get(0));
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
                        app.viewModels.PlanDetailsViewModel = EXCHANGE.models.PlanDetailsViewModel();
                        //app.viewModels.PlanDrugCostsViewModel = EXCHANGE.models.PlanDrugCostsViewModel();
                        app.viewModels.PlanDetailsViewModel.loadPlanDetails(ns.lastPlanGuid, serverViewModel.PlanDetailsPopupViewModel);
                        ko.applyBindings(EXCHANGE.viewModels, $('#planDetailsTemplates').get(0));
                        ns.setupPharmacyRadioButtons();
                        ns.setupUiExtensions();
                        ns.changeDrugRestDisplay();
                        app.coverageCost.getPlanDetailsCoverageCosts(serverViewModel.PlanDetailsPopupViewModel);
                        //$('.for-medications .switchblock input').customInput();
                        $('.accordionButton').addClass('on');
                        var scrollTo = $(item).attr('scrolltodiv');
                        if (scrollTo != null) {
                            var scrollOffset = 0;
                            if ($(item).attr('data-scrolloffset')) {
                                scrollOffset = parseInt($(item).attr('data-scrolloffset'));
                            }
                            app.functions.scrollToDiv(scrollTo, '.compare-main', scrollOffset);
                        }

                        $.publish("EXCHANGE.lightbox.plandetails.loaded");
                        app.functions.fitLightboxToScreen('#plan-details-container');
                        var cntnHeight = $('#plan-details-container').height();
                        var planDetailsHeight = cntnHeight - 255;
                        if (planDetailsHeight > 350)
                            planDetailsHeight = 350; // max height
                        if (planDetailsHeight < 35)
                            planDetailsHeight = 35; // min height

                        if (EXCHANGE.models.RecResultsViewModel != undefined) {
                            var premiumWidth = Math.round($(".chart-premium")[0].style.width.replace('%', ''));
                            var medicalusageWidth = Math.round($(".chart-medicalusage")[0].style.width.replace('%', ''));
                            var prescriptionWidth = Math.round($(".chart-prescription")[0].style.width.replace('%', ''));

                            var finalPremiumWidth, finalMedicalusageWidth, finalPrescriptionWidth;
                            var isPremiumLow = false, isMedicalusage = false, isPrescriptionLow = false;

                            //Minimum values --> premiun - 15%, Medical -20%, Prescription - 18%
                            if (parseFloat(premiumWidth) < 15 && parseFloat(premiumWidth) != 0) {
                                isPremiumLow = true;
                                finalpremiumWidth = 15;
                            }
                            if (parseFloat(medicalusageWidth) < 20 && parseFloat(medicalusageWidth) != 0) {
                                isMedicalusage = true;
                                finalMedicalusageWidth = 20;
                            }
                            if (parseFloat(prescriptionWidth) < 18 && parseFloat(prescriptionWidth) != 0) {
                                isPrescriptionLow = true;
                                finalPrescriptionWidth = 18;
                            }

                            var maxVal = Math.max(premiumWidth, medicalusageWidth, prescriptionWidth);

                            var getWidthVariance = 0;
                            if (isPremiumLow) {
                                getWidthVariance += (finalpremiumWidth - premiumWidth);
                            }
                            if (isMedicalusage) {
                                getWidthVariance += (finalMedicalusageWidth - medicalusageWidth);
                            }
                            if (isPrescriptionLow) {
                                getWidthVariance += (finalPrescriptionWidth - prescriptionWidth);
                            }

                            if (getWidthVariance != 0) {
                                switch (maxVal) {
                                    case premiumWidth:
                                        finalpremiumWidth = (premiumWidth - getWidthVariance);
                                        $(".chart-premium")[0].style.width = finalpremiumWidth - 2 + "";
                                        break;
                                    case medicalusageWidth:
                                        finalMedicalusageWidth = (medicalusageWidth - getWidthVariance);
                                        $(".chart-medicalusage")[0].style.width = finalMedicalusageWidth - 2 + "%";
                                        break;
                                    case prescriptionWidth:
                                        finalPrescriptionWidth = (prescriptionWidth - getWidthVariance);
                                        $(".chart-prescription")[0].style.width = finalPrescriptionWidth - 2 + "%";
                                        break;
                                }

                                if (isPremiumLow) {
                                    $(".chart-premium")[0].style.width = finalpremiumWidth + "%";
                                }
                                if (isMedicalusage) {
                                    $(".chart-medicalusage")[0].style.width = finalMedicalusageWidth + "%";
                                }
                                if (isPrescriptionLow) {
                                    $(".chart-prescription")[0].style.width = finalPrescriptionWidth + "%";
                                }

                            }
                        }

                        $(".chart-part-b-premium").css("width", ($('.chart-premium').width() + $('.chart-prescription').width() + $('.chart-medicalusage').width()));

                        $('.acc-container-plan-details').css("height", planDetailsHeight + "px");
                        $('.acc-container-plan-details').css("overflow", "auto");
                        $('.acc-container-plan-details').css("overflow-x", "hidden");
                        $('.acc-container-plan-details').css("padding-top", "5px");

                        var finalCntnHeight = $('#plan-details-container .provd-info').height() +
                                              $('#plan-details-container .comparemodal.show-print-block').height() +
                                              $('#plan-details-container .plandetail').height();
                        if (cntnHeight > finalCntnHeight) {
                            $('#plan-details-container').height(finalCntnHeight);
                        }

                        if (EXCHANGE.models.RecResultsViewModel != undefined) {
                            $("#costEstimateSection").hide();
                            $("#divMyMedicationSection").hide();
                            //ns.DisplayCostGraph();

                            var planVm = null;

                            if (EXCHANGE.viewModels.SearchResultsViewModel)
                                planVm = EXCHANGE.viewModels.SearchResultsViewModel.getPlanByPlanGuid(planGuid);

                            if (planVm == undefined || planVm == null) {
                                var planSRVM = new EXCHANGE.models.PlanSearchResultsViewModel();
                                planVm = planSRVM.loadFromPlanDomainEntity(planDetails);
                            }

                            var PlanIdInfos = [];
                            var PlanIdInfo = {};
                            PlanIdInfo.PlanGuid = planGuid;
                            PlanIdInfo.DRXPlanID = planVm.DRXPlanID;
                            PlanIdInfo.MedicareContractId = planVm.medicareContractId;
                            PlanIdInfo.MedicarePlanId = planVm.medicarePlanId;
                            PlanIdInfo.MedicareSegmentId = planVm.medicareSegmentId;
                            PlanIdInfo.EffectiveDate = EXCHANGE.user.UserSession.UserProfile.coverageBeginsDate;
                            PlanIdInfo.PlanType = EXCHANGE.viewModels.PlanDetailsViewModel.plan.planType;

                            PlanIdInfos.push(PlanIdInfo);

                            $.ajax({
                                type: "POST",
                                contentType: "application/json; charset=utf-8",
                                url: "/API/Recommendations/PlanDetailsCoverageCost",
                                dataType: "json",
                                data: JSON.stringify(PlanIdInfos),
                                success: function (serverViewModel) {
                                    app.viewModels.PlanDetailsViewModel.loadCoverageCostDetails(serverViewModel);

                                    $('table#PlanDetailsCost thead tr td').hover(function () {
                                        $('table#PlanDetailsCost thead').find('tr>td').removeClass('show-tip');
                                        $(this).addClass('show-tip');
                                    });
                                    $(".acc-container-plan-details").scroll(function () {

                                        var containertop = $('.acc-container-plan-details').offset().top;
                                        var anchortopoffset = $('.drugRest').offset().top;
                                        var anchordifference = anchortopoffset - containertop;

                                        if (anchordifference <= 80) {
                                            $(".tooltip").removeAttr('style');
                                            $(".tip-pointer").removeAttr('style');
                                            $('#tooltip-PA').css("left", "51%");
                                            $('#tooltip-QL').css("left", "51.5%");
                                            $('#tooltip-ST').css("left", "51%");
                                            $("#tooltip-main-ST").css("top", "30px");
                                        }
                                        else {
                                            $("#tooltip-main-ST").removeAttr('style');
                                            $(".tooltip").css("bottom", "60px");
                                            $(".tip-pointer").css({ "background": "transparent url('/AonExchange/media/Image-Gallery/SiteImages/tooltipbottom.png') no-repeat" });
                                            $("#tooltip-main-QL").css("height", "50px");
                                            $('#tooltip-PA').css({ "top": "89px", "left": "51%" });
                                            $('#tooltip-QL').css({ "top": "70px", "left": "51.5%" });
                                            $('#tooltip-ST').css({ "top": "104px", "left": "51%" });
                                        }
                                    });
                                }
                            });

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

    ns.DisplayCostGraph = function DisplayCostGraph() {
        var css_id = ".details-chart"; //Identify placeholder html element
        //Setup data. All y values should equal to 1 since we're drawing a single bar
        //To adjust the value of each bar horizontally, replace the x values with the necessary values.
        //The x values will be used to evaluate where to draw the labels and what text to write.
        var data = [
                                        { label: 'Premium', data: [[181.00, 1]] },
                                        { label: 'Medical Usage', data: [[302.00, 1]] },
                                        { label: 'Prescriptions', data: [[723.00, 1]] },
                                        ];
        //Setup chart options. These options will style the chart to be a horizontal stacked bar chart.
        //We remove all grid styles and apply specific colors to the array while defining our axies.
        var options = {
            series: {
                stack: true,
                lines: { show: false, steps: false },
                bars: { show: true, barWidth: 1, align: 'center', horizontal: true, fill: 1 },
                valueLabels: { show: true }
            },
            yaxis: { show: false, ticks: [[1, 'One']] },
            xaxis: { show: false },
            legend: { show: false },
            grid: { show: false, margin: { top: 5} },
            colors: ["#60A918", "#EA7252", "#2DABDD"]
        };

        if ($(css_id).length > 0) {
            //Draw the flot chart, and assign the object to a variable
            var somePlot = $.plot($(css_id), data, options);

            //After the flot chart is drawn, parse back through the data to extract what we need and draw the new labels
            //Code is un-necessarily verbose for clarification 
            var ctx = somePlot.getCanvas().getContext("2d"); //Retrieve chart context
            var allSeries = somePlot.getData();  //Retrieve series data from the chart
            var xaxis = somePlot.getXAxes()[0]; //Get x Axis data
            var yaxis = somePlot.getYAxes()[0]; //Get y Axis data
            var offset = somePlot.getPlotOffset(); //Obtain plot offsets, although we don't have any specifically defined above
            ctx.font = "14px 'Segoe UI'"; //Set font and size for text labels
            ctx.fillStyle = "white"; //Set label font color
            //Loop through the series and collect the total value of the data points
            //We will use this to determine the % of the graph a particular section covers
            var vtotal = 0.0;
            for (var i = 0; i < allSeries.length; i++) {
                var series = allSeries[i];
                var dataPoint = series.datapoints.points; // one point per series
                var x = dataPoint[0];
                vtotal = parseFloat(x);
            }
            var prevAmount = 0.0; //Track previous series amount for proceeding loop so we can deduct it from total values
            var curPerc = 0; //Track current total percent so we can offset the final value if rounding gives us a total less than 100
            //Loop through the series to create a label for each dataset
            for (var i = 0; i < allSeries.length; i++) {
                var series = allSeries[i]; //grab current series
                var dataPoint = series.datapoints.points; //One point for each series
                var x = dataPoint[0]; //X value
                var y = dataPoint[1]; //Y value
                var curAmount = x - prevAmount; //remove previous amount from x to get he current amount
                var perc = (curAmount / vtotal); //Use current amount to determine percent of total width the section covers
                curPerc += parseInt(perc * 100); //Add to running percent total
                if (i === 2 && curPerc !== 100) perc += 0.01; //Offset the last number to accomodate for parse rounding
                //Customize the text based ont he data points, we know the order the data appears in (Premium > Medical Usage > Prescriptions)
                //START Top Label
                //Concatenate text strings and percent of total to get final text strings
                var text = '';
                if (i === 0) text = 'Premium ' + parseInt(perc * 100) + '%'; //First label
                else if (i === 1) text = 'Medical Usage ' + parseInt(perc * 100) + '%'; //Second label
                else if (i === 2) text = 'Prescriptions ' + parseInt(perc * 100) + '%'; //Third Label
                var metrics = ctx.measureText(text); //Get width of text in pixels
                //Calculate x and y positions
                //Place text in center of bar. This is going to be xaxis.p2c(x) - ((748 * percent) * .5) - (metrics.width * .5) 
                //which reads "Start at x axis data point for x value, subtract half of the width of the percent
                //of 748 pixels (total width of bar) minus half of the width of the text in pixels to get the origin point of the label.
                var xPos = xaxis.p2c(x) + offset.left - ((748 * perc) * .5) - (metrics.width * .5);
                var yPos = yaxis.p2c(y) + offset.top - 2; //Simply place the text a little lower than the y axis default
                ctx.fillText(text, xPos, yPos);
                //END Top Label
                //START Bottom Label
                var textb = '($' + curAmount.toFixed(2) + ')'; //Text is simply the dollar amount wrapped in paranthesis for all 3 labels
                var metricsb = ctx.measureText(textb);
                var xPosb = xaxis.p2c(x) + offset.left - ((748 * perc) * .5) - (metricsb.width * .5);
                var yPosb = yaxis.p2c(y) + offset.top + 16;
                ctx.fillText(textb, xPosb, yPosb);
                //END Bottom Label
                prevAmount = x; //Update the previous amount variable with the current x value variable.
            }
        }
    };

    ns.setupPharmacyRadioButtons = function setupPharmacyRadioButtons() {
        //app.viewModels.PlanDetailsViewModel.tcePharmacy_radio(app.user.UserSession.UserPharmacies.selectedPharmacy().Id);
        ns.refreshPharmacyRadioButtons(app.user.UserSession.UserPharmacies.selectedPharmacy().Id);
    };

    ns.changeDrugRestDisplay = function changeDrugRestDisplay() {
        var planDrugs = app.viewModels.PlanDetailsViewModel.planDrugs;

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
        var viewModel = app.viewModels.PlanDetailsViewModel;
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

        var viewModel = app.viewModels.PlanDetailsViewModel;
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
        app.viewModels.PlanDetailsViewModel.tcePharmacy_radio(pharmacyId);


        if (app.user.UserSession && app.user.UserSession.UserPharmacies && app.user.UserSession.UserPharmacies.selectedPharmacy()) {
            if (app.user.UserSession.UserPharmacies.selectedPharmacy().Id != pharmacyId) {

                ns.updateSelectedPharmacy(pharmacyId);

        // Bug 32189 code fix
                if(EXCHANGE.enrollmentPlanDetails!=undefined && EXCHANGE.enrollmentPlanDetails.plandetailspopup()!=undefined)
                    app.coverageCost.getPlanDetailsCoverageCosts(EXCHANGE.enrollmentPlanDetails.plandetailspopup());
                else
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
        var viewModel = app.viewModels.PlanDetailsViewModel;
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
        app.viewModels.PlanDetailsViewModel.ShowCoverageGap(true);
    };

    ns.toggleCatastrophicCoverage = function toggleCatastrophicCoverage() {
        app.viewModels.PlanDetailsViewModel.ShowCatastrophicCoverage(true);
    };

    ns.setupJqueryBindings = function setupJqueryBindings() {
        $(document).on('click', '.include-premium .include-check', stopEvent);
        $(document).on('click', '.include-prescription .include-check', function (e) {
            var plan = app.viewModels.PlanDetailsViewModel.plan;
            if (!plan.rxCovered_bool || !plan.haveRxData()) {
                stopEvent(e);
            }
        });
        $(document).on('click', '.include-medical .include-check', function (e) {
            var plan = app.viewModels.PlanDetailsViewModel.plan;
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
        if (!app.viewModels.PlanDetailsViewModel) {
            app.viewModels.PlanDetailsViewModel = EXCHANGE.models.PlanDetailsViewModel();
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
        //  ns.refreshPharmacyRadioButtons(app.viewModels.PlanDetailsViewModel.tcePharmacy_radio());
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
        var plan = app.viewModels.PlanDetailsViewModel.plan;
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
