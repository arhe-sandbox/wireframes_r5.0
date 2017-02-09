(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.companyLanding');

    // Each Company Landing page will include the CompanyLandingContext control, which 
    // includes this Javascript file. Thus, the "companyLanding" namespace (created above) 
    // and the specific clientCode value (written below) are available to all other code
    // on such a page. In contrast, pages other than Company Landing pages will lack both 
    // the namespace and the clientCode. Note that logic on some shared controls is driven 
    // by the existence or absence of these values.  
    
    $(document).ready(function () {
        EXCHANGE.companyLanding.clientCode = $('#clientCode').val();
    });

} (EXCHANGE));
