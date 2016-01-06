"use strict";

import GCS from "$LIB/grandCentralStation";
import {createAboutView} from "$VIEWS/AboutView";
import L from "$APP/localization/localization";
import GenericViewController from "./GenericViewController";

export default class AboutViewController extends GenericViewController {
    constructor({model}={}) {
        super({title: "title:about", model, view: createAboutView(), viewClass: "About"});
    }
}

export function createAboutViewController(options = {}) {
    return new AboutViewController(options);
}
