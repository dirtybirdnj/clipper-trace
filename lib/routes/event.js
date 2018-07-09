'use strict';

const fs = require('fs')
const boom = require('boom')
const moment = require('moment')
const mkdirp = require('mkdirp')

module.exports = [
    {
        method: 'GET',
        path: '/events/json',
        options: {
            description: 'Return a JSON list of events',
            handler: async (request, h) => {
    
                const { Events } = request.models()
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
            handler: async (request, h) => {

                const { Events } = request.models()
                const events = await Events.query()

                console.log(events)

                return h.view('events/list', { events: events })

            }
        }
    },    
    {
        method: 'POST',
        path: '/events',
        options: {
            description: 'Create a new event',
            pre: [
                {
                    assign: 'event',
                    method: async (request, h) => {

                        const { Events } = request.models()

                        request.payload.created_at = moment().format()
                        request.payload.modified_at = moment().format()
        
                        console.log(request.payload)
        
                        return await Events.query().insert(request.payload).catch((error) => {
        
                            console.log(error)
                            return boom.badRequest(error)
                        })

                    }

                },
                {
                    assign: 'eventFolder',
                    method: (request, h) => {

                            mkdirp(`${process.env.UPLOAD_DIR}/events/${request.pre.event.id}`, (err) => {

                                if(err){
                                    console.log('error creating folder for event in uploads')
                                    console.log(err)
                                    return boom.badRequest(err)
                                }

                            })

                    }

                }                
            ],
            handler: async (request, h) => {

                return request.pre.event
    
            }
        }
    },
    {
        method: 'GET',
        path: '/events/{id}',
        options: {
            description: 'Display a UI for a single event',
            pre: [
                {
                    assign: 'event',
                    method: async (request, h) => {

                        const { Events } = request.models()
                        const event = await Events.query().where('id',request.params.id)
            
                        return event[0]                        

                    }
                },
                {
                    assign: 'images',
                    method: async (request, h) => {

                        const { Images } = request.models()
                        const images = await Images.query().where('event_id',request.pre.event.id)
            
                        return images      
                        
                    }
                },
                {
                    assign: 'uploads',
                    method: async (request, h) => {

                        const { Uploads } = request.models()
                        const uploads = await Uploads.query().where('event_id',request.pre.event.id)
            
                        return uploads      
                    }
                }                                
            ],
        handler: async (request, h) => {

            return h.view('events/view', { 
                    event: request.pre.event,
                    images: request.pre.images,
                    uploads: request.pre.uploads
                })

            }
        }
    }, 
    ];