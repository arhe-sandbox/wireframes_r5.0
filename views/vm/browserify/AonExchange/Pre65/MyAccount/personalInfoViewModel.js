(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.PersonalInfoViewModel = function PersonalInfoViewModel() {
        if (!(this instanceof PersonalInfoViewModel)) {
            return new PersonalInfoViewModel();
        }
        var self = this;
        self.isVMLoaded = ko.observable(false);

        self.firstName_tb = ko.observable('');
        self.firstNameEdit_tb = ko.observable('');
        

        self.lastName_tb = ko.observable('');
        self.lastNameEdit_tb = ko.observable('');
        

        self.dateOfBirth_lbl = ko.observable('');
        self.dateOfBirth_tb = ko.observable('');
        self.dateOfBirth = new app.models.DateOfBirthViewModel();
        

        self.gender_lbl = ko.observable('');
        self.gender_tb = ko.observable('');
        self.gender_male_lbl = ko.observable('');
        self.gender_female_lbl = ko.observable('');
        self.genderEdit_radio = ko.observable('');


        self.primaryPhone_lbl = ko.observable("");
        self.primaryNumber_tb = ko.observable("");
        self.primaryNumber = ko.observable("");
        self.primaryNumberFormatted = ko.computed({
            read: function () {
                if (self.primaryNumber() == null) {
                    return "";
                }
                return app.functions.formatPhoneNumberWithSpace(self.primaryNumber());
            },
            owner: this,
            deferEvaluation: true
        });


        self.emailAddressDNE_lbl = ko.observable("");
        self.userEmailAddress = ko.observable("");
        self.userEmailAddress_tb = ko.observable("");

        self.isSuppressInfo = ko.observable(false);
        self.suppressInfoRadio = ko.observable(false);
        self.loadRadiosFromBools = function loadRadiosFromBools() {
            self.suppressInfoRadio(self.isSuppressInfo() ? true : false);
        }
        self.updateSuppressInfo = function () {
            self.isSuppressInfo(self.suppressInfoRadio() === true);
        };
        self.suppressInfoChecked_tb = ko.observable("");

        self.inlineErrorsWereSorry_lbl = ko.observable('');
        self.inlineErrorsBody_lbl = ko.observable('');

        self.inlineErrorsExistProfileInfo = ko.observable(false);
        self.inlineErrorsProfileInfo = ko.observableArray([]);


        PersonalInfoViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.firstName_tb(viewModel.FirstName_Tb);
            protoSelf.firstNameEdit_tb(viewModel.FirstNameEdit_Tb);

            protoSelf.lastName_tb(viewModel.LastName_Tb);
            protoSelf.lastNameEdit_tb(viewModel.LastNameEdit_Tb);

            protoSelf.dateOfBirth_lbl(viewModel.DateOfBirth_Lbl);
            protoSelf.dateOfBirth_tb(viewModel.DateOfBirth_Tb);
            protoSelf.dateOfBirth.loadFromJSON(viewModel.DateOfBirthViewModel);
            
            protoSelf.gender_lbl(viewModel.Gender_Lbl);
            protoSelf.gender_tb(viewModel.Gender_Tb);
            protoSelf.gender_male_lbl(viewModel.Gender_Male_Lbl);
            protoSelf.gender_female_lbl(viewModel.Gender_Female_Lbl);
            protoSelf.genderEdit_radio(viewModel.GenderEdit_Radio);

            protoSelf.primaryPhone_lbl(viewModel.PrimaryPhone_Lbl);
            protoSelf.primaryNumber(viewModel.PrimaryNumber);
            
            if (viewModel.UserEmailAddress != null)
                protoSelf.userEmailAddress(viewModel.UserEmailAddress);
            else
                protoSelf.userEmailAddress("");
            protoSelf.emailAddressDNE_lbl(viewModel.EmailAddressDNE_Lbl);
            protoSelf.userEmailAddress_tb(viewModel.UserEmailAddress);

            protoSelf.isSuppressInfo(viewModel.IsSuppressInfo);

            protoSelf.inlineErrorsWereSorry_lbl(viewModel.InlineErrorsWereSorry_Lbl);
            protoSelf.inlineErrorsBody_lbl(viewModel.InlineErrorsBody_Lbl);

            protoSelf.isVMLoaded(true);

            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));