(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.forgotUsername');
    app.namespace("EXCHANGE.viewModels");

    // "constants" here to make it easier to change template names in .ascx
    var INITIAL_TEMPLATE_NAME = "find-account-forgot-username-template";
    var MULTIMATCH_TEMPLATE_NAME = "multiple-matches-forgot-username-template";
    var FOUNDACCT_TEMPLATE_NAME = "single-match-forgot-username-template";

    $(document).ready(function () {
        ns.initializeForgotUsername();
        ns.wireupJqueryEvents();
    });

    ns.initializeForgotUsername = function initializeForgotUsername() {
        ns.setupViewModels();

        var forgotUsernameLb = new EXCHANGE.lightbox.Lightbox({
            name: 'forgotusername',
            divSelector: '#forgot-username-popup',
            openButtonSelector: '#forgot-username-open-button',
            closeButtonSelector: '#forgot-username-close-button',
            beforeOpen: function () {
                ko.applyBindings(app.viewModels, $('#forgot-username-popup').get(0));
                return true;
            },
            afterOpen: function (item) {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/API/FindAccount/ForgotUsernameClientViewModel",
                    dataType: "json",
                    success: function (data) {
                        var serverViewModel = data;
                        var viewModel = app.viewModels.ForgotUsernameViewModel;
                        viewModel.loadFromJSON(serverViewModel);
                        viewModel.configurePanelType(viewModel.INITIAL_PANEL_TYPE);

                        app.functions.addMonthOptionsSubscription(app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.dateOfBirth, 'monthForgotUsername', true);
                        ns.displayDropkicks();
                        $.publish("EXCHANGE.lightbox.forgotusername.loaded");
                    },
                    error: function () {
                        $.publish('EXCHANGE.lightbox.closeAll');
                    }
                });
                ns.completeForgotUsernameInfoLightboxConfiguration();
            },
            showWaitPopup: true,
            beforeSubmit: function () {
                return false;
            },
            afterClose: function () {
                // clear data and dropkicks so a re-render starts fresh
                var closeViewModel = app.viewModels.ForgotUsernameViewModel;
                closeViewModel.clearData();
                ns.clearFindAccountErrors();
                closeViewModel.configurePanelType(closeViewModel.INITIAL_PANEL_TYPE);
                closeViewModel.PanelTemplateName(INITIAL_TEMPLATE_NAME);

                // remove dropkicks and reset selects
                ns.processSelectsUponClosing(true);
            }
        });
    };


    ns.completeForgotUsernameInfoLightboxConfiguration = function () {

        ns.initializeTabIndices('#forgot-username-popup', "txtLastName")
    };

    // set the tabindex of all user input fields in the tree rooted at the given selector result; put focus on the element with name initialElementName
    ns.initializeTabIndices = function (selector, initialElementName) {
        var $lb = $(selector);
        $($lb).find('.has-tabindex').each(function () {
            var tabIndex = $(this).attr('data-tabindex');
            $(this).attr('tabindex', tabIndex);
        });

        var firstFocus = document.getElementById(initialElementName);
        $(firstFocus).focus();
    };

    // removes all tabindex values in the tree rooted at the given selector result;
    ns.removeTabIndexes = function (selector) {
        var $lb = $(selector);
        $($lb).find('.has-tabindex').each(function () {
            $(this).removeAttr('tabindex');
        });
    };

    ns.displayDropkicks = function displayDropkicks() {
        $('#forgotUsernameSearchForm').find('.selectfield').dropkick();
    };

    ns.setupViewModels = function setupViewModels() {
        if (!app.viewModels.ForgotUsernameViewModel) {
            app.viewModels.ForgotUsernameViewModel = app.models.ForgotUsernameViewModel();
            app.viewModels.ForgotUsernameViewModel.PanelTemplateName(INITIAL_TEMPLATE_NAME);

        }
    };


    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $("#forgot-username-popup").on('click', "#btnForgotUsernameCancel", ns.handleCancelBtn);
        $("#forgot-username-popup").on('click', "#btnForgotUsernameSubmit", ns.handleSubmitBtn);

        $(document).on('keydown', '#txtLastName', function (e) {
            if (e.keyCode === 13) {
                $('#btnForgotUsernameSubmit').click();
            }
        });

        $(document).on('keydown', '#dk_container_monthForgotUsername', function (e) {
            if (e.keyCode === 13) {
                $('#btnForgotUsernameSubmit').click();
            }
        });

        $(document).on('keydown', '#dk_container_dayForgotUsername', function (e) {
            if (e.keyCode === 13) {
                $('#btnForgotUsernameSubmit').click();
            }
        });

        $(document).on('keydown', '#dk_container_yearForgotUsername', function (e) {
            if (e.keyCode === 13) {
                $('#btnForgotUsernameSubmit').click();
            }
        });

        $(document).on('keydown', '#txtZIPCodeForgotUsername', function (e) {
            if (e.keyCode === 13) {
                $('#btnForgotUsernameSubmit').click();
            }
        });

        $(document).on('keydown', '#txtSSN', function (e) {
            if (e.keyCode === 13) {
                $('#btnForgotUsernameSubmit').click();
            }
        });

        $(document).on('keydown', '#txtNavigatorsId', function (e) {
            if (e.keyCode === 13) {
                $('#btnForgotUsernameSubmit').click();
            }
        });

        //$('div#dk_container_monthForgotUsername div.dk_options a').live('click', function (e) {
        //    ns.dateDropDownChange($(this).attr('data-dk-dropdown-value'));
        //});

        // If a new month is selected, the available values in the "Date" dropdown must change to reflect that month
        $('#forgotUsernameSearchForm').on(($.browser.msie ? 'mousedown' : 'click'), 'div#dk_container_monthForgotUsername div.dk_options a', function (e) {
            var chosenMonth = $(this).attr('data-dk-dropdown-value');
            var chosenYear = $('#yearForgotUsername').val();
            var dayOptions = app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.dateOfBirth.DayOptions;
            app.functions.dateDropDownUpdate(chosenMonth, chosenYear, dayOptions, 'dayForgotUsername');
        });

        $('#txtZIPCodeForgotUsername').live('keyup', function () {
            var input = $(this);
            var zip = input.val();
            var zipInt = parseInt(zip);

            if (zip.length == 5 && zipInt >= 0 && zipInt < 100000) {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/API/Geography/GetCountiesByZip",
                    dataType: "json",
                    data: JSON.stringify({ 'zip': zip }),
                    success: function (data) {
                        app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.CountyList(data);
                        if (app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.CountyList().length == 1) {
                            app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.County(app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.CountyList()[0].Id);
                        }
                        $('.addr-county-dd').children('.dk_container').remove();
                        input.parents('ul').find('.selectcounty').dropkick();
                        ns.updateDropkickDropdowns();
                    }
                });
            } else {
                app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.CountyList([]);
                $('.addr-county-dd').children('.dk_container').remove();
                input.parents('ul').find('.selectcounty').dropkick();
                ns.updateDropkickDropdowns();
            }
        });
    };


    ns.updateDropkickDropdowns = function updateDropkickDropdowns() {
        $('.selectcounty').parents('li').find('.dk_container').find('li').on(($.browser.msie ? 'mousedown' : 'click'), function () {
            var selectedVal = $(this).find('a').first().attr('data-dk-dropdown-value');
            app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.County(selectedVal);
        });
    };

    ns.handleCancelBtn = function handleCancelBtn() {
        var viewModel = app.viewModels.ForgotUsernameViewModel;
        var panelName = viewModel.PanelTemplateName();
        if (panelName == INITIAL_TEMPLATE_NAME) {
            // close this lightbox, return to previous one or base page
            $.publish('EXCHANGE.lightbox.forgotusername.back');
        } else if (panelName == MULTIMATCH_TEMPLATE_NAME) {
            viewModel.configurePanelType(viewModel.INITIAL_PANEL_TYPE);
            viewModel.PanelTemplateName(INITIAL_TEMPLATE_NAME);

            // Remove data/errors assigned from multiple-matches page
            viewModel.FindAccountViewModel.NavigatorsId('');
            ns.clearFindAccountErrors();

            // This will give us the correct behavior when we re-submit from initial page
            viewModel.FindAccountViewModel.MultipleMatchFlag(false);

            // This "initial" template is re-rendered so we need to re-kick the dropkicks
            ns.displayDropkicks();
        } else if (panelName == FOUNDACCT_TEMPLATE_NAME) {
            if (viewModel.FoundAccountViaMultiMatch()) {
                // we arrived at single-match panel from the multiple-matches panel
                viewModel.configurePanelType(viewModel.MULTIMATCH_PANEL_TYPE);
                viewModel.PanelTemplateName(MULTIMATCH_TEMPLATE_NAME);
                viewModel.FoundAccountViaMultiMatch(false);
                viewModel.FindAccountViewModel.MultipleMatchFlag(true);

            } else {
                // we arrived at single-match panel from the initial panel
                viewModel.configurePanelType(viewModel.INITIAL_PANEL_TYPE);
                viewModel.PanelTemplateName(INITIAL_TEMPLATE_NAME);
                ns.displayDropkicks();
            }
            ns.resetControls();
        }
    };
    ns.resetControls = function resetControls() {
        $('#txtLastName').val("");
        $('#txtZIPCodeForgotUsername').val("");
        $('#txtNavigatorsId').val("");
        $('#txtSSN').val("");
        $("div#dk_container_monthForgotUsername a.dk_toggle span.dk_label").text("Month");
        $("div#dk_container_yearForgotUsername a.dk_toggle span.dk_label").text("year");
        $("div#dk_container_dayForgotUsername a.dk_toggle span.dk_label").text("Date");

        app.viewModels.ForgotUsernameViewModel.clearData();
    };

    ns.clear
    ns.handleSubmitBtn = function handleSubmitBtn() {
        var viewModel = app.viewModels.ForgotUsernameViewModel;
        var panelName = viewModel.PanelTemplateName();
        if (panelName == INITIAL_TEMPLATE_NAME) {
            ns.validateFindAccount();
        } else if (panelName == MULTIMATCH_TEMPLATE_NAME) {
            ns.validateFindAccount();
        } else if (panelName == FOUNDACCT_TEMPLATE_NAME) {
            // note: viewModel is cleared by "afterClose" event handler within lightbox
            $.publish('EXCHANGE.lightbox.forgotusername.back');
        }
    };

    ns.validateFindAccount = function validateFindAccount() {
        var viewModel = app.viewModels.ForgotUsernameViewModel;

        // only need to copy values from dropkick selects if we're actually on 
        // the template with the dropdowns. 
        if (viewModel.PanelTemplateName() == INITIAL_TEMPLATE_NAME) {
            ns.setDropdownValuesInModel();
        }

        var $findAccountSpinner = $('#btnForgotUsernameSubmit').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
        var findAccountArgs = viewModel.FindAccountViewModel.toFindAccountArgs();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/FindAccount/ForgotUsernameValidation",
            dataType: "json",
            data: JSON.stringify(findAccountArgs),
            success: function (serverValidationModel) {
                ns.clearFindAccountErrors();

                var validationResult = serverValidationModel.ValidationResult;
                app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.HasMatchError(serverValidationModel.DisplayMatchNotFoundMessage);

                // This is flipping my continue arrow text back to "Continue", so I moved up here but that is 
                // still happening. Figure out how to stop it. (Edit: looks like it's not happening anymore... ?)
                $findAccountSpinner.Stop();

                var wasOnMultiMatch = (viewModel.PanelTemplateName() == MULTIMATCH_TEMPLATE_NAME);

                if (validationResult.IsValid) {
                    if (serverValidationModel.DisplayMultipleMatchesTemplate) {
                        viewModel.configurePanelType(viewModel.MULTIMATCH_PANEL_TYPE);
                        viewModel.PanelTemplateName(MULTIMATCH_TEMPLATE_NAME);
                        viewModel.FindAccountViewModel.MultipleMatchFlag(true);
                    } else if (serverValidationModel.DisplaySingleMatchTemplate) {
                        viewModel.loadAccountFromJSON(serverValidationModel);
                        viewModel.configurePanelType(viewModel.FOUNDACCOUNT_PANEL_TYPE);
                        viewModel.PanelTemplateName(FOUNDACCT_TEMPLATE_NAME);
                        viewModel.FindAccountViewModel.MultipleMatchFlag(false);
                        if (wasOnMultiMatch) {
                            viewModel.FoundAccountViaMultiMatch(true);
                        }
                    } else {
                        // Display the "no matches found" error; we'll always use initial page for this
                        // since user can see all their editable data. 
                        viewModel.configurePanelType(viewModel.INITIAL_PANEL_TYPE);
                        viewModel.PanelTemplateName(INITIAL_TEMPLATE_NAME);
                        viewModel.FindAccountViewModel.MultipleMatchFlag(false);

                        if (wasOnMultiMatch) {
                            ns.displayDropkicks();
                        }
                    }
                } else {
                    ns.loadFindAccountErrors(validationResult.Errors);
                }
            }
        });
    };

   
    ns.setDropdownValuesInModel = function setDropdownValuesInModel() {
        var findAccountViewModel = app.viewModels.ForgotUsernameViewModel.FindAccountViewModel;
        var dobViewModel = findAccountViewModel.dateOfBirth;

        var yearVal = app.functions.getDropdownSelectedValueBySelectElementId("yearForgotUsername");
        dobViewModel.Year(yearVal);
        var monthVal = app.functions.getDropdownSelectedValueBySelectElementId("monthForgotUsername");
        dobViewModel.Month(monthVal);
        var dayVal = app.functions.getDropdownSelectedValueBySelectElementId("dayForgotUsername");
        dobViewModel.Day(dayVal);

        if ($("#dd-select-countyForgotUsername").length > 0) {
            var countyVal = app.functions.getDropdownSelectedValueBySelectElementId("dd-select-countyForgotUsername");
            findAccountViewModel.County(countyVal);
        }
    };

    ns.removeDropkicks = function removeDropkicks() {
        app.functions.removeDropkickBySelectElementId("yearForgotUsername");
        app.functions.removeDropkickBySelectElementId("monthForgotUsername");
        app.functions.removeDropkickBySelectElementId("dayForgotUsername");
    };

    ns.loadFindAccountErrors = function loadFindAccountErrors(inlineErrors) {
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "LastName") {
                ns.setErrorFieldFindAccount('#txtLastName');
            } else if (inlineErrors[i].PropertyName == "ZIPCode") {
                ns.setErrorFieldFindAccount('#txtZIPCodeForgotUsername');
            } else if (inlineErrors[i].PropertyName == "SSNOrNavigatorsId") {
                ns.setErrorFieldFindAccount('#txtSSN');
                ns.setErrorFieldFindAccount('#txtNavigatorsId');
            } else if (inlineErrors[i].PropertyName == "NavigatorsId") {
                ns.setErrorFieldFindAccount('#txtNavigatorsIdMultiple');
            } else if (inlineErrors[i].PropertyName == "DOB") {
                ns.setErrorFieldFindAccount('#dk_container_yearForgotUsername');
                ns.setErrorFieldFindAccount('#dk_container_monthForgotUsername');
                ns.setErrorFieldFindAccount('#dk_container_dayForgotUsername');
            } else if (inlineErrors[i].PropertyName == "CountyId") {
                ns.setErrorFieldFindAccount("#dd-select-countyForgotUsername");
            }
            app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.Errors.push(inlineErrors[i].ErrorMessage);
        }
    };

    ns.setErrorFieldFindAccount = function setErrorFieldOnClass(controlSelector) {
        $('#forgot-username-popup').find(controlSelector).addClass('error-field');
    };

    ns.clearFindAccountErrors = function clearTextboxErrorHighlighting() {
        app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.HasMatchError(false);
        app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.Errors([]);
        $('#txtLastName').removeClass('error-field');
        $('#dk_container_yearForgotUsername').removeClass('error-field');
        $('#dk_container_monthForgotUsername').removeClass('error-field');
        $('#dk_container_dayForgotUsername').removeClass('error-field');
        $('#txtZIPCodeForgotUsername').removeClass('error-field');
        $('#txtSSN').removeClass('error-field');
        $('#txtNavigatorsId').removeClass('error-field');
    };


    ns.processSelectsUponClosing = function processSelectsUponClosing(shouldClearSelects) {
        $('#forgotUsernameSearchForm').find('.selectfield').each(function (index) {
            if (shouldClearSelects) {
                $(this).prop('selectedIndex', 0);
            }
            app.functions.removeDropkickBySelectElementId($(this).attr('id'));
        });

        // eliminate the county dropdown; no need to set it back to 0-indexed element, since
        // with zip code cleared out, the entire dropdown should not appear again until
        // a zip code is entered, at which point we'll replenish the data in this dropdown
        // anyway. 
        app.functions.removeDropkickBySelectElementId("countySelectForgotUsername");

        if (shouldClearSelects) {
            app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.dateOfBirth.clearData();
        } else {
            // If dropdown-bound values are saved to the unbound model values, in case
            // the select-binding when we reopen this page messes with the dropdown-bound values
            app.viewModels.ForgotUsernameViewModel.FindAccountViewModel.dateOfBirth.storeValuesToModel();
        }
    };

} (EXCHANGE));

