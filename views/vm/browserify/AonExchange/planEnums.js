(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.PlanTypeEnum = {

        MEDICAREADVANTAGE: 0,
        MEDIGAP: 1,
        PRESCRIPTIONDRUG: 2,
        DENTAL: 3,
        VISION: 4,
        DENTALANDVISION: 5

    };

} (EXCHANGE, this));

(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.PlanTypeNameEnum = {

        MEDICAREADVANTAGE: 'Medicare Advantage',
        MEDIGAP: 'Medigap',
        PRESCRIPTIONDRUG: 'Prescription Drug',
        DENTAL: 'Dental',
        VISION: 'Vision',
        DENTALANDVISION: 'Dental and Vision'

    };

} (EXCHANGE, this));

(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.AttributeDataTypeEnum = {

        STRING: 0,
        NUMERIC: 1,
        DATETIME: 2,
        CURRENCY: 3

    };

} (EXCHANGE, this));


(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.PremiumFrequency = {

        ANNUAL: 0,
        SEMIANNUAL: 1,
        MONTHLY: 2,
        QUARTERLY: 3,
        BIMONTHLY: 4,
        BIWEEKLY: 5,
        WEEKLY: 6,
        DAILY: 7

    };

} (EXCHANGE, this));


(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.TemplateCodeEnum = {
    
        SEARCHSUMMARY: 0,
        SUMMARYPLANDETAILS: 1,
        SUPPLEMENTSUMMARYDETAIL: 2

    };

} (EXCHANGE, this));

//for indexing into generic arrays
(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.TabEnum = {

        MEDICAREADVANTAGE: 0,
        MEDIGAP: 1,
        PRESCRIPTIONDRUG: 2

    };

} (EXCHANGE, this));

//for switching tabs
(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.TabIdEnum = {

        MEDICAREADVANTAGE: 'advantage',
        MEDIGAP: 'medigap',
        PRESCRIPTIONDRUG: 'drugs'

    };

} (EXCHANGE, this));

//for switching tabs
(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.OtherCoverageEnumID = {

        DENTAL: 'dental',
        VISION: 'vision'

    };

} (EXCHANGE, this));

//for indexing into generic arrays
(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.OtherCoverageEnum = {

        DENTAL: 0,
        VISION: 1
    };

} (EXCHANGE, this));

//for switching tabs
(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.SupplementAvailabilityEnum = {

        INCLUDED: 0,
        OPTIONAL: 1

    };

} (EXCHANGE, this));

//for get help call center hours, matches system.dayofweek enum
(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.DayOfWeek = {
        SUNDAY: 0,
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6
    };

} (EXCHANGE, this));

//for automatic scrolling on plan details
(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.AnchorTagEnum = {
        NONE: 0,
        DOCTORHOSPITALVISIT: 3,
        RXMED: 2,
        DENTAL: 3,
        VISION: 4,
        DEDUCTIBLE: 5,
        DOCTORVISIT: 6,
        ANNUALMAX: 7,
        TYPE: 8,
        BASICMEDICALCOVERAGE: 9,
        TIERVALUES: 10
    };

} (EXCHANGE, this));

//State for if an Agent can sell this plan
(function(app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.enums');

    ns.ReadyToSellEnum = {
        CanSell: 0,
        AHIP: 1,
        License: 2,
        Contract: 3,
        Certification: 4,
        StateApproval: 5
    };
}(EXCHANGE));