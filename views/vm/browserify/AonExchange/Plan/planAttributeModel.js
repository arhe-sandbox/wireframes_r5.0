
(function (app, global) {
    var ns = app.namespace('EXCHANGE.plans');

    ns.PlanAttributeModel = function PlanAttributeModel(params) {
        if (!(this instanceof PlanAttributeModel)) {
            return new PlanAttributeModel(params);
        }
        var self = this;

        self.attributeId = params.Id;
        self.attributeName = params.Name;
        self.lowVal = params.Fields[0].AttributeValue;
        self.lowFormattedVal = params.Fields[0].FormattedValue;
        self.highVal = params.Fields.length > 1 ? params.Fields[1].AttributeValue : null;
        self.highFormattedVal = params.Fields.length > 1 ? params.Fields[1].FormattedValue : null;
        self.sequence = params.Sequence;

        PlanAttributeModel.prototype.equals = function equals(other) {
            var self = this;
            if (other.attributeId !== self.attributeId) {
                return false;
            }
            if (other.attributeName !== self.attributeName) {
                return false;
            }
            if (other.lowVal !== self.lowVal) {
                return false;
            }
            if (other.lowFormattedVal !== self.lowFormattedVal) {
                return false;
            }
            if (other.highVal !== self.highVal) {
                return false;
            }
            if (other.highFormattedVal !== self.highFormattedVal) {
                return false;
            }
            if (other.sequence !== self.sequence) {
                return false;
            }

            return true;
        };

        PlanAttributeModel.prototype.clone = function clone() {
            var protoSelf = this;
            var newItem = new PlanAttributeModel({
                Id: protoSelf.attributeId,
                Name: protoSelf.attributeName,
                Fields: [{
                    AttributeValue: protoSelf.lowVal,
                    FormattedValue: protoSelf.lowFormattedVal
                }, {
                    AttributeValue: protoSelf.highVal,
                    FormattedValue: protoSelf.highFormattedVal
                }],
                Sequence: protoSelf.sequence
            });
            return newItem;
        };

    };

} (EXCHANGE, this));
