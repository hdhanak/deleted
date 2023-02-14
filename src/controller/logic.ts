import express, { NextFunction, Request, Response } from "express";
// import mongoose from "mongoose";
import { isImportEqualsDeclaration } from "typescript";
const multer = require("multer");
import {
  ErrorMessage,
  MessageResponse,
  tokenAccess,
} from "../middleware/commenResError";
import addressModel from "../models/address";

import signUp, { registerSchema } from "../models/register";
import tokenModel from "../models/token";
const { phone } = require("phone");

import { fileFilter, storage } from "../router/routers";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Appstring = require("../Appstring");
require("dotenv").config();
var mongoose = require("mongoose");
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

const register = async (req: Request, res: Response) => {
  try {
    // console.log(req.body);

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = await signUp.create({
      firstName: req.body.firstName,
      email: req.body?.email,
      password: hashPassword,
      PhoneNo: req.body.PhoneNo
        ? phone(req.body?.PhoneNo)?.phoneNumber
        : undefined, //PhoneNo.phoneNumber,
        role:req.body.role
    });

    // const address = await addressModel.create({
    //   userId: user._id,
    //   area: req.body.area,
    //   city: req.body.city,
    //   state: req.body.state,
    //   country: req.body.country,
    //   primary: true,
    // });
    await user.save();
    // await address.save();
    MessageResponse(req, res, user, 201);
  } catch (error) {
    console.log(error, "error");

    ErrorMessage(req, res, error, 400);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await signUp.findOne({
      email: req.body?.email,
      PhoneNo: req.body?.PhoneNo,
    });

    const userLogin = await tokenModel.findOne({ userId: user?._id });

    if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (validPassword) {
        if (userLogin) {
          let params = {
            _id: user._id,
            firstName: user.firstName,
            email: req.body?.email,
            PhoneNo: req.body?.PhoneNo,
            role:user?.role
          };

          const token = await jwt.sign(params, process.env.SECRET_KEY, {
            expiresIn: "10d",
          });
          await tokenModel.updateOne(
            { userId: user._id },
            { token: token },
            {
              new: true,
            }
          );
          return res
            .cookie("access_token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            })
            .status(200)
            .json({ message: "Logged in successfully 😊 👌" , access_token:token });

          // tokenAccess(req, res, token, 200);
        } else {
          let params = {
            _id: user._id,
            firstName: req.body.firstName,
            email: req.body?.email,
            PhoneNo: req.body?.PhoneNo,
            role:user?.role
          };

          const token = await jwt.sign(params, process.env.SECRET_KEY, {
            expiresIn: "10d",
          });
          const createToken = await tokenModel.create({
            userId: user._id,
            token: token,
          });
          await createToken.save();
          return res
            .cookie("access_token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            })
            .status(200)
            .json({ message: "Logged in successfully 😊 👌" , access_token:token});

          // tokenAccess(req, res, createToken, 200);
        }
      } else {
        ErrorMessage(req, res, Appstring.NOT_VALID_DETAILS, 400);
      }
    } else {
      ErrorMessage(req, res, Appstring.USER_NOT_FOUND, 404);
    }
  } catch (error) {
    console.log(error);

    ErrorMessage(req, res, error, 400);
  }
};

const imgUpload = async (req: Request, res: Response, next: NextFunction) => {
  var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // limits: { fileSize: maxSize },
  }).array("img");

  upload(req, res, async (err: any) => {
    if (err) {
      console.log(err, "errorr");
      ErrorMessage(req, res, err, 400);
    } else {
      console.log(req.files);
      var e: any = {};
      let a: any = req.files;
      a?.map((d: any, index: any) => {
        console.log(d, "d");
        e[index] = d.filename;
      });
      MessageResponse(req, res, e, 200);
    }
  });
};

const searchEmailAndPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(Object.keys(req.body).length, "qq");

    var pushArr: any = [];
    if (Object.keys(req.body).length == 1) {
      if (req.body.email) {
        pushArr.push({ email: req.body.email });
      }
      if (req.body.PhoneNo) {
        pushArr.push({ PhoneNo: req.body.PhoneNo });
      }
      if (!(req.body.email || req.body.PhoneNo)) {
        return ErrorMessage(
          req,
          res,
          "Check by only email or phone at a time",
          400
        );
      }
      const user = await signUp.aggregate([
        {
          $match: {
            $or: pushArr,
          },
        },
      ]);
      console.log(pushArr);
      return MessageResponse(req, res, user, 200);
    } else {
      return MessageResponse(
        req,
        res,
        "Check by only email or phone at a time",
        400
      );
    }
  } catch (error) {
    console.log(error);

    ErrorMessage(req, res, error, 400);
  }
};

const getRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await signUp.find();
    MessageResponse(req, res, user, 200);
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};

const addAddress = async (req: Request, res: Response, next: NextFunction) => {
  const userAddress = await addressModel.findOne({userId:req.userId})

  try {
   if(userAddress){
    const address = await addressModel.create({
      userId: req.userId,
      area: req.body.area,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      primary: false,
    });

    await address.save();
    MessageResponse(req,res,address,201)
   }else{
    const address = await addressModel.create({
      userId: req.userId,
      area: req.body.area,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      primary: true,
    });

    await address.save();
    MessageResponse(req,res,address,201)

   }
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};

const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const address = await addressModel.findOne({ _id: req.body.addressId });
    if (address) {
      if(address.primary==false){
        const updateQuray = {
          area: req.body?.area,
          city: req.body?.city,
          state: req.body?.state,
          country: req.body?.country,
        };
        const result = await addressModel.updateOne(
          { _id: req.body.addressId },
          updateQuray,
          { new: true }
        );
        MessageResponse(req, res, "updated", 200);
      }else{
        ErrorMessage(req, res, "can not update adress", 400);
      }
    } else {
      ErrorMessage(req, res, "adrress is not present", 400);
    }
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};
const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const address = await addressModel.findOne({ _id: req.body.addressId });
    if (address) {
      if(address.primary==false){
        
        const result = await addressModel.deleteOne(
          { _id: req.body.addressId },         
          { new: true }
        );
        MessageResponse(req, res, "deleted", 200);
      }else{
        ErrorMessage(req, res, "can not delete adress", 400);
      }
    } else {
      ErrorMessage(req, res, "adrress is not present", 400);
    }
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};


const getAllUser  = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    
      const users = await signUp.find()
      MessageResponse(req,res,users,200)

  } catch (error) {
    ErrorMessage(req, res, error, 422);
  }
}
export {
  getAllUser,
  register,
  login,
  imgUpload,
  getRegister,
  searchEmailAndPhone,
  addAddress,
  updateAddress,
  deleteAddress
};
// _id
// 6347f3b1e4798f16fb5b594f
// userId
// 6347d7135717c48c6c38acad
// postId
// 6347f381e4798f16fb5b594c
