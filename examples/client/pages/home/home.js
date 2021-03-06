/**
* Helpers for home
*/
Template.home.helpers({
    cases: function() {
        return [
            {
                title: 'Automatic page return',
                description: 'The user simply wants to login, but does not want to lose his current location in the application.',
                steps: [
                    'Log out if you\'re logged in',
                    'Go to Articles',
                    'Click login',
                    'Login (signup if necessary)',
                    'You\'re back at the Articles page!'
                ]
            },
            {
                title: 'Automatic page return with action',
                description: 'The user wants to post a comment on a nice article, but that action requires a user account. He already typed out his comment, and doesn\'t want to lose this.',
                steps: [
                    'Log out if you\'re logged in',
                    'Go to Articles > About the Meteor meetup at Lifely',
                    'Add a comment',
                    'Login',
                    'There\'s your comment!'
                ]
            },
            {
                title: 'Restricted routes',
                description: 'When a route isn\'t accessible by an anonymous user, you\'ll probably want to let the user log in.',
                steps: [
                    'Log out if you\'re logged in',
                    'Go to Articles > Create new article',
                    'Login (signup if necessary)',
                    'There\'s your page!'
                ]
            },
            {
                title: 'Deeply inherited intents',
                description: 'Even when the user is far away from his initial action, the user should always be brought back and the action should always be completed.',
                steps: [
                    'Log out if you\'re logged in',
                    'Go to Articles > About the Meteor meetup at Lifely',
                    'Add a comment',
                    'Click signup',
                    'Create an account',
                    'There\'s your comment!'
                ]
            }
        ];
    }
});
