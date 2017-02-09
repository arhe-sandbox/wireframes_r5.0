(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");
    ns.internalDocsVM = function internalDocsVM() {
        var self = this;
        self.internalDocuments = ko.observableArray([]);
        self.AddDoc = function AddDoc(doc) {
            self.internalDocuments.push(doc);
        };
    };

    ns.RequestPlanDocumentsViewModel = function RequestPlanDocumentsViewModel() {
        if (!(this instanceof RequestPlanDocumentsViewModel)) {
            return new RequestPlanDocumentsViewModel();
        }

        var self = this;
        self.header_lbl = ko.observable("");
        self.title_lbl = ko.observable("");

        self.available_hdr = ko.observable("");
        self.available_desc = ko.observable("");
        self.viewOrDownload_text = ko.observable("");

        self.email_hdr = ko.observable("");
        self.email_desc = ko.observable("");
        self.emailBtn_lbl = ko.observable("");

        self.mail_hdr = ko.observable("");
        self.mail_desc = ko.observable("");
        self.mailBtn_lbl = ko.observable("");

        self.moreHelp_hdr = ko.observable("");
        self.moreHelp_desc = ko.observable("");

        self.back_btn = ko.observable("");
        self.bottom_desc = ko.observable("");

        self.plan = {};
        self.planDocuments = ko.observableArray([]);
        self.internalDocuments = ko.observable(new EXCHANGE.models.internalDocsVM());

        RequestPlanDocumentsViewModel.prototype.loadFromJSON = function loadFromJSON(planDocs) {
            var protoSelf = this;

            protoSelf.header_lbl(planDocs.Header_Lbl);
            protoSelf.title_lbl(planDocs.Title_Lbl);

            protoSelf.available_hdr(planDocs.Available_Hdr);
            protoSelf.available_desc(planDocs.Available_Desc);
            protoSelf.viewOrDownload_text(planDocs.ViewOrDownload_Text);

            protoSelf.email_hdr(planDocs.Email_Hdr);
            protoSelf.email_desc(planDocs.Email_Desc);
            protoSelf.emailBtn_lbl(planDocs.EmailBtn_Lbl);

            protoSelf.mail_hdr(planDocs.Mail_Hdr);
            protoSelf.mail_desc(planDocs.Mail_Desc);
            protoSelf.mailBtn_lbl(planDocs.MailBtn_Lbl);

            protoSelf.moreHelp_hdr(planDocs.MoreHelp_Hdr);
            protoSelf.moreHelp_desc(planDocs.MoreHelp_Desc);

            protoSelf.back_btn(planDocs.Back_Btn);
            protoSelf.bottom_desc(planDocs.Bottom_Desc);
            return protoSelf;
        };

        RequestPlanDocumentsViewModel.prototype.loadFromPlanViewModel = function loadFromPlanViewModel(planViewModel, planGuid) {
            var protoSelf = this;


            if (planViewModel.documents) {
                protoSelf.plan = planViewModel;
                // protoSelf.planDocuments(planViewModel.documents);
                protoSelf.loadFromPlanGuid(planViewModel.planGuid);
            }

            else if (planViewModel.planList) {// Check whether planList is available
                $.each(planViewModel.planList(), function (index, plan) {
                    if (plan.planGuid == planGuid) {
                        protoSelf.plan = plan;
                        // protoSelf.planDocuments(plan.documents);
                        protoSelf.loadFromComparePlanGuid(index, planGuid);
                    }
                });


            }
            return protoSelf;
        };

        RequestPlanDocumentsViewModel.prototype.loadFromPlanGuid = function loadFromPlanGuid(planGuid) {
            var protoSelf = this;
            if (app.viewModels.PlanDetailsViewModel && app.viewModels.PlanDetailsViewModel.plan && app.viewModels.PlanDetailsViewModel.plan.planGuid == planGuid) {
                protoSelf.plan = app.viewModels.PlanDetailsViewModel.plan;
                //            protoSelf.planDocuments(app.plans.AllPlanViewModels[planGuid].plan().documents);

                var documentsList = app.viewModels.PlanDetailsViewModel.plan.documents;
                var docs = [];
                if (documentsList == null) {
                    //
                } else {
                    protoSelf.internalDocuments(new EXCHANGE.models.internalDocsVM());
                    for (var i = 0; i < documentsList.length; i++) {
                        if (documentsList[i].InternalOnly === true) {
                            protoSelf.internalDocuments().AddDoc(documentsList[i]);
                        }
                        else {
                            docs.push(documentsList[i]);
                        }

                    }
                    $("#plandoc_acc").accordion({
                        heightStyle: "content"
                    });
                    protoSelf.planDocuments(docs);
                }
            } else if (app.viewModels.AncPlanDetailsViewModel && app.viewModels.AncPlanDetailsViewModel.plan && app.viewModels.AncPlanDetailsViewModel.plan.planGuid === planGuid) {
                protoSelf.plan = app.viewModels.AncPlanDetailsViewModel.plan;
                //            protoSelf.planDocuments(app.plans.AllPlanViewModels[planGuid].plan().documents);

                var documentsList = app.viewModels.AncPlanDetailsViewModel.plan.documents;
                var docs = [];
                if (documentsList == null) {
                    //
                } else {
                    protoSelf.internalDocuments(new EXCHANGE.models.internalDocsVM());
                    for (var i = 0; i < documentsList.length; i++) {
                        if (documentsList[i].InternalOnly === true) {
                            protoSelf.internalDocuments().AddDoc(documentsList[i]);
                        }
                        else {
                            docs.push(documentsList[i]);
                        }

                    }
                    $("#plandoc_acc").accordion({
                        heightStyle: "content"
                    });
                    protoSelf.planDocuments(docs);
                }
            }
            return protoSelf;
        };


        RequestPlanDocumentsViewModel.prototype.loadFromComparePlanGuid = function loadFromComparePlanGuid(index, planGuid) {
            var protoSelf = this;

            if (app.viewModels.ComparePlansViewModel.planList()[index].planGuid == planGuid) {

                protoSelf.plan = app.viewModels.ComparePlansViewModel.planList()[index].PlanDetailsVM.plan;

                var documentsList = app.viewModels.ComparePlansViewModel.planList()[index].PlanDetailsVM.plan.documents;
                var docs = [];
                if (documentsList == null) {
                    //
                } else {
                    protoSelf.internalDocuments(new EXCHANGE.models.internalDocsVM());
                    for (var i = 0; i < documentsList.length; i++) {
                        if (documentsList[i].InternalOnly === true) {
                            protoSelf.internalDocuments().AddDoc(documentsList[i]);
                        }
                        else {
                            docs.push(documentsList[i]);
                        }

                    }
                    $("#plandoc_acc").accordion({
                        heightStyle: "content"
                    });
                    protoSelf.planDocuments(docs);

                }
            }
            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));

(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");
    ns.RequestPlanDocumentsMailViewModel = function RequestPlanDocumentsMailViewModel() {
        if (!(this instanceof RequestPlanDocumentsMailViewModel)) {
            return new RequestPlanDocumentsMailViewModel();
        }
        var self = this;

        self.header_lbl = ko.observable('');
        self.innerHeader_text = ko.observable('');

        self.error_hdr = ko.observable('');
        self.error_desc = ko.observable('');

        self.name_lbl = ko.observable('');
        self.firstName_tip = ko.observable('');
        self.firstName_tb = ko.observable('');
        self.disableFirstName = ko.observable(false);
        self.lastName_tip = ko.observable('');
        self.lastName_tb = ko.observable('');
        self.disableLastName = ko.observable(false);

        self.phone_lbl = ko.observable('');
        self.phone_tb = ko.observable('');

        self.email_lbl = ko.observable('');
        self.email_tb = ko.observable('');

        self.privacy_text = ko.observable('');

        self.address_lbl = ko.observable('');
        self.address1_tb = ko.observable('');
        self.address2_tb = ko.observable('');

        self.city_lbl = ko.observable('');
        self.city_tb = ko.observable('');

        self.state_lbl = ko.observable('');
        self.stateList = ko.observableArray(['']);
        self.state = ko.observable('');
        self.selectOne_lbl = ko.observable('');

        self.zip_lbl = ko.observable('');
        self.zip_tb = ko.observable('');

        self.enterCounty_lbl = ko.observable('');
        self.countyId = ko.observable('');
        self.countyId_boundToSelectValue = ko.observable('');
        self.countyList = ko.observableArray([]);
        self.showCountyList = ko.computed({
            read: function () {
                if (self.countyList()) {
                    return self.countyList().length > 1;
                }
                else {
                    return false;
                }
            },
            owner: this,
            deferEvaluation: true
        });

        self.sendDocuments_lbl = ko.observable('');
        self.plan_lbl = ko.observable('');
        self.formattedPlan_lbl = ko.observable('');
        self.documents_lbl = ko.observable('');
        self.formattedDocuments_lbl = ko.observable('');

        self.disclaimer_text = ko.observable('');
        self.backBtn_text = ko.observable('');
        self.footer_text = ko.observable('');
        self.sendBtn_text = ko.observable('');

        self.inlineErrorsExist = ko.observable(false);
        self.inlineErrors = ko.observableArray([]);
        self.inlineErrorsWereSorry_lbl = ko.observable('');
        self.inlineErrorsBody_lbl = ko.observable('');

        RequestPlanDocumentsMailViewModel.prototype.loadFromJSON = function loadFromJSON(planDocsMail) {
            var protoSelf = this;

            protoSelf.header_lbl(planDocsMail.Header_Lbl);
            protoSelf.innerHeader_text(planDocsMail.InnerHeaderMail_Text);

            protoSelf.error_hdr(planDocsMail.Error_Hdr);
            protoSelf.error_desc(planDocsMail.Error_Desc);

            protoSelf.name_lbl(planDocsMail.Name_Lbl);
            protoSelf.firstName_tip(planDocsMail.FirstName_Tip);
            protoSelf.firstName_tb(planDocsMail.FirstName_Tb);
            protoSelf.disableFirstName(false);

            protoSelf.lastName_tip(planDocsMail.LastName_Tip);
            protoSelf.lastName_tb(planDocsMail.LastName_Tb);
            protoSelf.disableLastName(false);

            protoSelf.phone_lbl(planDocsMail.Phone_Lbl);
            protoSelf.phone_tb(app.functions.autoFormatPhoneNumber(planDocsMail.Phone_Tb));

            protoSelf.email_lbl(planDocsMail.Email_Lbl);
            protoSelf.email_tb(planDocsMail.Email_Tb);

            protoSelf.privacy_text(planDocsMail.Privacy_Text);

            protoSelf.address_lbl(planDocsMail.Address_Lbl);
            protoSelf.address1_tb(planDocsMail.Address1_Tb);
            protoSelf.address2_tb(planDocsMail.Address2_Tb);

            protoSelf.city_lbl(planDocsMail.City_Lbl);
            protoSelf.city_tb(planDocsMail.City_Tb);

            protoSelf.state_lbl(planDocsMail.State_Lbl);
            protoSelf.stateList(planDocsMail.StateList);
            protoSelf.state(planDocsMail.State);
            protoSelf.selectOne_lbl(planDocsMail.SelectOne_Lbl);

            protoSelf.zip_lbl(planDocsMail.Zip_Lbl);
            protoSelf.zip_tb(planDocsMail.Zip_Tb);

            protoSelf.enterCounty_lbl(planDocsMail.EnterCounty_Lbl);
            protoSelf.countyList(planDocsMail.CountyList);
            protoSelf.countyId(planDocsMail.CountyId);
            protoSelf.countyId_boundToSelectValue(planDocsMail.CountyId);

            protoSelf.sendDocuments_lbl(planDocsMail.SendDocuments_Lbl);
            protoSelf.plan_lbl(planDocsMail.Plan_Lbl);
            protoSelf.formattedPlan_lbl(self.plan_lbl() + '&nbsp;<strong>' + app.viewModels.RequestPlanDocumentsViewModel.plan.planName_lbl + '</strong>');
            protoSelf.documents_lbl(planDocsMail.Documents_Lbl);

            var formattedDocuments_lbl = self.documents_lbl();
            var documentsList = app.viewModels.RequestPlanDocumentsViewModel.planDocuments();
            if (documentsList == null) {
                protoSelf.formattedDocuments_lbl(formattedDocuments_lbl);
            } else {
                for (var i = 0; i < documentsList.length; i++) {
                    formattedDocuments_lbl += '<span>' + documentsList[i].DocumentTypeName + '</span>';
                }
                protoSelf.formattedDocuments_lbl(formattedDocuments_lbl);
            }

            protoSelf.disclaimer_text(planDocsMail.Disclaimer_Text);
            protoSelf.backBtn_text(planDocsMail.BackBtn_Text);
            protoSelf.footer_text(planDocsMail.Footer_Text);
            protoSelf.sendBtn_text(planDocsMail.SendBtn_Text);

            protoSelf.inlineErrorsWereSorry_lbl(planDocsMail.InlineErrorsWereSorry_lbl);
            protoSelf.inlineErrorsBody_lbl(planDocsMail.InlineErrorsBody_lbl);

            return protoSelf;
        };

        RequestPlanDocumentsMailViewModel.prototype.clearInlineErrors = function clearInlineErrors() {
            var protoSelf = this;

            protoSelf.inlineErrorsExist(false);
            protoSelf.inlineErrors([]);

            return protoSelf;
        };

        RequestPlanDocumentsMailViewModel.prototype.addInlineError = function addInlineError(inlineErrorStr) {
            var protoSelf = this;

            protoSelf.inlineErrorsExist(true);
            var errorList = protoSelf.inlineErrors();
            errorList.push(inlineErrorStr);
            protoSelf.inlineErrors(errorList);

            return protoSelf;
        };

        RequestPlanDocumentsMailViewModel.prototype.toJS = function toJS() {
            var protoSelf = this;
            var toReturn = {
                FirstName: protoSelf.firstName_tb(),
                LastName: protoSelf.lastName_tb(),
                Phone: protoSelf.phone_tb(),
                Email: protoSelf.email_tb(),
                Address1: protoSelf.address1_tb(),
                Address2: protoSelf.address2_tb(),
                City: protoSelf.city_tb(),
                State: protoSelf.state(),
                Zip: protoSelf.zip_tb(),
                County: protoSelf.countyId(),
                PlanId: app.viewModels.RequestPlanDocumentsViewModel.plan.planGuid
            };

            return toReturn;
        };

        return self;

    };
} (EXCHANGE));

(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");
    ns.RequestPlanDocumentsMailConfirmViewModel = function RequestPlanDocumentsMailConfirmViewModel() {
        if (!(this instanceof RequestPlanDocumentsMailConfirmViewModel)) {
            return new RequestPlanDocumentsMailConfirmViewModel();
        }
        var self = this;
        self.header_lbl = ko.observable("");
        self.innerHeader_text = ko.observable("");

        self.updateCommunication_lbl = ko.observable("");
        self.showUpdateCommunicationMessage = ko.observable("");

        self.address_lbl = ko.observable("");
        self.formattedAddress_lbl = ko.computed({
            read: function () {
                var firstName = app.viewModels.RequestPlanDocumentsMailViewModel.firstName_tb();
                var lastName = app.viewModels.RequestPlanDocumentsMailViewModel.lastName_tb();
                var address1 = app.viewModels.RequestPlanDocumentsMailViewModel.address1_tb();
                var address2 = app.viewModels.RequestPlanDocumentsMailViewModel.address2_tb();
                var city = app.viewModels.RequestPlanDocumentsMailViewModel.city_tb();
                var state = app.viewModels.RequestPlanDocumentsMailViewModel.state();
                var zip = app.viewModels.RequestPlanDocumentsMailViewModel.zip_tb();

                var formattedAddress = firstName + ' ' + lastName + '<br/>' + address1 + '<br/>';
                if (address2 != null && address2.length > 0) {
                    formattedAddress += address2 + '<br/>';
                }
                formattedAddress += city + ', ' + state + ' ' + zip;
                return formattedAddress;
            },
            owner: this,
            deferEvaluation: true
        });

        self.back_btn = ko.observable("");
        self.ok_btn = ko.observable("");

        RequestPlanDocumentsMailConfirmViewModel.prototype.loadFromJSON = function loadFromJSON(planDocs) {
            var protoSelf = this;

            protoSelf.header_lbl(planDocs.Header_Lbl);
            protoSelf.innerHeader_text(planDocs.InnerHeader_Text);

            protoSelf.updateCommunication_lbl(planDocs.UpdateCommunication_Lbl);
            protoSelf.showUpdateCommunicationMessage(planDocs.ShowUpdateCommunicationMessage);

            protoSelf.address_lbl(planDocs.Address_Lbl);

            protoSelf.ok_btn(planDocs.Ok_Btn);
            return protoSelf;
        };

        return self;

    };
} (EXCHANGE));

(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");
    ns.RequestPlanDocumentsEmailViewModel = function RequestPlanDocumentsEmailViewModel() {
        if (!(this instanceof RequestPlanDocumentsEmailViewModel)) {
            return new RequestPlanDocumentsEmailViewModel();
        }
        var self = this;

        self.header_lbl = ko.observable('');
        self.innerHeader_text = ko.observable('');

        self.error_hdr = ko.observable('');
        self.error_desc = ko.observable('');

        self.name_lbl = ko.observable('');
        self.firstName_tip = ko.observable('');
        self.firstName_tb = ko.observable('');
        self.disableFirstName = ko.observable(false);
        self.lastName_tip = ko.observable('');
        self.lastName_tb = ko.observable('');
        self.disableLastName = ko.observable(false);

        self.phone_lbl = ko.observable('');
        self.phone_tb = ko.observable('');

        self.email_lbl = ko.observable('');
        self.email_tb = ko.observable('');

        self.privacy_text = ko.observable('');

        self.zip_lbl = ko.observable('');
        self.zip_tb = ko.observable('');
        self.disabledZip = ko.observable(false);
        self.disabledZipOverride = ko.observable(false);

        self.selectOne_lbl = ko.observable('');
        self.enterCounty_lbl = ko.observable('');
        self.countyId = ko.observable('');
        self.countyId_boundToSelectValue = ko.observable('');
        self.countyList = ko.observableArray([]);
        self.showCountyList = ko.computed({
            read: function () {
                if (self.countyList()) {
                    return self.countyList().length > 1;
                }
                else {
                    return false;
                }
            },
            owner: this,
            deferEvaluation: true
        });
        self.disabledCounty = ko.observable(false);
        self.disabledCountyOverride = ko.observable(false);
        self.readonlyCountyName = ko.computed({
            read: function () {
                if (!self.disabledCounty()) return '';
                var countyList = self.countyList();
                if (countyList) {
                    for (var i = 0; i < countyList.length; i++) {
                        if (self.countyId() == countyList[i].Id) {
                            return countyList[i].CountyName;
                        }
                    }
                }
                return '';
            },
            deferEvaluation: true,
            owner: this
        });

        self.sendDocuments_lbl = ko.observable('');
        self.plan_lbl = ko.observable('');
        self.formattedPlan_lbl = ko.observable('');
        self.documents_lbl = ko.observable('');
        self.formattedDocuments_lbl = ko.observable('');

        self.disclaimer_text = ko.observable('');
        self.backBtn_text = ko.observable('');
        self.footer_text = ko.observable('');
        self.sendBtn_text = ko.observable('');

        self.inlineErrorsExist = ko.observable(false);
        self.inlineErrors = ko.observableArray([]);
        self.inlineErrorsWereSorry_lbl = ko.observable('');
        self.inlineErrorsBody_lbl = ko.observable('');

        RequestPlanDocumentsEmailViewModel.prototype.loadFromJSON = function loadFromJSON(planDocsEmail) {
            var protoSelf = this;

            protoSelf.header_lbl(planDocsEmail.Header_Lbl);
            protoSelf.innerHeader_text(planDocsEmail.InnerHeaderEmail_Text);

            protoSelf.error_hdr(planDocsEmail.Error_Hdr);
            protoSelf.error_desc(planDocsEmail.Error_Desc);

            protoSelf.name_lbl(planDocsEmail.Name_Lbl);
            protoSelf.firstName_tip(planDocsEmail.FirstName_Tip);
            protoSelf.firstName_tb(planDocsEmail.FirstName_Tb);
            protoSelf.disableFirstName(false);

            protoSelf.lastName_tip(planDocsEmail.LastName_Tip);
            protoSelf.lastName_tb(planDocsEmail.LastName_Tb);
            protoSelf.disableLastName(false);

            protoSelf.phone_lbl(planDocsEmail.Phone_Lbl);
            protoSelf.phone_tb(app.functions.autoFormatPhoneNumber(planDocsEmail.Phone_Tb));

            protoSelf.email_lbl(planDocsEmail.Email_Lbl);
            protoSelf.email_tb(planDocsEmail.Email_Tb);

            protoSelf.privacy_text(planDocsEmail.Privacy_Text);

            protoSelf.zip_lbl(planDocsEmail.Zip_Lbl);
            protoSelf.zip_tb(planDocsEmail.Zip_Tb);

            protoSelf.enterCounty_lbl(planDocsEmail.EnterCounty_Lbl);
            protoSelf.countyList(planDocsEmail.CountyList);
            protoSelf.countyId(planDocsEmail.CountyId);
            protoSelf.countyId_boundToSelectValue(planDocsEmail.CountyId);
            protoSelf.selectOne_lbl(planDocsEmail.SelectOne_Lbl);

            protoSelf.sendDocuments_lbl(planDocsEmail.SendDocuments_Lbl);
            protoSelf.plan_lbl(planDocsEmail.Plan_Lbl);
            protoSelf.formattedPlan_lbl(self.plan_lbl() + '&nbsp;<strong>' + app.viewModels.RequestPlanDocumentsViewModel.plan.planName_lbl + '</strong>');
            protoSelf.documents_lbl(planDocsEmail.Documents_Lbl);

            var formattedDocuments_lbl = self.documents_lbl();
            var documentsList = app.viewModels.RequestPlanDocumentsViewModel.planDocuments();
            if (documentsList == null) {
                protoSelf.formattedDocuments_lbl(formattedDocuments_lbl);
            } else {
                for (var i = 0; i < documentsList.length; i++) {
                    formattedDocuments_lbl += '<span>' + documentsList[i].DocumentTypeName + '</span>';
                }
                protoSelf.formattedDocuments_lbl(formattedDocuments_lbl);
            }

            protoSelf.disclaimer_text(planDocsEmail.Disclaimer_Text);
            protoSelf.backBtn_text(planDocsEmail.BackBtn_Text);
            protoSelf.footer_text(planDocsEmail.Footer_Text);
            protoSelf.sendBtn_text(planDocsEmail.SendBtn_Text);

            protoSelf.inlineErrorsWereSorry_lbl(planDocsEmail.InlineErrorsWereSorry_lbl);
            protoSelf.inlineErrorsBody_lbl(planDocsEmail.InlineErrorsBody_lbl);

            return protoSelf;
        };

        RequestPlanDocumentsEmailViewModel.prototype.clearInlineErrors = function clearInlineErrors() {
            var protoSelf = this;

            protoSelf.inlineErrorsExist(false);
            protoSelf.inlineErrors([]);

            return protoSelf;
        };

        RequestPlanDocumentsEmailViewModel.prototype.addInlineError = function addInlineError(inlineErrorStr) {
            var protoSelf = this;

            protoSelf.inlineErrorsExist(true);
            var errorList = protoSelf.inlineErrors();
            errorList.push(inlineErrorStr);
            protoSelf.inlineErrors(errorList);

            return protoSelf;
        };

        RequestPlanDocumentsEmailViewModel.prototype.toJS = function toJS() {
            var protoSelf = this;
            var toReturn = {
                FirstName: protoSelf.firstName_tb(),
                LastName: protoSelf.lastName_tb(),
                Phone: protoSelf.phone_tb(),
                Email: protoSelf.email_tb(),
                Zip: protoSelf.zip_tb(),
                County: protoSelf.countyId(),
                PlanId: app.viewModels.RequestPlanDocumentsViewModel.plan.planGuid
            };

            return toReturn;
        };

        return self;

    };
} (EXCHANGE));

(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");
    ns.RequestPlanDocumentsEmailConfirmViewModel = function RequestPlanDocumentsEmailConfirmViewModel() {
        if (!(this instanceof RequestPlanDocumentsEmailConfirmViewModel)) {
            return new RequestPlanDocumentsEmailConfirmViewModel();
        }
        var self = this;
        self.header_lbl = ko.observable("");

        self.emailAddress_lbl = ko.observable("");
        self.formattedEmailAddress_lbl = ko.computed({
            read: function () {
                return self.emailAddress_lbl() + ' ' + app.viewModels.RequestPlanDocumentsEmailViewModel.email_tb() + '.';
            },
            owner: this,
            deferEvaluation: true
        });
        self.junkMail_lbl = ko.observable("");
        self.updateCommunication_lbl = ko.observable("");
        self.showUpdateCommunicationMessage = ko.observable("");
        self.back_btn = ko.observable("");
        self.ok_btn = ko.observable("");

        RequestPlanDocumentsEmailConfirmViewModel.prototype.loadFromJSON = function loadFromJSON(planDocs) {
            var protoSelf = this;

            protoSelf.header_lbl(planDocs.Header_Lbl);

            protoSelf.emailAddress_lbl(planDocs.EmailAddress_Lbl);
            protoSelf.junkMail_lbl(planDocs.JunkMail_Lbl);
            protoSelf.updateCommunication_lbl(planDocs.UpdateCommunication_Lbl);
            protoSelf.showUpdateCommunicationMessage(planDocs.ShowUpdateCommunicationMessage);

            protoSelf.ok_btn(planDocs.Ok_Btn);
            return protoSelf;
        };

        return self;

    };
} (EXCHANGE));
