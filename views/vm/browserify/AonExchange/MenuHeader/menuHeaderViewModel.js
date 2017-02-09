(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.MenuHeaderViewModel = function MenuHeaderViewModel() {
        if (!(this instanceof MenuHeaderViewModel)) {
            return new MenuHeaderViewModel();
        }
        var self = this;

        self.getHelpLinkHtml = ko.observable('');
        self.getHelpLinkText = ko.observable('');
        self.aonlogoText = ko.observable('');
        self.phoneNumberHtml = ko.observable('');
        self.phoneNumberSuffixHtml = ko.observable('');
        self.hoursHtml = ko.observable('');
        self.menuItems = ko.observableArray([]);
        
        self.agentOnBehalf = ko.observable('');
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

        MenuHeaderViewModel.prototype.loadFromJSON = function loadFromJSON(serversideViewModel) {
            var protoself = this;

            protoself.getHelpLinkHtml(serversideViewModel.GetHelpLinkHtml);
            protoself.getHelpLinkText(serversideViewModel.GetHelpLinkText);
            protoself.aonlogoText(serversideViewModel.AonlogoText);
            protoself.phoneNumberHtml(serversideViewModel.PhoneNumberHtml);
            protoself.phoneNumberSuffixHtml(serversideViewModel.PhoneNumberSuffixHtml);
            protoself.hoursHtml(serversideViewModel.HoursHtml);
            protoself.menuItems(serversideViewModel.MenuItems);
            protoself.agentOnBehalf(serversideViewModel.AgentOnBehalf);

            return protoself;
        };

        return self;
    };
} (EXCHANGE));
