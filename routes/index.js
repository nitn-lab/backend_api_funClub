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
  getUserById
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

routes.get("/userById/:id", ensureAuthenticated, getUserById)

//**ADMIN ROUTES */

routes.post("/adminRegister", adminRegisterValidator, registerAdmin);

routes.post("/adminLogin", adminLoginValidate, loginAdmin);

routes.get("/admins", ensureAuthenticated, getAdmin);

routes.get("/adminById/:id", ensureAuthenticated, getAdminById);

//** COMMOM ROUTE */

routes.post("/passwordReset", forgetPassword)
module.exports = routes;
