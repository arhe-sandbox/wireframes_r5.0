(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.myAppointments");

    app.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializePage();
    });

    // Bug 35061 Accepts only numeric in the text box of myappointment section 
    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $('#appt-phone').live('keypress',
         function (e) {
             var specialKeys = new Array();
             specialKeys.push(8); //Backspace

             var keyCode = e.which ? e.which : e.keyCode
             var ret = ((keyCode >= 48 && keyCode <= 57) || specialKeys.indexOf(keyCode) != -1);
             return ret;
         });
    };


    ns.initializePage = function initializePage() {
        ns.setupViewModels();
        ns.bindEvents();
        ns.wireupJqueryEvents();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Account/MyAppointmentsClientViewModel",
            dataType: "json",
            success: function (response) {
                app.viewModels.MyAppointmentsViewModel.loadFromJSON(response);
                var appointments = response.Appointments;
                    if(appointments != null && appointments !=undefined)
                    {
                        var unconfirmedAppointments = 0;
                        for (i = 0; i < appointments.length; i++) {
                            if (!appointments[i].IsConfirmed) {
                                unconfirmedAppointments = unconfirmedAppointments + 1;
                            }
                        }
                        if (app.viewModels.MyAccountSidebarViewModel) {
                        app.viewModels.MyAccountSidebarViewModel.numberOfNewAppointments(unconfirmedAppointments);
                    }
                   }
                $('#reschDateFromWS').dropkick();
            }
        });
    };

    ns.setupViewModels = function setupViewModels() {
        app.viewModels.MyAppointmentsViewModel = new app.models.MyAppointmentsViewModel();
        ko.applyBindings(app.viewModels, $('#my-appts').get(0));
    };

    ns.bindEvents = function bindEvents() {
        app.functions.setupPhoneFormatting();
    };
    //function to only allow user to confirm this appt if other unconfimred appt are before this appt date.i.e. 
    //first confirm the earlier appointment before confirming later appts.    
    ns.CanConfirmThisAppointment = function CanConfirmThisAppointment(appt) {
        var appts = EXCHANGE.viewModels.MyAppointmentsViewModel.appointments();
        if (appts.length == 1) { return true; }
        var unConfAppts = getOtherUnConfimredAppointmentList(appt.Id());
        if (unConfAppts && unConfAppts.length == 0) { return true; }
        var selectedApptdate = new Date(appt.FromTime());
        var otherApptDate;
        for (var i = 0; i < unConfAppts.length; i++) {
            otherApptDate = new Date(unConfAppts[i].FromTime());
            if (selectedApptdate && otherApptDate && selectedApptdate > otherApptDate) {
                return false;
            }
        }
        return true;
    };

    function getOtherUnConfimredAppointmentList(apptId) {
        var appts = EXCHANGE.viewModels.MyAppointmentsViewModel.appointments();
        var unConfirmApptList = new Array();
        var j = 0;
        for (var i = 0; i < appts.length; i++) {
            if (appts[i].Id() != apptId && !appts[i].IsConfirmed()) {
                unConfirmApptList[j] = appts[i];
                j++;
            }
        }
        return unConfirmApptList;
    };

    ns.isDateAfter30days = function isDateAfter30days(dt) {
        var currentSeldate = new Date(dt);
        var todaysDatePlus30 = new Date();
        todaysDatePlus30.setDate(todaysDatePlus30.getDate() + 30);
        if (currentSeldate > todaysDatePlus30)
            return true;
        else
            return false;
    };

    ns.GetHourAMPM = function GetHourAMPM(inputdate) {
        var date = new Date(inputdate);
        var localeSpecificTime = date.toLocaleTimeString();
        return localeSpecificTime.replace(/:\d+ /, ' ');
    }

    ns.GetDateFormatted = function GetDateFormatted(inputdate) {
        var newApptDate = new Date(inputdate);
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var day = days[newApptDate.getDay()];
        var month = months[newApptDate.getMonth()];
        return day + ", " + month + " " + newApptDate.getDate() + ", " + newApptDate.getFullYear();
    }

    ns.convert_state = function convert_state(name, to) {
        var name = name.toUpperCase();
        var states = new Array({ 'name': 'Alabama', 'abbrev': 'AL' }, { 'name': 'Alaska', 'abbrev': 'AK' },
        { 'name': 'Arizona', 'abbrev': 'AZ' }, { 'name': 'Arkansas', 'abbrev': 'AR' }, { 'name': 'California', 'abbrev': 'CA' },
        { 'name': 'Colorado', 'abbrev': 'CO' }, { 'name': 'Connecticut', 'abbrev': 'CT' }, { 'name': 'Delaware', 'abbrev': 'DE' },
        { 'name': 'Florida', 'abbrev': 'FL' }, { 'name': 'Georgia', 'abbrev': 'GA' }, { 'name': 'Hawaii', 'abbrev': 'HI' },
        { 'name': 'Idaho', 'abbrev': 'ID' }, { 'name': 'Illinois', 'abbrev': 'IL' }, { 'name': 'Indiana', 'abbrev': 'IN' },
        { 'name': 'Iowa', 'abbrev': 'IA' }, { 'name': 'Kansas', 'abbrev': 'KS' }, { 'name': 'Kentucky', 'abbrev': 'KY' },
        { 'name': 'Louisiana', 'abbrev': 'LA' }, { 'name': 'Maine', 'abbrev': 'ME' }, { 'name': 'Maryland', 'abbrev': 'MD' },
        { 'name': 'Massachusetts', 'abbrev': 'MA' }, { 'name': 'Michigan', 'abbrev': 'MI' }, { 'name': 'Minnesota', 'abbrev': 'MN' },
        { 'name': 'Mississippi', 'abbrev': 'MS' }, { 'name': 'Missouri', 'abbrev': 'MO' }, { 'name': 'Montana', 'abbrev': 'MT' },
        { 'name': 'Nebraska', 'abbrev': 'NE' }, { 'name': 'Nevada', 'abbrev': 'NV' }, { 'name': 'New Hampshire', 'abbrev': 'NH' },
        { 'name': 'New Jersey', 'abbrev': 'NJ' }, { 'name': 'New Mexico', 'abbrev': 'NM' }, { 'name': 'New York', 'abbrev': 'NY' },
        { 'name': 'North Carolina', 'abbrev': 'NC' }, { 'name': 'North Dakota', 'abbrev': 'ND' }, { 'name': 'Ohio', 'abbrev': 'OH' },
        { 'name': 'Oklahoma', 'abbrev': 'OK' }, { 'name': 'Oregon', 'abbrev': 'OR' }, { 'name': 'Pennsylvania', 'abbrev': 'PA' },
        { 'name': 'Rhode Island', 'abbrev': 'RI' }, { 'name': 'South Carolina', 'abbrev': 'SC' }, { 'name': 'South Dakota', 'abbrev': 'SD' },
        { 'name': 'Tennessee', 'abbrev': 'TN' }, { 'name': 'Texas', 'abbrev': 'TX' }, { 'name': 'Utah', 'abbrev': 'UT' },
        { 'name': 'Vermont', 'abbrev': 'VT' }, { 'name': 'Virginia', 'abbrev': 'VA' }, { 'name': 'Washington', 'abbrev': 'WA' },
        { 'name': 'West Virginia', 'abbrev': 'WV' }, { 'name': 'Wisconsin', 'abbrev': 'WI' }, { 'name': 'Wyoming', 'abbrev': 'WY' }
        );
        var returnthis = false;
        $.each(states, function (index, value) {
            if (to == 'name') {
                if (value.abbrev == name) {
                    returnthis = value.name;
                    return false;
                }
            } else if (to == 'abbrev') {
                if (value.name.toUpperCase() == name) {
                    returnthis = value.abbrev;
                    return false;
                }
            }
        });
        if (returnthis == false)
            returnthis = "your home state"
        return returnthis;
    }

} (EXCHANGE));

ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {



        var options = allBindingsAccessor().datepickerOptions || {},
            $el = $(element);

        //initialize datepicker with some optional options
        $el.datepicker(options);

        //handle the field changing
        ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor();
            observable($el.datepicker("getDate"));
        });

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $el.datepicker("destroy");
        });

    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            $el = $(element),
            current = $el.datepicker("getDate");

        if (value - current !== 0) {
            $el.datepicker("setDate", value);
        }
    }
};