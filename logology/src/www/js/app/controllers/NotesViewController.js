"use strict";

import GCS from "$LIB/grandCentralStation";
import ViewController from "$LIB/ViewController";
import {createNotesView} from "$VIEWS/NotesView";
import h from "yasmf-h";
import el from "$LIB/templates/el";
import navigationBar from "$WIDGETS/bars/navigation";
import widgetGroup from "$WIDGETS/group";
import glyph from "$WIDGETS/glyph";
import lemmaActions from "$VIEWS/lemmaActions";
import L from "$APP/localization/localization";

let _lemma = Symbol("_lemma"),
    _dictionary = Symbol("_dictionary");

export default class NotesViewController extends ViewController {
    constructor({model}={}) {
        super({title: "Note", model, view: createNotesView()});
    }
    get TARGET_SELECTORS() {
        return [
            {selector: "tap spacepressed:.back-icon", emit: "backTapped"},
            {selector: "tap spacepressed:.trash-icon", emit: "trashTapped"}
        ];
    }
    onBackTapped() {
        GCS.emit("APP:DO:back");
    }
    onTrashTapped() {
        // delete note from word
        this.model.removeNote();
        GCS.emit("APP:DO:back");
    }
    autofocus() {
        if (this.elementTree) {
            setTimeout(() => {
                this.elementTree.querySelector("textarea").focus();
            }, 10);
        }
    }
    onDidEnterByPush() {
        this.model.on("model:changed:note", this.autofocus, this);
    }
    onDidLeaveByPop() {
        this.model.off("model:changed:note", this);
    }
    onDidRemoveFromParent() {
        this.destroy();
    }
    template() {
        return h.el("main.NotesViewController y-container?is=y-definition-view-controller", [
            navigationBar({contents: [
                widgetGroup({contents: [
                    glyph({icon: "back", contents: L.T("icon:back"), title: L.T("general:tap-to-go-back")})
                ]}),
                widgetGroup({contents: [
                    h.el("h1?is=y-title", L.T("title:notes"))
                ], flex: true}),
                widgetGroup({contents: [
                    glyph({icon: "trash", title: L.T("actions:delete-note:title"),
                           contents: L.T("actions:delete-note")})
                ], align: "right"})
            ]}),
            this.renderSubviews()
        ]);
    }
}

export function createNotesViewController(options = {}) {
    return new NotesViewController(options);
}
