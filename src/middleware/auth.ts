
import { NextFunction, Request, Response } from "express"
import { ErrorMessage } from "./commenResError";

// import { ErrorMessage } from "./commenResError"
const jwt = require('jsonwebtoken')

declare global {
    namespace Express {
        interface Request {
            userId: any;
            userType:any;
            empId:any;
            // cookies:any
        }
    }
}


const auth = async (req: Request, res: Response, next: NextFunction) => {
    // const bearer = req.headers?.authorization
    // const token = bearer?.split(' ')[1]
    console.log(req.headers?.authorization?.split(' ')[1],'tok');
    
    const token = req.cookies.access_token ?req.cookies.access_token : req.headers?.authorization?.split(' ')[1] ;
    if (!token) {
      return res.send('not found token');
      
    }
    // console.log(token2,'token auth');
    
  

    await jwt.verify(token, process.env.SECRET_KEY, {}, async (error: any, data: any) => {
        if (error) {
            console.log(error);
            
            ErrorMessage(req, res, error, 401)
        }
        else {
            // console.log(data,'data')
            req.userId = data?._id 
            console.log(req.userId,'..');
            
                      
            next()

        }
    })






    // }

}

export default auth