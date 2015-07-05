/* @flow */
"use strict";

import ViewController from "$LIB/ViewController";
import MenuView from "$VIEWS/MenuView";

import h from "yasmf-h";

export default class MenuViewController extends ViewController {
    constructor({model} = {}) {
        super({title: "Menu", model, view: new MenuView()});
    }
}
