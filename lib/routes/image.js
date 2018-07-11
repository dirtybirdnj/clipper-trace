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
                    upload_id: request.payload.upload_id
                }
    
                request.payload.created_at = moment().format()
                request.payload.modified_at = moment().format()
    
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
