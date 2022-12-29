import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || '8000';

app.get('/',(req: Request, res: Response)=>{
    res.send("Hello world");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });