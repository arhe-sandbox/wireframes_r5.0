(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.partnerLanding');

    // Each Partner Landing page will include the PartnerLandingContext control, which 
    // includes this Javascript file. Thus, the "partnerLanding" namespace (created above) 
    // and the specific partnerCode value (written below) are available to all other code
    // on such a page. In contrast, pages other than Partner Landing pages will lack both 
    // the namespace and the partnerCode. Note that logic on some shared controls is driven 
    // by the existence or absence of these values.  

    $(document).ready(function () {
        EXCHANGE.partnerLanding.partnerCode = $('#partnerCode').val();
    });

} (EXCHANGE));