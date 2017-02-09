(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.application.navigationBar');

    ns.isNavigating = false;

    $(function () {
        if (app.functions) {
            app.functions.disableFooterLinks();
        }
    });

    ns.submittingPage = false;

    ns.updateNavigationBar = function updateNavigationBar() {
        ko.applyBindings(app.viewModels, $('#application-navigation-bar').get(0));


        //setup functionality of continue and go back buttons on each page.
        $(document).off('click', '#btnGoBack');
        $(document).off('click', '#btnContinue');

        $(document).on('click', '#btnGoBack', function () {
            if (!ns.isNavigating) {
                ns.isNavigating = true;
                if (app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Overview) {
                    ns.overviewPageBackNavigation();
                } else if (app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Application) {
                    ns._applicationPageBackNavigation();
                } else if (app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Review) {
                    ns._reviewPageBackNavigation();
                } else {
                    ns._applicationIsInError();
                }
            }
        });

        $(document).on('click', '#btnContinue', function () {
            if (!ns.isNavigating) {
                ns.isNavigating = true;
                if (app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Overview) {
                    ns._overviewPageSubmitNavigation();
                } else if (app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Application) {
                    ns._applicationPageSubmitNavigation();
                } else if (app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Review) {
                    ns._reviewPageSubmitNavigation();
                } else {
                    ns._applicationIsInError();
                }
            }
        });

        $(document).on('click', '#btnTopReviewContinue', function () {
            if (!ns.isNavigating) {
                ns.isNavigating = true;
                if (app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Review) {
                    ns._reviewPageSubmitNavigation();
                } else {
                    ns._applicationIsInError();
                }
            }
        });

        $(document).on('click', '.profileedit', function () {
            var scrollId = $(this).parent().parent().parent().find('span.scroll-span').attr('id');
            ns._reviewPageChangeInfoNavigation(scrollId);
        });

    };

    ns.overviewPageBackNavigation = function overviewPageBackNavigation() {
        if (app.viewModels.OverviewViewModel && app.viewModels.OverviewViewModel.previousBasePage()) {
            var redirectUrl = app.viewModels.OverviewViewModel.previousBasePage();
            redirectUrl = redirectUrl + "?lightboxName=viewcart";

            app.functions.redirectToRelativeUrlFromSiteBase(redirectUrl);
        }
    };

    ns._reviewPageChangeInfoNavigation = function _reviewPageChangeInfoNavigation(scrollId) {
        var args = JSON.stringify(scrollId);
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Application/ApplicationReviewChangeInfo",
            dataType: "json",
            data: args,
            success: function (viewModel) {
                var serverViewModel = viewModel;
                app.viewModels.ApplicationStateViewModel.loadFromJSON(serverViewModel.ApplicationStateViewModel);

                ns.navigateBasedOnNewApplicationState(app.viewModels.ApplicationStateViewModel, window.location.pathname);
            }
        });
    };

    ns._applicationPageBackNavigation = function _applicationPageBackNavigation() {
        app.applicationPage.clearValidationErrors();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Application/ApplicationPageBack",
            dataType: "json",
            success: function (viewModel) {
                var serverViewModel = viewModel;
                app.viewModels.ApplicationPlanTileViewModel.loadFromJSON(serverViewModel.ApplicationPlanTileViewModel);
                if (serverViewModel.ApplicationStateViewModel.CurrentApplicationPage != null) {
                    for (var i = 0; i < serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items.length; i++) {
                        if (serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].ItemType === app.enums.ApplicationItemTypeEnum.Checkbox || serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].ItemType === app.enums.ApplicationItemTypeEnum.Choice || serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].ItemType === app.enums.ApplicationItemTypeEnum.Radio || serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].ItemType === app.enums.ApplicationItemTypeEnum.SingleLineTextBox || serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].ItemType === app.enums.ApplicationItemTypeEnum.DropDown) { if (serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].IsHiddenByCalc == false) break; }
                    }
                    if ((i === serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items.length && serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items.length !== 0) || serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items.length === 0) {
                        app.viewModels.ApplicationStateViewModel.loadFromJSON(serverViewModel.ApplicationStateViewModel);
                        EXCHANGE.application.navigationBar._applicationPageBackNavigation();
                    }
                    else {
                        app.viewModels.ApplicationStateViewModel.loadFromJSON(serverViewModel.ApplicationStateViewModel);
                        app.viewModels.NavigationBarViewModel.loadFromJSON(serverViewModel.NavigationBarViewModel);

                        ns.navigateBasedOnNewApplicationState(app.viewModels.ApplicationStateViewModel, window.location.pathname);
                    }
                } else {
                    app.viewModels.ApplicationStateViewModel.loadFromJSON(serverViewModel.ApplicationStateViewModel);
                    app.viewModels.NavigationBarViewModel.loadFromJSON(serverViewModel.NavigationBarViewModel);

                    ns.navigateBasedOnNewApplicationState(app.viewModels.ApplicationStateViewModel, window.location.pathname);
                }
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
                    if (app.user.UserSession.UserProfile.IsEappInValidationMode == "" || app.user.UserSession.UserProfile.IsEappInValidationMode == false) {
                        $('#AppValidationProgressBar').hide();
                    }
                    if (app.user.UserSession.UserProfile.IsEappInValidationMode == true) {
                        $('#AppValidationProgressBar').show();
                    }
                }
            }
        });
    };

    ns._reviewPageBackNavigation = function _reviewPageBackNavigation() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Application/ApplicationReviewBack",
            dataType: "json",
            success: function (serverAppState) {
                app.viewModels.ApplicationStateViewModel.loadFromJSON(serverAppState);

                ns.navigateBasedOnNewApplicationState(app.viewModels.ApplicationStateViewModel, window.location.pathname);
            }
        });
    };

    ns._overviewPageSubmitNavigation = function _overviewPageSubmitNavigation() {
        (!ns.submittingPage)
        {
            $.each(app.viewModels.OverviewSubmitViewModel.planTilesSubmitViewModel(), function (index, item) {
                if (app.viewModels.OverviewViewModel.planTileViewModels()[index].blankAppIntent() == 1)
                    app.viewModels.OverviewSubmitViewModel.planTilesSubmitViewModel()[index].blankAppIntent = true;
                else
                    app.viewModels.OverviewSubmitViewModel.planTilesSubmitViewModel()[index].blankAppIntent = false;
            });
            var args = JSON.stringify(app.viewModels.OverviewSubmitViewModel.planTilesSubmitViewModel());
            ns.submittingPage = true;

            EXCHANGE.ButtonSpinner = $('#btnContinue').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Application/ApplicationOverviewSubmit",
                dataType: "json",
                data: args,
                success: function (viewModel) {
                    var serverViewModel = viewModel;
                    app.viewModels.ApplicationStateViewModel.loadFromJSON(serverViewModel);
                    if (serverViewModel.ValidationResult != null && !serverViewModel.ValidationResult.IsValid) {
                        $(document).scrollTop(0);
                        ns.showOverviewValidationErrors(app.viewModels.ApplicationStateViewModel.ValidationResult);
                        ns.isNavigating = false;
                    }
                    else {
                        ns.navigateBasedOnNewApplicationState(app.viewModels.ApplicationStateViewModel, window.location.pathname);
                    }
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
                        if (app.user.UserSession.UserProfile.IsEappInValidationMode == "" || app.user.UserSession.UserProfile.IsEappInValidationMode == false) {
                            $('#AppValidationProgressBar').hide();
                        }
                        if (app.user.UserSession.UserProfile.IsEappInValidationMode == true) {
                            $('#AppValidationProgressBar').show();
                        }
                    }
                    EXCHANGE.ButtonSpinner.Stop();
                    $('div.spinner-wrapper').remove();

                }
            });
        }
    };

    ns.showOverviewValidationErrors = function showOverviewValidationErrors(validationResult) {
        app.viewModels.OverviewViewModel.isInError(true);
        app.viewModels.OverviewViewModel.termsOfUseAccepted(false);
        $('.with-check .custom-checkbox label').removeClass('checked');
        app.viewModels.OverviewViewModel.errorMessage(validationResult.ValidationMessages[0]);
        $('.checkoutlist .detail .active-link').css("display", "block");
        app.planDetails.initializePlanDetails();
    };

    ns._applicationPageSubmitNavigation = function _applicationPageSubmitNavigation() {
        (!ns.submittingPage)
        {
            ns.submittingPage = true;
            app.applicationPage.clearValidationErrors();
            var items = ko.mapping.toJSON(app.viewModels.ApplicationPageViewModel.items());

            EXCHANGE.ButtonSpinner = $('#btnContinue').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Application/ApplicationPageSubmit",
                dataType: "json",
                data: items,
                success: function (viewModel) {
                    var serverViewModel = viewModel;
                    app.viewModels.ApplicationStateViewModel.loadFromJSON(serverViewModel.ApplicationStateViewModel);
                    app.viewModels.NavigationBarViewModel.loadFromJSON(serverViewModel.NavigationBarViewModel);
                    app.viewModels.ApplicationPlanTileViewModel.loadFromJSON(serverViewModel.ApplicationPlanTileViewModel);
                    if (serverViewModel.ApplicationStateViewModel.ValidationResult.IsValid) {
                        if (app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() !== app.enums.ApplicationDisplayPageType.Review) {
                            for (var i = 0; i < serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items.length; i++) {
                                if (serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].ItemType === app.enums.ApplicationItemTypeEnum.Checkbox || serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].ItemType === app.enums.ApplicationItemTypeEnum.Choice || serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].ItemType === app.enums.ApplicationItemTypeEnum.Radio || serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].ItemType === app.enums.ApplicationItemTypeEnum.SingleLineTextBox || serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].ItemType === app.enums.ApplicationItemTypeEnum.DropDown) { if (serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].IsHiddenByCalc == false) break; }
                            }
                            if ((i === serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items.length && serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items.length !== 0) || serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items.length === 0) {
                                //app.viewModels.ApplicationPageViewModel.loadFromJSON(serverViewModel.ApplicationStateViewModel.CurrentApplicationPage, serverViewModel.ApplicationStateViewModel.ShowInternalOnlyQuestions);
                                EXCHANGE.application.navigationBar._submitEmptyPage(serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items);
                            }
                            else
                                ns.navigateBasedOnNewApplicationState(app.viewModels.ApplicationStateViewModel, window.location.pathname);
                        }

                        else
                            ns.navigateBasedOnNewApplicationState(app.viewModels.ApplicationStateViewModel, window.location.pathname);
                    } else {
                        $(document).scrollTop(0);
                        app.applicationPage.showValidationErrors(app.viewModels.ApplicationStateViewModel.ValidationResult);
                        ns.isNavigating = false;
                    }

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
                        if (app.user.UserSession.UserProfile.IsEappInValidationMode == "" || app.user.UserSession.UserProfile.IsEappInValidationMode == false) {
                            $('#AppValidationProgressBar').hide();
                        }
                        if (app.user.UserSession.UserProfile.IsEappInValidationMode == true) {
                            $('#AppValidationProgressBar').show();
                        }
                    }

                    EXCHANGE.ButtonSpinner.Stop();
                    $('div.spinner-wrapper').remove();
                }
            });
        }
    };

    ns._submitEmptyPage = function _submitEmptyPage(pgitems) {

        {
            ns.submittingPage = true;

            var items = ko.mapping.toJSON(pgitems);
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Application/ApplicationPageSubmit",
                dataType: "json",
                data: items,
                success: function (viewModel) {
                    var serverViewModel = viewModel;
                    app.viewModels.ApplicationStateViewModel.loadFromJSON(serverViewModel.ApplicationStateViewModel);
                    app.viewModels.NavigationBarViewModel.loadFromJSON(serverViewModel.NavigationBarViewModel);
                    app.viewModels.ApplicationPlanTileViewModel.loadFromJSON(serverViewModel.ApplicationPlanTileViewModel);
                    if (serverViewModel.ApplicationStateViewModel.ValidationResult.IsValid) {
                        if (app.viewModels.ApplicationStateViewModel.CurrentDisplayPageType() !== app.enums.ApplicationDisplayPageType.Review) {
                            for (var i = 0; i < serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items.length; i++) {
                                if (serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].ItemType === app.enums.ApplicationItemTypeEnum.Checkbox || serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].ItemType === app.enums.ApplicationItemTypeEnum.Choice || serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].ItemType === app.enums.ApplicationItemTypeEnum.Radio || serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].ItemType === app.enums.ApplicationItemTypeEnum.SingleLineTextBox || serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items[i].ItemType === app.enums.ApplicationItemTypeEnum.DropDown) break;
                            }
                            if ((i === serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items.length && serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items.length !== 0) || serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items.length === 0) {
                                app.viewModels.ApplicationPageViewModel.loadFromJSON(serverViewModel.ApplicationStateViewModel.CurrentApplicationPage, serverViewModel.ApplicationStateViewModel.ShowInternalOnlyQuestions());
                                EXCHANGE.application.navigationBar._submitEmptyPage(serverViewModel.ApplicationStateViewModel.CurrentApplicationPage.Items);
                            }
                            else
                                ns.navigateBasedOnNewApplicationState(app.viewModels.ApplicationStateViewModel, window.location.pathname);
                        }

                        else
                            ns.navigateBasedOnNewApplicationState(app.viewModels.ApplicationStateViewModel, window.location.pathname);
                    } else {
                        $(document).scrollTop(0);
                        app.applicationPage.showValidationErrors(app.viewModels.ApplicationStateViewModel.ValidationResult);
                        ns.isNavigating = false;
                    }
                }
            });
        }
    };

    /// used by web chat launch and close to save the eapp state before refreshing the page.
    /// navigation is not handled by this method, it should be handled by the caller.
    ns.applicationPageSubmitNoValidation = function applicationPageSubmitNoValidation(callback) {
        var items = ko.mapping.toJSON(app.viewModels.ApplicationPageViewModel.items());
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Application/ApplicationPageSubmitNoValidation",
            dataType: "json",
            data: items,
            success: function (viewModel) {
                callback();
            }
        });
    };

    ns._reviewPageSubmitNavigation = function _reviewPageSubmitNavigation() {
        (!ns.submittingPage)
        {
            ns.submittingPage = true;
            if (!EXCHANGE.ButtonSpinner) {
                EXCHANGE.ButtonSpinner = $('#btnContinue').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
            }

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Application/ApplicationReviewSubmit",
                dataType: "json",
                data: JSON.stringify(app.viewModels.ApplicationPlanTileViewModel.planModel().planGuid),
                success: function (viewModel) {
                    var serverViewModel = viewModel;
                    app.viewModels.ApplicationStateViewModel.loadFromJSON(serverViewModel.ApplicationStateViewModel);
                    app.viewModels.ApplicationIntegrityViewModel.loadFromJSON(serverViewModel.ApplicationIntegrityViewModel);
                    app.application.functions.performApplicationIntegrityCheck();
                    if (app.viewModels.ApplicationIntegrityViewModel.isApplicationStateValid()) {
                        ns.navigateBasedOnNewApplicationState(app.viewModels.ApplicationStateViewModel, window.location.pathname);
                    } else {
                        $('body').scrollTop(0);
                        ns.isNavigating = false;
                    }
                    EXCHANGE.ButtonSpinner.Stop();
                    $('div.spinner-wrapper').remove();

                }
            });
        }
    };

    ns.navigateBasedOnNewApplicationState = function navigateBasedOnNewApplicationState(appState, currentPage) {
        if (!currentPage) {
            currentPage = window.location.pathname;
        }

        if (appState.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Overview) {
            app.functions.redirectToRelativeUrlFromSiteBase("application/application-overview.aspx");
        } else if (appState.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Application) {
            if (currentPage != "/application/application.aspx") {
                app.functions.redirectToRelativeUrlFromSiteBase("application/application.aspx");
            } else {

                $(document).scrollTop(0);
                app.viewModels.ApplicationPageViewModel.loadFromJSON(appState.CurrentApplicationPage, appState.ShowInternalOnlyQuestions());
                app.applicationPage.addIndicatorSpans();
                ns.isNavigating = false;
            }
        } else if (appState.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Review) {
            app.functions.redirectToRelativeUrlFromSiteBase("application/application-review.aspx");
        } else if (appState.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.NextSteps) {
            app.functions.redirectToRelativeUrlFromSiteBase("application/application-next-steps.aspx");
        } else if (appState.CurrentDisplayPageType() == app.enums.ApplicationDisplayPageType.Esign) {
            app.functions.redirectToRelativeUrlFromSiteBase("/electronicsign.aspx");
        }
    };

    ns._applicationIsInError = function applicationIsIneError() {
        app.viewModels.ApplicationIntegrityViewModel.isApplicationStateValid(false);
        app.application.functions.performApplicationIntegrityCheck();
        $(document).scrollTop(0);
        ns.isNavigating = false;
    };

} (EXCHANGE));

