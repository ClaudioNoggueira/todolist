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

app.get('/', function (request, response) {
    const day = date.getDate();
    Item.find(function (err, documents) {
        if (documents.length === 0) { /// if there is no documents on database
            Item.insertMany([welcome, hint1, hint2], function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('✔ Successfully added default items to collection');
                }
            });
        }
        response.render('list', { listTitle: day, allItems: documents });
    });
});


app.get('/work', function (request, response) {
    response.render('list', { listTitle: 'Work list', allItems: workItems })
});

app.post('/', function (request, response) {
    const newItem = new Item({
        name: request.body.todoItem
    });

    // if (request.body.listSubject === 'Work') {
    //     workItems.push(item);
    //     response.redirect('/work')
    // } else {
    //     items.push(item);
    //     response.redirect('/');
    // }

    newItem.save();
    response.redirect('/');
});

app.post('/delete', function (request, response) {
    const checkedItemId = request.body.checkItem;
    Item.findByIdAndRemove({ _id: checkedItemId }, function (err) {
        if (!err) {
            console.log("Successfully deleted checked item.");
            response.redirect('/');
        }
    });
});

app.listen(3000, function () {
    console.log("✔ Server is running on port 3000");
});