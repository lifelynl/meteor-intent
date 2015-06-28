Template.login.onCreated(function() {
    this.error = new ReactiveVar();
});

Template.login.helpers({
    error: function() {
        return Template.instance().error.get();
    }
});

Template.login.events({
    'click #registerButton': function() {
        if (Intent.exists('login')) {
            event.preventDefault();

            Intent.go({route: 'register'}, function(user) {
                if (user) {
                    Intent.return('login');
                }
            });
        }
    },
    'submit #loginForm': function(event, template) {
        event.preventDefault();

        var form = event.currentTarget;

        var email = form.elements.email.value;
        var password = form.elements.password.value;

        Meteor.loginWithPassword(email, password, function(error) {
            if (error) {
                template.error.set('This user does not exist or the password was wrong');
                return;
            };

            Intent.return('login', {
                arguments: [Meteor.user()]
            });
        });
    }
});
