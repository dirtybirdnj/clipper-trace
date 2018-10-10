"use strict";

const fs = require('fs')
const boom = require('boom')
const moment = require('moment')
const potrace = require('potrace')
const svgson = require('svgson')
const svgpath = require('js-svg-path');
const jimp = require('jimp');

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
            assign: 'upload',
            method: async (request, h) => {

                const { Uploads } = request.models()
                const upload = await Uploads.query().where('id',request.pre.image.upload_id)
    
                return upload[0]                        

            }
        },
        {
            assign: 'jimp',
            method: async (request, h) => {

                console.log('ready to read jimp')

                return await jimp.read(request.pre.upload.path).then(function (upload) {
                    
                    console.log('jimp read resolved')

                    upload.brightness(-.5);
                    //upload.contrast(.8);

                    const jimpBuff = new Promise((resolve, reject) => {
                        
                        console.log('promise started')

                        upload.getBuffer(jimp.MIME_PNG, (err, buff) => {

                            if(err){
                                console.log(err)
                                reject(err)
                            } else {
                                console.log(buff)
                                resolve(buff);
                            }
    
                        })

                    })

                    console.log('done?!')

                    return jimpBuff

                })

            }
        },
        {
            assign: 'potrace',
            method: async (request, h) => {

                const newTrace = new Promise((resolve, reject) => {

                    console.log(request.pre.jimp);

                    //potrace.trace(request.pre.upload.path, (err, rawSvg) => {
                    potrace.trace(request.pre.jimp, (err, rawSvg) => {

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
    
                if(request.payload['image.brightness']) newTracePayload.brightness = request.payload['image.brightness']
                if(request.payload['image.contrast']) newTracePayload.contrast = request.payload['image.contrast']
                if(request.payload['image.greyscale']) newTracePayload.greyscale = request.payload['image.greyscale']
    
                if(request.payload['potrace.turnpolciy']) newTracePayload.turnpolicy = request.payload.potrace.turnpolicy
                if(request.payload['potrace.turdsize']) newTracePayload.turdsize = request.payload.potrace.turdsize
                if(request.payload['potrace.alphamax']) newTracePayload.alphamax = request.payload.potrace.alphamax
                if(request.payload['potrace.opttolerance']) newTracePayload.opttolerance = request.payload.potrace.opttolerance

                //If preview is true, don't save DB record just return the output of processing
                if(request.payload.preview){                

                    return newTracePayload

                } else {

                    try{ 
        
                        const newTrace = await Traces.query().insert(newTracePayload)
                        return newTrace
                    
                    } catch (err){
        
                        console.log('error creating new trace record')
                        console.log(err)
                        return boom.badRequest(err.Error)
                    }

                }

            }
        },
        {
            assign: 'layers', 
            method: async (request, h) => {

                const { Layers } = request.models()

                let newLayers = request.pre.svgson.childs.map((child) => {


                    // Create new layer payload with child.attrs.d (or whatever the SVG has)
                    // Child schema: { name, attrs: { d, stroke, fill, fillRule} }
                    //console.log(child)

                    return {
                        trace_id: request.pre.trace.id,
                        image_id: request.pre.image.id, 
                        path: JSON.stringify(child),
                        created_at: moment().format(),
                        modified_at: moment().format()
                    }
                    
                })

                try {
                    
                    let newLayer = await Layers.query().insert(newLayers)            
                    return newLayer[0].id
                
                } catch (err){
    
                    console.log('error creating new Layer record')
                    console.log(err)
                    return boom.badRequest(err.Error)
                } 
                
            }
        }        
        ],        
        handler: async (request, h) => {

            //request.pre.trace.svg = request.pre.potrace
            //request.pre.trace.layers = request.pre.layers
            ///return request.pre.trace

            return h.redirect(`images/${request.pre.image.id}`)

        }
    }
}
];
