(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.Pre65");
    
    $(document).ready(function () {
        ns.initializePage();
        if ($.browser.mozilla) {              
            $('.pre65-personal-tabs ul li a').click(function () {
                var hrefId = $(this).attr('href');                
                if (hrefId == "#tabs-1" || hrefId == "tabs-1") {
                    $(".pre65-personal-tabs ul li a[href='#tabs-2']").removeClass('tab-btn active').addClass('tab-btn inactive');
                    $(".pre65-personal-tabs ul li a[href='#tabs-1']").removeClass('tab-btn inactive').addClass('tab-btn active');
                    $('#tabs-2').hide();
                    $('#tabs-1').show();
                    return false;
                }
                if (hrefId == "#tabs-2" || hrefId == "tabs-2") {
                    $(".pre65-personal-tabs ul li a[href='#tabs-2']").removeClass('tab-btn inactive').addClass('tab-btn active');
                    $(".pre65-personal-tabs ul li a[href='#tabs-1']").removeClass('tab-btn active').addClass('tab-btn inactive');
                    $('#tabs-1').hide();
                    $('#tabs-2').show();
                    return false;
                }
            });
        }

    });
    ns.initializePage = function initializePage() {
    };


    ns.GetPre65FindPlansViewModel = function GetPre65FindPlansViewModel() {

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Pre65/GetPre65FindPlansViewModel",
            dataType: "json",
            success: function (data) {

                if (data != "") {

                    var a = document.createElement("a");

                    a.setAttribute("href", data.RedirectUrl);

                    if (data.OpenInNewWindow) {
                        a.setAttribute("target", "_blank");
                    }
                    a.style.display = "none";
                    document.body.appendChild(a);

                    a.click();
                }


            }
        });
    };



} (EXCHANGE));
