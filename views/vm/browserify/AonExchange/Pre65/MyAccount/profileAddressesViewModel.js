(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.ProfileAddressesViewModel = function ProfileAddressesViewModel() {
        if (!(this instanceof ProfileAddressesViewModel)) {
            return new ProfileAddressesViewModel();
        }
        var self = this;

        self.isVMLoaded = ko.observable(false);

        self.addresses_lbl = ko.observable('');
        self.primary_lbl = ko.observable('');
        self.mailing_lbl = ko.observable('');
        self.changeBtn_lbl = ko.observable('');
        self.cancelBtn_lbl = ko.observable('');
        self.addAddrBtn_lbl = ko.observable('');

        self.editStreetAddr_lbl = ko.observable('');
        self.editAddr1_placeholder = ko.observable('');
        self.editAddr2_placeholder = ko.observable('');
        self.editCity_lbl = ko.observable('');
        self.editState_lbl = ko.observable('');
        self.editZip_lbl = ko.observable('');
        self.editCounty_lbl = ko.observable('');
        self.editCountry_lbl = ko.observable('');
        self.defaultCountry_lbl = ko.observable('');
        self.selectOne_lbl = ko.observable('');

        self.stateList = ko.observableArray(['Select One']);
        self.showCountyList = ko.computed({
            read: function () {
                return self.countyList().length > 1;
            },
            owner: this,
            deferEvaluation: true
        });
        self.countryList = ko.observableArray([]);
        
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
            deferEvaluation: true
        });

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

        self.isEditingAddress = ko.observable(false);
        self.isEditingNonUsAddress = ko.observable(false);
        self.addressEditingIndexes = ko.observableArray([]);
        self.isAddingNew = ko.observable(false);
        self.newAddrIndex = ko.observable(0);

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
            if (addrVm.isPrimary()) {
                self.isEditingPrimary(true);
                self.isEditingSecondary(false);
                self.addressVms()[addrIndex].editIsPrimary(true);
                self.addressVms()[addrIndex].editIsMailing(false);
            } else {
                self.isEditingPrimary(false);
                self.isEditingSecondary(true);
                self.addressVms()[addrIndex].editIsPrimary(false);
                self.addressVms()[addrIndex].editIsMailing(true);
            }
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
            //            if (addressVms.length == 1) {
            //                addrsToSubmit[0].Address.IsPrimary = true;
            //                addrsToSubmit[0].Address.IsMailing = true;
            //                addressVms[0].editIsPrimary(true);
            //                addressVms[0].editIsMailing(true);
            //            }

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


        /* Address Errors */

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





        self.inlineErrorsWereSorry_lbl = ko.observable('');
        self.inlineErrorsBody_lbl = ko.observable('');
        self.inlineErrorsExistAddress = ko.observable(false);
        self.inlineErrorsAddress = ko.observableArray([]);


        ProfileAddressesViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;

            var newAddresses = [];
            for (var i = 0; i < viewModel.Addresses.length; i++) {
                newAddresses.push(viewModel.Addresses[i]);
            }
            protoSelf.addresses(newAddresses);
            protoSelf.countryList(viewModel.CountryList);

            protoSelf.addresses_lbl(viewModel.AddressesLbl);
            protoSelf.primary_lbl(viewModel.PrimaryLbl);
            protoSelf.mailing_lbl(viewModel.MailingLbl);
            protoSelf.changeBtn_lbl(viewModel.ChangeBtnLbl);
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
            protoSelf.defaultCountry_lbl(viewModel.DefaultCountryLbl);
            protoSelf.changePrimaryAddress_lbl(viewModel.ChangePrimaryAddress_Lbl);
            protoSelf.selectOne_lbl(viewModel.SelectOneLbl);
            protoSelf.inlineErrorsWereSorry_lbl(viewModel.InlineErrorsWereSorry_Lbl);
            protoSelf.inlineErrorsBody_lbl(viewModel.InlineErrorsBody_Lbl);

            protoSelf.isVMLoaded(true);

            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));