'use strict';

let moment = require('moment')

module.exports = [
    {
        method: 'GET',
        path: '/events',
        options: {
            description: 'Get a list of events',
            handler: async (request, h) => {
    
                const { Events } = request.models()
                const events = await Events.query()
    
                return events
    
            }
        }
    },
    {
        method: 'POST',
        path: '/events',
        options: {
            description: 'Create a new event',
            handler: async (request, h) => {

                const { Events } = request.models()

                request.payload.created_at = moment().format()
                request.payload.modified_at = moment().format()

                console.log(request.payload)

                return await Events.query().insert(request.payload)


                //return newEvent

                // try {

                //     newEvent = await Events.query().insert(request.payload)
                //     console.log(newEvent)
                //     return newEvent

                // } catch(err){

                //     if(err){
                //         console.log(err)
                //         return err
                //     }

                // }  
    
            }
        }
    }
    ];