// @ts-check
import { Toast } from "react-bootstrap";
import React, { useState } from "react";
// import Logo from "../Logo";
import "./style.css";
import "../../styles/style-overrides.css"

// const DEMO_USERS = ["Pablo", "Joe", "Mary", "Alex"];

export default function Login({ onLogIn, onSignup}) {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  
  const onSubmit = async (event) => {
    event.preventDefault();
    onLogIn(username, password, setError);
  };

  const onSigningup = async (event) => {
    event.preventDefault();
    onSignup(username, password, setError);
    console.log(error, setError)
  };

  return (
    <>
      <div className="login-form text-center login-page">
        <div
          className="rounded"
          style={{
            boxShadow: "0 0.75rem 1.5rem rgba(18,38,63,.03)",
          }}
        >
          <div className="position-relative">
            <div
              className="row no-gutters align-items-center"
              style={{
                maxWidth: 400,
                backgroundColor: "rgba(85, 110, 230, 0.25)",
                paddingLeft: 20,
                paddingRight: 20,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
            >
              <div className="col text-primary text-left">
                <h3 className="font-size-15">Welcome Back !</h3>
                <p>Sign in to continue</p>
              </div>
              <div className="col align-self-end">
                <img
                  alt="welcome back"
                  style={{ maxWidth: "100%" }}
                  src={`${process.env.PUBLIC_URL}/welcome-back.png`}
                />
              </div>
            </div>
            <div
              className="position-absolute"
              style={{ bottom: -36, left: 20 }}
            >
              <div
                style={{
                  backgroundColor: "rgb(239, 242, 247)",
                  width: 72,
                  height: 72,
                }}
                className="rounded-circle d-flex align-items-center justify-content-center"
              >
                {/* <Logo width={34} height={34} /> */}
              </div>
            </div>
          </div>

          <form
            className="bg-white text-left px-4"
            style={{
              paddingTop: 58,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
            }}
            onSubmit={onSubmit}
          >
            <label className="font-size-12">Name</label>

            <div className="username-select mb-3">
              {/* <UsernameSelect
                username={username}
                setUsername={setUsername}
                names={DEMO_USERS}
              /> */}
              <input
              value={username}
              onChange={(event) => setEmail(event.target.value)}
              type="username"
              id="inputUsername"
              className="form-control"
              placeholder="Email"
              required
            />
            </div>

            <label htmlFor="inputPassword" className="font-size-12">
              Password
            </label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              id="inputPassword"
              className="form-control"
              placeholder="Password"
              required
            />
            <div style={{ height: 30 }} />
            <button className="btn btn-lg btn-primary btn-block" type="submit">
              Sign in
            </button>
            <button className="btn btn-lg btn-info btn-block" type="button" onClick={onSigningup}>
              Sign Up
            </button>
            <div className="login-error-anchor">
              <div className="toast-box">
                <Toast
                  style={{ minWidth: 277 }}
                  onClose={() => setError(null)}
                  show={error !== null}
                  delay={3000}
                  autohide
                >
                  <Toast.Header>
                    <img
                      src="holder.js/20x20?text=%20"
                      className="rounded mr-2"
                      alt=""
                    />
                    <strong className="mr-auto">Error</strong>
                  </Toast.Header>
                  <Toast.Body>{error}</Toast.Body>
                </Toast>
              </div>
            </div>
            <div style={{ height: 30 }} />
          </form>
        </div>
      </div>
    </>
  );
}
