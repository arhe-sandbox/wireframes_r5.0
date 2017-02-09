(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.ActivateAccountViewModel = function ActivateAccountViewModel() {
        if (!(this instanceof ActivateAccountViewModel)) {
            return new ActivateAccountViewModel();
        }
        var self = this;

        self.newAccount_text = ko.observable('');
        self.activate_text = ko.observable('');
        self.activateBtn_text = ko.observable('');
        self.email_text = ko.observable('');

        self._nullLead = { Id: "", NavigatorsId: "" };
        self.lead = ko.observable(self._nullLead);

        self.isAuthenticated = ko.observable(false);

        ActivateAccountViewModel.prototype.setLead = function setLead(leadEntity) {
            var protoSelf = this;

            if (leadEntity) {
                protoSelf.lead(leadEntity);
            }
            else {
                protoSelf.lead(self._nullLead);
            }

            return protoSelf;
        };

        ActivateAccountViewModel.prototype.loadFromJSON = function loadFromJSON(activate) {
            var protoSelf = this;

            protoSelf.newAccount_text(activate.NewAccount_Text);
            protoSelf.activate_text(activate.Activate_Text);
            protoSelf.activateBtn_text(activate.ActivateBtn_Text);
            protoSelf.email_text(activate.Email_Text);

            protoSelf.isAuthenticated(activate.IsAuthenticated);

            return protoSelf;
        };

        return self;
    };

} (EXCHANGE));