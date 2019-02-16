'use strict';

const Handlebars = require('handlebars');

module.exports = (server, options) => ({
    path: __dirname + '/templates',
    relativeTo: __dirname,
    partialsPath: 'templates/partials',
    layoutPath: 'templates/layout',
    layout: 'main',
    helpersPath: 'templates/helpers',
    //isCached: !options.developmentMode,
    isCached: false,
    defaultExtension: 'hbs',
    engines: {
        hbs: Handlebars
    },
    context: {
        options,
        baseURI: server.realm.modifiers.route.prefix || ''
    }
});