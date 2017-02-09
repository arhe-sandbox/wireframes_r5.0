(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.SearchState = function SearchState() {
        if (!(this instanceof SearchState)) {
            return new SearchState();
        }
        var self = this;

        self.FiltersForTabs = [[]];
        self.SelectedInsurersForTabs = [[]];
        self.SelectedDoctorsForTabs = [[]];

        self.MedigapSortBy = '';
        self.PrescriptionDrugSortBy = '';
        self.MedicareAdvantageSortBy = '';

        SearchState.prototype.loadSearchState = function loadSearchState(params) {
            var protoSelf = this;
            params = params || { };
            if (params.FiltersForTabs) {
                protoSelf.FiltersForTabs = params.FiltersForTabs;
            }
            else {
                protoSelf.FiltersForTabs = [];
                $.each(app.enums.TabEnum, function (index, item) {
                    protoSelf.FiltersForTabs.push([]);
                });
            }

            //grab selected networks/insurers from params, if they are set,
            //otherwise, build a default list of lists with the correct number of lists
            if (params.SelectedNetworksForTabs) {
                protoSelf.SelectedNetworksForTabs = params.SelectedNetworksForTabs;
            }
            else {
                //iterate thru tabenums and create a list for each
                protoSelf.SelectedNetworksForTabs = [];
                $.each(app.enums.TabEnum, function (index, item) {
                    protoSelf.SelectedNetworksForTabs.push([]);
                });
            }

            if (params.SelectedInsurersForTabs) {
                protoSelf.SelectedInsurersForTabs = params.SelectedInsurersForTabs;
            }
            else {
                //iterate thru tabenums and create a list for each
                protoSelf.SelectedInsurersForTabs = [];
                $.each(app.enums.TabEnum, function (index, item) {
                    protoSelf.SelectedInsurersForTabs.push([]);
                });
            }
            if (params.SelectedDoctorsForTabs) {
                protoSelf.SelectedDoctorsForTabs = params.SelectedDoctorsForTabs;
            }
            else {
                //iterate thru tabenums and create a list for each
                protoSelf.SelectedDoctorsForTabs = [];
                $.each(app.enums.TabEnum, function (index, item) {
                    protoSelf.SelectedDoctorsForTabs.push([]);
                });
            }

            protoSelf.MedigapSortBy = params.MedigapSortBy ? app.plans.SortRules().loadFromJson(params.MedigapSortBy) : app.plans.SortRules();
            protoSelf.PrescriptionDrugSortBy = params.PrescriptionDrugSortBy ? app.plans.SortRules().loadFromJson(params.PrescriptionDrugSortBy) : app.plans.SortRules();
            protoSelf.MedicareAdvantageSortBy = params.MedicareAdvantageSortBy ? app.plans.SortRules().loadFromJson(params.MedicareAdvantageSortBy) : app.plans.SortRules();

            return protoSelf;
        };

        SearchState.prototype.toJS = function toJS() {
            var protoSelf = this;

            //make sure any empty arrays have an empty string so they get to the server
            var formattedFiltersForTabs = $.extend(true, [], protoSelf.FiltersForTabs);
            var formattedSelectedInsurers = $.extend(true, [], protoSelf.SelectedInsurersForTabs);
            var formattedSelectedDoctors = $.extend(true, [], protoSelf.SelectedDoctorsForTabs);
            $.each(formattedFiltersForTabs, function (index, item) {
                if (item.length == 0) {
                    formattedFiltersForTabs[index] = [''];
                }
            });
            $.each(formattedSelectedInsurers, function (index, item) {
                if (item.length == 0) {
                    formattedSelectedInsurers[index] = [''];
                }
            });
            $.each(formattedSelectedDoctors, function (index, item) {
                if (item.length == 0) {
                    formattedSelectedDoctors[index] = [''];
                }
            });

            return {
                FiltersForTabs: formattedFiltersForTabs,
                SelectedInsurersForTabs: formattedSelectedInsurers,
                SelectedDoctorsForTabs: formattedSelectedDoctors,

                MedigapSortBy: protoSelf.MedigapSortBy ? protoSelf.MedigapSortBy.toJS() : null,
                PrescriptionDrugSortBy: protoSelf.PrescriptionDrugSortBy ? protoSelf.PrescriptionDrugSortBy.toJS() : null,
                MedicareAdvantageSortBy: protoSelf.MedicareAdvantageSortBy ? protoSelf.MedicareAdvantageSortBy.toJS() : null
            };
        };

        return self;
    };

    //Ancillary Dental

    ns.AncSearchStateDental = function AncSearchStateDental() {
        if (!(this instanceof AncSearchStateDental)) {
            return new AncSearchStateDental();
        }
        var self = this;

        self.AncSelectedInsurersDental = [[]];

        self.DentalSortBy = '';

        AncSearchStateDental.prototype.loadSearchState = function loadSearchState(params) {
            var protoSelf = this;
            protoSelf.AncSelectedInsurersDental = null;

            params = params || {};

            if (params.AncSelectedInsurersDental) {
                protoSelf.AncSelectedInsurersDental = params.AncSelectedInsurersDental;
            }
            else {
                //iterate thru tabenums and create a list for each
                protoSelf.AncSelectedInsurersDental = [];
                $.each(app.enums.TabEnum, function (index, item) {
                    protoSelf.AncSelectedInsurersDental.push([]);
                });
            }

            protoSelf.DentalSortBy = params.DentalSortBy ? app.plans.SortRules().loadFromJson(params.DentalSortBy) : app.plans.SortRules();

            return protoSelf;
        };

        AncSearchStateDental.prototype.toJS = function toJS() {
            var protoSelf = this;

            //make sure any empty arrays have an empty string so they get to the server
            var formattedAncSelectedInsurersDental = $.extend(true, [], protoSelf.AncSelectedInsurersDental);

            $.each(formattedAncSelectedInsurersDental, function (index, item) {
                if (item.length == 0) {
                    formattedAncSelectedInsurersDental[index] = [''];
                }
            });


            return {
                AncSelectedInsurersDental: formattedAncSelectedInsurersDental,

                DentalSortBy: protoSelf.DentalSortBy ? protoSelf.DentalSortBy.toJS() : null
            };
        };
        return self;
    };

    //Ancillary Vision

    ns.AncSearchStateVision = function AncSearchStateVision() {
        if (!(this instanceof AncSearchStateVision)) {
            return new AncSearchStateVision();
        }
        var self = this;

        self.AncSelectedInsurersVision = [[]];

        self.VisionSortBy = '';

        AncSearchStateVision.prototype.loadSearchState = function loadSearchState(params) {
            var protoSelf = this;

            protoSelf.AncSelectedInsurersVision = null;

            params = params || {};

            if (params.AncSelectedInsurersVision) {
                protoSelf.AncSelectedInsurersVision = params.AncSelectedInsurersVision;
            }
            else {
                //iterate thru tabenums and create a list for each
                protoSelf.AncSelectedInsurersVision = [];
                $.each(app.enums.TabEnum, function (index, item) {
                    protoSelf.AncSelectedInsurersVision.push([]);
                });
            }

            protoSelf.VisionSortBy = params.VisionSortBy ? app.plans.SortRules().loadFromJson(params.VisionSortBy) : app.plans.SortRules();

            return protoSelf;
        };


        AncSearchStateVision.prototype.toJS = function toJS() {
            var protoSelf = this;

            //make sure any empty arrays have an empty string so they get to the server
            var formattedAncSelectedInsurersVision = $.extend(true, [], protoSelf.AncSelectedInsurersVision);

            $.each(formattedAncSelectedInsurersVision, function (index, item) {
                if (item.length == 0) {
                    formattedAncSelectedInsurersVision[index] = [''];
                }
            });

            return {
                AncSelectedInsurersVision: formattedAncSelectedInsurersVision,

                VisionSortBy: protoSelf.VisionSortBy ? protoSelf.VisionSortBy.toJS() : null
            };
        };
        return self;
    };
})(EXCHANGE, this);
