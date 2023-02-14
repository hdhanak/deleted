
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


const auth = (roles:any) => {
    // const bearer = req.headers?.authorization
    // const token = bearer?.split(' ')[1]
    // console.log(req.headers?.authorization?.split(' ')[1],'tok');

    console.log(roles,'roels');
    
    return async (req: Request, res: Response, next: NextFunction) =>{
        // next()
    
    const token = req.cookies.access_token ?req.cookies.access_token : req.headers?.authorization?.split(' ')[1] ;
    if (!token) 
      return res.send('not found token');       
    // // console.log(token2,'token auth');   

    await jwt.verify(token, process.env.SECRET_KEY, {}, async (error: any, data: any) => {
        if (error) {
            console.log(error);            
            return ErrorMessage(req, res, error, 401)
        }
        else {
            // console.log(data,'data')
            if (typeof roles === 'string') {
                roles = [roles];
            }
            console.log(roles.includes(data.role),'roles.includes(data.role)');
            
            if (roles.length && !roles.includes(data.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }
           
                req.userId = data?._id 
                console.log(req.userId,'..');          

                next()
        }
    })
}}

// export default {auth}
module.exports = auth ;
