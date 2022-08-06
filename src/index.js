const express = require('express');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, './.env')});

const connectDb = require('./db/mongoose');
const notFound = require('./controllers/notFoundController')
const globalErrorHandler = require('./controllers/globalErrorHandler');
const userRouter = require('./routes/userRoute')


const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/',userRouter);
app.all('*',notFound);

app.use(globalErrorHandler)
const startApp = async() => {
    try {
        await connectDb(process.env.LOCALURI)
        app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
    } catch (err) {
        console.log(err);
    }
}

startApp();