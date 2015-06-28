Meteor.user = function() {
    return Session.get('user');
};
Meteor.loginWithPassword = function(email, password, callback) {
    Meteor.setTimeout(function() {
        var user = Session.get('registered-user');

        if (!user || user.email !== email) {
            callback(true, null);
            return;
        }

        Session.set('user', user);
        callback(false, user);
    }, 500);
};

Accounts = {};
Accounts.createUser = function(options, callback) {
    Meteor.setTimeout(function() {
        var user = {
            id: 1,
            email: options.email,
            profile: {
                name: options.profile.name
            }
        };

        Session.set('registered-user', user);
        Session.set('user', user);

        callback(false, user);
    }, 500);
};
