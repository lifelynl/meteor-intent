Template.new_article.events({
    'submit #createArticleForm': function(event, template) {
        event.preventDefault();

        var form = event.currentTarget;
        var article = {
            title: form.elements.title.value,
            abstract: form.elements.abstract.value,
            paragraphs: [
                form.elements.paragraph1.value,
                form.elements.paragraph2.value,
            ],
        };

        var proceed = function() {
            Meteor.call('articles.insert', article, function(error, articleId) {
                Router.go('article', {_id: articleId});
            });
            form.reset();
        };

        if (!Meteor.user()) {

            Intent.go({
                route: 'login'
            }, function(user) {
                if (!user) return;
                proceed();
            });

        } else {
            proceed();
        }

    }
});
