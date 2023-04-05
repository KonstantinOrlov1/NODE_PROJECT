const connection = require("../db");

module.exports = {
  async getRooms(req, res) {
    let link = await connection();

    let [data] = await link.query(`SELECT * FROM rooms`);

    if (data.length) {
      return res.send({ status: "ok", body: data });
    }

    res.send({ status: "err" });
  },
  async addReserve(req, res) {
    let { id, date_start, date_end, user_id } = req.body;

    let link = await connection();

    let result = await link.query(
      `UPDATE rooms SET reserve=1, date_start='${date_start}', date_end='${date_end}', user_id='${user_id}' WHERE id='${id}'`
    );

    if (result) {
      return res.send({ status: "ok" });
    }

    res.send({ status: "err" });
  },

  async cancelReserve(req, res) {
    let { id } = req.body;

    let link = await connection();

    let result = await link.query(
      `UPDATE rooms SET reserve=0, date_start='', date_end='', user_id='0' WHERE id='${id}'`
    );

    if (result) {
      return res.send({ status: "ok" });
    }

    res.send({ status: "err" });
  },
};
