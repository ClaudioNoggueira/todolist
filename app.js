const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (request, response) {
    var today = new Date();
    var options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };

    var day = today.toLocaleDateString('pt-BR', options)

    response.render('list', { kindOfDay: day });
});



app.listen(3000, function () {
    console.log("✔ Server is running on port 3000");
});