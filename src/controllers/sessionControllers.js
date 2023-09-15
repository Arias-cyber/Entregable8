import { Router } from "express";
import userModel from "../dao/mongo/models/user.js";
import passport from "passport";
import UserDTO from "../DTOs/UserDTO.js";
const router = Router();

const authenticateGithub = passport.authenticate("github");

const githubCallback = passport.authenticate("github", {
  successRedirect: "/products",
  failureRedirect: "/login", // Puedes redirigir a otra página en caso de fallo
});

const handleGithubCallback = async (req, res) => {
  req.session.user = {
    name: req.user.first_name + " " + req.user.last_name,
    email: req.user.email,
    rol: req.user.email === "adminCoder@coder.com" ? "admin" : "user",
  };
  res.redirect("/products");
};
const getCurrentUser = (req,res)=>{
    if (req.session.user) {
      const { name, email, rol } = req.session.user;
      const userDTO = new UserDTO(name, email, rol);
      res.json({ status: 'success', user: userDTO });
    } else {
      // Si no hay un usuario en la sesión, significa que no está autenticado
      res.status(401).json({ status: 'error', message: 'Not authenticated' });
    }
  }

const registerUser = (req, res, next) => {
    passport.authenticate("register", (err, user, info) => {
      if (err) {
        return res.status(500).json({ status: "error", error: err });
      }
      if (!user) {
        return res.status(400).json({ status: "error", error: info.message });
      }
    // Verificar si el correo es "adminCoder@coder.com"
      if (user.email === "adminCoder@coder.com") {
      user.rol = "admin"; // Asignar el rol como "admin"
      }try {
        
      //await user.save(); // Guardar el usuario en la base de datos
      res.json({ status: "success", payload: user });
      } catch (error) {      
      }
    })(req, res, next);
  }

const loginUser = (req, res, next)=>{
    passport.authenticate("login", (err, user, info) => {
      if (err) {
        return res.status(500).json({ status: "error", error: err });
      }
      if (!user) {
        return res.status(400).json({ status: "error", error: info.message });
      }
      // Si la autenticación es exitosa, crea la sesión
      req.session.user = {
        _id: user._id, // Agregar el campo _id del usuario
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age:user.age,
        rol: user.email === "adminCoder@coder.com" ? "admin" : "user",
      };
      res.json({ status: "success" });
    })(req, res, next);
  }

const logoutUser =(req, res) => {
    req.session.destroy((error) => {
      if (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ status: "Error", error });
      }
      res.json({ status: "Success", message: "Logout successful" });
    });
  }
  
export {
    authenticateGithub,
    githubCallback,
    handleGithubCallback,
    getCurrentUser,
    registerUser,
    loginUser,
    logoutUser
}