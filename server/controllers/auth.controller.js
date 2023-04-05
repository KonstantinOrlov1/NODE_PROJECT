const connection = require("../db");
const md5 = require("md5");

module.exports = {
  async login(req, res) {
    let { email, pass } = req.body;

    let link = await connection();

    let [data] = await link.query(
      `SELECT * FROM users WHERE email = '${email}' AND pass = '${pass}'`
    );

    if (data.length) {
      let token = md5(email + Date.now());

      let result = await link.query(
        `UPDATE users SET token = '${token}' WHERE id = ${data[0].id}`
      );

      if (result) {
        return res.send({ status: "ok", body: { token } });
      }
    }

    res.send({ status: "err" });
  },

  async checkLogin(req, res) {
    let link = await connection();

    let [data] = await link.query(
      `SELECT * FROM users WHERE token = '${req.params.token}'`
    );

    if (data.length) {
      return res.send({
        status: "ok",
        body: { id: data[0].id, username: data[0].username, vip: data[0].vip },
      });
    }

    res.send({ status: "err" });
  },
};
