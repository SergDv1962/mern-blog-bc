import { body } from "express-validator";

export const loginValidation = [
  body("email", 'Не існуючий формат пошти').isEmail(),
  body("password", "Пароль повинен бути мінімум 5 символів").isLength({ min: 5 }),
];

export const registerValidation = [
  body("email", 'Не існуючий формат пошти').isEmail(),
  body("fullName", "Вкажить ім'я").isLength({ min: 3 }),
  body("password", "Пароль повинен бути мінімум 5 символів").isLength({ min: 5 }),
  body("avatarUrl", "Неіснуюче посилання на аватарку").optional().isURL(),
];

export const postCreateValidation = [
  body("title", 'Введіть заголовок статті').isLength({ min: 3 }).isString(),
  body("text", "Введіть текст статті").isLength({ min: 3 }).isString(),
  body("tags", "Не вірний формат тегів (вкажить перелік тегів через кому)").optional().isString(),
  body("imageUrl", "Неіснуюче посилання на зображення").optional().isString(),
];
