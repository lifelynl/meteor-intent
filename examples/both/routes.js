/**
* Routes
*/
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
            articles: Articles.find()
        };
    }
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
            comments: Comments.find({article_id: this.params._id})
        };
    }
});

