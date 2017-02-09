(function (app, $) {
    //"use strict";
    var ns = app.namespace("EXCHANGE.models");
    ns.gridItemVM = function gridItemVM() {
        var self = this;
        self.Id = ko.observable("");
        self.cName = ko.observable("");

    };

    ns.ApplicationPageViewModel = function ApplicationPageViewModel() {
        if (!(this instanceof ApplicationPageViewModel)) {
            return new ApplicationPageViewModel();
        }
        var self = this;
        self.targetDate = new Date();
        self.targetDate.setDate(self.targetDate.getDate());
        self.dd = self.targetDate.getDate();
        self.mm = EXCHANGE.application.functions.leadingZero(self.targetDate.getMonth() + 1); self.yyyy = self.targetDate.getFullYear();
        self.month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        self.items = ko.observableArray([]);
        self.itemsTemp = ko.observableArray([]);
        self.pageType = ko.observable("");
        self.isReview = ko.observable(false);
        self.isInError = ko.observable(false);
        self.errorMessagesList = ko.observableArray([]);
        self.pageId = ko.observable("");
        self.appItems = ko.observableArray([]);
        self.showInternalOnlyQuestions = ko.observable(false);
        self.allItemDictionary = ko.observable({});
        self.ZipItems = ko.observable({});
        self.Books = ko.observable({});
        self.FFPeople = ko.observable({});
        ApplicationPageViewModel.prototype.loadFromJSON = function loadFromJSON(serverModel, showInternalOnlyQuestions) {
            var protoSelf = this;
            protoSelf.FFPeople({
                length: 0,
                pushFFPerson: function (FFPerson, item) {
                    if (this[item.Group] === undefined) {
                        this[item.QuestionAddressGrouping] = {};
                        this[item.QuestionAddressGrouping].addresses = ko.observableArray([]);
                        this[item.QuestionAddressGrouping].selectedItem = ko.observable("");
                        this[item.QuestionAddressGrouping].isDirty = ko.observable(false);
                        if (FFPerson != null)
                            for (var ii = 0; ii < FFPerson.length; ii++)

                                this[item.QuestionAddressGrouping].addresses.push(FFPerson[ii]);

                    }
                    else {
                        if (FFPerson != null)
                            for (var ii = 0; ii < FFPerson.length; ii++)
                                this[item.QuestionAddressGrouping].addresses.push(FFPerson[ii]);
                    }
                    this[item.QuestionAddressGrouping].selectedItem.subscribe(function (newValue) {
                    });


                },
                pushGridItem: function (item) {
                    if (item) {
                        if (item.QuestionAddressGrouping !== "" && item.QuestionAddressGrouping !== null) {
                            if (this[item.QuestionAddressGrouping] === undefined) {
                                this[item.QuestionAddressGrouping] = {};
                                this[item.QuestionAddressGrouping][EXCHANGE.application.functions.getItemTypeName(item.ItemType)] = item.Id;
                                this.length++;
                            }
                            else {
                                this[item.QuestionAddressGrouping][EXCHANGE.application.functions.getItemTypeName(item.ItemType)] = item.Id;
                            }
                        }
                    }

                },
                toArray: function () {
                    var arr = [];
                    for (var item in this) {
                        if (typeof this[item] !== 'object' || this[item] === undefined) {
                            continue;
                        }
                        arr.push(this[item]);
                    }
                    return arr;
                }

            });

            protoSelf.Books({
                length: 0,
                pushBook: function (book, item) {
                    if (this[item.QuestionAddressGrouping] === undefined) {
                        this[item.QuestionAddressGrouping] = {};
                        this[item.QuestionAddressGrouping].addresses = ko.observableArray([]);
                        this[item.QuestionAddressGrouping].selectedItem = ko.observable("");
                        this[item.QuestionAddressGrouping].isDirty = ko.observable(false);
                        for (var ii = 0; ii < book.length; ii++)

                            this[item.QuestionAddressGrouping].addresses.push(book[ii]);
                    }
                    else {
                        for (var ii = 0; ii < book.length; ii++)
                            this[item.QuestionAddressGrouping].addresses.push(book[ii]);
                    }
                    this[item.QuestionAddressGrouping].selectedItem.subscribe(function (newValue) {
                    });


                },
                pushGridItem: function (item) {
                    if (item) {
                        if (item.QuestionAddressGrouping !== "" && item.QuestionAddressGrouping !== null) {
                            if (this[item.QuestionAddressGrouping] === undefined) {
                                this[item.QuestionAddressGrouping] = {};
                                this[item.QuestionAddressGrouping][EXCHANGE.application.functions.getItemTypeName(item.ItemType)] = item.Id;
                                this.length++;
                            }
                            else {
                                this[item.QuestionAddressGrouping][EXCHANGE.application.functions.getItemTypeName(item.ItemType)] = item.Id;
                            }
                        }
                    }

                },
                toArray: function () {
                    var arr = [];
                    for (var item in this) {
                        if (typeof this[item] !== 'object' || this[item] === undefined) {
                            continue;
                        }
                        arr.push(this[item]);
                    }
                    return arr;
                }

            });
            protoSelf.ZipItems({
                length: 0,
                pushZip: function (item) {
                    if (item) {
                        if (item.QuestionAddressGrouping !== "" && item.QuestionAddressGrouping !== null) {
                            if (this[item.QuestionAddressGrouping] === undefined) {
                                this[item.QuestionAddressGrouping] = {};
                                this[item.QuestionAddressGrouping].Zip = item.Id;
                                this.length++;
                            }
                            else {
                                this[item.QuestionAddressGrouping].Zip = item.Id;
                            }
                        }
                    }
                },
                pushState: function (item) {
                    if (item) {
                        if (item.QuestionAddressGrouping !== "" && item.QuestionAddressGrouping !== null) {
                            if (this[item.QuestionAddressGrouping] !== undefined) {
                                this[item.QuestionAddressGrouping].State = item.Id;
                            }
                            else {
                                this[item.QuestionAddressGrouping] = {};
                                this[item.QuestionAddressGrouping].State = item.Id;
                                this.length++;
                            }
                        }
                    }
                },
                toArray: function () {
                    var arr = [];
                    for (var item in this) {
                        if (typeof this[item] !== 'object' || this[item] === undefined) {
                            continue;
                        }
                        arr.push(this[item]);
                    }
                    return arr;
                }
            });
            protoSelf.showInternalOnlyQuestions(showInternalOnlyQuestions);
            serverModel.Items = hideInternalDisplayItems(serverModel.Items);
            protoSelf.items([]);
            protoSelf.itemsTemp([]);
            protoSelf.pageType('');
            protoSelf.isReview(false);
            protoSelf.pageId(serverModel.Id);
            protoSelf.pageType(serverModel.PageTypeEnum);
            protoSelf.appItems(serverModel.Items);

            function hideInternalDisplayItems(items) {
                var itemsToReturn = [];
                for (var i = 0; i < items.length; i++) {

                    //                    if (items[i].Id == "dd6d324d-2b47-e411-b9ab-bc305befb1d0") {
                    //                        if (items[i].Answer.Answer == "Yes") {
                    //                            protoSelf.showInformationEligibilitySections(false);
                    //                        }
                    //                        else {
                    //                            protoSelf.showInformationEligibilitySections(true);
                    //                        }
                    //                    }
                    if (items[i].ItemType == app.enums.ApplicationItemTypeEnum.Zip) {
                        protoSelf.ZipItems().pushZip(items[i]);
                    }
                    if (items[i].ItemType == app.enums.ApplicationItemTypeEnum.State) {
                        protoSelf.ZipItems().pushState(items[i]);
                    }
                    if (items[i].ItemType == app.enums.ApplicationItemTypeEnum.AddressGroup) {
                        protoSelf.Books().pushBook(app.viewModels.ApplicationStateViewModel.Addresses, items[i]);
                    }

                    if (items[i].ItemType == app.enums.ApplicationItemTypeEnum.ConnectionsBook) {
                        protoSelf.FFPeople().pushFFPerson(app.viewModels.ApplicationStateViewModel.People, items[i]);
                    }
                    if (items[i].QuestionAddressGrouping != null)
                        if (protoSelf.Books()[items[i].QuestionAddressGrouping] != undefined)
                            if (items[i].ItemType == app.enums.ApplicationItemTypeEnum.Addr1
                     || items[i].ItemType == app.enums.ApplicationItemTypeEnum.Addr2
                     || items[i].ItemType == app.enums.ApplicationItemTypeEnum.City
                     || items[i].ItemType == app.enums.ApplicationItemTypeEnum.County
                     || items[i].ItemType == app.enums.ApplicationItemTypeEnum.Zip
                       ) {
                                protoSelf.Books().pushGridItem(items[i]);
                            }

                    if (items[i].ItemType == app.enums.ApplicationItemTypeEnum.PersonFName
                     || items[i].ItemType == app.enums.ApplicationItemTypeEnum.PersonLName
                       ) {
                        protoSelf.FFPeople().pushGridItem(items[i]);
                    }
                    // if (items[i].ItemType == app.enums.ApplicationItemTypeEnum.AgentScript && !items[i].IsInternalDisplay) {
                    if (items[i].ItemType == app.enums.ApplicationItemTypeEnum.AgentScript && !items[i].IsAgentScript) {

                        items[i].ItemType = app.enums.ApplicationItemTypeEnum.Subheader;
                        itemsToReturn.push(items[i]);
                    } else if (!items[i].IsInternalDisplay) {
                        if (items[i].IsHealthQuestion === true && items[i].IsHiddenByDefault === true)
                        { }
                        else if (!items[i].CanHide)
                        //else 
                            itemsToReturn.push(items[i]);
                    }
                }

                if (protoSelf.showInternalOnlyQuestions()) {
                    //logged in as agent, return all items
                    //return items;                                    
                    var arr = [];
                    for (var i = 0; i < items.length; i++) {
                        if (!items[i].CanHide)
                            arr.push(items[i]);
                    }
                    return arr;

                } else {
                }
                return itemsToReturn;
            }

            function addApplicationItem(item) {
                var newitem = ko.mapping.fromJS(item);
                //var showInformationEligibilitySections = true;

                newitem.SelectedAnswer = ko.computed({
                    read: function () {

                        var selectedValue = this.Answer().Answer();
                        if (this.ItemType() === EXCHANGE.enums.ApplicationItemTypeEnum.County) return null;
                        var result;
                        if (selectedValue) {
                            result = ko.utils.arrayFirst(this.Choices(), function (choice) {

                                return selectedValue === choice.Value();
                            });
                        }

                        return result;
                    },
                    owner: newitem,
                    deferEvaluation: true
                });
                newitem.Answer = ko.observable(ko.mapping.fromJS(item.Answer));

                newitem.IsChildItem = ko.computed({
                    read: function () {
                        return !(newitem.ParentId() === null || typeof newitem.ParentId() === 'undefined' || newitem.ParentId() == "00000000-0000-0000-0000-000000000000");
                    },
                    owner: newitem,
                    deferEvaluation: true
                });
                newitem.ShowQuestion = ko.computed({
                    read: function () {
                        if (newitem.ItemType() === EXCHANGE.enums.ApplicationItemTypeEnum.Computed) return false;
                        if (protoSelf.isReview() && newitem.ItemType() === EXCHANGE.enums.ApplicationItemTypeEnum.County && newitem.IsReadOnly() !== true) {
                            for (var i = 0; i < newitem.Choices().length; i++) {
                                if (newitem.Answer().SaveAnswer() == newitem.Choices()[i].Value()) {
                                    newitem.Answer().SaveAnswer(newitem.Choices()[i].SaveValue());
                                    break;
                                }
                            }
                        }
                        if (protoSelf.isReview() && newitem.ItemType() == app.enums.ApplicationItemTypeEnum.AddressGroup) return false;
                        if (protoSelf.isReview() && ((newitem.Text() === "" || newitem.Text() === null) && (newitem.Answer().Answer() === "" || newitem.Answer().Answer() === null) || newitem.ItemType() === EXCHANGE.enums.ApplicationItemTypeEnum.AgentScript || newitem.ItemType() === EXCHANGE.enums.ApplicationItemTypeEnum.Subheader)) {
                            return false;
                        }
                        if (!newitem.IsChildItem()) return true;

                        var parentId = newitem.ParentId();

                        var parentItem = protoSelf.allItemDictionary()[parentId];
                        if (parentItem) {
                            var answer = parentItem.SelectedAnswer();
                            if (answer === null || typeof answer === 'undefined') {
                                return !newitem.IsHiddenByDefault();
                            }
                            var bHasGroups = false;
                            for (var i = 0; i < parentItem.Choices().length; i++) {
                                if (parentItem.Choices()[i].Group() != "") {
                                    bHasGroups = true;
                                    break;
                                }
                            }
                            if (bHasGroups != true) {
                                return answer.ShowDependentQuestions();
                            }

                            for (var i = 0; i < parentItem.Choices().length; i++) {
                                if (answer.SaveValue() === parentItem.Choices()[i].SaveValue()) {
                                    if (newitem.Group() === "") break;
                                    if (parentItem.Choices()[i].Group() === newitem.Group()) break;
                                }
                            }
                            if (i < parentItem.Choices().length) {
                                if (newitem.QuestionMappingCode() === "customer_address_dropdown") {// || newitem.QuestionMappingCode() === "witness_connection_dropdown" || newitem.QuestionMappingCode() === "witness_customer_address_dropdown") {
                                    if (newitem.Answer() !== null) {
                                        newitem.Answer().Answer(null);
                                    }
                                }
                                return true;
                            }
                            else {
                                var allItems = protoSelf.allItemDictionary().toArray();
                                if (newitem.QuestionMappingCode() === "customer_address_dropdown" || newitem.QuestionMappingCode() === "address_same_as_customer" ||
                                    newitem.QuestionMappingCode() === "witness_connection_dropdown" ||
                                    newitem.QuestionMappingCode() === "witness_customer_address_dropdown" || newitem.QuestionMappingCode() === "witness_address_same_as_customer") {
                                    if (newitem.Answer() !== null) {
                                        newitem.Answer().Answer(null);
                                    }
                                    if (newitem.QuestionMappingCode() === "address_same_as_customer") {
                                        newitem.hideChildQuestions(allItems, "customer_address_dropdown");
                                    }
                                    if (newitem.QuestionMappingCode() === "witness_address_same_as_customer") {
                                        newitem.hideChildQuestions(allItems, "witness_customer_address_dropdown");
                                    }
                                    if (newitem.QuestionMappingCode() === "witness_connection_dropdown") {
                                        var childItems = $.grep(allItems, function (e) { return (e.QuestionMappingCode() === "witness_address_same_as_customer" || e.QuestionMappingCode() === "witness_customer_address_dropdown"); });
                                        newitem.hideChildQuestions(childItems, "witness_address_same_as_customer");
                                        newitem.hideChildQuestions(childItems, "witness_customer_address_dropdown");
                                    }
                                }
                                //Bug# 151902: Hiding child question forcefully when parent value selected as "No".
                                if (newitem.QuestionMappingCode() === "previous_carrier_member" && parentItem.QuestionMappingCode() === "continuous_coverage") {
                                    if (parentItem.Answer().Answer() === "No") {
                                        newitem.Answer().Answer(null);
                                    }
                                }
                                return false;
                            }
                        }
                        if (newitem.IsHealthQuestion() == true) return newitem.IsHiddenByCalc();
                        return newitem.IsHiddenByDefault();
                    },
                    owner: newitem,
                    deferEvaluation: true
                });

                newitem.hideChildQuestions = function hideChildQuestions(allItems, questionMappingCode) {
                    var childItem = $.grep(allItems, function (e) { return (e.QuestionMappingCode() === questionMappingCode); });
                    if (childItem !== null && childItem.length === 1 && childItem[0].Answer() !== null) {
                        childItem[0].Answer().Answer(null);
                    }
                };

                newitem.isLastChild = function (index) {
                    return false;
                    //return index + 1 < protoSelf.items().length ? true : false;
                };
                newitem.AddressBook = ko.computed({
                    read: function () {
                        if (newitem.QuestionAddressGrouping() == null) return null;

                        var book = {};
                        book.isEditing = ko.observable(true);
                        book.isAdding = ko.observable(false);

                        if (protoSelf.isReview() || protoSelf.allItemDictionary() == undefined) return book;
                        if (app.viewModels.ApplicationPageViewModel == undefined) return book;
                        if (app.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()] == undefined) return book;
                        if (app.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()].addresses == undefined) return book;



                        book.allItems = ko.observableArray([]);

                        var itemToAdd = new EXCHANGE.models.gridItemVM();

                        book.selectedOption = ko.observable("");
                        for (var ii = 0; ii < app.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()].addresses().length; ii++) {
                            var addrItem = new EXCHANGE.models.gridItemVM();
                            addrItem.Id = EXCHANGE.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()].addresses()[ii].Id;
                            var bookEntry = EXCHANGE.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()].addresses();
                            addrItem.cName = bookEntry[ii]["Address1"] + " " + bookEntry[ii]["Address2"] + " " + bookEntry[ii]["City"] + " " + bookEntry[ii]["StateName"] + " " + bookEntry[ii]["ZipCode"] + " " + bookEntry[ii]["CountyName"];

                            book.allItems.push(addrItem);

                        }
                        if (newitem.ItemType() == app.enums.ApplicationItemTypeEnum.AddressGroup) {
                            itemToAdd.Id = "00000000-0000-0000-0000-000000000000";
                            itemToAdd.cName = "(New)";

                            book.allItems.push(itemToAdd);
                            // book.selectedOption(book.allItems()[0].Id);

                            //                                newitem.Answer().Answer(self.Books()[newitem.QuestionAddressGrouping()].addresses()[0][EXCHANGE.application.functions.gridItemName(newitem.ItemType())]);

                            //                        book.selectedItem = ko.observable(new EXCHANGE.models.gridItemVM());
                            //                        book.selectedItem = ko.observable(book.allItems()[0]);
                            //                        book.selectedOption();
                            var defChoice = itemToAdd.Id;
                            if (EXCHANGE.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()].addresses().length > 0)
                                defChoice = EXCHANGE.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()].addresses()[0].Id;
                            defChoice = newitem.Answer().Answer();

                            book.selectedItems = ko.observableArray([{ "Id": defChoice}]);
                            book.selectedItem = ko.observable(new EXCHANGE.models.gridItemVM());

                            // Initial selection

                            book.selectedOption(newitem.Answer().Answer());
                        }

                        book.AdrAnswer = function (adrIdx, adrFld) {
                            var adritem = EXCHANGE.viewModels.ApplicationPageViewModel.allItemDictionary()[EXCHANGE.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()][EXCHANGE.application.functions.getItemTypeName(app.enums.ApplicationItemTypeEnum[adrFld])]];
                            if (this.isEditing() == true) {
                                adritem.IsReadOnly(false);
                                switch (adritem.ItemType()) {
                                    case app.enums.ApplicationItemTypeEnum.County:
                                        book.setBookCounty(adrIdx, adritem);
                                    default:
                                        adritem.Answer().Answer(self.Books()[newitem.QuestionAddressGrouping()].addresses()[adrIdx][EXCHANGE.application.functions.gridItemName(adritem.ItemType())]);
                                }
                            }
                            else {
                                adritem.Answer().Answer("");
                                adritem.IsReadOnly(false);
                            }
                        };
                        book.setBookCounty = function (adrIdx, adritem) {
                            //adritem.countyLoaded(true);
                            adritem.Answer().Answer(app.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()].addresses()[adrIdx].CountyName);
                            EXCHANGE.application.functions.applyDropkick(adritem.Id());
                            $('#' + adritem.Id()).parent().find('.dk_label').html(app.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()].addresses()[adrIdx].CountyName);
                            //adritem.countyLoaded(false);

                        };

                        book.selectedOption.subscribe(function (newValue) {
                            newitem.Answer().Answer(newValue);
                            if (newValue == "00000000-0000-0000-0000-000000000000") {
                                newitem.AddressBook().isAdding(true);
                                newitem.AddressBook().isEditing(false);

                            }
                            else {
                                newitem.AddressBook().isAdding(false);
                                newitem.AddressBook().isEditing(true);
                                for (var adrIdx = 0; adrIdx < app.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()].addresses().length; adrIdx++) if (app.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()].addresses()[adrIdx].Id == newValue) break;
                                app.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()].selectedItem(adrIdx);

                            }
                            newitem.AddressBook().AdrAnswer(adrIdx, "Addr1");

                            newitem.AddressBook().AdrAnswer(adrIdx, "Addr2");
                            newitem.AddressBook().AdrAnswer(adrIdx, "City");
                            newitem.AddressBook().AdrAnswer(adrIdx, "Zip");
                            newitem.AddressBook().AdrAnswer(adrIdx, "County");


                        });
                        book.sortItems = function () {
                            this.allItems.sort();
                        };
                        return book;
                    },
                    owner: this
                });
                newitem.GridAnswer = ko.computed({
                    read: function () {
                        if (newitem.AddressBook().isAdding() === true)
                            newitem.Answer().Answer("");
                        else
                            switch (newitem.itemType) {
                            case app.enums.ApplicationItemTypeEnum.Addr1:
                                newitem.Answer().Answer(app.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()].addresses()[0].Address1);
                            case app.enums.ApplicationItemTypeEnum.Addr2:
                                newitem.Answer().Answer(app.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()].addresses()[0].Address2);
                            case app.enums.ApplicationItemTypeEnum.City:
                                newitem.Answer().Answer(app.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()].addresses()[0].City);
                            case app.enums.ApplicationItemTypeEnum.County:
                                newitem.Answer().Answer(app.viewModels.ApplicationPageViewModel.Books()[newitem.QuestionAddressGrouping()].addresses()[0].CountyId);

                            default:
                                return "";
                        }

                    },
                    owner: newitem,
                    deferEvaluation: true
                });

                newitem.countyLoaded = ko.observable(false);

                newitem.counties = ko.observableArray([]);
                newitem.getCounties = ko.computed({
                    read: function () {

                        if (EXCHANGE.viewModels.ApplicationPageViewModel.ZipItems().length === 0) return true;
                        //if(newitem.countyLoaded() === true)  return true;

                        var zip = EXCHANGE.viewModels.ApplicationPageViewModel.allItemDictionary()[EXCHANGE.viewModels.ApplicationPageViewModel.ZipItems()[newitem.QuestionAddressGrouping()].Zip].Answer().Answer();
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: "/API/Geography/GetCountiesByZip",
                            dataType: "json",
                            data: JSON.stringify({ 'zip': zip }),
                            success: function (data) {

                                var counties = [];
                                for (var k = 0; k < data.length; k++) {
                                    var County = { "Id": data[k].Id, "Sequence": k, "Value": data[k].CountyName, "SaveValue": data[k].Id, "ShowDependentQuestions": false };
                                    counties.push(County);
                                }
                                if (counties.length > 0) {
                                    newitem.counties(counties);
                                    newitem.Choices(counties);
                                    if (newitem.Answer().SaveAnswer() === "" && newitem.SelectedAnswer() === null) {
                                        newitem.Answer().Answer(counties[0].Value);
                                    }
                                    else {
                                        for (var i = 0; i < newitem.Choices().length; i++) { if (newitem.Answer().SaveAnswer() == newitem.Choices()[i].SaveValue) break; } if (i == newitem.Choices().length) { newitem.Answer().SaveAnswer(""); newitem.Answer().Answer(newitem.Choices()[0].Value); }
                                    }
                                    EXCHANGE.application.functions.applyDropkick(newitem.Id());
                                    EXCHANGE.viewModels.ApplicationPageViewModel.ZipItems()[newitem.QuestionAddressGrouping()].StateValue = data[0].State;
                                    var stateitem = EXCHANGE.viewModels.ApplicationPageViewModel.allItemDictionary()[EXCHANGE.viewModels.ApplicationPageViewModel.ZipItems()[newitem.QuestionAddressGrouping()].State];
                                    if (EXCHANGE.viewModels.ApplicationPageViewModel.ZipItems()[newitem.QuestionAddressGrouping()].State !== undefined && stateitem.IsReadOnly() !== true) {
                                        var stateValue = "";
                                        for (var i = 0; i < stateitem.Choices().length; i++) { if (stateitem.Choices()[i].SaveValue() === data[0].State) { stateValue = stateitem.Choices()[i].Value(); break; } }
                                        EXCHANGE.viewModels.ApplicationPageViewModel.allItemDictionary()[EXCHANGE.viewModels.ApplicationPageViewModel.ZipItems()[newitem.QuestionAddressGrouping()].State].Answer().Answer(stateValue);
                                        EXCHANGE.application.functions.applyDropkick(EXCHANGE.viewModels.ApplicationPageViewModel.ZipItems()[newitem.QuestionAddressGrouping()].State);
                                    }

                                }
                                else {
                                    newitem.counties(counties);
                                    newitem.Choices(counties);
                                    newitem.Answer().Answer("");
                                    EXCHANGE.application.functions.applyDropkick(newitem.Id());
                                    EXCHANGE.application.functions.setDefaultValue(newitem.Id());
                                    EXCHANGE.viewModels.ApplicationPageViewModel.allItemDictionary()[EXCHANGE.viewModels.ApplicationPageViewModel.ZipItems()[newitem.QuestionAddressGrouping()].State].Answer().Answer("");
                                    EXCHANGE.viewModels.ApplicationPageViewModel.allItemDictionary()[EXCHANGE.viewModels.ApplicationPageViewModel.ZipItems()[newitem.QuestionAddressGrouping()].State].Answer().SaveAnswer("");
                                    EXCHANGE.application.functions.applyDropkick(EXCHANGE.viewModels.ApplicationPageViewModel.ZipItems()[newitem.QuestionAddressGrouping()].State);
                                    EXCHANGE.application.functions.setDefaultValue(EXCHANGE.viewModels.ApplicationPageViewModel.ZipItems()[newitem.QuestionAddressGrouping()].State);
                                    newitem.countyLoaded(true);
                                }

                            },
                            error: function (data) {
                                var counties = [];
                                newitem.counties(counties);
                            }
                        });
                        return true;
                    },
                    owner: newitem,
                    deferEvaluation: true
                });

                newitem.sep_months = ko.observableArray([]);
                newitem.sep_days = ko.observableArray([]);
                newitem.sep_years = ko.observableArray([]);
                if (newitem.ItemType() === EXCHANGE.enums.ApplicationItemTypeEnum.SeparatedDate) {
                    for (var k = 1; k < 13; k++) {
                        var sep_month = { "Id": k, "Sequence": k, "Value": self.month_name[k - 1], "SaveValue": k, "ShowDependentQuestions": false };
                        newitem.sep_months.push(sep_month);
                    }
                    for (var k = 1; k < 31; k++) {
                        var sep_days = { "Id": k, "Sequence": k, "Value": k, "SaveValue": k, "ShowDependentQuestions": false };
                        newitem.sep_days.push(sep_days);
                    }

                    for (var k = self.yyyy + 1; k > 1900; k--) {
                        var sep_years = { "Id": k, "Sequence": k, "Value": k, "SaveValue": k, "ShowDependentQuestions": false };
                        newitem.sep_years.push(sep_years);
                    }
                }
                if (newitem.ItemType() === EXCHANGE.enums.ApplicationItemTypeEnum.FirstDate) {
                    var dum_mth = { "Id": 0, "Sequence": 0, "Value": "Month", "SaveValue": 0, "ShowDependentQuestions": false };
                    newitem.sep_months.push(dum_mth);

                    for (var k = 1; k < 13; k++) {
                        var sep_month = { "Id": k, "Sequence": k, "Value": self.month_name[k - 1], "SaveValue": k, "ShowDependentQuestions": false };
                        newitem.sep_months.push(sep_month);
                    }
                    for (var k = 1; k < 2; k++) {
                        var sep_days = { "Id": k, "Sequence": k, "Value": k, "SaveValue": k, "ShowDependentQuestions": false };
                        newitem.sep_days.push(sep_days);
                    }
                    var dum_year = { "Id": 0, "Sequence": 0, "Value": "Year", "SaveValue": 0, "ShowDependentQuestions": false };
                    newitem.sep_years.push(dum_year);

                    for (var k = self.yyyy + 1; k > 1900; k--) {
                        var sep_years = { "Id": k, "Sequence": k, "Value": k, "SaveValue": k, "ShowDependentQuestions": false };
                        newitem.sep_years.push(sep_years);
                    }
                }
                newitem.sep_Day = ko.observable();
                newitem.sep_Month = ko.observable();
                newitem.sep_Year = ko.observable();
                if (newitem.ItemType() === EXCHANGE.enums.ApplicationItemTypeEnum.SeparatedDate && newitem.Answer().Answer() !== null && newitem.Answer().Answer() !== "") {
                    newitem.sep_Month(newitem.Answer().Answer().split("/")[0]);
                    newitem.sep_Day(newitem.Answer().Answer().split("/")[1]);
                    newitem.sep_Year(newitem.Answer().Answer().split("/")[2]);
                }
                if (newitem.ItemType() === EXCHANGE.enums.ApplicationItemTypeEnum.FirstDate) {
                    newitem.sep_Day(1);
                    if (newitem.Answer().Answer() !== null && newitem.Answer().Answer() !== "") {
                        newitem.sep_Month(newitem.Answer().Answer().split("/")[0]);

                        newitem.sep_Year(newitem.Answer().Answer().split("/")[2]);
                    }
                }
                newitem.sep_Date = ko.computed(function () {
                    if (newitem.ItemType() === EXCHANGE.enums.ApplicationItemTypeEnum.FirstDate || newitem.ItemType() === EXCHANGE.enums.ApplicationItemTypeEnum.SeparatedDate)
                        return newitem.sep_Month() + "/" + newitem.sep_Day() + "/" + newitem.sep_Year();
                });


                if (newitem.ItemType() === EXCHANGE.enums.ApplicationItemTypeEnum.PhoneNumber) {
                    newitem.Answer().Answer((app.functions.autoFormatPhoneNumber(newitem.Answer().Answer())));
                }

                if (newitem.IsHealthQuestion()) {
                    if (EXCHANGE.viewModels.ApplicationReviewViewModel != undefined) {
                        if (!EXCHANGE.viewModels.ApplicationReviewViewModel.showInformationEligibilitySections()) {
                        }
                        else {
                            protoSelf.itemsTemp.push(newitem);
                        }
                    }
                    else {
                        protoSelf.itemsTemp.push(newitem);
                    }
                }
                else {
                    protoSelf.itemsTemp.push(newitem);
                }
            }

            var appendItems = function () {
                var dataChunk = protoSelf.appItems.splice(0, 10); // configure this last number (the size of the 'chunk') to suit your needs
                for (var i = 0; i < dataChunk.length; i++) {
                    addApplicationItem(dataChunk[i]);
                }
                if (protoSelf.appItems().length > 0) {
                    setTimeout(appendItems, 10); // change time to suit needs
                } else {
                    protoSelf.allItemDictionary({
                        length: 0,
                        push: function (item) {
                            if (item) {
                                this[item.Id()] = item;
                                this.length++;
                            }
                        },
                        toArray: function () {
                            var arr = [];
                            for (var item in this) {
                                if (typeof this[item] !== 'object' || this[item] === undefined) {
                                    continue;
                                }
                                arr.push(this[item]);
                            }
                            return arr;
                        }
                    });
                    for (var i = 0; i < protoSelf.itemsTemp().length; i++) {
                        protoSelf.allItemDictionary().push(protoSelf.itemsTemp()[i]);
                    }
                    protoSelf.items(protoSelf.itemsTemp());
                    EXCHANGE.WaitPopupObserver.Publish("EXCHANGE.WaitPopup.Application.ApplicationPageClientViewModel");
                    app.placeholder.applyPlaceholder();
                }
            };
            appendItems(); // kicks it off

            return protoSelf;
        };


        return self;
    };

} (EXCHANGE, jQuery));
