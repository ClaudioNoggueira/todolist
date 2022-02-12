const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require('lodash');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect("mongodb+srv://admin-claudio:" + process.env.MONGODB_ADMIN_PASSWORD + "@cluster0.m3qqo.mongodb.net/todolistDB");

const day = _.capitalize(date.getDay());

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

app.get('/', (request, response) => {
    response.redirect('/home');
});

app.get('/home', (request, response) => {
    Item.find((err, documents) => {
        if (documents.length === 0) { /// if there is no documents on database
            Item.insertMany(defaultItems, (err) => {
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

app.get('/:listTitle', (request, response) => {
    const listTitle = _.capitalize(request.params.listTitle);
    List.findOne({ name: listTitle }, (err, queryResult) => {
        if (!err) {
            if (!queryResult) {
                const list = new List({
                    name: listTitle,
                    items: defaultItems
                });

                list.save();
                response.redirect('/' + listTitle);
            } else {
                response.render('list', { listTitle: queryResult.name, allItems: queryResult.items })
            }
        } else {
            console.log("Unable to find list. Error: " + err);
        }
    });
});

app.post('/', (request, response) => {
    const list = _.capitalize(request.body.list);

    const newItem = new Item({
        name: request.body.newItem
    });

    if (list === day) {
        newItem.save();
        response.redirect('/');
    } else {
        List.findOne({ name: list }, (err, result) => {
            result.items.push(newItem);
            result.save();
            response.redirect('/' + list);
        });
    }
});

app.post('/delete', (request, response) => {
    const checkedItemId = request.body.checkItem;
    const listName = request.body.listName;

    if (listName === day) {
        Item.findByIdAndRemove({ _id: checkedItemId }, (err) => {
            if (!err) {
                console.log("Successfully deleted checked item.");
                response.redirect('/');
            }
        });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, (err, result) => {
            if (!err) {
                response.redirect('/' + listName);
            }
        });
    }
});

app.listen(3000, () => {
    console.log("✔ Server is running on port 3000");
});