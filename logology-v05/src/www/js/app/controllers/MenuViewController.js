/* @flow */
"use strict";

import ViewController from "../../lib/ViewController";
import MenuView from "../views/MenuView";

import h from "yasmf-h";

export default class MenuViewController extends ViewController {
    constructor({model} = {}) {
        super({title: "Menu", model, view: new MenuView()});
    }
}
