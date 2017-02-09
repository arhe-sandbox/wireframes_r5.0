(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");
    ns.MedCabVM = function MedCabVM() {
        var self = this;
        self.ShowWebPart = ko.observable(false);
        self.doneLoading = ko.observable(false);
        self.shopPdp_Lbl = ko.observable('');
        self.medicineCabinet_lbl = ko.observable('');
        self.medicineCabinetDesc_lbl = ko.observable('');
        self.medicineCabinetDNE_lbl = ko.observable('');
        self.medicineCabinetConfirmHeader_lbl = ko.observable('');
        self.medicineCabinetConfirmDesc_lbl = ko.observable('');
        self.changeMedicationsBtn_lbl = ko.observable('');
        self.medicineCabinetAuthorizeMessage_Lbl = ko.observable('');

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
    };
    ns.CommVm = function CommVm(viewModel) {
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
    ns.UpdateProfileViewModel = function UpdateProfileViewModel() {
        if (!(this instanceof UpdateProfileViewModel)) {
            return new UpdateProfileViewModel();
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
        self.accountUnLockSuccessWithEmail_lbl = ko.observable('');
        self.accountUnLockSuccessWithoutEmail_lbl = ko.observable('');
        self.resetPasswordSuccessWithEmail_lbl = ko.observable('');
        self.resetPasswordSuccessWithoutEmail_lbl = ko.observable('');
        self.showMessage = ko.observable('');
        self.message = ko.observable('');
        self.isResetSuccess = ko.observable(false);

        self.nameEdit_lbl = ko.observable('');
        self.firstNameEdit_tb = ko.observable('');
        self.lastNameEdit_tb = ko.observable('');
        self.dateOfBirthEdit_lbl = ko.observable('');
        self.dateOfBirth = new app.models.DateOfBirthViewModel();
        self.genderEdit_lbl = ko.observable('');
        self.gender_male_lbl = ko.observable('');
        self.gender_female_lbl = ko.observable('');
        self.genderEdit_radio = ko.observable('');
        self.aboutMeConfirmHeader_lbl = ko.observable('');
        self.aboutMeConfirmDesc_lbl = ko.observable('');

        self.securityProfile_lbl = ko.observable('');
        self.username_lbl = ko.observable('');
        self.username_tb = ko.observable('');
        self.password_lbl = ko.observable('');
        self.password_tb = ko.observable('');

        self.usernameEdit_lbl = ko.observable('');
        self.usernameEditPwd_lbl = ko.observable('');
        self.usernameEditPwd_tb = ko.observable('');
        self.chooseUsername_lbl = ko.observable('');
        self.chooseUsername_tb = ko.observable('');
        self.usernameTip_lbl = ko.observable('');
        self.usernameConfirmHeader_lbl = ko.observable('');
        self.usernameConfirmDesc_lbl = ko.observable('');

        self.passwordEditCurrent_lbl = ko.observable('');
        self.passwordEditCurrent_tb = ko.observable('');
        self.passwordEditNew_lbl = ko.observable('');
        self.passwordEditNew_tb = ko.observable('');
        self.passwordEditNewConfirm_lbl = ko.observable('');
        self.passwordEditNewConfirm_tb = ko.observable('');
        self.passwordEditNewTip_lbl = ko.observable('');
        self.passwordEditConfirmHeader_lbl = ko.observable('');
        self.passwordEditConfirmDesc_lbl = ko.observable('');

        self.mysavedplanHeader_lbl = ko.observable('');
        self.mysavedplanMainDesc_lbl = ko.observable('');
        self.mysavedplanNoPlanDesc_lbl = ko.observable('');
        self.mysavedplanBtn_lbl = ko.observable('');
        self.mysavedplanFindPlanBtn_lbl = ko.observable('');
        self.mysavedplanAvailable = ko.observable('');
        self.mysavedplanToDisplay = ko.observable('');


        /*
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

        self.medicineCabinet_lbl = ko.observable('');
        self.medicineCabinetDesc_lbl = ko.observable('');
        self.medicineCabinetDNE_lbl = ko.observable('');
        self.medicineCabinetConfirmHeader_lbl = ko.observable('');
        self.medicineCabinetConfirmDesc_lbl = ko.observable('');
        self.medicineCabinet_lbl = ko.observable('');
        */

        self.changesSaved_lbl = ko.observable('');
        self.cancelBtn_lbl = ko.observable('');
        self.saveBtn_lbl = ko.observable('');
        self.finishedEditingBtn_lbl = ko.observable('');
        self.changeInfoBtn_lbl = ko.observable('');
        self.changeMedicationsBtn_lbl = ko.observable('');
        self.changeUsernameBtn_lbl = ko.observable('');
        self.changePasswordBtn_lbl = ko.observable('');
        self.resetPasswordBtn_lbl = ko.observable('');
        self.resetPasswordConfirm_lbl = ko.observable('');
        self.resetPasswordConfirmWithoutEmail_lbl = ko.observable('');
        self.resetPasswordConfirmWithoutEmailYesNo_lbl = ko.observable('');
        self.resetPasswordCancelBtn_lbl = ko.observable('');
        self.resetPasswordWithOutEmailYesBtn_lbl = ko.observable('');
        self.resetPasswordWithOutEmailNoBtn_lbl = ko.observable('');
        self.resetPasswordResetBtn_lbl = ko.observable('');


        self.inlineErrorsExistAboutMe = ko.observable(false);
        self.inlineErrorsAboutMe = ko.observableArray([]);
        self.inlineErrorsExistUsername = ko.observable(false);
        self.inlineErrorsUsername = ko.observableArray([]);
        self.inlineErrorsExistPassword = ko.observable(false);
        self.inlineErrorsPassword = ko.observableArray([]);
        self.inlineErrorsExistPoa = ko.observable(false);
        self.inlineErrorsPoa = ko.observableArray([]);

        self.inlineErrorsWereSorry_lbl = ko.observable('');
        self.inlineErrorsBody_lbl = ko.observable('');
        self.incorrectPassword_lbl = ko.observable('');

        self.changesSavedAboutMe = ko.observable('');
        self.changesSavedSecurityProfile = ko.observable('');
        self.changesSavedPoa = ko.observable('');

        self.showResetPasswordConfirm = ko.observable(false);
        self.showWithoutEmailConfirm = ko.observable(false);

        self.isResettingPassword = ko.observable(false);
        self.medCabinet = ko.observable(new EXCHANGE.models.MedCabVM());
        self.POA = ko.observable(new EXCHANGE.models.POAVm());
        self.doneLoading = ko.observable(false);
        //        self.drugs = ko.computed({
        //            read: function () {

        //                var drugs = [];
        //                if (app.user && app.user.UserSession && app.user.UserSession.UserDrugs && ns.DrugViewModel) {
        //                    var userDrugs = app.user.UserSession.UserDrugs.drugs();
        //                    for (var i = 0; i < userDrugs.length; i++) {
        //                        var drugVm = new ns.DrugViewModel().loadFromUserDrug(userDrugs[i]);
        //                        app.drugs.AllDrugViewModels.push(drugVm);
        //                        drugs.push(drugVm);
        //                    }
        //                }

        //                drugs.sort(function (firstUserDrugVM, secondUserDrugVM) {
        //                    return firstUserDrugVM.userDrug().Drug.Name.toLowerCase() > secondUserDrugVM.userDrug().Drug.Name.toLowerCase() ? 1 : -1;
        //                });

        //                return drugs;
        //            },
        //            owner: this,
        //            deferEvaluation: true
        //        });


        UpdateProfileViewModel.prototype.clearInlineErrors = function clearInlineErrors(section) {
            if (section == 'aboutMe') {
                self.inlineErrorsExistAboutMe(false);
                self.inlineErrorsAboutMe([]);
            }
            if (section == 'username') {
                self.inlineErrorsExistUsername(false);
                self.inlineErrorsUsername([]);
            }
            if (section == 'password') {
                self.inlineErrorsExistPassword(false);
                self.inlineErrorsPassword([]);
            }
            if (section == 'poa') {
                self.inlineErrorsExistPoa(false);
                self.inlineErrorsPoa([]);
            }
        };



        UpdateProfileViewModel.prototype.addInlineError = function addInlineError(inlineErrorStr, section) {
            if (section == 'aboutMe') {
                self.inlineErrorsExistAboutMe(true);
                var errorListAboutMe = self.inlineErrorsAboutMe();
                errorListAboutMe.push(inlineErrorStr);
                self.inlineErrorsAboutMe(errorListAboutMe);
                return self;
            }
            else if (section == 'username') {
                self.inlineErrorsExistUsername(true);
                var errorListUsername = self.inlineErrorsUsername();
                errorListUsername.push(inlineErrorStr);
                self.inlineErrorsUsername(errorListUsername);
                return self;
            }
            else if (section == 'password') {
                self.inlineErrorsExistPassword(true);
                var errorListPassword = self.inlineErrorsPassword();
                errorListPassword.push(inlineErrorStr);
                self.inlineErrorsPassword(errorListPassword);
                return self;
            }
            else if (section == 'poa') {
                self.inlineErrorsExistPoa(true);
                var errorListPoa = self.inlineErrorsPoa();
                errorListPoa.push(inlineErrorStr);
                self.inlineErrorsPoa(errorListPoa);
                return self;
            }
            return self;
        };

        UpdateProfileViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
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
            protoSelf.accountUnLockSuccessWithEmail_lbl(viewModel.AccountUnLockSuccessWithEmail_Lbl);
            protoSelf.accountUnLockSuccessWithoutEmail_lbl(viewModel.AccountUnLockSuccessWithoutEmail_Lbl);
            protoSelf.resetPasswordSuccessWithEmail_lbl(viewModel.ResetPasswordSuccessWithEmail_Lbl);
            protoSelf.resetPasswordSuccessWithoutEmail_lbl(viewModel.ResetPasswordSuccessWithoutEmail_Lbl);

            if (viewModel.IsAccountLocked) {
                protoSelf.showMessage(true);
                protoSelf.isResetSuccess(false);
                protoSelf.message(viewModel.AccountLocked_Lbl);
            }
            else {
                protoSelf.showMessage(false);
            }

            protoSelf.nameEdit_lbl(viewModel.NameEdit_Lbl);
            protoSelf.firstNameEdit_tb(viewModel.FirstNameEdit_Tb);
            protoSelf.lastNameEdit_tb(viewModel.LastNameEdit_Tb);
            protoSelf.dateOfBirthEdit_lbl(viewModel.DateOfBirthEdit_Lbl);
            protoSelf.dateOfBirth.loadFromJSON(viewModel.DateOfBirthViewModel);

            protoSelf.genderEdit_lbl(viewModel.GenderEdit_Lbl);
            protoSelf.gender_male_lbl(viewModel.Gender_Male_Lbl);
            protoSelf.gender_female_lbl(viewModel.Gender_Female_Lbl);
            protoSelf.genderEdit_radio(viewModel.GenderEdit_Radio);
            protoSelf.aboutMeConfirmHeader_lbl(viewModel.AboutMeConfirmHeader_Lbl);
            protoSelf.aboutMeConfirmDesc_lbl(viewModel.AboutMeConfirmDesc_Lbl);

            protoSelf.securityProfile_lbl(viewModel.SecurityProfile_Lbl);
            protoSelf.username_lbl(viewModel.Username_Lbl);
            protoSelf.username_tb(viewModel.Username_Tb);
            protoSelf.password_lbl(viewModel.Password_Lbl);
            protoSelf.password_tb(viewModel.Password_Tb);

            protoSelf.usernameEdit_lbl(viewModel.UsernameEdit_Lbl);
            protoSelf.usernameEditPwd_lbl(viewModel.UsernameEditPwd_Lbl);
            protoSelf.chooseUsername_lbl(viewModel.ChooseUsername_Lbl);
            protoSelf.usernameTip_lbl(viewModel.UsernameTip_Lbl);
            protoSelf.usernameConfirmHeader_lbl(viewModel.UsernameConfirmHeader_Lbl);
            protoSelf.usernameConfirmDesc_lbl(viewModel.UsernameConfirmDesc_Lbl);

            protoSelf.passwordEditCurrent_lbl(viewModel.PasswordEditCurrent_Lbl);
            protoSelf.passwordEditNew_lbl(viewModel.PasswordEditNew_Lbl);
            protoSelf.passwordEditNewConfirm_lbl(viewModel.PasswordEditNewConfirm_Lbl);
            protoSelf.passwordEditNewTip_lbl(viewModel.PasswordEditNewTip_Lbl);
            protoSelf.passwordEditConfirmHeader_lbl(viewModel.PasswordEditConfirmHeader_Lbl);
            protoSelf.passwordEditConfirmDesc_lbl(viewModel.PasswordEditConfirmDesc_Lbl);

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
            protoSelf.medCabinet().ShowWebPart(true);
           
            protoSelf.medCabinet().medicineCabinet_lbl(viewModel.MedicineCabinet_Lbl);
            protoSelf.medCabinet().medicineCabinetDesc_lbl(viewModel.MedicineCabinetDesc_Lbl);
            protoSelf.medCabinet().medicineCabinetDNE_lbl(viewModel.MedicineCabinetDNE_Lbl);
            protoSelf.medCabinet().medicineCabinetConfirmHeader_lbl(viewModel.MedicineCabinetConfirmHeader_Lbl);
            protoSelf.medCabinet().medicineCabinetConfirmDesc_lbl(viewModel.MedicineCabinetConfirmDesc_Lbl);
            protoSelf.medCabinet().changeMedicationsBtn_lbl(viewModel.ChangeMedicationsBtn_Lbl);
            protoSelf.medCabinet().medicineCabinetAuthorizeMessage_Lbl(viewModel.MedicineCabinetAuthorizeMessage_Lbl);
            protoSelf.medCabinet().shopPdp_Lbl(viewModel.ShopPdp_Lbl);

            protoSelf.mysavedplanHeader_lbl(viewModel.MysavedplanHeader_lbl);
            protoSelf.mysavedplanMainDesc_lbl(viewModel.MysavedplanMainDesc_lbl);
            protoSelf.mysavedplanNoPlanDesc_lbl(viewModel.MysavedplanNoPlanDesc_lbl);
            protoSelf.mysavedplanBtn_lbl(viewModel.MysavedplanBtn_lbl);
            protoSelf.mysavedplanFindPlanBtn_lbl(viewModel.MysavedplanFindPlanBtn_lbl);
            protoSelf.mysavedplanAvailable(viewModel.MysavedplanAvailable);
            protoSelf.mysavedplanToDisplay(true);
            if (EXCHANGE.user.UserSession.UserProfile != null && (EXCHANGE.user.UserSession.UserProfile.isPre65() || EXCHANGE.user.UserSession.UserProfile.isAgeIn())) {
                protoSelf.mysavedplanToDisplay(false);
            }

            protoSelf.changesSaved_lbl(viewModel.ChangesSaved_Lbl);
            protoSelf.cancelBtn_lbl(viewModel.CancelBtn_Lbl);
            protoSelf.saveBtn_lbl(viewModel.SaveBtn_Lbl);
            protoSelf.finishedEditingBtn_lbl(viewModel.FinishedEditingBtn_Lbl);
            protoSelf.changeInfoBtn_lbl(viewModel.ChangeInfoBtn_Lbl);
            protoSelf.changeMedicationsBtn_lbl(viewModel.ChangeMedicationsBtn_Lbl);
            protoSelf.changeUsernameBtn_lbl(viewModel.ChangeUsernameBtn_Lbl);
            protoSelf.changePasswordBtn_lbl(viewModel.ChangePasswordBtn_Lbl);
            protoSelf.resetPasswordBtn_lbl(viewModel.ResetPasswordBtn_Lbl);
            protoSelf.resetPasswordConfirm_lbl(viewModel.ResetPasswordConfirm_Lbl);
            protoSelf.resetPasswordConfirmWithoutEmail_lbl(viewModel.ResetPasswordConfirmWithoutEmail_Lbl);
            protoSelf.resetPasswordConfirmWithoutEmailYesNo_lbl(viewModel.ResetPasswordConfirmWithoutEmailYesNo_Lbl);
            protoSelf.resetPasswordCancelBtn_lbl(viewModel.ResetPasswordCancelBtn_Lbl);
            protoSelf.resetPasswordWithOutEmailYesBtn_lbl(viewModel.ResetPasswordWithOutEmailYesBtn_Lbl);
            protoSelf.resetPasswordWithOutEmailNoBtn_lbl(viewModel.ResetPasswordWithOutEmailNoBtn_Lbl);
            protoSelf.resetPasswordResetBtn_lbl(viewModel.ResetPasswordResetBtn_Lbl);

            protoSelf.inlineErrorsWereSorry_lbl(viewModel.InlineErrorsWereSorry_Lbl);
            protoSelf.inlineErrorsBody_lbl(viewModel.InlineErrorsBody_Lbl);
            protoSelf.incorrectPassword_lbl(viewModel.IncorrectPassword_Lbl);


            if (app.viewModels.MyMedicationViewModel) {
                app.viewModels.MyMedicationViewModel.frequencyString(viewModel.DrugFrequencyString);
            }
            protoSelf.doneLoading(true);
            return protoSelf;
        };

        /*Functions*/
        self.cancelResetPassword = function () {
            var protoSelf = this;
            protoSelf.showResetPasswordConfirm(false);
            return protoSelf;
        };

        self.resetPassword = function () {
            var protoSelf = this;
            if (app.viewModels.UpdateProfileViewModel.isResettingPassword()) {
                return protoSelf;
            }
            if (EXCHANGE.user.UserSession.UserProfile.email == "")
                protoSelf.showWithoutEmailConfirm(true);
            else
                protoSelf.showResetPasswordConfirm(true);
            return protoSelf;
        };

        self.redirectToMyaccount = function () {
            app.functions.redirectToRelativeUrlFromSiteBase("/my-account.aspx");
        };

        self.resetNo = function () {
            var protoSelf = this;
            protoSelf.showResetPasswordConfirm(true);
            protoSelf.showWithoutEmailConfirm(false);
        };

        self.resetPasswordConfirm = function () {
            var protoSelf = this;
            protoSelf.showResetPasswordConfirm(false);
            protoSelf.showWithoutEmailConfirm(false);

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Login/ResetPasswordSubmit",
                dataType: "json",
                data: JSON.stringify({ 'Username': protoSelf.username_tb() }),
                success: function (data) {
                    var resetValidation = data;
                    if (!resetValidation.HasResetOccuredToday) {
                        protoSelf.showMessage(true);
                        protoSelf.isResetSuccess(true);
                        if (resetValidation.IsUserLockedOut) {
                            if (resetValidation.IsEmailValid) {
                                protoSelf.message(app.viewModels.UpdateProfileViewModel.accountUnLockSuccessWithEmail_lbl());
                            } else {
                                protoSelf.message(app.viewModels.UpdateProfileViewModel.accountUnLockSuccessWithoutEmail_lbl());
                            }
                        } else {
                            if (resetValidation.IsEmailValid) {
                                protoSelf.message(app.viewModels.UpdateProfileViewModel.resetPasswordSuccessWithEmail_lbl());
                            } else {
                                protoSelf.message(app.viewModels.UpdateProfileViewModel.resetPasswordSuccessWithoutEmail_lbl());
                            }
                        }
                    } else {

                        protoSelf.showMessage(true);
                        protoSelf.isResetSuccess(false);
                        protoSelf.message("User has reset password today. Passwords can only be reset once every 24 hours.");
                    }
                },
                error: function (data) {
                    protoSelf.showMessage(true);
                    protoSelf.isResetSuccess(false);
                    protoSelf.message("An error occurs during unlock/reset user account, please contact administrator!");
                }
            });


            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));
