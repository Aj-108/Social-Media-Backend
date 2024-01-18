import express from 'express'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors' ;
import './db' ;
import userRoutes from './Routes/user'
import postRoutes from './Routes/post'

require('dotenv').config() ;

const app = express() ;
const PORT = 8000 ;

declare global{
    namespace Express{
      interface Request{
        userId? : string,
      }
    }
  }


app.use(cors()) ;
app.use(cookieParser()) ;   
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

app.use('/api/user',userRoutes);
app.use('/api/post',postRoutes);


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})