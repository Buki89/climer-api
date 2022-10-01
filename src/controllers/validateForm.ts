import * as yup from "yup";
import { Response, Request, NextFunction } from "express";

const formSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

export const validateForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const formData = req.body;
  formSchema
    .validate(formData)
    .catch(() => {
      res.status(400).send();
    })
    .then((valid) => {
      if (valid) {
        console.log("form is valid");
        next();
      } else {
        res.status(422).send();
      }
    });
};
