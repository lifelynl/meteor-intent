Template.main.events({
    'click #navLoginButton': function(event, template) {
        event.preventDefault();
        Intent.go({route: 'login'});
    },
    'click #navSignoutButton': function(event, template) {
        event.preventDefault();
        Meteor.logout();
    }
});
