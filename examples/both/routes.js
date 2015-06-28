Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    name: 'home',
    where: 'client',
    template: 'home'
});

Router.route('/login', {
    name: 'login',
    where: 'client',
    template: 'login'
});

Router.route('/register', {
    name: 'register',
    where: 'client',
    template: 'register'
});

Router.route('/articles', {
    name: 'articles',
    where: 'client',
    template: 'articles',
    subscriptions: function() {
        this.subscribe('articles.all');
    },
    data: function() {
        return {
            articles: Articles.find({}, {sort: {created_at: -1}})
        };
    }
});

Router.route('/articles/new', {
    name: 'new-article',
    where: 'client',
    template: 'new_article'
});

Router.route('/articles/:_id', {
    name: 'article',
    where: 'client',
    template: 'article',
    subscriptions: function() {
        this.subscribe('articles.one', this.params._id);
    },
    data: function() {
        return {
            article: Articles.findOne(this.params._id),
            comments: Comments.find({article_id: this.params._id}, {sort: {created_at: 1}})
        };
    }
});

Router.onBeforeAction(function() {
    var next = this.next;

    if (Meteor.user()) {
        next();
    } else {
        Intent.go({route: 'login'}, function(user) {
            if (user) next();
            else this.back();
        }, {prevent_going_back: true});
    }
}, {
    where: 'client',
    only: [
        'new-article'
    ]
});
