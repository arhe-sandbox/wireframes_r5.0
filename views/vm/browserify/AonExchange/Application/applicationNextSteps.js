(function (app, $) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.applicationPage");
    app.namespace("EXCHANGE.viewModels");
    $(document).ready(function () {
        ns.setupViewModels();
        app.enrollmentPlanDetails.initializeEnrollmentPlanDetails();
        app.decisionSupport.initializeDecisionSupport();
    });

    ns.setupViewModels = function setupViewModels() {

        app.viewModels.ApplicationStatusViewModel = new app.models.ApplicationStatusViewModel();
        app.viewModels.ProgressBarViewModel = app.models.ProgressBarViewModel();


        ko.applyBindings(app.viewModels, $('.page-checkout').get(0));

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Application/ApplicationNextStepsClientViewModel",
            dataType: "json",
            success: function (viewModel) {
                app.viewModels.ApplicationStatusViewModel.loadFromJSON(viewModel.ApplicationStatusViewModel);
                app.viewModels.ProgressBarViewModel.loadFromJSON(viewModel.ProgressBarViewModel);
                app.application.progressBar.updateProgressBar();

                ns.setupAccordions();
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            },
            error: function (data) {
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            }
        });
    };

    ns.setupAccordions = function setupAccordions() {
        $(".accordionButton").each(function () {
            if ($(this).hasClass("on")) {
                $(this).next().show();
            } else {
                $(this).next().hide();
            }

        });

        //app.functions.setupAccordions(true);
        $('.accordionButtonEnroll').on('click', function () {
            $(this).parent().find('.accordionButtonEnroll').each(function () {
                if ($(this).next().is(':hidden') !== true) {
                    $(this).next().slideUp('normal');
                    $(this).removeClass('on');
                }
            });

            if ($(this).next().is(':hidden') == true) {
                $(this).addClass('on');
                $(this).next().slideDown('normal');
            } else {
                $(this).next().slideUp('normal');
                $(this).removeClass('on');

            }
        });

        $('.accordionButtonEnroll').on('mouseover', function () {
            $(this).addClass('over');
        }).mouseout(function () {
            $(this).removeClass('over');
        });
    };

} (EXCHANGE, jQuery));
