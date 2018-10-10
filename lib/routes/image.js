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

            //TODO: Actually query for a list of images to display
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

            //TODO: This is a placeholder for experimenting with UI
            //More work for this being done on /images/{id} (view)
            return h.view('images/create')

        }
    }
},
{
    method: 'GET',
    path: '/images/{id}/svg',
    options: {
        description: 'Return an assembled SVG of the image, all layers',
        pre: [
            {
                assign: 'image',
                method: async (request, h) => {

                    const { Images } = request.models()
                    const image = await Images.query().where('id',request.params.id)
        
                    if(image[0]){

                        return image[0]

                    } else {

                        console.log('error - invalid image ID supplied')
                        return boom.badRequest('Invalid image id')

                    }
                  
                }
            },            
            {
                assign: 'layers',
                method: async (request, h) => {

                    const { Layers } = request.models()
                    const layers = await Layers.query().where('image_id', request.pre.image.id)

                    //console.log(layers)
        
                    return layers         

                }
            },
            {
                assign: 'parsedLayers',
                method: (request, h) => {

                    return request.pre.layers.map(layer => {

                        let newData = JSON.parse(layer.path)

                        let newElement = {

                            id : layer.id,
                            trace_id: layer.trace_id,
                            image_id: layer.image_id,
                            data: newData.attrs,
                            created_at: layer.created_at,
                            modified_at: layer.modified_at

                        }

                        return newElement

                    })


                }
            }
        ],
        handler: (request, h) => {

            console.log(request.pre.image)


            return h.view('images/svg', { 
                
                width: request.pre.image.width, 
                height: request.pre.image.height,
                layers: request.pre.parsedLayers

            } , { layout: 'svg' }).type('image/svg+xml')

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
        pre: [
            {
                assign: 'upload',
                method: async (request, h) => {

                    const { Uploads } = request.models()
                    const upload = await Uploads.query().where('id',request.payload.upload_id)
        
                    //TODO: ERROR HANDLING

                    return upload[0]                        

                }
            },
            {
            assign: 'image', 
            method: async (request, h) => {

                const { Images } = request.models()
    
                let newImagePayload = {
                    width: request.pre.upload.width,
                    height: request.pre.upload.height,
                    upload_id: request.pre.upload.id,
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
        }
        ],        
        handler: async (request, h) => {
                    
            
            return request.pre.image

        }
    }
}
];
