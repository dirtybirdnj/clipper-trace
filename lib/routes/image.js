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
        description: 'Handle local image storage and remote upload',
        payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
        },
        pre: [{
            assign: 'upload', 
            method: async (request, h) => {

                if(!request.payload.image){

                    //return boom('Must provide an image!')
                    return boom.badRequest('Must pass an image!')
    
                } 

                let image = request.payload.image;

                //TODO: Fix this path!
                var path = '/Users/matgilbert/vtapico/clipper-trace/uploads/' + request.payload.filename
                var file = fs.createWriteStream(path);

                file.on('error', function (err) { 
                    console.log('file error?')
                    console.error(err) 
                });

                await image.pipe(file)

                return true

            }
        }],        
        handler: async (request, h) => {
                    
            const { Images } = request.models()

            var path = '/Users/matgilbert/vtapico/clipper-trace/uploads/' + request.payload.filename

            //TODO use the node-imageinfo module to divine image dimensions
            //TODO would like to add filesize too

            let newImagePayload = {
                path: path, 
                width: 10,
                height: 10,
                event_id: request.payload.event_id
            }

            request.payload.created_at = moment().format()
            request.payload.modified_at = moment().format()

            try { 

                return await Images.query().insert(newImagePayload)            
            
            } catch (err){

                console.log(err)
                return boom.badRequest(err.Error)
            }

        }
    }
}
];
