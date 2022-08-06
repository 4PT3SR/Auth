const mongoose = require('mongoose');

const connectDb = (URI) => {
    return mongoose.connect(URI)
    // .then(()=> console.log('Connected to DB')).catch(e=> console.log(e));
}


module.exports = connectDb;
// mongodb+srv://admin:<password>@wallflower.is3qa.mongodb.net/?retryWrites=true&w=majority