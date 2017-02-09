(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

  
    ns.LoginViewModel = function LoginViewModel() {
        if (!(this instanceof LoginViewModel)) {
            return new LoginViewModel();
        }
        var self = this;

        self.rightColumn_lbl = ko.observable('');
        self.ancRightColumn_lbl = ko.observable('');
        self.goBackText_lbl = ko.observable('');
        self.bottomBarTextWithCreate_lbl = ko.observable('');
        self.bottomBarTextWithoutCreate_lbl = ko.observable('');
        self.logOnText_lbl = ko.observable('');
        self.createAccountText_lbl = ko.observable('');
        self.orText_lbl = ko.observable('');
        self.username_lbl = ko.observable('');
        self.password_lbl = ko.observable('');
        self.forgotUsername_lbl = ko.observable('');
        self.forgotPassword_lbl = ko.observable('');
        self.headerText_lbl = ko.observable('');
        self.middleHeaderText_lbl = ko.observable('');
        self.invalidUsername_lbl = ko.observable('');
        self.invalidPassword_lbl = ko.observable('');
        self.lockedOut_lbl = ko.observable('');
        self.passwordReset_lbl = ko.observable('');
        self.passwordResetButton_lbl = ko.observable('');
        self.notFoundUsername_lbl = ko.observable('');
        self.notFoundEmail_lbl = ko.observable('');
        self.resetAlready_lbl = ko.observable('');
        self.unknownError_lbl = ko.observable('');
        self.cancel_lbl = ko.observable('');
        self.forgotPasswordHeader_lbl = ko.observable('');
        self.resetPasswordConfirmHeader_lbl = ko.observable('');
        self.resetPasswordConfirmLine1_lbl = ko.observable('');
        self.resetPasswordConfirmLine2_lbl = ko.observable('');
        self.accountExists_lbl = ko.observable('');

        self.displayLoginForm = ko.observable(true);
        self.displayResetPasswordForm = ko.observable(false);
        self.displayResetPasswordConfirmation = ko.observable(false);

        self.displayCreateAccountOption = ko.observable(true);
        self.displayAccountExistsContent = ko.observable(false);


        self.usernamePlaceholder_lbl = ko.computed({
            read: function () {
                return self.username_lbl().substring(0, self.username_lbl().length - 1);
            },
            owner: this
        });

        self.passwordPlaceholder_lbl = ko.computed({
            read: function () {
                return self.password_lbl().substring(0, self.password_lbl().length - 1);
            },
            owner: this
        });

        self.passwordResetSentFormatted_lbl = ko.computed({
            read: function () {
                if (app.viewModels.ResetPasswordValidationViewModel && app.viewModels.ResetPasswordValidationViewModel.email()) {
                    return self.resetPasswordConfirmLine1_lbl().format(app.viewModels.ResetPasswordValidationViewModel.email());
                }
                else {
                    return '';
                }
            },
            owner: this
        });

        LoginViewModel.prototype.loadFromJSON = function loadFromJSON(serversideViewModel) {
            var protoself = this;

            if (location.href.indexOf("dental") > -1)
                protoself.rightColumn_lbl(serversideViewModel.AncRightColumn_Lbl);

            else if (location.href.indexOf("vision") > -1)
                protoself.rightColumn_lbl(serversideViewModel.AncRightColumn_Lbl);

            else if (location.href.indexOf("othercoverage") > -1)
                protoself.rightColumn_lbl(serversideViewModel.AncRightColumn_Lbl);

            else
                protoself.rightColumn_lbl(serversideViewModel.RightColumn_Lbl);

         
            protoself.goBackText_lbl(serversideViewModel.GoBackText_Lbl);
            protoself.bottomBarTextWithCreate_lbl(serversideViewModel.BottomBarTextWithCreate_Lbl);
            protoself.bottomBarTextWithoutCreate_lbl(serversideViewModel.BottomBarTextWithoutCreate_Lbl);
            protoself.logOnText_lbl(serversideViewModel.LogOnText_Lbl);
            protoself.createAccountText_lbl(serversideViewModel.CreateAccountText_Lbl);
            protoself.orText_lbl(serversideViewModel.OrText_Lbl);
            protoself.username_lbl(serversideViewModel.Username_Lbl);
            protoself.password_lbl(serversideViewModel.Password_Lbl);
            protoself.forgotUsername_lbl(serversideViewModel.ForgotUsername_Lbl);
            protoself.forgotPassword_lbl(serversideViewModel.ForgotPassword_Lbl);
            protoself.headerText_lbl(serversideViewModel.HeaderText_Lbl);
            protoself.middleHeaderText_lbl(serversideViewModel.MiddleHeaderText_Lbl);
            protoself.invalidUsername_lbl(serversideViewModel.InvalidUsername_Lbl);
            protoself.invalidPassword_lbl(serversideViewModel.InvalidPassword_Lbl);
            protoself.lockedOut_lbl(serversideViewModel.LockedOut_Lbl);
            protoself.passwordReset_lbl(serversideViewModel.PasswordReset_Lbl);
            protoself.passwordResetButton_lbl(serversideViewModel.PasswordResetButton_Lbl);
            protoself.notFoundUsername_lbl(serversideViewModel.NotFoundUsername_Lbl);
            protoself.notFoundEmail_lbl(serversideViewModel.NotFoundEmail_Lbl);
            protoself.resetAlready_lbl(serversideViewModel.ResetAlready_Lbl);
            protoself.unknownError_lbl(serversideViewModel.UnknownError_Lbl);
            protoself.cancel_lbl(serversideViewModel.Cancel_Lbl);
            protoself.forgotPasswordHeader_lbl(serversideViewModel.ForgotPasswordHeader_Lbl);
            protoself.resetPasswordConfirmHeader_lbl(serversideViewModel.ResetPasswordConfirmHeader_Lbl);
            protoself.resetPasswordConfirmLine1_lbl(serversideViewModel.ResetPasswordConfirmLine1_Lbl);
            protoself.resetPasswordConfirmLine2_lbl(serversideViewModel.ResetPasswordConfirmLine2_Lbl);
            protoself.accountExists_lbl(serversideViewModel.AccountExists_Lbl);

            protoself.displayCreateAccountOption(serversideViewModel.DisplayCreateAccountOption);

            return protoself;
        };

        return self;
    };



    ns.LoginValidationViewModel = function LoginValidationViewModel() {
        if (!(this instanceof LoginValidationViewModel)) {
            return new LoginValidationViewModel();
        }
        var self = this;

        self.isValid = ko.observable(true);
        self.isUsernameValid = ko.observable(false);
        self.isUserLockedOut = ko.observable(false);
        self.isPasswordCorrect = ko.observable(false);
        self.loginForwardResult = ko.observable();

        self.displayUsernameError = ko.computed({
            read: function () {
                if (!self.isUsernameValid() && !self.isPasswordCorrect() && !self.isUserLockedOut()) {
                    return true;
                }
                else {
                    return false;
                }
            },
            owner: this
        });
        self.displayPasswordError = ko.computed({
            read: function () {
                if (self.isUsernameValid() && !self.isPasswordCorrect() && !self.isUserLockedOut()) {
                    return true;
                }
                else {
                    return false;
                }
            },
            owner: this
        });
        self.displayLockedOutError = ko.computed({
            read: function () {
                if (self.isUserLockedOut()) {
                    return true;
                }
                else {
                    return false;
                }
            },
            owner: this
        });

        LoginValidationViewModel.prototype.loadFromJSON = function loadFromJSON(serversideViewModel) {
            var protoself = this;

            protoself.isValid(serversideViewModel.IsValid);
            protoself.isUsernameValid(serversideViewModel.IsUsernameValid);
            protoself.isUserLockedOut(serversideViewModel.IsUserLockedOut);
            protoself.isPasswordCorrect(serversideViewModel.IsPasswordCorrect);
            protoself.loginForwardResult(serversideViewModel.LoginForwardResult);
            return protoself;
        };

        return self;
    };


    ns.ResetPasswordValidationViewModel = function ResetPasswordValidationViewModel() {
        if (!(this instanceof ResetPasswordValidationViewModel)) {
            return new ResetPasswordValidationViewModel();
        }
        var self = this;

        self.isValid = ko.observable(true);
        self.isUsernameValid = ko.observable(false);
        self.isUserLockedOut = ko.observable(false);
        self.isEmailValid = ko.observable(false);
        self.hasResetOccuredToday = ko.observable(false);
        self.wasResetEmailSent = ko.observable(false);
        self.email = ko.observable('');


        self.displayUsernameError = ko.computed({
            read: function () {
                if (!self.isUsernameValid() && !self.isEmailValid() && !self.isUserLockedOut() && !self.hasResetOccuredToday()) {
                    return true;
                }
                else {
                    return false;
                }
            },
            owner: this
        });
        self.displayEmailError = ko.computed({
            read: function () {
                if (self.isUsernameValid() && !self.isEmailValid() && !self.isUserLockedOut() && !self.hasResetOccuredToday()) {
                    return true;
                }
                else {
                    return false;
                }
            },
            owner: this
        });
        self.displayLockedOutError = ko.computed({
            read: function () {
                if (self.isUserLockedOut()) {
                    return true;
                }
                else {
                    return false;
                }
            },
            owner: this
        });
        self.displayRecentResetError = ko.computed({
            read: function () {
                if (self.hasResetOccuredToday()) {
                    return true;
                }
                else {
                    return false;
                }
            },
            owner: this
        });
        self.displayNotSentError = ko.computed({
            read: function () {
                if (!self.wasResetEmailSent() && !self.hasResetOccuredToday() && self.isEmailValid() && !self.isUserLockedOut() && self.isUsernameValid()) {
                    return true;
                }
                else {
                    return false;
                }
            },
            owner: this
        });
        self.displayConfirmMessage = ko.computed({
            read: function () {
                if (self.isValid() && self.wasResetEmailSent()) {
                    return true;
                }
                else {
                    return false;
                }
            },
            owner: this
        });

        ResetPasswordValidationViewModel.prototype.loadFromJSON = function loadFromJSON(serversideViewModel) {
            var protoself = this;

            protoself.isValid(serversideViewModel.IsValid);
            protoself.isUsernameValid(serversideViewModel.IsUsernameValid);
            protoself.isUserLockedOut(serversideViewModel.IsUserLockedOut);
            protoself.isEmailValid(serversideViewModel.IsEmailValid);
            protoself.hasResetOccuredToday(serversideViewModel.HasResetOccuredToday);
            protoself.wasResetEmailSent(serversideViewModel.WasResetEmailSent);
            protoself.email(serversideViewModel.ObfuscatedEmailAddress);

            return protoself;
        };

        return self;
    };
} (EXCHANGE));

