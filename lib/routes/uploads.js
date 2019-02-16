
'use strict';

const Dotenv = require('dotenv');
const fs = require('fs')
const boom = require('boom')
const moment = require('moment')
const calipers = require('calipers')('png', 'jpeg', 'bmp');

const { open, write, close } = require('fildes');


module.exports = [
{
    method: 'GET',
    path: '/uploads/json',
    options: {
        description: 'Return a JSON list of uploads',
        handler: async (request, h) => {

            const { Uploads } = request.models()
            const uploads = await Uploads.query()

            return uploads

        }
    }
},
{
    method: 'GET',
    path: '/uploads',
    options: {
        description: 'Display a UI list of uploads',
        handler: (request, h) => {

            return h.view('uploads/list', { images: [1,2,3,4,5] })

        }
    }
},
{
    method: 'GET',
    path: '/uploads/{id}/src',
    options: {
        description: 'Returns image from s3 for UI display',
        pre: [
            {

                assign: 'upload',
                method: async (request, h) => {

                    const { Uploads } = request.models()
                    const upload = await Uploads.query().where('id', request.params.id)

                    if(upload[0]){
                        return upload[0]
                    } else {
                        boom.badRequest(`Upload with id ${request.params.id} does not exist`)
                    }
        
                }
            },
            {
                //Really annoying that this doesnt work
                // return h.file(request.pre.upload.path)
                assign: 'fileStream',
                method: (request, h) => {

                    return fs.createReadStream(request.pre.upload.path)

                }
            }
        ],
        handler: (request, h) => {

            return request.pre.fileStream

        }
    }
},
{
    method: 'POST',
    path: '/uploads',
    options: {
        description: 'Handle local file storage and remote file upload',
        payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
        },
        pre: [
            {   
                assign: 'event',
                method: async (request, h) => {

                    const { Events } = request.models()
                    const event = await Events.query().where('id',request.payload.event_id)
        
                    if(!event[0]){
                        return boom.badRequest(`Cannot continue, ${request.payload.event_id} is not a valid event ID`)
                    }

                    return event[0]            

                }
            },
            {
            assign: 'localFile', 
            method: async (request, h) => {

                let { event } = request.pre
                let { image } = request.payload

                if(!request.payload.image){
                    return boom.badRequest('No image found in payload!')
                } 

                //TODO: Validation that the correct filetypes have been uploaded:
                //Valid image formats: .bmp, .jpg, .jpeg, .png
                
                var path = `${process.env.UPLOAD_DIR}/events/${event.id}/${image.hapi.filename}`
                var file = fs.createWriteStream(path);

                file.on('error', function (err) { 
                    console.log('file error?')
                    console.error(err)
                    return boom.badRequest(err) 
                });

                await image.pipe(file)

                return {
                    path: path,
                    stream: file,
                    filename: image.hapi.filename
                }

            }
        },
        {
            //Determine the width/height of the image being passed
            assign: 'fileDimensions',
            method: (request, h) => {

                console.log(request.pre.localFile)

                return calipers.measure(request.pre.localFile.path)
                .then((result) => {

                    return result.pages[0]

                })
                .catch((err) => {

                    console.log('file dimensions error!')
                    console.log(err)
                    return boom.badRequest(err)
                })

            }

        },
        {
            assign: 's3',
            method: async (request, h) => {

                const { s3 }  = request.server

                let params = {
                    bucket: process.env.AWS_BUCKET,
                    key: `testing-hooray/${request.pre.localFile.filename}`,
                    body: request.pre.localFile.stream
                }

                console.log('if I could send things to S3, this is what I\'d send!')
                console.log(params)

                // try{

                //     const response = await s3.upload(params)
                //     console.log(response)
                //     return 'abc123' + moment()

                // } catch (err) {
                //     console.log('ERR!!')
                //     console.log(err)
                //     return 'bad things happened'
                // }

                return 'abc123' + moment()


                // try {

                //     return s3.upload(params).then((result)=> {

                //         console.log('s3s3!!!!!!')
                //         console.log(result)
                        
                //         return 'diditwork?' + moment()


                //     }).catch((err) => {

                //         console.log('error uploading to s3!')
                //         console.log(err)
                //         return boom.badRequest(err)
                //     })

                // } catch (err) {

                //     console.log('what a pain!')
                //     console.log(err)

                // }
                
            }
        },
        {
            assign: 'upload',
            method: async (request, h) => {

                const { Uploads } = request.models()

                //TODO get filesize of image, store in bytes
                //TODO use filesize module to display it human readable
    
                let newUploadPayload = {
                    path: request.pre.localFile.path,
                    //size: request.pre.localFile.size,
                    size: 0,
                    s3: request.pre.s3,
                    width: request.pre.fileDimensions.width,
                    height: request.pre.fileDimensions.height,
                    event_id: request.payload.event_id
                }
    
                console.log(newUploadPayload)
    
                request.payload.created_at = moment().format()
                request.payload.modified_at = moment().format()
    
                try { 
    
                    return await Uploads.query().insert(newUploadPayload)            
                
                } catch (err){
    
                    console.log('error saving upload record')
                    console.log(JSON.stringify(err, null, 3))
                    
                    return boom.badRequest(err)
                }

            }

        }
        ],        
        handler: async (request, h) => {
                    
            if(request.payload.forward){

                return await h.redirect(`/events/${request.payload.event_id}`)

            } else {

                return request.pre.upload

            }

        }
    }
}
];
