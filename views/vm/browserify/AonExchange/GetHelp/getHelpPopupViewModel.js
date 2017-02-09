(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.GetHelpPopupViewModel = function GetHelpPopupViewModel() {
        if (!(this instanceof GetHelpPopupViewModel)) {
            return new GetHelpPopupViewModel();
        }
        var self = this;

        self.hasBeenLoaded = false;
        self.header_lbl = ko.observable('');
        self.innerHeader_text = ko.observable('');
        self.callUs_lbl = ko.observable('');
        self.call_lbl = ko.observable('');
        self.or_lbl = ko.observable('');
        self.requestCallBackBtn_text = ko.observable('');

        self.waitTimeOpen_text = ko.observable('');
        self.waitTimeClosed_text = ko.observable('');
        self.today = ko.observable(0);
        self.todaysOpenTime = ko.observable(Date());
        self.todaysCloseTime = ko.observable(Date());
        self.requestCallBackBtn_disabled = ko.observable(false);
        self.waitTime_text = ko.computed({
            read: function () {
                if (self.requestCallBackBtn_disabled()) {
                    return self.waitTimeClosed_text();
                }
                else {
                    return self.waitTimeOpen_text();
                }
            },
            owner: this
        });

        self.sendMessage_lbl = ko.observable('');
        self.sendMessage_desc = ko.observable('');
        self.sendMessageBtn_text = ko.observable('');

        self.webChat_lbl = ko.observable('');
        self.webChat_desc = ko.observable('');
        self.webChat_disabled_desc = ko.observable('');
        self.webChatBtn_text = ko.observable('');
        self.webChatConfirmInProgress = ko.observable('');
        self.webChatConfirmTitle = ko.observable('');
        self.webChatClose = ko.observable('');

        self.findAnswers_lbl = ko.observable('');
        self.findAnswers_desc = ko.observable('');

        self.footer_text = ko.observable('');
        self.goBackBtn_text = ko.observable('');

        self.webChatEnabledUrl = ko.observable('');
        self.webChatAvailable = ko.observable(false);

        GetHelpPopupViewModel.prototype.loadFromJSON = function loadFromJSON(getHelp) {
            var protoSelf = this;

            protoSelf.hasBeenLoaded = true;
            protoSelf.header_lbl(getHelp.Header_Lbl);
            protoSelf.innerHeader_text(getHelp.InnerHeader_Text);
            protoSelf.callUs_lbl(getHelp.CallUs_Lbl);
            protoSelf.call_lbl(getHelp.Call_Lbl);
            protoSelf.or_lbl(getHelp.Or_Lbl);

            protoSelf.requestCallBackBtn_text(getHelp.RequestCallBackBtn_Text);
            protoSelf.waitTimeOpen_text(getHelp.WaitTimeOpen_Text);
            protoSelf.waitTimeClosed_text(getHelp.WaitTimeClosed_Text);
            protoSelf.today(getHelp.Today);

            // JHR: Replacing the following lines due to IE7/8 not cooperating:
            //protoSelf.todaysOpenTime(new Date(getHelp.TodaysOpenTime));
            //protoSelf.todaysCloseTime(new Date(getHelp.TodaysCloseTime));
            if (getHelp.TodaysOpenTime != null) {
                var openStr = getHelp.TodaysOpenTime.toString();
                var todaysOpenTimeStr = '01/01/1900 ' + openStr.substring(openStr.indexOf('T') + 1, openStr.indexOf('Z')) + ' GMT';
                protoSelf.todaysOpenTime(new Date(todaysOpenTimeStr));
            }
            if (getHelp.TodaysCloseTime != null) {
                var closeStr = getHelp.TodaysCloseTime.toString();
                var todaysCloseTimeStr = '01/01/1900 ' + closeStr.substring(openStr.indexOf('T') + 1, closeStr.indexOf('Z')) + ' GMT';
                protoSelf.todaysCloseTime(new Date(todaysCloseTimeStr));
            }

            protoSelf.sendMessage_lbl(getHelp.SendMessage_Lbl);
            protoSelf.sendMessage_desc(getHelp.SendMessage_Desc);
            protoSelf.sendMessageBtn_text(getHelp.SendMessageBtn_Text);

            protoSelf.webChat_lbl(getHelp.WebChat_Lbl);
            protoSelf.webChat_desc(getHelp.WebChat_Desc);
            protoSelf.webChat_disabled_desc(getHelp.WebChat_Disabled_Desc);
            protoSelf.webChatBtn_text(getHelp.WebChatBtn_Text);
            protoSelf.webChatConfirmInProgress(getHelp.WebChatConfirmInProgress);
            protoSelf.webChatConfirmTitle(getHelp.WebChatConfirmTitle);
            protoSelf.webChatClose(getHelp.WebChatClose);

            protoSelf.findAnswers_lbl(getHelp.FindAnswers_Lbl);
            protoSelf.findAnswers_desc(getHelp.FindAnswers_Desc);

            protoSelf.footer_text(getHelp.Footer_Text);
            protoSelf.goBackBtn_text(getHelp.GoBackBtn_Text);

            protoSelf.webChatEnabledUrl(getHelp.WebChatEnabledUrl);

            protoSelf.requestCallBackBtn_disabled(!getHelp.IsCallCenterOpenNow);

            return protoSelf;
        };

        return self;
    };

} (EXCHANGE, this));

(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.SendMessageViewModel = function SendMessageViewModel() {
        if (!(this instanceof SendMessageViewModel)) {
            return new SendMessageViewModel();
        }
        var self = this;

        self.innerHeader_text = ko.observable('');

        self.error_hdr = ko.observable('');
        self.error_desc = ko.observable('');

        self.name_lbl = ko.observable('');
        self.firstName_tip = ko.observable('');
        self.firstName_tb = ko.observable('');
        self.lastName_tip = ko.observable('');
        self.lastName_tb = ko.observable('');

        self.phone_lbl = ko.observable('');
        self.phone_tb = ko.observable('');

        self.email_lbl = ko.observable('');
        self.email_tb = ko.observable('');

        self.privacy_text = ko.observable('');

        self.zip_lbl = ko.observable('');
        self.zip_tb = ko.observable('');

        self.subject_lbl = ko.observable('');
        self.subject_options = ko.observableArray([]);
        self.subject_text = ko.observable('');
        self.subject_val = ko.observable('');

        self.yourMessage_lbl = ko.observable('');
        self.yourMessage_tb = ko.observable('');

        self.disclaimer_text = ko.observable('');
        self.backBtn_text = ko.observable('');
        self.footer_text = ko.observable('');
        self.sendBtn_text = ko.observable('');
        
        self.inlineErrorsExist = ko.observable(false);
        self.inlineErrors = ko.observableArray([]);

        /************************* County **************/

        self.selectOne_lbl = ko.observable('');
        self.enterCounty_lbl = ko.observable('');
        self.countyId = ko.observable('');
       
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

        
        /****************** End Of County ****************/

        SendMessageViewModel.prototype.loadFromJSON = function loadFromJSON(sendMessage) {
        	var protoSelf = this;

            protoSelf.innerHeader_text(sendMessage.InnerHeader_Text);

            protoSelf.error_hdr(sendMessage.Error_Hdr);
            protoSelf.error_desc(sendMessage.Error_Desc);
            
            protoSelf.name_lbl(sendMessage.Name_Lbl);
            protoSelf.firstName_tip(sendMessage.FirstName_Tip);
            protoSelf.firstName_tb(sendMessage.FirstName_Tb);
            protoSelf.lastName_tip(sendMessage.LastName_Tip);
            protoSelf.lastName_tb(sendMessage.LastName_Tb);
			
            protoSelf.phone_lbl(sendMessage.Phone_Lbl);
            protoSelf.phone_tb(sendMessage.Phone_Tb);
			
            protoSelf.email_lbl(sendMessage.Email_Lbl);
            protoSelf.email_tb(sendMessage.Email_Tb);
			
            protoSelf.privacy_text(sendMessage.Privacy_Text);
			
            protoSelf.zip_lbl(sendMessage.Zip_Lbl);
            protoSelf.zip_tb(sendMessage.Zip_Tb);

            protoSelf.countyId(sendMessage.CountyId);
           
            protoSelf.enterCounty_lbl(sendMessage.EnterCounty_Lbl);
          
            protoSelf.selectOne_lbl(sendMessage.SelectOne_Lbl);
			
            protoSelf.subject_lbl(sendMessage.Subject_Lbl);
            protoSelf.subject_options(sendMessage.Subject_Options);
            protoSelf.subject_text(sendMessage.Subject_Text);
            protoSelf.subject_val(sendMessage.Subject_Val);
			
            protoSelf.yourMessage_lbl(sendMessage.YourMessage_Lbl);
            protoSelf.yourMessage_tb(sendMessage.YourMessage_Tb);
			
            protoSelf.disclaimer_text(sendMessage.Disclaimer_Text);
            protoSelf.backBtn_text(sendMessage.BackBtn_Text);
            protoSelf.footer_text(sendMessage.Footer_Text);
            protoSelf.sendBtn_text(sendMessage.SendBtn_Text);

            return protoSelf;
        };
        
        SendMessageViewModel.prototype.updateSubject = function updateSubject(subjectStr, subjectVal) {
        	var protoSelf = this;
            protoSelf.subject_text(subjectStr);
            if(subjectVal) {
                protoSelf.subject_val(subjectVal);
            }
            return protoSelf;
        };
        
        SendMessageViewModel.prototype.clearInlineErrors = function clearInlineErrors() {
        	var protoSelf = this;
        	
            protoSelf.inlineErrorsExist(false);
            protoSelf.inlineErrors([]);
        	
            return protoSelf;
        };

        SendMessageViewModel.prototype.addInlineError = function addInlineError(inlineErrorStr) {
        	var protoSelf = this;
        	
            protoSelf.inlineErrorsExist(true);
            var errorList = protoSelf.inlineErrors();
            errorList.push(inlineErrorStr);
            protoSelf.inlineErrors(errorList);
        	
            return protoSelf;
        };

        SendMessageViewModel.prototype.toJS = function toJS() {
            var protoSelf = this;
            var toReturn = {
                FirstName: protoSelf.firstName_tb(),
                LastName: protoSelf.lastName_tb(),
                Phone: protoSelf.phone_tb(),
                Email: protoSelf.email_tb(),
                Zip: protoSelf.zip_tb(),
                CountyId :  protoSelf.countyId(),
                Subject: protoSelf.subject_text(),
                SubjectValue: protoSelf.subject_val(),
                Message: protoSelf.yourMessage_tb(),
				WindowLocation: global.window.location.href
            };

            return toReturn;
        };

        return self;
    };

} (EXCHANGE, this));

(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.SendMessageConfirmViewModel = function SendMessageConfirmViewModel() {
        if (!(this instanceof SendMessageConfirmViewModel)) {
            return new SendMessageConfirmViewModel();
        }
        var self = this;

        self.innerHeader_text = ko.observable('');
        self.innerHeader_desc = ko.observable('');

        self.backBtn_text = ko.observable('');
        self.okBtn_text = ko.observable('');

        self.updateCommunication_lbl = ko.observable("");
        self.showUpdateCommunicationMessage = ko.observable("");

        self.isAuthenticated = ko.observable(true);

        SendMessageConfirmViewModel.prototype.loadFromJSON = function loadFromJSON(confirm) {
            var protoSelf = this;

            protoSelf.innerHeader_text(confirm.InnerHeader_Text);
            protoSelf.innerHeader_desc(confirm.InnerHeader_Desc);

            protoSelf.backBtn_text(confirm.BackBtn_Text);
            protoSelf.okBtn_text(confirm.OkBtn_Text);

            protoSelf.updateCommunication_lbl(confirm.UpdateCommunication_Lbl);
            protoSelf.showUpdateCommunicationMessage(confirm.ShowUpdateCommunicationMessage);

            
            protoSelf.isAuthenticated(confirm.IsAuthenticated);

            return protoSelf;
        };

        return self;
    };

} (EXCHANGE, this));

(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.CallMeBackConfirmViewModel = function CallMeBackConfirmViewModel() {
        if (!(this instanceof CallMeBackConfirmViewModel)) {
            return new CallMeBackConfirmViewModel();
        }
        var self = this;

        self.innerHeader_text = ko.observable('');
        self.innerHeader_desc = ko.observable('');
        self.confirm_text = ko.observable('');

        self.backBtn_text = ko.observable('');
        self.okBtn_text = ko.observable('');

        self.updateCommunication_lbl = ko.observable("");
        self.showUpdateCommunicationMessage = ko.observable("");

        
        self.phone_lbl = ko.computed({
            read: function () {
                if (EXCHANGE.viewModels.CallMeBackViewModel && EXCHANGE.viewModels.CallMeBackViewModel.phone_tb()) {
                    return EXCHANGE.functions.formatPhoneNumber(EXCHANGE.viewModels.CallMeBackViewModel.phone_tb());
                }
                return '';
            },
            owner: this
        });

        CallMeBackConfirmViewModel.prototype.loadFromJSON = function loadFromJSON(confirm) {
            var protoSelf = this;
            protoSelf.innerHeader_text(confirm.InnerHeader_Text);
            protoSelf.innerHeader_desc(confirm.InnerHeader_Desc);
            protoSelf.confirm_text(confirm.Confirm_Text);

            protoSelf.backBtn_text(confirm.BackBtn_Text);
            protoSelf.okBtn_text(confirm.OkBtn_Text);

            protoSelf.updateCommunication_lbl(confirm.UpdateCommunication_Lbl);
            protoSelf.showUpdateCommunicationMessage(confirm.ShowUpdateCommunicationMessage);

            return protoSelf;
        };

        return self;
    };

} (EXCHANGE, this));
