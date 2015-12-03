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

import licenses from "$MODELS/licenses.json";

const kp = require("keypather")();


export default class AboutView extends View {
    get TARGET_SELECTORS() {
        return [
            {selector: "tap:a", emit: "linkTapped"},
            {selector: "tap:ul li > button", emit: "licenseTapped"}
        ];
    }

    onLinkTapped(sender, notice, linkElement) {
        GCS.emit("APP:DO:URL", linkElement.getAttribute("link"));
    }

    onLicenseTapped(sender, notice, license) {
        GCS.emit("APP:DO:URL", license.value);
    }

    template() {
        let model = kp.get(this, "controller.model");
        //if (!model) {model = {dictionaries: []}};
        return scrollContainer({contents: [
            textContainer({contents: [
                h.p(`Logology is an app about the love of words.
                    Combinations of words are our thoughts, crystalized,
                    ready to put into action. Without definitions, our
                    thoughts would be immaterial`),
                h.p([h.span("Logology was created as a demonstration app for the book, "),
                    h.a("Mastering PhoneGap Mobile Application Development", {
                        attrs: {
                            href: "javascript: return false;",
                            link: "https://www.packtpub.com/application-development/mastering-phonegap-mobile-application-development"
                        }
                    }),
                    h.span(`, and was built to illustrate how to create mobile hybrid
                            apps using Cordova and PhoneGap.`)]),
                h.p(`This app relies upon the following technologies. Tap each one
                    for additional information, including licensing information.`)
            ]}),
            list({
                contents: ["plugin", "package", "dev-package"].map ( t=> {
                    return [listHeading({contents:L.T(`about:${t}`)})].concat(
                        licenses.map( license => {
                            return license.type === t ? listItem({
                                contents: listItemContents({
                                    props: {
                                        value: license.link
                                    },
                                    contents: ["name", "comment", "licenseType"].map( field => {
                                        return h.el(`div.y-flex ${field}`, license[field]);
                                    })
                                })
                            }) : undefined;
                        })
                    );
                })
            })
        ]});
    }

}

export function createAboutView(options = {}) {
    return new AboutView(options);
}
