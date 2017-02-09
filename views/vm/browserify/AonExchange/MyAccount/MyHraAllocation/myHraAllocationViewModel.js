(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.MyHraAllocationViewModel = function MyHraAllocationViewModel() {
        if (!(this instanceof MyHraAllocationViewModel)) {
            return new MyHraAllocationViewModel();
        }
        var self = this;
        self.Primary = ko.observable("");
        self.dynamicsId = ko.observable("");
        self.isPre65 = ko.observable(false);
        self.HraAllocations = ko.observableArray([]);
        self.MyHraAllocation_Hdr = ko.observable("");
        self.Title_Lbl = ko.observable("");
        self.Body_lbl = ko.observable("");
        self.ManageAccount_Lbl = ko.observable("");
        self.IsAgentAccess = ko.observable("");
        self.AgentAccess_Lbl = ko.observable("");

        self.DistinctHraAllocations = ko.computed({
            read: function () {
                var distinct = [];
                var clients = [];
                var hraArray = self.HraAllocations();
                var found;
                var clt_bak = "";

                for (var i = 0; i < hraArray.length; i++) {
                    if (hraArray[i].HraGroup === 2 || hraArray[i].HraGroup === 1) {
                        if (hraArray[i].ShowSSOLink && hraArray[i].ShowSSOLink === true) {
                            if (hraArray[i].ClientName != clt_bak) {
                                if (hraArray[i].OwnerId == self.dynamicsId()) {
                                    distinct.push(hraArray[i]);
                                    clt_bak = hraArray[i].ClientName;
                                }
                            }

                        }
                    }

                }

                //if (($.inArray(hraArray[i].ClientName, distinct)) == -1) {
                //    distinct.push(hraArray[i]);
                //}



                return distinct;
            },
            owner: this,
            deferEvaluation: true
        });
        self.MedicareHraAllocations = ko.computed({
            read: function () {
                var distinct = [];
                var hraArray = self.HraAllocations();
                var found;
                for (var i = 0; i < hraArray.length; i++) {
                    if (hraArray[i].HraGroup === 1) {
                        distinct.push(hraArray[i]);
                    }

                }

                return distinct;
            },
            owner: this,
            deferEvaluation: true
        });
        self.FamilyHraAllocations = ko.computed({
            read: function () {
                var distinct = [];
                var hraArray = self.HraAllocations();
                var found;
                for (var i = 0; i < hraArray.length; i++) {
                    if (hraArray[i].HraGroup === 2) {
                        distinct.push(hraArray[i]);
                        //if (($.inArray(hraArray[i].ClientName, distinct)) == -1) {
                        //    distinct.push(hraArray[i]);
                    }

                }

                return distinct;
            },
            owner: this,
            deferEvaluation: true
        });

        self.FamilyHraTotal = ko.computed({
            read: function () {
                var distinct = [];
                var hraArray = self.HraAllocations();
                var found;
                for (var i = 0; i < hraArray.length; i++) {
                    if (hraArray[i].HraGroup === 3) {
                        distinct.push(hraArray[i]);
                        //if (($.inArray(hraArray[i].ClientName, distinct)) == -1) {
                        //    distinct.push(hraArray[i]);
                    }

                }

                return distinct;
            },
            owner: this,
            deferEvaluation: true
        });

        MyHraAllocationViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;
            protoSelf.Primary(app.user.UserSession.UserProfile.firstName + ' ' + app.user.UserSession.UserProfile.lastName);
            protoSelf.dynamicsId(app.user.UserSession.UserProfile.dynamicsId);
            protoSelf.isPre65(app.user.UserSession.UserProfile.isPre65());
            protoSelf.HraAllocations(viewModel.HraAllocations);
            protoSelf.MyHraAllocation_Hdr(viewModel.MyHraAllocation_Hdr);
            protoSelf.Title_Lbl(viewModel.Title_Lbl);
            protoSelf.Body_lbl(viewModel.Body_lbl);
            protoSelf.ManageAccount_Lbl(viewModel.ManageAccount_Lbl + " <span class='popup'></span>");
            protoSelf.IsAgentAccess(viewModel.IsAgentAccess);
            protoSelf.AgentAccess_Lbl(viewModel.AgentAccess_Lbl);

            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));