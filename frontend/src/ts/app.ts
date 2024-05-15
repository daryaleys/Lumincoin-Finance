declare global {
	interface Window {
		$: any;
	}
}

import jQuery from "jquery";
window.$ = jQuery;

import "moment";
import "bootstrap";
import "bootstrap-datepicker";

import "../scss/styles.scss";
import { Router } from "./router";

new Router();
