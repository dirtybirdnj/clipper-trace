
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
        eventsTable.string( 'title', 250 ).notNullable();
        eventsTable.string( 'subtitle', 250 ).notNullable();

        eventsTable.timestamp( 'created_at' ).notNullable();
        eventsTable.timestamp( 'modified_at' );                

    } );

};

exports.down = function(knex, Promise) {
  
    return knex
        .schema
            .dropTableIfExists( 'images' )
            .dropTableIfExists( 'events' )

};
