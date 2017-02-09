(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.RxPreloadViewModel = function RxPreloadViewModel() {
        if (!(this instanceof RxPreloadViewModel)) {
            return new RxPreloadViewModel();
        }
        var self = this;

        self.loadedFromJson = false;
        self.headerTitle_Txt = ko.observable("");
        self.authorizeButton_Txt = ko.observable("");
        self.declineButton_Txt = ko.observable("");
        self.bottomMiddleInstructions_Txt = ko.observable("");
        self.rxPreloadNotice_Txt = ko.observable("");

        RxPreloadViewModel.prototype.loadFromJSON = function loadFromJSON(select) {
            var protoSelf = this;

            protoSelf.headerTitle_Txt(select.HeaderTitle_Txt);
            protoSelf.authorizeButton_Txt(select.AuthorizeButton_Txt);
            protoSelf.declineButton_Txt(select.DeclineButton_Txt);
            protoSelf.bottomMiddleInstructions_Txt(select.BottomMiddleInstructions_Txt);
            protoSelf.rxPreloadNotice_Txt(select.RxPreloadNotice_Txt);

            return protoSelf;
        };
    };

    ns.RxPreloadConfirmViewModel = function RxPreloadConfirmViewModel() {
        if (!(this instanceof RxPreloadConfirmViewModel)) {
            return new RxPreloadConfirmViewModel();
        }
        var self = this;

        self.loadedFromJson = false;
        self.headerTitle_Txt = ko.observable("");
        self.declineButton_Txt = ko.observable("");
        self.goBackButton_Txt = ko.observable("");
        self.bottomMiddleInstructions_Txt = ko.observable("");
        self.rxPreloadConfirmNotice_Txt = ko.observable("");

        RxPreloadConfirmViewModel.prototype.loadFromJSON = function loadFromJSON(select) {
            var protoSelf = this;

            protoSelf.headerTitle_Txt(select.HeaderTitle_Txt);
            protoSelf.declineButton_Txt(select.DeclineButton_Txt);
            protoSelf.goBackButton_Txt(select.GoBackButton_Txt);
            protoSelf.bottomMiddleInstructions_Txt(select.BottomMiddleInstructions_Txt);
            protoSelf.rxPreloadConfirmNotice_Txt(select.RxPreloadConfirmNotice_Txt);

            return protoSelf;
        };
    };


} (EXCHANGE, this));