'use strict';

module.exports = [
{
    method: 'GET',
    path: '/images',
    options: {
        description: 'Get a list of images',
        handler: async (request, h) => {

            const { Images } = request.models()
            const images = await Images.query()

            return images

        }
    }
},
{
    method: 'POST',
    path: '/images',
    options: {
        description: 'Create a new image',
        handler: async (request, h) => {

            return 'create new image, handle upload'

        }
    }
}
];
