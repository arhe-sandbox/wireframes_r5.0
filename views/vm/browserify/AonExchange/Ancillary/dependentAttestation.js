(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.dependentAttestation');

    EXCHANGE.namespace('EXCHANGE.viewModels');

    $(document).ready(function () {
        ns.initializeDependentAttestation();
    });


    ns.initializeDependentAttestation = function initializeDependentAttestation() {
        EXCHANGE.viewModels.DependentAttestationViewModel = EXCHANGE.models.DependentAttestationViewModel();

        var dependentAttestationLb = new EXCHANGE.lightbox.Lightbox({
            name: 'dependentAttestation',
            divSelector: '#dependentAttestation-popup',
            openButtonSelector: '#dependentAttestation-open-button',
            closeButtonSelector: '#dependentAttestation-close-button',
            beforeOpen: function () {
                return true;
            },
            afterOpen: function () {
                ns.dependentAttestationPopupLoad();
            }

        });

    };



    ns.dependentAttestationPopupLoad = function dependentAttestationPopupLoad() {

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/Ancillary/DependentAttestationViewModel",
            dataType: "json",
            success: function (data) {
                EXCHANGE.viewModels.DependentAttestationViewModel.loadFromJSON(data);
            },
            failure: function (data) {
                alert('failure loading lightbox');
            }
        });

    };

   


} (EXCHANGE, this));

