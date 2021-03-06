import Application from "./Application";
import Entity from "./Entity/Entity";
import DataStore from "./DataStore/DataStore";
import PromisesResolver from "./Utils/PromisesResolver";

import ReadQueries from "./Queries/ReadQueries";
import WriteQueries from "./Queries/WriteQueries";

import Field from "./Field/Field";
import BooleanField from "./Field/BooleanField";
import ChoiceField from "./Field/ChoiceField";
import ChoicesField from "./Field/ChoicesField";
import DateField from "./Field/DateField";
import DateTimeField from "./Field/DateTimeField";
import EmailField from "./Field/EmailField";
import EmbeddedListField from "./Field/EmbeddedListField";
import FloatField from "./Field/FloatField.js";
import FileField from "./Field/FileField";
import JsonField from "./Field/JsonField";
import NumberField from "./Field/NumberField";
import PasswordField from "./Field/PasswordField";
import ReferenceField from "./Field/ReferenceField";
import ReferencedListField from "./Field/ReferencedListField";
import ReferenceManyField from "./Field/ReferenceManyField";
import TemplateField from "./Field/TemplateField";
import TextField from "./Field/TextField";
import WysiwygField from "./Field/WysiwygField";
import FieldSet from "./Field/FieldSet";
import RowField from "./Field/RowField";

import NestedReferenceField from "./Field/NestedReferenceField";
import NestedReferencedListField from "./Field/NestedReferencedListField";

import Menu from './Menu/Menu';
import Collection from './Collection';
import Dashboard from './Dashboard';
import Entry from './Entry';

class Factory {
    constructor() {
        console.log('new Factory');
        this._fieldTypes = [];
        this._init();
    }

    application(name, debug) {
        return new Application(name, debug);
    }

    entity(name) {
        return new Entity(name);
    }

    field(name, type) {
        type = type || 'string';

        if (!(type in this._fieldTypes)) {
            throw new Error(`Unknown field type "${type}".`);
        }

        return new this._fieldTypes[type](name);
    }

    row() {
        return new RowField();
    }

    fieldset(name) {
        return new FieldSet(name);
    }

    registerFieldType(name, constructor) {
        this._fieldTypes[name] = constructor;
    }

    getFieldConstructor(name) {
        return this._fieldTypes[name];
    }

    menu(entity) {
        let menu = new Menu();
        if (entity) {
            menu.populateFromEntity(entity);
        }
        return menu;
    }

    dashboard() {
        return new Dashboard();
    }

    collection(entity) {
        let collection = new Collection();
        if (entity) {
            collection.setEntity(entity);
        }
        return collection;
    }

    getEntryConstructor() {
        return Entry;
    }

    getDataStore() {
        return new DataStore();
    }

    getReadQueries(RestWrapper, PromisesResolver, Application) {
        return new ReadQueries(RestWrapper, PromisesResolver, Application);
    }

    getWriteQueries(RestWrapper, PromisesResolver, Application) {
        return new WriteQueries(RestWrapper, PromisesResolver, Application);
    }

    getPromisesResolver() {
        return PromisesResolver;
    }

    _init() {
        this.registerFieldType('boolean', BooleanField);
        this.registerFieldType('choice', ChoiceField);
        this.registerFieldType('choices', ChoicesField);
        this.registerFieldType('date', DateField);
        this.registerFieldType('datetime', DateTimeField);
        this.registerFieldType('email', EmailField);
        this.registerFieldType('embedded_list', EmbeddedListField);
        this.registerFieldType('float', FloatField);
        this.registerFieldType('string', Field);
        this.registerFieldType('file', FileField);
        this.registerFieldType('json', JsonField);
        this.registerFieldType('number', NumberField);
        this.registerFieldType('password', PasswordField);
        this.registerFieldType('reference', ReferenceField);
        this.registerFieldType('reference_many', ReferenceManyField);
        this.registerFieldType('referenced_list', ReferencedListField);
        this.registerFieldType('template', TemplateField);
        this.registerFieldType('text', TextField);
        this.registerFieldType('wysiwyg', WysiwygField);
        this.registerFieldType('nested_reference', NestedReferenceField);
        this.registerFieldType('nested_referenced_list', NestedReferencedListField);
        this.registerFieldType('fieldset', FieldSet);
        this.registerFieldType('row', RowField);
    }
}

export default Factory;
