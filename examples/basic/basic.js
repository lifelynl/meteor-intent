// Configure routes
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

    Intent.configure({
        fallback_route_name: 'home'
    });

    Session.set('user', false);
    Session.set('action_performed', false);

    Template.home.helpers({
        actionPerformed: function() {
            return Session.get('action_performed');
        },
        user: function() {
            return Session.get('user');
        }
    });

    Template.home.events({
        'click #perform-action': function(event, template) {
            event.preventDefault();

            if (!Session.get('user')) {
                Intent.go({
                    route: 'login'
                }, function(back) {
                    if (Session.get('user')) {
                        Session.set('action_performed', true);
                    }

                    back();
                });
            }

            Session.set('action_performed', true);
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

    Template.login.events({
        'click #log-me-in': function(event, template) {
            event.preventDefault();
            Session.set('user', true);
            Intent.return('login');
        }
    });
}
