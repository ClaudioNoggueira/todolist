const express = require('express');
const bodyParser = require('body-parser');

const app = express();

let items = ['Eat', 'Sleep', 'Work', 'Repeat'];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (request, response) {
    let today = new Date();
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };

    let day = today.toLocaleDateString('en-US', options)

    response.render('list', { kindOfDay: day, allItems: items });
});

app.post('/', function (request, response) {
    let item = request.body.todoItem;
    items.push(item);
    response.redirect('/');
});


app.listen(3000, function () {
    console.log("✔ Server is running on port 3000");
});