(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.PoaViewModel = function PoaViewModel() {
        if (!(this instanceof PoaViewModel)) {
            return new PoaViewModel();
        }
        var self = this;

        self.isVMLoaded = ko.observable(false);
        self.ShowWebPart = ko.observable(false);

        self.stateList = ko.observableArray(['Select One']);
        self.countyList = ko.observableArray();
        self.showCountyList = ko.computed({
            read: function () {
                return self.countyList().length > 1;
            },
            owner: this,
            deferEvaluation: true
        });

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
        self.powerOfAttorneySameAddress_lbl = ko.observable('');

        self.powerOfAttorneyIsEmpty = ko.observable(true);
        self.powerOfAttorneyIsEmpty.subscribe(function (val) {
            if (val === true) {
                $('.pre65-wrap-attorney').hide();
            }
            else {
                $('.pre65-wrap-attorney').show();
            }
        });
        self.powerOfAttorneyDesignate_radio = ko.observable('');
        self.powerOfAttorneyDesignate_lbl = ko.observable('');
        self.powerOfAttorneyDesignateYes_lbl = ko.observable('');
        self.powerOfAttorneyDesignateNo_lbl = ko.observable('');
        self.powerOfAttorneyDesignateEdit_radio = ko.observable('');
        self.powerOfAttorneyDesignateEdit_radio.subscribe(function (val) {
            if (val === "Yes") {    
                $('.pre65-wrap-attorney').show();
                //  $('.pre65-att-edit-btn').hide();    
                if (!self.powerOfAttorneyIsEmpty()) {
                    $('#pre65-att-edit-btn').hide();
                    $('#pre65-att-cancel-btn').hide();
                    $('.pre65-att-read').show();
                    $('.pre65-att-read-btn').show();
                    $('.pre65-att-edit').hide();
                }
                else {
                    $('.pre65-att-read').hide();
                    $('.pre65-att-read-btn').hide();
                    $('#pre65-att-edit-btn').show();
                    $('#pre65-att-cancel-btn').show();
                    $('.pre65-att-edit').show();
                    $('.poa-addr-select').show();
                }
            }
            else {
                if (!self.powerOfAttorneyIsEmpty()) {
                    $('#pre65-att-edit-btn').show();
                    $('#pre65-att-cancel-btn').show();
                }
                $('.pre65-wrap-attorney').hide();
            }
        });

        self.addressTypes = ko.observableArray(['Select One']);
        self.poaCustAddr_tb = ko.observable('');
        
        self.poaSameAddr_radio = ko.observable('');
        self.poaSameAddr_radio.subscribe(function (val) {
            if (val === "Yes") {
                $('.poa-addr-dd').show();
                $('#my-profile-poa.pre65-ddl').dropkick();
                var addType = app.functions.getDropdownSelectedValueBySelectElementId('poa-add-dropdown');
                self.updatePoaAddr(addType);
            } else {
                $('.poa-addr-dd').hide();
                EXCHANGE.poa.changePoaPopulateEdits();
            }
        });

        self.updatePoaAddr = function updatePoaAddr(addType) {
            var custAddress;
            if (addType === "Primary Address") {
                custAddress = self.getCustomerAddr(true);
            } else if (addType === "Mailing Address") {
                custAddress = self.getCustomerAddr(false);
            }
            if (custAddress !== undefined) {
                self.setPoaAddr(custAddress);
            }
        };

        self.setPoaAddr = function setPoaAddr(custAddress) {
            if (custAddress.street1() != '') {
                app.viewModels.PoaViewModel.powerOfAttorneyAddress1Edit_tb(custAddress.street1());
                app.placeholder.clearPlaceholder('#pre65-ed-ad1');
            }
            if (custAddress.street2() != '') {
                app.viewModels.PoaViewModel.powerOfAttorneyAddress2Edit_tb(custAddress.street2());
                app.placeholder.clearPlaceholder('#pre65-ed-ad2');
            }
            app.viewModels.PoaViewModel.powerOfAttorneyCityEdit_tb(custAddress.city());
            
            if (custAddress.zip() != '') {
                app.viewModels.PoaViewModel.powerOfAttorneyZipEdit_tb(custAddress.zip());
                app.placeholder.clearPlaceholder('#pre65-ed-zi');
            }
            app.viewModels.PoaViewModel.powerOfAttorneyCountyEdit_tb(custAddress.county());
            
            app.viewModels.PoaViewModel.powerOfAttorneyStateEdit_tb(custAddress.state());
            app.functions.updateDropkick('#pre65-ed-st', custAddress.state());
        };

        self.getCustomerAddr = function getCustomerAddr(getPrimary) {
            var custAddrs = EXCHANGE.viewModels.CommunicationPreferencesViewModel.addressVms();
            var addr;
            for (var a = 0; a < custAddrs.length; a++) {
                if (getPrimary === true && custAddrs[a].isPrimary() === true) {
                    addr = custAddrs[a];
                    break;
                } else if (getPrimary === false && custAddrs[a].isMailing() === true) {
                    addr = custAddrs[a];
                    break;
                }
            }
            return addr;
        };
        
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
        self.powerOfAttorneyZipEdit_tb.subscribe(function (val) {
            if (app.poa) {
                app.poa.getCountiesForZipAjax(val);
            }
        });
        self.powerOfAttorneyCountyEdit_tb = ko.observable('');
        self.select_One_lbl = ko.observable('');

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
        self.inlineErrorsPoa = ko.observableArray([]);

        self.inlineErrorsWereSorry_lbl = ko.observable('');
        self.inlineErrorsBody_lbl = ko.observable('');


        PoaViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.stateList(viewModel.StateList);
            protoSelf.addressTypes(viewModel.PoaAddressTypes);
            protoSelf.countyList(viewModel.CountyList);

            protoSelf.powerOfAttorneyIsEmpty(viewModel.PowerOfAttorneyIsEmpty);
            protoSelf.powerOfAttorneyDesignate_radio(viewModel.PowerOfAttorneyDesignate_Radio);
            protoSelf.powerOfAttorney_lbl(viewModel.PowerOfAttorney_Lbl);
            protoSelf.powerOfAttorneyDesc_lbl(viewModel.PowerOfAttorneyDesc_Lbl);
            protoSelf.powerOfAttorneyDNE_lbl(viewModel.PowerOfAttorneyDNE_Lbl);
            protoSelf.powerOfAttorneyName_lbl(viewModel.PowerOfAttorneyName_Lbl);
            protoSelf.powerOfAttorneyFirstName_tb(viewModel.PowerOfAttorneyFirstName_Tb);
            protoSelf.powerOfAttorneyLastName_tb(viewModel.PowerOfAttorneyLastName_Tb);
            protoSelf.powerOfAttorneyAddress1_lbl(viewModel.PowerOfAttorneyAddress1_Lbl);
            protoSelf.powerOfAttorneyAddress1_tb(viewModel.PowerOfAttorneyAddress1_Tb);
            protoSelf.powerOfAttorneyAddress2_lbl(viewModel.PowerOfAttorneyAddress2_Lbl);
            protoSelf.powerOfAttorneyAddress2_tb(viewModel.PowerOfAttorneyAddress2_Tb);
            protoSelf.powerOfAttorneyCity_lbl(viewModel.PowerOfAttorneyCity_Lbl);
            protoSelf.powerOfAttorneyCity_tb(viewModel.PowerOfAttorneyCity_Tb);
            protoSelf.powerOfAttorneyState_lbl(viewModel.PowerOfAttorneyState_Lbl);
            protoSelf.powerOfAttorneyState_tb(viewModel.PowerOfAttorneyState_Tb);
            protoSelf.powerOfAttorneyZip_lbl(viewModel.PowerOfAttorneyZip_Lbl);
            protoSelf.powerOfAttorneyZip_tb(viewModel.PowerOfAttorneyZip_Tb);
            protoSelf.powerOfAttorneyCounty_lbl(viewModel.PowerOfAttorneyCounty_Lbl);
            protoSelf.powerOfAttorneyCounty_tb(viewModel.PowerOfAttorneyCounty_Tb);
            protoSelf.powerOfAttorneyPhone_lbl(viewModel.PowerOfAttorneyPhone_Lbl);
            protoSelf.powerOfAttorneyPhone_tb(viewModel.PowerOfAttorneyPhone_Tb);
            protoSelf.powerOfAttorneySameAddress_lbl(viewModel.PowerOfAttorneySameAddress_Lbl);
            protoSelf.poaCustAddr_tb(viewModel.PoaCustAddr_Tb);

            protoSelf.powerOfAttorneyDesignate_lbl(viewModel.PowerOfAttorneyDesignate_Lbl);
            protoSelf.powerOfAttorneyDesignateYes_lbl(viewModel.PowerOfAttorneyDesignateYes_Lbl);
            protoSelf.powerOfAttorneyDesignateNo_lbl(viewModel.PowerOfAttorneyDesignateNo_Lbl);
            protoSelf.powerOfAttorneyDesignateEdit_radio(viewModel.PowerOfAttorneyDesignate_Radio);
            protoSelf.powerOfAttorneyNameEdit_lbl(viewModel.PowerOfAttorneyNameEdit_Lbl);
            protoSelf.powerOfAttorneyFirstNameEdit_tb(viewModel.PowerOfAttorneyFirstName_Tb);
            protoSelf.powerOfAttorneyFirstNameEdit_tip(viewModel.PowerOfAttorneyFirstNameEdit_Tip);
            protoSelf.powerOfAttorneyLastNameEdit_tb(viewModel.PowerOfAttorneyLastName_Tb);
            protoSelf.powerOfAttorneyLastNameEdit_tip(viewModel.PowerOfAttorneyLastNameEdit_Tip);
            protoSelf.powerOfAttorneyAddressEdit_lbl(viewModel.PowerOfAttorneyAddressEdit_Lbl);
            protoSelf.powerOfAttorneyAddress1Edit_tb(viewModel.PowerOfAttorneyAddress1_Tb);
            protoSelf.powerOfAttorneyAddress1Edit_tip(viewModel.PowerOfAttorneyAddress1Edit_Tip);
            protoSelf.powerOfAttorneyAddress2Edit_tb(viewModel.PowerOfAttorneyAddress2_Tb);
            protoSelf.powerOfAttorneyAddress2Edit_tip(viewModel.PowerOfAttorneyAddress2Edit_Tip);
            protoSelf.powerOfAttorneyCityEdit_lbl(viewModel.PowerOfAttorneyCityEdit_Lbl);
            protoSelf.powerOfAttorneyCityEdit_tb(viewModel.PowerOfAttorneyCity_Tb);
            protoSelf.powerOfAttorneyStateEdit_lbl(viewModel.PowerOfAttorneyStateEdit_Lbl);
            protoSelf.powerOfAttorneyStateEdit_tb(viewModel.PowerOfAttorneyState_Tb);
            protoSelf.powerOfAttorneyZipEdit_lbl(viewModel.PowerOfAttorneyZipEdit_Lbl);
            protoSelf.powerOfAttorneyZipEdit_tb(viewModel.PowerOfAttorneyZip_Tb);
            protoSelf.countyId_boundToSelectValue(viewModel.CountyId);
            protoSelf.powerOfAttorneyPhoneEdit_lbl(viewModel.PowerOfAttorneyPhoneEdit_Lbl);
            protoSelf.powerOfAttorneyPhoneEdit_tb(viewModel.PowerOfAttorneyPhone_Tb);
            protoSelf.powerOfAttorneyConfirmHeader_lbl(viewModel.PowerOfAttorneyConfirmHeader_Lbl);
            protoSelf.changeInfoBtn_lbl(viewModel.ChangeInfoBtn_Lbl);
            protoSelf.saveBtn_lbl(viewModel.ChangeInfoBtn_Lbl);
            protoSelf.cancelBtn_lbl(viewModel.CancelBtn_Lbl);
            protoSelf.changesSaved_lbl(viewModel.ChangesSaved_Lbl);
            protoSelf.inlineErrorsWereSorry_lbl(viewModel.InlineErrorsWereSorry_Lbl);
            protoSelf.inlineErrorsBody_lbl(viewModel.InlineErrorsBody_Lbl);

            protoSelf.isVMLoaded(true);
            protoSelf.ShowWebPart(true);

            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));