Template.register.events({
    'submit #registerForm': function(event, template) {
        event.preventDefault();

        var form = event.currentTarget;

        Accounts.createUser({
            email: form.elements.email.value,
            password: form.elements.password.value,
            profile: {
                name: form.elements.name.value
            }
        }, function(error, user) {

            Intent.return('register', {
                arguments: [user]
            });

        });
    }
});
