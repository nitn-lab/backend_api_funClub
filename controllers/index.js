//! ALL BUSINESS LOGIC
const mongoose = require("mongoose");
const UserModel = require("../models/usersModel");
const AdminSchema = require("../models/adminModel");
const PromptSchema = require("../models/promptModel");
const PostSchema = require("../models/postModel");
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
      const users = await UserModel.find(
        {},
        { password: 0, confirm_password: 0 }
      );
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
  
  //UPDATE USERS
  updateUsers: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedUser = await UserModel.findByIdAndUpdate(id, req.body);

      if (!updatedUser) {
        return res.status(404).json({ message: "Not Found" });
      }

      const user = await UserModel.findById(id).select({
        password: 0,
        confirm_password: 0,
      });

      return res.status(200).json({ data: user });
    } catch (error) {
      return res.status(500).json({ message: "error", error });
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
      return res.status(500).json({ message: "error", error });
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
      return res.status(500).json({ message: "error", error });
    }
  },

  // GET USER BY ID
  getUserById: async (req, res) => {
    try {
      const user = await UserModel.findOne({
        _id: new Object(req.params.id),
      }).select({ password: 0 });
      // console.log("adminId", admin);
      return res.status(200).json({ data: user });
    } catch (error) {
      return res.status(500).json({ message: "error", error });
    }
  },

  // DELETE USERS / ADMINS
  deleteUser: async (req, res) => {
    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid ID format",
        error: {
          value: req.params.id,
          reason: "Must be a valid ObjectId",
        },
      });
    }
    try {
      // const { id } = req.params;
      console.log("deleteUser", req.params.id);
      const user = await UserModel.findByIdAndDelete(req.params.id);
      console.log("user", user);
      const admin = await adminModel.findByIdAndDelete({
        _id: new Object(req.params.id),
      });
      console.log("admin", admin);
      if (user == null && admin == null) {
        return res.status(401).json({ message: "Id Not found" });
      }
      return res.status(201).json({ message: "Deleted Successfully" });
    } catch (error) {
      return res.status(500).json({ message: "error", error });
    }
  },

  // ADD QUESTIONS - PROMPT
  addPromptQuestions: async (req, res) => {
    const prompt = new PromptSchema(req.body);
    try {
      const response = await prompt.save();
      return res.status(201).json({ message: "success", data: response });
    } catch (error) {
      return res.status(500).json({ message: "error", error });
    }
  },

  //GET ALL QUESTIONS
  getPromptQuestions: async (req, res) => {
    try {
      const ques = await PromptSchema.find({});
      return res.status(200).json({ message: ques });
    } catch (error) {
      return res.status(500).json({ message: "error", error });
    }
  },

  // DELETE MULTIPLE QUESTION
  deleteQuestion: async (req, res) => {
    const { ids } = req.body; // Expecting an array of user IDs

    // Basic validation
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Invalid request, please provide an array of ques. IDs",
      });
    }

    try {
      const result = await PromptSchema.deleteMany({ _id: { $in: ids } });

      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ message: "No questions found to delete" });
      }

      return res.status(200).json({
        message: `${result.deletedCount} questions deleted successfully`,
      });
    } catch (error) {
      return res.status(500).json({ message: "error", error });
    }
  },

  //CREATE POST
  //!! i have to add validations and security vernabilities for the apis
  createPost: async (req, res) => {
    const { content, image } = req.body;
    const newPost = new PostSchema(req.body);
    try {
      const response = await newPost.save();
      return res.status(201).json({ message: "success", data: response });
    } catch (error) {
      return res.status(500).json({ message: "error", error });
    }
  },

  // LIKE POST
  likePost: async (req, res) => {
    try {
      const post = await PostSchema.findOne({
        _id: new Object(req.params.id),
      });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Ensure the 'likes' field is an array
      if (!Array.isArray(post.likes)) {
        post.likes = []; // Initialize it as an empty array if not present
      }
      // Convert ObjectIds in the likes array to strings for comparison
      const likesArrayAsStrings = post.likes.map((like) => like.toString());

      //if the user haven't liked post before , then like the post of the user
      if (!likesArrayAsStrings.includes(req.user._id.toString())) {
        post?.likes?.push(req.user._id); // Add the user's ID to the 'likes' array
        await post.save(); // Save the updated post in the database
      }
      return res.status(200).json({ data: post });
    } catch (error) {
      return res.status(500).json({ message: "error", error });
    }
  },

  //SAVE POST
  savePost: async (req, res) => {
    try {
      const post = await PostSchema.findOne({
        _id: new Object(req.params.id),
      });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      // Ensure the 'likes' field is an array
      if (!Array.isArray(post.saves)) {
        post.saves = []; // Initialize it as an empty array if not present
      }
      const saveArrayAsStrings = post.saves.map((save) => save.toString());

      // //if the user haven't seved post before , then save the post of the user
      if (!saveArrayAsStrings.includes(req.user._id.toString())) {
        console.log("User added to likes");
        post?.saves?.push(req.user._id);
        await post.save();
      }
      return res.status(200).json({ data: post });
    } catch (error) {
      return res.status(500).json({ message: "error", error });
    }
  },

  //GET POSTS FROM FLOWWED USERS
  followingPosts: async (req, res) => {
    try {
      const user = await UserModel.findOne({
        _id: new Object(req.user._id),
      }).populate("following");
      console.log("user", user.following);
      const followingPosts = await PostSchema.findOne({
        createdBy: {
          $in: user.following.map((followingId) => new Object(followingId)),
        },
      });
      console.log("followingPosts", followingPosts);
      return res.status(200).json({ data: followingPosts });
    } catch (error) {
      return res.status(500).json({ message: "error", error });
    }
  },

  //FOLLOW
  followUser: async (req, res) => {
    try {
      const currentUserId = req.user._id; // Get the logged-in user's ID from auth middleware
      const targetUserId = req.params.id; // Get the target user's ID from route params

      // Check if the user is trying to follow themselves
      if (currentUserId === targetUserId) {
        return res.status(400).json({ message: "You can't follow yourself" });
      }

      // Find the logged-in user
      const currentUser = await UserModel.findOne(
        {
          _id: new Object(req.user._id),
        },
        { password: 0, confirm_password: 0 }
      );
      const targetUser = await UserModel.findOne(
        {
          _id: new Object(req.params.id),
        },
        { password: 0, confirm_password: 0 }
      );

      // Check if both users exist
      if (!currentUser || !targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const userArrayAsString = currentUser.following.map((user) =>
        user.toString()
      );

      // Add the target user to the following array if not already followed
      if (!userArrayAsString.includes(targetUserId.toString())) {
        currentUser.following.push(targetUserId);
        await currentUser.save();
      }
      const userTarArrayAsString = targetUser.followers.map((user) =>
        user.toString()
      );

      // Add the current user to the target user's followers array if not already a follower
      if (!userTarArrayAsString.includes(currentUserId.toString())) {
        targetUser.followers.push(currentUserId);
        await targetUser.save();
      }
      return res.status(200).json({
        message: "User followed successfully",
        currentUser,
        targetUser,
      });
    } catch (error) {
      return res.status(500).json({ message: "error", error });
    }
  },

  //UNFOLLOW
  unfollowUser: async (req, res) => {
    try {
      const currentUserId = req.user._id;
      const targetUserId = req.params.id;

      // Check if the user is trying to unfollow themselves
      if (currentUserId === targetUserId) {
        return res.status(400).json({ message: "You can't unfollow yourself" });
      }

      // Find the logged-in user and the target user
      const currentUser = await UserModel.findOne(
        {
          _id: new Object(req.user._id),
        },
        { password: 0, confirm_password: 0 }
      );
      const targetUser = await UserModel.findOne(
        {
          _id: new Object(req.params.id),
        },
        { password: 0, confirm_password: 0 }
      );

      if (!currentUser || !targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove the target user from the following array
      currentUser.following = currentUser.following.filter(
        (followingId) => followingId.toString() !== targetUserId
      );
      await currentUser.save();

      // Remove the current user from the target user's followers array
      targetUser.followers = targetUser.followers.filter(
        (followerId) => followerId.toString() !== currentUserId
      );
      await targetUser.save();
      return res.status(200).json({
        message: "User Unfollowed successfully",
        currentUser,
        targetUser,
      });
    } catch (error) {
      return res.status(500).json({ message: "error", error });
    }
  },
};
