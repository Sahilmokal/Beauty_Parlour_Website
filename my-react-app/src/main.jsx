import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./css/appointment.css"
import "./css/header.css"
import "./css/learn.css"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe("pk_test_51Sj4okRnWim2ypRExyRgWRk72p5LoJA1WBws4ZSWWrAXToSNHjvoW5sWhkFuRliHGDUBHoiJZD0k4fthrrBIOw3y002RfTf9MA");
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
  <App />
</Elements>
  </React.StrictMode>
);
