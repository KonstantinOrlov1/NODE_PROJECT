import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default () => {
  const [Rooms, setRooms] = useState([]);

  useEffect(() => {
    getRooms();
  }, []);

  const getRooms = async () => {
    let res = await fetch("http://localhost:5000/get-rooms");
    let data = await res.json();

    if (data.status == "ok" && data.body.length) {
      setRooms(data.body);
    }
  };

  return (
    <>
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

                  <Link to={`/room/${el.id}`} className="btn btn-success">
                    Open
                  </Link>
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
