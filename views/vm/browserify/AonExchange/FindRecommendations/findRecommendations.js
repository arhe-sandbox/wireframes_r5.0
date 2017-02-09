(function (app) {
    //"use strict";
    app.namespace('EXCHANGE.viewModels');
    app.namespace('EXCHANGE.models');
    var ns = app.namespace("EXCHANGE.findRecommendations");

    ns.IntegratedGuidanceTabTypes = {
        BASICINFO: 0,
        MEDICATIONS: 1,
        DOCTORS: 2,
        MEDICALUSAGE: 3,
        PREFERENCES: 4
    };

    ns.inlineErrors = new Array();

    $(document).ready(function () {
        ns.initializePage();
        ns.SetCssTotabs();
    });


    //This might get changed when we receive the original cosmital. -- Ravi
    ns.SetCssTotabs = function SetCssTotabs() {
        $('#tabs').tabs().addClass('ui-tabs-vertical ui-helper-clearfix');
        $(".ui-widget-content").removeClass("ui-widget-content");
        $('#tabs').attr("style", "border:1px solid #aaaaaa;font: 13px arial, helvetica, sans-serif; color: #4d4f53;");
        $('.ui-tabs-nav').attr("style", "font: 13px arial, helvetica, sans-serif; color: #4d4f53;");
    }

    ns.initializePage = function initializePage() {
        $('.planrec-btn').addClass('plan-disabled');

        // EXCHANGE.AdjustWaitPopupMask();
        // Bug 72173

        //        if (EXCHANGE.WaitPopup.FindRec.findRecommendationsClientViewModel = null || EXCHANGE.WaitPopup.FindRec.findRecommendationsClientViewModel == undefined) {
        //            alert("inside");
        //        }
        app.decisionSupport.initializeDecisionSupport();
        app.viewModels.MyDrugsVM = new app.models.MyDrugsVM();
        app.viewModels.recTargetDateViewModel = new app.models.recTargetDateViewModel();
        app.viewModels.UtilisationViewModel = new app.models.UtilisationViewModel();
        ko.applyBindings(app.viewModels, $('#my-drugs').get(0));
        app.viewModels.SearchResultsViewModel = app.models.SearchResultsViewModel()
        app.viewModels.findRecommendationsViewModel = EXCHANGE.models.findRecommendationsViewModel();
        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.FindRec.findRecommendationsClientViewModel");


        ns.findRecommendationsModelLoad();
        ko.applyBindings(EXCHANGE.viewModels.UtilisationViewModel, $('#utilisation').get(0));
        ko.applyBindings(EXCHANGE.viewModels.UtilisationViewModel, $('#planPreferences').get(0));
        app.viewModels.CallUsPopupViewModel = app.models.CallUsPopupViewModel();


        ko.applyBindings(app.viewModels, $('#drug-lightbox').get(0));
        ns.setupLightboxes();
        ns.wireupJqueryEvents();
        app.shoppingCart.initializeLightboxes();

    };

    ns.setupLightboxes = function setupLightboxes() {
        var callusLb = new app.lightbox.Lightbox({
            name: 'callus',
            divSelector: '#call-us-popup',
            openButtonSelector: '#callus-open-button',
            closeButtonSelector: '#callus-close-button'
        });

        var ndcnotrecogniedLb = new app.lightbox.Lightbox({
            name: 'ndcnotrec',
            divSelector: '#ndc-not-rec-popup',
            openButtonSelector: '#ndcnotrec-open-button',
            closeButtonSelector: '#ndcnotrec-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#ndc-not-rec-popup').get(0));
                return true;
            },
            afterOpen: function () {

            }

        });
    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $('#seePlansButton').live('click', ns.seePlansClick);
        $('#previousMedButton').live('click', ns.RedirectToFindPlans);
        $("#radio-toggle, .coverage-toggle").buttonset();
        $("#btnNext").live("click", ns.IntegaratedGuidanceNext)
        $("#btnPrevious").live("click", ns.IntegaratedGuidancePrevious)
    };

    ns.RedirectToFindPlans = function RedirectToFindPlans() {
        app.functions.redirectToRelativeUrlFromSiteBase("/find-plans.aspx")
    };

    ns.IntegaratedGuidancePrevious = function IntegaratedGuidancePrevious() {
        var currentTab = EXCHANGE.viewModels.findRecommendationsViewModel.currentTab();

        switch (currentTab) {
            case EXCHANGE.findRecommendations.IntegratedGuidanceTabTypes.BASICINFO:
                //$('#ancMedications').click();
                EXCHANGE.viewModels.findRecommendationsViewModel.currentTab(0);
                return false;
                break;
            case EXCHANGE.findRecommendations.IntegratedGuidanceTabTypes.MEDICATIONS:
                $('#ancBasicInfo').click();
                break;
            case EXCHANGE.findRecommendations.IntegratedGuidanceTabTypes.DOCTORS:
                $('#ancMedications').click();
                break;
            case EXCHANGE.findRecommendations.IntegratedGuidanceTabTypes.MEDICALUSAGE:
                $('#ancOptum').click();
                break;
            //            case EXCHANGE.findRecommendations.IntegratedGuidanceTabTypes.PREFERENCES:   
            //                $('#ancUtilization').click();   
            //                break;   
        }
        currentTab = currentTab - 1;
        EXCHANGE.viewModels.findRecommendationsViewModel.currentTab(currentTab)
        return false;
    }

    ns.IntegaratedGuidanceNext = function IntegaratedGuidanceNext() {
        var currentTab = EXCHANGE.viewModels.findRecommendationsViewModel.currentTab();

        switch (currentTab) {
            case EXCHANGE.findRecommendations.IntegratedGuidanceTabTypes.BASICINFO:
                if (EXCHANGE.findPlans.seePlansClick())
                    $('#ancMedications').click();
                else
                    return false;

                break;
            case EXCHANGE.findRecommendations.IntegratedGuidanceTabTypes.MEDICATIONS:
                if (!ns.MedCabinetValidation()) {
                    return false;
                }
                else {
                    $('#ancOptum').click();
                }
                break;
            case EXCHANGE.findRecommendations.IntegratedGuidanceTabTypes.DOCTORS:
                if (!ns.OptumValidation()) {
                    return false;
                }
                else {
                    $('#ancUtilization').click();
                }
                break;
            case EXCHANGE.findRecommendations.IntegratedGuidanceTabTypes.MEDICALUSAGE:
                //                if (!ns.UtilizationValidation()) {
                //                    return false;
                //                }
                //                else {
                //                    $('#ancPlanPreferences').click();
                //                }
                if (!ns.UtilizationValidation()) {
                    return false;
                }
                else {
                    EXCHANGE.viewModels.findRecommendationsViewModel.currentTab(0)
                    $('#seePlansButton').click();
                    return false;
                }
                break;
            //            case EXCHANGE.findRecommendations.IntegratedGuidanceTabTypes.PREFERENCES:   
            //                if (!ns.PlanPreferencesValidation()) {   
            //                    return false;   
            //                }   
            //                else {   
            //                    EXCHANGE.viewModels.findRecommendationsViewModel.currentTab(0)   
            //                    $('#seePlansButton').click();   
            //                    return false;   
            //                }   
            //                break;   
        }
        currentTab = currentTab + 1;
        EXCHANGE.viewModels.findRecommendationsViewModel.currentTab(currentTab)
        return false;
    }

    ns.OptumValidation = function OptumValidation() {
        var args = {
            DoctorNetwork: EXCHANGE.viewModels.OptumViewModel.docInNetwork_boundToSelectValue(),
            DoctorDuration: EXCHANGE.viewModels.OptumViewModel.docDuration_boundToSelectValue()

        };

        var validValues = true;
        var isDoctorValid = true;
        $("#ddlDoctorValidationMessage").addClass("hide-menu");

        if (app.viewModels.OptumViewModel.chosenAnswer() == undefined) {
            app.viewModels.OptumViewModel.validationMessage("Please select an answer.");
            validValues = false;
        }
        if (app.viewModels.OptumViewModel.chosenAnswer()) {

            if (args.DoctorNetwork && $("#ddl-DoctorInNetwork") && args.DoctorNetwork == "none") {
                $("#ddl-DoctorInNetwork").addClass("ddl-FindRecom-EmptySurround")
                validValues = false;
                isDoctorValid = false;
            }
            else {
                $("#ddl-DoctorInNetwork").removeClass("ddl-FindRecom-EmptySurround")
            }
            if (args.DoctorDuration && $("#ddl-DoctorDuration") && args.DoctorDuration == "none") {
                $("#ddl-DoctorDuration").addClass("ddl-FindRecom-EmptySurround")
                validValues = false;
                isDoctorValid = false;
            }
            else {
                $("#ddl-DoctorDuration").removeClass("ddl-FindRecom-EmptySurround")
            }
        }

        if (app.viewModels.OptumViewModel.chosenAnswer() == true) {
            if (app.viewModels.OptumViewModel.physicians() && app.viewModels.OptumViewModel.physicians().length == 0)
                validValues = false;
        }
        if (!isDoctorValid) {
            $("#ddlDoctorValidationMessage").removeClass("hide-menu");
        }
        if (validValues == false) {
            return false;
        }
        else {
            return true;
        }
    }

    ns.UtilizationValidation = function UtilizationValidation() {
        var validValues = true;
        $("#ddlMedicalValidationMessage").addClass("hide-menu");
        var args = {
            PrimaryCareVisits: EXCHANGE.viewModels.UtilisationViewModel.primaryCare_boundToSelectValue(),
            HospitalStaysCustomer: EXCHANGE.viewModels.UtilisationViewModel.hospitalVisit_boundToSelectValue(),
            SpecialistVisitsCustomer: EXCHANGE.viewModels.UtilisationViewModel.specialistVisit_boundToSelectValue()
        };

        if (args.PrimaryCareVisits && $("#ddl-primaryCareList") && args.PrimaryCareVisits == "none") {
            $("#ddl-primaryCareList").addClass("ddl-FindRecom-EmptySurround")
            validValues = false;
        }
        if (args.HospitalStaysCustomer && $("#ddl-hospitalVisitList") && args.HospitalStaysCustomer == "none") {
            $("#ddl-hospitalVisitList").addClass("ddl-FindRecom-EmptySurround")
            validValues = false;
        }
        if (args.SpecialistVisitsCustomer && $("#ddl-specialistVisitList") && args.SpecialistVisitsCustomer == "none") {
            $("#ddl-specialistVisitList").addClass("ddl-FindRecom-EmptySurround")
            validValues = false;
        }
        if (validValues == false) {
            $("#ddlMedicalValidationMessage").removeClass("hide-menu");
            return false;
        }
        else {
            return true;
        }
    }


    ns.MedCabinetValidation = function MedCabinetValidation() {
        var validValues = true;

        if (app.viewModels.MyDrugsVM.chosenAnswer() == true && app.viewModels.MyDrugsVM.drugs().length > 0) {
            if (app.user && app.user.UserSession && app.user.UserSession.ShowRxPreloadLb()) {
                app.viewModels.MyDrugsVM.ValidationMessage("Please enter at least one medication.");
                validValues = false;
            }
            else {
                validValues = true;
                app.viewModels.MyDrugsVM.ValidationMessage("");
            }
        }

        if (app.viewModels.MyDrugsVM.chosenAnswer() == false) {
            if (app.viewModels.MyDrugsVM.drugs().length == 0)
                validValues = true;
            app.viewModels.MyDrugsVM.ValidationMessage("");
        }

        if (app.viewModels.MyDrugsVM.chosenAnswer() == true) {
            if (app.viewModels.MyDrugsVM.drugs().length == 0)
                validValues = false;
        }

        if (validValues == false || app.viewModels.MyDrugsVM.chosenAnswer() == undefined) {
            return false;
        }
        else {
            return true;
        }
    }

    ns.PlanPreferencesValidation = function PlanPreferencesValidation() {
        $("#radioPlanPreferencesMessage").addClass("hide-menu");

        if ((app.viewModels.UtilisationViewModel.planPreference_selectedValue() == undefined) || (app.viewModels.UtilisationViewModel.planPreference_selectedValue() == "none")) {
            $("#radioPlanPreferencesMessage").removeClass("hide-menu");
            return false;
        }
        else {
            return true;
            //$('#seePlansButton').click();
        }
    }

    ns.seePlansClick = function seePlansClick(event) {
        //event.returnValue = false;
        //EXCHANGE.ButtonSpinner = $(this).ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
        //// Reuse this method if possible for saving drop down values   
        var args = {
            DoctorNetwork: EXCHANGE.viewModels.OptumViewModel.docInNetwork_boundToSelectValue(),
            DoctorDuration: EXCHANGE.viewModels.OptumViewModel.docDuration_boundToSelectValue(),
            PrimaryCareVisits: EXCHANGE.viewModels.UtilisationViewModel.primaryCare_boundToSelectValue(),
            HospitalStaysCustomer: EXCHANGE.viewModels.UtilisationViewModel.hospitalVisit_boundToSelectValue(),
            SpecialistVisitsCustomer: EXCHANGE.viewModels.UtilisationViewModel.specialistVisit_boundToSelectValue(),
            PlanPreference: EXCHANGE.viewModels.UtilisationViewModel.planPreference_selectedValue(),
            PharmacyPreference: EXCHANGE.viewModels.UtilisationViewModel.pharmacyPreference_selectedValue()
        };
        var isvalid = true;
        var isDoctorValid = true;
        var isMedicalValid = true;
        var validValues = false;
        var RxOptOut = null;
        var PhysicianOptOut = null;
        var isplanPreference = true;

        $("#ddlDoctorValidationMessage").addClass("hide-menu");
        $("#ddlMedicalValidationMessage").addClass("hide-menu");
        $("#radioPlanPreferencesMessage").addClass("hide-menu");

        if (app.viewModels.MyDrugsVM.chosenAnswer() == true && app.viewModels.MyDrugsVM.drugs().length > 0) {
            if (app.user && app.user.UserSession && app.user.UserSession.ShowRxPreloadLb()) {
                app.viewModels.MyDrugsVM.ValidationMessage("Please enter at least one medication.");
                validValues = false;
            }
            else {
                validValues = true;
                app.viewModels.MyDrugsVM.ValidationMessage("");
            }
        }
        if (app.viewModels.MyDrugsVM.chosenAnswer() == false) {
            RxOptOut = true;
            if (app.viewModels.MyDrugsVM.drugs().length == 0)
                validValues = true;
            app.viewModels.MyDrugsVM.ValidationMessage("");
        }
        if (app.viewModels.MyDrugsVM.chosenAnswer() == true) {
            RxOptOut = false;
            if (app.viewModels.MyDrugsVM.drugs().length == 0)
                validValues = false;
        }

        if (app.viewModels.OptumViewModel.chosenAnswer() == undefined) {
            app.viewModels.OptumViewModel.validationMessage("Please select an answer.");
            PhysicianOptOut = null;
            validValues = false;
        }
        if (app.viewModels.MyDrugsVM.chosenAnswer() == undefined) {
            app.viewModels.MyDrugsVM.ValidationMessage("Please select an answer.");
            RxOptOut = null;
            validValues = false;
        }

//        if ((app.viewModels.UtilisationViewModel.planPreference_selectedValue() == undefined) || (app.viewModels.UtilisationViewModel.planPreference_selectedValue() == "none")) {
//            isvalid = false;
//            isplanPreference = false;
//            $("#radioPlanPreferencesMessage").removeClass("hide-menu");
//        }

        if (app.viewModels.OptumViewModel.chosenAnswer()) {

            if (args.DoctorNetwork && $("#ddl-DoctorInNetwork") && args.DoctorNetwork == "none") {
                $("#ddl-DoctorInNetwork").addClass("ddl-FindRecom-EmptySurround")
                isvalid = false;
                isDoctorValid = false;
            }
            if (args.DoctorDuration && $("#ddl-DoctorDuration") && args.DoctorDuration == "none") {
                $("#ddl-DoctorDuration").addClass("ddl-FindRecom-EmptySurround")
                isvalid = false;
                isDoctorValid = false;
            }
        }
        if (args.PrimaryCareVisits && $("#ddl-primaryCareList") && args.PrimaryCareVisits == "none") {
            $("#ddl-primaryCareList").addClass("ddl-FindRecom-EmptySurround")
            isvalid = false;
            isMedicalValid = false;
        }
        if (args.HospitalStaysCustomer && $("#ddl-hospitalVisitList") && args.HospitalStaysCustomer == "none") {
            $("#ddl-hospitalVisitList").addClass("ddl-FindRecom-EmptySurround")
            isvalid = false;
            isMedicalValid = false;
        }
        if (args.SpecialistVisitsCustomer && $("#ddl-specialistVisitList") && args.SpecialistVisitsCustomer == "none") {
            $("#ddl-specialistVisitList").addClass("ddl-FindRecom-EmptySurround")
            isvalid = false;
            isMedicalValid = false;
        }

        if (app.viewModels.OptumViewModel.chosenAnswer() == false) {
            PhysicianOptOut = true;
        } else if (app.viewModels.OptumViewModel.chosenAnswer() == true) {
            PhysicianOptOut = false;
            if (app.viewModels.OptumViewModel.physicians() && app.viewModels.OptumViewModel.physicians().length == 0)
                validValues = false;
        }
        if ($('ul#dk0-listbox.dk-select-options').find('.dk-option-selected').attr("id") == "dk0-Select-Date") {
            validValues = false;
        }
        //else if ($('#TargetDate .dk-selected').attr('aria-activedescendant') == "dk0-Select-Date") {
        //  validValues = false;
        //}
        if (validValues != true) {
            if (RxOptOut != null && PhysicianOptOut != null) {
                var jsObjTemp = { "RxOptOut": RxOptOut,
                    "PhysicianOptOut": PhysicianOptOut
                };
                var paramsJsonTemp = JSON.stringify(jsObjTemp);
                ns.updateOptOut(paramsJsonTemp);
            }
            if (!isMedicalValid) {
                $("#ddlMedicalValidationMessage").removeClass("hide-menu");
            }
            if (!isDoctorValid) {
                $("#ddlDoctorValidationMessage").removeClass("hide-menu");
            }
            if (!isplanPreference) {
                $("#radioPlanPreferencesMessage").removeClass("hide-menu");
            }
            return;
        }

        args = JSON.stringify(args);
        if (isvalid) {
            $("#ddlDoctorValidationMessage").addClass("hide-menu");
            $("#ddlMedicalValidationMessage").addClass("hide-menu");
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Recommendations/SavePicwellSurveyPhysNetwork",
                dataType: "json",
                data: args,
                success: function (data) {
                    EXCHANGE.viewModels.UtilisationViewModel.validationMessage("");
                    EXCHANGE.viewModels.UtilisationViewModel.SavedMessage("Changes saved!");
                    //ResetDropDownsCss();


                    EXCHANGE.WaitPopup = $(window).WaitPopup({ contentTemplate: true }); //Spint 9 - Template B for Rec Results page
                    var coverageAnswer = "0";
                    coverageAnswer = EXCHANGE.functions.getDropdownSelectedValueBySelectElementId('productTypesSelectList');

                    var jsObj = { "recommendedCoverageAnswer": coverageAnswer,
                        "RxOptOut": RxOptOut,
                        "PhysicianOptOut": PhysicianOptOut,
                        "TargetDate": EXCHANGE.functions.getDropdownSelectedOption('#coverageBeginsDiv')

                    };
                    var paramsJson = JSON.stringify(jsObj);

                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/API/Recommendations/ValidateApplicantDetails",
                        data: paramsJson,
                        dataType: "json",
                        success: function (data) {

                            var inlineErrorExist = ns.loadInlineErrors(data.ErrorValidationResult);
                            var popupErrorsExist = ns.loadPopupErrors(data.ErrorValidationResult);
                            if (popupErrorsExist) {
                                app.viewModels.CallUsPopupViewModel.isWarningPopup(true);
                            } else {
                                //                    ns.loadPopupWarnings(data.WarningValidationResult);
                                app.viewModels.CallUsPopupViewModel.isWarningPopup(true);
                            }
                            if (inlineErrorExist) {
                                ns.displayInlineErrors();
                                EXCHANGE.WaitPopup.Close();
                            } else if (app.viewModels.CallUsPopupViewModel.errorText().length > 0) {
                                $.publish("EXCHANGE.lightbox.callus.open");
                                EXCHANGE.WaitPopup.Close();
                            } else {
                                if (data.IsNDCNotRec == true) {
                                    $.publish("EXCHANGE.lightbox.ndcnotrec.open");
                                }
                                else {
                                    app.functions.redirectToRelativeUrlFromSiteBase("integrated-results.aspx");
                                }
                                EXCHANGE.WaitPopup.Close();
                            }
                        },
                        error: function (data) {
                            EXCHANGE.WaitPopup.Close();
                        }
                    });
                },
                error: function (data) {

                }
            });
        }
        else {
            if (!isMedicalValid) {
                $("#ddlMedicalValidationMessage").removeClass("hide-menu");
            }
            if (!isDoctorValid) {
                $("#ddlDoctorValidationMessage").removeClass("hide-menu");
            }
            //$('html,body').scrollTop($('#seePlansButton').offset().top + "px");
        }
        //EXCHANGE.ButtonSpinner.Stop();

        //$('html,body').scrollTop($('#seePlansButton').offset().top + "px");

    };

    $('#contdbtn').live('click', function () {
        app.functions.redirectToRelativeUrlFromSiteBase("search-results.aspx");
    });

    ns.updateOptOut = function updateOptOut(paramsJson) {

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Recommendations/UpdateOptOut",
            data: paramsJson,
            dataType: "json",
            success: function (data) {

            },
            error: function (data) {

            }
        });

    };

    ns.findRecommendationsModelLoad = function findRecommendationsModelLoad() {
        $('.planrec-btn').addClass('plan-disabled');
        EXCHANGE.models.NDCNotRecPopupViewModel = new EXCHANGE.models.NDCNotRecPopupViewModel();
        //var waitpopup = $('#utlization-wrapper').WaitPopup({ hide: true, fullWindow: false, contentTemplate: true });
        //        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.FindRec.findRecommendationsClientViewModel");

        /* $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/API/Recommendations/UtilizationClientViewModel",
        success: function (data) {
        //validation step
        app.viewModels.UtilisationViewModel.loadFromJSON(data);
        setTimeout(ns.hoverDelay, 5);

        $('.planrec-btn').removeClass('plan-disabled');
        event.returnValue = false;
        EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.FindRec.findRecommendationsClientViewModel");
        },
        error: function (data) {
        //alert('Data Retrieval Error during Medical Service Utilization Load');
        }
        });*/

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Recommendations/findRecommendationsClientViewModel",
            success: function (data) {
                //                if (data == false) {
                //                    app.functions.redirectToRelativeUrlFromSiteBase("find-plans.aspx");
                //                }


                app.viewModels.findRecommendationsViewModel = app.viewModels.findRecommendationsViewModel.loadFromJSON(data);
                EXCHANGE.viewModels.MyDrugsVM.medicineCabinetAuthorizeMessage_Lbl(data.MedicineCabinetAuthorizeMessage_Lbl);
                EXCHANGE.models.NDCNotRecPopupViewModel.loadFromJSON(data);
                $('.selectfield').dropkick();
                $('.dk_toggle').find('span').css('background-image', 'none');
                $.publish("EXCHANGE.lightbox.invalidndc.open");

//                if (EXCHANGE.viewModels.FindPlansViewModel != undefined) {
//                    EXCHANGE.viewModels.FindPlansViewModel.coverageBegins_tb(EXCHANGE.viewModels.findRecommendationsViewModel.coverageAnswer());
//                }
                //event.returnValue = false;

                //                if (app.viewModels.findRecommendationsViewModel.coverageAnswer() == '2') {
                //                    $('#prescripOnly').attr('checked', true);
                //                };
                //                if (app.viewModels.findRecommendationsViewModel.coverageAnswer() == '1') {
                //                    $('#medicalOnly').attr('checked', true);
                //                };
                //                if (app.viewModels.findRecommendationsViewModel.coverageAnswer() == '0') {
                //                    $('#medicPrescrip').attr('checked', true);
                //                };
                $(".coverage-toggle").buttonset();

                $('#medicPrescrip').parent('div').removeClass('custom-radio');
                $('#medicalOnly').parent('div').removeClass('custom-radio');
                $('#prescripOnly').parent('div').removeClass('custom-radio');

                //setTimeout(EXCHANGE.Utilisation.hoverDelay, 5);

                $('.planrec-btn').removeClass('plan-disabled');
                //setTimeout(ns.hoverDelay, 5);

                if (app.viewModels.findRecommendationsViewModel.rxOptOutAnswer() === true) {
                    EXCHANGE.viewModels.MyDrugsVM.chosenAnswer(false);
                }
                if (EXCHANGE.viewModels.OptumViewModel && EXCHANGE.viewModels.OptumViewModel.chosenAnswer && (app.viewModels.findRecommendationsViewModel.physOptOutAnswer() === true)) {
                    EXCHANGE.viewModels.OptumViewModel.chosenAnswer(false);
                }

                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.FindRec.findRecommendationsClientViewModel");

            },
            error: function (data) {
                EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.FindRec.findRecommendationsClientViewModel");
            }
        });
    };



    // loads into the 'callus' popup all error messages that will prevent the user from proceeding to search-results
    ns.loadPopupErrors = function loadPopupErrors(data) {
        var hasPopupErrors = false;

        var errorStr = "";
        for (var i = 0; i < data.Errors.length; i++) {
            var error = data.Errors[i].ErrorMessage;
            if (error.indexOf("popup:") != -1) {
                var errorString = error.substring(error.indexOf("popup:") + "popup:".length);
                errorStr += "<p>" + errorString + "</p>";
                hasPopupErrors = true;
            }
        }
        app.viewModels.CallUsPopupViewModel = app.viewModels.CallUsPopupViewModel.setErrorText(errorStr);
        return hasPopupErrors;
    };

    // Loads into the 'callus' popup all warnings that the user must see before continuing on 
    // to search-results. Assumes no errors were previously loaded by ns.loadPopupErrors. 
    ns.loadPopupWarnings = function loadPopupWarnings(data) {
        var warningStr = "";
        for (var i = 0; i < data.Errors.length; ++i) {
            var error = data.Errors[i].ErrorMessage;
            if (error.indexOf("warning:") != -1) {
                var warningString = error.substring(error.indexOf("warning:") + "warning:".length);
                warningStr += "<p>" + warningString + "</p>";
            }
        }
        app.viewModels.CallUsPopupViewModel = app.viewModels.CallUsPopupViewModel.setErrorText(warningStr);
    };

    ns.loadInlineErrors = function loadInlineErrors(data) {
        var hasInlineErrors = false;


        app.viewModels.findRecommendationsViewModel.clearInlineErrors();
        ns.inlineErrors = [];
        for (var i = 0; i < data.Errors.length; i++) {
            var error = data.Errors[i].ErrorMessage;
            //  if (error.indexOf("inline:") != -1) {
            var errorString = error;    //error.substring(error.indexOf("inline:") + "inline:".length);

            ns.inlineErrors.push(data.Errors[i]);
            app.viewModels.findRecommendationsViewModel.addInlineError(errorString);
            hasInlineErrors = true;
            //  }
        }
        return hasInlineErrors;
    };

    ns.displayInlineErrors = function displayInlineErrors() {
        EXCHANGE.viewModels.UtilisationViewModel.validationMessage("Please save Medical Service Utilization data by clicking Save Changes button.");
    };

    ns.removeInlineErrors = function removeInlineErrors() {
    };

    ns.closeLightboxes = function closeLightboxes() {
        $.publish("EXCHANGE.lightbox.closeAll");
    };


} (EXCHANGE));

////Enable indexOf and EventListener methods for IE 8
//!function () { if (Array.prototype.indexOf || (Array.prototype.indexOf = function (a, b) { var c, d, e = b ? b : 0; if (!this) throw new TypeError; if (d = this.length, 0 === d || e >= d) return -1; for (0 > e && (e = d - Math.abs(e)), c = e; d > c; c++) if (this[c] === a) return c; return -1 }), Array.prototype.forEach || (Array.prototype.forEach = function (a) { if (void 0 === this || null === this) throw new TypeError; var b = Object(this), c = b.length >>> 0; if ("function" != typeof a) throw new TypeError; for (var d = arguments.length >= 2 ? arguments[1] : void 0, e = 0; c > e; e++) e in b && a.call(d, b[e], e, b) }), Event.prototype.preventDefault || (Event.prototype.preventDefault = function () { this.returnValue = !1 }), Event.prototype.stopPropagation || (Event.prototype.stopPropagation = function () { this.cancelBubble = !0 }), !Element.prototype.addEventListener) { var a = [], b = function (b, c) { var d = this, e = function (a) { a.target = a.srcElement, a.currentTarget = d, c.handleEvent ? c.handleEvent(a) : c.call(d, a) }; if ("DOMContentLoaded" == b) { var f = function (a) { "complete" == document.readyState && e(a) }; if (document.attachEvent("onreadystatechange", f), a.push({ object: this, type: b, listener: c, wrapper: f }), "complete" == document.readyState) { var g = new Event; g.srcElement = window, f(g) } } else this.attachEvent("on" + b, e), a.push({ object: this, type: b, listener: c, wrapper: e }) }, c = function (b, c) { for (var d = 0; d < a.length; ) { var e = a[d]; if (e.object == this && e.type == b && e.listener == c) { "DOMContentLoaded" == b ? this.detachEvent("onreadystatechange", e.wrapper) : this.detachEvent("on" + b, e.wrapper); break } ++d } }; Element.prototype.addEventListener = b, Element.prototype.removeEventListener = c, HTMLDocument && (HTMLDocument.prototype.addEventListener = b, HTMLDocument.prototype.removeEventListener = c), Window && (Window.prototype.addEventListener = b, Window.prototype.removeEventListener = c) } } ();

//!function (e, t, s) {
//    e.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), e.isIframe = e.parent != e.self && location.host === parent.location.host;
//    var a = {}, l = 0, n = function (s, i) {
//        var l;
//        return e.isMobile && !i.mobile ? !1 : this === e ? new n(s, i) : ("string" == typeof s && "#" === s[0] && (s = t.getElementById(s.substr(1))), (l = s.getAttribute("data-dkcacheid")) ? (r.extend(a[l].data.settings, i), a[l]) : "SELECT" === s.nodeName ? this.init(s, i) : void 0)
//    }, o = function () {
//    }, d = { initialize: o, change: o, open: o, close: o, search: "strict" }, r = { hasClass: function (e, t) {
//        var s = new RegExp("(^|\\s+)" + t + "(\\s+|$)");
//        return e && s.test(e.className)
//    }, addClass: function (e, t) {
//        e && !r.hasClass(e, t) && (e.className += " " + t)
//    }, removeClass: function (e, t) {
//        var s = new RegExp("(^|\\s+)" + t + "(\\s+|$)");
//        e && (e.className = e.className.replace(s, " "))
//    }, toggleClass: function (e, t) {
//        var s = r.hasClass(e, t) ? "remove" : "add";
//        r[s + "Class"](e, t)
//    }, extend: function (e) {
//        return Array.prototype.slice.call(arguments, 1).forEach(function (t) {
//            if (t)
//                for (var s in t)
//                    e[s] = t[s]
//            }), e
//        }, offset: function (s) {
//            var i = s.getBoundingClientRect() || { top: 0, left: 0 }, a = t.documentElement;
//            return { top: i.top + e.pageYOffset - a.clientTop, left: i.left + e.pageXOffset - a.clientLeft }
//        }, position: function (e, t) {
//            for (var s = { top: 0, left: 0 }; e !== t; )
//                s.top += e.offsetTop, s.left += e.offsetLeft, e = e.parentNode;
//            return s
//        }, closest: function (e, t) {
//            for (; e; ) {
//                if (e === t)
//                    return e;
//                e = e.parentNode
//            }
//            return !1
//        }, create: function (e, s) {
//            var i, a = t.createElement(e);
//            s || (s = {});
//            for (i in s)
//                s.hasOwnProperty(i) && ("innerHTML" == i ? a.innerHTML = s[i] : a.setAttribute(i, s[i]));
//            return a
//        }
//    };
//    n.prototype = { add: function (e, s) {
//        var i, a, l;
//        "string" == typeof e && (i = e, e = t.createElement("option"), e.text = i), "OPTION" === e.nodeName && (a = r.create("li", { "class": "dk-option", "data-value": e.value, innerHTML: e.text, role: "option", "aria-selected": "false", id: "dk" + this.data.cacheID + "-" + (e.id || e.value.replace(" ", "-")) }), r.addClass(a, e.className), this.length += 1, e.disabled && (r.addClass(a, "dk-option-disabled"), a.setAttribute("aria-disabled", "true")), this.data.select.add(e, s), "number" == typeof s && (s = this.item(s)), this.options.indexOf(s) > -1 ? s.parentNode.insertBefore(a, s) : this.data.elem.lastChild.appendChild(a), a.addEventListener("mouseover", this), l = this.options.indexOf(s), this.options.splice(l, 0, a), e.selected && this.select(l))
//    }, item: function (e) {
//        return e = 0 > e ? this.options.length + e : e, this.options[e] || null
//    }, remove: function (e) {
//        var t = this.item(e);
//        t.parentNode.removeChild(t), this.options.splice(e, 1), this.data.select.remove(e), this.select(this.data.select.selectedIndex), this.length -= 1
//    }, init: function (s, i) {
//        var o, h = n.build(s, "dk" + l);
//        if (this.data = {}, this.data.select = s, this.data.elem = h.elem, this.data.settings = r.extend({}, d, i), this.disabled = s.disabled, this.form = s.form, this.length = s.length, this.multiple = s.multiple, this.options = h.options.slice(0), this.selectedIndex = s.selectedIndex, this.selectedOptions = h.selected.slice(0), this.value = s.value, s.parentNode.insertBefore(this.data.elem, s), this.data.elem.addEventListener("click", this), this.data.elem.addEventListener("keydown", this), this.data.elem.addEventListener("keypress", this), this.form && this.form.addEventListener("reset", this), !this.multiple)
//            for (o = 0; o < this.options.length; o++)
//                this.options[o].addEventListener("mouseover", this);
//        return 0 === l && (t.addEventListener("click", n.onDocClick), e.isIframe && parent.document.addEventListener("click", n.onDocClick)), this.data.cacheID = l, s.setAttribute("data-dkCacheId", this.data.cacheID), a[this.data.cacheID] = this, this.data.settings.initialize.call(this), l += 1, this
//    }, close: function () {
//        var e = this.data.elem;
//        if (!this.isOpen || this.multiple)
//            return !1;
//        for (i = 0; i < this.options.length; i++)
//            r.removeClass(this.options[i], "dk-option-highlight");
//        e.lastChild.setAttribute("aria-expanded", "false"), r.removeClass(e.lastChild, "dk-select-options-highlight"), r.removeClass(e, "dk-select-open-(up|down)"), this.isOpen = !1, this.data.settings.close.call(this)
//    }, open: function () {
//        var t, s, i, a = this.data.elem, l = a.lastChild, n = r.offset(a).top - e.scrollY, o = e.innerHeight - (n + a.offsetHeight);
//        return this.isOpen || this.multiple ? !1 : (l.style.display = "block", t = l.offsetHeight, l.style.display = "", s = n > t, i = o > t, direction = s && !i ? "-up" : "-down", this.isOpen = !0, r.addClass(a, "dk-select-open" + direction), l.setAttribute("aria-expanded", "true"), this._scrollTo(this.options.length - 1), this._scrollTo(this.selectedIndex), void this.data.settings.open.call(this))
//    }, disable: function (e, t) {
//        var i = "dk-option-disabled";
//        (0 == arguments.length || "boolean" == typeof e) && (t = e === s ? !0 : !1, e = this.data.elem, i = "dk-select-disabled", this.disabled = t), t == s && (t = !0), "number" == typeof e && (e = this.item(e)), r[t ? "addClass" : "removeClass"](e, i)
//    }, select: function (e, t) {
//        var s, i, a, l, n = this.data.select;
//        if ("number" == typeof e && (e = this.item(e)), "string" == typeof e)
//            for (s = 0; s < this.length; s++) {
//                if (this.options[s].getAttribute("data-value") != e)
//                    return !1;
//                e = this.options[s]
//            }
//        return !t && r.hasClass(e, "dk-option-disabled") ? !1 : r.hasClass(e, "dk-option") ? (i = this.options.indexOf(e), a = n.options[i], this.multiple ? (r.toggleClass(e, "dk-option-selected"), a.selected = !a.selected, r.hasClass(e, "dk-option-selected") ? (e.setAttribute("aria-selected", "true"), this.selectedOptions.push(e)) : (e.setAttribute("aria-selected", "false"), i = this.selectedOptions.indexOf(e), this.selectedOptions.splice(i, 1))) : (l = this.data.elem.firstChild, this.selectedOptions.length && (r.removeClass(this.selectedOptions[0], "dk-option-selected"), this.selectedOptions[0].setAttribute("aria-selected", "false")), r.addClass(e, "dk-option-selected"), e.setAttribute("aria-selected", "true"), l.setAttribute("aria-activedescendant", e.id), l.innerHTML = a.text, this.selectedOptions[0] = e, a.selected = !0), this.selectedIndex = n.selectedIndex, this.value = n.value, this.data.settings.change.call(this), e) : void 0
//    }, selectOne: function (e, t) {
//        return this.reset(!0), this._scrollTo(e), this.select(e, t)
//    }, search: function (e, t) {
//        var s, i, a, l, n, o, d, r, h = this.data.select.options, c = [];
//        if (!e)
//            return this.options;
//        for (t = t ? t.toLowerCase() : "strict", t = "fuzzy" == t ? 2 : "partial" == t ? 1 : 0, r = new RegExp((t ? "" : "^") + e, "i"), s = 0; s < h.length; s++)
//            if (a = h[s].text.toLowerCase(), 2 == t) {
//                for (i = e.toLowerCase().split(""), l = n = o = d = 0; n < a.length; )
//                    a[n] === i[l] ? (o += 1 + o, l++) : o = 0, d += o, n++;
//                l == i.length && c.push({ e: this.options[s], s: d, i: s })
//            } else
//                r.test(a) && c.push(this.options[s]);
//        return 2 == t && (c = c.sort(function (e, t) {
//            return t.s - e.s || e.i - t.i
//        }).reduce(function (e, t) {
//            return e[e.length] = t.e, e
//        }, [])), c
//    }, reset: function (e) {
//        var t, s = this.data.select;
//        for (this.selectedOptions.length = 0, t = 0; t < s.options.length; t++)
//            s.options[t].selected = !1, r.removeClass(this.options[t], "dk-option-selected"), this.options[t].setAttribute("aria-selected", "false"), !e && s.options[t].defaultSelected && this.select(t, !0);
//        this.selectedOptions.length || this.multiple || this.select(0, !0)
//    }, refresh: function () {
//        this.dispose().init(this.data.select, this.data.settings)
//    }, dispose: function () {
//        return delete a[this.data.cachID], this.data.elem.parentNode.removeChild(this.data.elem), this.data.select.removeAttribute("data-dkCacheId"), this
//    }, handleEvent: function (e) {
//        if (!this.disabled)
//            switch (e.type) {
//            case "click":
//                this._delegate(e);
//                break;
//            case "keydown":
//                this._keyHandler(e);
//                break;
//            case "keypress":
//                this._searchOptions(e);
//                break;
//            case "mouseover":
//                this._highlight(e);
//                break;
//            case "reset":
//                this.reset()
//        }
//    }, _delegate: function (t) {
//        var s, i, a, l, n = t.target;
//        if (r.hasClass(n, "dk-option-disabled"))
//            return !1;
//        if (this.multiple) {
//            if (r.hasClass(n, "dk-option"))
//                if (s = e.getSelection(), "Range" == s.type && s.collapseToStart(), t.shiftKey)
//                    if (a = this.options.indexOf(this.selectedOptions[0]), l = this.options.indexOf(this.selectedOptions[this.selectedOptions.length - 1]), i = this.options.indexOf(n), i > a && l > i && (i = a), i > l && l > a && (l = a), this.reset(!0), l > i)
//                        for (; l + 1 > i; )
//                            this.select(i++);
//                    else
//                        for (; i > l - 1; )
//                            this.select(i--);
//                else
//                    t.ctrlKey || t.metaKey ? this.select(n) : (this.reset(!0), this.select(n))
//        } else
//            this[this.isOpen ? "close" : "open"](), r.hasClass(n, "dk-option") && this.select(n)
//    }, _highlight: function (e) {
//        var t, s = e.target;
//        if (!this.multiple) {
//            for (t = 0; t < this.options.length; t++)
//                r.removeClass(this.options[t], "dk-option-highlight");
//            r.addClass(this.data.elem.lastChild, "dk-select-options-highlight"), r.addClass(s, "dk-option-highlight")
//        }
//    }, _keyHandler: function (e) {
//        var t, s = this.selectedOptions, i = this.options, a = 1, l = { tab: 9, enter: 13, esc: 27, space: 32, up: 38, down: 40 };
//        switch (e.keyCode) {
//            case l.up:
//                a = -1;
//            case l.down:
//                e.preventDefault(), t = s[s.length - 1], a = i.indexOf(t) + a, a > i.length - 1 ? a = i.length - 1 : 0 > a && (a = 0), this.data.select.options[a].disabled || (this.reset(!0), this.select(a), this._scrollTo(a));
//                break;
//            case l.space:
//                if (!this.isOpen) {
//                    e.preventDefault(), this.open();
//                    break
//                }
//            case l.tab:
//            case l.enter:
//                for (a = 0; a < i.length; a++)
//                    r.hasClass(i[a], "dk-option-highlight") && this.select(a);
//            case l.esc:
//                this.isOpen && (e.preventDefault(), this.close())
//        }
//    }, _searchOptions: function (e) {
//        var t, i = this, a = String.fromCharCode(e.keyCode || e.which), l = function () {
//            i.data.searchTimeout && clearTimeout(i.data.searchTimeout), i.data.searchTimeout = setTimeout(function () {
//                i.data.searchString = ""
//            }, 1e3)
//        };
//        this.data.searchString === s && (this.data.searchString = ""), l(), this.data.searchString += a, t = this.search(this.data.searchString, this.data.settings.search), t.length && (r.hasClass(t[0], "dk-option-disabled") || this.selectOne(t[0]))
//    }, _scrollTo: function (e) {
//        var t, s, i, a = this.data.elem.lastChild;
//        return this.isOpen || this.multiple ? ("number" == typeof e && (e = this.item(e)), t = r.position(e, a).top, s = t - a.scrollTop, i = s + e.offsetHeight, void (i > a.offsetHeight ? (t += e.offsetHeight, a.scrollTop = t - a.offsetHeight) : 0 > s && (a.scrollTop = t))) : !1
//    }
//    }, n.build = function (e, t) {
//        var s, i, a = [], l = { elem: null, options: [], selected: [] }, n = function (e) {
//            var s, i, a, o, d = [];
//            switch (e.nodeName) {
//                case "OPTION":
//                    s = r.create("li", { "class": "dk-option", "data-value": e.value, innerHTML: e.text, role: "option", "aria-selected": "false", id: t + "-" + (e.id || e.value.replace(" ", "-")) }), r.addClass(s, e.className), e.disabled && (r.addClass(s, "dk-option-disabled"), s.setAttribute("aria-disabled", "true")), e.selected && (r.addClass(s, "dk-option-selected"), s.setAttribute("aria-selected", "true"), l.selected.push(s)), l.options.push(this.appendChild(s));
//                    break;
//                case "OPTGROUP":
//                    for (i = r.create("li", { "class": "dk-optgroup" }), e.label && i.appendChild(r.create("div", { "class": "dk-optgroup-label", innerHTML: e.label })), a = r.create("ul", { "class": "dk-optgroup-options" }), o = e.children.length; o--; d.unshift(e.children[o]))
//                        ;
//                    d.forEach(n, a), this.appendChild(i).appendChild(a)
//            }
//        };
//        for (l.elem = r.create("div", { "class": "dk-select" + (e.multiple ? "-multi" : "") }), s = r.create("ul", { "class": "dk-select-options", id: t + "-listbox", role: "listbox" }), e.disabled && r.addClass(l.elem, "dk-select-disabled"), l.elem.id = t + (e.id ? "-" + e.id : ""), r.addClass(l.elem, e.className), e.multiple ? (l.elem.setAttribute("tabindex", e.getAttribute("tabindex") || "0"), s.setAttribute("aria-multiselectable", "true")) : (l.elem.appendChild(r.create("div", { "class": "dk-selected", tabindex: e.tabindex || 0,
//            innerHTML: e.options[e.selectedIndex].text, id: t + "-combobox", "aria-live": "assertive", "aria-owns": s.id, role: "combobox"
//        })), s.setAttribute("aria-expanded", "false")), i = e.children.length; i--; a.unshift(e.children[i]))
//            ;
//        return a.forEach(n, l.elem.appendChild(s)), l
//    }, n.onDocClick = function (e) {
//        var s, i, l;
//        (s = t.getElementById(e.target.htmlFor)) && null !== (i = s.getAttribute("data-dkcacheid")) && a[i].data.elem.focus();
//        for (l in a)
//            r.closest(e.target, a[l].data.elem) || a[l].disabled || a[l].close()
//    }, e.Dropkick = n
//} (window, document);

//var OriginalDropkick = jQuery.fn.dropkick;
//jQuery.fn.dropkick = function () {
//    var args = Array.prototype.slice.call(arguments);
//    return jQuery(this).each(function () {
//        if (!args[0] || typeof args[0] === 'object') {
//            new Dropkick(this, args[0] || {});
//        } else if (typeof args[0] === 'string') {
//            Dropkick.prototype[args[0]].apply(new Dropkick(this), args.slice(1));
//        }
//    });
//};
