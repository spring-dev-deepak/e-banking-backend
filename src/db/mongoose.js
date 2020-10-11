const mongoose = require('mongoose')

mongoose.connect(process.env.DB, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}).then(() => {
    console.log('db connected')
}).catch((e) => {
    console.log(e)
})