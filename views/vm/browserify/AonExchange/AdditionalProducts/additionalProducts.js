// JavaScript Document

$(document).ready(function () {

    var productName = "";

    //More Link on Plan Type page
    $(".plan-summary p, .plan-summary ul").click(function (e) {

        var $moreLink = $(this).closest(".plan-summary").find(".more-link:eq(0)");
        $moreLink
			.toggleText("Less", "More")
			.toggleClass("open")
			.parent().siblings(".more-text:eq(0)").toggle();
        e.stopPropagation();
    });

    $(".plan-inner img").click(function (e) {

        productName = $(this).closest(".plan-inner").find("img").attr('src');

    });

    $(".plan-summary span").click(function (e) {

        productName = $(this).closest(".plan-summary").find("h3").html().trim().toLowerCase();

    });


    $(".plan-summary").mouseenter(function () {
        productName = $(this).closest(".plan-summary").find("h3").html().trim().toLowerCase();
        $(this).addClass("plan-summary-hovered");

    }).mouseleave(function () {
        $(this).removeClass("plan-summary-hovered");
    });


    //Popup Trigger on Plan Type Page
    $('#externalpopup').modalPopLite({ openButton: '.has-popup', closeButton: '.closepopup' });

    //Open additional plan
    $(".savebtn").click(function (e) {

        var pageLink = ""
        if (productName.indexOf("renaissance") != -1) {
            pageLink = "http://www.renaissancedental.com/aon";
        } else if (productName.indexOf("aarp") != -1) {
            pageLink = "https://www.deltadentalins.com/indEnroll/?issuerCode=AARP-BROKER&brokerId=2111611&utm_source=AON&utm_medium=catalog&utm_campaign=tile";
        } else if (productName.indexOf("cigna") != -1) {
            pageLink = "https://aon.cignaindividual.com";
        } else if (productName.indexOf("vsp") != -1) {
            pageLink = "https://www.vspdirect.com/4aon?smart_link=VSPSLC002";
        }

        var a = document.createElement("a");

        if (!a.click) {
            window.location = pageLink;
            return;
        }

        a.setAttribute("href", pageLink);
        a.setAttribute("target", "_blank");
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
    });

});

jQuery.fn.toggleText = function (value1, value2) {
    return this.each(function () {
        var $this = $(this),
            text = $this.text();

        if (text.indexOf(value1) > -1)
            $this.text(text.replace(value1, value2));
        else
            $this.text(text.replace(value2, value1));
    });
};