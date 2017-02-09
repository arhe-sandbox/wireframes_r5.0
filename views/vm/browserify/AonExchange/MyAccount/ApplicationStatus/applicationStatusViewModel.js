(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.ApplicationStatusViewModel = function ApplicationStatusViewModel() {
        if (!(this instanceof ApplicationStatusViewModel)) {
            return new ApplicationStatusViewModel();
        }
        var self = this;

        self.CreateAccountAuthViewModel = new app.models.CreateAccountAuthViewModel();

        self.needYourAttention_Lbl = ko.observable("");
        self.isSso = ko.observable(false);
        self.actionRequired = ko.observable(false);
        self.doneLoading = ko.observable(false);
        self.enrollments = ko.observableArray([]);
        self.actionRequired_lbl = ko.observable("");

        self.stepOneNotDoneWet_text = ko.observable("");
        self.stepOneNotDoneVoice_text = ko.observable("");
        self.stepOneNotDoneElectronic_text = ko.observable("");
        self.submitThunderhead_desc = ko.observable("");
        self.submitThunderhead_firstInst = ko.observable("");
        self.outstandingWet_desc = ko.observable("");
        self.outstandingWet_descAfterDocAvail = ko.observable("");
        self.outstandingWet_descAfterDocExpired = ko.observable("");
        self.outstandingWet_docExpired = ko.observable("");
        self.outstandingWet_firstInst_Prefilled = ko.observable("");
        self.outstandingWet_firstInst_Blank = ko.observable("");
        self.printNow_btn = ko.observable("");
        self.outstandingWet_secondInst = ko.observable("");
        self.outstandingWet_thirdInst = ko.observable("");
        self.wetSignatureScript_text = ko.observable("");
        self.wetSignatureScriptMail_text = ko.observable("");
        self.wetSignatureScriptEMail_text = ko.observable("");

        self.outstandingVoice_desc = ko.observable("");
        self.outstandingVoice_firstInst = ko.observable("");
        self.outstandingVoice_secondInst = ko.observable("");
        self.outstandingVoice_thirdInst = ko.observable("");
        self.voiceSignatureScript_text = ko.observable("");

        self.SecondDesc = ko.observable("");
        self.FirstDesc = ko.observable("");
        self.FirstInst_Text = ko.observable("");
        self.SecondInst_Text = ko.observable("");
        self.Title_Text = ko.observable("");

        self.stepOneDone_text = ko.observable("");
        self.stepOneDone_desc = ko.observable("");

        self.stepTwoNotDone_text = ko.observable("");
        self.stepTwoNotDone_desc = ko.observable("");

        self.stepTwoDone_text = ko.observable("");
        self.stepTwoDone_desc = ko.observable("");

        self.stepThreeNotDone_text = ko.observable("");
        self.stepThreeNotDoneEmailParagraph = ko.observable("");
        self.stepThreeNotDoneRest = ko.observable("");

        self.incomplete_hdr = ko.observable("");
        self.incomplete_subHdr = ko.observable("");
        self.incomplete_desc = ko.observable("");

        self.denied_hdr = ko.observable("");
        self.denied_subHdr = ko.observable("");
        self.denied_desc = ko.observable("");

        self.enrolled_hdr = ko.observable("");
        self.enrolled_desc = ko.observable("");

        self.planDetails_lbl = ko.observable("");
        self.contactInfo_lbl = ko.observable("");
        self.doctorFinder_lbl = ko.observable("");
        self.printTempIds_lbl = ko.observable("");
        self.signatureType = ko.observable("");
        self.effective_lbl = ko.observable("");
        self.appNmb_lbl = ko.observable("");
        self.page_title = ko.observable("");
        self.ApplicationStatus = ko.observable("");
        self.outstandingWet_docExpiredFormatted = ko.computed({
            read: function () {
                var format = "";
                if (app.viewModels.LoginHeaderViewModel && app.viewModels.LoginHeaderViewModel.phoneNumberHtml) {
                    format += self.outstandingWet_docExpired().format(app.viewModels.LoginHeaderViewModel.phoneNumberHtml());
                }
                return format;
            },
            owner: this,
            deferEvaluation: true
        });

        self.stepThreeNotDone_desc = ko.computed({
            read: function () {
                var desc = "";
                if (app.user && app.user.UserSession && app.user.UserSession.UserProfile && app.user.UserSession.UserProfile.email && app.user.UserSession.UserProfile.email.length != 0) {
                    desc += self.stepThreeNotDoneEmailParagraph().format(app.user.UserSession.UserProfile.email);
                }

                desc += self.stepThreeNotDoneRest();

                return desc;
            },
            owner: this,
            deferEvaluation: true
        });

        self.statusTemplateName = function (enrollment) {
            switch (enrollment.Status) {
                case app.enums.ApplicationStatusEnum.IncompleteAtInsurer:
                    return app.enums.ApplicationStatusEnumName.IncompleteAtInsurer;
                case app.enums.ApplicationStatusEnum.Denied:
                    return app.enums.ApplicationStatusEnumName.Denied;
                case app.enums.ApplicationStatusEnum.DisEnrolled:
                    return app.enums.ApplicationStatusEnumName.DisEnrolled;
                case app.enums.ApplicationStatusEnum.Enrolled:
                    return app.enums.ApplicationStatusEnumName.Enrolled;
                case app.enums.ApplicationStatusEnum.OutstandingAtCustomer:
                    {
                        self.ApplicationStatus = app.enums.ApplicationStatusEnumName.OutstandingAtCustomer;
                        return app.enums.ApplicationStatusEnumName.OutstandingAtCustomer + self.getSignatureTypeName(enrollment.SignatureType); ;
                    }
                case app.enums.ApplicationStatusEnum.ReceivedAtAgency:
                    return app.enums.ApplicationStatusEnumName.ReceivedAtAgency;
                case app.enums.ApplicationStatusEnum.ReceivedByInsurer:
                    return app.enums.ApplicationStatusEnumName.ReceivedByInsurer;
                case app.enums.ApplicationStatusEnum.ReceivedFromThunderhead:
                    return app.enums.ApplicationStatusEnumName.ReceivedFromThunderhead;
                case app.enums.ApplicationStatusEnum.SubmittedToInsurer:
                    return app.enums.ApplicationStatusEnumName.SubmittedToInsurer;
                case app.enums.ApplicationStatusEnum.SubmittedToThunderhead:
                    return app.enums.ApplicationStatusEnumName.SubmittedToThunderhead + self.getSignatureTypeName(enrollment.SignatureType);
                case app.enums.ApplicationStatusEnum.IncompleteAtAgency:
                    return app.enums.ApplicationStatusEnumName.IncompleteAtAgency;
                case app.enums.ApplicationStatusEnum.VerifiedByAgency:
                    {
                        self.ApplicationStatus = app.enums.ApplicationStatusEnumName.VerifiedByAgency;
                        self.getSignatureTypeName(enrollment.SignatureType);
                        return app.enums.ApplicationStatusEnumName.VerifiedByAgency;
                    }
                case app.enums.ApplicationStatusEnum.ReadyToSend:
                    return app.enums.ApplicationStatusEnumName.ReadyToSend + self.getSignatureTypeName(enrollment.SignatureType);
                case app.enums.ApplicationStatusEnum.Error:
                    return app.enums.ApplicationStatusEnumName.Error;
                case app.enums.ApplicationStatusEnum.SubmittedToInsurerIncomplete:
                    return app.enums.ApplicationStatusEnumName.SubmittedToInsurerIncomplete;
                case app.enums.ApplicationStatusEnum.VerifiedByAgencyIncomplete:
                    return app.enums.ApplicationStatusEnumName.VerifiedByAgencyIncomplete;
                default:
                    return "statusTemplate";
            }
        };

        self.getSignatureTypeName = function (sigType) {
            switch (sigType) {
                case app.enums.SignatureTypeEnum.Voice:
                    {
                        self.signatureType = app.enums.SignatureTypeEnumName.Voice;
                    return app.enums.SignatureTypeEnumName.Voice;
                }
                case app.enums.SignatureTypeEnum.Wet:
                    return app.enums.SignatureTypeEnumName.Wet;
                case app.enums.SignatureTypeEnum.Electronic:
                    {
                        self.signatureType = app.enums.SignatureTypeEnumName.Electronic;
                    return app.enums.SignatureTypeEnumName.Electronic;
                }
                default:
                    return "";
            }
        };

        self.stepTwoDisplay = function stepTwoDisplay(status) {
            return (status !== app.enums.ApplicationStatusEnum.ReceivedAtAgency) ? "display: none;" : "";
        };

        self.stepThreeDisplay = function stepThreeDisplay(status) {
            return (status !== app.enums.ApplicationStatusEnum.SubmittedToInsurer && status !== app.enums.ApplicationStatusEnum.ReceivedByInsurer) ? "display: none;" : "";
        };

        ApplicationStatusViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.needYourAttention_Lbl(viewModel.NeedYourAttention_Lbl);
            protoSelf.isSso(viewModel.IsSso);
            if (EXCHANGE.viewModels.Pre65AccountMyCoverageViewModel !== undefined) {
                var pnd_enrollments = [];
                for (i = 0; i < viewModel.Enrollments.length; i++) {
                    if (viewModel.Enrollments[i].Status != app.enums.ApplicationStatusEnum.Enrolled)
                        pnd_enrollments.push(viewModel.Enrollments[i]);
                }
                protoSelf.enrollments(pnd_enrollments);
            }
            else {
                protoSelf.enrollments(viewModel.Enrollments);
            }
            protoSelf.actionRequired(viewModel.ActionRequired);

            protoSelf.actionRequired_lbl(viewModel.ActionRequired_Lbl);

            protoSelf.stepOneNotDoneWet_text(viewModel.StepOneNotDoneWet_Text);
            protoSelf.stepOneNotDoneVoice_text(viewModel.StepOneNotDoneVoice_Text);
            protoSelf.stepOneNotDoneElectronic_text(viewModel.StepOneNotDoneElectronic_Text);
            //VerifiedByAgency
            protoSelf.SecondDesc(viewModel.SecondDesc);
            protoSelf.FirstDesc(viewModel.FirstDesc);
            protoSelf.FirstInst_Text(viewModel.FirstInst);
            protoSelf.SecondInst_Text(viewModel.SecondInst);
            protoSelf.Title_Text(viewModel.Title);

            protoSelf.submitThunderhead_desc(viewModel.SubmitThunderhead_Desc);
            protoSelf.submitThunderhead_firstInst(viewModel.SubmitThunderhead_FirstInst);
            protoSelf.outstandingWet_desc(viewModel.OutstandingWet_Desc);
            protoSelf.outstandingWet_descAfterDocAvail(viewModel.OutstandingWet_DescAfterDocAvail);
            protoSelf.outstandingWet_descAfterDocExpired(viewModel.OutstandingWet_DescAfterDocExpired);
            protoSelf.outstandingWet_docExpired(viewModel.OutstandingWet_DocExpired);
            protoSelf.outstandingWet_firstInst_Blank(viewModel.OutstandingWet_FirstInst_Blank);
            protoSelf.outstandingWet_firstInst_Prefilled(viewModel.OutstandingWet_FirstInst_Prefilled);
            protoSelf.printNow_btn(viewModel.PrintNow_Btn);
            protoSelf.outstandingWet_secondInst(viewModel.OutstandingWet_SecondInst);
            protoSelf.outstandingWet_thirdInst(viewModel.OutstandingWet_ThirdInst);
            protoSelf.wetSignatureScript_text(viewModel.WetSignatureScript_Text);
            protoSelf.wetSignatureScriptMail_text(viewModel.WetSignatureScriptMail_Text);
            protoSelf.wetSignatureScriptEMail_text(viewModel.WetSignatureScriptEMail_Text);

            protoSelf.outstandingVoice_desc(viewModel.OutstandingVoice_Desc);
            protoSelf.outstandingVoice_firstInst(viewModel.OutstandingVoice_FirstInst);
            protoSelf.outstandingVoice_secondInst(viewModel.OutstandingVoice_SecondInst);
            protoSelf.outstandingVoice_thirdInst(viewModel.OutstandingVoice_ThirdInst);
            protoSelf.voiceSignatureScript_text(viewModel.VoiceSignatureScript_Text);

            protoSelf.stepOneDone_text(viewModel.StepOneDone_Text);
            protoSelf.stepOneDone_desc(viewModel.StepOneDone_Desc);

            protoSelf.stepTwoNotDone_text(viewModel.StepTwoNotDone_Text);
            protoSelf.stepTwoNotDone_desc(viewModel.StepTwoNotDone_Desc);

            protoSelf.stepTwoDone_text(viewModel.StepTwoDone_Text);
            protoSelf.stepTwoDone_desc(viewModel.StepTwoDone_Desc);

            protoSelf.stepThreeNotDone_text(viewModel.StepThreeNotDone_Text);
            protoSelf.stepThreeNotDoneEmailParagraph(viewModel.StepThreeNotDoneEmailParagraph);
            protoSelf.stepThreeNotDoneRest(viewModel.StepThreeNotDoneRest);

            protoSelf.incomplete_hdr(viewModel.Incomplete_Hdr);
            protoSelf.incomplete_subHdr(viewModel.Incomplete_SubHdr);
            protoSelf.incomplete_desc(viewModel.Incomplete_Desc);

            protoSelf.denied_hdr(viewModel.Denied_Hdr);
            protoSelf.denied_subHdr(viewModel.Denied_SubHdr);
            protoSelf.denied_desc(viewModel.Denied_Desc);

            protoSelf.enrolled_hdr(viewModel.Enrolled_Hdr);
            protoSelf.enrolled_desc(viewModel.Enrolled_Desc);

            protoSelf.planDetails_lbl(viewModel.PlanDetails_Lbl);
            protoSelf.contactInfo_lbl(viewModel.ContactInfo_Lbl);
            protoSelf.doctorFinder_lbl(viewModel.DoctorFinder_Lbl);
            protoSelf.printTempIds_lbl(viewModel.PrintTempIds_Lbl);

            protoSelf.effective_lbl(viewModel.Effective_Lbl);
            protoSelf.appNmb_lbl(viewModel.AppNmb_Lbl);
            protoSelf.page_title(viewModel.Page_Title);

            protoSelf.CreateAccountAuthViewModel.loadFromJSON(viewModel.CreateAccountAuthViewModel);
            protoSelf.doneLoading(true);

            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));