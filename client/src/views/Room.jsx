import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export default ({ user_id }) => {
  let { id } = useParams();

  const [Reserve, setReserve] = useState([]);

  const [Room, setRoom] = useState({
    date_start: "",
    date_end: "",
    room_id: id,
    user_id: 0,
  });

  useEffect(() => {
    getReserve();
  }, []);

  const getReserve = async () => {
    let res = await fetch(`http://localhost:5000/get-reserve/${id}`);
    let data = await res.json();

    if (data.status == "ok") {
      setReserve(data.body);
    }
  };

  const changeDate = (value, key) => {
    let ts = Date.parse(value);

    setRoom({ ...Room, [key]: ts, user_id });
  };

  const sendReserve = async () => {
    if (Room.date_start <= Room.date_end) {
      let exist = Reserve.find(
        (elem) =>
          (Room.date_start >= +elem.date_start &&
            Room.date_start <= +elem.date_end) ||
          (Room.date_end >= +elem.date_start && Room.date_end <= +elem.date_end)
      );

      if (!exist) {
        let res = await fetch(`http://localhost:5000/reserve`, {
          method: "post",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ ...Room }),
        });
        let data = await res.json();

        switch (data.status) {
          case "ok":
            getReserve();
            break;
        }
      } else {
        alert("This date reverved!");
      }
    } else {
      alert("Incorrect date");
    }
  };

  const cancelReserve = async (index) => {
    let id = Reserve[index].id;

    let res = await fetch(`http://localhost:5000/cancel-reserve`, {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    let data = await res.json();

    switch (data.status) {
      case "ok":
        getReserve();
        break;
    }
  };

  const getReserveDate = (ts) => new Date(+ts).toLocaleDateString();

  return (
    <>
      <main>
        <div className="container py-3">
          <Link to="/" className="btn btn-primary my-2">
            Go back
          </Link>

          <h1>Room page</h1>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>
              Start:{" "}
              <input
                type="date"
                className="form-control"
                onChange={(e) => changeDate(e.target.value, "date_start")}
              />
            </span>
            <span>
              End:{" "}
              <input
                type="date"
                className="form-control"
                onChange={(e) => changeDate(e.target.value, "date_end")}
              />
            </span>
            <button className="btn btn-primary" onClick={sendReserve}>
              Reserve
            </button>
          </div>

          {Reserve.length ? (
            <div className="list-group">
              {Reserve.map((el, i) => (
                <div
                  className="list-group-item d-flex justify-content-between align-items-center"
                  key={el.id}
                >
                  <p className="text-muted">
                    Reserve {getReserveDate(el.date_start)} -{" "}
                    {getReserveDate(el.date_end)}
                  </p>

                  {user_id == el.user_id ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => cancelReserve(i)}
                    >
                      Cancel reserve
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <h1 className="text-muted">Reserves not found</h1>
          )}
        </div>
      </main>
    </>
  );
};
