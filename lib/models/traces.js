'use strict';

const Schwifty = require('schwifty');
const Joi = require('joi');

module.exports = class Traces extends Schwifty.Model {

    static get tableName() {

        return 'traces';
    }

    static get joiSchema() {

        return Joi.object({
            image_id: Joi.number().required(),

            //JIMP Manipulations
            brightness: Joi.number(),
            contrast: Joi.number(),
            greyscale: Joi.boolean(),


            //Potrace
            turnpolicy: Joi.string().default('minority'),
            turdsize: Joi.number().default(20),
            alphamax: Joi.number().default(0),
            opttolerance: Joi.number().default(0),

            //Path Smoothing via smooth-polyline
            smoothing: Joi.boolean(),

            //Path Simplification
            simplify: Joi.number(),


            created_at: Joi.date(),
            modified_at: Joi.date()            

        }); // eslint-disable-line no-undef
    }
};
