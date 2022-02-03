const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');

const app = express();

const items = ['Eat', 'Sleep', 'Work', 'Repeat'];
const workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (request, response) {
    const day = date.getDate();
    response.render('list', { listTitle: day, allItems: items });
});

app.get('/work', function (request, response) {
    response.render('list', { listTitle: 'Work list', allItems: workItems })
});

app.post('/', function (request, response) {
    const item = request.body.todoItem;

    if (request.body.listSubject === 'Work') {
        workItems.push(item);
        response.redirect('/work')
    } else {
        items.push(item);
        response.redirect('/');
    }
});

app.listen(3000, function () {
    console.log("✔ Server is running on port 3000");
});