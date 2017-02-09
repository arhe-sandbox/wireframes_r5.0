(function (app) {
    var ns = app.namespace('EXCHANGE.models');

    ns.ProgressBarViewModel = function ProgressBarViewModel() {
        if (!(this instanceof ProgressBarViewModel)) {
            return new ProgressBarViewModel();
        }
        var self = this;

        self.overview_lbl = ko.observable('');
        self.done_lbl = ko.observable('');
        self.application_lbl = ko.observable('');
        self.applicationTypes = ko.observableArray([]);
        self.currentPage = ko.observable('');
        
        self.barClass = ko.computed({
            read: function () {
                if (self.applicationTypes().length == 2) {
                    return 'chk-crumb four-steps';
                }
                else {
                    return 'chk-crumb three-steps';
                }
            },
            owner: this
        });
        
        ProgressBarViewModel.prototype.loadFromJSON = function loadFromJSON(serverViewModel) {
            var protoself = this;

            protoself.overview_lbl(serverViewModel.Overview_Lbl);
            protoself.done_lbl(serverViewModel.Done_Lbl);
            protoself.application_lbl(serverViewModel.Application_Lbl);
            protoself.currentPage(serverViewModel.CurrentPage);

            //fill application types array
            protoself.applicationTypes([]);

            var applicationTypesArray = serverViewModel.ApplicationTypes;
            if (applicationTypesArray && ($.isArray(applicationTypesArray))) {
                $.each(applicationTypesArray, function (index, item) {
                    protoself.applicationTypes.push(item);

                });
            }

            return protoself;
        };
    };


} (EXCHANGE));