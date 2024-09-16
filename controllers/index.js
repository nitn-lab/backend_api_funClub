//! ALL BUSINESS LOGIC
const UserModel = require("../models/usersModel");
const AdminSchema = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminModel = require("../models/adminModel");
const { request } = require("express");
module.exports = {
  // validate req.body - Done
  // create MongoDB UserModel - Done
  // do password encrytion - Done
  // save data to mongodb -
  // return response to the client

  //! REGISTER OPERATION
  registerUser: async (req, res) => {
    const userModel = new UserModel(req.body);
    userModel.password = await bcrypt.hash(req.body.password, 10);
    try {
      const response = await userModel.save();
      response.password = undefined;
      return res.status(201).json({ message: "success", data: response });
    } catch (err) {
      return res.status(500).json({ message: "error", err });
    }
  },
  // check user using email
  // compare password
  // create jwt token
  // send response to client
  loginUser: async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Auth failed, Invalid username/password" });
      }

      const isPassEqual = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPassEqual) {
        return res
          .status(401)
          .json({ message: "Auth failed, Invalid username/password" });
      }
      const tokenObject = {
        _id: user._id,
        username: user.username,
        email: user.email,
      };
      const jwtToken = jwt.sign(tokenObject, process.env.SECRET, {
        expiresIn: "4h",
      });
      return res.status(200).json({ jwtToken, tokenObject });
    } catch (err) {
      return res.status(500).json({ message: "error", err });
    }
  },
  //Get All Users
  getUsers: async (req, res) => {
    try {
      const users = await UserModel.find({}, { password: 0 });
      return res.status(200).json({ data: users });
    } catch (err) {
      return res.status(500).json({ message: "error", err });
    }
  },
  // Register Admin
  registerAdmin: async (req, res) => {
    const adminModel = new AdminSchema(req.body);
    adminModel.password = await bcrypt.hash(req.body.password, 10);
    try {
      const response = await adminModel.save();
      response.password = undefined;
      return res.status(201).json({ message: "success", data: response });
    } catch (err) {
      return res.status(500).json({ message: "error", err });
    }
  },
  //LOGIN ADMIN
  loginAdmin: async (req, res) => {
    try {
      const admin = await AdminSchema.findOne({ email: req.body.email });
      if (!admin) {
        return res
          .status(401)
          .json({ message: "Auth failed, Invalid Credentials" });
      }

      const isPassEqual = await bcrypt.compare(
        req.body.password,
        admin.password
      );

      if (!isPassEqual) {
        return res
          .status(401)
          .json({ message: "Auth Failed, Invalid Credentials" });
      }

      const tokenObject = {
        _id: admin._id,
        firstName: admin.firstName,
        email: admin.email,
      };

      const jwtToken = jwt.sign(tokenObject, process.env.SECRET, {
        expiresIn: "4h",
      });
      return res.status(200).json({ jwtToken, tokenObject });
    } catch (err) {
      return res.status(500).json({ message: "error", err });
    }
  },

  // GET ALL ADMINS
  getAdmin: async (req, res) => {
    try {
      const admin = await adminModel.find({}, { password: 0 });
      return res.status(200).json({ data: admin });
    } catch (err) {
      return res.status(500).json({ message: "error", err });
    }
  },

  // FORGET PASSWORD
  forgetPassword: async (req, res) => {
    //first check if user exists in database
    try {
      const adminExist = await adminModel.findOne({ email: req.body.email });
      const user = await UserModel.findOne({ email: req.body.email });

      if (!adminExist && !user) {
        return res
          .status(401)
          .json({ message: "Provided email Does not Exist" });
      }
      //update the password
      if (user) {
        user.password = await bcrypt.hash(req.body.password, 10);
        const response = await user.save();
        response.password = undefined;
        return res
          .status(201)
          .json({ message: "user password reset success", data: response });
      }

      if (adminExist) {
        adminExist.password = await bcrypt.hash(req.body.password, 10);
        const response = await adminExist.save();
        response.password = undefined;
        return res
          .status(201)
          .json({ message: "admin password reset success", data: response });
      }
    } catch (error) {
      return res.status(500).json({ message: "error", err });
    }
  },

  // GET ADMIN BY ID
  getAdminById: async (req, res) => {
    try {
      const admin = await adminModel
        .findOne({
          _id: new Object(req.params.id),
        })
        .select({ password: 0 });
      // console.log("adminId", admin);
      return res.status(200).json({ data: admin });
    } catch (error) {
      return res.status(500).json({ message: "error", err });
    }
  },

  // GET USER BY ID
  getUserById: async (req, res) => {
    try {
      const user = await UserModel
        .findOne({
          _id: new Object(req.params.id),
        })
        .select({ password: 0 });
      // console.log("adminId", admin);
      return res.status(200).json({ data: user });
    } catch (error) {
      return res.status(500).json({ message: "error", err });
    }
  },
};
