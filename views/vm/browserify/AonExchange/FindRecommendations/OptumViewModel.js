(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.OptumViewModel = function OptumViewModel() {
        if (!(this instanceof OptumViewModel)) {
            return new OptumViewModel();
        }
        var self = this;

        self.physicians = ko.observableArray([]);
        self.inlineErrorsExist = ko.observable(false);
        self.inlineErrors = ko.observableArray([]);
        self.doctorInNetwork = ko.observableArray();
        self.doctorDuration = ko.observableArray();
        self.docInNetwork_boundToSelectValue = ko.observable('');
        self.docDuration_boundToSelectValue = ko.observable('');
        self.doctorInNetwork_lbl = ko.observable('');
        self.doctorDuration_lbl = ko.observable('');

        self.doctorHeadingQuestion_lbl = ko.observable('');
        self.doctorInNetworkQuestion_lbl = ko.observable('');
        self.doctorDurationQuestion_lbl = ko.observable('');
        self.validationMessage = ko.observable();

        self.totalPhysicians = "0 Physicians Entered";
        self.chosenAnswer = ko.observable();

        self.chosenAnswer.subscribe(function (newValue) {
            if (newValue == false) {
                //self.docDuration_boundToSelectValue("none");
                //self.docInNetwork_boundToSelectValue("none");
                if (EXCHANGE.viewModels.MyGuidedActionViewModel === undefined) {
                    if (self.physicians().length > 0) {
                        //self.validationMessage("Please remove physicians before selecting No");
                        self.chosenAnswer(true);
                    }
                    else {
                        self.validationMessage("");
                    }
                }
                else {
                    self.validationMessage("");
                }

            };
            if (newValue == true) {
                if (self.physicians().length == 0) {
                    self.validationMessage("Please enter at least one physician.");
                }
                else {
                    //self.validationMessage("");
                }

            };
        }, this);

        ko.bindingHandlers.trueFalseRadioButton = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                // event handler for the element change event
                var changeHandler = function () {
                    var elementValue = $(element).val();
                    var observable = valueAccessor();      // set the observable value to the boolean value of the element value
                    observable($.parseJSON(elementValue));
                };    // register change handler for element
                ko.utils.registerEventHandler(element, "change", changeHandler);
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var elementValue = $.parseJSON($(element).val());
                var observableValue = ko.utils.unwrapObservable(valueAccessor()); if (elementValue === observableValue) {
                    element.checked = true;
                }
                else {
                    element.checked = false;
                }
            }
        };

        OptumViewModel.prototype.clearInlineErrors = function clearInlineErrors() {
            self.inlineErrorsExist(false);
            self.inlineErrors([]);
        };

        OptumViewModel.prototype.addInlineError = function addInlineError(inlineErrorStr) {
            self.inlineErrorsExist(true);
            var errorList = self.inlineErrors();
            errorList.push(inlineErrorStr);
            self.inlineErrors(errorList);
            return self;
        };

        OptumViewModel.prototype.initializeValidation = function initializeValidation() {
            var protoSelf = this;
            protoSelf.validationMessage("");
            if (protoSelf.physicians && protoSelf.physicians().length > 0) {
                protoSelf.chosenAnswer(true);
            }
            if (protoSelf.physicians && protoSelf.physicians().length == 0) {
                protoSelf.validationMessage("Please select an answer");
                protoSelf.chosenAnswer();
            }
            return protoSelf;
        };
        OptumViewModel.prototype.initializeValidationOnPageLoad = function initializeValidationOnPageLoad() {
            var protoSelf = this;
            protoSelf.validationMessage("");
            if (protoSelf.physicians && protoSelf.physicians().length > 0) {
                protoSelf.chosenAnswer(true);
            }
            if (protoSelf.physicians && protoSelf.physicians().length == 0) {
                protoSelf.validationMessage("Please select an answer");
                protoSelf.chosenAnswer();
            }
            return protoSelf;
        };

        OptumViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;
            if (viewModel) {
                while (protoSelf.physicians().length > 0) {
                    protoSelf.physicians().pop();
                }
                $.each(viewModel, function (index, phy) {
                    var newPhys = ko.mapping.fromJS(phy);
                    protoSelf.physicians.push(newPhys);
                });
            }
            protoSelf.totalPhysicians = "{0} Physicians Entered".format(self.physicians().length)
            return protoSelf;
        };

        OptumViewModel.prototype.loadPhysicianDropDown = function loadPhysicianDropDown(viewModel) {
            var protoSelf = this;
            protoSelf.doctorInNetwork(viewModel.DoctorInNetwork);
            protoSelf.doctorDuration(viewModel.DoctorDuration);
            protoSelf.docInNetwork_boundToSelectValue(viewModel.SelectedDoctorInNetwork);
            protoSelf.docDuration_boundToSelectValue(viewModel.SelectedDoctorDuration);
            protoSelf.doctorInNetwork_lbl(viewModel.DoctorInNetwork_lbl);
            protoSelf.doctorDuration_lbl(viewModel.DoctorDuration_lbl);

            protoSelf.doctorHeadingQuestion_lbl(viewModel.DoctorHeadingQuestion_lbl);
            protoSelf.doctorInNetworkQuestion_lbl(viewModel.DoctorInNetworkQuestion_lbl);
            protoSelf.doctorDurationQuestion_lbl(viewModel.DoctorDurationQuestion_lbl);
            return protoSelf;
        };
    };
} (EXCHANGE, this));


