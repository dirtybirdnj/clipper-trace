'use strict';

const Schwifty = require('schwifty');
const Joi = require('joi');

module.exports = class Images extends Schwifty.Model {

    static get tableName() {

        return 'images';
    }

    static get joiSchema() {

        return Joi.object({
            upload_id: Joi.number().required (),
            path: Joi.string(),
            width: Joi.number(),
            height: Joi.number(),
            //size: Joi.number(),
            //svgTemplate: Joi.string(),
            created_at: Joi.date(),
            modified_at: Joi.date()

        }); // eslint-disable-line no-undef
    }
};
