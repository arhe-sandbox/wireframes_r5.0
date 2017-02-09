(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.pre65MyCoverage");

    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializePage();

    });

    ns.initializePage = function initializePage() {
        ns.setupViewModels();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Pre65/GetPre65HouseHoldCoverageViewModel",
            dataType: "json",
            success: function (response) {
                if (app.viewModels.ApplicationStatusViewModel.doneLoading()) {
                    app.viewModels.Pre65AccountMyCoverageViewModel.loadFromJSON(response);
                    ns.FormatApplicationStatusControl();
                    setupGrayBox();
                    setupQuestionIcon()
                } else {
                    app.viewModels.ApplicationStatusViewModel.doneLoading.subscribe(function (newValue) {
                        app.viewModels.Pre65AccountMyCoverageViewModel.loadFromJSON(response);
                        ns.FormatApplicationStatusControl();
                        setupGrayBox();
                        setupQuestionIcon()
                    });
                }

            }
        });
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.Pre65AccountMyCoverageViewModel = new app.models.Pre65AccountMyCoverageViewModel();
        ko.applyBindings(app.viewModels, $('#pre65-my-coverage').get(0));
    };

    function setupGrayBox() {
        $(".pre65-coverages-sec").each(function (index) {
            $(this).find("ul li.pre65-mycoverages-gray-section").attr("style", "height:" + ($(this)[0].clientHeight - 2) + "px" + "");
            $(this).find("ul>li.pre65-mycoverages-gray-section").each(function (index) {
                console.log($(this).height());
                var paddingtop = $(this).height();
                console.log($(this).find("p.pre65-orange>span").width());
                if ($(this).find("p.pre65-orange>span").width() > 64) {
                    $(this).find("p.pre65-orange").attr("style", "padding-top:" + ((paddingtop / 2) - 12) + "px" + ";");
                }
                else {
                    $(this).find("p.pre65-orange").attr("style", "padding-top:" + ((paddingtop / 2) - 5) + "px" + ";");
                }
            });
        });
    }

    function setupQuestionIcon() {
        $("li.pre65-health-insurance div.pre65-hi-type").each(function (index) {
            var paddingwidth = $(this).find('p strong').width() + $(this).find('p span').width();            
            if ((paddingwidth) <= 190) {
                $(this).find("div.pre65-hi-tt-contain").attr("style", "float:left !important;padding-left:" + (paddingwidth + 10) + "px" + ";");
            }
            else {
                $(this).find("div.pre65-hi-tt-contain").attr("style", "float:left !important;padding-left:" + ((paddingwidth + 10) - 160) + "px" + ";");
            }
        });
    }   

    ns.cssClassBasedOnPlanType = function CssClassBasedOnPlanType(planType) {

        switch (planType) {
            case "QhpCoverage": //app.enums.PlanTypeEnum.QhpCoverage:
                return "pre65-ic-l-qhp";
            case "IndividualAndFamilyCoverage": //app.enums.PlanTypeEnum.IndividualAndFamilyCoverage:
                return "pre65-ic-l-ifp";
            case "ShortTermCoverage": //app.enums.PlanTypeEnum.ShortTermCoverage:
                return "pre65-ic-l-st";
            case "MedicareAdvantage": //app.enums.PlanTypeEnum.MedicareAdvantage:
                return "pre65-ic-l-medicare";
            case "Medigap": //app.enums.PlanTypeEnum.Medigap:
                return "pre65-ic-l-medigap";
            case "PrescriptionDrug": //app.enums.PlanTypeEnum.PrescriptionDrugPlan:
                return "pre65-ic-l-pdp";
            case "Dental": //app.enums.PlanTypeEnum.Dental:
                return "pre65-ic-l-tooth";
            case "Vision": //app.enums.PlanTypeEnum.Vision:
                return "pre65-ic-l-eye";
            case "Medical": //app.enums.PlanTypeEnum.Medigap:
                return "pre65-ic-l-medigap";
            default:
                cssClass = "";
        }
    };

    ns.FormatApplicationStatusControl = function FormatApplicationStatusControl() {
        //// Comment to test - CRM plug -in
        if (EXCHANGE.viewModels.ApplicationStatusViewModel.enrollments().length == 0 && app.viewModels.Pre65AccountMyCoverageViewModel.PendingCoverages().length == 0) {
            $('#app-status').appendTo('#divAppStatusContainer');
            $("#divPendingEnrollments").hide();
        }
        else if (EXCHANGE.viewModels.ApplicationStatusViewModel.enrollments().length == 0) {
            $("#app-status").hide();
        }
        else {
            $("#app-status").find(".pagesubtitle").remove();
            $('#app-status').appendTo('#divAppStatusContainer');
            $(".page-checkout").hide();
        }
    };
} (EXCHANGE));