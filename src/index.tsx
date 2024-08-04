/* @refresh reload */
import { render } from "solid-js/web";

import App from "~/app/App";
import "~/index.css";

const root = document.getElementById("root")!;
render(() => <App />, root);
