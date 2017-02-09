(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.UserAdministrationViewModel = function UserAdministrationViewModel() {
        if (!(this instanceof UserAdministrationViewModel)) {
            return new UserAdministrationViewModel();
        }
        var self = this;
        self.UserAdministrationHeaderHtml = ko.observable('');
        self.DeleteSelectedUsersButtonHtml = ko.observable('');
        self.Users = ko.observableArray([]);

        UserAdministrationViewModel.prototype.loadFromJSON = function loadFromJSON(viewModel) {
            var protoSelf = this;
            protoSelf.UserAdministrationHeaderHtml(viewModel.UserAdministrationHeaderHtml);
            protoSelf.DeleteSelectedUsersButtonHtml(viewModel.DeleteSelectedUsersButtonHtml);
            protoSelf.Users(viewModel.Users);
            return protoSelf;
        };
    };

} (EXCHANGE));