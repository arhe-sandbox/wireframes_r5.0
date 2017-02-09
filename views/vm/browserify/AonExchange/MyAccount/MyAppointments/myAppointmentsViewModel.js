(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.MyAppointmentsViewModel = function MyAppointmentsViewModel() {
        if (!(this instanceof MyAppointmentsViewModel)) {
            return new MyAppointmentsViewModel();
        }
        var self = this;

        self.appointments = ko.observableArray([]);

        self.MyAppointmentsHeaderText = ko.observable("");
        self.AppointmentsHeader = ko.observable("");
        self.BetweenText = ko.observable("");
        self.BetweenTimeAndText = ko.observable("");
        self.CancelText = ko.observable("");
        self.ConfirmText = ko.observable("");
        self.PleaseConfirmText = ko.observable("");
        self.ConfirmedText = ko.observable("");
        self.ReallyCancel = ko.observable("");
        self.CancelYes = ko.observable("");
        self.CancelNo = ko.observable("");
        self.RescheduleText = ko.observable("");
        self.NoAppointments = ko.observable("");
        self.RescheduleApptBottomText = ko.observable("");
        self.ExtraBottomText = ko.observable("");
        self.ShowWebPart = ko.observable(true);
        self.Appt_options = ko.observableArray([]);
        self.Appt_text = ko.observable('');
        self.Appt_val = ko.observable('');
        self.DualStateMsg = ko.observable("");
        self.Ok = ko.observable("");

        self.errorMsg = ko.observable("");
        self.thirtyDayRule = ko.observable("");
        self.apptNotAvailable = ko.observable("");
        self.selectAnotherDate = ko.observable("");
        self.callBack = ko.observable("");
        self.notHomeStateReschedule = ko.observable("");
        self.locatedInHomeStateAppt = ko.observable("");

        self.ShowNoAppointments = ko.computed({
            read: function () {
                return self.appointments().length == 0;
            },
            owner: this,
            deferEvaluation: true
        });

        self.ClientPhoneNumber = ko.computed({
            read: function () {
                if (app.user && app.user.UserSession && app.user.UserSession.UserProfile && app.user.UserSession.UserProfile.primaryConnection()) {
//                    if (app.user.UserSession.Cphone != null) {
                      return EXCHANGE.viewModels.LoginHeaderViewModel.phoneNumberHtml();
////                        app.user.UserSession.Cphone;
//                    }
//                    else
//                        return app.user.UserSession.UserProfile.primaryConnection().PhoneNumber;
                }
                return '';
            },
            owner: this
        });

        self.NotInHomeStateMsg = ko.computed({
            read: function () {
                if (app.viewModels && app.viewModels.MyAppointmentsViewModel && app.viewModels.MyAppointmentsViewModel.ClientPhoneNumber()) {
                    return EXCHANGE.viewModels.MyAppointmentsViewModel.notHomeStateReschedule()
                }
                return '';
            },
            owner: this
        });

        self.ClientState = ko.computed({
            read: function () {
                if (app.user && app.user.UserSession && app.user.UserSession.UserProfile && app.user.UserSession.UserProfile) {
                    return app.user.UserSession.UserProfile.state;
                }
                return '';
            },
            owner: this
        });

        self.loadTimeSlots = function loadTimeSlots(data) {
            var protoSelf = this;

            /*var external = [1, 2, 3];
            var local = external;
            // pretend from here on we can only access local, not external

            var newStuff = [4, 5, 6];
            local.length = 0;
            Array.prototype.push.apply(local, newStuff);

            // now read out the contents of external
            console.log(external); // outputs [4, 5, 6]*/

            var currOptions = protoSelf.Appt_options;
            var newoptions = data;
            currOptions.length = 0;
            Array.prototype.push.apply(currOptions, newoptions);
            //protoSelf.Appt_options.push(data);

            return protoSelf;
        }

        MyAppointmentsViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;

            $.each(viewModel.Appointments, function (index, appt) {
                var newAppt = ko.mapping.fromJS(appt);

                newAppt.IsCanceling = ko.observable(false);
                newAppt.ShowReschedulePopup = ko.observable(false);
                newAppt.CanContinue = ko.observable(false);
                newAppt.RescheduleSuccessful = ko.observable(false);
                newAppt.IsUpdatingPhone = ko.observable(false);
                newAppt.IsPrimary = ko.observable(false);
                newAppt.InvalidPhone = ko.observable(false);
                newAppt.OrigPhone = ko.observable('');
                newAppt.IsRescheduling = ko.observable(false);
                newAppt.ShowDualStateDialog = ko.observable(false);
                newAppt.ShowConfirmAptDialog = ko.observable(false);
                newAppt.ShowCallSpecialAdvisorDialog = ko.observable(false);
                newAppt.ShowPriorUnconfirmedDialog = ko.observable(false);
                newAppt.IsRescheduleFlow = ko.observable(false);
                newAppt.ShowRescMsg = ko.observable(false);
                newAppt.MsgType = ko.observable(false);

                newAppt.RescMsg = ko.computed(function () {
                    var type = newAppt.MsgType();
                    if (type == 'error') {
                        return EXCHANGE.viewModels.MyAppointmentsViewModel.errorMsg();
                    }
                    if (type == '30dayrule') {
                        return EXCHANGE.viewModels.MyAppointmentsViewModel.thirtyDayRule();
                    }
                    if (type == 'apptnotavailable') {
                        return EXCHANGE.viewModels.MyAppointmentsViewModel.apptNotAvailable();
                    }
                    if (type == 'selectanotherday') {
                        return EXCHANGE.viewModels.MyAppointmentsViewModel.selectAnotherDate();
                    }
                    if (type == 'callback') {
                        return EXCHANGE.viewModels.MyAppointmentsViewModel.callBack();
                    }

                });

                newAppt.ApptConfirmationMessage = ko.computed(function () {
                    return "Your appointment has been confirmed for " + appt.DateString + " between the hours of " + appt.FromTimeString + " to " + appt.ToTimeString + ".";
                });

                //First time CONFIRM clicked
                newAppt.ConfirmClick = function () {

                    if (_gaq) {
                        _gaq.push(['_trackEvent', 'Appointment', 'Click', 'Confirm']);
                    }
                    var protoSelf = this;
                    if (protoSelf.IsConfirmed()) return protoSelf;
                    if (EXCHANGE.functions.formatPhoneNumber(protoSelf.Phone()) === "") {
                        protoSelf.InvalidPhone(true);
                        return protoSelf;
                    }
                    if (!EXCHANGE.myAppointments.CanConfirmThisAppointment(newAppt)) {
                        protoSelf.ShowPriorUnconfirmedDialog(true);
                        return protoSelf;
                    }
                    protoSelf.IsRescheduleFlow(false);
                    protoSelf.ShowDualStateDialog(true);
                    protoSelf.ShowConfirmAptDialog(false);
                    protoSelf.ShowCallSpecialAdvisorDialog(false);
                    protoSelf.ShowPriorUnconfirmedDialog(false);
                    return protoSelf;
                };
                //added these as placeholders to support ActionNeededAlert changes.
                newAppt.CancelClick = function () { };
                newAppt.CancelCancelClick = function () { };
                newAppt.CancelConfirmClick = function () { };
                //CONFIRM-> OK (means in the state) clicked
                newAppt.ConfirmConfirmClick = function () {
                    var protoSelf = this;
                    //if (!EXCHANGE.myAppointments.CanConfirmThisAppointment(protoSelf.Id())) { }
                    //alert("Unconfirmed appt available for later date as well. Firts confirm that.");

                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/API/Account/ConfirmAppointment",
                        dataType: "json",
                        data: JSON.stringify({ appointmentId: protoSelf.Id() })
                    });

                    protoSelf.IsConfirmed(true);
                    if (app.viewModels.MyAccountSidebarViewModel)
                        app.viewModels.MyAccountSidebarViewModel.numberOfNewAppointments(app.viewModels.MyAccountSidebarViewModel.numberOfNewAppointments() - 1);

                    protoSelf.IsRescheduleFlow(false);
                    protoSelf.ShowDualStateDialog(false);
                    protoSelf.ShowConfirmAptDialog(true);
                    protoSelf.ShowCallSpecialAdvisorDialog(false);
                    protoSelf.ShowPriorUnconfirmedDialog(false);

                    return protoSelf;
                };
                //CONFIRM -> Cancel(that means not in state)
                newAppt.ConfirmCancelClick = function () {
                    var protoSelf = this;
                    protoSelf.IsRescheduleFlow(false);
                    protoSelf.ShowDualStateDialog(false);
                    protoSelf.ShowConfirmAptDialog(false);
                    protoSelf.ShowCallSpecialAdvisorDialog(true);
                    protoSelf.ShowPriorUnconfirmedDialog(false);
                    return protoSelf;
                };
                // CONFIRM-> OK (dual state)-> OK (Confirmation message) 
                newAppt.ConfirmConfirmOKClick = function () {
                    var protoSelf = this;
                    protoSelf.ShowDualStateDialog(false);
                    protoSelf.ShowConfirmAptDialog(false);
                    protoSelf.ShowCallSpecialAdvisorDialog(false);
                    protoSelf.ShowPriorUnconfirmedDialog(false);
                    protoSelf.IsConfirmed(true);
                    return protoSelf;
                };
                newAppt.OutOfStateMessageRead = function () {
                    var protoSelf = this;
                    protoSelf.ShowDualStateDialog(false);
                    protoSelf.ShowConfirmAptDialog(false);
                    protoSelf.ShowCallSpecialAdvisorDialog(false);
                    protoSelf.ShowPriorUnconfirmedDialog(false);
                    return protoSelf;
                };

                newAppt.UpdatePhoneClick = function () {

                    if (_gaq) {
                        _gaq.push(['_trackEvent', 'Appointment phone', 'Click', 'Cancel']);
                    }

                    var protoSelf = this;
                    newAppt.OrigPhone(protoSelf.Phone());
                    protoSelf.IsUpdatingPhone(true);
                    $('#appt-phone').select();
                    return protoSelf;
                };
                newAppt.PhoneCancelClick = function () {
                    var protoSelf = this;
                    protoSelf.Phone(protoSelf.OrigPhone());
                    protoSelf.InvalidPhone(false);
                    protoSelf.IsUpdatingPhone(false);
                    return protoSelf;
                };
                newAppt.PhoneConfirmClick = function () {
                    var protoSelf = this;
                    if (EXCHANGE.functions.formatPhoneNumber(protoSelf.Phone()) === "") {
                        protoSelf.InvalidPhone(true);
                        return protoSelf;
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/API/Account/UpdateAppointmentPhone",
                        dataType: "json",
                        data: JSON.stringify({ appointmentId: protoSelf.Id(), Phone: protoSelf.Phone(), IsPrimary: protoSelf.IsPrimary() })
                    });
                    if (protoSelf.IsPrimary() === true) {
                        var appts = EXCHANGE.viewModels.MyAppointmentsViewModel.appointments();
                        for (var i = 0; i < appts.length; i++) {
                            //EXCHANGE.viewModels.MyAppointmentsViewModel.appointments[i].Phone();
                        }
                    }
                    protoSelf.IsUpdatingPhone(false);
                    protoSelf.InvalidPhone(false);
                    return protoSelf;
                };
                //RESCH -> Clicked Reschedule button -> Show state dialog
                newAppt.RescheduleClick = function () {
                    var protoSelf = this;
                    protoSelf.IsRescheduleFlow(true);
                    protoSelf.ShowDualStateDialog(true);
                    protoSelf.ShowConfirmAptDialog(false);
                    protoSelf.ShowCallSpecialAdvisorDialog(false);
                    protoSelf.ShowPriorUnconfirmedDialog(false);
                    protoSelf.ShowReschedulePopup(false);
                    return protoSelf;
                };
                // RESCH -> Clicked No for in-state
                newAppt.RescheduleCancelClick = function () {
                    var protoSelf = this;
                    protoSelf.IsRescheduleFlow(true);
                    protoSelf.ShowDualStateDialog(false);
                    protoSelf.ShowConfirmAptDialog(false);
                    protoSelf.ShowCallSpecialAdvisorDialog(true);
                    protoSelf.ShowPriorUnconfirmedDialog(false);
                    return protoSelf;
                };
                // RESCH -> Clicked Yes for in-state
                newAppt.RescheduleConfirmClick = function () {
                    var protoSelf = this;
                    if (EXCHANGE.functions.formatPhoneNumber(protoSelf.Phone()) === "") {
                        protoSelf.UpdatePhoneClick();
                        return protoSelf;
                    }
                    protoSelf.ShowDualStateDialog(false);
                    protoSelf.ShowReschedulePopup(true);
                    protoSelf.GetTimeSlots();
                    $('#reschDateFromWS').dropkick();
                    return protoSelf;
                };
                newAppt.GetTimeSlots = function () {
                    var protoSelf = this;
                    EXCHANGE.WaitPopup = $(window).WaitPopup();
                    protoSelf.ShowRescMsg(false);
                    if (EXCHANGE.myAppointments.isDateAfter30days(protoSelf.ApptDate())) {
                        protoSelf.MsgType("30dayrule");
                        protoSelf.ShowRescMsg(true);
                    }
                    var typeTxt = "NA";
                    if (protoSelf.Type() == 2 || protoSelf.Type() == 3) {
                        typeTxt = "SALES"
                    }
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/API/Account/GetAppointmentTimeSlots",
                        dataType: "json",
                        data: JSON.stringify({ appointmentId: protoSelf.Id(), date: protoSelf.ApptDate(), type: typeTxt }),
                        success: function (response) {
                            var res = response;
                            EXCHANGE.WaitPopup.Close();
                            if (!res.HasError) {
                                app.viewModels.MyAppointmentsViewModel.Appt_options(response.AvailableDayTimeSlots);
                                $('#reschDateFromWS').dropkick();
                                if (response.AvailableDayTimeSlots.length > 0) {
                                    protoSelf.CanContinue(true);
                                    if (EXCHANGE.myAppointments.isDateAfter30days(protoSelf.ApptDate())) {
                                        protoSelf.MsgType("30dayrule");
                                        protoSelf.ShowRescMsg(true);
                                    } else {
                                        protoSelf.ShowRescMsg(false);
                                    }
                                } else {
                                    protoSelf.MsgType("selectanotherday");
                                    protoSelf.CanContinue(false);
                                    protoSelf.ShowRescMsg(true);
                                }
                            } else {
                                protoSelf.MsgType("callback");
                                protoSelf.ShowRescMsg(true);
                            }
                        },
                        error: function () {
                            protoSelf.MsgType("error");
                            EXCHANGE.WaitPopup.Close();
                            protoSelf.ShowRescMsg(true);
                        }
                    });

                };
                // RESCH -> Clicked on Continue button to confirm the timing
                newAppt.RescheduleWSToConfirm = function () {
                    var protoSelf = this;
                    protoSelf.ShowRescMsg(false);
                    app.ButtonSpinner = $("#resch-continue").ButtonSpinner({ buttonType: app.enums.ButtonType.SMALLBLUE });
                    var apttDetailId = EXCHANGE.functions.getDropdownSelectedOptionValue('#sendMessageSubjectDiv');
                    var timeSelected = EXCHANGE.functions.getDropdownSelectedOption('#sendMessageSubjectDiv');
                    var json1 = JSON.parse(apttDetailId);
                    var options = app.viewModels.MyAppointmentsViewModel.Appt_options;
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/API/Account/RescheduleAppointment",
                        dataType: "json",
                        data: JSON.stringify(json1),
                        success: function (response) {
                            app.ButtonSpinner.Stop();
                            var res = response;
                            if (res.success && res.success == true) {
                                var newAppDate = JSON.parse(EXCHANGE.functions.getDropdownSelectedOptionValue('#sendMessageSubjectDiv'));
                                var startHour = app.myAppointments.GetHourAMPM(newAppDate.WindowStart);
                                var endHour = app.myAppointments.GetHourAMPM(newAppDate.WindowEnd);

                                newAppt.DateString(app.myAppointments.GetDateFormatted(newAppDate.WindowStart));
                                newAppt.FromTimeString(startHour);
                                newAppt.ToTimeString(endHour);

                                protoSelf.ShowReschedulePopup(false);
                                protoSelf.RescheduleSuccessful(true);
                                protoSelf.IsConfirmed(true);
                                //appt.DateString = timeSelected;
                            }
                            if (res.unavailable && res.unavailable == true) {
                                protoSelf.MsgType("apptnotavailable");
                                protoSelf.ShowRescMsg(true);
                            }
                        },
                        error: function (data) {
                            app.ButtonSpinner.Stop();
                            protoSelf.MsgType("error");
                            protoSelf.ShowRescMsg(true);
                        }
                    });
                };
                // RESCH -> Show final confirmation message
                newAppt.RescheduleSuccessfulClickOK = function () {
                    var protoSelf = this;
                    protoSelf.ShowReschedulePopup(false);
                    protoSelf.RescheduleSuccessful(false);
                    return protoSelf;
                };

                newAppt.InStateShowRescheduleOrConfirmDialog = function () {
                    var protoSelf = this;
                    if (protoSelf.IsRescheduleFlow()) {
                        protoSelf.RescheduleConfirmClick();
                    } else {
                        protoSelf.ConfirmConfirmClick();
                    }
                    return protoSelf;
                };

                protoSelf.appointments.push(newAppt);
            });

            protoSelf.MyAppointmentsHeaderText(viewModel.MyAppointmentsHeaderText);
            protoSelf.AppointmentsHeader(viewModel.AppointmentsHeader);
            protoSelf.BetweenText(viewModel.BetweenText);
            protoSelf.BetweenTimeAndText(viewModel.BetweenTimeAndText);
            protoSelf.CancelText(viewModel.CancelText);
            protoSelf.ConfirmText(viewModel.ConfirmText);
            protoSelf.PleaseConfirmText(viewModel.PleaseConfirmText);
            protoSelf.ConfirmedText(viewModel.ConfirmedText);
            protoSelf.ReallyCancel(viewModel.ReallyCancel);
            protoSelf.CancelYes(viewModel.CancelYes);
            protoSelf.CancelNo(viewModel.CancelNo);
            protoSelf.RescheduleText(viewModel.RescheduleText);
            protoSelf.RescheduleApptBottomText(viewModel.RescheduleApptBottomText);
            protoSelf.ExtraBottomText(viewModel.ExtraBottomText);

            protoSelf.Appt_options(viewModel.Appt_Options);
            protoSelf.Appt_text(viewModel.Appt_Text);
            protoSelf.Appt_val(viewModel.Appt_Val);

            protoSelf.errorMsg(viewModel.ErrorMsg);
            protoSelf.thirtyDayRule(viewModel.ThirtyDayRule);
            protoSelf.apptNotAvailable(viewModel.ApptNotAvailable);
            protoSelf.selectAnotherDate(viewModel.SelectAnotherDate);
            protoSelf.callBack(viewModel.CallBack);
            protoSelf.notHomeStateReschedule(viewModel.NotHomeStateReschedule);
            protoSelf.locatedInHomeStateAppt(viewModel.LocatedInHomeStateAppt);

            protoSelf.NoAppointments(viewModel.NoAppointments);
            if (app.myAppointments != undefined) {
                //Get the message from server rather than constructing on client side to avoid false
                if (EXCHANGE.viewModels.MyAppointmentsViewModel.locatedInHomeStateAppt)
                    protoSelf.DualStateMsg(EXCHANGE.viewModels.MyAppointmentsViewModel.locatedInHomeStateAppt());
            }
            protoSelf.Ok(viewModel.OK);
            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));
