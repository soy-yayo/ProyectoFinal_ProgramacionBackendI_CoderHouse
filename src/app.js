import express from 'express';
import __dirname from './__dirname.js';
import handlebasr from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';


const app = express();
const PORT = 8080;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const io = new Server(httpServer);

app.engine('handlebars' , Handlebars.engine());
app.set('views', __dirname + './views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + 'public'));
app.use('/', viewsRouter);