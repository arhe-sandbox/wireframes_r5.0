(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');


   

    ns.PharmacySearchViewModel = function PharmacySearchViewModel() {
        if (!(this instanceof PharmacySearchViewModel)) {
            return new PharmacySearchViewModel();
        }
        var self = this;
        self.zip = ko.observable("");
        self.zip.subscribe(function (newValue) {
             app.pharmacySearch.getPharmacies();
          
        });
        self.allAvailablePharmacies = ko.observableArray([]);
        self.myPharmacies = ko.observableArray([]);
        self.noMyPharmacy_Lbl = ko.observable("");
        self.myPharmacy_Lbl = ko.observable("");
        self.myPharmacies_Lbl = ko.observable("");
        self.availablePharmacies_Lbl = ko.observable("");
        self.weFoundSlice1_Lbl = ko.observable("");
        self.weFoundSlice2_Lbl = ko.observable("");
        self.modifySearch_Lbl = ko.observable("");
        self.selectPharmacy_Lbl = ko.observable("");
        self.removePharmacy_Lbl = ko.observable("");
        self.helpText_Lbl = ko.observable("");
        self.btnbarHelpText_Lbl = ko.observable("");
        self.selRadius = ko.observable("");
        self.updateText_Btn =  ko.observable("");

        self.radiusList = ko.observableArray([]);
        self.availablePharmacies = ko.computed({
            read: function () {
                var allPharms = self.allAvailablePharmacies();
                var pharms = [];
                for (var i = 0; i < allPharms.length; i++) {

                    if (allPharms[i].Distance <= self.selRadius())
                        pharms.push(allPharms[i]);
                }
                return pharms;
            },


            owner: this,
            deferEvaluation: true
        });


        self.weFoundSlice1_LblDisplay = ko.computed({
            read: function () {

                return self.weFoundSlice1_Lbl().format(self.availablePharmacies().length);

            },
            owner: this,
            deferEvaluation: true
        });

        self.weFoundSlice2_LblDisplay = ko.computed({
            read: function () {

                return self.weFoundSlice2_Lbl().format(self.zip());

            },
            owner: this,
            deferEvaluation: true
        });

        PharmacySearchViewModel.prototype.loadFromJSON = function loadFromJSON(pharmSearch) {
            var protoSelf = this;



            var aPharms = [];
            for (var i = 0; i < pharmSearch.AvailablePharmacies.Pharmacies.length; i++) {
                aPharms.push(pharmSearch.AvailablePharmacies.Pharmacies[i]);
            }

            protoSelf.allAvailablePharmacies(aPharms);


            var myPharms = [];
            for (var j = 0; j < pharmSearch.MyPharmacies.length; j++) {
                myPharms.push(pharmSearch.MyPharmacies[j]);
            }
            protoSelf.myPharmacies(myPharms);


            var radii = [];

            for (var k = 0; k < pharmSearch.RadiusList.length; k++) {
                radii.push(pharmSearch.RadiusList[k]);
            }

            protoSelf.zip(pharmSearch.Zip);
            protoSelf.radiusList(radii);
            protoSelf.selRadius(pharmSearch.DefaultRadius);
            protoSelf.weFoundSlice1_Lbl(pharmSearch.WeFoundSlice1_Lbl);
            protoSelf.weFoundSlice2_Lbl(pharmSearch.WeFoundSlice2_Lbl);

            protoSelf.selRadius(pharmSearch.DefaultRadius);
            protoSelf.noMyPharmacy_Lbl(pharmSearch.NoMyPharmacy_Lbl);
            protoSelf.myPharmacy_Lbl(pharmSearch.MyPharmacy_Lbl);
            protoSelf.myPharmacies_Lbl(pharmSearch.MyPharmacies_Lbl);
            protoSelf.availablePharmacies_Lbl(pharmSearch.AvailablePharmacies_Lbl);
            protoSelf.weFoundSlice1_Lbl(pharmSearch.WeFoundSlice1_Lbl);
            protoSelf.weFoundSlice2_Lbl(pharmSearch.WeFoundSlice2_Lbl);
            protoSelf.modifySearch_Lbl(pharmSearch.ModifySearch_Lbl);
            protoSelf.selectPharmacy_Lbl(pharmSearch.SelectPharmacy_Lbl);
            protoSelf.removePharmacy_Lbl(pharmSearch.RemovePharmacy_Lbl);
            protoSelf.helpText_Lbl(pharmSearch.HelpText_Lbl);
            protoSelf.btnbarHelpText_Lbl(pharmSearch.ButtonBarHelpText_Lbl);
            protoSelf.updateText_Btn(pharmSearch.UpdateText_Btn); 

            $('.dropdownsmall').dropkick();


            $('.dropdownsmall').dropkick({
                change: function (value, label) {
                    if (value != protoSelf.selRadius())
                        protoSelf.selRadius(value);
                }
            });
            return protoSelf;
        };
    };

} (EXCHANGE, this));
