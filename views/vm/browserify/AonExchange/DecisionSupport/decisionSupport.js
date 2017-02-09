(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.decisionSupport');

    ns.lightboxOpenFlag = false;
    ns.defaultTab = 'medication';
    ns.brandDrug;

    ns.initializeDecisionSupport = function initializeDecisionSupport() {
        ns.setupViewModels();
        ns.setupLightboxes();
        ns.setupBindings();
        $('#help-me-choose-popup').find('input').customInput();
        EXCHANGE.pharmacySearch.initializePharmacySearch();
    };

    ns.setupHelpTabGroup = function setupHelpTabGroup() {
        var tabContainers = $('div.helptabs > div');

        $('div.helptabs ul.tabNavigation li').click(function () {

            var ids = $(this).children('a').attr('href').match(/#([^\?]+)/)[0].substr(1);
            if (ids === "account") {
                return true;
            }

            if (_gaq) {

                var virtualPageName = '';
                switch (ids) {
                    case 'coverage':
                        virtualPageName = 'Plan_Search/Preferences';
                        break;
                    case 'medication':
                        virtualPageName = 'lan_Search/Medications';
                        break;
                    default:
                        virtualPageName = ids;
                        break;
                }
                _gaq.push(['_trackPageview', virtualPageName]);
            }

            tabContainers.hide();
            tabContainers.filter("#" + ids).show();
            $('div.helptabs ul.tabNavigation li').removeClass('current');
            $(this).addClass('current');
            app.viewModels.DecisionSupportViewModel.currentTab(ids);

            return false;
        }).filter(':first').click();
    };

    ns.setupBindings = function setupBindings() {
        $(document).on('click', '.frequency-defaults', function () {
            app.viewModels.EnterDosageViewModel.frequency_tb('');
        });

    };

    ns.setupLightboxes = function setupLightboxes() {
        if (!(ns.lightboxesSetup)) {
            ns.lightboxesSetup = true;
            var helpChooseLb = new app.lightbox.Lightbox({
                name: 'helpchoose',
                divSelector: '#help-me-choose-popup',
                openButtonSelector: '#help-choose-open-button',
                closeButtonSelector: '#help-choose-close-button',
                potentialChildren: ['pharmacysearch'],
                alwaysPerformAfterExit: true,
                beforeOpen: function (clickedItem) {
                    if (EXCHANGE.user.UserSession.IsLoggedIn() && EXCHANGE.user.UserSession.ShowRxPreloadLb()) {
                        $.publish("EXCHANGE.lightbox.rxpreload.open");
                        return false;
                    }
                    else if (EXCHANGE.user.UserSession.ShowInvalidNdcLb() && EXCHANGE.user.UserSession.IsLoggedIn()) {
                        $.publish("EXCHANGE.lightbox.invalidndc.open");
                        return false;
                    }
                    else {
                        ko.applyBindings(app.viewModels, $('#help-me-choose-popup').get(0));
                        app.viewModels.MyCoverageViewModel.resetAnswers();
                        $('.help-me-choose-radio').trigger('updateState');
                        app.autosuggest.bindAutosuggests($('#help-me-choose-popup'));
                        app.viewModels.MyMedicationViewModel.showInvalidDrugMessage(false);
                        return true;
                    }
                },
                afterOpen: function (clickedItem) {
                    ns.lightboxOpenFlag = true;
                    if (app.viewModels.DecisionSupportViewModel.wasPharmacyLightboxOpen) {
                        app.viewModels.DecisionSupportViewModel.wasPharmacyLightboxOpen = false;
                    }
                    else {
                        app.viewModels.DecisionSupportViewModel.drugsOnLightboxOpen(app.user.UserSession.UserDrugs.drugs().slice(0));
                    }

                    if (!app.viewModels.MyCoverageViewModel.loadedFromJson) {
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: "/API/SharedPopup/DecisionSupportViewModel",
                            dataType: "json",
                            success: function (data) {
                                var serverViewModel = data;
                                app.viewModels.MyCoverageViewModel.loadFromJSON(serverViewModel.MyCoverageViewModel);
                                app.viewModels.DecisionSupportViewModel.loadFromJSON(serverViewModel);
                                app.viewModels.MyMedicationViewModel.loadFromJSON(serverViewModel.MyMedicationViewModel);
                                app.viewModels.EnterDosageViewModel.loadFromJSON(serverViewModel.EnterDosageViewModel);
                                app.viewModels.SelectGenericViewModel.loadFromJSON(serverViewModel.SelectGenericViewModel);
                                app.viewModels.MyCoverageViewModel.checkCorrectOptions();
                                app.viewModels.MyCoverageViewModel.resetAnswers();

                                app.placeholder.applyPlaceholder();

                                $('#coverage').find('input').customInput();

                                app.viewModels.MyCoverageViewModel.loadedFromJson = true;
                                ns.setupHelpTabGroup();
                                ns.selectTab(clickedItem);
                                $.publish("EXCHANGE.lightbox.helpchoose.loaded");
                                $("#txtDrugAutoComplete").focus();
                            }
                        });


                    } else {
                        $('#coverage').find('input').customInput();
                        ns.setupHelpTabGroup();
                        ns.selectTab(clickedItem);
                        $.publish("EXCHANGE.lightbox.helpchoose.loaded");
                    }
                    app.viewModels.EnterDosageViewModel.hide();
                    app.viewModels.MyMedicationViewModel.lastAddedMed("");

                },
                beforeSubmit: function () {
                    ns.submitSortQuestions();
                    return true;
                },
                afterClose: function (sender) {
                    ns.clearMyMedication();
                    if (!app.viewModels.DecisionSupportViewModel.shouldOpenPharmacyLightbox() && EXCHANGE.user.UserSession.UserDrugs.drugs().length > 0 && !EXCHANGE.user.UserSession.ShowRxPreloadLb() && app.coverageCost != undefined) {
                        app.coverageCost.getCoverageCostsInPriorityOrder();
                    }

                },
                afterExit: function (sender) {
                    ns.clearMyMedication();

                    if (EXCHANGE.user.UserSession.UserDrugs.drugs().length > 0 && !EXCHANGE.user.UserSession.ShowRxPreloadLb() && app.coverageCost != undefined) {
                        app.coverageCost.getCoverageCostsInPriorityOrder();
                    }
                },
                showWaitPopup: true
            });
        }
    };

    ns.selectTab = function selectTab(clickedItem) {
        var newTab = $(clickedItem).attr('tab');
        if (!newTab) {
            newTab = ns.defaultTab;
        }
        if (newTab) {
            ns.setCurrentTab(newTab);
        }
    };

    ns.clearMyMedication = function clearMyMedication() {
        app.autosuggest.dataList = {};
        if (app.autosuggest._doneScopes !== undefined) {
            app.autosuggest._doneScopes.splice(app.autosuggest._doneScopes.indexOf('#help-me-choose-popup'), 1);
        }
        ns.removeInlineErrorsEnterDosage();
        app.viewModels.MyMedicationViewModel.showGenericSwitch(false);
        app.viewModels.MyMedicationViewModel.showEnterDosage(false);
        app.viewModels.MyMedicationViewModel.showInvalidDrugMessage(false);
    };

    ns.setCurrentTab = function setCurrentTab(tab) {
        if (tab) {
            $('div.helptabs ul.tabNavigation li > a').each(function (index, element) {
                var href = $(element).attr("href");
                if (href.indexOf(tab) !== -1) {
                    $(element).click();
                }
            });
        }
    };

    ns.setupViewModels = function setupViewModels() {
        if (!app.viewModels.MyCoverageViewModel) {
            app.viewModels.MyCoverageViewModel = new app.models.MyCoverageViewModel();
            app.viewModels.DecisionSupportViewModel = new app.models.DecisionSupportViewModel();
            app.viewModels.MyMedicationViewModel = new app.models.MyMedicationViewModel();
            app.viewModels.EnterDosageViewModel = new app.models.EnterDosageViewModel();
            app.viewModels.SelectGenericViewModel = new app.models.SelectGenericViewModel();
        }
    };

    ns.submitSortQuestions = function submitSortQuestions() {
        if (app.viewModels.SearchState && app.searchResults) {
            var questionAnswers = app.viewModels.MyCoverageViewModel.getAnswersForSubmit();
            app.viewModels.MyCoverageViewModel.saveAnswers();
            app.searchResults.setCurrentTab(app.viewModels.MyCoverageViewModel.getResultingTab());

            var parameters = JSON.stringify(questionAnswers);

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/SearchResult/SubmitSortAnswers",
                data: parameters,
                dataType: "json",
                success: function (data) {
                    var viewModel = data;
                    var medigapSort = app.plans.SortRules().loadFromJson(viewModel.MedigapSortBy);
                    var medicareSort = app.plans.SortRules().loadFromJson(viewModel.MedicareAdvantageSortBy);
                    var prescSort = app.plans.SortRules().loadFromJson(viewModel.PrescriptionDrugSortBy);

                    app.plans.applySorting(medigapSort, prescSort, medicareSort, true);
                    app.viewModels.SearchState.MedigapSortBy = medigapSort;
                    app.viewModels.SearchState.PrescriptionDrugSortBy = prescSort;
                    app.viewModels.SearchState.MedicareAdvantageSortBy = medicareSort;
                    app.searchResults.saveSearchState();
                    app.placeholder.applyPlaceholder();
                }
            });
        }
    };

    ns.autoCompleteSelection = function autoCompleteSelection(name, drugId) {
        var parameters = { DrugId: drugId };
        var jsonParams = JSON.stringify(parameters);
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Drug/GetDrugById",
            data: jsonParams,
            dataType: "json",
            success: function (drugWithDosages) {
                app.viewModels.MyMedicationViewModel.showInvalidDrugMessage(false);
                if (drugWithDosages.IsGenericAvailable) {
                    app.viewModels.MyMedicationViewModel.showGenericSwitch(true);
                    app.viewModels.MyMedicationViewModel.showEnterDosage(false);
                    //app.viewModels.SelectGenericViewModel.genericStart(true);
                    ns.brandDrug = drugWithDosages;
                    var drugList = [];
                    drugList.push(drugWithDosages);
                    drugList.push(drugWithDosages.GenericDrug);
                    app.viewModels.SelectGenericViewModel.drugList(drugList);
                    app.viewModels.SelectGenericViewModel.brandOrGeneric(true)
                }
                else {
                    if (drugWithDosages.IsDrugValid) {
                        ns.showEnterDosageNew(drugWithDosages);
                    }
                    else {
                        ns.showInvalidDrugMessage();
                    }
                }
            }
        });
    };

    ns.genericEnterDosageBypass = function genericEnterDosageBypass(drug) {
        if (ns.brandDrug.Id == drug.Id) {
            if (ns.brandDrug.IsDrugValid) {
                ns.showEnterDosageNew(ns.brandDrug);
            }
            else {
                ns.showInvalidDrugMessage();
            }
        }
        else {
            ns.autoCompleteSelection(drug.Name, drug.Id);
        }
    };


    ns.showInvalidDrugMessage = function showInvalidDrugMessage(drug) {
        app.viewModels.EnterDosageViewModel.isExisting(false);
        app.viewModels.EnterDosageViewModel.userDrugIdToChage("");
        app.viewModels.MyMedicationViewModel.showGenericSwitch(false);
        app.viewModels.MyMedicationViewModel.showEnterDosage(false);
        app.viewModels.MyMedicationViewModel.hasExistingDosageError(false);
        app.viewModels.MyMedicationViewModel.showInvalidDrugMessage(true);
        app.viewModels.MyMedicationViewModel.lastAddedMed("");
        ns.removeInlineErrorsEnterDosage();
    };

    ns.showEnterDosageNew = function showEnterDosageNew(drug) {
        app.viewModels.EnterDosageViewModel.isExisting(false);
        var dosages = drug.Dosages, selectedDosage;
        for (var i = 0; i < dosages.length; i++) {
            if (dosages[i].IsDefaultDosage === true) {
                selectedDosage = dosages[i];
                break;
            }
        }
        if (selectedDosage) {
            drug.SelectedDosage = selectedDosage;
            app.viewModels.EnterDosageViewModel.quantity_tb(selectedDosage.DefaultQuantity);
            var refillOptions = app.viewModels.EnterDosageViewModel.frequency_options();
            for (var i = 0; i < refillOptions.length; i++) {
                if (refillOptions[i].Option_Value === selectedDosage.DefaultOccurance) {
                    app.viewModels.EnterDosageViewModel.frequency_radio(refillOptions[i].Option_Id);
                    break;
                }
            }

        }
        app.viewModels.EnterDosageViewModel.userDrugIdToChage("");

        ns.showEnterDosage(drug);
        app.viewModels.EnterDosageViewModel.dosage_radio(selectedDosage.Id);
        ns.updateDosage();
        ns.updateFrequency();

    };

    ns.showEnterDosage = function showEnterDosage(drug) {
        app.viewModels.EnterDosageViewModel.drug(drug);
        app.viewModels.MyMedicationViewModel.showEnterDrug(false);
        app.viewModels.MyMedicationViewModel.showEnterDosage(true);
        app.viewModels.MyMedicationViewModel.lastAddedMed("");
        app.viewModels.MyMedicationViewModel.showGenericSwitch(false);
        app.viewModels.MyMedicationViewModel.hasExistingDosageError(false);
        app.viewModels.MyMedicationViewModel.showInvalidDrugMessage(false);
        ns.removeInlineErrorsEnterDosage();

        $('.dosage-radio').customInput();
        $('.package-radio').customInput();
        
        $('#helpMeChooseOkayButton').hide();
        $('.helpmed').css({ 'padding-top': 4 });
        $('.helpquestions li').css({ 'margin-bottom': 4 });
        $('.helpquestions').css({ 'padding-bottom': 0, 'padding-top': 0, 'border-top-width': 0 });

        $('#medication').animate({ scrollTop: 0 });
    };

    ns.changeDrug = function changeDrug(drugVm) {
        if (drugVm.userDrug().Drug.Id === app.viewModels.EnterDosageViewModel.drug().Id) return;
        var userDrug = drugVm.userDrug();
        app.viewModels.EnterDosageViewModel.isExisting(true);
        app.viewModels.EnterDosageViewModel.userDrugIdToChage(userDrug.Id);
        ns.showEnterDosage(userDrug.Drug);
        app.viewModels.EnterDosageViewModel.loadFromUserDrug(userDrug);
        ns.updateDosage();
        ns.updatePackage();
        ns.updateFrequency();
    };

    ns.applyCustomInput = function (div) {
        $(div).find('input').customInput();
    };

    ns.updateDosage = function () {
        $('.dosage-radio').trigger('updateState');
    };

    ns.updatePackage = function () {
        $('.package-radio').trigger('updateState');
    };

    ns.updateFrequency = function () {
        $('.frequency-radio').trigger('updateState');
    };

    ns.updatePharmacy = function () {
        $('.pharmacy-radio').trigger('updateState');
    };

    ns.addMedicine = function () {
        ns.removeInlineErrorsEnterDosage();
        var isExisting = app.viewModels.EnterDosageViewModel.isExisting();
        var userDrug = app.viewModels.EnterDosageViewModel.getUserDrug();
        if (!userDrug) {
            $('#medication').scrollTop(0);
            ns.assignErrorFieldsEnterDosage();
            return;
        }
        if (ns.checkForDuplicate(userDrug)) {
            app.viewModels.MyMedicationViewModel.hasExistingDosageError(true);
            $('#medication').scrollTop(0);
        } else {
            app.viewModels.MyMedicationViewModel.hasExistingDosageError(false);
            app.ButtonSpinner = $('#add-drug-to-profile-button').ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
            var afterChange = function () { ns.clearEnterDosage(isExisting, userDrug); };
            app.viewModels.MyMedicationViewModel.showEnterDrug(false);
            if (!isExisting) { // New, so add it
                app.drugs.DrugAPI.addDrugToMedCabinet(userDrug, afterChange);
            }
            else { // Old, so change it
                app.drugs.DrugAPI.changeDrugInMedCabinet(userDrug, afterChange);
            }
        }
    };

    ns.clearEnterDosage = function (isExisting, userDrug) {
        app.ButtonSpinner.Stop();
        app.viewModels.MyMedicationViewModel.lastAddedMed(isExisting ? "" : userDrug.Drug.Name);
        app.viewModels.EnterDosageViewModel.hide();
    };

    ns.checkForDuplicate = function (newUserDrug) {
        var userDrugs = app.user.UserSession.UserDrugs.drugs();
        for (var i = 0; i < userDrugs.length; i++) {
            var userDrug = userDrugs[i];
            if (userDrug.SelectedDosage.Id == newUserDrug.SelectedDosage.Id && userDrug.Drug.Id == newUserDrug.Drug.Id && userDrug.SelectedPackage.Id == newUserDrug.SelectedPackage.Id && userDrug.Id !== newUserDrug.Id) {
                return true;
            }
        }
        return false;
    };

    ns.assignErrorFieldsEnterDosage = function assignErrorFieldsEnterDosage() {
        for (var i = 0; i < app.viewModels.EnterDosageViewModel.inlineErrorFields().length; i++) {
            $('#' + app.viewModels.EnterDosageViewModel.inlineErrorFields()[i]).addClass('error-field');
        }
    };

    ns.removeInlineErrorsEnterDosage = function removeInlineErrorsEnterDosage() {
        $('#medication-form').find('.error-field').removeClass('error-field');
        app.viewModels.EnterDosageViewModel.inlineErrorsExist(false);
        app.viewModels.EnterDosageViewModel.inlineErrors([]);
        app.viewModels.EnterDosageViewModel.inlineErrorFields([]);
    };

} (EXCHANGE));

