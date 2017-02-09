(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.MyCoverageViewModel = function MyCoverageViewModel() {
        if (!(this instanceof MyCoverageViewModel)) {
            return new MyCoverageViewModel();
        }
        var self = this;

        self.topMidInstructions_lbl = ko.observable('');

        self.questions_arr = ko.observableArray([]); // Array of MyCoverageQuestionViewModel

        self.old_answers = null;

        self.loadedFromJson = false;

        MyCoverageViewModel.prototype.getResultingTab = function () {
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

        MyCoverageViewModel.prototype.checkCorrectOptions = function () {
            var protoSelf = this;
            var length = protoSelf.questions_arr().length;
            for (var i = 0; i < length; i++) {
                protoSelf.questions_arr()[i].checkCorrectOption();
            }
        };

        MyCoverageViewModel.prototype.loadFromJSON = function loadFromJSON(helpChoose) {
            var protoSelf = this;
            protoSelf.topMidInstructions_lbl(helpChoose.TopMidInstructions_Lbl);

            var questionsLength = helpChoose.Questions_Arr.length;
            var arr = [];
            for (var i = 0; i < questionsLength; i++) {
                arr.push(new ns.MyCoverageQuestionViewModel().loadFromJSON(helpChoose.Questions_Arr[i]));
            }
            protoSelf.questions_arr(arr);
            return protoSelf;
        };

        MyCoverageViewModel.prototype.resetAnswers = function resetAnswers() {
            var protoSelf = this, answers = protoSelf.old_answers;
            if (!answers || answers.length == 0) {
                answers = protoSelf.getAnswers();
                protoSelf.old_answers = answers;
            }
            var length = protoSelf.questions_arr().length;
            for (var i = 0; i < length; i++) {
                var question = getQuestionFromName(protoSelf.questions_arr(), answers[i].QuestionName);
                question.option_radio(answers[i].QuestionAnswer);
            }
        };

        MyCoverageViewModel.prototype.saveAnswers = function saveAnswers() {
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

        MyCoverageViewModel.prototype.getAnswersForSubmit = function getAnswersForSubmit() {
            var protoSelf = this;
            var submitAnswers = {};
            var length = protoSelf.questions_arr().length;
            for (var i = 0; i < length; i++) {
                var selectedOption = protoSelf.questions_arr()[i].getSelectedOption();
                for (var prop in selectedOption) {
                    if (prop.indexOf("Preference") > -1) {
                        submitAnswers[prop] = selectedOption[prop]();
                    }
                }
            }

            return submitAnswers;
        };

        MyCoverageViewModel.prototype.getAnswers = function getAnswers() {
            var protoSelf = this, answers = [];
            var length = protoSelf.questions_arr().length;
            for (var i = 0; i < length; i++) {
                var selectedOption = protoSelf.questions_arr()[i].getSelectedOption();
                answers.push({ QuestionName: protoSelf.questions_arr()[i].question_name(), QuestionAnswer: selectedOption.Option_Val() });
            }

            protoSelf.old_answers = answers;

            return answers;
        };
    };

} (EXCHANGE, this));



(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.MyCoverageQuestionViewModel = function MyCoverageQuestionViewModel(another) {
        if (!(this instanceof MyCoverageQuestionViewModel)) {
            return new MyCoverageQuestionViewModel();
        }
        
        var self = this;

        self.question_lbl = ko.observable('');
        self.question_options = ko.observableArray([]); // Array of MyCoverageOption
        self.question_name = ko.observable('');
        self.question_class = ko.observable('');
        self.option_radio = ko.observable('');
        self.hidesQuestions = ko.observable();

        MyCoverageQuestionViewModel.prototype.loadFromJSON = function loadFromJSON(question) {
            var protoSelf = this;
            protoSelf.question_lbl(question.Question_Lbl);
            protoSelf.question_class(question.Question_Class);
            protoSelf.question_name(question.Question_Name);
            protoSelf.option_radio(question.Option_Radio);
            protoSelf.hidesQuestions(question.HidesQuestions);

            var optionsLength = question.Question_Options.length;
            for (var i = 0; i < optionsLength; i++) {
                protoSelf.question_options.push(ko.mapping.fromJS(question.Question_Options[i]));
            }

            return protoSelf;
        };

        MyCoverageQuestionViewModel.prototype.getSelectedOption = function getSelectedOption() {
            var protoSelf = this;
            var length = protoSelf.question_options().length, selectedOption;
            for (var i = 0; i < length; i++) {
                if (protoSelf.question_options()[i].Option_Id() === protoSelf.option_radio()) {
                    selectedOption = protoSelf.question_options()[i];
                    break;
                }
            }

            return selectedOption;
        };

        MyCoverageQuestionViewModel.prototype.getResultingTab = function getResultingTab() {
            var protoSelf = this;
            var selectedOption = protoSelf.getSelectedOption();

            if (selectedOption) {
                return selectedOption.Option_Tab();
            }

            return "";
        };

        MyCoverageQuestionViewModel.prototype.checkCorrectOption = function checkCorrectOption() {
            var protoSelf = this;
            $('input:[type="radio"][value="' + protoSelf.option_radio() + '"][name="' + protoSelf.question_name() + '"]').click();
        };

        return self;
    };

} (EXCHANGE, this));

//(function (app, global) {
//    //"use strict";
//    var ns = app.namespace('EXCHANGE.models');

//    ns.MyCoverageOptionViewModel = function MyCoverageOptionViewModel() {
//        if (!(this instanceof MyCoverageOptionViewModel)) {
//            return new MyCoverageOptionViewModel();
//        }

//        this._self = this;

//        self.option_lbl = ko.observable('');
//        self.option_val = ko.observable('');
//        self.option_id = ko.observable('');
//        self.option_hides = ko.observableArray([]); // Array of question names which this option hides
//        self.option_tab = ko.observable('');
//        

//        MyCoverageOptionViewModel.prototype.loadFromJSON = function loadFromJSON(option) {
//            var protoSelf = this;
//            protoSelf.option_lbl(option.Option_Lbl);
//            protoSelf.option_val(option.Option_Val);
//            protoSelf.option_id(option.Option_Id);
//            protoSelf.option_hides(option.Option_Hides);
//            protoSelf.option_tab(option.Option_Tab);

//            return protoSelf;
//        };

//        return self;

//    };
//} (EXCHANGE, this));
