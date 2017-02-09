(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.browsePlans');

    $(document).ready(function () {
        app.viewModels.PlanSharedResourceStrings = app.models.PlanSharedResourceStrings();
        app.viewModels.PlanDetailsViewModel = app.models.PlanDetailsViewModel();

        ns.loadPlans();
    });

    ns.loadPlans = function loadPlans() {
        //get plan id
        var planid = $('#PlanIdHiddenField').val();
        var browsePlanDetailsArgs = { PlanId: planid };
        browsePlanDetailsArgs = JSON.stringify(browsePlanDetailsArgs);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/BrowsePlans/BrowsePlanDetailsClientViewModel",
            dataType: "json",
            data: browsePlanDetailsArgs,
            success: function (data) {
                var viewModel = data;

                app.viewModels.PlanSharedResourceStrings.loadFromJSON(viewModel.PlanSharedResourceStrings);
//                var planModel = app.plans.PlanModel(viewModel.Plan);
//                var planViewModel = app.models.PlanViewModel(0);
//                planViewModel = planViewModel.loadFromPlan(planModel);

                //                app.viewModels.PlanDetailsViewModel.loadFromPlanViewModel(planViewModel, viewModel.PlanDetailsPopupViewModel);


                app.viewModels.PlanDetailsViewModel = EXCHANGE.models.PlanDetailsViewModel();
                app.viewModels.PlanDetailsViewModel.loadPlanDetails(planid, viewModel.PlanDetailsPopupViewModel);
                ko.applyBindings(EXCHANGE.viewModels, $('#browse-plan-details').get(0));
                $("#divMyMedicationSection .accordionButton .acc-title:nth-child(2)").removeClass("show-browse-inline");

                $('.accordionButton').addClass('on');
                ns.showAndHideForBrowse();
                ns.setupAccordions();
                app.planDetails.setupUiExtensions();
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            },
            error: function (data) {
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            }
        });
    };

    ns.showAndHideForBrowse = function showAndHideForBrowse() {
        $('.hide-browse').css('display', 'none');
        $('.show-browse-block').css('display', 'block');

        $('.find-doc').removeClass('.lightbox-open-doctorfinderintro').click(ns.linkToFindPlans);
        $('.show-premiums').click(ns.linkToFindPlans);
        $(document).on('click', '#btnBrowseDetailLink', ns.executePrint);

        $('.med-covered').click(ns.linkToFindPlans);
        $('#lnkGetStartedButton').click(ns.linkToFindPlans);

        $('.lightbox-open-medquestions').attr('href', '/find-plans.aspx');
    };

    ns.executePrint = function executePrint() {
        window.print();
        return false;
    };

    ns.linkToFindPlans = function linkToFindPlans() {
        window.location.pathname = "find-plans.aspx"; ;
        return false;
    };

    ns.setupAccordions = function setupAccordions() {
        $('.expand-premium').click();

        $(".expand-premium").on('click', function () {
            $('.accordionButton').addClass('on');
            $('.accordionContent').slideDown('normal');
        });

        $(".collapse-premium").on('click', function () {
            $('.accordionButton').removeClass('on');
            $('.accordionContent').slideUp('normal');
        });

        $('.accordionButton').on('mouseover', function () {
            $(this).addClass('over');
        }).mouseout(function () {
            $(this).removeClass('over');
        });
    };

} (EXCHANGE));
