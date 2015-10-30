import Entry from "../Entry";
import {clone, cloneAndFlatten, cloneAndNest} from '../Utils/objectProperties';
import ReferenceExtractor from '../Utils/ReferenceExtractor';

class View {
    constructor(name) {
        this.entity = null;
        this._actions = null;
        this._title = false;
        this._description = '';
        this._template = null;

        this._enabled = false;
        this._fields = [];
        this._type = null;
        this._name = name;
        this._order = 0;
        this._errorMessage = null;
        this._url = null;
    }

    get enabled() {
        return this._enabled || !!this._fields.length;
    }

    title(title) {
        if (!arguments.length) return this._title;
        this._title = title;
        return this;
    }

    description() {
        if (arguments.length) {
            this._description = arguments[0];
            return this;
        }

        return this._description;
    }

    name(name) {
        if (!arguments.length) {
            return this._name || this.entity.name() + '_' + this._type;
        }

        this._name = name;
        return this;
    }

    disable() {
        this._enabled = false;

        return this;
    }

    enable() {
        this._enabled = true;

        return this;
    }

    /**
     * @deprecated Use getter "enabled" instead
     */
    isEnabled() {
        return this.enabled;
    }

    /**
     * @deprecated Use getter "entity" instead
     */
    getEntity() {
        return this.entity;
    }

    /**
     * @deprecated Specify entity at view creation or use "entity" setter instead
     */
    setEntity(entity) {
        this.entity = entity;
        if (!this._name) {
            this._name = entity.name() + '_' + this._type;
        }

        return this;
    }

    /*
     * Supports various syntax
     * fields([ Field1, Field2 ])
     * fields(Field1, Field2)
     * fields([Field1, {Field2, Field3}])
     * fields(Field1, {Field2, Field3})
     * fields({Field2, Field3})
     */
    fields() {
        if (!arguments.length) return this._fields;

        [].slice.call(arguments).map(function(argument) {
            View.flatten(argument).map(arg => this.addField(arg));
        }, this);

        return this;
    }

    hasFields() {
        return this.fields.length > 0;
    }

    removeFields() {
        this._fields = [];
        return this;
    }

    getFields() {
        return this._fields;
    }

    getField(fieldName) {
        return this._fields.filter(f => f.name() === fieldName)[0];
    }

    getFieldsOfType(type) {
        return this._fields.filter(f => f.type() === type);
    }

    addField(field) {
        if (field.order() === null) {
            field.order(this._fields.length, true);
        }
        this._fields.push(field);
        this._fields = this._fields.sort((a, b) => (a.order() - b.order()));

        return this;
    }

    static flatten(arg) {
        if (arg.constructor.name === 'Object') {
            console.warn('Passing literal of Field to fields method is deprecated use array instead');
            let result = [];
            for (let fieldName in arg) {
                result = result.concat(View.flatten(arg[fieldName]));
            }
            return result;
        }
        if (Array.isArray(arg)) {
            return arg.reduce(function(previous, current) {
                return previous.concat(View.flatten(current))
            }, []);
        }
        // arg is a scalar
        return [arg];
    }

    get type() {
        return this._type;
    }

    order(order) {
        if (!arguments.length) return this._order;
        this._order = order;
        return this;
    }

    getReferences(withRemoteComplete) {
        return ReferenceExtractor.getReferences(this._fields, withRemoteComplete);
    }

    getNonOptimizedReferences(withRemoteComplete) {
        return ReferenceExtractor.getNonOptimizedReferences(this._fields, withRemoteComplete);
    }

    getOptimizedReferences(withRemoteComplete) {
        return ReferenceExtractor.getOptimizedReferences(this._fields, withRemoteComplete);
    }

    getReferencedLists() {
        return ReferenceExtractor.getReferencedLists(this._fields);
    }

    template(template) {
        if (!arguments.length) {
            return this._template;
        }

        this._template = template;

        return this;
    }

    identifier() {
        return this.entity.identifier();
    }

    actions(actions) {
        if (!arguments.length) return this._actions;
        this._actions = actions;
        return this;
    }

    getErrorMessage(response) {
        if (typeof(this._errorMessage) === 'function') {
            return this._errorMessage(response);
        }

        return this._errorMessage;
    }

    errorMessage(errorMessage) {
        if (!arguments.length) return this._errorMessage;
        this._errorMessage = errorMessage;
        return this;
    }

    url(url) {
        if (!arguments.length) return this._url;
        this._url = url;
        return this;
    }

    getUrl(identifierValue) {
        if (typeof(this._url) === 'function') {
            return this._url(identifierValue);
        }

        return this._url;
    }

    validate(entry) {
        this._fields.map(function (field) {
            let validation = field.validation();

            if (typeof validation.validator === 'function') {
                validation.validator(entry.values[field.name()], entry.values);
            }
        });
    }

    /**
     * Map a JS object from the REST API Response to an Entry
     */
    mapEntry(restEntry) {
        return Entry.createFromRest(restEntry, this._fields, this.entity.name(), this.entity.identifier().name());
    }

    mapEntries(restEntries) {
        return Entry.createArrayFromRest(restEntries, this._fields, this.entity.name(), this.entity.identifier().name());
    }

    /**
     * Transform an Entry to a JS object for the REST API Request
     */
    transformEntry(entry) {
        return entry.transformToRest(this._fields);
    }
}

export default View;
