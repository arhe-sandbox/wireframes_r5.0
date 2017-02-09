(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.drugs');

    ns.AllDrugs = {
        length: 0,
        push: function (drug) {
            if (drug) {
                this[drug.Name] = drug;
                this.length++;
            }
        },
        toArray: function () {
            var arr = [];
            for (var drug in this) {
                if (typeof this[drug] !== 'object' || this[drug] === undefined) {
                    continue;
                }
                arr.push(this[drug]);
            }
            return arr;
        }
    };

} (EXCHANGE, this));


(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.drugs');

    ns.AllDrugViewModels = {
        length: 0,
        push: function (drugVm) {
            if (drugVm && !this[drugVm.id()]) {
                this[drugVm.id()] = drugVm;
                this.length++;
            }
        },
        toArray: function () {
            var arr = [];
            for (var drugVm in this) {
                if (typeof this[drugVm] !== 'object' || this[drugVm] === undefined) {
                    continue;
                }
                arr.push(this[drugVm]);
            }
            return arr;
        }
    };

} (EXCHANGE, this));


(function (app, global) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.drugs');

    ns.DrugAPI = {
        //#region DrugAPI Functions
        addDrugToMedCabinet: function (userDrug, ajaxCallback) {
            var paramsJson = JSON.stringify({
                DosageDrugId: userDrug.SelectedDosage.Id,
                PackageDrugId: userDrug.SelectedPackage === undefined ||userDrug.SelectedPackage === null ? null : userDrug.SelectedPackage.Id,
                RefillOccurance: userDrug.RefillOccurance,
                RefillQuantity: userDrug.RefillQuantity,
                DrugId: userDrug.Drug.Id,
                PharmacyType: userDrug.PharmacyType
            });

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Drug/AddDrugToProfile",
                data: paramsJson,
                dataType: "json",
                success: function (data) {
                    var drugActionModel = data;
                    if (drugActionModel && drugActionModel.UserDrug && drugActionModel.PlanDrugs && drugActionModel.PlanDrugs) {
                        //the two lines below cause two consecutive redundant ajax calls.
                        //  because in searchresults.js we subscribe to the observable's value changing.
                        EXCHANGE.user.UserSession.UserDrugs.drugs.push(drugActionModel.UserDrug);
                        EXCHANGE.user.UserSession.UserDrugs.sortDrugs();
                        //end double ajax

                       // EXCHANGE.plans.PlanLoader.addPlanDrugToPlans(drugActionModel.PlanDrugs);

                    }

                   if (EXCHANGE.viewModels.NarrowMyResultsViewModel && app.user && app.user.UserSession && app.user.UserSession.UserDrugs && app.user.UserSession.UserDrugs.drugs().length == 1)
                   {
                   EXCHANGE.viewModels.NarrowMyResultsViewModel.sortByOptionsLists()[0].push("Total Cost");
                   EXCHANGE.viewModels.NarrowMyResultsViewModel.sortByOptionsLists()[2].push("Total Cost");
                   }
                    if ($.isFunction(ajaxCallback)) {
                        ajaxCallback();
                    }
                }
            });
        },

        changeDrugInMedCabinet: function (userDrug, ajaxCallback) {
            var paramsJson = JSON.stringify({
                DosageDrugId: userDrug.SelectedDosage.Id,
                PackageDrugId: userDrug.SelectedPackage === undefined ||userDrug.SelectedPackage === null? null : userDrug.SelectedPackage.Id,
                RefillOccurance: userDrug.RefillOccurance,
                RefillQuantity: userDrug.RefillQuantity,
                DrugId: userDrug.Drug.Id,
                UserDrugId: userDrug.Id,
                PharmacyType: userDrug.PharmacyType
            });

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Drug/ChangeDrugInProfile",
                data: paramsJson,
                dataType: "json",
                success: function (data) {
                    var drugActionModel = data;
                    var oldSelectedDosageId = "";
                    if (drugActionModel && drugActionModel.UserDrug && drugActionModel.PlanDrugs) {
                        var userDrugs = EXCHANGE.user.UserSession.UserDrugs.drugs();
                        for (var i = 0; i < userDrugs.length; i++) {
                            if (userDrugs[i].Id == drugActionModel.UserDrug.Id) {
                                oldSelectedDosageId = userDrugs[i].SelectedDosage.Id;
                                EXCHANGE.user.UserSession.UserDrugs.drugs.splice(i, 1);
                                break;
                            }
                        }
                       // EXCHANGE.plans.PlanLoader.removePlanDrugFromPlans(oldSelectedDosageId);

                        EXCHANGE.user.UserSession.UserDrugs.drugs.push(drugActionModel.UserDrug);
                        EXCHANGE.user.UserSession.UserDrugs.sortDrugs();
                       // EXCHANGE.plans.PlanLoader.addPlanDrugToPlans(drugActionModel.PlanDrugs);
                    }
                    if ($.isFunction(ajaxCallback)) {
                        ajaxCallback();
                    }
                }
            });
        },

        removeDrugFromMedCabinet: function (userDrug, ajaxCallback) {
            var paramsJson = JSON.stringify({
                DosageDrugId: userDrug.SelectedDosage.Id,
                PackageDrugId: userDrug.SelectedPackage === undefined||userDrug.SelectedPackage === null ? null : userDrug.SelectedPackage.Id,
                RefillOccurance: userDrug.RefillOccurance,
                RefillQuantity: userDrug.RefillQuantity,
                DrugId: userDrug.Drug.Id,
                UserDrugId: userDrug.Id,
                PharmacyType: userDrug.PharmacyType
            });

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Drug/RemoveDrugFromProfile",
                data: paramsJson,
                dataType: "json",
                success: function (data) {
                    var planDrugs = data;
                    if (planDrugs) {
                        var userDrugs = EXCHANGE.user.UserSession.UserDrugs.drugs();
                        for (var i = 0; i < userDrugs.length; i++) {
                            if (userDrugs[i].Id == userDrug.Id) {
                                EXCHANGE.user.UserSession.UserDrugs.drugs.splice(i, 1);
                                break;
                            }
                        }
                        if (app.viewModels.MyMedicationViewModel) {
                            app.viewModels.MyMedicationViewModel.lastAddedMed("");
                        }
                       // EXCHANGE.plans.PlanLoader.removePlanDrugFromPlans(userDrug.SelectedDosage.Id);

                        if (EXCHANGE.viewModels.NarrowMyResultsViewModel && app.user && app.user.UserSession && app.user.UserSession.UserDrugs && app.user.UserSession.UserDrugs.drugs().length == 0) {
                            var currentTabList = EXCHANGE.viewModels.NarrowMyResultsViewModel.sortByOptionsCurrentTab();
                            var currentTabIndex = currentTabList.indexOf("Total Cost");
                            if (currentTabIndex != -1) {
                                currentTabList.splice(currentTabIndex, 1);
                            }
                            EXCHANGE.searchResults.updateSelectedDropdowns();
                        }
                        
                    }
                    if ($.isFunction(ajaxCallback)) {
                        ajaxCallback();
                    }

		    EXCHANGE.ButtonSpinner.Stop();
                }
            });
        },

        autoCompleteDrugList: autoCompleteDrugs

        //#endregion
    };

    var pendingGetAllDrugsRequest = false;

    function autoCompleteDrugs(drugStart, ajaxCallback) {
        var parameters = { DrugStart: drugStart };
        var jsonParams = JSON.stringify(parameters);

        if (!pendingGetAllDrugsRequest) {
            pendingGetAllDrugsRequest = true;

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/API/Drug/AutoCompleteDrugList",
                data: jsonParams,
                dataType: "json",
                success: function (data) {
                    var result = data;
                    if (result) {

                        var drugs = [];
                        for (var i = 0; i < result.length; i++) {
                            drugs.push(result[i]);
                            ns.AllDrugs.push(result[i]);
                        }
                        pendingGetAllDrugsRequest = false;
                        if(drugs && drugs.length>0) {
                        ajaxCallback(drugs);
                        }
                    }
                }
            });
        }
    }

} (EXCHANGE, this));
