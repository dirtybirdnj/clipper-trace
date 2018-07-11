'use strict';

const fs = require('fs')
const boom = require('boom')
const moment = require('moment')
const potrace = require('potrace')
const svgson = require('svgson')

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

                console.log('img')

                const { Images } = request.models()
                const image = await Images.query().where('id',request.payload.image_id)
                return image[0]

            }
        },
        {
            assign: 'upload',
            method: async (request, h) => {

                console.log('upload')

                const { Uploads } = request.models()
                const upload = await Uploads.query().where('id',request.pre.image.upload_id)
    
                return upload[0]                        

            }
        },           
        {
            assign: 'potrace',
            method: async (request, h) => {

                console.log('potrace')

                const newTrace = new Promise((resolve, reject) => {

                    potrace.trace(request.pre.upload.path, (err, rawSvg) => {

                        if(err){
                            reject(err)
                        } else {
                            resolve(rawSvg)
                        }
                    })
                })
                
                return newTrace

            }
        },
        {
            assign: 'svgson',
            method: async (request, h) => {

                // let response = await svgson(request.pre.potrace, {}, (result) => {

                //         console.log(JSON.stringify(result, null, 3))
                //         console.log('svgson! svgson!')

                //         return result

                // })

                // return response 


                const svgObj = new Promise((resolve, reject) => {

                    svgson(request.pre.potrace, {}, (result) => { 
                    
                        resolve(result) 
                    
                    })

                })

                return svgObj


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

                console.log(request.pre.svgson)
                console.log(request.payload)
    
                newTracePayload.image.brightness = request.payload.image.brightness
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
        },
        {
            assign: 'layers', 
            method: async (request, h) => {

                //foreach request.pre.svgson.childs
                //Create new path with child.attrs.d (or whatever the SVG has)
                


            }
        }        
        ],        
        handler: async (request, h) => {
            
            request.pre.trace.svg = request.pre.potrace
            return request.pre.trace

            //TODO: conditionally forward back to /images/{id}
            //TODO: Expose an endpoint /images/{id}/svg that uses the svg.hbs template, pulls all paths 


        }
    }
}
];
