const express = require('express');
const apiRoute = require('./routes/rotateRoute');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' })); //allowing CORS permission to load the resources
app.use(express.json({ limit: '50mb', extended: true }));
app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(apiRoute);
const port = process.env.PORT || 3000; //env.PORT for production server and 3000 for local server connection
app.listen(port, () => console.log(`Listening on port ${port}...`));
