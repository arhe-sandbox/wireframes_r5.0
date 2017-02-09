(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.CommunicationPreferencesViewModel = function CommunicationPreferencesViewModel() {
        if (!(this instanceof CommunicationPreferencesViewModel)) {
            return new CommunicationPreferencesViewModel();
        }
        var self = this;
        self.ShowWebPart = ko.observable(true);
        self.UsAddressLabel = ko.observable("Address Type");
        self.commPreferences_hdr = ko.observable("");
        self.howWeUseTitle_lbl = ko.observable('');
        self.cancelChanges_lbl = ko.observable('');
        self.saveChanges_lbl = ko.observable('');
        self.inlineErrorsHeader_lbl = ko.observable('');
        self.inlineErrorsBody_lbl = ko.observable('');

        // preferred method of contact
        self.preferredContact_hdr = ko.observable("");
        self.preferredContactMethod = ko.observable(app.enums.PreferredContactMethodEnum.Email);
        self.switchToMail_lbl = ko.observable("");
        self.switchToEmail_lbl = ko.observable("");
        self.attemptToHonorHtml = ko.observable("");
        self.sensitiveDocInfoHtml = ko.observable("");

        self.baseEmailHtml = ko.observable("");
        self.baseMailHtml = ko.observable("");
        self.switchButton_lbl = ko.computed({
            read: function () {
                return self.preferredContactMethod() === app.enums.PreferredContactMethodEnum.Email ? self.switchToMail_lbl() : self.switchToEmail_lbl();
            },
            owner: this
        });
        self.emailOrMail_html = ko.computed({
            read: function () {
                if (self.preferredContactMethod() === app.enums.PreferredContactMethodEnum.Email) {
                    return self.baseEmailHtml().format(self.userEmailAddress());
                } else {
                    var mailingAddress = self.mailingAddress();
                    if (mailingAddress != null) {
                        return self.baseMailHtml().format(mailingAddress.formattedAddress());
                    }
                    else {
                        return self.baseMailHtml();
                    }
                }
            },
            deferEvaluation: true
        });

        self.changeContactMethod = function () {
            if (self.canSwitchPreference()) {
                self.preferredContactMethod(self.preferredContactMethod() === app.enums.PreferredContactMethodEnum.Email ? app.enums.PreferredContactMethodEnum.Mail : app.enums.PreferredContactMethodEnum.Email);
                app.addressInfo.submitContactPreference(self.preferredContactMethod());
            }
        };

        self.canSwitchPreference = ko.computed({
            read: function () {
                return self.preferredContactMethod() === app.enums.PreferredContactMethodEnum.Email
                    || (self.userEmailAddress() !== "" && self.userEmailAddress() !== null);
            },
            deferEvaluation: true
        });

        // Phone numbers
        self.phone_hdr = ko.observable("");

        self.primaryPhone_lbl = ko.observable("");
        self.primaryNumber = ko.observable("");
        self.primaryNumber_tb = ko.observable("");
        self.isEditingPrimary = ko.observable(false);
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
        self.startEditingPrimary = function () {
            if (self.canSwitch()) {
                self.isEditingSecondary(false);
                self.isEditingPrimary(true);
                self.primaryNumber_tb(app.functions.autoFormatPhoneNumber(self.primaryNumber()));
            }
        };
        self.howWeUsePhone_html = ko.observable("");

        self.secondaryPhone_lbl = ko.observable("");
        self.secondaryNumber = ko.observable("");
        self.secondaryNumber_tb = ko.observable("");
        self.isEditingSecondary = ko.observable(false);
        self.secondaryNumberFormatted = ko.computed({
            read: function () {
                if (self.secondaryNumber() == null) {
                    return "";
                }
                return app.functions.autoFormatPhoneNumber(self.secondaryNumber());
            },
            owner: this,
            deferEvaluation: true
        });
        self.startEditingSecondary = function () {
            if (self.canSwitch()) {
                self.isEditingPrimary(false);
                self.isEditingSecondary(true);
                self.secondaryNumber_tb(app.functions.autoFormatPhoneNumber(self.secondaryNumber()));
            }
        };

        self.canSwitch = ko.observable(true);
        self.stopEditingPhone = function () {
            self.isEditingPrimary(false);
            self.isEditingSecondary(false);
            self.canSwitch(true);
        };
        self.savePhone = function () {
            if (self.isEditingPrimary()) {
                self.primaryNumber(self.primaryNumber_tb());
            } else if (self.isEditingSecondary()) {
                self.secondaryNumber(self.secondaryNumber_tb());
            }
            self.stopEditingPhone();
        };
        self.isEditingPhone = ko.computed({
            read: function () {
                return self.isEditingPrimary() || self.isEditingSecondary();
            },
            owner: this,
            deferEvaluation: true
        });
        self.setAsPrimaryButton_lbl = ko.observable("");
        self.swapPrimaryAndSecondary = function () {
            var oldPrimary = self.primaryNumber();
            self.primaryNumber(self.secondaryNumber());
            self.secondaryNumber(oldPrimary);

            app.addressInfo.saveBothPhones();
        };

        self.inlineErrorsExistPhone = ko.observable(false);
        self.inlineErrorsPhone = ko.observableArray([]);

        // Email address
        self.email_hdr = ko.observable("");
        self.isEditingEmail = ko.observable(false);
        self.userEmailAddress = ko.observable("");
        self.emailAddressDNE_lbl = ko.observable("");
        self.changeEmail_lbl = ko.observable("");

        self.startEditingEmail = function () {
            self.isEditingEmail(true);
            self.userEmailAddress_tb(self.userEmailAddress());
            self.userEmailAddressConfirm_tb(self.userEmailAddress());
        };

        self.enterEmail_lbl = ko.observable("");
        self.confirmEmail_lbl = ko.observable("");
        self.userEmailAddress_tb = ko.observable("");
        self.userEmailAddressConfirm_tb = ko.observable("");

        self.cancelEmailAddress = function () {
            self.userEmailAddress_tb("");
            self.userEmailAddressConfirm_tb("");
            self.inlineErrorsExistEmail(false);
            self.inlineErrorsEmail([]);
            self.isEditingEmail(false);
        };

        self.saveEmailAddress = function () {
            self.userEmailAddress(self.userEmailAddress_tb());
            self.cancelEmailAddress();
        };

        self.howWeUseEmail_desc = ko.observable("");

        self.inlineErrorsExistEmail = ko.observable(false);
        self.inlineErrorsEmail = ko.observableArray([]);

        self.inlineErrorsWereSorry_lbl = ko.observable('');
        self.inlineErrorsBody_lbl = ko.observable('');

        self.mailingAddress = ko.computed({
            read: function () {
                var addresses = self.addressVms();
                for (var i = 0; i < addresses.length; i++) {
                    if (addresses[i].isMailing()) {
                        return addresses[i];
                    }
                }

                return null;
            },
            owner: this,
            deferEvaluation: true
        });

        // Communication Restrictions
        self.commRestrictions_hdr = ko.observable("");
        self.commRestrictions_desc = ko.observable("");
        self.changeRestrictions_lbl = ko.observable("");

        self.isOkToCall = ko.observable(true);
        self.isOkToEmail = ko.observable(true);
        self.isOkToMail = ko.observable(true);

        self.okToCall_lbl = ko.observable("");
        self.okToEmail_lbl = ko.observable("");
        self.okToMail_lbl = ko.observable("");
        self.doNotCall_lbl = ko.observable("");
        self.doNotEmail_lbl = ko.observable("");
        self.doNotMail_lbl = ko.observable("");

        self.callRadio = ko.observable("yes");
        self.emailRadio = ko.observable("yes");
        self.mailRadio = ko.observable("yes");

        self.callDesc_lbl = ko.observable("");
        self.emailDesc_lbl = ko.observable("");
        self.mailDesc_lbl = ko.observable("");

        self.aboutThisSetting_lbl = ko.observable("");
        self.aboutThisSetting_desc = ko.observable("");

        self.isEditingCommRestrictions = ko.observable(false);

        self.inlineErrorsExistUpdateComm = ko.observable(false);
        self.inlineErrorsUpdateComm = ko.observableArray([]);

        function loadRadiosFromBools() {
            self.callRadio(self.isOkToCall() ? "yes" : "no");
            self.emailRadio(self.isOkToEmail() ? "yes" : "no");
            self.mailRadio(self.isOkToMail() ? "yes" : "no");
        }

        self.startEditCommRestrictions = function () {
            if (app.communicationPreferences)
                app.communicationPreferences.clearInlineErrorsUpdateComm();
            if (app.myGuidedAction)
                app.addressInfo.clearInlineErrorsUpdateComm();
            loadRadiosFromBools();
            self.isEditingCommRestrictions(true);
        };

        self.stopEditCommRestrictions = function () {
            loadRadiosFromBools();
            self.isEditingCommRestrictions(false);
        };

        self.saveCommRestrictions = function () {
            if (app.communicationPreferences)
                app.communicationPreferences.submitCommRestrictions();
            if (app.myGuidedAction)
                app.addressInfo.submitCommRestrictions();
        };

        self.updateCommRestrictions = function () {
            self.isOkToCall(self.callRadio() == "yes");
            self.isOkToEmail(self.emailRadio() == "yes");
            self.isOkToMail(self.mailRadio() == "yes");
            self.isEditingCommRestrictions(false);
        };
        /*Moving Errors */

        self.addressErrors = ko.computed({
            read: function () {

                var errors = [];

                for (var i = 0; i < self.addresses().length; i++) {

                    var result = self.addresses()[i].ValidationResult;
                    if (result && result.Errors) {
                        for (var j = 0; j < result.Errors.length; j++) {
                            if (errors.indexOf(result.Errors[j].ErrorMessage) < 0) {
                                errors.push(result.Errors[j].ErrorMessage);
                            }
                        }
                    }
                }

                return errors;
            },

            owner: this,
            deferEvaluation: true
        });
        self.hasAddressErrors = ko.computed({
            read: function () {
                return self.addressErrors().length;
            },
            owner: this,
            deferEvaluation: true
        });


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
        self.isEditingAddress = ko.observable(false);
        self.isEditingNonUsAddress = ko.observable(false);
        self.addressEditingIndexes = ko.observableArray([]);
        self.isAddingNew = ko.observable(false);
        self.newAddrIndex = ko.observable(0);

        self.addresses_lbl = ko.observable('');
        self.primary_lbl = ko.observable('');
        self.mailing_lbl = ko.observable('');
        self.deleteBtn_lbl = ko.observable('');
        self.changeBtn_lbl = ko.observable('');
        self.deleteConfirm_lbl = ko.observable('');
        self.cancelBtn_lbl = ko.observable('');
        self.addAddrBtn_lbl = ko.observable('');

        self.editStreetAddr_lbl = ko.observable('');
        self.editAddr1_placeholder = ko.observable('');
        self.editAddr2_placeholder = ko.observable('');
        self.editCity_lbl = ko.observable('');
        self.editState_lbl = ko.observable('');
        self.stateList = ko.observableArray(['Select One']);
        self.editZip_lbl = ko.observable('');
        self.editCounty_lbl = ko.observable('');
        self.showCountyList = ko.computed({
            read: function () {
                return self.countyList().length > 1;
            },
            owner: this,
            deferEvaluation: true
        });
        self.editCountry_lbl = ko.observable('');
        self.countryList = ko.observableArray([]);
        self.defaultCountry_lbl = ko.observable('');
        self.selectOne_lbl = ko.observable('');

        self.howWeAddressesUseBody = ko.observable('');

        self.isEditingThisAddress = function isEditingThisAddress(index) {
            if (!self.isEditingAddress()) return false;
            var editing = self.addressEditingIndexes();
            for (var i = 0; i < editing.length; i++) {
                if (editing[i] == index) {
                    return true;
                }
            }

            return false;
        };

        self.editAddressByIndex = function editAddressByIndex(idx) {
            self.addressEditingIndexes.push(idx);
            self.isEditingAddress(true);
        };

        self.editThisAddress = function editThisAddress(data, e) {
            var idx = parseInt($(e.target).attr('addrIndex'));
            self.editAddressByIndex(idx);
        };

        self.cancelAddressEdit = function cancelAddressEdit() {
            //copy saved values to edit values
            self.isEditingAddress(false);
            self.addressEditingIndexes([]);

            if (self.isAddingNew()) {
                self.addresses.splice(self.newAddrIndex(), 1);
            } else {
                var addressVms = self.addressVms();
                for (var i = 0; i < addressVms.length; i++) {
                    addressVms[i].editStreet1(addressVms[i].street1());
                    addressVms[i].editStreet2(addressVms[i].street2());
                    addressVms[i].editCity(addressVms[i].city());
                    addressVms[i].editState(addressVms[i].state());
                    addressVms[i].editZip(addressVms[i].zip());
                    addressVms[i].editCounty(addressVms[i].county());
                    addressVms[i].editCountry(addressVms[i].country());
                }
            }
            self.newAddrIndex(0);
            self.isAddingNew(false);

            app.viewModels.CommunicationPreferencesViewModel.displayChangePrimaryAddressMessage(false);
            app.communicationPreferences.refreshUI();
        };

        self.addressEditing = function addressEditing(data, event) {
            var addrIndexStr = $(event.target).attr('addrIdx');
            var addrIndex = parseInt(addrIndexStr);
            var addrVm = self.addressVms()[addrIndex];
            if (addrVm.isPrimary() && addrVm.isMailing()) {
                self.isEditingPrimary(true);
                self.isEditingSecondary(true);
                addrVm.editIsPrimary(true);
                addrVm.editIsMailing(true);
            } else if (addrVm.isPrimary() && !addrVm.isMailing()) {
                self.isEditingPrimary(true);
                self.isEditingSecondary(false);
                addrVm.editIsPrimary(true);
                addrVm.editIsMailing(false);
            } else if (!addrVm.isPrimary() && addrVm.isMailing()) {
                self.isEditingPrimary(false);
                self.isEditingSecondary(true);
                addrVm.editIsPrimary(false);
                addrVm.editIsMailing(true);
            }
            addrVm.showAddress(false);
            self.addrEditingIndex(addrIndex);
            self.isAddingNewAddress(false);
            self.addressAddedOrEdited([]);
            self.addressAddedOrEdited.push(addrVm);
        };

        self.addressAdding = function addressAdding(data, event) {
            var newAddr = { Address: {}, Counties: [], ValidationResult: {}, NewAddr: true };
            //self.addresses.push(newAddr);
            self.isAddingNewAddress(true);
            self.addressAddedOrEdited([]);
            self.addressAddedOrEdited.push(new app.models.CommunicationAddressModel(newAddr, self.addressAddedOrEdited().length));
        };

        self.addressCancel = function addressCancel(data, event) {
            if (!self.isAddingNewAddress()) {
                self.addressVms()[self.addrEditingIndex()].showAddress(true);
            }
            self.isEditingAddress(false);
            self.isAddingNew(false);
            // clear the fields
            self.addressAddedOrEdited([]);
        };

        self.isAddingNewAddress = ko.observable(false);
        self.addrEditingIndex = ko.observable(0);
        self.addressAddedOrEdited = ko.observableArray([]);

        self.aboutMeAddressSubmit = function aboutMeAddressSubmit(data, event) {

            var addrIndexStr = $(event.target).attr('addrIdx');
            var addrIndex = parseInt(addrIndexStr);
            var addrVm = self.addressAddedOrEdited()[addrIndex]; ;

            var primaryExists = -1;
            var mailingExists = -1;
            for (var i = 0; i < self.addressVms().length; i++) {
                if (self.addressVms()[i].isPrimary()) {
                    primaryExists = i;
                } else {
                    mailingExists = i;
                }
            }
            //var addType = $('#add-name').parent().find('.dk_option_current a').attr('data-dk-dropdown-value');
            var addType = app.functions.getDropdownSelectedValueBySelectElementId('add-name');
            var county = app.functions.getDropdownSelectedValueBySelectElementId('county' + addrIndex);
            var state = app.functions.getDropdownSelectedValueBySelectElementId('states' + addrIndex);
            var country = app.functions.getDropdownSelectedValueBySelectElementId('country' + addrIndex);
            addrVm.editCounty(county);
            addrVm.editState(state);
            addrVm.editCountry(country);

            if (addType === "Primary Address" && primaryExists !== -1) { // Update
                addrVm.isPrimary(true);
                addrVm.editIsPrimary(true);
                if (mailingExists === -1) {
                    addrVm.isMailing(true);
                    addrVm.editIsMailing(true);
                }
                //self.addresses()[primaryExists](addrVm.toJSFromEdit());
                self.addressVms()[primaryExists] = addrVm;
            } else if (addType === "Primary Address" && primaryExists === -1) { // Add
                addrVm.isPrimary(true);
                addrVm.editIsPrimary(true);
                if (mailingExists === -1) {
                    addrVm.isMailing(true);
                    addrVm.editIsMailing(true);
                }
                self.addresses.push(addrVm.toJSFromEdit());
            } else if (addType === "Mailing Address" && mailingExists !== -1) { // Update
                addrVm.isPrimary(false);
                addrVm.editIsPrimary(false);
                addrVm.isMailing(true);
                addrVm.editIsMailing(true);
                self.addressVms()[mailingExists] = addrVm;
            } else if (addType === "Mailing Address" && mailingExists === -1) { // Add
                addrVm.isPrimary(false);
                addrVm.editIsPrimary(false);
                addrVm.isMailing(true);
                addrVm.editIsMailing(true);
                if (primaryExists !== -1) {
                    self.addressVms()[primaryExists].isMailing(false);
                    self.addresses()[primaryExists].Address.IsMailing = false;
                }
                self.addresses.push(addrVm.toJSFromEdit());
            }


            var addrsToSubmit = [];
            var addrVms = self.addressVms();
            var addressVms = self.addressVms();
            for (var k = 0; k < addrVms.length; k++) {
                addrsToSubmit.push(addrVms[k].toJSFromEdit2());
            }
            for (i = 0; i < addressVms.length; i++) {
                addressVms[i].validationResult({});
                addressVms[i].removeAddrInlineErrors();
            }

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/SaveAddresses",
                dataType: "json",
                data: JSON.stringify(addrsToSubmit),
                success: function (response) {
                    if (app.ButtonSpinner)
                        app.ButtonSpinner.Stop();
                    if (app.WaitPopup)
                        app.WaitPopup.Close();

                    var invalidResultFound = false;
                    var len = 0;

                    for (i = 0; i < response.length; i++) {
                        var resultOfprimary;
                        var result = response[i];
                        if (!result.ValidationResult.IsValid) {
                            invalidResultFound = true;
                            if (i == 0) {
                                resultOfprimary = result.ValidationResult;
                                len = result.ValidationResult.Errors.length;
                                self.addressVms()[i].validationResult(result.ValidationResult);
                                self.addresses()[i].ValidationResult = result.ValidationResult;
                            }
                            if (i != 0) {
                                if (resultOfprimary && resultOfprimary != undefined && !resultOfprimary.Errors.IsValid) {
                                    for (var k = 0; k < len; k++) {
                                        resultOfprimary.Errors[k].ErrorMessage = "Primary Address: " + resultOfprimary.Errors[k].ErrorMessage;
                                        result.ValidationResult.Errors.unshift(resultOfprimary.Errors[k]);
                                    }
                                }
                                self.addressVms()[i].validationResult(result.ValidationResult);
                                self.addresses()[i].ValidationResult = result.ValidationResult;
                            }
                           
                            if (event.target.type != "radio") {
                                self.editAddressByIndex(i);
                            }
                            //self.addressErrors.valueHasMutated();
                        }
                        else {
                            if (resultOfprimary != undefined && resultOfprimary.Errors.length > 0) {
                                if (resultOfprimary && resultOfprimary != undefined && !resultOfprimary.Errors.IsValid) {
                                    for (var k = 0; k < len; k++) {
                                        resultOfprimary.Errors[k].ErrorMessage = "Primary Address: " + resultOfprimary.Errors[k].ErrorMessage;
                                        result.ValidationResult.Errors.unshift(resultOfprimary.Errors[k]);
                                    }
                                }
                                self.addressVms()[i].validationResult(result.ValidationResult);
                                self.addresses()[i].ValidationResult = result.ValidationResult;
                                if (event.target.type != "radio") {
                                    self.editAddressByIndex(i);
                                }
                            }
                        }
                    }

                    if (!invalidResultFound) {
                        for (var j = 0; j < addressVms.length; j++) {

                            if (response[j]) {
                                addressVms[j].isPrimary(response[j].Address.IsPrimary);
                                addressVms[j].isMailing(response[j].Address.IsMailing);
                            }
                            else {
                                addressVms[j].isPrimary(addressVms[j].editIsPrimary());
                                addressVms[j].isMailing(addressVms[j].editIsMailing());
                            }

                            addressVms[j].street1(addressVms[j].editStreet1());
                            addressVms[j].street2(addressVms[j].editStreet2());
                            addressVms[j].city(addressVms[j].editCity());
                            addressVms[j].state(addressVms[j].editState() === 'Select One' ? '' : addressVms[j].editState());
                            addressVms[j].zip(addressVms[j].editZip());
                            addressVms[j].county(addressVms[j].editCounty());
                            addressVms[j].country(addressVms[j].editCountry());

                            self.addresses()[j] = addressVms[j].toJSFromEdit2();
                        }

                        self.addresses(self.addresses());
                        self.isEditingAddress(false);
                        self.addressEditingIndexes([]);
                        self.newAddrIndex(0);
                        self.isAddingNew(false);
                        if (!self.isAddingNewAddress()) {
                            self.addressVms()[self.addrEditingIndex()].showAddress(true);
                        }
                        // clear the fields
                        self.addressAddedOrEdited([]);
                    } else {
                        if (event.target.type == "radio") {
                            // This can happen when Primary or Mailing Radio button is changed and there is an error
                            //Refresh the CommunicationAddresVMS from self.addresses
                            self.addresses(self.addresses());
                        }
                    }

                }
            });

        };

        self.submitAddressEdit = function submitAddressEdit(data, event) {

            if (event.target.type == "radio")
                app.WaitPopup = $(event.target.parentElement).WaitPopup({ hide: true, fullWindow: false });
            else
                app.ButtonSpinner = $(event.target).ButtonSpinner({ buttonType: app.enums.ButtonType.SMALLBLUE });


            //submit updated addresses
            var addrsToSubmit = [];
            var addrVms = self.addressVms();
            var addressEditingIndexes = self.addressEditingIndexes();
            for (var i = 0; i < addrVms.length; i++) {
                //if (addressEditingIndexes.indexOf(i) != -1) {
                addrsToSubmit.push(addrVms[i].toJSFromEdit());
                //}
            }
            var addressVms = self.addressVms();
            for (i = 0; i < addressVms.length; i++) {
                addressVms[i].validationResult({});
                addressVms[i].removeAddrInlineErrors();
            }


            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/SaveAddresses",
                dataType: "json",
                data: JSON.stringify(addrsToSubmit),
                success: function (response) {
                    if (app.ButtonSpinner)
                        app.ButtonSpinner.Stop();
                    if (app.WaitPopup)
                        app.WaitPopup.Close();

                    var invalidResultFound = false;

                    for (i = 0; i < response.length; i++) {
                        var result = response[i];
                        if (!result.ValidationResult.IsValid) {
                            invalidResultFound = true;

                            self.addressVms()[i].validationResult(result.ValidationResult);
                            self.addresses()[i].ValidationResult = result.ValidationResult;
                            if (event.target.type != "radio") {
                                self.editAddressByIndex(i);
                            }
                            //self.addressErrors.valueHasMutated();
                        }

                    }


                    if (!invalidResultFound) {

                        for (var j = 0; j < addressVms.length; j++) {

                            if (response[j]) {
                                addressVms[j].isPrimary(response[j].Address.IsPrimary);
                                addressVms[j].isMailing(response[j].Address.IsMailing);
                            }
                            else {
                                addressVms[j].isPrimary(addressVms[j].editIsPrimary());
                                addressVms[j].isMailing(addressVms[j].editIsMailing());
                            }

                            addressVms[j].street1(addressVms[j].editStreet1());
                            addressVms[j].street2(addressVms[j].editStreet2());
                            addressVms[j].city(addressVms[j].editCity());
                            addressVms[j].state(addressVms[j].editState() == 'Select One' ? '' : addressVms[j].editState());
                            addressVms[j].zip(addressVms[j].editZip());
                            addressVms[j].county(addressVms[j].editCounty());
                            addressVms[j].country(addressVms[j].editCountry());

                            self.addresses()[j] = addressVms[j].toJSFromEdit();
                        }


                        self.addresses(self.addresses());
                        self.isEditingAddress(false);
                        self.addressEditingIndexes([]);
                        self.newAddrIndex(0);
                        self.isAddingNew(false);
                        app.viewModels.CommunicationPreferencesViewModel.displayChangePrimaryAddressMessage(false);

                    }

                    else {
                        if (event.target.type == "radio") {
                            // This can happen when Primary or Mailing Radio button is changed and there is an error
                            //Refresh the CommunicationAddresVMS from self.addresses
                            self.addresses(self.addresses());
                        }



                    }
                    if (app.communicationPreferences != undefined)
                        app.communicationPreferences.refreshUI();

                }



            });
        };

        self.addNewAddress = function () {
            var protoSelf = this;

            var newAddr = { Address: {}, Counties: [], ValidationResult: {}, NewAddr: true };
            protoSelf.addresses.push(newAddr);
            protoSelf.isEditingAddress(true);
            protoSelf.addressEditingIndexes.push(protoSelf.addresses().length - 1);
            protoSelf.newAddrIndex(protoSelf.addresses().length - 1);
            protoSelf.isAddingNew(true);

            app.communicationPreferences.refreshUI();

            return protoSelf;
        };


        self.removePrimaryFromOthers = function removePrimaryFromOthers(index, data, event) {
            for (var i = 0; i < self.addresses().length; i++) {
                if (index != i) {
                    self.addressVms()[i].editIsPrimary(false);
                }

                else {
                    self.addressVms()[i].editIsPrimary(true);

                }
            }

            self.submitAddressEdit(data, event)

            return self;
        };

        self.removeMailingFromOthers = function removeMailingFromOthers(index, data, event) {
            for (var i = 0; i < self.addresses().length; i++) {
                if (index != i) {
                    self.addressVms()[i].editIsMailing(false);
                }

                else {
                    self.addressVms()[i].editIsMailing(true);

                }
            }

            self.submitAddressEdit(data, event);

            return self;
        };

        self.displayChangePrimaryAddressMessage = ko.observable(false);
        self.changePrimaryAddress_lbl = ko.observable('');


        self.deleteAddrConfirm = function (index, data, event) {
            var protoSelf = this;
            //  app.viewModels.CommunicationAddressModel.showDeleteAddrConfirm(false);

            var addressesToSubmit = [];
            for (i = 0; i < self.addresses().length; i++) {
                addressesToSubmit.push(self.addresses()[i]);
                addressesToSubmit[i].ValidationResult = null;
            }

            var isDelAddrPrimary = false;
            var isDelAddrMailing = false;
            for (var i = 0; i < addressesToSubmit.length; i++) {
                if (i == index) {
                    isDelAddrPrimary = addressesToSubmit[i].Address.IsPrimary;
                    isDelAddrMailing = addressesToSubmit[i].Address.IsMailing;
                    addressesToSubmit.splice(i, 1);
                }
            }
            //app.viewModels.CommunicationPreferencesViewModel.addresses(addresses);
            //            if (isDelAddrPrimary) {
            //                addressesToSubmit[0].Address.Isprimary = true;

            //            }
            //            if (isDelAddrMailing) {
            //                addressesToSubmit[0].Address.IsMailing = true;
            //            }
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Account/SaveAddresses",
                dataType: "json",
                data: JSON.stringify(addressesToSubmit),
                success: function (response) {

                    var invalidResultFound = false;
                    for (i = 0; i < response.length; i++) {
                        var result = response[i];
                        if (!result.ValidationResult.IsValid) {
                            app.viewModels.CommunicationPreferencesViewModel.addresses()[index].ValidationResult = result.ValidationResult;
                            invalidResultFound = true;

                        }

                    }

                    if (invalidResultFound) {
                        self.addresses(self.addresses());

                    }
                    else {
                        app.viewModels.CommunicationPreferencesViewModel.addresses(response);
                    }

                    app.communicationPreferences.refreshUI();
                    app.communicationPreferences.updateRadioStates();
                }
            });


            app.addressInfo.updateRadioStates();

            return protoSelf;
        };



        CommunicationPreferencesViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.commPreferences_hdr(viewModel.CommPreferences_Hdr);
            protoSelf.howWeUseTitle_lbl(viewModel.HowWeUseTitleLbl);
            protoSelf.cancelChanges_lbl(viewModel.CancelChangesLbl);
            protoSelf.saveChanges_lbl(viewModel.SaveChangesLbl);
            protoSelf.inlineErrorsHeader_lbl(viewModel.InlineErrorsHeaderLbl);
            protoSelf.inlineErrorsBody_lbl(viewModel.InlineErrorsBodyLbl);

            protoSelf.preferredContact_hdr(viewModel.PreferredContact_Hdr);
            protoSelf.preferredContactMethod(viewModel.PreferredContactMethod);
            protoSelf.switchToMail_lbl(viewModel.SwitchToMail_Lbl);
            protoSelf.switchToEmail_lbl(viewModel.SwitchToEmail_Lbl);
            protoSelf.attemptToHonorHtml(viewModel.AttemptToHonorHtml);
            protoSelf.sensitiveDocInfoHtml(viewModel.SensitiveDocInfoHtml);

            protoSelf.phone_hdr(viewModel.Phone_Hdr);

            protoSelf.primaryPhone_lbl(viewModel.PrimaryPhone_Lbl);
            protoSelf.primaryNumber(viewModel.PrimaryNumber);
            protoSelf.secondaryPhone_lbl(viewModel.SecondaryPhone_Lbl);
            protoSelf.secondaryNumber(viewModel.SecondaryNumber);
            protoSelf.howWeUsePhone_html(viewModel.HowWeUsePhone_Html);
            protoSelf.setAsPrimaryButton_lbl(viewModel.SetAsPrimaryButton_Lbl);

            protoSelf.baseEmailHtml(viewModel.BaseEmailHtml);
            protoSelf.baseMailHtml(viewModel.BaseMailHtml);

            protoSelf.email_hdr(viewModel.Email_Hdr);
            protoSelf.userEmailAddress(viewModel.UserEmailAddress);
            if (protoSelf.userEmailAddress() === null) {
                protoSelf.preferredContactMethod(app.enums.PreferredContactMethodEnum.Mail);
            }
            protoSelf.emailAddressDNE_lbl(viewModel.EmailAddressDNE_Lbl);
            protoSelf.changeEmail_lbl(viewModel.ChangeEmail_Lbl);

            protoSelf.enterEmail_lbl(viewModel.EnterEmail_Lbl);
            protoSelf.confirmEmail_lbl(viewModel.ConfirmEmail_Lbl);

            protoSelf.howWeUseEmail_desc(viewModel.HowWeUseEmail_Desc);

            protoSelf.inlineErrorsWereSorry_lbl(viewModel.InlineErrorsWereSorry_Lbl);

            protoSelf.commRestrictions_hdr(viewModel.CommRestrictions_Hdr);
            protoSelf.commRestrictions_desc(viewModel.CommRestrictions_Desc);
            protoSelf.changeRestrictions_lbl(viewModel.ChangeRestrictions_Lbl);

            protoSelf.isOkToCall(viewModel.IsOkToCall);
            protoSelf.isOkToEmail(viewModel.IsOkToEmail);
            protoSelf.isOkToMail(viewModel.IsOkToMail);

            protoSelf.okToCall_lbl(viewModel.OkToCall_Lbl);
            protoSelf.okToEmail_lbl(viewModel.OkToEmail_Lbl);
            protoSelf.okToMail_lbl(viewModel.OkToMail_Lbl);
            protoSelf.doNotCall_lbl(viewModel.DoNotCall_Lbl);
            protoSelf.doNotEmail_lbl(viewModel.DoNotEmail_Lbl);
            protoSelf.doNotMail_lbl(viewModel.DoNotMail_Lbl);

            protoSelf.callDesc_lbl(viewModel.CallDesc_Lbl);
            protoSelf.emailDesc_lbl(viewModel.EmailDesc_Lbl);
            protoSelf.mailDesc_lbl(viewModel.MailDesc_Lbl);

            protoSelf.aboutThisSetting_lbl(viewModel.AboutThisSetting_Lbl);
            protoSelf.aboutThisSetting_desc(viewModel.AboutThisSetting_Desc);

            var newAddresses = [];
            for (var i = 0; i < viewModel.Addresses.length; i++) {
                newAddresses.push(viewModel.Addresses[i]);
            }
            protoSelf.addresses(newAddresses);

            protoSelf.addresses_lbl(viewModel.AddressesLbl);
            protoSelf.primary_lbl(viewModel.PrimaryLbl);
            protoSelf.mailing_lbl(viewModel.MailingLbl);
            protoSelf.deleteBtn_lbl(viewModel.DeleteBtnLbl);
            protoSelf.changeBtn_lbl(viewModel.ChangeBtnLbl);
            protoSelf.deleteConfirm_lbl(viewModel.DeleteConfirmLbl);
            protoSelf.cancelBtn_lbl(viewModel.CancelBtnLbl);
            protoSelf.addAddrBtn_lbl(viewModel.AddAddrBtnLbl);

            protoSelf.editStreetAddr_lbl(viewModel.EditStreetAddrLbl);
            protoSelf.editAddr1_placeholder(viewModel.EditAddr1Placeholder);
            protoSelf.editAddr2_placeholder(viewModel.EditAddr2Placeholder);
            protoSelf.editCity_lbl(viewModel.EditCityLbl);
            protoSelf.editState_lbl(viewModel.EditStateLbl);
            protoSelf.stateList(viewModel.StateList);
            protoSelf.editZip_lbl(viewModel.EditZipLbl);
            protoSelf.editCounty_lbl(viewModel.EditCountyLbl);
            protoSelf.editCountry_lbl(viewModel.EditCountryLbl);
            protoSelf.countryList(viewModel.CountryList);
            protoSelf.defaultCountry_lbl(viewModel.DefaultCountryLbl);
            protoSelf.selectOne_lbl(viewModel.SelectOneLbl);
            protoSelf.howWeAddressesUseBody(viewModel.HowWeAddressesUseBody);

            protoSelf.changePrimaryAddress_lbl(viewModel.ChangePrimaryAddress_Lbl);

            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));


(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.CommunicationAddressModel = function CommunicationAddressModel(addressModel, index) {
        if (!(this instanceof CommunicationAddressModel)) {
            return new CommunicationAddressModel(addressModel, index);
        }
        var self = this;

        self.index = ko.observable(index);
        self.showAddress = ko.observable(true);
        /*Address Properties*/
        if (addressModel.Address && addressModel.Address.Id) {
            self.Id = ko.observable(addressModel.Address.Id);
        } else {
            self.Id = ko.observable('00000000-0000-0000-0000-000000000000');
        }
        self.UsAddress = ko.observable(1);
        self.ShowWebPart = ko.observable(true);
        if (addressModel.Address && typeof addressModel.Address.IsPrimary == "boolean") {
            self.isPrimary = ko.observable(addressModel.Address.IsPrimary);
            self.editIsPrimary = ko.observable(addressModel.Address.IsPrimary);
        } else {
            self.isPrimary = ko.observable(false);
            self.editIsPrimary = ko.observable(false);
        }

        if (addressModel.Address && typeof addressModel.Address.IsMailing == "boolean") {
            self.isMailing = ko.observable(addressModel.Address.IsMailing);
            self.editIsMailing = ko.observable(addressModel.Address.IsMailing);
        } else {
            self.isMailing = ko.observable(false);
            self.editIsMailing = ko.observable(false);
        }


        if (addressModel.Address && addressModel.Address.Address1) {
            self.street1 = ko.observable(addressModel.Address.Address1);
            self.editStreet1 = ko.observable(addressModel.Address.Address1);
        } else {
            self.street1 = ko.observable('');
            self.editStreet1 = ko.observable('');
        }
        if (addressModel.Address && addressModel.Address.Address2) {
            self.street2 = ko.observable(addressModel.Address.Address2);
            self.editStreet2 = ko.observable(addressModel.Address.Address2);
        } else {
            self.street2 = ko.observable('');
            self.editStreet2 = ko.observable('');
        }
        if (addressModel.Address && addressModel.Address.City) {
            self.city = ko.observable(addressModel.Address.City);
            self.editCity = ko.observable(addressModel.Address.City);
        } else {
            self.city = ko.observable('');
            self.editCity = ko.observable('');
        }
        if (addressModel.Address && addressModel.Address.State) {
            self.state = ko.observable(addressModel.Address.State);
            self.editState = ko.observable(addressModel.Address.State);
        } else {
            self.state = ko.observable('');
            self.editState = ko.observable('');
        }
        if (addressModel.Address && addressModel.Address.ZipCode) {
            self.zip = ko.observable(addressModel.Address.ZipCode);
            self.editZip = ko.observable(addressModel.Address.ZipCode);
        } else {
            self.zip = ko.observable('');
            self.editZip = ko.observable('');
        }
        if (addressModel.Address && addressModel.Address.CountyId) {
            self.county = ko.observable(addressModel.Address.CountyId);
            self.editCounty = ko.observable(addressModel.Address.CountyId);
        } else {
            self.county = ko.observable('00000000-0000-0000-0000-000000000000');
            self.editCounty = ko.observable('00000000-0000-0000-0000-000000000000');
        }
        if (addressModel.Address && addressModel.Address.Country) {
            self.country = ko.observable(addressModel.Address.Country);
            self.editCountry = ko.observable(addressModel.Address.Country);
        } else {
            self.country = ko.observable('');
            self.editCountry = ko.observable(app.viewModels.CommunicationPreferencesViewModel.defaultCountry_lbl());
        }

        self.editZip.subscribe(function (val) {
            if (app.profileAddresses) {
                app.profileAddresses.getCountiesForNewZip(val, true);
            }
        });

        self.formattedAddress = ko.computed({
            read: function () {
                var addr = '';
                if (self.street1() != '') {
                    addr = self.street1() + '<br/>';
                    if (self.street2() && self.street2() != '') {
                        addr += self.street2() + '<br/>';
                    }
                    addr += self.city() + ', ' + self.state() + ' ' + self.zip() + '<br/>';
                    addr += self.country();
                } else {
                    if (self.state() != '') {
                        addr += self.state() + ' ';
                    }
                    addr += self.zip();
                }
                return addr;
            },
            owner: this,
            deferEvaluation: true
        });

        /*Labels*/
        self.editStreetAddr_lbl = ko.observable(app.viewModels.CommunicationPreferencesViewModel.editStreetAddr_lbl());
        self.editAddr1_placeholder = ko.observable(app.viewModels.CommunicationPreferencesViewModel.editAddr1_placeholder());
        self.editAddr2_placeholder = ko.observable(app.viewModels.CommunicationPreferencesViewModel.editAddr2_placeholder());
        self.editCity_lbl = ko.observable(app.viewModels.CommunicationPreferencesViewModel.editCity_lbl());
        self.editState_lbl = ko.observable(app.viewModels.CommunicationPreferencesViewModel.editState_lbl());
        self.stateList = ko.observableArray(app.viewModels.CommunicationPreferencesViewModel.stateList());
        self.editZip_lbl = ko.observable(app.viewModels.CommunicationPreferencesViewModel.editZip_lbl());
        self.editCounty_lbl = ko.observable(app.viewModels.CommunicationPreferencesViewModel.editCounty_lbl());
        self.countyList = ko.observableArray(addressModel.Counties);
        self.showCountyList = ko.computed({
            read: function () {
                return self.countyList().length > 1;
            },
            owner: this,
            deferEvaluation: true
        });
        self.editCountry_lbl = ko.observable(app.viewModels.CommunicationPreferencesViewModel.editCountry_lbl());
        self.countryList = ko.observableArray(app.viewModels.CommunicationPreferencesViewModel.countryList());
        self.selectOne_lbl = ko.observable(app.viewModels.CommunicationPreferencesViewModel.selectOne_lbl());

        self.validationResult = ko.observable(addressModel.ValidationResult);
        self.errors = ko.computed({
            read: function () {
                var result = self.validationResult();
                var errors = [];
                if (result && result.Errors) {
                    for (var i = 0; i < result.Errors.length; i++) {
                        errors.push(result.Errors[i].ErrorMessage);
                    }
                }
                if (result && result.NoCountryIsUS) {
                    errors.push(result.NoCountryUSLbl);
                }
                self.updateAddressInlineErrorFields();

                return errors;
                // return  ko.observableArray(app.viewModels.CommunicationPreferencesViewModel.errors);
            },
            owner: this,
            deferEvaluation: true
        });
        self.hasErrors = ko.computed({
            read: function () {
                return self.errors().length;
            },
            owner: this,
            deferEvaluation: true
        });

        // self.hasErrors = ko.observableArray(app.viewModels.CommunicationPreferencesViewModel.hasErrors);
        self.inlineErrorsHeader_lbl = ko.observable(app.viewModels.CommunicationPreferencesViewModel.inlineErrorsHeader_lbl());
        self.inlineErrorsBody_lbl = ko.observable(app.viewModels.CommunicationPreferencesViewModel.inlineErrorsBody_lbl());

        self.inlineAddrErrorStreet1 = ko.observable(false);
        self.inlineAddrErrorStreet2 = ko.observable(false);
        self.inlineAddrErrorCity = ko.observable(false);
        self.inlineAddrErrorState = ko.observable(false);
        self.inlineAddrErrorZip = ko.observable(false);
        self.inlineAddrErrorCounty = ko.observable(false);
        self.inlineAddrErrorCountry = ko.observable(false);

        self.updateAddressInlineErrorFields = function () {
            var validation = self.validationResult();
            if (validation && validation.Errors) {
                for (var i = 0; i < validation.Errors.length; i++) {
                    var error = validation.Errors[i];
                    if (error.PropertyName.contains("Address1") && validation.Errors[i].ErrorMessage.indexOf("Primary Address:") == -1) {
                        self.inlineAddrErrorStreet1(true);
                        continue;
                    }
                    if (error.PropertyName.contains("Address2")) {
                        self.inlineAddrErrorStreet2(true);
                        continue;
                    }
                    if (error.PropertyName.contains("City") && validation.Errors[i].ErrorMessage.indexOf("Primary Address:") == -1) {
                        self.inlineAddrErrorCity(true);
                        continue;
                    }


                    if (error.PropertyName.contains("ZipCodeState")) {
                        self.inlineAddrErrorState(true);
                        self.inlineAddrErrorZip(true);
                        $('#dk_container_states' + self.index()).addClass('error-field');

                        continue;
                    }

                    if (error.PropertyName.contains("ZipCodeCounty")) {
                        self.inlineAddrErrorStreet1(true);
                        self.inlineAddrErrorStreet2(true);
                        self.inlineAddrErrorCity(true);
                        self.inlineAddrErrorCounty(true);
                        $('#dk_container_county' + self.index()).addClass('error-field');
                        self.inlineAddrErrorState(true);
                        $('#dk_container_states' + self.index()).addClass('error-field');
                        continue;
                    }

                    if (error.PropertyName.contains("State")) {
                        self.inlineAddrErrorState(true);
                        $('#dk_container_states' + self.index()).addClass('error-field');
                        continue;
                    }

                    if (error.PropertyName.contains("ZipCode")) {
                        self.inlineAddrErrorZip(true);
                        continue;
                    }


                    if (error.PropertyName.contains("County")) {
                        self.inlineAddrErrorCounty(true);
                        $('#dk_container_county' + self.index()).addClass('error-field');
                        continue;
                    }
                    if (error.PropertyName.contains("Country")) {
                        self.inlineAddrErrorCountry(true);
                        $('#dk_container_country' + self.index()).addClass('error-field');
                        continue;
                    }
                }
            }
        };

        self.removeAddrInlineErrors = function () {
            self.inlineAddrErrorStreet1(false);
            self.inlineAddrErrorStreet2(false);
            self.inlineAddrErrorCity(false);
            self.inlineAddrErrorState(false);
            $('#dk_container_states' + self.index()).removeClass('error-field');
            self.inlineAddrErrorZip(false);
            self.inlineAddrErrorCounty(false);
            self.inlineAddrErrorCountry(false);
            $('.addresses').find('div').removeClass('error-field');
        };

        /*Functions*/
        self.showDeleteAddrConfirm = ko.observable(false);
        self.cancelDeleteAddr = function () {
            var protoSelf = this;
            protoSelf.showDeleteAddrConfirm(false);
            return protoSelf;
        };
        self.deleteAddr = function () {
            var protoSelf = this;
            if (app.viewModels.CommunicationPreferencesViewModel.isEditingAddress()) {
                return protoSelf;
            }
            protoSelf.showDeleteAddrConfirm(true);
            return protoSelf;
        };





        CommunicationAddressModel.prototype.toJSFromEdit = function toJSFromEdit() {
            var protoSelf = this;
            var index = protoSelf.index();
            var state = app.functions.getDropdownSelectedValueBySelectElementId('states' + index);
            protoSelf.editState(state);

            var county = app.functions.getDropdownSelectedValueBySelectElementId('county' + index);
            protoSelf.editCounty(county);

            var country = app.functions.getDropdownSelectedValueBySelectElementId('country' + index);
            protoSelf.editCountry(country);

            var addrModel = {

                Address: {
                    Id: protoSelf.Id(),
                    IsPrimary: protoSelf.editIsPrimary(),
                    IsMailing: protoSelf.editIsMailing(),
                    Address1: protoSelf.editStreet1(),
                    Address2: protoSelf.editStreet2(),
                    City: protoSelf.editCity(),
                    State: protoSelf.editState() == 'Select One' ? '' : protoSelf.editState(),
                    ZipCode: protoSelf.editZip(),
                    CountyId: protoSelf.countyList().length == 1 ? protoSelf.countyList()[0].Id : protoSelf.editCounty(),
                    Country: protoSelf.editCountry()

                },

                Counties: protoSelf.countyList(),

                ValidationResult: {}
            };

            //            addrModel.Address.Id = protoSelf.Id();
            //            addrModel.Address.IsPrimary = protoSelf.isPrimary();
            //            addrModel.Address.IsMailing = protoSelf.isMailing();
            //            addrModel.Address.Address1 = protoSelf.editStreet1();
            //            addrModel.Address.Address2 = protoSelf.editStreet2();
            //            addrModel.Address.City = protoSelf.editCity();
            //            addrModel.Address.State = protoSelf.editState();
            //            addrModel.Address.ZipCode = protoSelf.editZip();
            //            addrModel.Address.County = protoSelf.editCounty();
            //            addrModel.Address.Country = protoSelf.editCountry();

            return addrModel;
        };

        CommunicationAddressModel.prototype.toJSFromEdit2 = function toJSFromEdit2() {
            var protoSelf = this;

            var addrModel = {

                Address: {
                    Id: protoSelf.Id(),
                    IsPrimary: protoSelf.editIsPrimary(),
                    IsMailing: protoSelf.editIsMailing(),
                    Address1: protoSelf.editStreet1(),
                    Address2: protoSelf.editStreet2(),
                    City: protoSelf.editCity(),
                    State: protoSelf.editState() == 'Select One' ? '' : protoSelf.editState(),
                    ZipCode: protoSelf.editZip(),
                    CountyId: protoSelf.countyList().length == 1 ? protoSelf.countyList()[0].Id : protoSelf.editCounty(),
                    Country: protoSelf.editCountry()

                },

                Counties: protoSelf.countyList(),

                ValidationResult: {}
            };
            return addrModel;
        };


        return self;
    };
} (EXCHANGE));


