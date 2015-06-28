Meteor.startup(function() {

    if (!Meteor.users.find().count()) {

        Meteor.users.insert({
            _id : 'K5c5M4Pbdg3B82wQH',
            createdAt : new Date(),
            services : {
                password : {
                    bcrypt : '$2a$10$nytjhtAbBUXe1Td8LrVJ4.jJa/lE62riuDM/dm79f3fqfeuZo2xNG'
                }
            },
            emails: [
                {
                    address : 'user@example.com',
                    verified : false
                }
            ],
            profile: {
                name: 'Peter Peerdeman'
            }
        });
    }

    if (!Articles.find().count()) {

        Articles.insert({
            _id: 'ujTRNQvzQfPuKkQBe',
            title: 'About the Meteor meetup at Lifely',
            abstract: 'This is a small article about the Meteor meetup at the Lifely office.',
            paragraphs: [
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores atque, laborum, aliquam qui unde sed nostrum reiciendis aliquid, natus reprehenderit consequatur ducimus aspernatur delectus id ullam officia voluptatum voluptates enim? Iure qui, vero possimus saepe dolorum. Eaque laborum aspernatur id modi odit accusamus incidunt obcaecati. Doloremque eos, amet, placeat ea atque deserunt, voluptate ex mollitia, aliquid recusandae rerum quaerat rem! Doloribus aliquid aut nihil, adipisci officiis repudiandae, laborum laboriosam tenetur expedita reiciendis ab inventore veniam dolor nulla velit cum facere architecto nostrum voluptatum consectetur est sapiente eos. Excepturi odio repellat consectetur amet, sequi, eum pariatur, consequuntur, non neque ratione modi?'
            ]
        });
    }

    if (!Comments.find().count()) {

        Comments.insert({
            _id: 'tehQPkfJ6eCPnHE4N',
            user_id: 'K5c5M4Pbdg3B82wQH',
            article_id: 'ujTRNQvzQfPuKkQBe',
            content: 'I like this article!'
        });
    }

});
