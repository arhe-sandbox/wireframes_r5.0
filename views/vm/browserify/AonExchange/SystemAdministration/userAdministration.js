(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.userAdministration');
    app.namespace("EXCHANGE.viewModels");

    $(document).ready(function () {
        ns.initializeUserAdministration();
    });

    ns.initializeUserAdministration = function initializeUserAdministration() {
        var search = app.functions.getKeyValueFromWindowLocation('search');
        var checkAll = app.functions.getKeyValueFromWindowLocation('checkall');
        ns.setupViewModels();
        ns.loadData(search, checkAll);
        ns.wireupJqueryEvents();
    };

    ns.checkAllCheckboxes = function checkAllCheckboxes() {
        $('.UserAdministrationCheckbox').each(function () {
            $(this).attr('checked', true);
        });
    };

    ns.setupViewModels = function setupViewModels() {
        if (!app.viewModels.UserAdministrationViewModel) {
            app.viewModels.UserAdministrationViewModel = app.models.UserAdministrationViewModel();

            ko.applyBindings(app.viewModels, $('#user-manager').get(0));
        }
    };

    ns.loadData = function loadData(search, checkAll) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SystemAdministration/GetKenticoUsersViewModel",
            dataType: "json",
            data: JSON.stringify({ searchClause: search }),
            success: function (data) {
                var userAdministrationViewModel = data;
                if (userAdministrationViewModel.AuthorizationFailed) {
                    // requirement is that we redirect someone to the home page if they don't have access to see the requested page
                    app.functions.redirectToRelativeUrlFromSiteBase("home.aspx");
                } else {
                    app.viewModels.UserAdministrationViewModel = app.viewModels.UserAdministrationViewModel.loadFromJSON(userAdministrationViewModel);
                }
                if (checkAll == 'true') {
                    ns.checkAllCheckboxes();
                }
            },
            error: function (data) {
                alert("Error in User Administration!");
            }
        });
    };

    ns.wireupJqueryEvents = function wireupJqueryEvents() {
        $('#user-manager').on('click', '#deleteSelected', function (e) {
            var users = "";
            $('input[type=checkbox]:checked').each(function () {
                users = users + "," + $(this).val();
            });

            if (users != "") {
                users = users.substring(1);

                ns.submitRequest(users);
            } else {
                alert('Please select at least one user');
            }
        });
    };

    ns.submitRequest = function submitRequest(users) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/API/SystemAdministration/DeleteUsers",
            dataType: "json",
            data: JSON.stringify({ users: users }),
            success: function (result) {
                document.location.reload(true);
            },
            error: function (result) {
                alert("Error in deleting users");
            }
        });
    };

} (EXCHANGE));
