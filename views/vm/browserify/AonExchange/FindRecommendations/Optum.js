(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.Optum");
    app.namespace('EXCHANGE.viewModels');

    ns.inlineErrors = new Array();

    $(document).ready(function () {
        ns.initializePage();
    });

    ns.initializePage = function initializePage() {
        EXCHANGE.WaitPopupObserver.Subscribe("EXCHANGE.WaitPopup.FindRec.findRecommendationsClientViewModel");
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/DoctorFinderPhysicianData",
            dataType: "json",
            success: function (response) {
                EXCHANGE.viewModels.OptumViewModel = new app.models.OptumViewModel();
                EXCHANGE.viewModels.OptumViewModel.loadFromJSON(response.PhysicianPlanMapper.CustomerPhysicians);
                EXCHANGE.viewModels.OptumViewModel.initializeValidationOnPageLoad();
                EXCHANGE.viewModels.OptumViewModel.loadPhysicianDropDown(response);
                ko.applyBindings(EXCHANGE.viewModels, $('#physician').get(0));
                if (app.viewModels.findRecommendationsViewModel != undefined && app.viewModels.findRecommendationsViewModel.physOptOutAnswer() === true) {
                    app.viewModels.OptumViewModel.chosenAnswer(false);
                }

                ns.wireupJqueryEvents();
            }
        });

        ns.wireupJqueryEvents();
    };

    function DeleteDoctors() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SharedPopup/DeleteDoctorFinderPhysicianData",
            dataType: "json",
            success: function (PhysicianPlanMapper) {
                app.user.UserSession.DoctorFinder.loadFromJSON(PhysicianPlanMapper);
                EXCHANGE.viewModels.OptumViewModel.loadFromJSON(PhysicianPlanMapper.CustomerPhysicians);
                EXCHANGE.viewModels.OptumViewModel.initializeValidationOnPageLoad();
                if (EXCHANGE.viewModels.MyGuidedActionViewModel == undefined)
                    EXCHANGE.viewModels.OptumViewModel.initializeValidation();
                ko.applyBindings(EXCHANGE.viewModels, $('#physician').get(0));
                EXCHANGE.viewModels.OptumViewModel.docDuration_boundToSelectValue("none");
                EXCHANGE.viewModels.OptumViewModel.docInNetwork_boundToSelectValue("none");
                $('input:radio[name=PwPhysOptOut]')[1].checked = true;
                app.viewModels.OptumViewModel.chosenAnswer(false);
            },
            error: function (data) {
                EXCHANGE.WaitPopup.Close();
            }
        });
    }
    ns.wireupJqueryEvents = function wireupJqueryEvents() {

        $("#btnManagePhy").click(function () {
            $.publish("EXCHANGE.lightbox.doctorfinderintro.open");
        });

        ns.RemoveDoctors = function RemoveDoctors(event) {

            if (EXCHANGE.viewModels.OptumViewModel.physicians().length > 0) {
                if (EXCHANGE.viewModels.MyGuidedActionViewModel === undefined) {

                    if (confirm("Are you sure you want to remove all providers from you list?")) {
                        DeleteDoctors();
                    }
                    else {
                        if (event != null)
                            event.preventDefault();
                        return false;

                    }

                }
                else {
                    DeleteDoctors();
                }
            }
        };

        $('#ddl-DoctorInNetwork').change(function () {
            $("#ddl-DoctorInNetwork").removeClass("ddl-FindRecom-EmptySurround");
        });

        $('#ddl-DoctorDuration').on('change', function () {
            $("#ddl-DoctorDuration").removeClass("ddl-FindRecom-EmptySurround");
        });
    };

} (EXCHANGE));







