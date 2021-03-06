import stringUtils from "../Utils/stringUtils";
import {deepClone} from "../Utils/objectProperties";

class Field {
    constructor(name) {
        this._name = name || Math.random().toString(36).substring(7);
        this._detailLink = (name === 'id');
        this._type = "string";
        this._order = null;
        this._label = null;
        this._maps = [];
        this._transforms = [];
        this._attributes = {};
        this._cssClasses = null;
        this._validation = { required: false, minlength : 0, maxlength : 99999 };
        this._defaultValue = null;
        this._editable = true;
        this._detailLinkRoute = 'edit';
        this._pinned = false;
        this._flattenable = true;
        this.dashboard = true;
        this.list = true;
        this._labelCssClasses = null;
        this._template = () => '';
        this._tooltip = null;
    }

    isContainer () {
        return this.isRow() || this.isFieldset();
    }

    isRow() {
        return this._type === 'row';
    }

    isFieldset() {
        return this._type === 'fieldset';
    }

    unfoldFields() {
        if (!this.isContainer()) {
            return [this];
        }

        if (this.isRow()) {
            return this.fields();
        }

        let out = [];
        this.rows().forEach(row => {
            out = _.union(out, row.unfoldFields());
        });

        return out;
    }


    label() {
        if (arguments.length) {
            this._label = arguments[0];
            return this;
        }

        if (this._label === null) {
            return stringUtils.camelCase(this._name);
        }

        return this._label;
    }

    type() {
        return this._type;
    }

    name() {
        if (arguments.length) {
            this._name = arguments[0];
            return this;
        }

        return this._name;
    }

    order() {
        if (arguments.length) {
            this._order = arguments[0];
            return this;
        }

        return this._order;
    }

    isDetailLink(detailLink) {
        if (arguments.length) {
            this._detailLink = arguments[0];
            return this;
        }

        if (this._detailLink === null) {
            return this._name === 'id';
        }

        return this._detailLink;
    }

    set detailLink(isDetailLink) {
        return this._detailLink = isDetailLink;
    }

    /**
     * Add a function to be applied to the response object to turn it into an entry
     */
    map(fn) {
        if (!fn) return this._maps;
        if (typeof(fn) !== "function") {
            let type = typeof(fn);
            throw new Error(`Map argument should be a function, ${type} given.`);
        }

        this._maps.push(fn);

        return this;
    }

    hasMaps() {
        return !!this._maps.length;
    }

    getMappedValue(value, entry) {
        for (let i in this._maps) {
            value = this._maps[i](value, entry);
        }

        return value;
    }

    /**
     * Add a function to be applied to the entry to turn it into a response object
     */
    transform(fn) {
        if (!fn) return this._transforms;
        if (typeof(fn) !== "function") {
            let type = typeof(fn);
            throw new Error(`transform argument should be a function, ${type} given.`);
        }

        this._transforms.push(fn);

        return this;
    }

    hasTranforms() {
        return !!this._transforms.length;
    }

    getTransformedValue(value, entry) {
        for (let i in this._transforms) {
            value = this._transforms[i](value, entry);
        }

        return value;
    }

    attributes(attributes) {
        if (!arguments.length) {
            return this._attributes;
        }

        this._attributes = attributes;

        return this;
    }

    cssClasses(classes) {
        if (!arguments.length) return this._cssClasses;
        this._cssClasses = classes;
        return this;
    }

    labelCssClasses(classes) {
        if (!arguments.length){
            if (this._labelCssClasses !== null) {
                return this._labelCssClasses;
            }

            return 'col-sm-2 control-label';
        }
        this._labelCssClasses = classes;
        return this;
    }

    getCssClasses(entry) {
        if (!this._cssClasses) {
            return '';
        }

        if (this._cssClasses.constructor === Array) {
            return this._cssClasses.join(' ');
        }

        if (typeof(this._cssClasses) === 'function') {
            return this._cssClasses(entry);
        }

        return this._cssClasses;
    }

    validation(validation) {
        if (!arguments.length) {
            return this._validation;
        }

        for (let property in validation) {
            if (!validation.hasOwnProperty(property)) continue;
            if (validation[property] === null) {
                delete this._validation[property];
            } else {
                this._validation[property] = validation[property];
            }
        }

        return this;
    }

    defaultValue(defaultValue) {
        if (!arguments.length) return this._defaultValue;
        this._defaultValue = defaultValue;
        return this;
    }

    editable(editable) {
        if (!arguments.length) return this._editable;
        this._editable = editable;
        return this;
    }

    detailLinkRoute(route) {
        if (!arguments.length) return this._detailLinkRoute;
        this._detailLinkRoute = route;
        return this;
    }

    pinned(pinned) {
        if (!arguments.length) return this._pinned;
        this._pinned = pinned;
        return this;
    }

    flattenable() {
        return this._flattenable;
    }

    clone() {
        return deepClone(this);
    }

    getTemplateValue(data) {
        if (typeof(this._template) === 'function') {
            return this._template(data);
        }

        return this._template;
    }

    template(template) {
        if (!arguments.length) return this._template;
        this._template = template;
        return this;
    }

    tooltip(tooltip) {
        if (!arguments.length) return this._tooltip;
        this._tooltip = tooltip;
        return this;
    }

    getTooltip(entry) {
        if (typeof(this._tooltip) === 'function') {
            return this._tooltip(entry);
        }

        return this._tooltip;
    }
}

export default Field;
