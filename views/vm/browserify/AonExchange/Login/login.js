(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.login');

    $(document).ready(function () {
        ns.initializeLogin();
        ns.setupJqueryBindings();
    });

    ns.afterCartMerge = null;



    ns.intelligentSwapCallback = function intelligentSwapCallback() {
        var plans = ns.currentPlans;
        if (plans.length <= 0) {
            ns.checkProfileConflict();
            return;
        }
        var planModelServer = { Plan: plans[0] };
        var planModelJavascript = new app.plans.PlanModel(planModelServer);
        app.cart.CartAPI.addPlanToCart(planModelJavascript, true, true, function () {
            plans.splice(0, 1);
            ns.currentPlans = plans;
            ns.intelligentSwapCallback();
        });
    };

    ns.checkProfileConflict = function checkProfileConflict() {
        app.viewModels.LoginConflictViewModel.doneCallback = app.login.setQueryStringAndReload;
        $.publish("EXCHANGE.lightbox.login.close");
        $.publish("EXCHANGE.lightbox.loginconflict.open");
    };

    ns.setupJqueryBindings = function setupJqueryBindings() {
        $(document).on('keydown', '#txtUsername', function (e) {
            if (e.keyCode === 13) {
                $('#btnLogin').click();
            }
        });

        $(document).on('keydown', '#txtPassword', function (e) {
            if (e.keyCode === 13) {
                $('#btnLogin').click();
            }
        });


        $(document).on('keydown', '#txtResetPassword', function (e) {
            if (e.keyCode === 13) {
                $('#btnResetPasswordSubmit').click();

            }
        });


        $('#btnLogin').click(function () {
            EXCHANGE.ButtonSpinner = $(this).ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });

            // authentication must also include page context
            var clientCode = "";
            if (EXCHANGE.companyLanding) {
                clientCode = EXCHANGE.companyLanding.clientCode;
            }

            var submitLoginArgs = {
                Username: $('#txtUsername').val(),
                Password: $('#txtPassword').val(),
                ClientCode: clientCode
            };

            submitLoginArgs = JSON.stringify(submitLoginArgs);

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Login/LoginSubmit",
                dataType: "json",
                data: submitLoginArgs,
                success: function (jsonString) {
                    ns.afterLoginSubmit(jsonString);
                    EXCHANGE.ButtonSpinner.Stop();
                },
                error: function (data) {
                    EXCHANGE.ButtonSpinner.Stop();
                }
            });
        });

        $('#btnForgotPasswordShow').click(function () {

            if (_gaq) {

                _gaq.push(['_trackPageview', 'Forgot_Password/Request']);

            }
            ns.showResetPasswordForm();
            return false;
        });

        $('#btnResetPasswordSubmit').click(function () {

            if (_gaq) {

                _gaq.push(['_trackPageview', 'Forgot_Password/Sent']);


            }

            app.ButtonSpinner = $(this).ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
            var forgotPasswordArgs = {
                Username: $('#txtResetPassword').val()
            };

            forgotPasswordArgs = JSON.stringify(forgotPasswordArgs);

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Login/ResetPasswordSubmit",
                dataType: "json",
                data: forgotPasswordArgs,
                success: function (jsonString) {

                    app.ButtonSpinner.Stop();
                    ns.afterResetPasswordSubmit(jsonString);

                },
                error: function (data) {
                    EXCHANGE.ButtonSpinner.Stop();
                }
            });
        });

        $('#btnResetPasswordCancel').click(function () {
            ns.showLoginForm();

            return false;
        });
    };

    ns.afterLoginSubmit = function afterLoginSubmit(jsonString) {
        var serverViewModel = jsonString;
        app.viewModels.LoginValidationViewModel.loadFromJSON(serverViewModel);

        //add red boxes around inputs
        $('#txtUsername').removeClass('error-field');
        $('#txtPassword').removeClass('error-field');
        if (!app.viewModels.LoginValidationViewModel.isValid()) {
            if (!app.viewModels.LoginValidationViewModel.isUsernameValid()) {
                $('#txtUsername').addClass('error-field');
            } else if (!app.viewModels.LoginValidationViewModel.isPasswordCorrect()) {
                $('#txtPassword').addClass('error-field');
                $('#txtPassword').val('');
            }
        }

        //logic password successful logic goes here:
        if (app.viewModels.LoginValidationViewModel.isValid()) {
            /*
            var plans = serverViewModel.AuthenticatedCart;
            if (plans.length > 0) {
            if (serverViewModel.LoginConflictViewModel.IsConflict) {
            ns.afterCartMerge = ns.checkProfileConflict;
            }
            else {
            ns.afterCartMerge = ns.setQueryStringAndReload;
            }
            app.user.ShoppingCart.reconcileCart(plans);
            } else 
            */
            if (serverViewModel.LoginConflictViewModel.IsConflict) {
                ns.checkProfileConflict();
            }
            else {
                ns.setQueryStringAndReload();
            }
        }
    };

    ns.afterResetPasswordSubmit = function afterResetPasswordSubmit(jsonString) {
        var serverViewModel = jsonString;
        app.viewModels.ResetPasswordValidationViewModel.loadFromJSON(serverViewModel);

        if (app.viewModels.ResetPasswordValidationViewModel.displayEmailError() &&
                !app.viewModels.ResetPasswordValidationViewModel.displayRecentResetError()) {
            app.functions.redirectToRelativeUrlFromSiteBase("first-time-user.aspx?noemail=true");
            return;
        }

        $('#txtResetPassword').removeClass('error-field');

        if (!app.viewModels.ResetPasswordValidationViewModel.isValid()) {
            if (app.viewModels.ResetPasswordValidationViewModel.displayUsernameError()) {
                $('#txtResetPassword').addClass('error-field');

            }
        }
        else {
            ns.showResetPasswordConfirmation();
        }
    };

    ns.showLoginForm = function showLoginForm() {
        app.viewModels.LoginViewModel.displayLoginForm(true);
        app.viewModels.LoginViewModel.displayResetPasswordForm(false);
        app.viewModels.LoginViewModel.displayResetPasswordConfirmation(false);
    };

    ns.showResetPasswordForm = function showResetPasswordForm() {
        app.viewModels.LoginViewModel.displayLoginForm(false);
        app.viewModels.LoginViewModel.displayResetPasswordForm(true);
        app.viewModels.LoginViewModel.displayResetPasswordConfirmation(false);
        $('#txtResetPassword').focus();
    };

    ns.showResetPasswordConfirmation = function showResetPasswordConfirmation() {
        app.viewModels.LoginViewModel.displayLoginForm(false);
        app.viewModels.LoginViewModel.displayResetPasswordForm(false);
        app.viewModels.LoginViewModel.displayResetPasswordConfirmation(true);
    };

    ns.initializeLogin = function initializeLogin() {
        app.viewModels.ResetPasswordValidationViewModel = app.models.ResetPasswordValidationViewModel();
        app.viewModels.LoginValidationViewModel = app.models.LoginValidationViewModel();
        app.viewModels.LoginViewModel = app.models.LoginViewModel();


        var loginLb = new EXCHANGE.lightbox.Lightbox({
            name: 'login',
            divSelector: '#loginpopup',
            openButtonSelector: '#login-open-button',
            closeButtonSelector: '#login-close-button',
            beforeOpen: function () {
                //determine if we should open, return false to prevent
                $('#loginpopup').show();
                $('#txtResetPassword').focus();

                $('#txtUsername').val('');
                $('#txtPassword').val('');
                $('#txtResetPassword').val('');

                $('#txtUsername').removeClass('error-field');
                $('#txtPassword').removeClass('error-field');
                $('#txtResetPassword').removeClass('error-field');
                $('#divLoginValidation').hide();
                $('#divResetPasswordContainer').hide();

                app.login.currentLightboxName = app.lightbox.currentLightbox ? app.lightbox.currentLightbox.name : "";

                if (app.login.currentLightboxName.toLowerCase() === "plandetails") {

                    app.login.currentPlanId = app.viewModels.PlanDetailsViewModel ? app.viewModels.PlanDetailsViewModel.plan.planGuid : "";
                }
                //                if (EXCHANGE.login.currentLightboxName.toLowerCase() === "doctorfinderintro") {
                //                    EXCHANGE.login.currentLightboxName = "";
                //                }
                //ns.setupJqueryBindings();
                return true;
            },
            afterOpen: function (sender) {

                var loginContext;
                if ($(sender).hasClass("b2b")) {
                    loginContext = { isCompanyLanding: true };
                } else {
                    loginContext = { isCompanyLanding: false };
                }

                //load data
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "/API/Login/LoginClientViewModel",
                    data: JSON.stringify(loginContext),
                    dataType: "json",
                    success: function (data) {
                        var serverViewModel = data;


                        app.viewModels.LoginViewModel.loadFromJSON(serverViewModel.LoginPopupViewModel);
                        ko.applyBindings(app.viewModels, $('#loginpopup').get(0));
                        $.publish("EXCHANGE.lightbox.login.loaded");
                        $('#txtUsername').focus();


                    }
                });
            },
            beforeSubmit: function () {
                //determine if we should close, return false to prevent
                return true;
            },
            afterClose: function () {
                //clean up stuff on screen
                $('#loginpopup').hide();
                ns.showLoginForm();

                app.viewModels.LoginValidationViewModel = app.models.LoginValidationViewModel();
                app.viewModels.ResetPasswordValidationViewModel = app.models.ResetPasswordValidationViewModel();

                app.viewModels.LoginViewModel.displayAccountExistsContent(false);

            },
            showWaitPopup: true
        });


    };

} (EXCHANGE));
