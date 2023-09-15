import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2"
import userModel from "../dao/mongo/models/user.js";
import { createHash,isValidPassword } from "../utils.js";

const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use(
      "register",
      new localStrategy(
        {
          usernameField: "email",
          passReqToCallback: true,
        },
        async (req, username, password, done) => {
          const { first_name, last_name, email,age } = req.body;
          try {
            const user = await userModel.findOne({ email: username });
            if (user) {
              return done(null, false, { message: "User already exists" });
            }
            const newUser = {
              first_name,
              last_name,
              email,
              age,
              password: createHash(password),
            };
            const result = await userModel.create(newUser);
            return done(null, result);
          } catch (error) {
            return done("Error al obtener el usuario" + error);
          }
        }
      )
    );
  
    passport.use(
      "login",
      new localStrategy(
        {
          usernameField: "email",
        },
        async (username, password, done) => {
          try {
            const user = await userModel.findOne({ email: username });
            if (!user) {
              return done(null, false, { message: "User not found" });
            }
            if (!isValidPassword(user, password)) {
              return done(null, false, { message: "Wrong password" });
            }
            return done(null, user);
          } catch (error) {
            return done("Error al obtener el usuario" + error);
          }
        }
      )
    );

    passport.use(
        "github",
        new GitHubStrategy(
          {
            clientID: " Iv1.a01616451f3a6ef3",
            clientSecret: "d20444e1959a76151f876bc6ebedad549ede2f2f",
            callbackURL: "http://localhost:8080/api/session/githubcallback",
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              //console.log(profile)  
              const user = await userModel.findOne({ email: profile._json.email });
              if (!user) {
                const nameParts = profile._json.name && profile._json.name.split(" ");
                const newUser = {
                  first_name: nameParts[0],
                  last_name: nameParts.length > 1 ? nameParts.slice(1).join(" ") : "",      
                  email: profile._json.email,
                  password: "",
                  age:0,
                };
                
                const result = await userModel.create(newUser);
                req.session.user = {
                  name: `${newUser.first_name} ${newUser.last_name}`,
                  email: newUser.email,
                  age: newUser.age, // Asegúrate de incluir el campo "age"
                  rol: "user", // No necesitas consultar el rol aquí, ya que es un nuevo usuario
              };
                return done(null, result);
              } else {
                return done(null, user);
              }
            } catch (error) {
              return done("Error al obtener el usuario" + error);
            }
          }
        )
      );
  
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });
  
    passport.deserializeUser(async (id, done) => {
      const user = userModel.findById(id);
      done(null, user);
    });
  };
  
  export default initializePassport;
  