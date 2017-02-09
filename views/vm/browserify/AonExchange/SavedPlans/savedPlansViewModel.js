(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.SavedPlansViewModel = function SavedPlansViewModel() {
        if (!(this instanceof SavedPlansViewModel)) {
            return new SavedPlansViewModel();
        }
        var self = this;

        self.header_lbl = ko.observable('');

        self.currentTab = ko.observable(app.enums.TabIdEnum.MEDICAREADVANTAGE);
        self.threeTabOrder = ko.observable(app.exchangeContext.ExchangeContext.tabOrder());
        self.tabOrder = ko.computed({
            read: function() {
                var order = self.threeTabOrder();
                if (self.threeTabOrder() && self.threeTabOrder().length === 3) {
                    order.push(3);
                    order.push(4);
                }
                return order;
            },
            owner: this
        });
        self.currentTabIndex = ko.computed({
            read: function () {
                if (self.currentTab() == app.enums.TabIdEnum.MEDICAREADVANTAGE) {
                    for (var i = 0; i < self.tabOrder().length; i++) {
                        if (self.tabOrder()[i] == app.enums.TabEnum.MEDICAREADVANTAGE) {
                            return i;
                        }
                    }
                } else if (self.currentTab() == app.enums.TabIdEnum.PRESCRIPTIONDRUG) {
                    for (var i = 0; i < self.tabOrder().length; i++) {
                        if (self.tabOrder()[i] == app.enums.TabEnum.PRESCRIPTIONDRUG) {
                            return i;
                        }
                    }
                } else if (self.currentTab() == app.enums.TabIdEnum.MEDIGAP) {
                    for (var i = 0; i < self.tabOrder().length; i++) {
                        if (self.tabOrder()[i] == app.enums.TabEnum.MEDIGAP) {
                            return i;
                        }
                    }
                } else if (self.currentTab() == app.enums.PlanTypeNameEnum.DENTAL) {
                    for (var i = 0; i < self.tabOrder().length; i++) {
                        if (self.tabOrder()[i] == app.enums.PlanTypeEnum.DENTAL) {
                            return i;
                        }
                    }
                } else if (self.currentTab() == app.enums.PlanTypeNameEnum.VISION) {
                    for (var i = 0; i < self.tabOrder().length; i++) {
                        if (self.tabOrder()[i] == app.enums.PlanTypeEnum.VISION) {
                            return i;
                        }
                    }
                } else {
                    return 0;
                }
            },
            owner: this
        });

        self.currentTabPlanType = ko.computed({
            read: function () {
                if (self.currentTabIndex() != null && EXCHANGE.user.UserSession.SavedPlans.tabGroups().length === 5) {
                    var currentTabGroup = EXCHANGE.user.UserSession.SavedPlans.tabGroups()[self.currentTabIndex()];
                    if (currentTabGroup != null) {
                        var planType = currentTabGroup.planTypeID();
                        return planType;
                    }
                }
                else {
                    return 0;
                }
            },
            owner: this
        });

        self.medigapTabLbl = ko.computed({
            read: function () {
                return app.enums.PlanTypeNameEnum.MEDIGAP;
            },
            owner: this
        });
        self.medigapTabClass = ko.computed({
            read: function () {
                return app.enums.TabIdEnum.MEDIGAP;
            },
            owner: this
        });
        self.drugTabLbl = ko.computed({
            read: function () {
                return app.enums.PlanTypeNameEnum.PRESCRIPTIONDRUG;
            },
            owner: this
        });
        self.drugTabClass = ko.computed({
            read: function () {
                return app.enums.TabIdEnum.PRESCRIPTIONDRUG;
            },
            owner: this
        });
        self.advantageTabLbl = ko.computed({
            read: function () {
                return app.enums.PlanTypeNameEnum.MEDICAREADVANTAGE;
            },
            owner: this
        });
        self.advantageTabClass = ko.computed({
            read: function () {
                return app.enums.TabIdEnum.MEDICAREADVANTAGE;
            },
            owner: this
        });
        self.dentalTabLbl = ko.computed({
            read: function () {
                return app.enums.PlanTypeNameEnum.DENTAL;
            },
            owner: this
        });
        self.dentalTabClass = ko.computed({
            read: function () {
                return app.enums.PlanTypeNameEnum.DENTAL;
            },
            owner: this
        });
        self.visionTabLbl = ko.computed({
            read: function () {
                return app.enums.PlanTypeNameEnum.VISION;
            },
            owner: this
        });
        self.visionTabClass = ko.computed({
            read: function () {
                return app.enums.PlanTypeNameEnum.VISION;
            },
            owner: this
        });
        self.tab0Lbl = ko.computed({
            read: function () {
                if (self.tabOrder()[0] == app.enums.TabEnum.MEDIGAP) {
                    return self.medigapTabLbl();
                } else if (self.tabOrder()[0] == app.enums.TabEnum.PRESCRIPTIONDRUG) {
                    return self.drugTabLbl();
                } else if (self.tabOrder()[0] == app.enums.TabEnum.MEDICAREADVANTAGE) {
                    return self.advantageTabLbl();
                } else if (self.tabOrder()[0] == app.enums.PlanTypeEnum.DENTAL) {
                    return self.dentalTabLbl();
                } else if (self.tabOrder()[0] == app.enums.PlanTypeEnum.VISION) {
                    return self.visionTabLbl();
                }
            },
            owner: this
        });
        self.tab0Class = ko.computed({
            read: function () {
                if (self.tabOrder()[0] == app.enums.TabEnum.MEDIGAP) {
                    return self.medigapTabClass();
                } else if (self.tabOrder()[0] == app.enums.TabEnum.PRESCRIPTIONDRUG) {
                    return self.drugTabClass();
                } else if (self.tabOrder()[0] == app.enums.TabEnum.MEDICAREADVANTAGE) {
                    return self.advantageTabClass();
                } else if (self.tabOrder()[0] == app.enums.PlanTypeEnum.DENTAL) {
                    return self.dentalTabClass();
                } else if (self.tabOrder()[0] == app.enums.PlanTypeEnum.VISION) {
                    return self.visionTabClass();
                }
            },
            owner: this
        });
        self.tab0PlanVMs = ko.computed({
            read: function () {

                var plans = [];
                if (app.user.UserSession.SavedPlans && app.user.UserSession.SavedPlans.plans()) {
                    var plan = app.user.UserSession.SavedPlans.plans().find(function (element) {
                        if (element.planType == 0) {
                            plans.push(element);
                            return false;
                        }
                        else {
                            return false;
                        }
                    });

                    /*
                    if (plan) {     //&& plan.Plan) {
                    var planSRVM = new EXCHANGE.models.PlanSearchResultsViewModel();
                    planVm = planSRVM.loadFromPlanDomainEntity(plan);

                    //plans.push(planVm);
                    plans.push(plan);
                    }
                    */

                }
                return plans;
            },
            owner: this
        });
        self.tab0Count = ko.computed({
            read: function () {
                if (self.tab0PlanVMs && self.tab0PlanVMs())
                    return self.tab0PlanVMs().length;
                else
                    return 0;
            },
            owner: this
        });
        self.tab1Lbl = ko.computed({
            read: function () {
                if (self.tabOrder()[1] == app.enums.TabEnum.MEDIGAP) {
                    return self.medigapTabLbl();
                } else if (self.tabOrder()[1] == app.enums.TabEnum.PRESCRIPTIONDRUG) {
                    return self.drugTabLbl();
                } else if (self.tabOrder()[1] == app.enums.TabEnum.MEDICAREADVANTAGE) {
                    return self.advantageTabLbl();
                } else if (self.tabOrder()[1] == app.enums.PlanTypeEnum.DENTAL) {
                    return self.dentalTabLbl();
                } else if (self.tabOrder()[1] == app.enums.PlanTypeEnum.VISION) {
                    return self.visionTabLbl();
                }
            },
            owner: this
        });
        self.tab1Class = ko.computed({
            read: function () {
                if (self.tabOrder()[1] == app.enums.TabEnum.MEDIGAP) {
                    return self.medigapTabClass();
                } else if (self.tabOrder()[1] == app.enums.TabEnum.PRESCRIPTIONDRUG) {
                    return self.drugTabClass();
                } else if (self.tabOrder()[1] == app.enums.TabEnum.MEDICAREADVANTAGE) {
                    return self.advantageTabClass();
                } else if (self.tabOrder()[1] == app.enums.PlanTypeEnum.DENTAL) {
                    return self.dentalTabClass();
                } else if (self.tabOrder()[1] == app.enums.PlanTypeEnum.VISION) {
                    return self.visionTabClass();
                }
            },
            owner: this
        });
        self.tab1PlanVMs = ko.computed({
            read: function () {

                var plans = [];
                if (app.user.UserSession.SavedPlans && app.user.UserSession.SavedPlans.plans()) {
                    var plan = app.user.UserSession.SavedPlans.plans().find(function (element) {
                        if (element.planType == 2) {
                            plans.push(element);
                            return false;
                        }
                        else {
                            return false;
                        }
                    });

                }

                return plans;
            },
            owner: this
        });
        self.tab1Count = ko.computed({
            read: function () {
                if (self.tab1PlanVMs && self.tab1PlanVMs())
                    return self.tab1PlanVMs().length;
                else
                    return 0;
            },
            owner: this
        });
        self.tab2Lbl = ko.computed({
            read: function () {
                if (self.tabOrder()[2] == app.enums.TabEnum.MEDIGAP) {
                    return self.medigapTabLbl();
                } else if (self.tabOrder()[2] == app.enums.TabEnum.PRESCRIPTIONDRUG) {
                    return self.drugTabLbl();
                } else if (self.tabOrder()[2] == app.enums.TabEnum.MEDICAREADVANTAGE) {
                    return self.advantageTabLbl();
                } else if (self.tabOrder()[2] == app.enums.PlanTypeEnum.DENTAL) {
                    return self.dentalTabLbl();
                } else if (self.tabOrder()[2] == app.enums.PlanTypeEnum.VISION) {
                    return self.visionTabLbl();
                }
            },
            owner: this
        });
        self.tab2Class = ko.computed({
            read: function () {
                if (self.tabOrder()[2] == app.enums.TabEnum.MEDIGAP) {
                    return self.medigapTabClass();
                } else if (self.tabOrder()[2] == app.enums.TabEnum.PRESCRIPTIONDRUG) {
                    return self.drugTabClass();
                } else if (self.tabOrder()[2] == app.enums.TabEnum.MEDICAREADVANTAGE) {
                    return self.advantageTabClass();
                } else if (self.tabOrder()[2] == app.enums.PlanTypeEnum.DENTAL) {
                    return self.dentalTabClass();
                } else if (self.tabOrder()[2] == app.enums.PlanTypeEnum.VISION) {
                    return self.visionTabClass();
                }
            },
            owner: this
        });
        self.tab2PlanVMs = ko.computed({
            read: function () {

                var plans = [];
                if (app.user.UserSession.SavedPlans && app.user.UserSession.SavedPlans.plans()) {
                    var plan = app.user.UserSession.SavedPlans.plans().find(function (element) {
                        if (element.planType == 1) {
                            plans.push(element);
                            return false;
                        }
                        else {
                            return false;
                        }
                    });

                }

                return plans;
            },
            owner: this
        });
        self.tab2Count = ko.computed({
            read: function () {
                if (self.tab2PlanVMs && self.tab2PlanVMs())
                    return self.tab2PlanVMs().length;
                else
                    return 0;
            },
            owner: this
        });


        self.tab3Lbl = ko.computed({
            read: function () {
                if (self.tabOrder()[3] == app.enums.TabEnum.MEDIGAP) {
                    return self.medigapTabLbl();
                } else if (self.tabOrder()[3] == app.enums.TabEnum.PRESCRIPTIONDRUG) {
                    return self.drugTabLbl();
                } else if (self.tabOrder()[3] == app.enums.TabEnum.MEDICAREADVANTAGE) {
                    return self.advantageTabLbl();
                } else if (self.tabOrder()[3] == app.enums.PlanTypeEnum.DENTAL) {
                    return self.dentalTabLbl();
                } else if (self.tabOrder()[3] == app.enums.PlanTypeEnum.VISION) {
                    return self.visionTabLbl();
                }
            },
            owner: this
        });
        self.tab3Class = ko.computed({
            read: function () {
                if (self.tabOrder()[3] == app.enums.TabEnum.MEDIGAP) {
                    return self.medigapTabClass();
                } else if (self.tabOrder()[3] == app.enums.TabEnum.PRESCRIPTIONDRUG) {
                    return self.drugTabClass();
                } else if (self.tabOrder()[3] == app.enums.TabEnum.MEDICAREADVANTAGE) {
                    return self.advantageTabClass();
                } else if (self.tabOrder()[3] == app.enums.PlanTypeEnum.DENTAL) {
                    return self.dentalTabClass();
                } else if (self.tabOrder()[3] == app.enums.PlanTypeEnum.VISION) {
                    return self.visionTabClass();
                }
            },
            owner: this
        });
        self.tab3PlanVMs = ko.computed({
            read: function () {
                var plans = [];
                if (app.user.UserSession.SavedPlans && app.user.UserSession.SavedPlans.plans()) {
                    var plan = app.user.UserSession.SavedPlans.plans().find(function (element) {
                        if (element.planType == 3) {
                            plans.push(element);
                            return false;
                        }
                        else {
                            return false;
                        }
                    });
                }
                return plans;
            },
            owner: this
        });
        self.tab3Count = ko.computed({
            read: function () {
                if (self.tab3PlanVMs && self.tab3PlanVMs())
                    return self.tab3PlanVMs().length;
                else
                    return 0;
            },
            owner: this
        });

        self.tab4Lbl = ko.computed({
            read: function () {
                if (self.tabOrder()[4] == app.enums.TabEnum.MEDIGAP) {
                    return self.medigapTabLbl();
                } else if (self.tabOrder()[4] == app.enums.TabEnum.PRESCRIPTIONDRUG) {
                    return self.drugTabLbl();
                } else if (self.tabOrder()[4] == app.enums.TabEnum.MEDICAREADVANTAGE) {
                    return self.advantageTabLbl();
                } else if (self.tabOrder()[4] == app.enums.PlanTypeEnum.DENTAL) {
                    return self.dentalTabLbl();
                } else if (self.tabOrder()[4] == app.enums.PlanTypeEnum.VISION) {
                    return self.visionTabLbl();
                }
            },
            owner: this
        });
        self.tab4Class = ko.computed({
            read: function () {
                if (self.tabOrder()[4] == app.enums.TabEnum.MEDIGAP) {
                    return self.medigapTabClass();
                } else if (self.tabOrder()[4] == app.enums.TabEnum.PRESCRIPTIONDRUG) {
                    return self.drugTabClass();
                } else if (self.tabOrder()[4] == app.enums.TabEnum.MEDICAREADVANTAGE) {
                    return self.advantageTabClass();
                } else if (self.tabOrder()[4] == app.enums.PlanTypeEnum.DENTAL) {
                    return self.dentalTabClass();
                } else if (self.tabOrder()[4] == app.enums.PlanTypeEnum.VISION) {
                    return self.visionTabClass();
                }
            },
            owner: this
        });
        self.tab4PlanVMs = ko.computed({
            read: function () {
                var plans = [];
                if (app.user.UserSession.SavedPlans && app.user.UserSession.SavedPlans.plans()) {
                    var plan = app.user.UserSession.SavedPlans.plans().find(function (element) {
                        if (element.planType == 4) {
                            plans.push(element);
                            return false;
                        }
                        else {
                            return false;
                        }
                    });
                }
                return plans;
            },
            owner: this
        });
        self.tab4Count = ko.computed({
            read: function () {
                if (self.tab4PlanVMs && self.tab4PlanVMs())
                    return self.tab4PlanVMs().length;
                else
                    return 0;
            },
            owner: this
        });

        self.aboutHeader_lbl = ko.observable('');
        self.planremoved_lbl = ko.observable('');
        self.showPlanremovedtext = ko.observable('');
        self.aboutBody_lbl = ko.observable('');
        self.planDetailsHeader_lbl = ko.observable('');
        self.planDetailsBody_lbl = ko.observable('');
        self.compareHeader_lbl = ko.observable('');
        self.compareBody = ko.observable('');
        self.compareBody_lbl = ko.computed({
            read: function () {
                var text = self.compareBody();
                var compareLength;
                if (self.currentTabIndex() == 0) {
                    if (self.tab0PlanVMs && self.tab0PlanVMs() && self.tab0PlanVMs().length > 0) {
                        compareLength = EXCHANGE.plans.getComparedPlansCount(self.tab0PlanVMs()[0].planType);
                        return text.format(compareLength, self.tab0Lbl());
                    }
                    return text.format(0, self.tab0Lbl());
                } else if (self.currentTabIndex() == 1) {
                    if (self.tab1PlanVMs && self.tab1PlanVMs() && self.tab1PlanVMs().length > 0) {
                        compareLength = EXCHANGE.plans.getComparedPlansCount(self.tab1PlanVMs()[0].planType);
                        return text.format(compareLength, self.tab1Lbl());
                    }
                    return text.format(0, self.tab1Lbl());
                } else if (self.currentTabIndex() == 2) {
                    if (self.tab2PlanVMs && self.tab2PlanVMs() && self.tab2PlanVMs().length > 0) {
                        compareLength = EXCHANGE.plans.getComparedPlansCount(self.tab2PlanVMs()[0].planType);
                        return text.format(compareLength, self.tab2Lbl());
                    }
                    return text.format(0, self.tab2Lbl());
                } else if (self.currentTabIndex() == 3) {
                    if (self.tab3PlanVMs && self.tab3PlanVMs() && self.tab3PlanVMs().length > 0) {
                        compareLength = EXCHANGE.plans.getComparedPlansCount(self.tab3PlanVMs()[0].planType);
                        return text.format(compareLength, self.tab3Lbl());
                    }
                    return text.format(0, self.tab3Lbl());
                } else if (self.currentTabIndex() == 4) {
                    if (self.tab4PlanVMs && self.tab4PlanVMs() && self.tab4PlanVMs().length > 0) {
                        compareLength = EXCHANGE.plans.getComparedPlansCount(self.tab4PlanVMs()[0].planType);
                        return text.format(compareLength, self.tab4Lbl());
                    }
                    return text.format(0, self.tab4Lbl());
                }
                return text;
            }, owner: this
        });
        self.compareShow_lbl = ko.observable('');
        self.backBtn_lbl = ko.observable('');
        self.bottomBar_lbl = ko.observable('');
        self.compareBtn_lbl = ko.observable('');
        self.showComparisonLinks = ko.computed({
            read: function () {
                if (self.currentTabIndex() == 0) {
                    if (self.tab0PlanVMs && self.tab0PlanVMs() && self.tab0PlanVMs().length > 0) {
                        return true;
                    }
                } else if (self.currentTabIndex() == 1) {
                    if (self.tab1PlanVMs && self.tab1PlanVMs() && self.tab1PlanVMs().length > 0) {
                        return true;
                    }
                } else if (self.currentTabIndex() == 2) {
                    if (self.tab2PlanVMs && self.tab2PlanVMs() && self.tab2PlanVMs().length > 0) {
                        return true;
                    }
                } else if (self.currentTabIndex() == 3) {
                    if (self.tab3PlanVMs && self.tab3PlanVMs() && self.tab3PlanVMs().length > 0) {
                        return true;
                    }
                } else if (self.currentTabIndex() == 4) {
                    if (self.tab4PlanVMs && self.tab4PlanVMs() && self.tab4PlanVMs().length > 0) {
                        return true;
                    }
                }
                return false;
            }, owner: this
        });


        SavedPlansViewModel.prototype.loadFromJSON = function loadFromJSON(saved) {
            var protoSelf = this;

            protoSelf.threeTabOrder(app.exchangeContext.ExchangeContext.tabOrder());

            protoSelf.header_lbl(saved.Header_Lbl);
            protoSelf.aboutHeader_lbl(saved.AboutHeader_Lbl);
            protoSelf.planremoved_lbl(saved.Planremoved_lbl);
            protoSelf.showPlanremovedtext(saved.ShowPlanremovedtext);
            protoSelf.aboutBody_lbl(saved.AboutBody_Lbl);
            protoSelf.planDetailsHeader_lbl(saved.PlanDetailsHeader_Lbl);
            protoSelf.planDetailsBody_lbl(saved.PlanDetailsBody_Lbl);
            protoSelf.compareHeader_lbl(saved.CompareHeader_Lbl);
            protoSelf.compareBody(saved.CompareBody_Lbl);
            protoSelf.compareShow_lbl(saved.CompareShow_Lbl);
            protoSelf.backBtn_lbl(saved.BackBtn_Lbl);
            protoSelf.bottomBar_lbl(saved.BottomBar_Lbl);
            protoSelf.compareBtn_lbl(saved.CompareBtn_Lbl);

            return protoSelf;
        };

        return self;
    };

})(EXCHANGE);
