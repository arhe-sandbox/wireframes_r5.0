(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enrollmentPlanDetails');

    ns.lastEnrollmentId = '';
    ns.lastPlanId = '';
    ns.lastEffDate = '';
    // Bug 32189 code fix
    ns.plandetailspopup = ko.observableArray([]);

    ns.initializeEnrollmentPlanDetails = function initializeEnrollmentPlanDetails() {

        ns.setupViewModels();

        var enrollmentPlanDetailsLb = new EXCHANGE.lightbox.Lightbox({
            name: 'enrollmentplandetails',
            divSelector: '#enrollment-plan-details-popup',
            openButtonSelector: '#enrollment-plan-details-open-button',
            closeButtonSelector: '#enrollment-plan-details-close-button',
            beforeOpen: function () {
                try {
                    // The following line would fail for the first time because the viewModel 
                    //will be populated after ajax call. But we need to have this here so that 
                    // the LB size can be calculated correctly only after the binding has taken place
                    ko.applyBindings(EXCHANGE.viewModels, $('#enrollmentPlanDetailsTemplates').get(0));
                }
                catch (e) {
                    //We expect the try block to throw exception. This is an expected behavior. So do nothing
                }
                app.functions.setupScrollBindings('.planDetailsAndContact');
                app.shoppingCart.bindEvents();

                ns.setupJqueryBindings();
                return true;
            },
            afterOpen: function (clickedItem) {
                ns.loadPlan(clickedItem);
            },
            afterClose: function () {
                $('.planDetailsAndContact').scrollTop(0);
            },
            showWaitPopup: true
        });
    };

    ns.setupJqueryBindings = function setupJqueryBindings() {

        $(document).on('click', '#ToggleShowCoverageGap', ns.toggleCoverageGap);
        $(document).on('click', '#ToggleShowCatastrophicCoverage', ns.toggleCatastrophicCoverage);
    };

    ns.toggleCoverageGap = function toggleCoverageGap() {
        app.viewModels.PlanDetailsViewModel.ShowCoverageGap(true);
    };

    ns.toggleCatastrophicCoverage = function toggleCatastrophicCoverage() {
        app.viewModels.PlanDetailsViewModel.ShowCatastrophicCoverage(true);
    };

    ns.loadPlan = function loadPlan(clickedItem) {
        //get enrollment id
        var enrollmentId = $(clickedItem).attr('data-enrollmentid');
        if (enrollmentId != null) {
            ns.lastEnrollmentId = enrollmentId;
        } else {
            enrollmentId = ns.lastEnrollmentId;
        }
        //get plan id
        var planid = $(clickedItem).attr('id');
        if (planid != null) {
            ns.lastPlanId = planid;
        } else {
            planid = ns.lastPlanId;
        }

        //get effDate
        var effDate = $(clickedItem).attr('data-effectiveDate');
        if (effDate != null) {
            ns.lastEffDate = effDate;
        } else {
            effDate = ns.lastEffDate;
        }

        var enrollmentPlanDetailsArgs = { PlanId: planid, EnrollmentId: enrollmentId, EffectiveDate: effDate };
        enrollmentPlanDetailsArgs = JSON.stringify(enrollmentPlanDetailsArgs);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/EnrollmentPlans/EnrollmentPlanDetailsClientViewModel",
            dataType: "json",
            data: enrollmentPlanDetailsArgs,
            success: function (data) {


                var viewModel = data;
                // Bug 32189 code fix
                EXCHANGE.enrollmentPlanDetails.plandetailspopup(viewModel.PlanDetailsPopupViewModel);


                app.viewModels.PlanSharedResourceStrings.loadFromJSON(viewModel.PlanSharedResourceStrings);


                //                var planModel = app.plans.PlanModel(viewModel.Plan);
                //                var planViewModel = app.models.PlanViewModel(0);
                //                planViewModel = planViewModel.loadFromPlan(planModel);
                //                app.viewModels.PlanDetailsViewModel.loadFromPlanViewModel(planViewModel, viewModel.PlanDetailsPopupViewModel);



                app.viewModels.PlanDetailsViewModel = EXCHANGE.models.PlanDetailsViewModel();
                app.viewModels.PlanDetailsViewModel.loadPlanDetails(ns.lastPlanId, viewModel.PlanDetailsPopupViewModel);

                app.viewModels.PlanDetailsViewModel.printTempIdLink = '/temp-id-card.aspx?enrollmentId=' + viewModel.PlanDetailsPopupViewModel.EnrollmentId;

                if (data.PriorYearPlan)
                    app.viewModels.PlanDetailsViewModel.plan.priorYearPlan(true);
                ko.applyBindings(EXCHANGE.viewModels, $('#enrollmentPlanDetailsTemplates').get(0));
                EXCHANGE.user.UserSession.DoctorFinder.changeProviderLabels([EXCHANGE.viewModels.PlanDetailsViewModel.plan]);

                if (!data.PriorYearPlan)
                    app.coverageCost.getPlanDetailsCoverageCosts(viewModel.PlanDetailsPopupViewModel);

                ns.setupUiExtensions();
                var scrollTo = $(clickedItem).attr('scrolltodiv');
                app.functions.scrollToDiv(scrollTo, '.planDetailsAndContact');
                $.publish("EXCHANGE.lightbox.enrollmentplandetails.loaded");
                app.functions.fitLightboxToScreen('#enrollment-plan-details-container');
                var cntnHeight = $('#enrollment-plan-details-container').height();
                var planDetailsHeight = cntnHeight - 255;
                if (planDetailsHeight > 350)
                    planDetailsHeight = 350; // max height

                if (planDetailsHeight < 35)
                    planDetailsHeight = 35; // min height


                $('.planDetailsAndContact').css("height", planDetailsHeight + "px");
                $('.planDetailsAndContact').css("overflow", "auto");
                $('.planDetailsAndContact').css("overflow-x", "hidden");


            }
        });
    };

    ns.setupViewModels = function setupViewModels() {
        if (!app.viewModels.PlanSharedResourceStrings) {
            app.viewModels.PlanSharedResourceStrings = app.models.PlanSharedResourceStrings();
        }
        if (!app.viewModels.PlanDetailsViewModel) {
            app.viewModels.PlanDetailsViewModel = EXCHANGE.models.PlanDetailsViewModel();
        }
    };

    ns.setupUiExtensions = function setupUiExtensions() {
        app.functions.setupAccordions();

        $('.expand-premium').click();

        $(".expand-premium").on('click', function () {
            $("#enrollment-plan-details-container").find('.accordionButton').addClass('on');
            $("#enrollment-plan-details-container").find('.accordionContent').slideDown('normal');
        });

        $(".collapse-premium").on('click', function () {
            $("#enrollment-plan-details-container").find('.accordionButton').removeClass('on');
            $("#enrollment-plan-details-container").find('.accordionContent').slideUp('normal');
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
            } else if ($(this).hasClass("moreoption-wrap")) {
                $(this).addClass('show-menu');
            } else if ($(this).hasClass("rating")) {
                $(this).addClass('ratinghover');
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
            } else if ($(this).hasClass("moreoption-wrap")) {
                $(this).removeClass('show-menu');
            } else if ($(this).hasClass("rating")) {
                $(this).removeClass('ratinghover');
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

        $("div.provd-logo").smartHover(config);
        $("div.provd-detail h3").smartHover(config);
        $("div.ratingbig").smartHover(config);
        $("div.rating").smartHover(config);
        $("div.covericonbig").smartHover(config);
        $("a.add-to-cart").smartHover(config);
        $(".addtocompare").smartHover(config);
        $(".compare-side").smartHover(config);
        $("a.med-covered").smartHover(config2);
        $("a.find-doc").smartHover(config2);
        $(".plan-price").smartHover(config);
    };

} (EXCHANGE));

