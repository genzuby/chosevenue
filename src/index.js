import React from "react";
import ReactDOM from "react-dom";
// to provide store on react components
import { Provider } from "react-redux";
// to make redux store and set middleware
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./reducers";
// import redux-thunk as a middleware for async
import thunk from "redux-thunk";
import App from "./components/App";

// set redux dev tool
const composeEnhencers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// create redux store
const store = createStore(reducers, composeEnhencers(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
