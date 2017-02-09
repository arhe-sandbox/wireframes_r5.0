
(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.Utilisation");
    app.namespace('EXCHANGE.viewModels');

    ns.inlineErrors = new Array();

    $(document).ready(function () {
        ns.initializePage();
    });

    ns.initializePage = function initializePage() {
        if (app.viewModels.UtilisationViewModel == null) {
            ns.setupViewModels();
        }
        ns.getUtilisationDefaults();

        $("#radio-toggle").buttonset();
        ns.setupLightboxes();
        ns.wireupJqueryEvents();
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.UtilisationViewModel = new app.models.UtilisationViewModel();
        ko.applyBindings(app.viewModels, $('#utilisation').get(0));
    };

    ns.setupLightboxes = function setupLightboxes() {
    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        //Prescription Buttons
        $("#prescrip-toggle").click(function (event) {
            event.returnValue = false;
            $("#prescip-content").slideToggle("fast");
            $("#prescrip-toggle").hide(200);
        });
        $("#prescrip-save").click(function (event) {
            event.returnValue = false;
            $("#prescip-content").slideToggle("fast");
            $("#prescrip-toggle").show(200);
        });

        //Doctors buttons
        $("#doctor-toggle").click(function (event) {
            event.preventDefault();
            $("#doctor-content").slideToggle("fast");
            $("#doctor-toggle").hide(200);
        });
        $("#doc-save").click(function (event) {
            event.returnValue = false;
            $("#doctor-content").slideToggle("fast");
            $("#doctor-toggle").show(200);
        });

        $('#ddl-primaryCareList').on('change', function () {
            $("#ddl-primaryCareList").removeClass("ddl-FindRecom-EmptySurround");
        });

        $('#ddl-hospitalVisitList').on('change', function () {
            $("#ddl-hospitalVisitList").removeClass("ddl-FindRecom-EmptySurround");
        });

        $('#ddl-specialistVisitList').on('change', function () {
            $("#ddl-specialistVisitList").removeClass("ddl-FindRecom-EmptySurround");
        });

      
    };

    function wireupJqueryEvents() {

        $("#btnManagePhy").click(function () {
            $.publish("EXCHANGE.lightbox.doctorfinderintro.open");
        });

        $('#ddl-DoctorInNetwork').change(function () {
            $("#ddl-DoctorInNetwork").removeClass("ddl-FindRecom-EmptySurround");
        });

        $('#ddl-DoctorDuration').on('change', function () {
            $("#ddl-DoctorDuration").removeClass("ddl-FindRecom-EmptySurround");
        });


    };

    function ResetDropDownsCss() {
        if ($("#ddl-DoctorInNetwork"))
            $("#ddl-DoctorInNetwork").removeClass("ddl-FindRecom-EmptySurround");
        if ($("#ddl-DoctorDuration"))
            $("#ddl-DoctorDuration").removeClass("ddl-FindRecom-EmptySurround");
        if ($("#ddl-primaryCareList"))
            $("#ddl-primaryCareList").removeClass("ddl-FindRecom-EmptySurround");
        if ($("#ddl-hospitalVisitList"))
            $("#ddl-hospitalVisitList").removeClass("ddl-FindRecom-EmptySurround");
        if ($("#ddl-specialistVisitList"))
            $("#ddl-specialistVisitList").removeClass("ddl-FindRecom-EmptySurround")
        $("#ddlDoctorValidationMessage").addClass("hide-menu");
        $("#ddlMedicalValidationMessage").addClass("hide-menu");
    }
    ns.getUtilisationDefaults = function getUtilisationDefaults() {

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Recommendations/GetUtilisationDefaults",
            success: function (data) {
                //validation step
                app.viewModels.UtilisationViewModel = app.viewModels.UtilisationViewModel.loadUtilizationDefaults(data);
            },
            error: function (data) {

            }
        });
    };
} (EXCHANGE));







