'use strict';

// const fs = require('fs')
// const boom = require('boom')
// let moment = require('moment')

module.exports = [
{
    method: 'GET',
    path: '/layers/{id}',
    options: {
        description: 'Return an individual layer',
        handler: async (request, h) => {

            const { Layers } = request.models()
            const layer = await Layers.query().where('id', request.params.id)

            return layer[0]

        }
    }
}
]