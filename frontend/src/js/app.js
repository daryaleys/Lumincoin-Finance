import jQuery from 'jquery';
import $ from 'jquery';
window.jQuery = $;
window.$ = jQuery;

import "moment";
// import "moment-with-locales-es6";
// import "moment/locale/ru.js";
import 'bootstrap';
import 'bootstrap-datepicker';

import '../scss/styles.scss';
import {Router} from "./router";

new Router()