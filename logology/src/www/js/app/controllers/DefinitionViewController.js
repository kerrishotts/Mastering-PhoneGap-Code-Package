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
 
 "use strict";

import GCS from "$LIB/grandCentralStation";
import ViewController from "$LIB/ViewController";
import {createDefinitionView} from "$VIEWS/DefinitionView";
import h from "yasmf-h";
import el from "$LIB/templates/el";
import navigationBar from "$WIDGETS/bars/navigation";
import widgetGroup from "$WIDGETS/group";
import glyph from "$WIDGETS/glyph";
import lemmaActions from "$VIEWS/lemmaActions";
import L from "$APP/localization/localization";
import {getFavorites} from "../models/Favorites";
import {getNotes} from "../models/Notes";

let _lemma = Symbol("_lemma"),
    _dictionary = Symbol("_dictionary"),
    _isFav = Symbol("_isFav"),
    _hasNote = Symbol("_hasNote");

export default class DefinitionViewController extends ViewController {
    constructor({model}={}) {
        super({title: "Definition", model, view: createDefinitionView()});
    }
    get TARGET_SELECTORS() {
        return [
            {selector: "tap spacepressed:.back-icon", emit: "backTapped"},
            {selector: "tap spacepressed:.fav-icon", emit: "actionTapped"},
            {selector: "tap spacepressed:.share-icon", emit: "actionTapped"},
            {selector: "tap spacepressed:.note-icon", emit: "actionTapped"}
        ];
    }
    onBackTapped() {
        GCS.emit("APP:DO:back");
    }
    onActionTapped(sender, notice, action) {
        GCS.emit(`APP:DO:${action.value}Definition`, this.model.lemma);
    }
    onFavChanged(sender, notice, fav) {
        this[_isFav] = fav;
        let actions = lemmaActions({isFavorite: fav});
        let favIcon = this.elementTree.querySelector(".fav-icon");
        favIcon.title = actions[0].title;
        favIcon.setAttribute("data-fav", actions[0].getAttribute("data-fav"));
    }
    onNoteChanged(sender, notice, note) {
        this[_hasNote] = note;
        let actions = lemmaActions({hasNote: note});
        let noteIcon = this.elementTree.querySelector(".note-icon");
        noteIcon.setAttribute("data-note", actions[1].getAttribute("data-note"));
    }
    onDidEnterByPush() {
        // start listening for favorite changes
        GCS.on("APP:DID:favDefinition", (sender, notice, lemma, fav) => {
            if (this.model) {
                if (lemma === this.model.lemma) {
                    this.emit("favChanged", fav);
                }
            }
        }, this);
        GCS.on("APP:DID:noteDefinition", (sender, notice, lemma, note) => {
            if (this.model) {
                if (lemma === this.model.lemma) {
                    this.emit("noteChanged", note);
                }
            }
        }, this);
        getFavorites().isWordAFavorite(this.model.lemma).then((fav) => this.emit("favChanged", fav));
        getNotes().doesWordHaveANote(this.model.lemma).then((note) => this.emit("noteChanged", note));
    }
    onDidLeaveByPop() {
        GCS.off("APP:DID:favDefinition", this);
        GCS.off("APP:DID:noteDefinition", this);
    }
    onDidRemoveFromParent() {
        this.destroy();
    }
    template() {
        return h.el("main.DefinitionViewController y-container?is=y-definition-view-controller", [
            navigationBar({contents: [
                widgetGroup({contents: [
                    glyph({icon: "back", contents: L.T("icon:back"), title: L.T("general:tap-to-go-back")})
                ]}),
                widgetGroup({contents: [
                    h.el("h1?is=y-title", L.T("title:definitions"))
                ], flex: true}),
                widgetGroup({contents: lemmaActions({isFavorite: this[_isFav], hasNote: this[_hasNote]}), align: "right"})
            ]}),
            this.renderSubviews()
        ]);
    }
}

export function createDefinitionViewController(options = {}) {
    return new DefinitionViewController(options);
}
