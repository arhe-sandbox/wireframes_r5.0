(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.DirectedLanding");
    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializePage();
    });

    ns.initializePage = function initializePage() {
        app.viewModels.DirectedLandingBasicInfoViewModel = EXCHANGE.models.DirectedLandingBasicInfoViewModel();
        ko.applyBindings(EXCHANGE.viewModels, $('.directedLandingBasicInfoContainer').get(0));

        app.functions.setupPhoneFormatting();
        ns.loadViewModel();

        // This element is in Kentico, not on our .ascx
        $('#landingFind').bind('click', function () {
            ns.submitData();
        });
    };

    ns.loadViewModel = function obtainData() {
        var argsObj =
            {
                CampaignCode: app.functions.getKeyValueFromWindowLocation("camp"),
                TrackingCode1: app.functions.getKeyValueFromWindowLocation("t1"),
                TrackingCode2: app.functions.getKeyValueFromWindowLocation("t2")
            };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/DirectedLanding/DirectedLandingBasicInfoViewModel",
            data: JSON.stringify(argsObj),
            dataType: "json",
            success: function (data) {
                var serverViewModel = data;
                app.viewModels.DirectedLandingBasicInfoViewModel.loadFromJSON(serverViewModel);

                // Ensure IE handles any "placeholder" attributes in the HTML elements, since by default, IE doesn't have that capability.
                app.placeholder.applyPlaceholder();
            }
        });
    };

    ns.submitData = function submitData() {
        EXCHANGE.WaitPopup = $(window).WaitPopup();
        var viewModel = EXCHANGE.viewModels.DirectedLandingBasicInfoViewModel;
        var argsObj =
            {
                FirstName: viewModel.FirstName(),
                LastName: viewModel.LastName(),
                PhoneNumber: viewModel.PhoneNumber(),
                Email: viewModel.Email(),
                ZipCode: viewModel.ZipCode()
            };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/DirectedLanding/SubmitBasicInfo",
            data: JSON.stringify(argsObj),
            dataType: "json",
            success: function (data) {
                var serverValidationModel = data;
                if (serverValidationModel.ValidationResult.IsValid) {
                    // If the entered info was valid, and the user is redirected to "find-plans". 
                    // However, but "find-plans" needs to know that this PPC Landing page was the preceeding 
                    // page, and that info isn't important enough to save to session. That is why the query string 
                    // value is used instead. 
                    var location = "find-plans.aspx?zip=" + viewModel.ZipCode() + "&phone=" +viewModel.PhoneNumber()+ "&message=true";
                    app.functions.redirectToRelativeUrlFromSiteBase(location);
                } else {
                    ns.loadPersonalInfoErrors(serverValidationModel.ValidationResult.Errors);
                    $(".feature-col-right").addClass("feature-col-right-error");

                    // This id is on a Kentico web part!
                    $('#kenticoLayout1HeadingTextId').hide();
                    
                    EXCHANGE.WaitPopup.Close();
                }
            }, 
            error: function(data) {
                EXCHANGE.WaitPopup.Close();
            }
        });
    };

    ns.loadPersonalInfoErrors = function loadPersonalInfoErrors(inlineErrors) {
        ns.clearErrors();
        for (var i = 0; i < inlineErrors.length; i++) {
            if (inlineErrors[i].PropertyName == "FirstName") {
                ns.setErrorFieldById("#directedLandingFirstName");
            } else if (inlineErrors[i].PropertyName == "LastName") {
                ns.setErrorFieldById("#directedLandingLastName");
            } else if (inlineErrors[i].PropertyName == "PhoneNumber") {
                ns.setErrorFieldById("#directedLandingPhoneNumber");
            } else if (inlineErrors[i].PropertyName == "PhoneNumberWithEnteredValue") {
                ns.setErrorFieldById("#directedLandingPhoneNumber");
                app.viewModels.DirectedLandingBasicInfoViewModel.Errors.push(inlineErrors[i].ErrorMessage);
            } else if (inlineErrors[i].PropertyName == "Email") {
                ns.setErrorFieldById("#directedLandingEmail");
            } else if (inlineErrors[i].PropertyName == "EmailWithEnteredValue") {
                ns.setErrorFieldById("#directedLandingEmail");
                app.viewModels.DirectedLandingBasicInfoViewModel.Errors.push(inlineErrors[i].ErrorMessage);
            } else if (inlineErrors[i].PropertyName == "ZipCode") {
                ns.setErrorFieldById("#directedLandingZipCode");
            } else if (inlineErrors[i].PropertyName == "ZipCodeWithEnteredValue") {
                ns.setErrorFieldById("#directedLandingZipCode");
                app.viewModels.DirectedLandingBasicInfoViewModel.Errors.push(inlineErrors[i].ErrorMessage);
            } else if (inlineErrors[i].PropertyName == "RequiredFields") {
                app.viewModels.DirectedLandingBasicInfoViewModel.Errors.push(inlineErrors[i].ErrorMessage);
            }
        }
    };

    ns.setErrorFieldById = function setErrorFieldOnIdPersonalInfo(itemId) {
        $("#directedLandingBasicInfoForm").find(itemId).addClass('error-field');
    };

    ns.clearErrors = function clearErrors() {
        app.viewModels.DirectedLandingBasicInfoViewModel.Errors([]);
        $("#directedLandingBasicInfoForm").find('input').removeClass('error-field');
    };

} (EXCHANGE));