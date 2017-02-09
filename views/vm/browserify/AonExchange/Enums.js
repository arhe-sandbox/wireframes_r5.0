(function (app, global) {
    var ns = app.namespace('EXCHANGE.enums');

    ns.ButtonType = {

        LARGEGREEN: 0,
        SMALLGREEN: 1,
        LARGEBLUE: 2,
        SMALLBLUE: 3,
        LARGEDARKGRAY: 4,
        LARGEMEDIUMGRAY: 5,
        LARGELIGHTGRAY: 6,
        SMALLLIGHTGRAY: 7
    };

    ns.ClientType = {
        Retail: 0,
        B2B: 1
    };

    ns.PharmacyType = {
        Retail: 0,
        AggregateRetail: 1,
        MailOrder: 2
    };

    ns.SigTyp = {
        Voice: 0,
        Wet: 1
    };

    ns.SigName = {
    Voice: "Voice",
    Wet: "Wet"}
} (EXCHANGE, this));

