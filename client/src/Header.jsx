export default ({ username, vip, logout }) => {
  return (
    <>
      <header>
        <div className="container d-flex justify-content-between align-items-center">
          <a href="#" className="logo">
            Logo App Hotels
          </a>

          <div className="d-flex align-item-center">
            <b className="me-2">
              {vip == 1 ? (
                <span style={{ color: "orangered" }}>
                  <i className="fa-solid fa-certificate"></i> VIP
                </span>
              ) : null}
              &nbsp; Hello {username}
            </b>
            <a href="#" className="logout" onClick={logout}>
              Logout
            </a>
          </div>
        </div>
      </header>
    </>
  );
};
