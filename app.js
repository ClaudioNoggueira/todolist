const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistDB');

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model('Item', itemsSchema);

const welcome = new Item({
    name: 'Welcome to your to do list!'
});

const hint1 = new Item({
    name: 'Hit the + button to add a new item.'
});

const hint2 = new Item({
    name: '<-- Hit this to delete an item.'
});

// Item.insertMany([welcome, hint1, hint2], function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('✔ Successfully added to collection');
//     }
// });

app.get('/', function (request, response) {
    const day = date.getDate();
    response.render('list', { listTitle: day, allItems: [welcome.name, hint1.name, hint2.name] });
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