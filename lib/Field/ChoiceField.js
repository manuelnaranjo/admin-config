import Field from "./Field";

class ChoiceField extends Field {
    constructor(name) {
        super(name);
        this._type = "choice";
        this._choices = [];
    }

    choices(choices) {
        if (!arguments.length) return this._choices;
        this._choices = choices;

        return this;
    }

    getLabelForChoice(value, entry) {
        let choice = this.getChoiceObject(value, entry);
        return choice ? choice.label : null;
    }

    getChoiceObject(value, entry) {
        let choices = typeof(this._choices) === 'function' ? this._choices(entry) : this._choices;
        let choice = choices.filter(c => c.value == value).pop();
        return choice;
    }
}

export default ChoiceField;
