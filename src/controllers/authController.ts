import { Request, Response } from "express";
import { pool } from "../db";
import bcrypt from "bcrypt";

export const me = (req: Request, res: Response) => {
  if (req.session.user && req.session.user.username) {
    res
      .json({ loggedIn: true, username: req.session.user.username })
      .status(200);
  } else {
    res.status(401).json({ loggedIn: false }).send();
  }
};

export const handleLogin = async (req: Request, res: Response) => {
  const potentialLogin = await pool.query(
    "SELECT id, username, passhash FROM users u WHERE u.username=$1",
    [req.body.username]
  );

  if (potentialLogin.rowCount > 0) {
    const isSamePass = await bcrypt.compare(
      req.body.password,
      potentialLogin.rows[0].passhash
    );
    if (isSamePass) {
      //login
      req.session.user = {
        username: req.body.username,
        id: potentialLogin.rows[0].id,
      };
      res.json({ loggedIn: true, username: req.body.username });
    } else {
      res
        .status(401)
        .json({
          loggedIn: false,
          status: "Wrong username or password",
        })
        .send();
    }
  } else {
    res
      .status(401)
      .json({
        loggedIn: false,
        status: "Wrong username or password",
      })
      .send();
  }
};

export const handleRegister = async (req: Request, res: Response) => {
  const existingUsers = await pool.query(
    "SELECT username from users WHERE username=$1",
    [req.body.username]
  );

  if (existingUsers.rowCount === 0) {
    //register
    const hashedpass = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await pool.query(
      "INSERT INTO users(username, passhash) values($1,$2) RETURNING username",
      [req.body.username, hashedpass]
    );
    req.session.user = {
      username: req.body.username,
      id: newUserQuery.rows[0].id,
    };
    res.json({ loggedIn: true, username: req.body.username });
  } else {
    res.json({ loggedIn: false, status: "username taken" });
  }
};

export const handleLogout = async (req: Request, res: Response) => {
  req.session.destroy((err: any) => {
    res.sendStatus(200);
  });
};
