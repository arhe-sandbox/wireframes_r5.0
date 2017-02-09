(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.CommVm = function CommVm(viewModel) {
        if (!(this instanceof CommVm)) {
            return new CommVm();
        }

        var self = this;
        self.selectOne_lbl = ko.observable('');

        self.primaryPhone_lbl = ko.observable("");
        self.primaryNumber = ko.observable("");
        self.primaryNumber_tb = ko.observable("");
        self.primaryNumberFormatted = ko.computed({
            read: function () {
                if (self.primaryNumber() == null) {
                    return "";
                }
                return app.functions.autoFormatPhoneNumber(self.primaryNumber());
            },
            owner: this,
            deferEvaluation: true
        });

        self.emailAddressDNE_lbl = ko.observable("");
        self.userEmailAddress = ko.observable("");
        self.userEmailAddress_tb = ko.observable("");

        self.isOkToCall = ko.observable(true);
        self.isOkToEmail = ko.observable(true);
        self.isOkToMail = ko.observable(true);
        self.callRadio = ko.observable(true);
        self.emailRadio = ko.observable(true);
        self.mailRadio = ko.observable(false);
        self.loadRadiosFromBools = function loadRadiosFromBools() {
            self.callRadio(self.isOkToCall() ? true : false);
            self.emailRadio(self.isOkToEmail() ? true : false);
            self.mailRadio(self.isOkToMail() ? true : false);
        }
        self.updateCommRestrictions = function () {
            self.isOkToCall(self.callRadio() == true);
            self.isOkToEmail(self.emailRadio() == true);
            self.isOkToMail(self.mailRadio() == true);
        };
    };

    ns.POAVm = function POAVm(viewModel) {
        if (!(this instanceof POAVm)) {
            return new POAVm();
        }

        var self = this;
        self.ShowWebPart = ko.observable(false);
        self.powerOfAttorneyIsEmpty = ko.observable(true);
        self.powerOfAttorneyDesignate_radio = ko.observable('');
        self.powerOfAttorney_lbl = ko.observable('');
        self.powerOfAttorneyDesc_lbl = ko.observable('');
        self.powerOfAttorneyDNE_lbl = ko.observable('');
        self.powerOfAttorneyName_lbl = ko.observable('');
        self.powerOfAttorneyFirstName_tb = ko.observable('');
        self.powerOfAttorneyLastName_tb = ko.observable('');
        self.powerOfAttorneyAddress1_lbl = ko.observable('');
        self.powerOfAttorneyAddress1_tb = ko.observable('');
        self.powerOfAttorneyAddress2_lbl = ko.observable('');
        self.powerOfAttorneyAddress2_tb = ko.observable('');
        self.powerOfAttorneyCity_lbl = ko.observable('');
        self.powerOfAttorneyCity_tb = ko.observable('');
        self.powerOfAttorneyState_lbl = ko.observable('');
        self.powerOfAttorneyState_tb = ko.observable('');
        self.powerOfAttorneyZip_lbl = ko.observable('');
        self.powerOfAttorneyZip_tb = ko.observable('');
        self.powerOfAttorneyCounty_tb = ko.observable('');
        self.powerOfAttorneyCounty_lbl = ko.observable('');
        self.powerOfAttorneyPhone_lbl = ko.observable('');
        self.powerOfAttorneyPhone_tb = ko.observable('');

        self.powerOfAttorneyDesignate_lbl = ko.observable('');
        self.powerOfAttorneyDesignateYes_lbl = ko.observable('');
        self.powerOfAttorneyDesignateNo_lbl = ko.observable('');
        self.powerOfAttorneyDesignateEdit_radio = ko.observable('');
        self.powerOfAttorneyDesignateEdit_radio.subscribe(function (val) {
            if (val == "Yes") {
                $('.pre65-wrap-attorney').show();
            }
            else {
                $('.pre65-wrap-attorney').hide();
            }
        });

        self.powerOfAttorneyNameEdit_lbl = ko.observable('');
        self.powerOfAttorneyFirstNameEdit_tb = ko.observable('');
        self.powerOfAttorneyFirstNameEdit_tip = ko.observable('');
        self.powerOfAttorneyLastNameEdit_tb = ko.observable('');
        self.powerOfAttorneyLastNameEdit_tip = ko.observable('');
        self.powerOfAttorneyAddressEdit_lbl = ko.observable('');
        self.powerOfAttorneyAddress1Edit_tb = ko.observable('');
        self.powerOfAttorneyAddress1Edit_tip = ko.observable('');
        self.powerOfAttorneyAddress2Edit_tb = ko.observable('');
        self.powerOfAttorneyAddress2Edit_tip = ko.observable('');
        self.powerOfAttorneyCityEdit_lbl = ko.observable('');
        self.powerOfAttorneyCityEdit_tb = ko.observable('');
        self.powerOfAttorneyStateEdit_lbl = ko.observable('');
        self.powerOfAttorneyStateEdit_tb = ko.observable('');
        self.powerOfAttorneyZipEdit_lbl = ko.observable('');
        self.powerOfAttorneyZipEdit_tb = ko.observable('');
        self.powerOfAttorneyCountyEdit_tb = ko.observable('');
        self.select_One_lbl = ko.observable('');
        self.countyList = ko.observableArray([]);
        self.countyId = ko.observable('');
        self.countyId_boundToSelectValue = ko.observable('');
        self.powerOfAttorneyPhoneEdit_lbl = ko.observable('');
        self.powerOfAttorneyPhoneEdit_tb = ko.observable('');
        self.powerOfAttorneyConfirmHeader_lbl = ko.observable('');
        self.changesSavedPoa = ko.observable('');
        self.changeInfoBtn_lbl = ko.observable('');
        self.cancelBtn_lbl = ko.observable('');
        self.saveBtn_lbl = ko.observable('');
        self.changesSaved_lbl = ko.observable('');

        self.inlineErrorsExistPoa = ko.observable(false);

    };

    ns.Pre65MyAccountAboutMeViewModel = function Pre65MyAccountAboutMeViewModel() {
        if (!(this instanceof Pre65MyAccountAboutMeViewModel)) {
            return new Pre65MyAccountAboutMeViewModel();
        }
        var self = this;
        self.header_lbl = ko.observable('');

        self.aboutMe_lbl = ko.observable('');
        self.name_lbl = ko.observable('');
        self.firstName_tb = ko.observable('');
        self.lastName_tb = ko.observable('');
        self.dateOfBirth_lbl = ko.observable('');
        self.dateOfBirth_tb = ko.observable('');
        self.gender_lbl = ko.observable('');
        self.gender_tb = ko.observable('');

        self.firstNameEdit_tb = ko.observable('');
        self.lastNameEdit_tb = ko.observable('');
        self.dateOfBirth = new app.models.DateOfBirthViewModel();
        self.gender_male_lbl = ko.observable('');
        self.gender_female_lbl = ko.observable('');
        self.genderEdit_radio = ko.observable('');
        self.aboutMeConfirmHeader_lbl = ko.observable('');
        self.aboutMeConfirmDesc_lbl = ko.observable('');
        self.POA = ko.observable(new EXCHANGE.models.POAVm());
        self.CommPref = ko.observable(new EXCHANGE.models.CommVm());
        self.Addr = ko.observable(new EXCHANGE.models.CommunicationPreferencesViewModel());

        self.addresses = ko.observableArray([]);
        self.addressVms = ko.computed({
            read: function () {
                var addresses = self.addresses();
                var addressVms = [];
                for (var i = 0; i < addresses.length; i++) {
                    if (addresses[i].Address.Address1 == ' ')
                        addresses[i].Address.Address1 = '';
                    if (addresses[i].Address.City == ' ')
                        addresses[i].Address.City = '';
                    addressVms.push(new app.models.CommunicationAddressModel(addresses[i], i));
                }
                return addressVms;
            },

            write: function (value) {

            },
            owner: this,
            deferExaluation: true
        });





        self.inlineErrorsWereSorry_lbl = ko.observable('');
        self.inlineErrorsBody_lbl = ko.observable('');

        self.inlineErrorsExistProfileInfo = ko.observable(false);
        self.inlineErrorsProfileInfo = ko.observableArray([]);
        self.inlineErrorsExistAddress = ko.observable(false);
        self.inlineErrorsAddress = ko.observableArray([]);
        self.inlineErrorsExistCommPref = ko.observable(false);
        self.inlineErrorsCommPref = ko.observableArray([]);
        self.inlineErrorsExistPoa = ko.observable(false);
        self.inlineErrorsPoa = ko.observableArray([]);

        Pre65MyAccountAboutMeViewModel.prototype.clearInlineErrors = function clearInlineErrors(section) {
            if (section == 'profileInfo') {   //aboutMe
                self.inlineErrorsExistProfileInfo(false);
                self.inlineErrorsProfileInfo([]);
            }
            if (section == 'address') {   //username
                self.inlineErrorsExistAddress(false);
                self.inlineErrorsAddress([]);
            }
            if (section == 'poa') {
                self.inlineErrorsExistPoa(false);
                self.inlineErrorsPoa([]);
            }
            if (section == 'commPref') {  //password
                self.inlineErrorsExistCommPref(false);
                self.inlineErrorsCommPref([]);
            }
        };

        Pre65MyAccountAboutMeViewModel.prototype.addInlineError = function addInlineError(inlineErrorStr, section) {
            if (section == 'profileInfo') {   //aboutMe
                self.inlineErrorsExistProfileInfo(true);
                var errorListProfileInfo = self.inlineErrorsProfileInfo();
                errorListProfileInfo.push(inlineErrorStr);
                self.inlineErrorsProfileInfo(errorListProfileInfo);
                return self;
            }
            else if (section == 'address') {  //username
                self.inlineErrorsExistAddress(true);
                var errorListAddress = self.inlineErrorsAddress();
                errorListAddress.push(inlineErrorStr);
                self.inlineErrorsAddress(errorListAddress);
                return self;
            }
            else if (section == 'poa') {
                self.inlineErrorsExistPoa(true);
                var errorListPoa = self.inlineErrorsPoa();
                errorListPoa.push(inlineErrorStr);
                self.inlineErrorsPoa(errorListPoa);
                return self;
            }
            else if (section == 'commPref') {  //password
                self.inlineErrorsExistCommPref(true);
                var errorListCommPref = self.inlineErrorsCommPref();
                errorListCommPref.push(inlineErrorStr);
                self.inlineErrorsCommPref(errorListCommPref);
                return self;
            }
            return self;
        };

        Pre65MyAccountAboutMeViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;
            app.user.UserSession.UserDrugs.drugs(viewModel.UserDrugs);

            protoSelf.header_lbl(viewModel.Header_Lbl);

            protoSelf.aboutMe_lbl(viewModel.AboutMe_Lbl);
            protoSelf.name_lbl(viewModel.Name_Lbl);
            protoSelf.firstName_tb(viewModel.FirstName_Tb);
            protoSelf.lastName_tb(viewModel.LastName_Tb);
            protoSelf.dateOfBirth_lbl(viewModel.DateOfBirth_Lbl);
            protoSelf.dateOfBirth_tb(viewModel.DateOfBirth_Tb);
            protoSelf.gender_lbl(viewModel.Gender_Lbl);
            protoSelf.gender_tb(viewModel.Gender_Tb);

            protoSelf.firstNameEdit_tb(viewModel.FirstNameEdit_Tb);
            protoSelf.lastNameEdit_tb(viewModel.LastNameEdit_Tb);
            protoSelf.dateOfBirth.loadFromJSON(viewModel.DateOfBirthViewModel);

            protoSelf.gender_male_lbl(viewModel.Gender_Male_Lbl);
            protoSelf.gender_female_lbl(viewModel.Gender_Female_Lbl);
            protoSelf.genderEdit_radio(viewModel.GenderEdit_Radio);
            protoSelf.aboutMeConfirmHeader_lbl(viewModel.AboutMeConfirmHeader_Lbl);
            protoSelf.aboutMeConfirmDesc_lbl(viewModel.AboutMeConfirmDesc_Lbl);

            protoSelf.POA().powerOfAttorneyIsEmpty(viewModel.PowerOfAttorneyIsEmpty);
            protoSelf.POA().powerOfAttorneyDesignate_radio(viewModel.PowerOfAttorneyDesignate_Radio);
            protoSelf.POA().powerOfAttorney_lbl(viewModel.PowerOfAttorney_Lbl);
            protoSelf.POA().powerOfAttorneyDesc_lbl(viewModel.PowerOfAttorneyDesc_Lbl);
            protoSelf.POA().powerOfAttorneyDNE_lbl(viewModel.PowerOfAttorneyDNE_Lbl);
            protoSelf.POA().powerOfAttorneyName_lbl(viewModel.PowerOfAttorneyName_Lbl);
            protoSelf.POA().powerOfAttorneyFirstName_tb(viewModel.PowerOfAttorneyFirstName_Tb);
            protoSelf.POA().powerOfAttorneyLastName_tb(viewModel.PowerOfAttorneyLastName_Tb);
            protoSelf.POA().powerOfAttorneyAddress1_lbl(viewModel.PowerOfAttorneyAddress1_Lbl);
            protoSelf.POA().powerOfAttorneyAddress1_tb(viewModel.PowerOfAttorneyAddress1_Tb);
            protoSelf.POA().powerOfAttorneyAddress2_lbl(viewModel.PowerOfAttorneyAddress2_Lbl);
            protoSelf.POA().powerOfAttorneyAddress2_tb(viewModel.PowerOfAttorneyAddress2_Tb);
            protoSelf.POA().powerOfAttorneyCity_lbl(viewModel.PowerOfAttorneyCity_Lbl);
            protoSelf.POA().powerOfAttorneyCity_tb(viewModel.PowerOfAttorneyCity_Tb);
            protoSelf.POA().powerOfAttorneyState_lbl(viewModel.PowerOfAttorneyState_Lbl);
            protoSelf.POA().powerOfAttorneyState_tb(viewModel.PowerOfAttorneyState_Tb);
            protoSelf.POA().powerOfAttorneyZip_lbl(viewModel.PowerOfAttorneyZip_Lbl);
            protoSelf.POA().powerOfAttorneyZip_tb(viewModel.PowerOfAttorneyZip_Tb);
            protoSelf.POA().powerOfAttorneyCounty_lbl(viewModel.PowerOfAttorneyCounty_Lbl);
            protoSelf.POA().powerOfAttorneyCounty_tb(viewModel.PowerOfAttorneyCounty_Tb);
            protoSelf.POA().powerOfAttorneyPhone_lbl(viewModel.PowerOfAttorneyPhone_Lbl);
            protoSelf.POA().powerOfAttorneyPhone_tb(viewModel.PowerOfAttorneyPhone_Tb);

            protoSelf.POA().powerOfAttorneyDesignate_lbl(viewModel.PowerOfAttorneyDesignate_Lbl);
            protoSelf.POA().powerOfAttorneyDesignateYes_lbl(viewModel.PowerOfAttorneyDesignateYes_Lbl);
            protoSelf.POA().powerOfAttorneyDesignateNo_lbl(viewModel.PowerOfAttorneyDesignateNo_Lbl);
            protoSelf.POA().powerOfAttorneyDesignateEdit_radio(viewModel.PowerOfAttorneyDesignateEdit_Radio);
            protoSelf.POA().powerOfAttorneyNameEdit_lbl(viewModel.PowerOfAttorneyNameEdit_Lbl);
            protoSelf.POA().powerOfAttorneyFirstNameEdit_tb(viewModel.PowerOfAttorneyFirstNameEdit_Tb);
            protoSelf.POA().powerOfAttorneyFirstNameEdit_tip(viewModel.PowerOfAttorneyFirstNameEdit_Tip);
            protoSelf.POA().powerOfAttorneyLastNameEdit_tb(viewModel.PowerOfAttorneyLastNameEdit_Tb);
            protoSelf.POA().powerOfAttorneyLastNameEdit_tip(viewModel.PowerOfAttorneyLastNameEdit_Tip);
            protoSelf.POA().powerOfAttorneyAddressEdit_lbl(viewModel.PowerOfAttorneyAddressEdit_Lbl);
            protoSelf.POA().powerOfAttorneyAddress1Edit_tb(viewModel.PowerOfAttorneyAddress1Edit_Tb);
            protoSelf.POA().powerOfAttorneyAddress1Edit_tip(viewModel.PowerOfAttorneyAddress1Edit_Tip);
            protoSelf.POA().powerOfAttorneyAddress2Edit_tb(viewModel.PowerOfAttorneyAddress2Edit_Tb);
            protoSelf.POA().powerOfAttorneyAddress2Edit_tip(viewModel.PowerOfAttorneyAddress2Edit_Tip);
            protoSelf.POA().powerOfAttorneyCityEdit_lbl(viewModel.PowerOfAttorneyCityEdit_Lbl);
            protoSelf.POA().powerOfAttorneyCityEdit_tb(viewModel.PowerOfAttorneyCityEdit_Tb);
            protoSelf.POA().powerOfAttorneyStateEdit_lbl(viewModel.PowerOfAttorneyStateEdit_Lbl);
            protoSelf.POA().powerOfAttorneyStateEdit_tb(viewModel.PowerOfAttorneyStateEdit_Tb);
            protoSelf.POA().powerOfAttorneyZipEdit_lbl(viewModel.PowerOfAttorneyZipEdit_Lbl);
            protoSelf.POA().powerOfAttorneyZipEdit_tb(viewModel.PowerOfAttorneyZipEdit_Tb);
            protoSelf.POA().countyId_boundToSelectValue(viewModel.CountyId);
            protoSelf.POA().powerOfAttorneyPhoneEdit_lbl(viewModel.PowerOfAttorneyPhoneEdit_Lbl);
            protoSelf.POA().powerOfAttorneyPhoneEdit_tb(viewModel.PowerOfAttorneyPhoneEdit_Tb);
            protoSelf.POA().powerOfAttorneyConfirmHeader_lbl(viewModel.PowerOfAttorneyConfirmHeader_Lbl);
            protoSelf.POA().changeInfoBtn_lbl(viewModel.ChangeInfoBtn_Lbl);
            protoSelf.POA().saveBtn_lbl(viewModel.ChangeInfoBtn_Lbl);
            protoSelf.POA().cancelBtn_lbl(viewModel.CancelBtn_Lbl);
            protoSelf.POA().changesSaved_lbl(viewModel.ChangesSaved_Lbl);

            protoSelf.POA().ShowWebPart(true);

            protoSelf.inlineErrorsWereSorry_lbl(viewModel.InlineErrorsWereSorry_Lbl);
            protoSelf.inlineErrorsBody_lbl(viewModel.InlineErrorsBody_Lbl);

            protoSelf.CommPref().selectOne_lbl(viewModel.SelectOneLbl);
            protoSelf.CommPref().primaryPhone_lbl(viewModel.PrimaryPhone_Lbl);
            protoSelf.CommPref().primaryNumber(viewModel.PrimaryNumber);
            protoSelf.CommPref().primaryNumber_tb();
            if (viewModel.UserEmailAddress != null)
                protoSelf.CommPref().userEmailAddress(viewModel.UserEmailAddress);
            else
                protoSelf.CommPref().userEmailAddress("");
            protoSelf.CommPref().emailAddressDNE_lbl(viewModel.EmailAddressDNE_Lbl);
            protoSelf.CommPref().userEmailAddress_tb(viewModel.UserEmailAddress);

            protoSelf.CommPref().isOkToCall(viewModel.IsOkToCall);
            protoSelf.CommPref().isOkToEmail(viewModel.IsOkToEmail);
            protoSelf.CommPref().isOkToMail(viewModel.IsOkToMail);


            var newAddresses = [];
            for (var i = 0; i < viewModel.Addresses.length; i++) {
                newAddresses.push(viewModel.Addresses[i]);
            }
            protoSelf.addresses(newAddresses);
            

            return protoSelf;
        };

        return self;
    };


} (EXCHANGE));