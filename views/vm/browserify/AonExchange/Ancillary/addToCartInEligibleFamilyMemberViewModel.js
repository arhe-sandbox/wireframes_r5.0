(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.AddToCartInEligibleFamilyMemberViewModel = function AddToCartInEligibleFamilyMemberViewModel() {
        if (!(this instanceof AddToCartInEligibleFamilyMemberViewModel)) {
            return new AddToCartInEligibleFamilyMemberViewModel();
        }

        var self = this;
        self.header_lbl = ko.observable('');
        self.content_html = ko.observable('');
        self.goBackButton_lbl = ko.observable('');
        self.continueButton_lbl = ko.observable('');
       

        self.hasBeenLoaded = false;

        AddToCartInEligibleFamilyMemberViewModel.prototype.loadFromJSON = function loadFromJSON(addToCartInEligibleFamilyMember) {
            var protoself = this;

            protoself.header_lbl(addToCartInEligibleFamilyMember.Header_Lbl);
            protoself.content_html(addToCartInEligibleFamilyMember.Content_Html);
            protoself.goBackButton_lbl(addToCartInEligibleFamilyMember.GoBackButton_lbl);
            protoself.continueButton_lbl(addToCartInEligibleFamilyMember.ContinueButton_lbl);

            return protoself;
        };

        return self;
    };

} (EXCHANGE, this));