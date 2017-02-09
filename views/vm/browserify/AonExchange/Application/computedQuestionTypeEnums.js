;
(function(app) {
    var ns = app.namespace("EXCHANGE.enums");

    ns.ComputedQuestionTypeEnum = {
        None: 0,
        EnrollMedicarePartBInLastSix: 1,
        TurnSixtyFiveInLastSix: 2,
        LosingCoverageAndEligibles: 3,
        MedPartBEffectiveWithinSixMonthsOfSixtyFive: 4,
        CombineToShowQuestions: 5,
        Age: 6,
        AARP: 10,
        AgeAsOfPartBDate: 8,
        GIOrOEP: 9,
        UHCCalcyearspastinitialenrollment: 7,
        BCBSAZAgeasofPartBEffectiveDate: 11,
        Quoted_Premium:14,
        AgeasofApril1: 15,
        BMI: 16,
        NoneoftheseApplyforEligibility: 17
    };

}(EXCHANGE));
