import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
   try {
     
     const password = req.body.password;
     const salt = await bcrypt.genSalt(10);
     const hash = await bcrypt.hash(password, salt);
     
     const doc = new UserModel({
       email: req.body.email,
       fullName: req.body.fullName,
       avatarUrl: req.body.avatarUrl,
       passwordHash: hash,
     });
     
     const user = await doc.save();
 
     const token = jwt.sign(
       {
         _id: user._id,
       },
       "secret123",
       {
         expiresIn: "30d",
       }
     );
 
     const { passwordHash, ...userData } = user._doc;
 
     res.json({
       ...userData,
       token,
     });
   } catch (err) {
     console.log(err);
     res.status(500).json("Не вдалось зареєструватись");
   }
 }

export const login = async (req, res) => {
   try {
     const user = await UserModel.findOne({ email: req.body.email });
 
     if (!user) {
       return res.status(404).json({ message: "Користувач не знайден" });
     }
 
     const isValidUser = await bcrypt.compare(
       req.body.password,
       user._doc.passwordHash
     );
 
     if (!isValidUser) {
       return res.status(400).json({ message: "Невірний логін чи пароль" });
     }
 
     const token = jwt.sign(
       {
         _id: user._id,
       },
       "secret123",
       {
         expiresIn: "30d",
       }
     );
     const { rasswordHash, ...userData } = user._doc;
 
     res.status(200).json({
       ...userData,
       token
     })
   } catch (err) {
    console.log(err);
    res.status(500).json({
       message: 'Не вдалось авторизуватись'
   })
   }
 }

export const getMe = async (req, res) => {
   try {
    const user = await UserModel.findById(req.userId);

    if(!user) {
      return res.status(404).json({
        message: "Користувач не знайден"
      })
    };

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
   } catch (err) {
      console.log(err)
      res.status(500).json({
      message: "Не має доступу",
    });
   }
}