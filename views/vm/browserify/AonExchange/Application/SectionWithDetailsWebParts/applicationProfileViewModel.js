(function (app) {
    var ns = app.namespace('EXCHANGE.models');

    ns.ApplicationProfileViewModel = function ApplicationProfileViewModel() {
        if (!(this instanceof ApplicationProfileViewModel)) {
            return new ApplicationProfileViewModel();
        }
        var self = this;

        self.infoProvidedEarlier_lbl = ko.observable('');
        self.fname_lbl = ko.observable('');
        self.fname_value = ko.observable('');
        self.lname_lbl = ko.observable('');
        self.lname_value = ko.observable('');
        self.dateOfBirth_lbl = ko.observable('');
        self.dateOfBirth_value = ko.observable('');
        self.gender_lbl = ko.observable('');
        self.male_lbl = ko.observable('');
        self.female_lbl = ko.observable('');
        self.gender_value = ko.observable('');
        self.phone_lbl = ko.observable('');
        self.addr1_lbl = ko.observable('');
        self.addr1_value = ko.observable('');
        self.addr2_lbl = ko.observable('');
        self.addr2_value = ko.observable('');
        self.city_lbl = ko.observable('');
        self.city_value = ko.observable('');
        self.state_lbl = ko.observable('');
        self.state_value = ko.observable('');
        self.phone_value = ko.observable('');
        self.claim_lbl = ko.observable('');
        self.claim_value = ko.observable('');
        self.pmt_lbl = ko.observable('');
        self.pmt_value = ko.observable('');
        self.zip_lbl = ko.observable('');
        self.zip_value = ko.observable('');
        self.county_lbl = ko.observable('');
        self.county_value = ko.observable('');
        self.tobaccoUse_lbl = ko.observable('');
        self.tobaccoUse_value = ko.observable('');
        self.disabled_lbl = ko.observable('');
        self.disabled_value = ko.observable('');
        self.beginDate_lbl = ko.observable('');
        self.beginDate_value = ko.observable('');
        self.needToMakeChange_lbl = ko.observable('');
        self.yes_lbl = ko.observable('');
        self.no_lbl = ko.observable('');

        ApplicationProfileViewModel.prototype.loadFromJSON = function loadFromJSON(serverViewModel) {
            var protoself = this;

            protoself.infoProvidedEarlier_lbl(serverViewModel.InfoProvidedEarlier_Lbl);
            protoself.fname_lbl(serverViewModel.FName_Lbl);
            protoself.fname_value(serverViewModel.Fname_Value);
            protoself.lname_lbl(serverViewModel.LName_Lbl);
            protoself.lname_value(serverViewModel.Lname_Value);
            protoself.addr1_lbl(serverViewModel.Addr1_Lbl);
            protoself.addr1_value(serverViewModel.Addr1_Value);
            protoself.addr2_lbl(serverViewModel.Addr2_Lbl);
            protoself.addr2_value(serverViewModel.Addr2_Value);
            protoself.city_lbl(serverViewModel.City_Lbl);
            protoself.city_value(serverViewModel.City_Value);
            protoself.phone_lbl(serverViewModel.Phone_Lbl);
            protoself.phone_value(serverViewModel.Phone_Value);
            protoself.state_lbl(serverViewModel.State_Lbl);
            protoself.state_value(serverViewModel.State_Value);
            protoself.claim_lbl(serverViewModel.MedNumber_Lbl);
            protoself.claim_value(serverViewModel.MedNumber_Value);
            protoself.pmt_lbl(serverViewModel.PymtMethod_Lbl);
            protoself.pmt_value(serverViewModel.PymtMethod_Value);
            protoself.dateOfBirth_lbl(serverViewModel.DateOfBirth_Lbl);
            protoself.dateOfBirth_value(serverViewModel.DateOfBirth_Value);
            protoself.gender_lbl(serverViewModel.Gender_Lbl);
            protoself.male_lbl(serverViewModel.Male_Lbl);
            protoself.female_lbl(serverViewModel.Female_Lbl);
            protoself.gender_value(serverViewModel.Gender_Value);
            protoself.zip_lbl(serverViewModel.Zip_Lbl);
            protoself.zip_value(serverViewModel.Zip_Value);
            protoself.county_lbl(serverViewModel.County_Lbl);
            protoself.county_value(serverViewModel.County_Value);
            protoself.tobaccoUse_lbl(serverViewModel.TobaccoUse_Lbl);
            protoself.tobaccoUse_value(serverViewModel.TobaccoUse_Value);
            protoself.disabled_lbl(serverViewModel.Disabled_Lbl);
            protoself.disabled_value(serverViewModel.Disabled_Value);
            protoself.beginDate_lbl(serverViewModel.BeginDate_Lbl);
            protoself.beginDate_value(serverViewModel.BeginDate_Value);
            protoself.needToMakeChange_lbl(serverViewModel.NeedToMakeChange_Lbl);
            protoself.yes_lbl(serverViewModel.Yes_Lbl);
            protoself.no_lbl(serverViewModel.No_Lbl);

            return protoself;
        };

        return self;
    };


} (EXCHANGE));