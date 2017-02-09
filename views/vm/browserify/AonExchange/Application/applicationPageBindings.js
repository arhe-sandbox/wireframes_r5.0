 (function (app, $) {
     var ns = app.namespace("EXCHANGE.applicationPageBindingFunctions");

     ko.bindingHandlers.computedQuestion = {
         update: function (element, valueAccessor) {
             var item = ko.utils.unwrapObservable(valueAccessor());
             if (!app.applicationReview) {
                 item.Answer().Answer(app.applicationPageBindingFunctions._getValueForComputedQuestion(item));
             }
         }
     };

     ns._getValueForComputedQuestion = function getValueForComputedQuestion(item) {
         switch (item.ComputedQuestionType()) {
             case app.enums.ComputedQuestionTypeEnum.EnrollMedicarePartBInLastSix:
                 return ns._computeEnrollMedicarePartBInLastSix(item);
             case app.enums.ComputedQuestionTypeEnum.TurnSixtyFiveInLastSix:
                 return ns._computeTurnSixtyFiveInLastSix(item);
             case app.enums.ComputedQuestionTypeEnum.LosingCoverageAndEligibles:
                 return ns._computeLosingCoverageAndEligibles(item);
             case app.enums.ComputedQuestionTypeEnum.MedPartBEffectiveWithinSixMonthsOfSixtyFive:
                 return ns._computeMedPartBEffectiveWithinSixMonthsOfSixtyFive(item);
             case app.enums.ComputedQuestionTypeEnum.CombineToShowQuestions:
                 return ns._computeCombineToShowQuestions(item);
             case app.enums.ComputedQuestionTypeEnum.Age:
                 return ns._computeAge(item);
             case app.enums.ComputedQuestionTypeEnum.UHCCalcyearspastinitialenrollment:
                 return ns._computeUHCCalcyearspastinitialenrollment(item);
             case app.enums.ComputedQuestionTypeEnum.BCBSAZAgeasofPartBEffectiveDate:
                 return ns._computeBCBSAZAgeasofPartBEffectiveDate(item);
             case app.enums.ComputedQuestionTypeEnum.Quoted_Premium:
                 return ns._computeQuotedPremium(item);
             case app.enums.ComputedQuestionTypeEnum.AgeasofApril1:
                 return ns._computeAgeasofApril1(item);
             case app.enums.ComputedQuestionTypeEnum.BMI:
                 return ns._computeBMI(item);
             case app.enums.ComputedQuestionTypeEnum.NoneoftheseApplyforEligibility:
                 return ns._computeNoneoftheseApplyforEligibility(item);
             default:
                 return "";
         }
     };

     ns._computeBMI = function computeBMI(item) {
         var weightCode = item.NeededQuestionMappingCodes()[0];
         var feetCode = item.NeededQuestionMappingCodes()[1];
         var inchesCode = item.NeededQuestionMappingCodes()[2];

         var getWeight = ns._getAnswerFromQuestionMappingCode(weightCode);
         var getFeet = ns._getAnswerFromQuestionMappingCode(feetCode);
         var getInches = ns._getAnswerFromQuestionMappingCode(inchesCode);

         if (getWeight == "" || getFeet == "" || getInches == "") {
             return "0";
         }
         var weight = parseInt(getWeight, 10);
         var feet = parseInt(getFeet, 10);
         var inches = parseInt(getInches, 10);

         var height = (feet * 12) + inches; //In inches
         if (weight == null || feet == null || inches == null || height == 0) {
             return "0";
         }
         var BMI = ((weight / (height * height)) * 703);
         var roundedBMI = Math.round(BMI * 100) / 100
         return roundedBMI;
     }


     ns._computeNoneoftheseApplyforEligibility = function computeNoneoftheseApplyforEligibility(item) {
         var mappingCodes = item.NeededQuestionMappingCodes();
         for (var i = 0; i < mappingCodes.length; i++) {
             var currentAnswer = ns._getAnswerFromQuestionMappingCode(mappingCodes[i]);
             if (currentAnswer && (currentAnswer.toLowerCase() === "y" || currentAnswer.toLowerCase() === "yes")) {
                 return "N";
             }
         }
         return "Y";
     }


     ns._computeAgeasofApril1 = function computeAgeasofApril1(item) {
         if (EXCHANGE.user.UserSession.UserProfile.dateOfBirth == "") {
             return "0";
         }
         var birthDate = moment(EXCHANGE.user.UserSession.UserProfile.dateOfBirth).utc();
         var today = moment.utc();
         var calcAgeasofApril1 = today.diff(birthDate, 'years');
         return calcAgeasofApril1;
     };

     ns._computeBCBSAZAgeasofPartBEffectiveDate = function computeBCBSAZAgeasofPartBEffectiveDate(item) {
         var medPartBCode = item.NeededQuestionMappingCodes()[0];
         var medPartBDate = moment(ns._getAnswerFromQuestionMappingCode(medPartBCode));
         if (EXCHANGE.user.UserSession.UserProfile.dateOfBirth == "" || medPartBDate == null) {
             return "0";
         }
         var birthDate = moment(EXCHANGE.user.UserSession.UserProfile.dateOfBirth).utc();
         var calcAge = medPartBDate.diff(birthDate, 'years');
         return calcAge;
     };

     ns._computeUHCCalcyearspastinitialenrollment = function computeUHCCalcyearspastinitialenrollment(item) {
         var medPartBCode = item.NeededQuestionMappingCodes()[0];
         var medPartBDate = moment(ns._getAnswerFromQuestionMappingCode(medPartBCode));
         if (EXCHANGE.user.UserSession.UserProfile.coverageBeginsDate == "" || medPartBDate == null) {
             return "0";
         }
         //Coverage effective date for the plan being enrolled in  == coverage begin date 
         var coverageDate = moment(EXCHANGE.user.UserSession.UserProfile.coverageBeginsDate).utc();
         var UHCyears = coverageDate.diff(medPartBDate, 'years');
         return UHCyears;
     };

     ns._computeQuotedPremium = function computeQuotedPremium(item) {
         return EXCHANGE.viewModels.ApplicationPlanTileViewModel.planModel().premiumValue_lbl;
     };

     ns._computeAge = function computeAge(item) {
         if (EXCHANGE.user.UserSession.UserProfile.dateOfBirth == "" || EXCHANGE.user.UserSession.UserProfile.coverageBeginsDate == "") {
             return "0";
         }
         var birthDate = moment(EXCHANGE.user.UserSession.UserProfile.dateOfBirth).utc();
         var coverageDate = moment(EXCHANGE.user.UserSession.UserProfile.coverageBeginsDate).utc();
         birthDate.startOf("month");
         var age = coverageDate.diff(birthDate, 'years');
         return age;
     };

     ns._computeEnrollMedicarePartBInLastSix = function computeEnrollMedicarePartBInLastSix(item) {
         var medPartBCode = item.NeededQuestionMappingCodes()[0];
         var medPartBDate = moment(ns._getAnswerFromQuestionMappingCode(medPartBCode));
         if (medPartBDate == null) {
             return "N";
         }
         medPartBDate = medPartBDate.startOf("month");
         var coverageDate;
         if (EXCHANGE.user.UserSession.UserProfile.coverageBeginsDate) {
             if (moment(EXCHANGE.user.UserSession.UserProfile.coverageBeginsDate) && moment(EXCHANGE.user.UserSession.UserProfile.coverageBeginsDate).utc())
                 coverageDate = moment(EXCHANGE.user.UserSession.UserProfile.coverageBeginsDate).utc();
             else
                 coverageDate = EXCHANGE.user.UserSession.UserProfile.coverageBeginsDate;
         } else {
             coverageDate = null;
         }
         if (coverageDate == null) {
             return "N";
         }
         if (medPartBDate <= coverageDate && medPartBDate >= coverageDate.subtract("months", 6)) {
             return "Y";
         }
         return "N";
     };

     ns._computeTurnSixtyFiveInLastSix = function computeTurnSixtyFiveInLastSix(item) {
         if (EXCHANGE.user.UserSession.UserProfile.dateOfBirth == "" || EXCHANGE.user.UserSession.UserProfile.coverageBeginsDate == "") {
             return "N";
         }
         var medicareMinAge = app.exchangeContext && app.exchangeContext.ExchangeContext && app.exchangeContext.ExchangeContext.medicareMinAge ? app.exchangeContext.ExchangeContext.medicareMinAge() : 65;
         var sixtyFiveBirthDate = moment(EXCHANGE.user.UserSession.UserProfile.dateOfBirth).startOf("month").utc().add("years", medicareMinAge);
         var coverageDate = moment(EXCHANGE.user.UserSession.UserProfile.coverageBeginsDate).utc();
         if (sixtyFiveBirthDate <= coverageDate && sixtyFiveBirthDate >= coverageDate.subtract("months", 6)) {
             return "Y";
         }
         return "N";
     };

     ns._computeLosingCoverageAndEligibles = function computeLosingCoverageAndEligibles(item) {
         var mappingCodes = item.NeededQuestionMappingCodes();
         for (var i = 0; i < mappingCodes.length; i++) {
             var currentAnswer = ns._getAnswerFromQuestionMappingCode(mappingCodes[i]);
             if (currentAnswer && (currentAnswer.toLowerCase() === "y" || currentAnswer.toLowerCase() === "yes")) {
                 return "Y";
             }
         }

         return "N";
     };

     ns._computeMedPartBEffectiveWithinSixMonthsOfSixtyFive = function computeMedPartBEffectiveWithinSixMonthsOfSixtyFive(item) {
         var enrollMedicarePartBInLast6 = ns._computeEnrollMedicarePartBInLastSix(item).toLowerCase();
         var turnSixtyFiveinLast6 = ns._computeTurnSixtyFiveInLastSix(item).toLowerCase();
         if ((enrollMedicarePartBInLast6 === 'yes' || enrollMedicarePartBInLast6 === 'y') &&
            (turnSixtyFiveinLast6 === 'yes' || turnSixtyFiveinLast6 === 'y')) {
             return "Y";
         }

         return "N";
     };

     ns._computeCombineToShowQuestions = function computeCombineToShowQuestions(item) {
         var mappingCodes = item.NeededQuestionMappingCodes();
         for (var i = 0; i < mappingCodes.length; i++) {
             var currentAnswer = ns._getAnswerFromQuestionMappingCode(mappingCodes[i]);
             if (currentAnswer && (currentAnswer.toLowerCase() === "y" || currentAnswer.toLowerCase() === "yes")) {
                 return "Y";
             }
         }

         return "N";
     };

     ns._getAnswerFromQuestionMappingCode = function getAnswerFromQuestionMappingCode(mappingCode) {
         var answer, thisPageQuestions;
         if (app.viewModels.ApplicationPageViewModel) {
             thisPageQuestions = app.viewModels.ApplicationPageViewModel.items();
         }
         else {
             thisPageQuestions = [];
         }
         $.each(thisPageQuestions, function (i, question) {
             if (question.QuestionMappingCode() === mappingCode) {
                 if (question.SelectedAnswer && question.SelectedAnswer()) {
                     answer = question.SelectedAnswer().SaveValue();
                 }
                 else {
                     if (question.Answer().SaveAnswer && question.Answer().SaveAnswer()) {
                         answer = question.Answer().SaveAnswer();
                     } else {
                         answer = question.Answer().Answer();
                     }
                 }
                 if (question.ItemType) {
                     if (question.ItemType() === EXCHANGE.enums.ApplicationItemTypeEnum.FirstDate) {
                         answer = question.Answer().Answer();
                         if (answer.split("/")[0] == "0" || answer.split("/")[2] == "0")
                             answer = "";
                     } 
                 }


                 // if (answer) {
                 return false;
                 // }
             }
         });
         if (!answer) {
             $.each(app.applicationPage.AllItems, function (i, question) {
                 if (question.QuestionMappingCode === mappingCode) {
                     if (question.SelectedAnswer) {
                         answer = question.SelectedAnswer.SaveValue;
                     }
                     else if (question.Answer.SaveAnswer) {
                         answer = question.Answer.SaveAnswer;
                     }
                     else {
                         answer = question.Answer.Answer;
                     }
                     return false;
                 }
             });
         }

         return answer || "";
     };

     ko.bindingHandlers.setCurrentDiv = {
         update: function (element) {
             if (!(typeof app.application.itemCountInCurrentDiv === 'undefined') && app.application.itemCountInCurrentDiv === 0) {
                 $(element).addClass('hide-application-item');
             }
             app.application.currentDiv = $(element).prev();
             app.application.itemCountInCurrentDiv = 0;
         }
     };

     ko.bindingHandlers.addToCurrentDiv = {
         update: function (element) {
             var toAdd = $(element).prev();
             if (toAdd.find($(app.application.currentDiv)).length === 0) {
                 $(app.application.currentDiv).append(toAdd);
                 app.application.itemCountInCurrentDiv++;
             }
         }
     };

     ko.bindingHandlers.isNextItemChild = {
         update: function (element) {
             if ($(element).next().hasClass('greyarea')) {
                 $(element).removeClass('next-not-child');
             } else {
                 $(element).addClass('next-not-child');
             }
         }
     };
     ko.bindingHandlers.computedDate = {
         update: function (element, valueAccessor) {
             var item = ko.utils.unwrapObservable(valueAccessor());
             if (!app.applicationReview) {
                 item.Answer().Answer(item.sep_Date());
             }
         }
     };

     ko.bindingHandlers.datepicker = {
         init: function (element, valueAccessor, allBindingsAccessor) {
             //initialize datepicker with some optional options
             var options = allBindingsAccessor().datepickerOptions || {};
             $(element).datepicker(options);

             //handle the field changing
             ko.utils.registerEventHandler(element, "change", function () {
                 var observable = valueAccessor();
                 observable($(element).datepicker().val());
             });

             //handle disposal (if KO removes by the template binding)
             ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                 $(element).datepicker("destroy");
             });

         },
         update: function (element, valueAccessor) {
             var value = ko.utils.unwrapObservable(valueAccessor()),
            current = $(element).datepicker("getDate");

             if (ax_valid(value) === true) {
                 //if (value - current !== 0) {
                 //$(element).datepicker("setDate", value);
                 $(element).datepicker({ dateFormat: "mm/dd/yy", changeMonth: true,
                     changeYear: true, yearRange: '1900:2020'
                 }).val(value);
             }
         }
     };
     function ax_valid(value) {
         try {
             jQuery.datepicker.parseDate('m/dd/yy', value);
             return true;
         }
         catch (e) { return false; }
     }

 } (EXCHANGE, jQuery));
