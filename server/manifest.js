'use strict';

const Dotenv = require('dotenv');
const Confidence = require('confidence');
const Toys = require('toys');

// Pull .env into process.env
Dotenv.config({ path: `${__dirname}/.env` });

// Glue manifest as a confidence store
module.exports = new Confidence.Store({
    server: {
        host: '0.0.0.0',
        port: process.env.PORT || 3000,
        debug: {
            $filter: 'NODE_ENV',
            development: {
                log: ['error', 'implementation', 'internal'],
                request: ['error', 'implementation', 'internal']
            }
        }
    },
    register: {
        plugins: [
            {
                plugin: '../lib', // Main plugin
                options: {
                    developmentMode: (process.env.NODE_ENV !== 'production')
                }
            },
            {
                plugin: 'blipp',
                options: {}
            },            
            {
                plugin: {
                    $filter: 'NODE_ENV',
                    $default: 'hpal-debug',
                    production: Toys.noop
                }
            },
            {
                plugin  : 'hapi-s3',
                options : {
                    publicKey : process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
                    secretKey : process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
                    bucket: process.env.BUCKETEER_BUCKET_NAME
                }
            },            
            {
                plugin: 'schwifty',
                options: {
                    $filter: 'NODE_ENV',
                    $default: {},
                    $base: {
                        migrateOnStart: true,
                        knex: {
                            client: 'sqlite3',
                            useNullAsDefault: true,         // Suggested for sqlite3
                            pool: {
                                idleTimeoutMillis: Infinity // Handles knex v0.12/0.13 misconfiguration when using sqlite3 (tgriesser/knex#1701)
                            },
                            connection: {
                                filename: 'clipper-trace.db'
                            }
                        }
                    },
                    production: {
                        migrateOnStart: false
                    }
                }
            },
            {
                plugin: 'node-hapi-airbrake',
                options: {
                  key: AIRBRAKE_API_KEY,
                  env: 'development',
                  appId: AIRBRAKE_PROJECT_ID, 
                  host: 'clipper-trace.herokuapp.com',
                  notify: 'notify'
                }
            }            
        ]
    }
});
