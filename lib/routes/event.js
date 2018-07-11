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

                        let newEventPayload = request.payload

                        //For JSON / web view
                        delete newEventPayload.forward

                        newEventPayload.created_at = moment().format()
                        newEventPayload.modified_at = moment().format()
        
                        return await Events.query().insert(newEventPayload).catch((error) => {
        
                            console.log('error creating new event')
                            console.log(error)
                            return boom.badRequest(error)
                        })

                    }

                },
                {
                    assign: 'eventFolder',
                    method: (request, h) => {

                        let path = `${process.env.UPLOAD_DIR}/events/${request.pre.event.id}`

                        mkdirp(path , (err) => {

                            if(err){
                                console.log('error creating folder for event in uploads')
                                console.log(err)
                                return boom.badRequest(err)
                            }

                            return path

                        })

                    }

                }                
            ],
            handler: async (request, h) => {

                if(request.payload.forward){

                    //Forward user to web UI
                    return h.redirect(`/events/${request.pre.event.id}`)

                } else {

                    //Just respond with JSON payload
                    return request.pre.event

                }
    
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
                    assign: 'uploads',
                    method: async (request, h) => {

                        const { Uploads } = request.models()
                        const uploads = await Uploads.query().where('event_id',request.pre.event.id)
            
                        return uploads.map(((upload) => { return upload.id }))    

                    }
                },
                {
                    assign: 'images',
                    method: async (request, h) => {

                        //TODO: Find better way to handle errors from these async getters

                        console.log(request.pre.uploads)

                        const { Images } = request.models()
                        const images = await Images.query().where('upload_id', 'IN', request.pre.uploads)
            
                        console.log('------')
                        console.log(images)
                        console.log('------')

                        return images      
                        
                    }
                },                                                
            ],
        handler: async (request, h) => {

            console.log(request.pre.images)

            return h.view('events/view', { 
                    event: request.pre.event,
                    images: request.pre.images,
                    uploads: request.pre.uploads
                })

            }
        }
    }, 
    ];