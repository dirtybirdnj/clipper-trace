'use strict';

let moment = require('moment')

module.exports = [
    {
        method: 'GET',
        path: '/events/json',
        options: {
            description: 'Return a JSON list of events',
            handler: async (request, h) => {
    
                const { Events } = request.m
                odels()
                const events = await Events.query()
    
                return events
    
            }
        }
    },
    {
        method: 'GET',
        path: '/events',
        options: {
            description: 'Display a UI list of events',
            handler: (request, h) => {

                return h.view('events/list', { events: [1,2,3,4,5] })

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