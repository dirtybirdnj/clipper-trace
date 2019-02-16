'use strict';

const Schwifty = require('schwifty');
const Joi = require('joi');
const moment = require('moment');
const Uploads = require('./uploads.js')

module.exports = class Events extends Schwifty.Model {

    static get tableName() {

        return 'events';
    }

    static get virtualAttributes() {
        return ['startTime']
    }

    static get relationMappings() {

    return {

            owner: {
                relation: this.HasManyRelation,
                modelClass: Uploads,
                join: {
                    from: 'events.id',
                    to: 'uploads.event_id'
                }
            }

        }

    }

    get startTime() {

        return moment(this.start_time).format('dddd, MMMM Do YYYY, h:mm:ss a')
    }

    static get joiSchema() {

        return Joi.object({
            title: Joi.string().required(),
            subtitle: Joi.string().optional(),
            location: Joi.string().optional(),
            start_time: Joi.date(),
            created_at: Joi.date(),
            modified_at: Joi.date()
        }); // eslint-disable-line no-undef
    }
};
