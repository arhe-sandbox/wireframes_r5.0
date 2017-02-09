(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.doctorFinder');
    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializeDoctorFinder();
        ns.closeLightBox();
    });

    ns.initializeDoctorFinder = function initializeDoctorFinder() {
        EXCHANGE.viewModels.DoctorFinderIntroViewModel = EXCHANGE.models.DoctorFinderIntroViewModel();
        EXCHANGE.viewModels.DoctorFinderMainViewModel = EXCHANGE.models.DoctorFinderMainViewModel();


        var doctorFinderIntroLb = new EXCHANGE.lightbox.Lightbox({
            name: 'doctorfinderintro',
            divSelector: '#doctor-finder-intro-popup',
            openButtonSelector: '#doctor-finder-intro-open-button',
            closeButtonSelector: '#doctor-finder-intro-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#doctorFinderTemplates').get(0));
                return true;
            },
            afterOpen: ns.doctorFinderPopupLoad,
            showWaitPopup: true
        });
        var doctorFinderMainLb = new EXCHANGE.lightbox.Lightbox({
            name: 'doctorfindermain',
            divSelector: '#doctor-finder-main-popup',
            openButtonSelector: '#doctor-finder-main-open-button',
            closeButtonSelector: '#doctor-finder-main-close-button',
            beforeOpen: function () {
                ko.applyBindings(EXCHANGE.viewModels, $('#doctorFinderTemplates').get(0));
                return true;
            },
            afterOpen: function () {
                $(".doctorfinder").css({ 'visibility': 'visible', 'display': 'block' });
                if (EXCHANGE.user.UserSession.IsLoggedIn() && EXCHANGE.login != undefined) {
                    EXCHANGE.login.currentLightboxName = "";
                }
                $.publish("lightbox-refresh-doctorfindermain");
            },
            beforeSubmit: function () {
                $.publish("EXCHANGE.lightbox.doctorfinderintro.back");
                return true;
            }
        });

    };

    ns.doctorFinderPopupLoad = function doctorFinderPopupLoad(clickedElement) {

        var planId = [], planName = [];
        if ($(clickedElement).attr('data-iscompared') == "true") {
            var numberOfPlans = app.viewModels.ComparePlansViewModel.numberOfPlans();
            for (var i = 0; i < numberOfPlans; i++) {
                planId.push(app.viewModels.ComparePlansViewModel.planList()[i].PPCID);
                planName.push(app.viewModels.ComparePlansViewModel.planList()[i].planName_lbl);
            }
        }
        else {
            planId = [$(clickedElement).attr('data-planid')];
            planName = [$(clickedElement).attr('data-planname')];
        }
        var listPlanId = [], listPlanName = [], j = 0, doctorFinderArgs, allMedicarePlans;

        allMedicarePlans = getAllMedicarePlans();

        if (allMedicarePlans) {
            for (var i = 0; i < allMedicarePlans.length; i++) {
                if (allMedicarePlans[i] && allMedicarePlans[i].PPCID && allMedicarePlans[i].PPCID != null) {
                    if ($.inArray(allMedicarePlans[i].PPCID, listPlanId) == -1) {
                        listPlanId[j] = allMedicarePlans[i].PPCID;
                        listPlanName[j] = allMedicarePlans[i].planName_lbl;
                        j++;
                    }
                }
            }
            doctorFinderArgs = {
                PlanIds: listPlanId,
                PlanNames: listPlanName
            };
        } else {
            doctorFinderArgs = {
                PlanIds: planId,
                PlanNames: planName
            };
        }

        doctorFinderArgs = JSON.stringify(doctorFinderArgs);
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/DoctorFinderClientViewModel",
            data: doctorFinderArgs,
            dataType: "json",
            success: function (data) {
                var serverViewModels = data;
                EXCHANGE.viewModels.DoctorFinderIntroViewModel.loadFromJSON(serverViewModels.DoctorFinderIntroViewModel);
                EXCHANGE.viewModels.DoctorFinderMainViewModel.loadFromJSON(serverViewModels.DoctorFinderMainViewModel);

                ns.setupHovers();

                EXCHANGE.placeholder.applyPlaceholder();
                $.publish("EXCHANGE.lightbox.doctorfinderintro.loaded");
            },
            failure: function (data) {
                //alert('Data Retrieval Error');              
            }
        });
    };

    ns.closeLightBox = function closeLightBox() {
        if (!$.support.opacity)
            window.attachEvent('onmessage', execute, false);
        else
            window.addEventListener('message', execute, false);
        function execute(event) {
            var jsonString = event.data
            jsonString = jsonString.replace(/'/g, '"'); ;
            var obj = JSON.parse(jsonString);
            if (obj && obj.CustomerPhysicians && obj.CustomerPhysicians.length > 0) {
                EXCHANGE.user.UserSession.DoctorFinder.customerPhysicians(obj.CustomerPhysicians);
                EXCHANGE.user.UserSession.DoctorFinder.physiciansAdded(true);
                if ((EXCHANGE.viewModels.findRecommendationsViewModel || EXCHANGE.viewModels.MyGuidedActionViewModel != undefined) && EXCHANGE.viewModels.OptumViewModel) {
                    EXCHANGE.viewModels.OptumViewModel.loadFromJSON(obj.CustomerPhysicians);
                    EXCHANGE.viewModels.OptumViewModel.initializeValidation();
                    ko.applyBindings(EXCHANGE.viewModels, $('#physician').get(0));
                }
            }

            if (obj && obj.PlanProviderLabel) {
                var allMedicarePlans = getAllMedicarePlans();
                if (!allMedicarePlans) {
                    allMedicarePlans = [EXCHANGE.viewModels.PlanDetailsViewModel.plan];
                }
                EXCHANGE.user.UserSession.DoctorFinder.planProviderLabels(obj.PlanProviderLabel);
                EXCHANGE.user.UserSession.DoctorFinder.changeProviderLabels(allMedicarePlans);
                var savedPlans = EXCHANGE.user.UserSession.SavedPlans.plans();
                if (savedPlans && savedPlans.length > 0) {
                    EXCHANGE.user.UserSession.DoctorFinder.changeProviderLabels(savedPlans);
                }
            }
            $.publish("EXCHANGE.lightbox.doctorfindermain.done");
            if (window.location.search.contains("lightbox")) {
                window.location.replace(window.location.origin + window.location.pathname)
            }

        }
    }

    function getAllMedicarePlans() {
        var allMedicarePlans;
        //check if coming from FindRecommendation page
        if (EXCHANGE.viewModels.findRecommendationsViewModel && EXCHANGE.viewModels.SearchResultsViewModel && EXCHANGE.viewModels.SearchResultsViewModel.tab0 && EXCHANGE.viewModels.SearchResultsViewModel.tab0.allPlans()) {
            var allPlansData = EXCHANGE.viewModels.SearchResultsViewModel.tab0.allPlans();
            allMedicarePlans =
            $(allPlansData).map(function () {
                if (!this.Plan.planName_lbl) {
                    this.Plan.planName_lbl = this.Plan.Name;
                    this.Plan.doctorFinder_lbl = ko.observable("");
                    this.Plan.doctorFinderHover_lbl = ko.observable("");
                    this.Plan.doctorFinderNoLink_lbl = ko.observable("");
                }
                return this.Plan;
            });
        } else if (EXCHANGE.viewModels.SearchResultsViewModel && EXCHANGE.viewModels.SearchResultsViewModel.tab0 && EXCHANGE.viewModels.SearchResultsViewModel.tab0.allPlans()) {
            allMedicarePlans = EXCHANGE.viewModels.SearchResultsViewModel.tab0.allPlans();
        }
        else if (EXCHANGE.viewModels.MyGuidedActionViewModel != undefined) {
            var allPlansData = EXCHANGE.viewModels.MyGuidedActionViewModel.RecPlans();
            allMedicarePlans = $(allPlansData).map(function () {
                if (!this.Plan.planName_lbl) {
                    this.Plan.planName_lbl = this.Plan.Name;
                    this.Plan.doctorFinder_lbl = ko.observable("");
                    this.Plan.doctorFinderHover_lbl = ko.observable("");
                    this.Plan.doctorFinderNoLink_lbl = ko.observable("");
                }
                return this.Plan;
            });
        }
        return allMedicarePlans;
    }


    ns.showtip = function showtip() {
        $(this).addClass('show-tip');
    };

    ns.hidetip = function hidetip() {
        $(this).removeClass('show-tip');
    };

    var config = {
        sensitivity: 4,
        interval: 250,
        over: ns.showtip,
        out: ns.hidetip
    };

    ns.setupHovers = function setupHovers() {
        $("div.has-tip").smartHover(config);


    };

    ns.createAccountLB = function createAccountLB() {
        if (EXCHANGE.login != undefined)
            EXCHANGE.login.currentLightboxName = "";
        $.publish("EXCHANGE.lightbox.createaccountpersonalinfo.open");

    };

    ns.loginLB = function loginLB() {
        if (EXCHANGE.login != undefined)
            EXCHANGE.login.currentLightboxName = "doctorfinderintro";
        $.publish("EXCHANGE.lightbox.login.open");
    };



} (EXCHANGE));
