(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.AppointmentSummaryViewModel = function AppointmentSummaryViewModel() {
        if (!(this instanceof AppointmentSummaryViewModel)) {
            return new AppointmentSummaryViewModel();
        }
        var self = this;

        //self.MyAppointmentsHeaderText = ko.observable("");
        //self.AppointmentsHeader = ko.observable("");
        self.DentalContactInfo = ko.observable("");
        self.VisionContactInfo = ko.observable("");
        self.AppointmentSummary_DateString = ko.observable("");
        self.FirstName = ko.observable("");
        self.AgentName = ko.observable("");
        self.AppointmentDate = ko.observable("");
        self.AppointmentTime = ko.observable("");
        self.AppointmentToTime = ko.observable("");
        self.HRA_Year = ko.observable("");
        self.HRA_Amount = ko.observable("");
        self.HRA_Amount_Currency = ko.observable("");
        self.Rx_Type = ko.observable("");
        self.IsConfirmed = ko.observable("");
        self.HRA_Status = ko.observable("");
        self.OptionalPlan_Type = ko.observable("");
        self.ProductNote_Type = ko.observable("");
        self.Plan_Type = ko.observable("");
        self.HasPOA = ko.observable("");
        self.Time_Zone = ko.observable("");

        self.basicPlanClick = function basicPlanClick() {

            if (_gaq) {
                _gaq.push(['_trackEvent', 'Appt Summary Learning', 'Click', 'Medicare Basics']);
            }

            window.open('Documents/BAT_Understanding_Original_Medicare.aspx', '_blank');
        };

        self.OptionalPlan_TypeName = ko.computed({
            read: function () {
                switch (self.OptionalPlan_Type()) {
                    case app.enums.OptionalPlanTypeEnum.Dental:
                        return app.enums.OptionalPlanTypeEnumName.Dental;
                    case app.enums.OptionalPlanTypeEnum.Vision:
                        return app.enums.OptionalPlanTypeEnumName.Vision;
                    case app.enums.OptionalPlanTypeEnum.Both:
                        return app.enums.OptionalPlanTypeEnumName.Both;
                    default:
                        return "";
                }
            },
            owner: this,
            deferEvaluation: true
        });

        self.Plan_TypeName = ko.computed({
            read: function () {
                switch (self.Plan_Type()) {
                    case app.enums.PlanTypeEnum.MedicareAdvantage:
                        return app.enums.PlanTypeEnumName.MedicareAdvantage;
                    case app.enums.PlanTypeEnum.Medigap:
                        return app.enums.PlanTypeEnumName.Medigap;
                    case app.enums.PlanTypeEnum.PrescriptionDrugPlan:
                        return app.enums.PlanTypeEnumName.PrescriptionDrugPlan;
                    case app.enums.PlanTypeEnum.Dental:
                        return app.enums.PlanTypeEnumName.Dental;
                    case app.enums.PlanTypeEnum.Vision:
                        return app.enums.PlanTypeEnumName.Vision;
                    case app.enums.PlanTypeEnum.DentalandVision:
                        return app.enums.PlanTypeEnumName.DentalandVision;
                    default:
                        return "";
                }
            },
            owner: this,
            deferEvaluation: true
        });

        AppointmentSummaryViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;

            var MyAppointmentSummary = viewModel.MyAppointmentSummary;
            //protoSelf.MyAppointmentsHeaderText(viewModel.MyAppointmentsHeaderText);
            //protoSelf.AppointmentsHeader(viewModel.AppointmentsHeader);
            protoSelf.DentalContactInfo(viewModel.DentalContactInfo);
            protoSelf.VisionContactInfo(viewModel.VisionContactInfo);
            protoSelf.FirstName(viewModel.FirstName);
            protoSelf.AgentName(MyAppointmentSummary.Agent_Name);
            protoSelf.AppointmentSummary_DateString(MyAppointmentSummary.AppointmentSummary_DateString);
            protoSelf.AppointmentDate(MyAppointmentSummary.DateString);
            protoSelf.AppointmentTime(MyAppointmentSummary.FromTimeString);
            protoSelf.AppointmentToTime(MyAppointmentSummary.ToTimeString);
            protoSelf.HRA_Year(MyAppointmentSummary.HRA_Year);
            protoSelf.HRA_Amount(MyAppointmentSummary.HRA_Amount);
            protoSelf.HRA_Amount_Currency(MyAppointmentSummary.HRA_Amount_Currency);
            protoSelf.HRA_Status(MyAppointmentSummary.HRA_Status);
            protoSelf.Rx_Type(MyAppointmentSummary.Rx_Type);
            protoSelf.OptionalPlan_Type(MyAppointmentSummary.OptionalPlan_Type);
            protoSelf.ProductNote_Type(MyAppointmentSummary.ProductNote_Type);
            protoSelf.Plan_Type(MyAppointmentSummary.Plan_Type);
            protoSelf.IsConfirmed(MyAppointmentSummary.IsConfirmed);
            protoSelf.HasPOA(MyAppointmentSummary.HasPOA);
            protoSelf.Time_Zone(MyAppointmentSummary.Time_Zone);
            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));

