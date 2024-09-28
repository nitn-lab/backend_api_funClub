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
  addInterests
} = require("../controllers/index");
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
module.exports = routes;
