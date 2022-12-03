const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.send("hola");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);

    return next();
});
  
// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
// const corsOptions = {
//     origin: (origin, callback) => {
//         console.log('allo');
//         if (allowedOrigins.includes(origin) || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Origin not allowed by CORS'));
//         }
//     }
// }

// Enable preflight requests for all routes
// app.options('*', cors(corsOptions));

var connection = require('./connection.js');

connection.connectToServer( function (err) {
    if (err) console.log(err);

    //ROUTES
    require('./routes/auth.routes.js')(app);
    require('./routes/user.routes')(app);
    require('./routes/customer.routes.js')(app);
    require('./routes/consultation.routes.js')(app);
    
    app.listen(process.env.PORT || 5000);
})
