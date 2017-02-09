(function (app) {
    var ns = app.namespace('EXCHANGE.models');

    ns.FindAccountViewModel = function FindAccountViewModel() {
        if (!(this instanceof FindAccountViewModel)) {
            return new FindAccountViewModel();
        }

        var self = this;


        // "constants" here to make it easier to change template names in .ascx
        self.INITIAL_TEMPLATE_NAME = "find-account-panel-question-template";
        self.MULTIMATCH_TEMPLATE_NAME = "find-account-panel-multiple-matches-template";
        self.FOUNDACCT_TEMPLATE_NAME = "single-match-template";

        self.FindAccountPanelTemplateName = ko.observable(self.INITIAL_TEMPLATE_NAME);

        self.HeaderText = ko.observable("");
        self.LastNameLabel = ko.observable("");
        self.DateOfBirthLabel = ko.observable("");
        self.ZIPCodeLabel = ko.observable("");
        self.AlsoProvideText = ko.observable("");
        self.SSNLabel = ko.observable("");
        self.NavigatorsIdLabel = ko.observable("");
        self.RightSideHeaderText = ko.observable("");
        self.RightSideMainText = ko.observable("");
        self.UsAddress = ko.observable(false);
        self.UsAddressLabel = ko.observable("Address Type");
        self.Errors = ko.observableArray([]);
        self.HasErrors = ko.computed({
            read: function () {
                return self.Errors().length > 0;
            }, owner: this
        });
        self.InlineErrorsHeaderText = ko.observable('');
        self.InlineErrorsBodyText = ko.observable('');
        self.MatchErrorHeaderText = ko.observable('');
        self.MatchErrorBodyText = ko.observable('');
        self.MatchErrorListHtml = ko.observable('');
        self.MatchErrorListWithoutCreateHtml = ko.observable('');
        self.HasMatchError = ko.observable(false);

        self.LastName = ko.observable("");
        self.ZIPCode = ko.observable("");
        self.SSN = ko.observable("");
        self.NavigatorsId = ko.observable("");
        self.NavigatorsIdSetFromQueryString = ko.observable(false);

        self.MultipleMatchFlag = ko.observable(false);
        self.MultipleMatchesHeaderText = ko.observable('');
        self.MultipleMatchesNavigatorsIdLabelHtml = ko.observable('');
        self.MultipleMatchesBottomHtml = ko.observable('');

        self.EnterCountyLbl = ko.observable('');
        self.County = ko.observable('');
        self.CountyList = ko.observableArray([]);
        self.ShowCountyList = ko.computed({
            read: function () {
                return self.CountyList().length > 1;
            },
            owner: this,
            deferEvaluation: true
        });
        self.SelectOneLbl = ko.observable('');

        self.dateOfBirth = new app.models.DateOfBirthViewModel();

        FindAccountViewModel.prototype.loadFromJSON = function loadFromJSON(serverViewModel) {
            var protoSelf = this;

            protoSelf.HeaderText(serverViewModel.HeaderText);
            protoSelf.LastNameLabel(serverViewModel.LastNameLabel);
            protoSelf.DateOfBirthLabel(serverViewModel.DateOfBirthLabel);
            protoSelf.ZIPCodeLabel(serverViewModel.ZIPCodeLabel);
            protoSelf.AlsoProvideText(serverViewModel.AlsoProvideText);
            protoSelf.SSNLabel(serverViewModel.SSNLabel);
            protoSelf.NavigatorsIdLabel(serverViewModel.NavigatorsIdLabel);
            protoSelf.RightSideHeaderText(serverViewModel.RightSideHeaderText);
            protoSelf.RightSideMainText(serverViewModel.RightSideMainText);
            protoSelf.InlineErrorsHeaderText(serverViewModel.InlineErrorsHeaderText);
            protoSelf.InlineErrorsBodyText(serverViewModel.InlineErrorsBodyText);
            protoSelf.MatchErrorHeaderText(serverViewModel.MatchErrorHeaderText);
            protoSelf.MatchErrorBodyText(serverViewModel.MatchErrorBodyText);
            protoSelf.MatchErrorListHtml(serverViewModel.MatchErrorListHtml);
            protoSelf.MatchErrorListWithoutCreateHtml(serverViewModel.MatchErrorListWithoutCreateHtml);
            protoSelf.MultipleMatchesHeaderText(serverViewModel.MultipleMatchesHeaderText);
            protoSelf.MultipleMatchesNavigatorsIdLabelHtml(serverViewModel.MultipleMatchesNavigatorsIdLabelHtml);
            protoSelf.MultipleMatchesBottomHtml(serverViewModel.MultipleMatchesBottomHtml);

            protoSelf.EnterCountyLbl(serverViewModel.EnterCountyLbl);
            protoSelf.SelectOneLbl(serverViewModel.SelectOneLbl);

            protoSelf.dateOfBirth.loadFromJSON(serverViewModel.DateOfBirthViewModel);

            return protoSelf;
        };

        FindAccountViewModel.prototype.toFindAccountArgs = function toFindAccountArgs() {
            var protoSelf = this;

            var toReturn = {
                LastName: protoSelf.LastName(),
                ZIPCode: protoSelf.ZIPCode(),
                SSN: protoSelf.SSN(),
                NavigatorsId: protoSelf.NavigatorsId(),
                DOBDay: protoSelf.dateOfBirth.Day(),
                DOBMonth: protoSelf.dateOfBirth.Month(),
                DOBYear: protoSelf.dateOfBirth.Year(),
                MultipleMatchFlag: protoSelf.MultipleMatchFlag(),
                CountyId: protoSelf.County()
            };

            return toReturn;
        };

        FindAccountViewModel.prototype.clearData = function clearData() {
            var protoSelf = this;

            protoSelf.Errors([]);
            protoSelf.HasMatchError(false);

            protoSelf.LastName("");
            protoSelf.ZIPCode("");
            protoSelf.County("");
            protoSelf.SSN("");
            protoSelf.NavigatorsId("");

            protoSelf.MultipleMatchFlag(false);

            protoSelf.County("");
            protoSelf.CountyList([]);


            protoSelf.dateOfBirth.clearData();
        };
    };

} (EXCHANGE));
