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

const Web3 = require("web3");
const rpcURL = "https://sepolia.infura.io/v3/6e815739fa544c8097f4070703555cc7";

const web3 = new Web3(rpcURL);

const address = "0x713d06894af50c1b631cb3d6e1f7a1d9de09f1bb";
const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint64",
        name: "houseID",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "amount",
        type: "uint64",
      },
    ],
    name: "Buy",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint64",
        name: "houseID",
        type: "uint64",
      },
    ],
    name: "houseDetailsUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint64",
        name: "houseID",
        type: "uint64",
      },
      {
        indexed: true,
        internalType: "uint64",
        name: "totalAmount",
        type: "uint64",
      },
    ],
    name: "houseMinted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "Add1",
    outputs: [
      {
        internalType: "uint64",
        name: "houseID",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "amount",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "Type",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "Add2",
    outputs: [
      {
        internalType: "uint64",
        name: "houseID",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "amount",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "Type",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "AvailableProperty",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_houseID",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "amount",
        type: "uint64",
      },
    ],
    name: "Buy_Sell",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "CreatorFee",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "Initial_TotalArea",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "houseName",
            type: "string",
          },
          {
            internalType: "string",
            name: "propertyDescription",
            type: "string",
          },
          {
            internalType: "uint64",
            name: "currentPrice",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "propertyValuation",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "TotalPropertySize",
            type: "uint64",
          },
        ],
        internalType: "struct houseMint.house",
        name: "lot",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "Address",
            type: "string",
          },
          {
            internalType: "string",
            name: "latitude",
            type: "string",
          },
          {
            internalType: "string",
            name: "longitude",
            type: "string",
          },
          {
            internalType: "uint32",
            name: "bedrooms",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "bathrooms",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "floors",
            type: "uint16",
          },
        ],
        internalType: "struct houseMint.house1",
        name: "lot1",
        type: "tuple",
      },
      {
        internalType: "string[]",
        name: "tokenURIs",
        type: "string[]",
      },
    ],
    name: "MintHouse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "TXN_by_houseID",
    outputs: [
      {
        internalType: "uint64",
        name: "houseID",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "amount",
        type: "uint64",
      },
      {
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balance_By_Address",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "houseDetails",
    outputs: [
      {
        internalType: "string",
        name: "houseName",
        type: "string",
      },
      {
        internalType: "string",
        name: "propertyDescription",
        type: "string",
      },
      {
        internalType: "uint64",
        name: "currentPrice",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "propertyValuation",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "TotalPropertySize",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "houseDetails1",
    outputs: [
      {
        internalType: "string",
        name: "Address",
        type: "string",
      },
      {
        internalType: "string",
        name: "latitude",
        type: "string",
      },
      {
        internalType: "string",
        name: "longitude",
        type: "string",
      },
      {
        internalType: "uint32",
        name: "bedrooms",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "bathrooms",
        type: "uint32",
      },
      {
        internalType: "uint16",
        name: "floors",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "houseID",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "slug",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenURI_ById",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTxn",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_houseID",
        type: "uint64",
      },
      {
        components: [
          {
            internalType: "string",
            name: "new_HouseName",
            type: "string",
          },
          {
            internalType: "string",
            name: "new_propertyDescription",
            type: "string",
          },
          {
            internalType: "uint64",
            name: "new_currentPrice",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "new_propertyValuation",
            type: "uint64",
          },
          {
            internalType: "string",
            name: "new_Address",
            type: "string",
          },
          {
            internalType: "string",
            name: "new_latitude",
            type: "string",
          },
          {
            internalType: "string",
            name: "new_longitude",
            type: "string",
          },
          {
            internalType: "uint32",
            name: "new_bedrooms",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "new_bathrooms",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "new_floors",
            type: "uint16",
          },
        ],
        internalType: "struct houseMint.updateHouse",
        name: "newLot",
        type: "tuple",
      },
      {
        internalType: "string[]",
        name: "newURI",
        type: "string[]",
      },
    ],
    name: "updateDetails",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const account1 = "0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01";
const account2 = "0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa02";
const Tx = require("ethereumjs-tx");

const getBalnce = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let balance;
    // console.log(web3.eth, "web3.eth.");

    await web3.eth.getBalance(address, (err: any, wei: any) => {
      //   console.log(wei, "wei");
      balance = web3.utils.fromWei(web3.utils.toBN(wei), "ether");
    });

    console.log(balance, "balance");

    return MessageResponse(req, res, balance, 200);
    //   console.log("1");
  } catch (error) {
    console.log(error, "error");

    return ErrorMessage(req, res, error, 422);
  }
};

const getReadData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contract = new web3.eth.Contract(abi, address);
    // console.log(contract, "contract");

    // contract.methods.totalSupply().call((err: any, result: any) => {
    //   console.log(result);
    //   console.log(err, "totalSupply");
    // });
    // console.log();

    // contract.methods.name().call((err: any, result: any) => {
    //   console.log(result);
    //   console.log(err, "name");
    // });
    // contract.methods.symbol().call((err: any, result: any) => {
    //   console.log(result);
    //   console.log(err, "symbol");
    // // });

    //  contract.methods.balanceOf("0x713d06894af50c1b631cb3d6e1f7a1d9de09f1bb").call((err: any, result: any) => {
    //     // console.log(result);
    //     console.log(err, "balanceOf");
    //     if(!err)
    //         return MessageResponse(req, res, result, 200);
    //     return ErrorMessage(req, res, err, 422);
    //   });

    //   console.log("1");
  } catch (error) {
    console.log(error, "error");

    return ErrorMessage(req, res, error, 422);
  }
};

const createTnx = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await web3.eth.accounts.create();
    //  {
    //    address: "0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01",
    //    privateKey: "0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709",
    //    signTransaction: function(tx){...},
    //    sign: function(data){...},
    //    encrypt: function(password){...}
    // }

    // return MessageResponse(req, res, balance, 200);
  } catch (error) {
    return ErrorMessage(req, res, error, 422);
  }
};
export { getBalnce, getReadData };
// _id
// 6347f3b1e4798f16fb5b594f
// userId
// 6347d7135717c48c6c38acad
// postId
// 6347f381e4798f16fb5b594c
