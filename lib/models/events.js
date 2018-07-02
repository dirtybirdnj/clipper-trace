'use strict';

const Schwifty = require('schwifty');
const Joi = require('joi');
const moment = require('moment');

module.exports = class Events extends Schwifty.Model {

    static get tableName() {

        return 'events';
    }

    static get joiSchema() {

        return Joi.object({
            title: Joi.string().required(),
            subtitle: Joi.string().optional(),
            created_at: Joi.date(),
            modified_at: Joi.date()
        }); // eslint-disable-line no-undef
    }
};
