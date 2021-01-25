import React, { useEffect, useState } from "react";
import AppRouter from "./Router";

function App() {
  const [init, setInit] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userObj, setUserObj] = useState(null); //나중에 사용 가능하도록 현재 유저 정보 저장
  /*
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  */
  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
