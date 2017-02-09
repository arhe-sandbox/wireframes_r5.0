(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.HelpMeChooseViewModel = function HelpMeChooseViewModel() {
        if (!(this instanceof HelpMeChooseViewModel)) {
            return new HelpMeChooseViewModel();
        }
        var self = this;

        self.topLeftTitle_lbl = ko.observable('');
        self.topLeftInstructions_lbl = ko.observable('');

        self.myCoverageHdr_lbl = ko.observable('');
        self.myCoverageDesc_lbl = ko.observable('');

        self.myMedicationsHdr_lbl = ko.observable('');
        self.myMedicationsDesc_lbl = ko.observable('');

        self.accountHdr_lbl = ko.observable('');
        self.accountDesc_lbl = ko.observable('');

        self.topMidInstructions_lbl = ko.observable('');
        self.bottomMidInstructions_lbl = ko.observable('');

        self.goBackBtn_lbl = ko.observable('');
        self.continueBtn_lbl = ko.observable('');

        self.questions_arr = ko.observableArray([]); // Array of HelpMeChooseQuestionViewModel

        self.old_answers = null;

        HelpMeChooseViewModel.prototype.getResultingTab = function () {
            var protoSelf = this, resultTab, currentTab;
            var length = protoSelf.questions_arr().length;
            for (var i = 0; i < length; i++) {
                currentTab = protoSelf.questions_arr()[i].getResultingTab();
                if (currentTab) {
                    resultTab = currentTab;
                }
            }

            return resultTab;
        };

        HelpMeChooseViewModel.prototype.checkCorrectOptions = function () {
            var protoSelf = this;
            var length = protoSelf.questions_arr().length;
            for (var i = 0; i < length; i++) {
                protoSelf.questions_arr()[i].checkCorrectOption();
            }
        };

        HelpMeChooseViewModel.prototype.loadFromJSON = function loadFromJSON(helpChoose) {
            var protoSelf = this;

            protoSelf.topLeftTitle_lbl(helpChoose.TopLeftTitle_Lbl);
            protoSelf.topLeftInstructions_lbl(helpChoose.TopLeftInstructions_Lbl);

            protoSelf.myCoverageHdr_lbl(helpChoose.MyCoverageHdr_Lbl);
            protoSelf.myCoverageDesc_lbl(helpChoose.MyCoverageDesc_Lbl);

            protoSelf.myMedicationsHdr_lbl(helpChoose.MyMedicationsHdr_Lbl);
            protoSelf.myMedicationsDesc_lbl(helpChoose.MyMedicationsDesc_Lbl);

            protoSelf.accountHdr_lbl(helpChoose.AccountHdr_Lbl);
            protoSelf.accountDesc_lbl(helpChoose.AccountDesc_Lbl);

            protoSelf.topMidInstructions_lbl(helpChoose.TopMidInstructions_Lbl);
            protoSelf.bottomMidInstructions_lbl(helpChoose.BottomMidInstructions_Lbl);

            protoSelf.goBackBtn_lbl(helpChoose.GoBackBtn_Lbl);
            protoSelf.continueBtn_lbl(helpChoose.ContinueBtn_Lbl);

            var questionsLength = helpChoose.Questions_Arr.length;
            var arr = [];
            for (var i = 0; i < questionsLength; i++) {
                arr.push(new ns.HelpMeChooseQuestionViewModel().loadFromJSON(helpChoose.Questions_Arr[i]));
            }
            protoSelf.questions_arr(arr);
            return protoSelf;
        };

        HelpMeChooseViewModel.prototype.resetAnswers = function resetAnswers() {
            var protoSelf = this, answers = protoSelf.old_answers;
            if (!answers) {
                answers = protoSelf.getAnswers();
                protoSelf.old_answers = answers;
            }
            var length = protoSelf.questions_arr().length;
            for (var i = 0; i < length; i++) {
                var question = getQuestionFromName(protoSelf.questions_arr(), answers[i].QuestionName);
                question.option_radio(answers[i].QuestionAnswer);
            }
        };

        HelpMeChooseViewModel.prototype.saveAnswers = function saveAnswers() {
            var protoSelf = this;
            protoSelf.old_answers = protoSelf.getAnswers();
        };

        function getQuestionFromName(questions, name) {
            var wanted = null;
            $.each(questions, function (i, question) {
                if (question.question_name() === name) {
                    wanted = question;
                    return;
                }
            });

            return wanted;
        }

        HelpMeChooseViewModel.prototype.getAnswers = function getAnswers() {
            var protoSelf = this, answers = [];

            var length = protoSelf.questions_arr().length;
            for (var i = 0; i < length; i++) {
                answers.push({
                    QuestionName: protoSelf.questions_arr()[i].question_name(),
                    QuestionAnswer: protoSelf.questions_arr()[i].option_radio()
                });
            }

            protoSelf.old_answers = answers;

            return answers;
        };
    };

} (EXCHANGE, this));



(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.HelpMeChooseQuestionViewModel = function HelpMeChooseQuestionViewModel(another) {
        if (!(this instanceof HelpMeChooseQuestionViewModel)) {
            return new HelpMeChooseQuestionViewModel();
        }
        var self = this;

        self.question_lbl = ko.observable('');
        self.question_options = ko.observableArray([]); // Array of HelpMeChooseOption
        self.question_name = ko.observable('');
        self.question_class = ko.observable('');
        self.option_radio = ko.observable('');
        self.hidesQuestions = ko.observable();

        HelpMeChooseQuestionViewModel.prototype.loadFromJSON = function loadFromJSON(question) {
            var protoSelf = this;
            protoSelf.question_lbl(question.Question_Lbl);
            protoSelf.question_class(question.Question_Class);
            protoSelf.question_name(question.Question_Name);
            protoSelf.option_radio(question.Option_Radio);
            protoSelf.hidesQuestions(question.HidesQuestions);
            
            var optionsLength = question.Question_Options.length;
            for(var i = 0; i < optionsLength; i++) {
                protoSelf.question_options().push(new ns.HelpMeChooseOptionViewModel().loadFromJSON(question.Question_Options[i]));
            }

            return protoSelf;
        };

        HelpMeChooseQuestionViewModel.prototype.getResultingTab = function getResultingTab() {
            var protoSelf = this;
            var length = protoSelf.question_options().length, selectedOption;
            for(var i = 0; i < length; i++) {
                if(protoSelf.question_options()[i].option_id() === protoSelf.option_radio()) {
                    selectedOption = protoSelf.question_options()[i];
                    break;
                }
            }
            
            if(selectedOption) {
                return selectedOption.option_tab();
            }
        };

        HelpMeChooseQuestionViewModel.prototype.checkCorrectOption = function checkCorrectOption() {
            var protoSelf = this;
            $('input:[type="radio"][value="' + protoSelf.option_radio() + '"][name="' + protoSelf.question_name() + '"]').click();
        };

        return self;
    };

} (EXCHANGE, this));

(function(app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.HelpMeChooseOptionViewModel = function HelpMeChooseOptionViewModel() {
        if (!(this instanceof HelpMeChooseOptionViewModel)) {
            return new HelpMeChooseOptionViewModel();
        }
        var self = this;

        self.option_lbl = ko.observable('');
        self.option_val = ko.observable('');
        self.option_id = ko.observable('');
        self.option_hides = ko.observableArray([]); // Array of question names which this option hides
        self.option_tab = ko.observable('');

        HelpMeChooseOptionViewModel.prototype.loadFromJSON = function loadFromJSON(option) {
            var protoSelf = this;
            protoSelf.option_lbl(option.Option_Lbl);
            protoSelf.option_val(option.Option_Val);
            protoSelf.option_id(option.Option_Id);
            protoSelf.option_hides(option.Option_Hides);
            protoSelf.option_tab(option.Option_Tab);

            return protoSelf;
        };

        return self;

    };
}(EXCHANGE, this));
