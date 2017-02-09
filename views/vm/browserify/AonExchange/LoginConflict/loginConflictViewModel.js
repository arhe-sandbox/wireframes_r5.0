(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.LoginConflictViewModel = function LoginConflictViewModel() {
        if (!(this instanceof LoginConflictViewModel)) {
            return new LoginConflictViewModel();
        }
        var self = this;

        self.TopHeader_Lbl = ko.observable('');
        self.Header_Lbl = ko.observable('');
        self.GoBack_Lbl = ko.observable('');
        self.Ok_Lbl = ko.observable('');
        self.Description_Lbl = ko.observable('');
        self.Profile_Lbl = ko.observable('');
        self.Search_Lbl = ko.observable('');
        self.IsConflict = ko.observable(false);

        self.UserZip_Lbl = ko.observable('');
        self.UserZipProfile_Text = ko.observable('');
        self.UserZipSearch_Text = ko.observable('');
        self.UserZip_Radio = ko.observable('');
        self.UserZip_IsConflict = ko.observable(false);

        self.DateOfBirth_Lbl = ko.observable('');
        self.DateOfBirthProfile_Text = ko.observable('');
        self.DateOfBirthSearch_Text = ko.observable('');
        self.DateOfBirth_Radio = ko.observable('');
        self.DateOfBirth_IsConflict = ko.observable(false);

        self.Gender_Lbl = ko.observable('');
        self.GenderProfile_Text = ko.observable('');
        self.GenderSearch_Text = ko.observable('');
        self.Gender_Radio = ko.observable('');
        self.Gender_IsConflict = ko.observable(false);

        self.County_Lbl = ko.observable('');
        self.CountyProfile = ko.observable('');
        self.CountySearch = ko.observable('');
        self.County_Radio = ko.observable('');
        self.County_IsConflict = ko.observable(false);

        self.Medications_Lbl = ko.observable('');
        self.NumberOfMedications_Lbl = ko.observable('');
        self.MedicationsBoth_Text = ko.observable('');
        self.MedicationsProfile = ko.observableArray([]);
        self.MedicationsSearch = ko.observableArray([]);
        self.Medications_Radio = ko.observable('');
        self.Medications_IsConflict = ko.observable(false);

        self.Pharmacy_Lbl = ko.observable('');
        self.PharmacyProfile = ko.observableArray([]);
        self.PharmacySearch = ko.observableArray([]);
        self.Pharmacy_Radio = ko.observable('');
        self.Pharmacy_IsConflict = ko.observable(false);

        self.Physician_Lbl = ko.observable('');
        self.PhysicianProfile = ko.observableArray([]);
        self.PhysicianSearch = ko.observableArray([]);
        self.Physician_Radio = ko.observable('');
        self.Physician_IsConflict = ko.observable(false);


        self.doneCallback = null;
        self.hasBeenLoaded = false;

        LoginConflictViewModel.prototype.loadFromJSON = function loadFromJSON(serversideViewModel) {
            var protoself = this;

            protoself.TopHeader_Lbl(serversideViewModel.TopHeader_Lbl);
            protoself.Header_Lbl(serversideViewModel.Header_Lbl);
            protoself.GoBack_Lbl(serversideViewModel.GoBack_Lbl);
            protoself.Ok_Lbl(serversideViewModel.Ok_Lbl);
            protoself.Description_Lbl(serversideViewModel.Description_Lbl);
            protoself.Profile_Lbl(serversideViewModel.Profile_Lbl);
            protoself.Search_Lbl(serversideViewModel.Search_Lbl);
            protoself.IsConflict(serversideViewModel.IsConflict);

            protoself.UserZip_Lbl(serversideViewModel.UserZip_Lbl);
            protoself.UserZipProfile_Text(serversideViewModel.UserZipProfile_Text);
            protoself.UserZipSearch_Text(serversideViewModel.UserZipSearch_Text);
            protoself.UserZip_Radio(serversideViewModel.UserZip_Radio);
            protoself.UserZip_IsConflict(serversideViewModel.UserZip_IsConflict);

            protoself.DateOfBirth_Lbl(serversideViewModel.DateOfBirth_Lbl);
            protoself.DateOfBirthProfile_Text(serversideViewModel.DateOfBirthProfile_Text);
            protoself.DateOfBirthSearch_Text(serversideViewModel.DateOfBirthSearch_Text);
            protoself.DateOfBirth_Radio(serversideViewModel.DateOfBirth_Radio);
            protoself.DateOfBirth_IsConflict(serversideViewModel.DateOfBirth_IsConflict);

            protoself.Gender_Lbl(serversideViewModel.Gender_Lbl);
            protoself.GenderProfile_Text(serversideViewModel.GenderProfile_Text);
            protoself.GenderSearch_Text(serversideViewModel.GenderSearch_Text);
            protoself.Gender_Radio(serversideViewModel.Gender_Radio);
            protoself.Gender_IsConflict(serversideViewModel.Gender_IsConflict);

            protoself.County_Lbl(serversideViewModel.County_Lbl);
            protoself.CountyProfile(ko.mapping.fromJS(serversideViewModel.CountyProfile));
            protoself.CountySearch(ko.mapping.fromJS(serversideViewModel.CountySearch));
            protoself.County_Radio(serversideViewModel.County_Radio);
            protoself.County_IsConflict(serversideViewModel.County_IsConflict);

            protoself.Medications_Lbl(serversideViewModel.Medications_Lbl);
            protoself.NumberOfMedications_Lbl(serversideViewModel.NumberOfMedications_Lbl);
            protoself.MedicationsBoth_Text(serversideViewModel.MedicationsBoth_Text);
            protoself.MedicationsProfile(serversideViewModel.MedicationsProfile);
            protoself.MedicationsSearch(serversideViewModel.MedicationsSearch);
            protoself.Medications_Radio(serversideViewModel.Medications_Radio);
            protoself.Medications_IsConflict(serversideViewModel.Medications_IsConflict);

            protoself.Pharmacy_Lbl(serversideViewModel.Pharmacy_Lbl);
            protoself.PharmacyProfile(serversideViewModel.PharmacyProfile);
            protoself.PharmacySearch(serversideViewModel.PharmacySearch);
            protoself.Pharmacy_Radio(serversideViewModel.Pharmacy_Radio);
            protoself.Pharmacy_IsConflict(serversideViewModel.Pharmacy_IsConflict);

            protoself.Physician_Lbl(serversideViewModel.Physician_Lbl);
            protoself.PhysicianProfile(serversideViewModel.PhysicianProfile);
            protoself.PhysicianSearch(serversideViewModel.PhysicianSearch);
            protoself.Physician_Radio(serversideViewModel.Physician_Radio);
            protoself.Physician_IsConflict(serversideViewModel.Physician_IsConflict);

            protoself.hasBeenLoaded = true;

            return protoself;
        };

        return self;
    };

} (EXCHANGE));