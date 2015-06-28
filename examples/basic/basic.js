/**
* Routes
*/
Router.route('/', {
    name: 'home',
    where: 'client',
    template: 'home'
});

Router.route('/login', {
    name: 'login',
    where: 'client',
    template: 'login'
});


if (Meteor.isClient) {

    /**
    * Configure the fallback route
    */
    Intent.configure({
        debug: true,
        fallback_route_name: 'home'
    });

    /**
    * Some example states
    */
    Session.set('user', false);
    Session.set('action_performed', false);

    /**
    * Helpers for home
    */
    Template.home.helpers({
        actionPerformed: function() {
            return Session.get('action_performed');
        },
        user: function() {
            return Session.get('user');
        }
    });

    /**
    * Events for home
    */
    Template.home.events({
        'click #perform-action': function(event, template) {
            event.preventDefault();

            if (!Session.get('user')) {
                Intent.go({
                    route: 'login'
                }, function() {

                    if (Session.get('user')) {
                        Session.set('action_performed', true);
                    }

                });
            } else {
                Session.set('action_performed', true);
            }

        },
        'click #reset-action': function(event, template) {
            event.preventDefault();
            Session.set('action_performed', false);
        },
        'click #reset-user': function(event, template) {
            event.preventDefault();
            Session.set('user', false);
        }
    });

    /**
    * Events for login
    */
    Template.login.events({
        'click #log-me-in': function(event, template) {
            event.preventDefault();
            Session.set('user', true);

            Intent.return('login');
        }
    });
}
