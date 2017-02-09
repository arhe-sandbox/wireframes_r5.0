(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.addToCartInEligibleFamilyMember');
    ns.planGuid = "";

    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializeAddToCartInEligibleFamilyMember();
    });


    ns.initializeAddToCartInEligibleFamilyMember = function initializeAddToCartInEligibleFamilyMember() {
        EXCHANGE.viewModels.AddToCartInEligibleFamilyMemberViewModel = EXCHANGE.models.AddToCartInEligibleFamilyMemberViewModel();

        var addToCartInEligibleFamilyMemberLb = new EXCHANGE.lightbox.Lightbox({
            name: 'addToCartInEligibleFamilyMember',
            divSelector: '#addToCartInEligibleFamilyMember-popup',
            openButtonSelector: '#addToCartInEligibleFamilyMember-open-button',
            closeButtonSelector: '#addToCartInEligibleFamilyMember-close-button',
            beforeOpen: function () {
                return true;
            },
            afterOpen: function (item) {
                            
                ns.addToCartInEligibleFamilyMemberPopupLoad();

                $(document).on('click', '#addToCartInEligibleFamilyMemberContinueButton', function () {
                    app.cart.CartAPI.addAncillaryPlanToCart(EXCHANGE.models.AddToCartInEligibleFamilyMemberViewModel.planGuid, true, true);
                });
            }

        });

    };



    ns.addToCartInEligibleFamilyMemberPopupLoad = function addToCartInEligibleFamilyMemberPopupLoad() {

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Ancillary/AddToCartInEligibleFamilyMemberViewModel",
            dataType: "json",
            success: function (data) {
                EXCHANGE.viewModels.AddToCartInEligibleFamilyMemberViewModel.loadFromJSON(data);
            },
            failure: function (data) {
                alert('failure loading lightbox');
            }
        });

    };


} (EXCHANGE, this));

