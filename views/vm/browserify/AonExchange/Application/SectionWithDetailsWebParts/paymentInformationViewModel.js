(function (app) {
    var ns = app.namespace('EXCHANGE.models');

    ns.PaymentInformationViewModel = function PaymentInformationViewModel() {
        if (!(this instanceof PaymentInformationViewModel)) {
            return new PaymentInformationViewModel();
        }
        var self = this;

        self.estimatedPremium_lbl = ko.observable('');
        self.asterisk_lbl = ko.observable('');
        self.question1_lbl = ko.observable('');
        self.answer1_lbl = ko.observable('');
        self.question2_lbl = ko.observable('');
        self.answer2_lbl = ko.observable('');
        self.question3_lbl = ko.observable('');
        self.answer3_lbl = ko.observable('');
        self.otherQuestions_lbl = ko.observable('');

        PaymentInformationViewModel.prototype.loadFromJSON = function loadFromJSON(serverViewModel) {
            var protoself = this;

            protoself.estimatedPremium_lbl(serverViewModel.EstimatedPremium_Lbl);
            protoself.asterisk_lbl(serverViewModel.Asterisk_Lbl);
            protoself.question1_lbl(serverViewModel.Question1_Lbl);
            protoself.answer1_lbl(serverViewModel.Answer1_Lbl);
            protoself.question2_lbl(serverViewModel.Question2_Lbl);
            protoself.answer2_lbl(serverViewModel.Answer2_Lbl);
            protoself.question3_lbl(serverViewModel.Question3_Lbl);
            protoself.answer3_lbl(serverViewModel.Answer3_Lbl);
            protoself.otherQuestions_lbl(serverViewModel.OtherQuestions_Lbl);

            return protoself;
        };

        return self;
    };


} (EXCHANGE));