const express = require('express');
const bodyParser = require('body-parser');
const routeApp = require('./routes/app-route');
const mongoose = require('mongoose');

mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const app = express();
app.use(bodyParser.json({ extended: true }));
app.use(routeApp);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
