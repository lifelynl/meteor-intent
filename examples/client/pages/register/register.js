Template.register.events({
    'click #cancelButton': function(event) {
        event.preventDefault();

        Intent.return('register');
    },
    'submit #registerForm': function(event, template) {
        event.preventDefault();

        var form = event.currentTarget;

        Accounts.createUser({
            email: form.elements.email.value,
            password: form.elements.password.value,
            profile: {
                name: form.elements.name.value
            }
        }, function(error) {

            if (error) {
                alert('An error occured while creating an account. Please check the form.')
                return;
            }

            Intent.return('register', {
                arguments: [Meteor.user()]
            });

        });
    }
});
