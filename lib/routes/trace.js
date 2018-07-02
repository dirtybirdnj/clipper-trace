'use strict';

const fs = require('fs')
const boom = require('boom')
const moment = require('moment')
const potrace = require('potrace')

module.exports = [
{
    method: 'GET',
    path: '/traces',
    options: {
        description: 'Get a list of traces',
        handler: async (request, h) => {

            const { Traces } = request.models()
            return await Traces.query()

        }
    }
},
{
    method: 'POST',
    path: '/traces',
    options: {
        description: 'Create a new trace of an existing image',
        pre: [
        {
            assign: 'image', 
            method: async (request, h) => {

                const { Images } = request.models()
                const image = await Images.query().where('id',request.payload.image_id)
                return image[0]

            }
        },
        {
            assign: 'potrace',
            method: async (request, h) => {

                const newTrace = new Promise((resolve, reject) => {

                    potrace.trace(request.pre.image.path, (err, rawSvg) => {

                        if(err){
                            reject(err)
                        } else {

                            console.log('rawSVG trace!')
                            console.log(rawSvg)
                            resolve(rawSvg)

                        }

                    })

                })
                
                return newTrace

            }
        },
        {
            assign: 'trace',
            method: async (request, h) => {

                const { Traces } = request.models()

                let newTracePayload = {
                    created_at: moment().format(),
                    modified_at: moment().format(),
                    image_id: request.pre.image.id
                }
    
                newTracePayload.brightness = request.payload.image.brightness
                newTracePayload.contrast = request.payload.image.contrast
                newTracePayload.greyscale = request.payload.image.greyscale
    
                newTracePayload.turnpolicy = request.payload.potrace.turnpolicy
                newTracePayload.turdsize = request.payload.potrace.turdsize
                newTracePayload.alphamax = request.payload.potrace.alphamax
                newTracePayload.opttolerance = request.payload.potrace.opttolerance

                //If preview is true, don't save DB record just return the output of processing
                if(request.payload.preview){                

                    return newTracePayload

                } else {

                    try{ 
        
                        const newTrace = await Traces.query().insert(newTracePayload)
                        return newTrace
                    
                    } catch (err){
        
                        console.log(err)
                        return boom.badRequest(err.Error)
                    }

                }

            }
        }        
        ],        
        handler: async (request, h) => {
            
            request.pre.trace.svg = request.pre.potrace
            return request.pre.trace

        }
    }
}
];
