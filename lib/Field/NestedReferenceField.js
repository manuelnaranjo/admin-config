import ReferenceField from './ReferenceField';

class NestedReferenceField extends ReferenceField {
    constructor(name) {
        super(name);
        this._type = 'nested_reference';
        this._nestedField = null;
    }

    nestedField(nfield) {
        if (arguments.length === 0) {
            return this._nestedField || this;
        }
        this._nestedField = nfield;
        return this;
    }

    referenceId (entry) {
        console.log('referenceId', entry);
        var nested = this.nestedField();
        var id = this.targetEntity().identifier().name();
        nested = nested.name();
        return entry.values[nested+'.'+id];
    }

    labelDisplay(entry) {
        var nested = this.nestedField().name();
        var target = this.targetField().name();

        return entry.values[nested+'.'+target];
    }
}

export default NestedReferenceField;
