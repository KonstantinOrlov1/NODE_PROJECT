const connection = require("../db");

module.exports = {
  async getRooms(req, res) {
    let link = await connection();

    let [data] = await link.query(`SELECT * FROM rooms`);

    await link.end();

    if (data.length) {
      return res.send({ status: "ok", body: data });
    }

    res.send({ status: "err" });
  },

  async getReserve(req, res) {
    let { id } = req.params;

    let link = await connection();

    let [data] = await link.query(
      `SELECT * FROM reserves WHERE room_id = '${id}'`
    );

    await link.end();

    res.send({ status: "ok", body: data });
  },

  async addReserve(req, res) {
    let { date_start, date_end, room_id, user_id } = req.body;

    let link = await connection();

    let result = await link.query(
      `INSERT INTO reserves (date_start, date_end, room_id, user_id) VALUES ('${date_start}', '${date_end}', '${room_id}', '${user_id}')`
    );

    await link.end();

    if (result) {
      return res.send({ status: "ok" });
    }

    res.send({ status: "err" });
  },

  async cancelReserve(req, res) {
    let { id } = req.body;

    let link = await connection();

    let result = await link.query(`DELETE FROM reserves WHERE id='${id}'`);

    await link.end();

    if (result) {
      return res.send({ status: "ok" });
    }

    res.send({ status: "err" });
  },
};
