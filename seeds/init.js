
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('events').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        {
          id: 1, 
          title: 'First Event', 
          subtitle: 'First event ever.'
        },
      ]);
    });
};
