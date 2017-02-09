(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");
    ns.MyDrugsVM = function MyDrugsVM() {
        if (!(this instanceof MyDrugsVM)) {
            return new MyDrugsVM();
        }
        var self = this;
        self.ShowWebPart = ko.observable(false);
        self.doneLoading = ko.observable(false);
        self.medicineCabinet_lbl = ko.observable('');
        self.medicineCabinetDesc_lbl = ko.observable('');
        self.medicineCabinetDNE_lbl = ko.observable('');
        self.medicineCabinetConfirmHeader_lbl = ko.observable('');
        self.medicineCabinetConfirmDesc_lbl = ko.observable('');
        self.changeMedicationsBtn_lbl = ko.observable('');
        self.medicineCabinetAuthorizeMessage_Lbl = ko.observable('');
        self.medCabRxAuthMessage = ko.computed({
            read: function () {
                var str = "";
                if (self.medicineCabinetAuthorizeMessage_Lbl() && self.medicineCabinetAuthorizeMessage_Lbl() != "") {
                    str = self.medicineCabinetAuthorizeMessage_Lbl();
                    str = str.replace("drugs", "medications");
                    str = str.replace("Change", "Manage");
                }
                return str;
            },
            owner: this,
            deferEvaluation: true
        });


        self.ValidationMessage = ko.observable('');
        self.totalDrugs = ko.computed({
            read: function () {
                if (app.user && app.user.UserSession && app.user.UserSession.ShowRxPreloadLb()) {
                    return self.medCabRxAuthMessage();
                }
                else if (EXCHANGE.viewModels.MyDrugsVM.chosenAnswer() == undefined)
                    self.ValidationMessage("Please select an answer.");
                return "{0} Medications Entered".format(self.drugs().length);
            },
            owner: this,
            deferEvaluation: true
        });

        self.chosenAnswer = ko.observable();

        self.chosenAnswer.subscribe(function (newValue) {
            if (newValue == false) {
                if (self.drugs().length > 0) {
                    self.ValidationMessage("Please remove medications before selecting No");
                    self.chosenAnswer(true);
                }
                else {
                    self.ValidationMessage("");
                }

            };
            if (newValue == true) {
                if (self.drugs().length == 0) {
                    self.ValidationMessage("Please enter at least one medication.");
                }
                else {
                    //                    self.ValidationMessage("");
                }

            };
        }, this);
        self.drugs = ko.computed({
            read: function () {

                var drugs = [];
                if (app.user && app.user.UserSession && app.user.UserSession.UserDrugs && ns.DrugViewModel) {
                    var userDrugs = app.user.UserSession.UserDrugs.drugs();
                    for (var i = 0; i < userDrugs.length; i++) {
                        var drugVm = new ns.DrugViewModel().loadFromUserDrug(userDrugs[i]);
                        app.drugs.AllDrugViewModels.push(drugVm);
                        drugs.push(drugVm);
                    }
                }

                drugs.sort(function (firstUserDrugVM, secondUserDrugVM) {
                    return firstUserDrugVM.userDrug().Drug.Name.toLowerCase() > secondUserDrugVM.userDrug().Drug.Name.toLowerCase() ? 1 : -1;
                });

                return drugs;
            },
            owner: this,
            deferEvaluation: true
        });
        self.drugs.subscribe(function (newValue) {
            if (app.viewModels.MyMedicationViewModel.frequencyString() == "") {
                app.viewModels.MyMedicationViewModel.frequencyString("refilled every {0}day");
            }
            self.ValidationMessage("");
            if (self.drugs().length == 0) {
                //   self.chosenAnswer(false);
                self.ValidationMessage("Please enter at least one medication.");
                $('input:radio[name="PwRxOptOut"][value=false]').attr('checked', false);
            }
            else {
                self.chosenAnswer(true);
            }
            $('.planrec-btn').addClass('plan-disabled');
            if (app.viewModels.findRecommendationsViewModel) {
                if (app.viewModels.findRecommendationsViewModel.doneLoading() == true) {
                    //var waitpopup = $('#utilisation').WaitPopup({ hide: true, fullWindow: false, contentTemplate: true });

                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: "/API/Recommendations/GetUtilisationDefaults",
                        success: function (data) {
                            //validation step
                            if (data == "") {
                                // app.functions.redirectToRelativeUrlFromSiteBase("find-plans.aspx");
                            }
                            else {
                                app.viewModels.UtilisationViewModel.loadUtilizationDefaults(data);
                                //setTimeout(ns.hoverDelay, 5);
                                // waitpopup.Close();
                                $('.planrec-btn').removeClass('plan-disabled');
                                event.returnValue = false;
                            }
                        },
                        error: function (data) {
                            //alert('Data Retrieval Error during Medical Service Utilization Load');
                            $.publish("EXCHANGE.lightbox.error.open");
                        }
                    });
                }
            }
        }, null, "change"
    );
        ko.bindingHandlers.trueFalseRadioButton =
{
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // event handler for the element change event
        var changeHandler = function () {
            var elementValue = $(element).val();
            var observable = valueAccessor();      // set the observable value to the boolean value of the element value
            observable($.parseJSON(elementValue));
        };    // register change handler for element
        ko.utils.registerEventHandler(element,
                                  "change",
                                  changeHandler);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var elementValue = $.parseJSON($(element).val());
        var observableValue = ko.utils.unwrapObservable(valueAccessor());
        if (elementValue === observableValue) {
            element.checked = true;
        }
        else {
            element.checked = false;
        }
    }
};

    };
} (EXCHANGE));
