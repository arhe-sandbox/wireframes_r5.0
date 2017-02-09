(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.LoginHeaderViewModel = function LoginHeaderViewModel() {
        if (!(this instanceof LoginHeaderViewModel)) {
            return new LoginHeaderViewModel();
        }
        var self = this;

        self.loginText = ko.observable('');
        self.createAccountText = ko.observable('');
        self.welcomeText = ko.observable('');
        self.logoutText = ko.observable('');
        self.agentOnBehalf = ko.observable('');

        self.aonlogoText = ko.observable('');

        self.getHelpLinkHtml = ko.observable('');
        self.getHelpLinkText = ko.observable('');
        

        self.getHelpSuffixHtml = ko.observable('');

        self.getHelpPrintHtml = ko.observable('');
        self.urlLabelPrintHtml = ko.observable('');
        self.urlValuePrintHtml = ko.observable('');

        self.phoneNumberHtml = ko.observable('');
        self.phoneNumberSuffixHtml = ko.observable('');
        self.hoursHtml = ko.observable('');
        self.logoHtml = ko.observable('');

        self.loginEnabled = ko.observable(true);

        //This is a bit of a hack.
        //  Because the userSession in JS is not observable, we can't just load it from json and have all the on screen values change.
        //  If a user changes their first/last name, the header needs to update to reflect this. Hence, this function.
        //  The better solution would be to make the usersession or userprofile observable. 
        //  But that could break almost every javascript and ascx file (adding parenthesis in the right places in all those files)
        //  which is a bit too risky given the current release schedule (01/28/2013)
        self.refreshWelcomeTextCounter = ko.observable(1);
        self.refreshWelcomeText = function () {
            self.refreshWelcomeTextCounter(parseInt(self.refreshWelcomeTextCounter()) + 1);
        };
        //end hack

        self.welcomeTextFormatted = ko.computed({
            read: function () {
                if (self.refreshWelcomeTextCounter()) {
                    //part of the hack detailed below.
                }

                var userProfile = app.user.UserSession.UserProfile;
                if (self.welcomeText() && userProfile && userProfile.firstName && userProfile.lastName) {
                    var fName = userProfile.firstName;
                    if (userProfile.firstName.length > 15) {
                        fName = fName.slice(0, 15);
                    }
                    return self.welcomeText().format(fName, userProfile.lastName.charAt(0) + '.');
                }
                else {
                    return '';
                }
            },
            owner: this
        });

        self.agentOnBehalfFormatted = ko.computed({
            read: function () {
                var userProfile = app.user.UserSession.UserProfile;
                var userSession = app.user.UserSession;
                if (self.agentOnBehalf() && userProfile && userSession && userSession.Agent) {
                    var fName = userProfile.firstName;
                    if (userProfile.firstName.length > 15) {
                        fName = fName.slice(0, 15);
                    }
                    return self.agentOnBehalf().format(userSession.Agent().FirstName(), userSession.Agent().LastName(), fName, userProfile.lastName.charAt(0) + '.');
                }
                else {
                    return '';
                }
            },
            owner: this
        });

        self.IsLoggedIn = ko.computed({
            read: function () {
                if (app.user.UserSession && app.user.UserSession.IsLoggedIn) {
                    return true;
                } else {
                    return false;
                }
            },
            owner: this
        });


        LoginHeaderViewModel.prototype.loadFromJSON = function loadFromJSON(serversideViewModel) {
            var protoself = this;

            protoself.loginText(serversideViewModel.LoginText);
            protoself.createAccountText(serversideViewModel.CreateAccountText);
            protoself.welcomeText(serversideViewModel.WelcomeText);
            protoself.logoutText(serversideViewModel.LogoutText);
            protoself.agentOnBehalf(serversideViewModel.AgentOnBehalf);

            protoself.getHelpLinkHtml(serversideViewModel.GetHelpLinkHtml);
            protoself.getHelpLinkText(serversideViewModel.GetHelpLinkText);
            protoself.getHelpSuffixHtml(serversideViewModel.GetHelpSuffixHtml);

            protoself.getHelpPrintHtml(serversideViewModel.GetHelpPrintHtml);
            protoself.urlLabelPrintHtml(serversideViewModel.UrlLabelPrintHtml);
            protoself.urlValuePrintHtml(serversideViewModel.UrlValuePrintHtml);

            protoself.aonlogoText(serversideViewModel.AonlogoText);
            protoself.phoneNumberHtml(serversideViewModel.PhoneNumberHtml);
            protoself.phoneNumberSuffixHtml(serversideViewModel.PhoneNumberSuffixHtml);
            protoself.hoursHtml(serversideViewModel.HoursHtml);
            protoself.logoHtml(serversideViewModel.LogoHtml);

            return protoself;
        };

        return self;
    };
} (EXCHANGE));
