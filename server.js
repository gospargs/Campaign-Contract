const {createServer} = require('http');
const next = require('next');

//dev specifys if we are running server in production or developer mode
//process.env.NODE_ENV - tells the app to look at a global enviroment 
//variable and look to se if it set to 'production' if ture i changes the way next behaves
const app = next({
    dev: process.env.NODE_ENV !== 'production' 
}); 

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(()=>{
    createServer(handler).listen(3000,(error)=>{
        if(error) throw error;
        console.log('Ready on localhost:3000');
    })
});