Template.signup.events({
    'click #cancelButton': function(event) {
        event.preventDefault();

        Intent.return('signup');
    },
    'submit #signupForm': function(event, template) {
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

            Intent.return('signup', {
                arguments: [Meteor.user()]
            });

        });
    }
});
