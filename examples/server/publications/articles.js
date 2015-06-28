Meteor.publish('articles.all', function() {
    return Articles.find();
});

Meteor.publishComposite('articles.one', function(articleId) {
    return {
        find: function() {
            return Articles.find({_id: articleId});
        },
        children: [
            {
                find: function(article) {
                    return Comments.find({article_id: article._id});
                },
                children: [
                    {
                        find: function(comment) {
                            return Meteor.users.find({_id: comment.user_id});
                        }
                    }
                ]
            }
        ]
    };
});
