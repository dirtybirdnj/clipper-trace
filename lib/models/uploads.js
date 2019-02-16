'use strict';

const Schwifty = require('schwifty');
const Joi = require('joi');
const moment = require('moment');

module.exports = class Uploads extends Schwifty.Model {

    static get tableName() {

        return 'uploads';
    }

    static get joiSchema() {

        return Joi.object({
            event_id: Joi.number().required (),
            path: Joi.string().required(),
            s3: Joi.string().required(),
            size: Joi.string().required(),
            width: Joi.number(),
            height: Joi.number(),
            size: Joi.number(),
            created_at: Joi.date(),
            modified_at: Joi.date()

        }); // eslint-disable-line no-undef
    }
};
