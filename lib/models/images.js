'use strict';

const Schwifty = require('schwifty');
const Joi = require('joi');

module.exports = class Images extends Schwifty.Model {

    static get tableName() {

        return 'images';
    }

    static get joiSchema() {

        return Joi.object({}); // eslint-disable-line no-undef
    }
};
