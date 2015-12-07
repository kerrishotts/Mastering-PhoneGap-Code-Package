"use strict";

import GCS from "$LIB/grandCentralStation";
import {createSettingsView} from "$VIEWS/SettingsView";
import L from "$APP/localization/localization";
import GenericViewController from "./GenericViewController";

export default class SettingsViewController extends GenericViewController {
    constructor({model}={}) {
        super({title: "title:settings", model, view: createSettingsView(), viewClass:"Settings"});
    }
}

export function createSettingsViewController(options = {}) {
    return new SettingsViewController(options);
}
