import { useState } from "react";

export default () => {
  const [Form, setForm] = useState({
    email: "",
    pass: "",
  });

  const [Err, setErr] = useState("");

  const sendForm = async (e) => {
    e.preventDefault();

    for (let key in Form) {
      if (Form[key] == "") {
        setErr(key + " is required");
        return false;
      }
    }

    let res = await fetch("http://localhost:5000/login", {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(Form),
    });

    let data = await res.json();

    switch (data.status) {
      case "ok":
        localStorage.setItem("token", data.body.token);
        window.location.assign("/");
        break;
      case "err":
        setErr("Incorrect login or password");
        break;
    }
  };

  return (
    <>
      <div className="container py-5">
        <form onSubmit={sendForm}>
          <h1>Login App</h1>
          <div className="py-1">
            <label className="form-label">Email:</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) =>
                setForm({ ...Form, email: e.target.value.trim() })
              }
            />
          </div>
          <div className="py-1">
            <label className="form-label">Password:</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) =>
                setForm({ ...Form, pass: e.target.value.trim() })
              }
            />
          </div>
          <div className="py-1">
            <button className="btn btn-success">Login</button>
          </div>
          <p className="text-danger">{Err}</p>
        </form>
      </div>
    </>
  );
};
