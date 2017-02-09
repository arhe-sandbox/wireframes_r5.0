(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.findAccount');
    app.namespace("EXCHANGE.viewModels");


   
    ns.handleValidation = function handleValidation(serverValidationModel, viewModel) {
        ns.clearFindAccountErrors();

        var validationResult = serverValidationModel.ValidationResult;
        viewModel.HasMatchError(serverValidationModel.DisplayMatchNotFoundMessage);

        // This is flipping my continue arrow text back to "Continue", so I moved up here but that is 
        // still happening. Figure out how to stop it. (Edit: looks like it's not happening anymore... ?)
        // $findAccountSpinner.Stop();

        var wasOnMultiMatch = (viewModel.FindAccountPanelTemplateName() == viewModel.MULTIMATCH_TEMPLATE_NAME);

        if (validationResult.IsValid) {
            if (serverValidationModel.DisplayMultipleMatchesTemplate) {
                viewModel.FindAccountPanelTemplateName(viewModel.MULTIMATCH_TEMPLATE_NAME);
                viewModel.FindAccountViewModel.MultipleMatchFlag(true);
            } else {
                // Display the "no matches found" error; we'll always use initial page for this
                // since user can see all their editable data. 
                viewModel.FindAccountPanelTemplateName(viewModel.INITIAL_TEMPLATE_NAME);
                viewModel.FindAccountViewModel.MultipleMatchFlag(false);

                if (wasOnMultiMatch) {
                    $('.selectfield').dropkick();
                }
            }
        } else {
            ns.loadFindAccountErrors(validationResult.Errors, viewModel);
        }

    };


    ns.loadFindAccountErrors = function loadFindAccountErrors(inlineErrors, viewModel) {
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "LastName") {
                ns.setErrorFieldFindAccount('#txtLastName');
            } else if (inlineErrors[i].PropertyName == "ZIPCode") {
                ns.setErrorFieldFindAccount('#txtZIPCode');
            } else if (inlineErrors[i].PropertyName == "SSNOrNavigatorsId") {
                ns.setErrorFieldFindAccount('#txtSSN');
                ns.setErrorFieldFindAccount('#txtNavigatorsId');
            } else if (inlineErrors[i].PropertyName == "NavigatorsId") {
                ns.setErrorFieldFindAccount('#txtNavigatorsIdMultiple');
            } else if (inlineErrors[i].PropertyName == "DOB") {
                ns.setErrorFieldFindAccount('#dk_container_yearForgotUsername');
                ns.setErrorFieldFindAccount('#dk_container_monthForgotUsername');
                ns.setErrorFieldFindAccount('#dk_container_dayForgotUsername');
            }
            viewModel.Errors.push(inlineErrors[i].ErrorMessage);
        }
    };

    ns.setErrorFieldFindAccount = function setErrorFieldOnClass(controlSelector) {
        $('document').find(controlSelector).addClass('error-field');
    };


    ns.clearFindAccountErrors = function clearFindAccountErrors() {
        ns.clearFindAccountErrors = function clearTextboxErrorHighlighting() {
            app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.HasMatchError(false);
            app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.Errors([]);
            $('#txtLastName').removeClass('error-field');
            $('#dk_container_year').removeClass('error-field');
            $('#dk_container_month').removeClass('error-field');
            $('#dk_container_day').removeClass('error-field');
            $('#txtZIPCode').removeClass('error-field');
            $('#txtSSN').removeClass('error-field');
            $('#txtNavigatorsId').removeClass('error-field');
        };
    };

} (EXCHANGE));

