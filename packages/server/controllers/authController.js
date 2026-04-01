const pool = require("../db");

const bcrypt = require("bcrypt");

const { v4: uuidv4 } = require("uuid");

module.exports.loginHandler = (req, res) => {
  if (req.session.user && req.session.user.username) {
    res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    res.json({ loggedIn: false });
  }
};

module.exports.loginValidator = async (req, res) => {
  const existingUser = await pool.query(
    "SELECT username, passhash, id, userid FROM users WHERE username=$1",
    [req.body.username],
  );

  if (existingUser.rowCount > 0) {
    const validUser = await bcrypt.compare(
      req.body.password,
      existingUser.rows[0].passhash,
    );
    if (validUser) {
      req.session.user = {
        username: req.body.username,
        id: existingUser.rows[0].id,
        userid: existingUser.rows[0].userid,
      };

      // 🔥 FORCE SAVE BEFORE RESPONSE
      return req.session.save((err) => {
        if (err) {
          console.log("Session save error:", err);
          return res.status(500).json({ loggedIn: false });
        }

        return res.json({
          loggedIn: true,
          username: req.body.username,
        });
      });
    }

    return res.json({
      loggedIn: false,
      status: "Incorrect username or password",
    });
  }

  return res.json({
    loggedIn: false,
    status: "Incorrect username or password",
  });
};

module.exports.registerUser = async (req, res) => {
  const userExists = await pool.query(
    "SELECT username from users WHERE username = $1",
    [req.body.username],
  );
  if (userExists.rowCount === 0) {
    //reister
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const addUserQuery = await pool.query(
      "INSERT INTO users(username, passhash,userid) values($1,$2, $3) RETURNING id, username, userid",
      [req.body.username, hashedPass, uuidv4()],
    );

    req.session.user = {
      username: req.body.username,
      id: addUserQuery.rows[0].id,
      userid: addUserQuery.rows[0].userid,
    };
    return req.session.save((err) => {
      if (err) {
        return res.status(500).json({ loggedIn: false });
      }

      return res.json({
        loggedIn: true,
        username: req.body.username,
      });
    });
  } else {
    res.json({ loggedIn: false, status: "user already exists" });
  }
};
