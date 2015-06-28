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
    template: 'articles'
});

Router.route('/articles/:id', {
    name: 'article',
    where: 'client',
    template: 'article'
});

