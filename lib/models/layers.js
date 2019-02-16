'use strict';

const Schwifty = require('schwifty');
const Joi = require('joi');
const moment = require('moment');

module.exports = class Layers extends Schwifty.Model {

    static get tableName() {

        return 'layers';
    }

    static get joiSchema() {

        return Joi.object({
            trace_id: Joi.number().required(), //What created the layer
            image_id: Joi.number().required(), //What it belongs to
            path: Joi.string(),
            created_at: Joi.date(),
            modified_at: Joi.date()
        }); // eslint-disable-line no-undef
    }
};
