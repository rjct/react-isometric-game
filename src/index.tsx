import ReactDOM from "react-dom/client";

import { MainGameComponent } from "@src/components/MainGameComponent";
import "@src/styles/index.less";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(<MainGameComponent />);
