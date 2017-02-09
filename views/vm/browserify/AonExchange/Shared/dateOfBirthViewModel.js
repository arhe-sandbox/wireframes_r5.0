(function (app) {
    // use "strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.DateOfBirthViewModel = function DateOfBirthViewModel() {
        if (!(this instanceof DateOfBirthViewModel)) {
            return new DateOfBirthViewModel();
        }
        var self = this;

        // "constants" for use as loadFromJSON arguments
        self.USE_SERVER_DATE_VALUES = "server";
        self.USE_LOCAL_DATE_VALUES = "local";

        // These are the actual viewmodel values, the ones we would *like* to bind to the
        // date-of-birth selects as "initial value" observables, but cannot. (See the next set
        // of variables below.)
        self.ModelYear = ko.observable(0);
        self.ModelMonth = ko.observable(0);
        self.ModelDay = ko.observable(0);

        // A Knockout-bound select can *change* the value of the "initial value" observable to which it is bound,
        // if that observable's value isn't in the select's list of options. So, since we potentially bind the 
        // MonthOptions list late (as it comes from a different AJAX call), and since the DayOptions list gets
        // generated on page load, the potential exists to lose the viewmodel values for "Day" and "Month" just 
        // because Knockout changes them as part of processing. So, we will create separate variables for binding 
        // to the selects as initial values, and load them when appropriate from the Model variables above. 
        // (Technically, we don't need to do this for the Year, but will do so for consistency in the .ascx files.)
        self.Year = ko.observable(0);
        self.Month = ko.observable(0);
        self.Day = ko.observable(0);

        self.YearOptions = ko.observableArray([]);
        self.MonthOptions = ko.computed({
            read: function () {
                var months = app.constants.monthNames();
                var monthArray = [];
                for (var i = 0; i < months.length - 1; ++i) {
                    monthArray[i] = months[i + 1];
                }
                return monthArray;
            },
            owner: this,
            deferEvaluation: true
        });
        self.DayOptions = ko.observableArray([]);

        DateOfBirthViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel, dateValueSource) {

            var protoself = this;

            // In some cases, we want our view model to be driven by server values (ex.: date on user profile).
            // In other cases, the user has made choices in the date dropdowns and we want to preserve them
            //   when moving to a different page and back (ex.: create account: Personal Info -> Auth -> Personal Info). 
            if (!(dateValueSource == protoself.USE_LOCAL_DATE_VALUES)) {
                // only load from server view model if we haven't explicitly called out to use local date values
                protoself.ModelYear(viewModel.Year);
                protoself.ModelMonth(viewModel.Month);
                protoself.ModelDay(viewModel.Day);
            }
            // else we keep the values that are already in ModelYear, ModelMonth, and ModelDay, which might
            // be 0 (as initialized near the top of this file) or which might be previously-saved user values. 


            // Must load year options first, to ensure that we don't erase the bound initial value
            protoself.YearOptions(viewModel.YearOptions);

            protoself.Year(protoself.ModelYear());
            protoself.Month(protoself.ModelMonth());

            // calculate day list based on initial values for year and month
            var defaultMonth = protoself.ModelMonth();
            if (defaultMonth == 0) {
                defaultMonth = 1;
            }
            var defaultYear = protoself.ModelYear();
            if (defaultYear == 0) {
                // so that it is a leap year and Feb gets 29 days
                defaultYear = 2000;
            }
            app.functions.setDayListForMonthAndYear(defaultMonth, defaultYear, protoself.DayOptions);

            // finally, with day list generated, we can assign the initial day value to the select
            protoself.Day(protoself.ModelDay());

        };

        DateOfBirthViewModel.prototype.clearData = function clearData() {
            var protoself = this;

            protoself.Year(0);
            protoself.Month(0);
            protoself.Day(0);

            protoself.ModelYear(0);
            protoself.ModelMonth(0);
            protoself.ModelDay(0);

            app.functions.setDayListForMonthAndYear(1, 2000, protoself.DayOptions);
        };

        DateOfBirthViewModel.prototype.storeValuesToModel = function storeValuesToModel() {
            var protoself = this;
            protoself.ModelYear(protoself.Year());
            protoself.ModelMonth(protoself.Month());
            protoself.ModelDay(protoself.Day());
        };

        DateOfBirthViewModel.prototype.reloadBoundMonthFromModel = function reloadBoundMonthFromModel() {
            var protoself = this;
            protoself.Month(protoself.ModelMonth());
        };

        DateOfBirthViewModel.prototype.reloadBoundDobValuesFromModel = function reloadBoundDobValuesFromModel() {
            var protoself = this;
            protoself.Year(protoself.ModelYear());
            protoself.Month(protoself.ModelMonth());
            protoself.Day(protoself.ModelDay());
        };
    };

} (EXCHANGE));