(function (app, $) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.applicationPage");
    app.namespace("EXCHANGE.viewModels");
    $(document).ready(function () {
        ns.setupViewModels();
    });

    ns.setupViewModels = function setupViewModels() {
        ns.AllItems = {};
        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.Application.ApplicationPageClientViewModel");
        app.viewModels.PlanSharedResourceStrings = app.models.PlanSharedResourceStrings();
        app.viewModels.ApplicationIntegrityViewModel = app.models.ApplicationIntegrityViewModel();
        app.viewModels.ApplicationStateViewModel = app.models.ApplicationStateViewModel();
        app.viewModels.ProgressBarViewModel = app.models.ProgressBarViewModel();
        app.viewModels.NavigationBarViewModel = app.models.NavigationBarViewModel();

        app.viewModels.ApplicationPageViewModel = new app.models.ApplicationPageViewModel();
        app.viewModels.ApplicationSharedValuesViewModel = new app.models.ApplicationSharedValuesViewModel();
        app.viewModels.AppDetailsFaqViewModel = new app.models.AppDetailsFaqViewModel();
        app.viewModels.PaymentInformationViewModel = new app.models.PaymentInformationViewModel();
        app.viewModels.ApplicationProfileViewModel = new app.models.ApplicationProfileViewModel();
        app.viewModels.ApplicationEligibilityViewModel = new app.models.ApplicationEligibilityViewModel();
        app.viewModels.ApplicationPlanTileViewModel = new app.models.ApplicationPlanTileViewModel();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Application/ApplicationPageClientViewModel",
            dataType: "json",
            success: function (viewModel) {
                var serverViewModel = viewModel;
                ns.AllItems = serverViewModel.ApplicationStateViewModel.AllApplicationItems;
                app.viewModels.PlanSharedResourceStrings.loadFromJSON(serverViewModel.PlanSharedResourceStrings);

                app.viewModels.ApplicationIntegrityViewModel.loadFromJSON(serverViewModel.ApplicationIntegrityViewModel);
                app.application.functions.performApplicationIntegrityCheck();
                app.viewModels.ApplicationStateViewModel.loadFromJSON(serverViewModel.ApplicationStateViewModel);
                app.viewModels.ApplicationPlanTileViewModel.loadFromJSON(serverViewModel.ApplicationPlanTileViewModel);

                app.viewModels.NavigationBarViewModel.loadFromJSON(serverViewModel.NavigationBarViewModel);
                app.application.navigationBar.updateNavigationBar();
                app.viewModels.ProgressBarViewModel.loadFromJSON(serverViewModel.ProgressBarViewModel);
                app.application.progressBar.updateProgressBar();

                app.viewModels.ApplicationPageViewModel.loadFromJSON(app.viewModels.ApplicationStateViewModel.CurrentApplicationPage, app.viewModels.ApplicationStateViewModel.ShowInternalOnlyQuestions());

                app.viewModels.ApplicationSharedValuesViewModel.loadFromJSON(serverViewModel.ApplicationSharedValuesViewModel);
                app.viewModels.AppDetailsFaqViewModel.loadFromJSON(serverViewModel.AppDetailsFaqViewModel);
                app.viewModels.PaymentInformationViewModel.loadFromJSON(serverViewModel.PaymentInformationViewModel);
                app.viewModels.ApplicationProfileViewModel.loadFromJSON(serverViewModel.ApplicationProfileViewModel);
                app.viewModels.ApplicationEligibilityViewModel.loadFromJSON(serverViewModel.ApplicationEligibilityViewModel);


                ko.applyBindings(app.viewModels, $('#application-body-content').get(0));

                ns.addIndicatorSpans();
                ns.verticallyAlignInputs();
                ns.setupPhones();
                ns.setupSsn();
                if (serverViewModel.ApplicationStateViewModel != undefined) {
                    if (serverViewModel.ApplicationStateViewModel.CurrentPageIndex != undefined || serverViewModel.ApplicationStateViewModel.CurrentPageIndex != 0) {
                        var percentageProgress = (serverViewModel.ApplicationStateViewModel.CurrentPageIndex * 100) / serverViewModel.ApplicationStateViewModel.EAppPagesCount;
                        $('#progressBar').attr('style', "width:" + percentageProgress + "%");
                        $('#spnProgressLoadingText').html(percentageProgress + "% Complete");
                    }
                    else {
                        $('#progressBar').attr('style', "width:0%");
                        $('#spnProgressLoadingText').html(0 + "% Complete");
                    }
                    if (viewModel.IsEappInValidationMode == "" || viewModel.IsEappInValidationMode == false) {
                        $('#AppValidationProgressBar').hide();
                    }
                    if (viewModel.IsEappInValidationMode == true) {
                        $('#AppValidationProgressBar').show();
                    }
                }
            },
            error: function (data) {
                if (EXCHANGE.WaitPopup) EXCHANGE.WaitPopup.Close();
            }
        });
    };

    ns.clearValidationErrors = function clearValidationErrors() {
        app.viewModels.ApplicationPageViewModel.isInError(false);
        app.viewModels.ApplicationPageViewModel.errorMessagesList([]);
        $('.error-field').removeClass('error-field');
    };

    ns.showValidationErrors = function showValidationErrors(validationResult) {
        if (validationResult.StopShopping) {
            if (typeof validationResult.StopShoppingErrorMessage !== 'undefined')
                app.viewModels.StopEnrollmentPopupViewModel.errorText(validationResult.StopShoppingErrorMessage);
            $.publish("EXCHANGE.lightbox.stopenrollment.open");
        }
        else {
            $('#formErrorLists').css("margin-top", "75px");
            app.viewModels.ApplicationPageViewModel.isInError(true);
            app.viewModels.ApplicationPageViewModel.errorMessagesList(validationResult.ValidationMessages);
            $.each(validationResult.QuestionsInError, function (index, itemId) {
                var $row = $('#checkout-row-' + itemId);
                $row.find('input').not("input[type='checkbox']").addClass('error-field');
                $row.find('select').addClass('error-field');
                $row.find('.radiobtns').children('.shaded-opts').addClass('error-field');
                $row.find('.switchblock').addClass('error-field');
                $row.find('.dk_container').addClass('error-field');
                $row.find('.opt').addClass('error-field');
            });
        }
    };

    ns.addIndicatorSpans = function addIndicatorSpans() {
        $('.medicare-part-a-date').append("<span class='indicator'>2</span>");
        $('.medicare-part-b-date').append("<span class='indicator'>3</span>");
    };

    ns.verticallyAlignInputs = function verticallyAlignInputs() {
        $('.question-input-container').each(function () {
            var divHeight = parseInt($(this).parent().height());
            var padding = $(this).children('label').css('padding-top');
            if (padding && padding.indexOf('px') != -1) {
                padding = padding.replace("px", "");
            }
            divHeight += parseInt(padding);
            padding = $(this).children('label').css('padding-bottom');
            if (padding && padding.indexOf('px') != -1) {
                padding = padding.replace("px", "");
            }
            divHeight += parseInt(padding);
            var margin = (divHeight - $(this).children(':first').height()) / 2;
            if (margin > 0) {
                $(this).children('label').css('margin-top', margin);
                $(this).children('label').css('margin-bottom', margin);
            }
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
            $(item).val(app.functions.autoFormatPhoneNumber($(item).val())).change();
        });
        $('span.format-phone').each(function (index, item) {
            $(item).text(app.functions.autoFormatPhoneNumber($(item).text())).change();
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

} (EXCHANGE, jQuery));
