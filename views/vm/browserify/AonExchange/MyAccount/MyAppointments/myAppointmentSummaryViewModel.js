(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.MyAppointmentSummaryViewModel = function MyAppointmentSummaryViewModel() {
        if (!(this instanceof MyAppointmentSummaryViewModel)) {
            return new MyAppointmentSummaryViewModel();
        }
        var self = this;

        self.AppointmentSummaries = ko.observableArray([]);

        self.AppointmentSummaryHeader = ko.observable("");
        self.ShowWebPart = ko.observable(true);
        self.NoAppointmentSummary = ko.observable("");

        self.ShowNoAppointmentSummary = ko.computed({
            read: function () {
                return self.AppointmentSummaries().length == 0;
            },
            owner: this,
            deferEvaluation: true
        });

        MyAppointmentSummaryViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;

            $.each(viewModel.AppointmentSummaries, function (index, apptSummary) {
                protoSelf.AppointmentSummaries.push(apptSummary);
            });

            protoSelf.AppointmentSummaryHeader(viewModel.AppointmentSummaryHeader);
            protoSelf.NoAppointmentSummary(viewModel.NoAppointmentSummary);

            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));
