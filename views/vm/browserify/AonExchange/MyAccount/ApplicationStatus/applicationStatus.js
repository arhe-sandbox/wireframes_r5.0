(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.applicationStatus");

    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializePage();
        app.enrollmentPlanDetails.initializeEnrollmentPlanDetails();
        app.decisionSupport.initializeDecisionSupport();
    });

    ns.initializePage = function initializePage() {
        ns.setupViewModels();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/ApplicationStatusViewModel",
            dataType: "json",
            success: function (data) {
                app.viewModels.ApplicationStatusViewModel.loadFromJSON(data);
                ns.setupAccordions();
        
                if (EXCHANGE.user.UserSession.IsLoggedIn() && (EXCHANGE.user.UserSession.UserProfile.userName == null || EXCHANGE.user.UserSession.UserProfile.userName == "" || EXCHANGE.user.UserSession.UserProfile.userName == "No Account Created") && EXCHANGE.user.UserSession.Agent().Id() == "00000000-0000-0000-0000-000000000000") {
                    ko.applyBindings(app.viewModels.ApplicationStatusViewModel, $('#ybr-create-account-auth-popup').get(0));
                    $.publish('EXCHANGE.lightbox.ybrcreateaccountauth.open');
                }

            }
        });
    };

    ns.seeVoiceSignature = function seeVoiceSignature(enrollment) {
        var applicationNumber = enrollment.ApplicationNumber;    
        EXCHANGE.viewModels.VoiceSignatureViewModel.ApplicationNumber(applicationNumber);
        $.publish("EXCHANGE.lightbox.voiceSignature.open");                   
    };

    ns.redirectToEsign = function redirectToEsign(enrollment) {       
        var enrollmentId = enrollment.Id;
        app.functions.redirectToRelativeUrlFromSiteBase("/electronicsign.aspx?eid=" + enrollmentId);              
    };

    ns.setupViewModels = function setupViewModels() {

        if (!app.viewModels.ApplicationStatusViewModel) {

            app.viewModels.ApplicationStatusViewModel = new app.models.ApplicationStatusViewModel();
            ko.applyBindings(app.viewModels, $('#app-status').get(0));

            app.viewModels.ApplicationStatusViewModel.CreateAccountAuthViewModel.backButtonClass('lightbox-back-ybrcreateaccountauth');
            app.viewModels.ApplicationStatusViewModel.CreateAccountAuthViewModel.continueButtonClass('lightbox-done-ybrcreateaccountauth');

            var ybrCreateAccountAuthLb = new EXCHANGE.lightbox.Lightbox({
                name: 'ybrcreateaccountauth',
                divSelector: '#ybr-create-account-auth-popup',
                openButtonSelector: '#ybr-create-account-auth-open-button',
                closeButtonSelector: '#ybr-create-account-auth-close-button',
                beforeOpen: function () {
                     $('#ybrcreateaccountpopup').find('#ybr-label').removeClass('hide-label');
                     $('#ybrcreateaccountpopup').find('#step-label').addClass('hide-label');
                    return true;
                },
                beforeSubmit: function () {
                    ns.submitNewAccountInfo();
                    return false;
                },
                afterClose: function () {
                    $('#ybrcreateaccountpopup').find('#step-label').removeClass('hide-label');
                    $('#ybrcreateaccountpopup').find('#ybr-label').addClass('hide-label');
                }
            });

        }
    };

    ns.setupAccordions = function setupAccordions() {
        $(".accordionButton").each(function () {
            if ($(this).hasClass("on")) {
                $(this).next().show();
            } else {
                $(this).next().hide();
            }

        });

       // app.functions.setupAccordions(true);

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

    ns.submitNewAccountInfo = function submitNewAccountInfo() {
        var viewModel = app.viewModels.ApplicationStatusViewModel;

        var $accountInfoSpinner = $('.lightbox-done-ybrcreateaccountauth').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
        ns.clearAuthLightboxErrors();

        var newAccount = {
            Username: viewModel.CreateAccountAuthViewModel.username_tb(),
            Password1: viewModel.CreateAccountAuthViewModel.pw1_tb(),
            Password2: viewModel.CreateAccountAuthViewModel.pw2_tb(),
         };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/YBRCreateAccount",
            dataType: "json",
            data: JSON.stringify(newAccount),
            success: function (serverViewModel) {
                ns.clearAuthLightboxErrors();
                $accountInfoSpinner.Stop();

                if (serverViewModel.ValidationResult.IsValid) {
                    //app.viewModels.CompanyLandingPageViewModels.CompanyAuthOptionsViewModel.RedirectToMyActionNeededFlag = true;

                    //copy / pasted and edited, from login.js
                    var loginViewModel = serverViewModel.LoginValidationModel;
                    if (loginViewModel.LoginConflictViewModel.IsConflict) {
                        ns.checkProfileConflict();
                    } else {
                        app.login.setQueryStringAndReload();
                    }
                    //end copy paste
                } else {
                    ns.loadAuthLightboxErrors(serverViewModel.ValidationResult.Errors);
                }

            }
        });
    };

    ns.checkProfileConflict = function checkProfileConflict() {
        app.viewModels.LoginConflictViewModel.doneCallback = app.login.setQueryStringAndReload;
        $.publish("EXCHANGE.lightbox.ybrcreateaccountauth.close");
        $.publish("EXCHANGE.lightbox.loginconflict.open");
    };


    ns.clearAuthLightboxErrors = function clearAuthLightboxErrors() {
        app.viewModels.ApplicationStatusViewModel.CreateAccountAuthViewModel.errors([]);
        $('#ybrcreateaccountpopup').find('input').removeClass('error-field');
    };

    ns.setErrorFieldOnAuthLightbox = function setErrorFieldOnAuthLightbox(controlClass) {
        $('#ybrcreateaccountpopup').find(controlClass).addClass('error-field');
    };

    ns.loadAuthLightboxErrors = function loadAuthLightboxErrors(inlineErrors) {
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "Username") {
                ns.setErrorFieldOnAuthLightbox('.username');
            } else if (inlineErrors[i].PropertyName == "Password1" || inlineErrors[i].PropertyName == "Password2") {
                ns.setErrorFieldOnAuthLightbox('.password1');
                ns.setErrorFieldOnAuthLightbox('.password2');
            }
            app.viewModels.ApplicationStatusViewModel.CreateAccountAuthViewModel.errors.push(inlineErrors[i].ErrorMessage);
        }
    };

} (EXCHANGE));
