import ReactDOM from "react-dom/client";

import "./index.css";
import React from "react";
import { MainGameComponent } from "./components/MainGameComponent";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(<MainGameComponent />);
