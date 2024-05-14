declare global {
	interface Window {
		$: any;
	}
}

import jQuery from "jquery";
// import $ from "jquery";
// window.jQuery = $;
window.$ = jQuery;

import "moment";
import "bootstrap";
import "bootstrap-datepicker";

import "../scss/styles.scss";
import { Router } from "./router";

new Router();
