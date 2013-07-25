Categories = new Meteor.Collection('categories');

Categories.allow({
  insert: isAdminById
, update: isAdminById
, remove: isAdminById
});

Meteor.methods({
  category: function(category){
    if (!Meteor.user() || !isAdmin(Meteor.user()))
      throw new Meteor.Error('Seuls les administrateurs peuvent ajouter une nouvelle catégorie.') 
    var categoryId=Categories.insert(category);
    return category.name;
  }
});
