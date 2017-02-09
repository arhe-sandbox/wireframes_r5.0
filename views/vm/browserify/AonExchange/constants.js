;
(function (app) {
    var ns = app.namespace("EXCHANGE.constants");
    ns.blankGuid = "00000000-0000-0000-0000-000000000000";

    var emptyMonthObject = {
        ShortMonthName: "",
        LongMonthName: ""
    };
    var blankMonths = [];
    for(var i = 1; i <= 12; i++) {
        blankMonths[i] = $.extend({}, emptyMonthObject);
    }
    /// Summary
    // This array has short and long month names for each month. They are 1 indexed because they are months.
    ///
    ns.monthNames = ko.observableArray(blankMonths);

    ns.loadMonthNames = function(monthNames) {
        var months = [];
        $.each(monthNames, function(index, month) {
            months[month.MonthId] = month;
        });

        ns.monthNames(months);
    };

    //ns.mailOrderPharmacyId = 'MailOrderPharmacy';
    ns.mailOrderPharmacyId = ko.observable('MailOrderPharmacy');

    ns.enterKeyCode = 13;

} (EXCHANGE));