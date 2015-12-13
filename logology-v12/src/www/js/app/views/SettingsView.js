
/* @flow */
"use strict";

import scrollContainer from "$WIDGETS/scrollContainer";
import textContainer from "$WIDGETS/textContainer";
import View from "$LIB/View";
import glyph from "$WIDGETS/glyph";
import list from "$WIDGETS/list";
import listItem from "$WIDGETS/listItem";
import listItemContents from "$WIDGETS/listItemContents";
import listItemActions from "$WIDGETS/listItemActions";
import listItemSpacer from "$WIDGETS/listItemSpacer";
import listHeading from "$WIDGETS/listHeading";
import listIndicator from "$WIDGETS/listIndicator";

import h from "yasmf-h";
import L from "$APP/localization/localization";
import GCS from "$LIB/grandCentralStation";

import {getSettings} from "$MODELS/settings";
let settings = getSettings();

const kp = require("keypather")();

export default class SettingsView extends View {
    get TARGET_SELECTORS() {
        return [
            {selector: "input:select", emit: "settingChanged"}
        ];
    }

    onSettingChanged(sender, notice, select) {
        settings[select.getAttribute("data-key")] = select.value;
    }

    template() {
        let model = settings.entries;
        return scrollContainer({contents:
            list({
                contents: model.map(setting => {
                    return listItem({
                        tag: "label",
                        contents: listItemContents({
                                    props: {
                                        value: setting.key
                                    },
                                    contents: [
                                        h.el("div.y-flex name", L.T(setting.name)),
                                        h.el("div.y-flex value",
                                            h.select(
                                                {attrs: {
                                                    "data-key": setting.key
                                                }},
                                                setting.options.map(option => h.option(option.value, L.T(option.name),
                                                                                        {attrs: {
                                                                                            selected: settings[setting.key] == option.value ? "selected" : undefined
                                                                                        }}
                                                                                       )),
                                            )
                                        )
                                    ]})
                    });
                })
            })
        });
    }

}

export function createSettingsView(options = {}) {
    return new SettingsView(options);
}
