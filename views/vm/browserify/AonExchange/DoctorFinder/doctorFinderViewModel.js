(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.models');

    ns.DoctorFinderIntroViewModel = function DoctorFinderIntroViewModel() {
        if (!(this instanceof DoctorFinderIntroViewModel)) {
            return new DoctorFinderIntroViewModel();
        }
        var self = this;

        self.header_lbl = ko.observable('');
        self.doctorText_lbl = ko.observable('');
        self.doctorNote_lbl = ko.observable('');
        self.goBackButton_lbl = ko.observable('');
        self.continue_lbl = ko.observable('');
        self.imageText_lbl = ko.observable('');
        self.loginCreate_lbl = ko.observable('');

        DoctorFinderIntroViewModel.prototype.loadFromJSON = function loadFromJSON(doctorFinder) {
            var protoSelf = this;

            protoSelf.header_lbl(doctorFinder.Header_Lbl);
            protoSelf.doctorText_lbl(doctorFinder.DoctorText_Lbl);
            protoSelf.doctorNote_lbl(doctorFinder.DoctorNote_Lbl);
            protoSelf.goBackButton_lbl(doctorFinder.GoBackButton_Lbl);
            protoSelf.continue_lbl(doctorFinder.Continue_Lbl);
            protoSelf.imageText_lbl(doctorFinder.ImageText_Lbl);
            protoSelf.loginCreate_lbl(doctorFinder.LoginCreate_Lbl);

            return protoSelf;
        };

        return self;
    };

} (EXCHANGE, this));


(function (app) {
    //"use strict";
	var ns = app.namespace('EXCHANGE.models');

	ns.DoctorFinderMainViewModel = function DoctorFinderMainViewModel() {
		if (!(this instanceof DoctorFinderMainViewModel)) {
			return new DoctorFinderMainViewModel();
		}
		var self = this;

		self.goBackButton_lbl = ko.observable('');
		self.doctorFinder_url = ko.observable('');
		

		DoctorFinderMainViewModel.prototype.loadFromJSON = function loadFromJSON(doctorFinder) {
			var protoSelf = this;

			protoSelf.goBackButton_lbl(doctorFinder.GoBackButton_Lbl);
			protoSelf.doctorFinder_url(doctorFinder.DoctorFinder_Url);		

			return protoSelf;
		};

		return self;
	};

} (EXCHANGE, this));