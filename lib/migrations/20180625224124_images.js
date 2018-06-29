
exports.up = function(knex, Promise) {

    return knex
    .schema
    .createTable( 'images', function( imagesTable ) {

        // Primary Key
        imagesTable.increments();

        //Path to image in S3
        imagesTable.string( 'path' ).notNullable().unique();

        imagesTable.integer( 'width' ).notNullable();
        imagesTable.integer( 'height' ).notNullable();

        imagesTable.integer( 'event_id' ).notNullable();

        imagesTable.timestamp( 'created_at' );
        imagesTable.timestamp( 'modified_at' );        

    } )

    .createTable( 'events', function( eventsTable ) {

        // Primary Key
        eventsTable.increments(); 

        // Data
        eventsTable.string( 'title', 250 ).notNullable().unique();
        eventsTable.string( 'subtitle', 250 ).notNullable();

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

        tracesTable.timestamp( 'created_at' ).notNullable();
        tracesTable.timestamp( 'modified_at' );                

    } );    

};

exports.down = function(knex, Promise) {
  
    return knex
        .schema
            .dropTableIfExists( 'traces' )
            .dropTableIfExists( 'images' )
            .dropTableIfExists( 'events' )

};
