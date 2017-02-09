(function (app, $) {
    var ns = app.namespace("EXCHANGE.application.functions");

    ns.setDefaultValue = function setDefaultValue(selectId) {
        if ((ko.dataFor($('#' + selectId)[0]).Answer().Answer() === null) || ko.dataFor($('#' + selectId)[0]).Answer().Answer() === "") {
            $('#' + selectId).parent().find('.dk_label').html(EXCHANGE.viewModels.ApplicationSharedValuesViewModel.selectOne_lbl());
        }
    };

    ns.applyDropkick = function applyDropkick(selectId) {
        $('#' + selectId).dropkick({
            change: function (value, label) {
                var item = ko.dataFor($('#' + selectId)[0]);
                item.Answer().Answer(value);
            }
        });
    };


    ns.applyDropkickDt = function applyDropkickDt(selectId) {
        $('#' + selectId).dropkick({
            change: function (value, label) {
                var item = ko.dataFor($('#' + selectId)[0]);
                item.sep_Month(value);
            }
        });
    };



    ns.applyCustomInput = function applyCustomInput(switchId) {
        $('#' + switchId).find('input').customInput();
    };

    ns.gridItemName = function gridItemName(itemType) {
        switch (itemType) {
            case app.enums.ApplicationItemTypeEnum.Addr1:
                return "Address1";
            case app.enums.ApplicationItemTypeEnum.Addr2:
                return "Address2";
            case app.enums.ApplicationItemTypeEnum.City:
                return "City";
            case app.enums.ApplicationItemTypeEnum.Zip:
                return "ZipCode";

            default:
                return "";
        }
    };

    ns.getItemTypeName = function getItemTypeName(itemType) {
        switch (itemType) {
            case app.enums.ApplicationItemTypeEnum.SingleLineTextBox:
                return app.enums.ApplicationItemTypeNameEnum.SingleLineTextBox;
            case app.enums.ApplicationItemTypeEnum.Date:
                return app.enums.ApplicationItemTypeNameEnum.Date;
            case app.enums.ApplicationItemTypeEnum.Radio:
                return app.enums.ApplicationItemTypeNameEnum.Radio;
            case app.enums.ApplicationItemTypeEnum.DropDown:
                return app.enums.ApplicationItemTypeNameEnum.DropDown;
            case app.enums.ApplicationItemTypeEnum.Section:
                return app.enums.ApplicationItemTypeNameEnum.Section;
            case app.enums.ApplicationItemTypeEnum.Subheader:
                return app.enums.ApplicationItemTypeNameEnum.Subheader;
            case app.enums.ApplicationItemTypeEnum.SectionWithDetails:
                return app.enums.ApplicationItemTypeNameEnum.SectionWithDetails;
            case app.enums.ApplicationItemTypeEnum.MultiLineTextBox:
                return app.enums.ApplicationItemTypeNameEnum.MultiLineTextBox;
            case app.enums.ApplicationItemTypeEnum.Image:
                return app.enums.ApplicationItemTypeNameEnum.Image;
            case app.enums.ApplicationItemTypeEnum.ProductSummary:
                return app.enums.ApplicationItemTypeNameEnum.ProductSummary;
            case app.enums.ApplicationItemTypeEnum.Hidden:
                return app.enums.ApplicationItemTypeNameEnum.Hidden;
            case app.enums.ApplicationItemTypeEnum.Readonly:
                return app.enums.ApplicationItemTypeNameEnum.Readonly;
            case app.enums.ApplicationItemTypeEnum.Choice:
                return app.enums.ApplicationItemTypeNameEnum.Choice;
            case app.enums.ApplicationItemTypeEnum.Checkbox:
                return app.enums.ApplicationItemTypeNameEnum.Checkbox;
            case app.enums.ApplicationItemTypeEnum.BankRoutingNumber:
                return app.enums.ApplicationItemTypeNameEnum.BankRoutingNumber;
            case app.enums.ApplicationItemTypeEnum.SSN:
                return app.enums.ApplicationItemTypeNameEnum.SSN;
            case app.enums.ApplicationItemTypeEnum.Zip:
                return app.enums.ApplicationItemTypeNameEnum.Zip;
            case app.enums.ApplicationItemTypeEnum.State:
                return app.enums.ApplicationItemTypeNameEnum.State;
            case app.enums.ApplicationItemTypeEnum.County:
                return app.enums.ApplicationItemTypeNameEnum.County;
            case app.enums.ApplicationItemTypeEnum.MedicareIDNumber:
                return app.enums.ApplicationItemTypeNameEnum.MedicareIDNumber;
            case app.enums.ApplicationItemTypeEnum.Email:
                return app.enums.ApplicationItemTypeNameEnum.Email;
            case app.enums.ApplicationItemTypeEnum.PhoneNumber:
                return app.enums.ApplicationItemTypeNameEnum.PhoneNumber;
            case app.enums.ApplicationItemTypeEnum.AgentScript:
                return app.enums.ApplicationItemTypeNameEnum.AgentScript;
            case app.enums.ApplicationItemTypeEnum.Computed:
                return app.enums.ApplicationItemTypeNameEnum.Computed;
            case app.enums.ApplicationItemTypeEnum.CarrierPortalURL:
                return app.enums.ApplicationItemTypeNameEnum.CarrierPortalURL;
            case app.enums.ApplicationItemTypeEnum.SeparatedDate:
                return app.enums.ApplicationItemTypeNameEnum.SeparatedDate;
            case app.enums.ApplicationItemTypeEnum.FirstDate:
                return app.enums.ApplicationItemTypeNameEnum.FirstDate;
            case app.enums.ApplicationItemTypeEnum.AddressGroup:
                return app.enums.ApplicationItemTypeNameEnum.AddressGroup;
            case app.enums.ApplicationItemTypeEnum.Addr1:
                return app.enums.ApplicationItemTypeNameEnum.Addr1;
            case app.enums.ApplicationItemTypeEnum.Addr2:
                return app.enums.ApplicationItemTypeNameEnum.Addr2;
            case app.enums.ApplicationItemTypeEnum.City:
                return app.enums.ApplicationItemTypeNameEnum.City;
            case app.enums.ApplicationItemTypeEnum.CarriereSignAcknowledgment:
                return app.enums.ApplicationItemTypeNameEnum.CarriereSignAcknowledgment;
            case app.enums.ApplicationItemTypeEnum.CarriereSignAgreement:
                return app.enums.ApplicationItemTypeNameEnum.CarriereSignAgreement;
            default:
                return "";
        }
    };

    ns.getMaxLengthValidation = function getMaxLengthValidation(validationList) {
        if (!validationList || validationList.length === 0) {
            return -1;
        }
        var max = -1;
        $.each(validationList, function (index, validation) {
            if (validation.ValidationType == app.enums.ValidationTypeEnum.MaximumLength) {
                max = +(validation.value);
                return;
            }
        });
        return max;
    };

    ns.performApplicationIntegrityCheck = function performApplicationIntegrityCheck() {
        if (!app.viewModels.ApplicationIntegrityViewModel.isApplicationStateValid()) {
            $('#application-body-content').hide();
            $('.app-review-container').hide();
            $('#application-body-error').show().html(app.viewModels.ApplicationIntegrityViewModel.applicationStateErrorMessage());
            $('#application-navigation-bar').hide();
        }
    };

    ns.obfuscateAllButLastFour = function obfuscateAllButLastFour(text) {
        if (text) {
            var length = text.length;
            if (length > 4) {
                var obfuscatedString = "";
                var dotCharacter = "&#8226;";
                var lastFour = text.substr(length - 4);
                for (var i = 0; i < length - 4; i++) {
                    obfuscatedString += dotCharacter;
                }
                return obfuscatedString + lastFour;
            }
            else {
                return text;
            }
        }
    };

    ns.obfuscateSsn = function obfuscateSsn(ssn) {
        if (ssn) {
            return "&#8226;&#8226;&#8226; - &#8226;&#8226; - " + ssn.substr(ssn.length - 4, 4);
        } else {
            return '';
        }
    };
    ns.leadingZero = function leadingZero(value) {
        if (value < 10) {
            return "0" + value.toString();
        }
        return value.toString();
    };


} (EXCHANGE, jQuery));
