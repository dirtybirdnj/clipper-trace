
exports.up = function(knex, Promise) {

    return knex
    .schema
    .createTable( 'images', function( imagesTable ) {

        // Primary Key
        imagesTable.increments();

        imagesTable.integer( 'upload_id' ).notNullable();

        //Path to image in S3
        imagesTable.string( 'path' ).unique();

        //Width in inches since Cricut machine works with that
        imagesTable.integer( 'width' ).notNullable();
        imagesTable.integer( 'height' ).notNullable();

        //imagesTable.string( 'svg_template' ).notNullable();

        imagesTable.timestamp( 'created_at' );
        imagesTable.timestamp( 'modified_at' );        

    } )

    .createTable( 'events', function( eventsTable ) {

        // Primary Key
        eventsTable.increments(); 

        // Data
        eventsTable.string( 'title', 250 ).notNullable().unique();
        eventsTable.string( 'subtitle', 250 ).notNullable();

        //Where the event is occuring
        //JSON { lat: 'xxx', lon: 'yyy' }
        eventsTable.string('location');

        //The start time of the event
        eventsTable.date('start_time')
        
        //Estimated Duration of event in minutes
        eventsTable.integer('duration')

        eventsTable.timestamp( 'created_at' ).notNullable();
        eventsTable.timestamp( 'modified_at' );                

    } )

    .createTable( 'traces', function( tracesTable ) {

        // Primary Key
        tracesTable.increments(); 

        // Parent
        tracesTable.integer( 'image_id' ).notNullable();

        //Image Manipulations
        tracesTable.integer( 'brightness' ).nullable()
        tracesTable.integer( 'contrast' ).nullable()
        tracesTable.integer( 'greyscale' ).nullable()

        //Potrace
        tracesTable.string( 'turnpolicy' ).default('minority')
        tracesTable.integer( 'optcurve' ).default(1)
        tracesTable.integer( 'turdsize' ).default(20)
        tracesTable.integer( 'alphamax' ).default(0)
        tracesTable.integer( 'opttolerance' ).default(0)

        //smooth-polyline
        tracesTable.boolean( 'smoothing' ).default(false)
        
        tracesTable.integer( 'simplify' ).default(0)
        tracesTable.boolean( 'simplifyHQ' ).default(false)        

        tracesTable.timestamp( 'created_at' ).notNullable();
        tracesTable.timestamp( 'modified_at' );                

    } )

    .createTable( 'uploads', function( uploadsTable ) {

        // Primary Key
        uploadsTable.increments();

        uploadsTable.integer( 'event_id' ).notNullable();

        //Path to local file
        uploadsTable.string( 'path' ).notNullable().unique();

        //Path to file in S3
        uploadsTable.string( 's3' ).notNullable().unique();

        uploadsTable.integer( 'width' ).notNullable();
        uploadsTable.integer( 'height' ).notNullable();

        //Image size in bytes (let the FE deal with B, KB, MB display)
        uploadsTable.string( 'size' ).notNullable();

        uploadsTable.timestamp( 'created_at' );
        uploadsTable.timestamp( 'modified_at' );        

    } )    
    
    .createTable( 'layers', function( layersTable ) {

        // Primary Key
        layersTable.increments(); 

        // Parent
        layersTable.integer( 'trace_id' ).notNullable();
        layersTable.string('path').notNullable();

        layersTable.timestamp( 'created_at' ).notNullable();
        layersTable.timestamp( 'modified_at' );                

    } );       

};

exports.down = function(knex, Promise) {
  
    return knex
        .schema
            .dropTableIfExists( 'layers' )
            .dropTableIfExists( 'uploads' )        
            .dropTableIfExists( 'traces' )
            .dropTableIfExists( 'images' )
            .dropTableIfExists( 'events' )

};
