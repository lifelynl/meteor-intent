Template.article.onCreated(function() {
    var comments = Session.get('comments');
    if (!comments || !comments.length) {
        Session.set('comments', [
            {
                username: 'Peter Peerdeman',
                comment: 'I like this article!'
            }
        ]);
    }
});

Template.article.helpers({
    article: function() {
        return {
            id: 1,
            title: 'About the Meteor meetup at Lifely',
            abstract: 'This is a small article about the Meteor meetup at the Lifely office.',
            paragraphs: [
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores atque, laborum, aliquam qui unde sed nostrum reiciendis aliquid, natus reprehenderit consequatur ducimus aspernatur delectus id ullam officia voluptatum voluptates enim? Iure qui, vero possimus saepe dolorum. Eaque laborum aspernatur id modi odit accusamus incidunt obcaecati. Doloremque eos, amet, placeat ea atque deserunt, voluptate ex mollitia, aliquid recusandae rerum quaerat rem! Doloribus aliquid aut nihil, adipisci officiis repudiandae, laborum laboriosam tenetur expedita reiciendis ab inventore veniam dolor nulla velit cum facere architecto nostrum voluptatum consectetur est sapiente eos. Excepturi odio repellat consectetur amet, sequi, eum pariatur, consequuntur, non neque ratione modi?'
            ]
        };
    },
    comments: function() {
        return Session.get('comments');
    }
});

Template.article.events({
    'submit #commentForm': function(event, template) {
        event.preventDefault();

        var form = event.currentTarget;
        var comment = form.elements.comment.value;

        var persist = function() {
            var comments = Session.get('comments');
            comments.push({
                username: Meteor.user().profile.name,
                comment: comment
            });
            Session.set('comments', comments);

            form.reset();
        };

        if (!Meteor.user()) {

            Intent.go({
                route: 'login'
            }, function(user) {
                if (!user) return;
                persist();
            });

        } else {
            persist();
        }

    }
});
