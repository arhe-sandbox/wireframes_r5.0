(function (app) {
    var ns = app.namespace('EXCHANGE.models');

    ns.AppDetailsFaqViewModel = function AppDetailsFaqViewModel() {
        if (!(this instanceof AppDetailsFaqViewModel)) {
            return new AppDetailsFaqViewModel();
        }
        var self = this;

        self.haveQuestions_lbl = ko.observable('');
        self.question1_lbl = ko.observable('');
        self.answer1_lbl = ko.observable('');
        self.question2_lbl = ko.observable('');
        self.answer2_lbl = ko.observable('');
        self.otherQuestions_lbl = ko.observable('');

        AppDetailsFaqViewModel.prototype.loadFromJSON = function loadFromJSON(serverViewModel) {
            var protoself = this;

            protoself.haveQuestions_lbl(serverViewModel.HaveQuestions_Lbl);
            protoself.question1_lbl(serverViewModel.Question1_Lbl);
            protoself.answer1_lbl(serverViewModel.Answer1_Lbl);
            protoself.question2_lbl(serverViewModel.Question2_Lbl);
            protoself.answer2_lbl(serverViewModel.Answer2_Lbl);
            protoself.otherQuestions_lbl(serverViewModel.OtherQuestions_Lbl);

            return protoself;
        };

        return self;
    };


} (EXCHANGE));