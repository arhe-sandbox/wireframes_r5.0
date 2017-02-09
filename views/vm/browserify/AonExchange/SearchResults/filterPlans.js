(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.plans');

    ns.FilterRules = function FilterRules() {
        if (!(this instanceof FilterRules)) {
            return new FilterRules();
        }
        var self = this;
        self._arr = [];

        // filters will be a set of objects. Each object will be a FilterRuleObject, defined below
        var filters = []; // To keep it private

        self.addFilter = function (filter) { // Just make sure it's an actual FIlterRuleObject
            if (!filter instanceof EXCHANGE.plans.FilterRuleObject) {
                return false;
            }
            else {
                filters.push(filter);
                return true;
            }
        };

        self.filter = function (array) {
            // Assumes that the items passed in in array have a .clone() function, which produces a deep copy of the item.

            array.forEach(function (planSearchResultsVM, i) {
                if (filterFunc(planSearchResultsVM)) {
                    planSearchResultsVM.Visible(true);
                }
                else {
                    planSearchResultsVM.Visible(false);
                }
            });

        };

        // Empty out the current filters, so we can start fresh
        self.clearFilters = function () {
            filters = [];
        };

        self.clearFilterByGroup = function clearFiltersByGroup(groupName) {
            var tokeep = [];
            for (var i = 0; i < filters.length; i++) {
                if (!(filters[i].filterGroup === groupName)) {
                    tokeep.push(filters[i]);
                }
            }

            filters = tokeep;
        };

        function getFormattedValue(attributeValue) {
            switch (attributeValue.DataType) {
                case app.enums.AttributeDataTypeEnum.DATETIME:
                    return new Date(attributeValue.FormattedValue);
                case app.enums.AttributeDataTypeEnum.STRING:
                    return attributeValue.Value;
                case app.enums.AttributeDataTypeEnum.NUMERIC:
                case app.enums.AttributeDataTypeEnum.CURRENCY:
                default:
                    var parsedVal = parseFloat(attributeValue.Value);
                    if (!isNaN(parsedVal)) {
                        return parsedVal;
                    }
                    return attributeValue.Value;
            }
        }

        function getFromValues(attribute, valueName) {
            var valueLength = attribute.AttributeValues.length;
            for (var i = 0; i < valueLength; i++) {
                if (attribute.AttributeValues[i].Name === valueName) {
                    return getFormattedValue(attribute.AttributeValues[i]);
                }
            }

            return null;
        }

        function filterFunc(plan) {
            var currentFilter, currentValue;
            var length = filters.length;
            for (var i = 0; i < length; i++) { // For each filter
                currentFilter = filters[i]; // Update the current filter

                if (currentFilter.useAttributes) { // So we need to look at the attributes object on the plan

                    var setLength = plan.srAttributeTemplate.AttributeGroups ? plan.srAttributeTemplate.AttributeGroups.length : 0;
                    for (var j = setLength - 1; j >= 0; j--) {
                        var attLength = plan.srAttributeTemplate.AttributeGroups[j].Attributes ? plan.srAttributeTemplate.AttributeGroups[j].Attributes.length : 0;
                        for (var k = attLength - 1; k >= 0; k--) {
                            if (plan.srAttributeTemplate.AttributeGroups[j].Attributes[k].Name == currentFilter.attributeName) {
                                var attr = plan.srAttributeTemplate.AttributeGroups[j].Attributes[k];
                                if ((currentFilter.filterGroup == "TravelFilterForMedicare") && (plan.RecommendationInfo.IsTravelCoverageAttribute != true))
                                    attr = null;
                            }
                        }
                    }

                    if (!attr) { // We need the attribute to exist before we do the next line. If it doesn't exist, then the value isn't allowed, anyway.
                        return false;
                    }
                    currentValue = getFromValues(attr, currentFilter.attributeValueName);
                }
                else { // It's just on the actual plan object (for ones on the actual plan, the value is just what's in there, not a low/high val

                    //Added for Medigap Travle filter
                    if (currentFilter.filterGroup == "TravelFilterForMediGap") {

                        var setLength = plan.srAttributeTemplate.AttributeGroups ? plan.srAttributeTemplate.AttributeGroups.length : 0;
                        for (var j = setLength - 1; j >= 0; j--) {
                            var attLength = plan.srAttributeTemplate.AttributeGroups[j].Attributes ? plan.srAttributeTemplate.AttributeGroups[j].Attributes.length : 0;
                            for (var k = attLength - 1; k >= 0; k--) {
                                if (plan.srAttributeTemplate.AttributeGroups[j].Attributes[k].Name == "Foreign Travel") {
                                    //var attr = plan.srAttributeTemplate.AttributeGroups[j].Attributes[k];
                                    currentValue = plan[currentFilter.attributeName];
                                }
                            }
                        }
                    }
                    currentValue = plan[currentFilter.attributeName];
                }

                if (!currentFilter.filterFunction(currentValue)) {
                    return false;
                }
            }

            return true;
        }

        return self;

    };
})(EXCHANGE);

(function (app) {
    //"use strict";
    var ns = app.namespace('EXCHANGE.plans');

    // This is the object that defines the individual filter rule. It will have:
    // An attribute name,
    // Whether it's on the plan or on the attributes object,
    // and a function that takes that value and returns true if it should be in the result set
    ns.FilterRuleObject = function FilterRuleObject(params) {
        if (!(this instanceof FilterRuleObject)) {
            return new FilterRuleObject(params);
        }
        var self = this;

        self.attributeName = params && params.attributeName ? params.attributeName : '';
        self.useAttributes = params && params.useAttributes ? params.useAttributes : false;
        self.attributeValueName = params && params.attributeValueName ? params.attributeValueName : 'lowVal';
        self.filterFunction = params && params.filterFunction ? params.filterFunction : function (val) { return self.allowedValues.indexOf(val) !== -1; };
        self.filterGroup = params && params.filterGroup ? params.filterGroup : '';
        self.allowedValues = params && params.allowedValues ? params.allowedValues : [];

        FilterRuleObject.prototype.toJS = function toJS() {
            var protoSelf = this;
            return {
                AttributeName: protoSelf.attributeName,
                UseAttributes: protoSelf.useAttributes,
                AttributeValueName: protoSelf.attributeValueName,
                FilterFunction: protoSelf.filterFunction.toString()
            };
        };

        return self;
    };

})(EXCHANGE);
