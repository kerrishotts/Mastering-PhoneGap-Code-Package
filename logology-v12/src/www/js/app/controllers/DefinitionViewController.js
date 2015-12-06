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
    _dictionary = Symbol("_dictionary");

export default class DefinitionViewController extends ViewController {
    constructor({model}={}) {
        super({title: "Definition", model, view: createDefinitionView()});
    }
    get TARGET_SELECTORS() {
        return [
            {selector: "tap:.back-icon", emit: "backTapped"},
            {selector: "tap:.fav-icon", emit: "actionTapped"},
            {selector: "tap:.share-icon", emit: "actionTapped"},
            {selector: "tap:.note-icon", emit: "actionTapped"}
        ];
    }
    onBackTapped() {
        GCS.emit("APP:DO:back");
    }
    onActionTapped(sender, notice, action) {
        GCS.emit(`APP:DO:${action.value}Definition`, this.model.lemma);
    }
    onFavChanged(sender, notice, fav) {
        let actions = lemmaActions({isFavorite: fav});
        let favIcon = this.elementTree.querySelector(".fav-icon");
        favIcon.title = actions[0].title;
        favIcon.setAttribute("data-fav", actions[0].getAttribute("data-fav"));
    }
    onNoteChanged(sender, notice, note) {
        let actions = lemmaActions({hasNote: note});
        let noteIcon = this.elementTree.querySelector(".note-icon");
        noteIcon.setAttribute("data-note", actions[0].getAttribute("data-note"));
    }
    onDidChangeParentView() {
        // start listening for favorite changes
        GCS.on("APP:DID:favDefinition", (sender, notice, lemma, fav) => {
            if (this.model) {
                if (lemma === this.model.lemma) {
                    this.emit("favChanged", fav);
                }
            }
        }, this);
        GCS.on("APP:DID:noteDefinition", (sender, notice, lemma, fav) => {
            if (this.model) {
                if (lemma === this.model.lemma) {
                    this.emit("noteChanged", fav);
                }
            }
        }, this);
        getFavorites().isWordAFavorite(this.model.lemma).then((fav) => this.emit("favChanged", fav));
        getNotes().doesWordHaveANote(this.model.lemma).then((note) => this.emit("noteChanged", note));
    }
    onDidRemoveFromParent() {
        GCS.off("APP:DID:favDefinition", this);
        GCS.off("APP:DID:noteDefinition", this);
        this.destroy();
    }
    template() {
        return h.el("main.DefinitionViewController y-container?is=y-definition-view-controller", [
            navigationBar({contents:[
                widgetGroup({contents:[
                    glyph({icon:"back", contents: L.T("icon:back"), title: L.T("general:tap-to-go-back")})
                ]}),
                widgetGroup({contents:[
                    h.el("h1?is=y-title", this.model && this.model.lemma)
                ], flex: true}),
                widgetGroup({contents: lemmaActions(), align:"right"})
            ]}),
            this.renderSubviews()
        ]);
    }
}

export function createDefinitionViewController(options = {}) {
    return new DefinitionViewController(options);
}
