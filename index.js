import express from "express";
import fs from 'fs';
import multer from "multer";
import cors from 'cors';
import 'dotenv/config'
import mongoose from "mongoose";
import { loginValidation, postCreateValidation, registerValidation } from "./validations.js";

import { UserController, PostController } from './controllers/index.js'

import { handleValidationErrors, checkAuth } from "./utils/index.js"

const app = express();

// створюємо хранилище
/* //перший варіант і не вірний
const storage = multer.diskStorage({
  //місце призначення
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  //яку використовуємо назву зберігаємого файла (беремо орігінальне ім'я)
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})
*/ 
// двугий з використанням пакету для файлів fs
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

//створюємо функцію для створеня хранилища
const upload = multer({ storage })

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB OK"))
  .catch((err) => console.log("MongoDB error", err));

app.post("/auth/login", loginValidation, handleValidationErrors,  UserController.login);
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

//якщо прийде запрос на '/upload' то перед тим як виконати щось
//ми будемо використовувати мідлвейр upload.single() з multer-а, та скажемо
//що ми очикуємо файл 'image'. 
//Т.ч. ми очикуємо свойство image з якоюсь картинкою
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json(
    // req.file
    { url: `/uploads/${req.file.originalname}`}
  )
})

app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);


app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
