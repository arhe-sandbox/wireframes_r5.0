(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.loginConflict');

    ns._userClickedSubmit = false;
    ns._userClickedGetHelp = false;
    ns._userClickedLogin = false;
    ns._userClickedCreateAccount = false;

    var $loginConflictWaitPopup;

    $(function () {
        ns.initializeLoginConflict();
    });

    ns.initializeLoginConflict = function initializeLoginConflict() {

        var loginConflictLb = new EXCHANGE.lightbox.Lightbox({
            name: 'loginconflict',
            divSelector: '#login-conflict-popup',
            openButtonSelector: '#login-conflict-open-button',
            closeButtonSelector: '#login-conflict-close-button',
            beforeOpen: function () {
                ko.applyBindings(app.viewModels, $('#login-conflict-popup').get(0));
                ns.setupBindings();
                return true;
            },
            afterOpen: ns.loginConflictModelLoad,
            beforeSubmit: function () {
                if ($.isFunction(app.viewModels.LoginConflictViewModel.doneCallback)) {
                    app.viewModels.LoginConflictViewModel.doneCallback();
                }
            },
            afterClose: function (clickedItem) {
                ns.saveDefaultLoginConflictChoices();
            },
            showWaitPopup: true
        });

        ns.setupViewModels();
    };

    ns.setupBindings = function setupBindings() {
        $(document).on('click', '#loginconflict-done-button', function () {
            EXCHANGE.ButtonSpinner = $(this).ButtonSpinner({ buttonType: EXCHANGE.enums.ButtonType.LARGEGREEN });
            ns.saveLoginConflictChoices();
        });
        $(document).on('click', '.login-conflict-help', function () {
            ns._userClickedGetHelp = true;
        });
        $(document).on('click', '#loginconflict-create-account-button', function () {
            ns._userClickedCreateAccount = true;
            $.publish("EXCHANGE.lightbox.loginconflict.back");

            //$.publish("EXCHANGE.lightbox.login.open");
        });
        $(document).on('click', '#loginconflict-login-button', function () {
            ns._userClickedLogin = true;
            $.publish("EXCHANGE.lightbox.loginconflict.back");

            //$.publish("EXCHANGE.lightbox.createaccountpersonalinfo.open");
        });
    };


    ns.saveDefaultLoginConflictChoices = function saveDefaultLoginConflictChoices() {
        if (!ns._userClickedSubmit) {

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/UserProfile/SaveDefaultLoginConflictSelections",
                dataType: "json",
                success: function (serverResponse) {
                    //                    $loginConflictWaitPopup.stop();
                    if (ns._userClickedGetHelp) {
                        window.location = window.location + '?lightboxName=gethelp';
                    } else if (ns._userClickedLogin) {
                        window.location = window.location + '?lightboxName=login';
                    } else if (ns._userClickedCreateAccount) {
                        window.location = window.location + '?lightboxName=createaccountpersonalinfo';
                    } else {
                        window.location = window.location;
                    }
                },
                error: function (serverResponse) {
                    //                    $loginConflictWaitPopup.stop();
                }
            });
        }
    };

    ns.saveLoginConflictChoices = function saveLoginConflictChoices() {
        ns._userClickedSubmit = true;

        var medications = {};
        var medicationsProfile = app.viewModels.LoginConflictViewModel.MedicationsProfile();
        var medicationsSearch = app.viewModels.LoginConflictViewModel.MedicationsSearch();

        if (app.viewModels.LoginConflictViewModel.Medications_Radio() == 'med0') {
            medications = medicationsProfile;
        }
        else if (app.viewModels.LoginConflictViewModel.Medications_Radio() == 'med1') {
            medications = medicationsSearch;
        }
        else if (app.viewModels.LoginConflictViewModel.Medications_Radio() == 'med2') {
            medications = medicationsProfile.concat(medicationsSearch);
        }

        var pharmacies = {};
        var pharmaciesProfile = app.viewModels.LoginConflictViewModel.PharmacyProfile();
        var pharmaciesSearch = app.viewModels.LoginConflictViewModel.PharmacySearch();

        if (app.viewModels.LoginConflictViewModel.Pharmacy_Radio() == 'pharm0') {
            pharmacies = pharmaciesProfile;
        }
        else if (app.viewModels.LoginConflictViewModel.Pharmacy_Radio() == 'pharm1') {
            pharmacies = pharmaciesSearch;
        }

        var physicians = {};
        var physiciansProfile = app.viewModels.LoginConflictViewModel.PhysicianProfile();
        var physiciansSearch = app.viewModels.LoginConflictViewModel.PhysicianSearch();

        if (app.viewModels.LoginConflictViewModel.Physician_Radio() == 'physi0') {
            physicians = physiciansProfile;
        }
        else if (app.viewModels.LoginConflictViewModel.Physician_Radio() == 'physi1') {
            physicians = physiciansSearch;
        }

        var loginConflictArgs = JSON.stringify(
            {
                UserZip: app.viewModels.LoginConflictViewModel.UserZip_Radio(),
                DateOfBirth: app.viewModels.LoginConflictViewModel.DateOfBirth_Radio(),
                Gender: app.viewModels.LoginConflictViewModel.Gender_Radio(),
                CountyId: app.viewModels.LoginConflictViewModel.County_Radio(),
                Medications: medications,
                Pharmacies: pharmacies,
                Physicians: physicians
            });

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/UserProfile/SaveLoginConflictSelections",
            data: loginConflictArgs,
            dataType: "json",
            success: function (data) {
                app.ButtonSpinner.Stop();
                // Check if UserZip was a conflict and redirect if user chose the search version of it
                if (app.viewModels.LoginConflictViewModel.UserZip_IsConflict()
                    && (app.viewModels.LoginConflictViewModel.UserZip_Radio() == app.viewModels.LoginConflictViewModel.UserZipSearch_Text())) {
                    app.functions.redirectToRelativeUrlFromSiteBase("my-account.aspx?AddressConflict=true");
                } else {
                    $.publish("EXCHANGE.lightbox.loginconflict.done");
                }
            }
        });
    };

    ns.loginConflictModelLoad = function loginConflictModelLoad() {
        ns._userClickedSubmit = false;

        if (!app.viewModels.LoginConflictViewModel.hasBeenLoaded) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/UserProfile/LoginConflictClientViewModel",
                dataType: "json",
                success: function (data) {
                    var serverViewModel = data;
                    app.viewModels.LoginConflictViewModel.loadFromJSON(serverViewModel.LoginConflictPopupViewModel);
                    $('.login-conflict-radio').customInput();
                    $.publish("EXCHANGE.lightbox.loginconflict.loaded");
                }
            });
        }
        else {
            $.publish("EXCHANGE.lightbox.loginconflict.loaded");
        }
    };

    ns.setupViewModels = function setupViewModels() {
        if (!EXCHANGE.viewModels.LoginConflictViewModel) {
            EXCHANGE.viewModels.LoginConflictViewModel = new EXCHANGE.models.LoginConflictViewModel();
        }
    };


} (EXCHANGE));

