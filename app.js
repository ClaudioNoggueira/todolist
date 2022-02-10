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

const defaultItems = [welcome, hint1, hint2];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model('List', listSchema);

app.get('/', function (request, response) {
    response.redirect('/home');
});

app.get('/home', function (request, response) {
    const day = date.getDate();
    Item.find(function (err, documents) {
        if (documents.length === 0) { /// if there is no documents on database
            Item.insertMany(defaultItems, function (err) {
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

app.get('/:listTitle', function (request, response) {
    List.findOne({ name: request.params.listTitle }, function (err, result) {
        if (!err) {
            if (!result) { // doesn't exists, so create a new one
                const list = new List({
                    name: request.params.listTitle,
                    items: defaultItems
                });

                list.save();
                response.redirect('/' + request.params.listTitle)
            } else { // exists
                response.render('list', { listTitle: result.name, allItems: result.items })
            }
        } else {
            console.log("Unable to find list.");
        }
    });
});

app.post('/', function (request, response) {
    const listName = request.body.listName;

    const newItem = new Item({
        name: request.body.newItem
    });

    if (listName === date.getDate()) {
        newItem.save();
        response.redirect('/');
    } else {
        List.findOne({ name: listName }, function (err, result) {
            result.items.push(newItem);
            result.save();
            response.redirect('/' + listName);
        });
    }
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