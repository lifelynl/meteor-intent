Template.article.helpers({
    commentUser: function() {
        return Meteor.users.findOne(this.user_id);
    }
});

Template.article.events({
    'submit #commentForm': function(event, template) {
        event.preventDefault();

        var form = event.currentTarget;
        var comment = form.elements.comment.value;

        var persist = function() {
            Meteor.call('articles.comment', template.data.article._id, comment);
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
