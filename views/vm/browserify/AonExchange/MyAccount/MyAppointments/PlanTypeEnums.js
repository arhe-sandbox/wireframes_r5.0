(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.PlanTypeEnum = {
        MedicareAdvantage: 0,
        Medigap: 1,
        PrescriptionDrugPlan: 2,
        Dental: 3,
        Vision: 4,
        DentalandVision: 5,
        Other: 6,
        IndividualAndFamilyCoverage: 7,
        QhpCoverage: 8,
        ShortTermCoverage: 9,
        PreMedicareRider: 10
    };

    ns.PlanTypeEnumName = {
        MedicareAdvantage: "Medicare Advantage plan",
        Medigap: "Medigap plan (supplement) with a prescription drug plan",
        PrescriptionDrugPlan: "Prescription Drug plan",
        Dental: "Dental plan",
        Vision: "Vision plan",
        DentalandVision: "Dental and Vision plans",
        Other: "No Plan",
        IndividualAndFamilyCoverage: "Individual and Family plan",
        QhpCoverage: "QHP Coverage",
        ShortTermCoverage: "Short term coverage",
        PreMedicareRider: "Pre-Medicare Rider"
    };

} (EXCHANGE));