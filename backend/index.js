const express = require('express');
const fetchInputs = require('./routes/fetchInputs');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' })); //allowing CORS permission to load the resources
app.use(express.json());
app.use(fetchInputs);

const port = process.env.PORT || 3000; //env.PORT for production server and 3000 for local server connection
app.listen(port, () => console.log(`Listening on port ${port}...`));
