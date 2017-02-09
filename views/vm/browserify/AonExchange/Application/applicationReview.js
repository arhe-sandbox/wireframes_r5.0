(function (app, $) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.applicationReview");
    app.namespace("EXCHANGE.viewModels");
    $(document).ready(function () {
        ns.setupViewModels();
    });

    ns.setupViewModels = function setupViewModels() {

        app.viewModels.PlanSharedResourceStrings = app.models.PlanSharedResourceStrings();
        app.viewModels.ApplicationIntegrityViewModel = app.models.ApplicationIntegrityViewModel();
        app.viewModels.ApplicationStateViewModel = app.models.ApplicationStateViewModel();
        app.viewModels.ProgressBarViewModel = app.models.ProgressBarViewModel();
        app.viewModels.NavigationBarViewModel = app.models.NavigationBarViewModel();

        app.viewModels.ApplicationSharedValuesViewModel = new app.models.ApplicationSharedValuesViewModel();
        app.viewModels.ApplicationReviewViewModel = new app.models.ApplicationReviewViewModel();
        app.viewModels.AppDetailsFaqViewModel = new app.models.AppDetailsFaqViewModel();
        app.viewModels.ApplicationProfileViewModel = new app.models.ApplicationProfileViewModel();
        app.viewModels.ApplicationPlanTileViewModel = new app.models.ApplicationPlanTileViewModel();
        var enrollmentId = EXCHANGE.functions.getKeyValueFromUrl('eid', window.location.href);

        var args = JSON.stringify(enrollmentId);
        ko.applyBindings(app.viewModels, $('.app-review-container').get(0));
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Application/ApplicationReviewClientViewModel",
            dataType: "json",
            data: args,
            success: function (viewModel) {
                var serverViewModel = viewModel;
                app.viewModels.ApplicationReviewViewModel.showInformationEligibilitySections(viewModel.showInformationEligibilitySections);
                app.viewModels.ApplicationStateViewModel.loadFromJSON(serverViewModel.ApplicationStateViewModel);

                app.viewModels.NavigationBarViewModel.loadFromJSON(serverViewModel.NavigationBarViewModel);
                app.application.navigationBar.updateNavigationBar();
                app.viewModels.ProgressBarViewModel.loadFromJSON(serverViewModel.ProgressBarViewModel);
                app.application.progressBar.updateProgressBar();

                app.viewModels.ApplicationSharedValuesViewModel.loadFromJSON(serverViewModel.ApplicationSharedValuesViewModel);
                app.viewModels.ApplicationReviewViewModel.loadFromJSON(serverViewModel.ApplicationReviewViewModel);

                app.viewModels.AppDetailsFaqViewModel.loadFromJSON(serverViewModel.AppDetailsFaqViewModel);
                app.viewModels.ApplicationProfileViewModel.loadFromJSON(serverViewModel.ApplicationProfileViewModel);

                app.viewModels.PlanSharedResourceStrings.loadFromJSON(serverViewModel.PlanSharedResourceStrings);
                app.viewModels.ApplicationPlanTileViewModel.loadFromJSON(serverViewModel.ApplicationPlanTileViewModel);

                ns.applyFirstClass();
                ns.scrollFromAppState();
                ns.setupPhones();
                ns.setupSsn();
                ns.hideHeaders();

                app.viewModels.ApplicationIntegrityViewModel.loadFromJSON(serverViewModel.ApplicationIntegrityViewModel);
                app.application.functions.performApplicationIntegrityCheck();
                if (serverViewModel.ApplicationStateViewModel != undefined) {

                    if (serverViewModel.IsEappInValidationMode == "" || serverViewModel.IsEappInValidationMode == false) {
                        $('#AppValidationProgressBar').hide();
                    }
                    if (serverViewModel.IsEappInValidationMode == true) {
                        $('#AppValidationProgressBar').show();
                        $('#progressBar').attr('style', "width:100%");
                        $('#spnProgressLoadingText').html(100 + "% Complete");
                    }
                }

                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            },
            error: function (data) {
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            }
        });
        ns.hideHeaders = function hideHeaders() {
            if (enrollmentId != "") {
                $("#alert").hide();
                $("#application-navigation-bar").hide();
                $("#profile-colR").hide();
                $("#checkout-section-details").hide();
                $(".pagetitle").text("Application Summary");
            }
        };

        ns.scrollFromAppState = function scrollFromAppState() {
            var scrollId = app.viewModels.ApplicationStateViewModel.ScrollToId();
            var offset = $('#' + scrollId).offset();
            if (offset != null) {
                $(document).scrollTop(offset.top);
            }
        };

        ns.applyFirstClass = function applyFirstClass() {
            var prevWasHeader = false;
            $('.checkout-row').each(function (index, item) {
                if ($(item).hasClass('review-section-header')) {
                    prevWasHeader = true;
                    return true;
                }
                if (prevWasHeader) {
                    $(item).addClass('first');
                }

                prevWasHeader = false;
            });
        };

        ns.setupPhones = function setupPhones() {
            ns.formatPhones();
            app.functions.setupPhoneFormatting();
        };

        ns.setupSsn = function setupSsn() {
            ns.formatSsn();
            app.functions.setupSsnFormatting();
        };

        ns.formatPhones = function formatPhones() {
            $('input.format-phone').each(function (index, item) {
                $(item).val(app.functions.autoFormatPhoneNumber($(item).val()));
            });
            $('span.format-phone').each(function (index, item) {
                $(item).text(app.functions.autoFormatPhoneNumber($(item).text()));
            });
        };

        ns.formatSsn = function formatSsn() {
            $('input.format-ssn').each(function (index, item) {
                $(item).val(app.functions.autoFormatSsn($(item).val()));
            });
            $('span.format-ssn').each(function (index, item) {
                $(item).text(app.functions.autoFormatSsn($(item).text()));
            });
        };
    };

} (EXCHANGE, jQuery));
