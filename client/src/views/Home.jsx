import { useState, useEffect } from "react";

export default () => {
  const [Account, setAccount] = useState(null);
  const [Rooms, setRooms] = useState([]);
  console.log(Rooms);

  const getRooms = async () => {
    let res = await fetch("http://localhost:5000/get-rooms");
    let data = await res.json();

    if (data.status == "ok" && data.body.length) {
      setRooms(data.body);
    }
  };

  const checkLogin = async () => {
    let token = localStorage.getItem("token");

    let res = await fetch(`http://localhost:5000/check-login/${token}`);
    let data = await res.json();

    switch (data.status) {
      case "ok":
        setAccount(data.body);

        getRooms();
        break;
      case "err":
        logout();
        break;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.assign("/login");
  };

  const changeDate = (value, index, key) => {
    let ts = Date.parse(value);

    let copyRooms = [...Rooms];

    copyRooms[index][key] = ts;

    setRooms(copyRooms);
  };

  const sendReserve = async (index) => {
    if (
      Rooms[index].date_start != "" &&
      Rooms[index].date_start < Rooms[index].date_end
    ) {
      let res = await fetch(`http://localhost:5000/reserve`, {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ ...Rooms[index], user_id: Account.id }),
      });
      let data = await res.json();

      switch (data.status) {
        case "ok":
          getRooms();
          break;
      }
    } else alert("Incorrect date");
  };

  const cancelReserve = async (index) => {
    let id = Rooms[index].id;

    let res = await fetch(`http://localhost:5000/cancel-reserve`, {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    let data = await res.json();

    switch (data.status) {
      case "ok":
        getRooms();
        break;
    }
  };

  const getReserveDate = (ts) => new Date(+ts).toLocaleDateString();

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <>
      <header>
        <div className="container d-flex justify-content-between align-items-center">
          <a href="#" className="logo">
            Logo App Hotels
          </a>

          <div className="d-flex align-item-center">
            <b className="me-2">
              {Account?.vip == 1 ? (
                <span style={{ color: "orangered" }}>
                  <i className="fa-solid fa-certificate"></i> VIP
                </span>
              ) : null}
              &nbsp; Hello {Account?.username}
            </b>
            <a href="#" className="logout" onClick={logout}>
              Logout
            </a>
          </div>
        </div>
      </header>

      <main>
        <div className="container py-3">
          <h1>Home page</h1>

          {Rooms.length ? (
            <div className="list-group">
              {Rooms.map((el, i) => (
                <div
                  className="list-group-item d-flex justify-content-between align-items-center"
                  key={el.id}
                >
                  <h4>{el.title}</h4>
                  {el.reserve == 0 ? (
                    <>
                      <span>
                        Start:{" "}
                        <input
                          type="date"
                          className="form-control"
                          onChange={(e) =>
                            changeDate(e.target.value, i, "date_start")
                          }
                        />
                      </span>
                      <span>
                        End:{" "}
                        <input
                          type="date"
                          className="form-control"
                          onChange={(e) =>
                            changeDate(e.target.value, i, "date_end")
                          }
                        />
                      </span>

                      <button
                        className="btn btn-primary"
                        onClick={() => sendReserve(i)}
                      >
                        Reserve
                      </button>
                    </>
                  ) : el.reserve == 1 && el.user_id == Account.id ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => cancelReserve(i)}
                    >
                      Cancel reserve
                    </button>
                  ) : (
                    <p className="text-muted">
                      Reserve {getReserveDate(el.date_start)} -{" "}
                      {getReserveDate(el.date_end)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <h1 className="text-muted">Rooms not found</h1>
          )}
        </div>
      </main>
    </>
  );
};
