(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.AccountMyCoverageViewModel = function AccountMyCoverageViewModel() {
        if (!(this instanceof AccountMyCoverageViewModel)) {
            return new AccountMyCoverageViewModel();
        }
        var self = this;

        self.myCoverage_lbl = ko.observable('');
        self.myCurrentCoverage_lbl = ko.observable('');
        self.myPastCoverage_lbl = ko.observable('');
        self.covers1_lbl = ko.observable('');
        self.covers2_lbl = ko.observable('');
        self.covers3_lbl = ko.observable('');
        self.covers4_lbl = ko.observable('');
        self.coversMed_lbl = ko.observable('');
        self.coversPDP_lbl = ko.observable('');
        self.coversDent_lbl = ko.observable('');
        self.coversVis_lbl = ko.observable('');
        self.planId_lbl = ko.observable('');
        self.effectiveDate_lbl = ko.observable('');
        self.doctorFinder_lbl = ko.observable('');
        self.medicine_lbl = ko.observable('');
        self.medsCoveredCount_lbl = ko.observable('');
        self.medsCoveredMoreInfo_lbl = ko.observable('');
        self.planDetails_lbl = ko.observable('');
        self.tempId_lbl = ko.observable('');
        self.contactUs_lbl = ko.observable('');
        self.needYourAttention_Lbl = ko.observable('');
        self.coveredDependents = ko.observableArray([]);
        self.enrollments = ko.observableArray([]);
        self.employerCoverages = ko.observableArray([]);
        self.myEmployerCoverages = ko.computed({
            read: function () {
                var covrs = self.employerCoverages();
                var covrModels = [];
                if (covrs) {
                    for (var i = 0; i < covrs.length; i++) {
                        var covrModel = new app.models.MyEmployerCoveragesViewModel(covrs[i]);

                        covrModels.push(covrModel);

                    }
                }
                return covrModels;
            },
            owner: this,
            deferEvaluation: true
        });
        self.currentPlanModels = ko.computed({
            read: function () {
                var enrs = self.enrollments();
                var enrModels = [];
                if (enrs) {
                    for (var i = 0; i < enrs.length; i++) {
                        var enrModel = new app.models.MyCoveragePlanViewModel(enrs[i]);
                        var effEndDate = moment(enrModel.effectiveEndDate()).utc();
                        var now = moment.utc();
                        if (effEndDate.year() >= now.year() && effEndDate.month() >= now.month() && effEndDate.date() >= now.date()) {
                            enrModels.push(enrModel);
                        }

                    }
                }
                return enrModels;
            },
            owner: this,
            deferEvaluation: true
        });
        self.pastPlanModels = ko.computed({
            read: function () {
                var enrs = self.enrollments();
                var enrModels = [];
                if (enrs) {
                    for (var i = 0; i < enrs.length; i++) {
                        var enrModel = new app.models.MyCoveragePlanViewModel(enrs[i]);
                        var effEndDate = moment(enrModel.effectiveEndDate()).utc();
                        var now = moment.utc();
                        if (effEndDate.year() < now.year() || effEndDate.month() < now.month() || effEndDate.date() < now.date()) {
                            enrModels.push(enrModel);
                        }

                    }
                }
                return enrModels;
            },
            owner: this,
            deferEvaluation: true
        });
        self.planModels = ko.computed({
            read: function () {
                var enrs = self.enrollments();
                var enrModels = [];
                if (enrs) {
                    for (var i = 0; i < enrs.length; i++) {
                        var enrModel = new app.models.MyCoveragePlanViewModel(enrs[i]);
                        enrModels.push(enrModel);
                    }
                }
                return enrModels;
            },
            owner: this,
            deferEvaluation: true
        });

        AccountMyCoverageViewModel.prototype.loadFromJSON = function loadfromJSON(viewModel) {
            var protoSelf = this;

            protoSelf.myCoverage_lbl(viewModel.MyCoverage_Lbl);
            protoSelf.myCurrentCoverage_lbl(viewModel.MyCurrentCoverage_Lbl);
            protoSelf.myPastCoverage_lbl(viewModel.MyPastCoverage_Lbl);
            protoSelf.covers1_lbl(viewModel.Covers1_Lbl);
            protoSelf.covers2_lbl(viewModel.Covers2_Lbl);
            protoSelf.covers3_lbl(viewModel.Covers3_Lbl);
            protoSelf.covers4_lbl(viewModel.Covers4_Lbl);
            protoSelf.coversMed_lbl(viewModel.CoversMed_Lbl);
            protoSelf.coversPDP_lbl(viewModel.CoversPDP_Lbl);
            protoSelf.coversDent_lbl(viewModel.Covers3Dent_Lbl);
            protoSelf.coversVis_lbl(viewModel.CoversVis_Lbl);
            protoSelf.planId_lbl(viewModel.PlanId_Lbl);
            protoSelf.effectiveDate_lbl(viewModel.EffectiveDate_Lbl);
            protoSelf.doctorFinder_lbl(viewModel.DoctorFinder_Lbl);
            protoSelf.medicine_lbl(viewModel.Medicine_Lbl);
            protoSelf.medsCoveredCount_lbl(viewModel.MedsCoveredCount_Lbl);
            protoSelf.medsCoveredMoreInfo_lbl(viewModel.MedsCoveredMoreInfo_Lbl);
            protoSelf.planDetails_lbl(viewModel.PlanDetails_Lbl);
            protoSelf.tempId_lbl(viewModel.TempId_Lbl);
            protoSelf.contactUs_lbl(viewModel.ContactUs_Lbl);
            protoSelf.needYourAttention_Lbl(viewModel.NeedYourAttention_Lbl);
            return protoSelf;
        };

        return self;
    };
} (EXCHANGE));

(function (app) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");

    ns.MyCoveragePlanViewModel = function MyCoveragePlanViewModel(myCoveragePlanModel) {
        if (!(this instanceof MyCoveragePlanViewModel)) {
            return new MyCoveragePlanViewModel(myCoveragePlanModel);
        }
        var self = this;

        self.showTempIdCard = ko.observable(myCoveragePlanModel.Enrollment.PolicyId != "" && myCoveragePlanModel.Enrollment.PolicyId != null && myCoveragePlanModel.Enrollment.PolicyId != undefined);
        self.enrollmentId = ko.observable(myCoveragePlanModel.Enrollment.Id);
        self.planName = ko.observable(myCoveragePlanModel.Enrollment.PlanName);
        self.planGuid = ko.observable(myCoveragePlanModel.Enrollment.PlanId);
        self.planCode = ko.observable(myCoveragePlanModel.Enrollment.PlanCode);
        self.insurerLogoURL = ko.observable(myCoveragePlanModel.Enrollment.Insurer.MainLogoUrl);
        self.isMedical = ko.observable(myCoveragePlanModel.Enrollment.IsMedical);
        self.isPDP = ko.observable(myCoveragePlanModel.Enrollment.IsPDP);
        self.effectiveDateStr = ko.observable(myCoveragePlanModel.Enrollment.EffectiveDateString);
        self.effectiveDate = ko.observable(myCoveragePlanModel.Enrollment.EffectiveDate);
        self.effectiveEndDate = ko.observable(myCoveragePlanModel.Enrollment.EffectiveEndDate);
       
        self.coveredDependents =  ko.computed({
            read: function () {

                var covrs = myCoveragePlanModel.Enrollment.CoveredDependents;
                var covrModels = [];
                if (covrs) {
                    for (var i = 0; i < covrs.length; i++) {
                      
                       covrModels.push(covrs[i]);
                    }
                }
                return covrModels;
            },
            owner: this,
            deferEvaluation: true
        });

        self.effectiveDate_lbl = ko.computed({
           read: function () {
               if(!self.effectiveDateStr()) return '';
               return app.viewModels.AccountMyCoverageViewModel.effectiveDate_lbl().format(self.effectiveDateStr());
           },
           owner: this,
           deferEvaluation: true
        });
        
        self.enrollmentSupplements = ko.observableArray(myCoveragePlanModel.Enrollment.EnrollmentSupplements);
        self.coversLbl = ko.computed({
            read: function () {
                var count = 0, foundDental = false, foundVision = false;
                if(self.isMedical()) count++;
                if(self.isPDP()) count++;
                var enrollmentSups = self.enrollmentSupplements();
                if(enrollmentSups) {
                    for(var i = 0; i < enrollmentSups.length; i++) {
                        if(enrollmentSups[i].PlanType == app.enums.PlanTypeEnum.DENTAL && !foundDental) {
                            foundDental = true;
                            count++;
                        }
                        if(enrollmentSups[i].PlanType == app.enums.PlanTypeEnum.VISION && !foundVision) {
                            foundVision = true;
                            count++;
                        }
                        if(enrollmentSups[i].PlanType == app.enums.PlanTypeEnum.DENTALANDVISION) {
                            if(!foundVision) {
                                foundVision = true;
                                count++;
                            }
                            if(!foundDental) {
                                foundDental = true;
                                count++;
                            }
                        }
                    }
                }
                var coverStr = '';
                if(count == 1) {
                    coverStr = app.viewModels.AccountMyCoverageViewModel.covers1_lbl();
                }else if(count == 2) {
                    coverStr = app.viewModels.AccountMyCoverageViewModel.covers2_lbl();
                }else if(count == 3) {
                    coverStr = app.viewModels.AccountMyCoverageViewModel.covers3_lbl();
                }else if(count == 4) {
                    coverStr = app.viewModels.AccountMyCoverageViewModel.covers4_lbl();
                }
                
                if(self.isMedical()) {
                    coverStr = coverStr.format(app.viewModels.AccountMyCoverageViewModel.coversMed_lbl());
                    coverStr = decrementStrFormatValues(coverStr);
                }
                if(self.isPDP()) {
                    coverStr = coverStr.format(app.viewModels.AccountMyCoverageViewModel.coversPDP_lbl());
                    coverStr = decrementStrFormatValues(coverStr);
                }
                if(foundDental) {
                    coverStr = coverStr.format(app.viewModels.AccountMyCoverageViewModel.coversDent_lbl());
                    coverStr = decrementStrFormatValues(coverStr);
                }
                if(foundVision) {
                    coverStr = coverStr.format(app.viewModels.AccountMyCoverageViewModel.coversVis_lbl());
                }
                return coverStr;

            }, owner: this,
            deferEvaluation: true
        });


        self.ppcid = ko.observable(myCoveragePlanModel.Enrollment.PPCID);
        self.planId = ko.computed({
           read: function () {
               if(app.viewModels.AccountMyCoverageViewModel && app.viewModels.AccountMyCoverageViewModel.planId_lbl()) {
                   return app.viewModels.AccountMyCoverageViewModel.planId_lbl().format(self.planCode());
               }
               return '';
           }, owner: this,
            deferEvaluation: true     
        });

        self.planDrugs = ko.observableArray(myCoveragePlanModel.PlanDrugs);
        self.showDrugsCovered = ko.computed({
            read: function () {
                var count = 0;
                if(app.user && app.user.UserSession && app.user.UserSession.UserDrugs && app.user.UserSession.UserDrugs.drugs()) {
                    count = app.user.UserSession.UserDrugs.drugs().length;
                }
                return count > 0;
            }, owner: this,
           deferEvaluation: true
        });
        self.medsCoveredCount_lbl = ko.computed({            
            read: function() {
                var planDrugs = self.planDrugs();
                if(planDrugs == null) return '';
                var covered = 0;
                for (var i = 0; i < planDrugs.length; i++) {
                    var planDrug = planDrugs[i];
                    if(planDrug.Tier > 0) {
                        covered++;
                    }
                }
                var str = app.viewModels.AccountMyCoverageViewModel.medsCoveredCount_lbl();
                var myMedCount = 0;
                if(app.user && app.user.UserSession && app.user.UserSession.UserDrugs && app.user.UserSession.UserDrugs.drugs())
                {
                    myMedCount = app.user.UserSession.UserDrugs.drugs().length;
                }
                str = str.format(covered, myMedCount);
                return str;
            },
            owner: this,
           deferEvaluation: true
        });
		self.medsCoveredMoreInfo_lbl = ko.observable(app.viewModels.AccountMyCoverageViewModel.medsCoveredMoreInfo_lbl());
        
        function decrementStrFormatValues(str) {
            return str.replace('{1}', '{0}').replace('{2}', '{1}').replace('{3}', '{2}').replace('{4}', '{3}');
        }

        return self;
    };

    ns.MyEmployerCoveragesViewModel = function MyEmployerCoveragesViewModel(myCoveragePlanModel) {
        if (!(this instanceof MyEmployerCoveragesViewModel)) {
            return new MyEmployerCoveragesViewModel(myCoveragePlanModel);
        }
        var self = this;

        self.coverageId = ko.observable(myCoveragePlanModel.Id);
        self.plan_Name = ko.observable(myCoveragePlanModel.Plan_Name);
        self.plan_Type = ko.observable(myCoveragePlanModel.Plan_Type);
        self.plan_TypeName = ko.computed({
            read: function () {
                switch (myCoveragePlanModel.Plan_Type) {
                    case app.enums.GroupHealthPlanTypeEnum.Dental:
                        return app.enums.GroupHealthPlanTypeEnumName.Dental;
                    case app.enums.GroupHealthPlanTypeEnum.Medical:
                        return app.enums.GroupHealthPlanTypeEnumName.Medical;
                    case app.enums.GroupHealthPlanTypeEnum.Post65Medical:
                        return app.enums.GroupHealthPlanTypeEnumName.Post65Medical;
                    case app.enums.GroupHealthPlanTypeEnum.PrescriptionDrug:
                        return app.enums.GroupHealthPlanTypeEnumName.PrescriptionDrug;
                    case app.enums.GroupHealthPlanTypeEnum.Vision:
                        return app.enums.GroupHealthPlanTypeEnumName.Vision;
                    default:
                        return "";
                }
            },
            owner: this,
            deferEvaluation: true
        });

        return self;

    };
       

} (EXCHANGE));