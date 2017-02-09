(function (app, global) {
    //"use strict";
    ko.bindingHandlers.questionVisible = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var hide = false;
            var questions = valueAccessor(), allBindings = allBindingsAccessor();
            var ourName = viewModel.question_name();
            var questionsUnwrapped = ko.utils.unwrapObservable(questions);
            var length = questionsUnwrapped.length;
            var currentQuestion, currentOptionName, currentOption;
            for (var i = 0; i < length; i++) {
                currentQuestion = questionsUnwrapped[i]; // get the current Question
                currentOptionName = currentQuestion.option_radio(); // get the current value for that question
                if (currentQuestion.hidesQuestions()) {
                    var optionsLength = currentQuestion.question_options().length;
                    for (var j = 0; j < optionsLength; j++) {
                        currentOption = currentQuestion.question_options()[j];
                        if (currentOption.Option_Val() === currentOptionName && currentOption.Option_Hides().indexOf(ourName) != -1) {
                            hide = true;
                            break;
                        }
                    }
                }
            }

            if (hide) {
                $(element).hide();
            }
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var hide = false;
            var questions = valueAccessor(), allBindings = allBindingsAccessor();
            var ourName = viewModel.question_name();
            var questionsUnwrapped = ko.utils.unwrapObservable(questions);
            var length = questionsUnwrapped.length;
            var currentQuestion, currentOptionName, currentOption;
            for (var i = 0; i < length; i++) {
                currentQuestion = questionsUnwrapped[i]; // get the current Question
                currentOptionName = currentQuestion.option_radio(); // get the current value for that question
                if (currentQuestion.hidesQuestions()) {
                    var optionsLength = currentQuestion.question_options().length;
                    for (var j = 0; j < optionsLength; j++) {
                        currentOption = currentQuestion.question_options()[j];
                        if (currentOption.Option_Val() === currentOptionName && currentOption.Option_Hides().indexOf(ourName) != -1) {
                            hide = true;
                            break;
                        }
                    }
                }
            }

            if (hide) {
                $(element).hide();
            }
            else {
                $(element).show();
            }
        }
    };
} (EXCHANGE, this));