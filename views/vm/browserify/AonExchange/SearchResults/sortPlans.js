(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.plans');

    ns.SortRules = function SortRules() {
        if (!(this instanceof SortRules)) {
            return new SortRules();
        }
        var self = this;

        self.sortAttributeName = 'planRank'; // Default is planRank
        self.useOverride = false; // If there's a field that overrides the order array stuff below (like, if it's high deductible, for instance).
        self.overrideFieldName = ''; // The name of the field to use as an override for the order array. That field will just be a bool. If it's true, it goes at the end of the list.
        self.useOrderArray = false; // Use a predefined array of sort values. Currently used for sorting on Medicare Type
        self.orderArray = []; // Uses this array to sort values that can't be sorted by cost (or alphabet, etc.) It should be sorted in the same way we want the resulting array sorted.
        self.asc = false; // Default to sort high-to-low. This isn't what the ACTUAL sortings do, but it is what the default sort does (on planRank)
        self.attributeValueName = 'lowVal'; // The name of the parameter on the attribute that we're looking at
        self.useAttributes = false; // By default, we look to planRank, which is just on the actual object
        self.secondAttributeName = ''; // Default is empty

        self.sort = function (array) {
            // Assumes that the items passed in in array have a .clone() function, which produces a deep copy of the item.
            //            self._arr = $.map(array, function (item, i) {
            //                return item.clone();
            //            });
            // Comparison function. Need to return number < 0
            //self.sortAttributeName
            if (array.length > 0 && self.sortAttributeName == "TCE") {

                var plansPDP = new Array();
                var plansMedigap = new Array();
                var length = array.length;
                for (var i = 0; i < length; i++) {


                    if (array[i].TCE == "") {

                        plansMedigap.push(array[i]);
                    }

                    else {

                        plansPDP.push(array[i]);
                    }
                }

                plansPDP.sort(comparisonFunction);

                for (var i = 0; i < plansMedigap.length; i++) {
                    plansPDP.push(plansMedigap[i]);
                }
                return plansPDP;

            }


            if (array.length > 0 && self.sortAttributeName == "Doctor Visits") {
                var dollarPlans = new Array();
                var notDollarPlans = new Array();
                var simplePlans = new Array();
                var length = array.length;

                for (var i = 0; i < length; i++) {
                    var amount = "";

                    amount = getAttributesValue(array[i], self.sortAttributeName);

                    if (amount.indexOf("$") != -1) {
                        dollarPlans.push(array[i]);
                    }

                    if (amount.indexOf("%") != -1) {
                        notDollarPlans.push(array[i]);
                    }

                    if (amount.charAt(0) == "") {

                        simplePlans.push(array[i]);
                    }

                }




                dollarPlans.sort(comparisonFunction);
                notDollarPlans.sort(comparisonFunction);

                for (var i = 0; i < notDollarPlans.length; i++) {
                    dollarPlans.push(notDollarPlans[i]);
                }

                for (var i = 0; i < simplePlans.length; i++) {
                    dollarPlans.push(simplePlans[i]);
                }




                return dollarPlans;

            }
            else {
                array.sort(comparisonFunction);

                return array;
            }
            //return self._arr; // We've sorted self._arr, now return it.
        };

        self.pwSort = function (array) {
            // Assumes that the items passed in in array have a .clone() function, which produces a deep copy of the item.
            //            self._arr = $.map(array, function (item, i) {
            //                return item.clone();
            //            });
            // Comparison function. Need to return number < 0
            array.sort(pwComparisonFunction);

            return array;
            //return self._arr; // We've sorted self._arr, now return it.
        };

        function getFromValues(attribute, valueName) {
            var valueLength = attribute.AttributeValues.length;
            for (var i = 0; i < valueLength; i++) {
                if (attribute.AttributeValues[i].Name === valueName) {
                    return getFormattedValue(attribute.AttributeValues[i]);
                }
            }

            return null;
        }

        function getFormattedValue(attributeValue) {
            switch (attributeValue.DataType) {
                case app.enums.AttributeDataTypeEnum.DATETIME:
                    return new Date(attributeValue.FormattedValue);
                case app.enums.AttributeDataTypeEnum.STRING:
                    if (attributeValue.Value != null) {
                        if ((attributeValue.Value.charAt(0) == "$" || attributeValue.Value.charAt(0) == "%") && (attributeValue.Name == "Medical Deductible" || attributeValue.Name == "Drug Deductible" || attributeValue.Name == "Doctor Office Visits")) {
                            var val = attributeValue.Value.substring(1);
                            var currVal = parseFloat(val);
                            if (!isNaN(currVal)) {
                                return currVal;
                            }
                        }
                    }
                    return attributeValue.Value;
                case app.enums.AttributeDataTypeEnum.NUMERIC:
                case app.enums.AttributeDataTypeEnum.CURRENCY:
                    if (attributeValue.Value.charAt(0) == "$") {
                        var val = attributeValue.Value.substring(1);
                        var currVal = parseFloat(val);
                        if (!isNaN(currVal)) {
                            return currVal;
                        }
                        return val;
                    }
                    else {
                        return attributeValue.Value;
                    }
                default:
                    var parsedVal = parseFloat(attributeValue.Value);
                    if (!isNaN(parsedVal)) {
                        return parsedVal;
                    }
                    return attributeValue.Value;
            }
        }

        function sortOnPlanRank(firstPlan, secondPlan) {
            var firstPlanRank = firstPlan.planRank;
            var secondPlanRank = secondPlan.planRank;
            if (!firstPlanRank || !secondPlanRank) {
                return 0;
            }

            return secondPlanRank - firstPlanRank;
        }

        // This is a helper for comparisonFunction (seen below), to handle comparisons when
        // one or both of the compared values are null/undefined. As with the main
        // comparisonFunction, in the case of two equal values, we arrange the two by planRank.
        function sortIncludingFlawedData(firstPlan, secondPlan, firstItemToCompare, secondItemToCompare) {
            var result = 0;
            if ((typeof firstItemToCompare === "undefined") && (typeof secondItemToCompare === "undefined")) {
                result = sortOnPlanRank(firstPlan, secondPlan);
            } else if (typeof firstItemToCompare === "undefined") {
                result = 1;
            } else if (typeof secondItemToCompare === "undefined") {
                result = -1;
            } else if ((firstItemToCompare === null) && (secondItemToCompare === null)) {
                result = sortOnPlanRank(firstPlan, secondPlan);
            } else if (firstItemToCompare === null) {
                result = 1;
            } else if (secondItemToCompare === null) {
                result = -1;
            } else if (firstItemToCompare == "") {
                result = 1;
            } else if (secondItemToCompare == "") {
                result = -1;
            }
            return result;
        }


        function getAttributes(plan, attributeName) {

            var setLength = plan.srAttributeTemplate.AttributeGroups ? plan.srAttributeTemplate.AttributeGroups.length : 0;
            for (var j = setLength - 1; j >= 0; j--) {
                var attLength = plan.srAttributeTemplate.AttributeGroups[j].Attributes ? plan.srAttributeTemplate.AttributeGroups[j].Attributes.length : 0;
                for (var k = attLength - 1; k >= 0; k--) {
                    if (plan.srAttributeTemplate.AttributeGroups[j].Attributes[k].Name == attributeName) {
                        return plan.srAttributeTemplate.AttributeGroups[j].Attributes[k];
                    }
                }
            }
            return null;

        }

        function getAttributesValue(plan, attributeName) {

            var setLength = plan.srAttributeTemplate.AttributeGroups ? plan.srAttributeTemplate.AttributeGroups.length : 0;
            for (var j = setLength - 1; j >= 0; j--) {
                var attLength = plan.srAttributeTemplate.AttributeGroups[j].Attributes ? plan.srAttributeTemplate.AttributeGroups[j].Attributes.length : 0;
                for (var k = attLength - 1; k >= 0; k--) {
                    if (plan.srAttributeTemplate.AttributeGroups[j].Attributes[k].Name == attributeName) {
                        return plan.srAttributeTemplate.AttributeGroups[j].Attributes[k].FormattedAttributeValue;
                    }
                }
            }
            return null;

        }
        // The (vaguely) private function that does the actual sorting.
        // It returns:
        // < 0 if the first item should go before the second item
        // 0 if the items can go in either order (i.e., they're the same thing)
        // > 0 if the second item should go before the first item
        function comparisonFunction(firstPlanVM, secondPlanVM) {
            // First and second are each of the type PlanModel, so what we actually want to sort on is in the .attributes array of that model
            // So, the first thing we want to do is find our comparison values.
            var firstAttribute, secondAttribute, firstComparisonValue, secondComparisonValue;
            var firstPlan = firstPlanVM;
            var secondPlan = secondPlanVM;


            if (self.useAttributes) {
                firstAttribute = getAttributes(firstPlan, self.sortAttributeName);
                secondAttribute = getAttributes(secondPlan, self.sortAttributeName);
            }
            else {
                if (self.secondAttributeName != "") {
                    firstAttribute = firstPlan[self.sortAttributeName][self.secondAttributeName];
                    secondAttribute = secondPlan[self.sortAttributeName][self.secondAttributeName];
                }
                else {
                    firstAttribute = firstPlan[self.sortAttributeName];
                    secondAttribute = secondPlan[self.sortAttributeName];
                }
            }


            // We should have both attributes. If not, our comparison must take null/undefined into account. 
            if ((!firstAttribute && firstAttribute !== 0) || (!secondAttribute && secondAttribute !== 0)) {
                return sortIncludingFlawedData(firstPlan, secondPlan, firstAttribute, secondAttribute);
            }

            firstComparisonValue = self.useAttributes ? getFromValues(firstAttribute, self.attributeValueName) : firstAttribute;
            secondComparisonValue = self.useAttributes ? getFromValues(secondAttribute, self.attributeValueName) : secondAttribute;

            // We should have both attribute values. If not, our comparison must take null/undefined into account. 
            if ((!firstComparisonValue && firstComparisonValue !== 0) || (!secondComparisonValue && secondComparisonValue !== 0)) {
                return sortIncludingFlawedData(firstPlan, secondPlan, firstComparisonValue, secondComparisonValue);
            }

            if (self.useOrderArray) { // We need to find each comparison values position in the provided orderArray, and sort on that
                var firstPosition = -1, secondPosition = -1;
                firstPosition = self.orderArray.indexOf(firstComparisonValue);
                secondPosition = self.orderArray.indexOf(secondComparisonValue);

                if (firstPosition === -1 || secondPosition === -1) {
                    return 0;
                }
                if (self.useOverride) {
                    if (firstPlan[self.overrideFieldName]) { // The first item has the override. Make it go to the end.
                        return 1;
                    }
                    else if (secondPlan[self.overrideFieldName]) { // The second item has the override. Make it go to the end.
                        return -1;
                    }
                }

                return firstPosition - secondPosition;
            }
            else { // We just sort numerically, based on self.asc
                // When there's a tie, we sort based on planRank.
                if (firstComparisonValue === secondComparisonValue) {
                    return sortOnPlanRank(firstPlan, secondPlan);
                }
                if (self.asc) {
                    var returnVal = firstComparisonValue - secondComparisonValue;
                    if (isNaN(returnVal)) {
                        if (firstComparisonValue < secondComparisonValue) {
                            return -1;
                        }
                        if (firstComparisonValue > secondComparisonValue) {
                            return 1;
                        }
                    }
                    return returnVal;
                }
                else {
                    var returnVal = secondComparisonValue - firstComparisonValue;
                    if (isNaN(returnVal)) {
                        if (secondComparisonValue < firstComparisonValue) {
                            return -1;
                        }
                        if (secondComparisonValue > firstComparisonValue) {
                            return 1;
                        }
                    }
                    return returnVal;
                }
            }
        }

        function pwComparisonFunction(firstPlanVM, secondPlanVM) {
            // First and second are each of the type PlanModel, so what we actually want to sort on is in the .attributes array of that model
            // So, the first thing we want to do is find our comparison values.
            var firstAttribute, secondAttribute, firstComparisonValue, secondComparisonValue;
            var firstPlan = firstPlanVM;
            var secondPlan = secondPlanVM;

            firstAttribute = firstPlan["RecommendationInfo"].PicWellRank;
            secondAttribute = secondPlan["RecommendationInfo"].PicWellRank;
            /*
            if (self.useAttributes) {
            firstAttribute = getAttributes(firstPlan, self.sortAttributeName);
            secondAttribute = getAttributes(secondPlan, self.sortAttributeName);
            }
            else {
            firstAttribute = firstPlan[self.sortAttributeName];
            secondAttribute = secondPlan[self.sortAttributeName];
            }
            */

            // We should have both attributes. If not, our comparison must take null/undefined into account. 
            if ((!firstAttribute && firstAttribute !== 0) || (!secondAttribute && secondAttribute !== 0)) {
                return sortIncludingFlawedData(firstPlan, secondPlan, firstAttribute, secondAttribute);
            }

            firstComparisonValue = firstAttribute;
            secondComparisonValue = secondAttribute;

            /*
            firstComparisonValue = self.useAttributes ? getFromValues(firstAttribute, self.attributeValueName) : firstAttribute;
            secondComparisonValue = self.useAttributes ? getFromValues(secondAttribute, self.attributeValueName) : secondAttribute;
            */

            // We should have both attribute values. If not, our comparison must take null/undefined into account. 
            if ((!firstComparisonValue && firstComparisonValue !== 0) || (!secondComparisonValue && secondComparisonValue !== 0)) {
                return sortIncludingFlawedData(firstPlan, secondPlan, firstComparisonValue, secondComparisonValue);
            }

            if (self.useOrderArray) { // We need to find each comparison values position in the provided orderArray, and sort on that
                var firstPosition = -1, secondPosition = -1;
                firstPosition = self.orderArray.indexOf(firstComparisonValue);
                secondPosition = self.orderArray.indexOf(secondComparisonValue);

                if (firstPosition === -1 || secondPosition === -1) {
                    return 0;
                }
                if (self.useOverride) {
                    if (firstPlan[self.overrideFieldName]) { // The first item has the override. Make it go to the end.
                        return 1;
                    }
                    else if (secondPlan[self.overrideFieldName]) { // The second item has the override. Make it go to the end.
                        return -1;
                    }
                }

                return firstPosition - secondPosition;
            }
            else { // We just sort numerically, based on self.asc
                // When there's a tie, we sort based on planRank.
                if (firstComparisonValue === secondComparisonValue) {
                    return sortOnPlanRank(firstPlan, secondPlan);
                }
                if (self.asc) {
                    var returnVal = firstComparisonValue - secondComparisonValue;
                    if (isNaN(returnVal)) {
                        if (firstComparisonValue < secondComparisonValue) {
                            return -1;
                        }
                        if (firstComparisonValue > secondComparisonValue) {
                            return 1;
                        }
                    }
                    return returnVal;
                }
                else {
                    var returnVal = secondComparisonValue - firstComparisonValue;
                    if (isNaN(returnVal)) {
                        if (secondComparisonValue < firstComparisonValue) {
                            return -1;
                        }
                        if (secondComparisonValue > firstComparisonValue) {
                            return 1;
                        }
                    }
                    return returnVal;
                }
            }
        }

        SortRules.prototype.loadFromJson = function loadFromJson(sorter) {
            var protoSelf = this;

            if (typeof sorter.toJS == "function") {
                sorter = sorter.toJS();
            }

            protoSelf.sortAttributeName = sorter.SortAttributeName;
            protoSelf.useOverride = sorter.UseOverride;
            protoSelf.overrideFieldName = sorter.OverrideFieldName;
            protoSelf.useOrderArray = sorter.UseOrderArray;
            protoSelf.orderArray = sorter.OrderArray;
            protoSelf.asc = sorter.Asc;
            protoSelf.attributeValueName = sorter.AttributeValueName;
            protoSelf.useAttributes = sorter.UseAttributes;
            protoSelf.sortFrom = sorter.SortFrom;

            return protoSelf;
        };

        SortRules.prototype.toJS = function toJS() {
            var protoSelf = this;
            return {
                SortAttributeName: protoSelf.sortAttributeName,
                UseOverride: protoSelf.useOverride,
                OverrideFieldName: protoSelf.overrideFieldName,
                UseOrderArray: protoSelf.useOrderArray,
                OrderArray: protoSelf.orderArray,
                Asc: protoSelf.asc,
                AttributeValueName: protoSelf.attributeValueName,
                UseAttributes: protoSelf.useAttributes,
                SortFrom: protoSelf.sortFrom
            };
        };

        return self;
    };
})(EXCHANGE);