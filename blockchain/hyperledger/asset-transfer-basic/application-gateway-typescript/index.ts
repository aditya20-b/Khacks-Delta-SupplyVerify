import express from 'express';
import bodyParser from 'body-parser';
import router from './src/app';

const app = express();
const port = process.env.PORT || 3000;

// Use body-parser middleware to handle JSON requests.
app.use(bodyParser.json());

// Mount the supply chain API routes under a prefix (e.g., /api)
app.use(router);

app.listen(port, () => {
    console.log(`Supply Chain API server listening on port ${port}`);
});
