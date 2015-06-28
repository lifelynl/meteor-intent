Meteor.methods({

    'articles.insert': function(article) {

        check(article, Object);
        check(article.title, String);
        check(article.abstract, String);
        check(article.paragraphs, [String]);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'Unauthorized.');

        return Articles.insert({
            title: article.title,
            abstract: article.abstract,
            paragraphs: article.paragraphs
        });
    },

    'articles.comment': function(articleId, comment) {

        check(comment, String);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'Unauthorized.');

        var article = Articles.findOne({_id: articleId});
        if (!article) throw new Meteor.Error(404, 'Article not found.');

        return Comments.insert({
            user_id: user._id,
            article_id: article._id,
            content: comment
        });
    }

});
