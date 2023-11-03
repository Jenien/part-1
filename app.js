require('dotenv').config();
const express = require('express');
const app = express();
const { PORT } = process.env;
// const routes = require('./routes/index');
app.use(express.json());

app.get('/',(req,res)=>{
    return res.json({
        status: true,
        message : 'hello',
        error: null
    });
});
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
