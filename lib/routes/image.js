'use strict';

const fs = require('fs')
const boom = require('boom')
let moment = require('moment')

module.exports = [
{
    method: 'GET',
    path: '/images/json',
    options: {
        description: 'Return a JSON list of images',
        handler: async (request, h) => {

            const { Images } = request.models()
            const images = await Images.query()

            return images

        }
    }
},
{
    method: 'GET',
    path: '/images',
    options: {
        description: 'Display a UI list of images',
        handler: (request, h) => {

            return h.view('images/list', { images: [1,2,3,4,5] })

        }
    }
},   
{
    method: 'GET',
    path: '/images/create',
    options: {
        description: 'Display a UI for creating a new image',
        handler: (request, h) => {

            return h.view('images/create')

        }
    }
},
{
    method: 'GET',
    path: '/images/{id}',
    options: {
        description: 'Display a UI for viewing image, traces, upload source',
        pre: [
            {
                assign: 'image',
                method: async (request, h) => {

                    const { Images } = request.models()
                    const image = await Images.query().where('id',request.params.id)
        
                    return image[0]                        

                }
            },
            {
                assign: 'upload',
                method: async (request, h) => {

                    const { Uploads } = request.models()
                    const upload = await Uploads.query().where('id',request.pre.image.upload_id)
        
                    return upload[0]                        

                }
            },
            {
                assign: 'traces',
                method: async (request, h) => {

                    const { Traces } = request.models()
        

                    try{

                        const traces = await Traces.query().where('image_id',request.pre.image.id)
                   return traces   

                    } catch (err){

                        console.log(err)
                        return err
                    }

                }
            },             
            {
                assign: 'layers',
                method: async (request, h) => {

                    const traceIDs = request.pre.traces.map(((trace) => { return trace.id })) 

                    const { Layers } = request.models()
                    const layers = await Layers.query().where('trace_id', 'IN', traceIDs)
        
                    return layers                        

                }
            }                       
        ],
        handler: (request, h) => {

            console.log('main handler')

            return h.view('images/view', { 
                
                image: request.pre.image,
                upload: request.pre.upload,
                traces: request.pre.traces,
                layers: request.pre.layers

            
            })

        }
    }
},       
{
    method: 'POST',
    path: '/images',
    options: {
        description: 'Create image to associate traces and paths',
        pre: [{
            assign: 'image', 
            method: async (request, h) => {

                const { Images } = request.models()
    
                let newImagePayload = {
                    width: request.payload.width,
                    height: request.payload.height,
                    upload_id: request.payload.upload_id,
                    event_id: request.payload.event_id,
                    created_at: moment().format('YYYY/MM/DD HH:mm:ss'),
                    modified_at: moment().format('YYYY/MM/DD HH:mm:ss')
                }
    
                try { 
    
                    return await Images.query().insert(newImagePayload)            
                
                } catch (err){
    
                    console.log('error creating new image record')
                    console.log(err)
                    return boom.badRequest(err.Error)
                }                


            }
        }],        
        handler: async (request, h) => {
                    
            
            return request.pre.image

        }
    }
}
];
