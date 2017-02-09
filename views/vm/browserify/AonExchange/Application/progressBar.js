(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.application.progressBar');

    ns.updateProgressBar = function updateProgressBar() {
        
        ko.applyBindings(app.viewModels, $('#application-progress-bar').get(0));
        $('#application-progress-bar ul li').removeClass('current');

        if (app.viewModels.ProgressBarViewModel.currentPage() == app.enums.ProgressPageType.Overview) {
            $('.progress-overview').addClass('current');
        } else if (app.viewModels.ProgressBarViewModel.currentPage() == app.enums.ProgressPageType.FirstApplication) {
            $('.progress-first-application').addClass('current');
        } else if (app.viewModels.ProgressBarViewModel.currentPage() == app.enums.ProgressPageType.SecondApplication) {
            $('.progress-second-application').addClass('current');
        } else if (app.viewModels.ProgressBarViewModel.currentPage() == app.enums.ProgressPageType.NextSteps) {
            $('.progress-done').addClass('current');
        }
    };



} (EXCHANGE));
