import React from "react";

const Signup = () => {
  const onClick = () => {
    actions.signup(email, password);
  };

  if (store.token && store.token != "" && store.token != undefined)
    navigate("/private");

  return (
    <>
      <div className="text-center mt-5">
        <h1>Signup</h1>
        {store.token && store.token != "" && store.token != undefined ? (
          "You are logged in with this token" + store.token
        ) : (
          <div>
            <input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button onClick={onClick}>Signup</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Signup;
