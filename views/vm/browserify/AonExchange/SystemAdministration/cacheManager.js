(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.cacheManager');
    app.namespace("EXCHANGE.viewModels");

    $(document).ready(function () {
        ns.initializeCacheManager();
    });

    ns.initializeCacheManager = function initializeCacheManager() {
        ns.setupViewModels();
        ns.loadData();
        ns.wireupJqueryEvents();
    };

    ns.setupViewModels = function setupViewModels() {
        if (!app.viewModels.CacheManagerViewModel) {
            app.viewModels.CacheManagerViewModel = app.models.CacheManagerViewModel();

            // The element with id "cache-clearing" is located in the webpart CacheClearing.ascx.
            ko.applyBindings(app.viewModels, $('#cache-manager').get(0));
        }
    };

    ns.loadData = function loadData() {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SystemAdministration/GetCacheManagerViewModel",
            dataType: "json",
            success: function (data) {
                var cacheManagerViewModel = data;
                if (cacheManagerViewModel.AuthorizationFailed) {
                    // requirement is that we redirect someone to the home page if they don't have access to see the requested page
                    app.functions.redirectToRelativeUrlFromSiteBase("home.aspx");
                } else {
                    app.viewModels.CacheManagerViewModel = app.viewModels.CacheManagerViewModel.loadFromJSON(cacheManagerViewModel);
                }
            },
            error: function (data) {
                alert("Error in cache management loadData! Placeholder; a better error message is needed here!");
            }
        });
    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $('#cache-manager').on('click', '.cacheClearSubmit', function (e) {

            var result = confirm("Do you want to remove selected Cache ?");
            if (result == true) {
                //Logic to delete the item
                var cacheGroupName = $(this).attr("id");

                app.ButtonSpinner = $(this).ButtonSpinner({ buttonType: app.enums.ButtonType.LARGEGREEN });
                ns.submitRequest(false, cacheGroupName);              

            }
        });

        $('#cache-manager').on('click', '#clearAll', function (e) {
            var result = confirm("Do you want to remove all Caches ?");
            if (result == true) {
                app.ButtonSpinner = $(this).ButtonSpinner({ buttonType: app.enums.ButtonType.LARGEGREEN });
                ns.submitRequest(true);
            }
        });

        $('#cache-manager').on('click', '#loadAll', function (e) {
            var result = confirm("Do you want to load all Caches ?");
            if (result == true) {

                app.ButtonSpinner = $(this).ButtonSpinner({ buttonType: app.enums.ButtonType.LARGEGREEN });
                ns.submitLoadRequest(true);
            }
        });

        $('#cache-manager').on('click', '.cacheLoadSubmit', function (e) {
            var result = confirm("Do you want to reload selected Cache ?");
            if (result == true) {
                var cacheGroupName = $(this).attr("id");

                app.ButtonSpinner = $(this).ButtonSpinner({ buttonType: app.enums.ButtonType.LARGEGREEN });
                ns.submitLoadRequest(false, cacheGroupName);
             
            }
        });
    };

    ns.submitRequest = function submitRequest(shouldClearAll, cacheGroupName) {
        // Note: cacheGroupName might be undefined; in that case, shouldClearAll should be true. 

        var cacheManagerArgs = {
            CacheGroup: cacheGroupName,
            ShouldClearAll: shouldClearAll
        };

        var myArray = [];

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SystemAdministration/ClearCacheManagerEntries",
            dataType: "json",
            data: JSON.stringify(cacheManagerArgs),
            success: function (data) {
                var cacheManagerValidation = data;

                if (cacheManagerValidation.AuthorizationFailed) {
                    // requirement is that we redirect someone to the home page if they don't have access to see the requested page
                    app.functions.redirectToRelativeUrlFromSiteBase("home.aspx");
                } else {
                    $.each(cacheManagerValidation.CacheKeyResults, function (index, order) {
                        myArray.push([index, order]);
                    });
                    app.viewModels.CacheManagerViewModel.CacheKeyResults(myArray);
                    app.ButtonSpinner.Stop();
                }
            },
            error: function (data) {
                alert("Error in cache clearing submit! Placeholder; a better error message is needed here!");
            }
        });
    };

    ns.submitLoadRequest = function submitLoadRequest(shouldLoadAll, cacheGroupName) {
        // Note: cacheGroupName might be undefined; in that case, shouldClearAll should be true. 

        var cacheManagerArgs = {
            CacheGroup: cacheGroupName,
            ShouldClearAll: shouldLoadAll
        };

        var myArray = [];

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SystemAdministration/LoadCacheManagerEntries",
            dataType: "json",
            data: JSON.stringify(cacheManagerArgs),
            success: function (data) {
                var cacheManagerValidation = data;

                if (cacheManagerValidation.AuthorizationFailed) {
                    // requirement is that we redirect someone to the home page if they don't have access to see the requested page
                    app.functions.redirectToRelativeUrlFromSiteBase("home.aspx");
                } else {
                    $.each(cacheManagerValidation.CacheKeyResults, function (index, order) {
                        myArray.push([index, order]);
                    });
                    app.viewModels.CacheManagerViewModel.CacheKeyResults(myArray);
                    app.ButtonSpinner.Stop();
                }
            },
            error: function (data) {
                alert("Error in cache clearing submit! Placeholder; a better error message is needed here!");
            }
        });
    };

} (EXCHANGE));
