(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.dependentSpouse');

    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializeDependentSpouse();
    });


    ns.initializeDependentSpouse = function initializeDependentSpouse() {
        EXCHANGE.viewModels.DependentSpouseViewModel = EXCHANGE.models.DependentSpouseViewModel();

        var dependentSpouseLb = new EXCHANGE.lightbox.Lightbox({
            name: 'dependentSpouse',
            divSelector: '#dependentSpouse-popup',
            openButtonSelector: '#dependentSpouse-open-button',
            closeButtonSelector: '#dependentSpouse-close-button',
            beforeOpen: function () {
                return true;
            },
            afterOpen: function () {
                ns.dependentSpousePopupLoad();
            },
            afterClose: function () {
                EXCHANGE.AncSearchHeader.checkDependentAttestation();
                // $.publish("EXCHANGE.lightbox.dependentAttestation.open");
                //EXCHANGE.WaitPopup.Close();
            }

        });

    };



    ns.dependentSpousePopupLoad = function dependentSpousePopupLoad() {

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Ancillary/DependentSpouseViewModel",
            dataType: "json",
            success: function (data) {
                EXCHANGE.viewModels.DependentSpouseViewModel.loadFromJSON(data);
            },
            failure: function (data) {
                alert('failure loading lightbox');
            }
        });

    };


} (EXCHANGE, this));

