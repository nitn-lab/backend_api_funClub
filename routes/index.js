//! ALL ROUTES / ENDPOINTS
const express = require("express");
const routes = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
  registerAdmin,
  loginAdmin,
  getAdmin,
  forgetPassword,
  getAdminById,
  getUserById,
  updateUsers,
  deleteUser,
  addPromptQuestions,
  getPromptQuestions,
  deleteQuestion,
  addInterests,
  createPost,
  getPostsByUserId,
  likePost,
  savePost,
  followingPosts,
  followUser,
  unfollowUser
} = require("../controllers/index");
const { generateToken } = require("../controllers/tokenController");
const {
  userRegisterValidate,
  userLoginValidate,
  adminRegisterValidator,
  adminLoginValidate,
} = require("../utils/userValidation");
const { ensureAuthenticated } = require("../utils/auth");

//** LOGIN ROUTES */

routes.post("/register", userRegisterValidate, registerUser);

routes.post("/login", userLoginValidate, loginUser);

routes.get("/users", ensureAuthenticated, getUsers);

routes.get("/userById/:id", ensureAuthenticated, getUserById);

routes.put("/updateUsers/:id", ensureAuthenticated, updateUsers);

//**ADMIN ROUTES */

routes.post("/adminRegister", adminRegisterValidator, registerAdmin);

routes.post("/adminLogin", adminLoginValidate, loginAdmin);

routes.get("/admins", ensureAuthenticated, getAdmin);

routes.get("/adminById/:id", ensureAuthenticated, getAdminById);

routes.post("/addPromptQuestions", ensureAuthenticated, addPromptQuestions);

routes.get("/getPromptQues", getPromptQuestions);

routes.delete("/deleteQues", ensureAuthenticated, deleteQuestion);

// routes.post("/interests", ensureAuthenticated, addInterests);

// routes.get("/getInterests", ensureAuthenticated, )

//** COMMOM ROUTE */

routes.post("/passwordReset", forgetPassword);

routes.delete("/delete/:id", ensureAuthenticated, deleteUser);


//**POSTS ROUTES */

//Create New Post
routes.post('/create', ensureAuthenticated, createPost);

//Get Post By User:Id
routes.get('/user/:id/posts', ensureAuthenticated, getPostsByUserId)

//Like the Post
routes.put('/like/:id', ensureAuthenticated, likePost);

//Save the post
routes.put('/save/:id', ensureAuthenticated, savePost);

//Get Post From Followed Users
routes.get('/following', ensureAuthenticated, followingPosts);

// Follow
routes.put('/follow/:id', ensureAuthenticated, followUser);

//Unfollow
routes.put('/unfollow/:id', ensureAuthenticated, unfollowUser);

routes.get('/generate-token', generateToken);
module.exports = routes;
