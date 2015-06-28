Meteor.methods({
    'articles.comment': function(articleId, comment) {

        if (!comment) throw new Meteor.Error(400, 'Comment is empty.');
        if (typeof comment !== 'string') throw new Meteor.Error(400, 'Comment is not a string.');

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'Unauthorized.');

        var article = Articles.findOne({_id: articleId});
        if (!article) throw new Meteor.Error(404, 'Article not found.');

        var comment = Comments.insert({
            user_id: user._id,
            article_id: article._id,
            content: comment
        });

    }
});
