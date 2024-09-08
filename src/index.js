import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { FirebaseContext } from "./store/Context";
import { auth, firestoredb, storage } from "./firebase/config";
import Context from "./store/Context";
ReactDOM.render(
  <FirebaseContext.Provider value={{ auth, firestoredb, storage }}>
    <Context>
      <App />
    </Context>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);
