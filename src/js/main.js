import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./Alert.mjs";

loadHeaderFooter();

// alert logic
const mainEl = document.querySelector("main");
const alerts = new Alert(mainEl);
alerts.init();
