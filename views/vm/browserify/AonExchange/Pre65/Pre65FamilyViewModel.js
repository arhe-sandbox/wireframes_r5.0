(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.Pre65FamilyViewModel = function Pre65FamilyViewModel() {
        if (!(this instanceof Pre65FamilyViewModel)) {
            return new Pre65FamilyViewModel();


        }
        var self = this;

        self.familyInformationTitleLbl = ko.observable('');
        self.under65Lbl = ko.observable('');
        self.over65Lbl = ko.observable('');

        self.over65NoPrimary = ko.observableArray([]);
        self.under65 = ko.observableArray([]);

        self.firstNameEdit_tb = ko.observable('');
        self.lastNameEdit_tb = ko.observable('');

        self.genderEdit_lbl = ko.observable('');
        self.gender_male_lbl = ko.observable('');
        self.gender_female_lbl = ko.observable('');
        self.genderEdit_radio = ko.observable('');

        self.tobaccoEdit_Lbl = ko.observable('');
        self.tobacco_No_Lbl = ko.observable('');
        self.tobacco_Yes_Lbl = ko.observable('');
        self.tobaccoEdit_Radio = ko.observable('');

        self.action = ko.observable('add'); //edit
        self.editId = ko.observable(''); //edit

        self.relationType = ko.observableArray([]);
        self.relationType_Lbl = ko.observable('');
        self.relation = ko.observable('');
        self.relation_tb = ko.observable('');
        self.dateOfBirth_lbl = ko.observable('');
        self.dateOfBirth = new app.models.DateOfBirthViewModel();

        self.addEditFamilyMember_Lbl = ko.observable('');
        self.addEditFamilyMemberBtn_Lbl = ko.observable(''); ;
        self.firstName_Lbl = ko.observable(''); ;
        self.lastName_Lbl = ko.observable(''); ;
        self.submitFamilyBtn_Lbl = ko.observable(''); ;
        self.cancelBtn_Lbl = ko.observable(''); ;
        self.errorMessage_Lbl = ko.observable('');
        self.newDependent_Lbl = ko.observable('');


        Pre65FamilyViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoself = this;
            protoself.over65NoPrimary([]);
            $.each(viewModel.Over65NoPrimary, function (index, over65NoPrimary) {
                over65NoPrimary.DateOfBirth = moment(over65NoPrimary.DateOfBirth).format("MM/DD/YYYY");
                protoself.over65NoPrimary.push(over65NoPrimary);

            });
            protoself.under65([]);
            $.each(viewModel.Under65, function (index, under65) {
                under65.DateOfBirth = moment(under65.DateOfBirth).format("MM/DD/YYYY");
                protoself.under65.push(under65);

            });

            protoself.under65Lbl(viewModel.Under65Lbl);
            protoself.over65Lbl(viewModel.Over65Lbl);
            protoself.familyInformationTitleLbl(viewModel.FamilyInformationTitleLbl);

            protoself.firstNameEdit_tb("");
            protoself.lastNameEdit_tb("");
            protoself.genderEdit_lbl(viewModel.GenderEdit_Lbl);
            protoself.gender_male_lbl(viewModel.Gender_Male_Lbl);
            protoself.gender_female_lbl(viewModel.Gender_Female_Lbl);
            protoself.genderEdit_radio(viewModel.GenderEdit_Radio);

            protoself.tobaccoEdit_Lbl(viewModel.TobaccoEdit_Lbl);
            protoself.tobacco_No_Lbl(viewModel.Tobacco_No_Lbl);
            protoself.tobacco_Yes_Lbl(viewModel.Tobacco_Yes_Lbl);
            protoself.tobaccoEdit_Radio(viewModel.TobaccoEdit_Radio);

            protoself.action("add");
            protoself.editId("");
            protoself.relationType(viewModel.RelationType);
            protoself.relationType_Lbl(viewModel.RelationType_Lbl);
            protoself.relation("");

            protoself.dateOfBirth_lbl(viewModel.DateOfBirth_Lbl);
            protoself.dateOfBirth.loadFromJSON(viewModel.DateOfBirthViewModel);

            protoself.addEditFamilyMember_Lbl(viewModel.AddEditFamilyMember_Lbl);
            protoself.addEditFamilyMemberBtn_Lbl(viewModel.AddFamilyMemberBtn_Lbl);
            protoself.firstName_Lbl(viewModel.FirstName_Lbl);
            protoself.lastName_Lbl(viewModel.LastName_Lbl);
            protoself.submitFamilyBtn_Lbl(viewModel.SubmitFamilyBtn_Lbl);
            protoself.cancelBtn_Lbl(viewModel.CancelBtn_Lbl);
            protoself.errorMessage_Lbl(viewModel.ErrorMessage_Lbl);
            protoself.newDependent_Lbl(viewModel.NewDependent_Lbl);

            return protoself;
        };

    };

} (EXCHANGE));
