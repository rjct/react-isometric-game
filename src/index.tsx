import ReactDOM from "react-dom/client";

import { MainGameComponent } from "@src/components/MainGameComponent";
import "@src/index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(<MainGameComponent />);
