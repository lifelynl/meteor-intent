Template.article.onRendered(function() {
    this.highlightComment = function(comment_id) {
        var comment_element_id = '#comment-' + comment_id;
        location.hash = comment_element_id;
        $(comment_element_id).addClass('comment-highlight'); // can't use template.find here because by the time this gets ran, template is out of rendered DOM range
    };
});

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

        var proceed = function() {
            Meteor.call('articles.comment', template.data.article._id, comment, function(error, comment_id) {
                template.highlightComment(comment_id);
            });
            form.reset();
        };

        if (!Meteor.user()) {

            Intent.go({
                route: 'login'
            }, function(user) {
                if (user) proceed();
            });

        } else {
            proceed();
        }

    }
});
