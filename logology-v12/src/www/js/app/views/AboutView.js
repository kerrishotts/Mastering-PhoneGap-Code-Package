/*****************************************************************************
 *
 * Author: Kerri Shotts <kerrishotts@gmail.com> 
 *         http://www.photokandy.com/books/mastering-phonegap
 *
 * MIT LICENSED
 * 
 * Copyright (c) 2016 Packt Publishing
 * Portions Copyright (c) 2016 Kerri Shotts (photoKandy Studios LLC)
 * Portions Copyright various third parties where noted.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 *****************************************************************************/
 
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
            {selector: "tap spacepressed:a", emit: "linkTapped"},
            {selector: "tap spacepressed:ul li > button", emit: "licenseTapped"}
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
        return scrollContainer({contents: [
            textContainer({contents: [
                h.img({
                    attrs: {
                        srcset: "img/book-cover-xhidpi.jpg 2500w, img/book-cover-hidpi.jpg 1250w, img/book-cover-lodpi.jpg 625w",
                        src: "img/book-cover-lodpi.jpg",
                        title: L.T("sr:book-cover")
                    },
                    styles: {
                        width: "100%"
                    }
                }),
                h.p(L.T("about:p:1")),
                h.p(h.a(L.T("about:book-title"), {
                        attrs: {
                            href: "javascript: return false;",
                            link: "https://www.packtpub.com/application-development/mastering-phonegap-mobile-application-development"
                        }
                    })),
                h.p(L.T("about:p:2")),
                h.p(L.T("about:p:3"))
            ]}),
            list({
                contents: ["plugin", "package", "dev-package"].map(t=> {
                    return [listHeading({contents: L.T(`about:${t}`)})].concat(
                        licenses.map(license => {
                            return license.type === t ? listItem({
                                contents: listItemContents({
                                    props: {
                                        value: license.link
                                    },
                                    contents: ["name", "comment", "licenseType"].map(field => {
                                        return h.el(`div.y-flex ${field}`, license[field]);
                                    })
                                })
                            }) : undefined;
                        })
                    );
                })
            }),
            textContainer({
                contents: [
                    h.h1(L.T("about:wordnet")),
                    h.p(L.T("about:wordnet:use")),
                    h.p(L.T("about:wordnet:license:1")),
                    h.p(L.T("about:wordnet:license:2")),
                    h.p(L.T("about:wordnet:license:3")),
                    h.p(L.T("about:wordnet:license:4"))
                ]
            })
        ]});
    }

}

export function createAboutView(options = {}) {
    return new AboutView(options);
}
