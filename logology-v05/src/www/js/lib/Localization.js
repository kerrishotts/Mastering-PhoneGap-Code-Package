"use strict";

import Emitter from "yasmf-emitter";
import Globalize from "globalize";

// private property symbols
let _globalize = Symbol();

export class GlobalizationNotLoadedError extends Error {
	constructor(message = "Globalization not loaded") {
		super();
		this.message = message;
	}
}

export default class Localization extends Emitter {
	constructor() {
		super();
		this[_globalize] = null;
	}

	get globalize() {
		return this[_globalize];
	}

	set locale(theLocale) {
		if (!this[_globalize]) {
			throw new GlobalizationNotLoadedError();
		}
		Globalize.locale(theLocale);
	}
	get locale() {
		if (!this[_globalize]) {
			throw new GlobalizationNotLoadedError();
		}
		return Globalize.locale();
	}

	getDeviceLocale() {
		return new Promise((resolve, reject) => {
			if (navigator.globalization && navigator.globalization.getLocaleName) {
				navigator.globalization.getLocaleName(locale => resolve(locale), err => reject(err));
			} else {
				resolve("en"); // best we can do if the plugin isn't around.
			}
		});
	}

	async loadLocale(...addtlCultureData) {
		let locale = await this.getDeviceLocale();
		Globalize.load(
			require("cldr-data/main/en/ca-gregorian"),
			require("cldr-data/main/en/currencies"),
			require("cldr-data/main/en/dateFields"),
			require("cldr-data/main/en/numbers"),
			require("cldr-data/supplemental/currencyData"),
			require("cldr-data/supplemental/likelySubtags"),
			require("cldr-data/supplemental/plurals"),
			require("cldr-data/supplemental/timeData"),
			require("cldr-data/supplemental/weekData"),
			...addtlCultureData
		);
		Globalize.locale(locale);
		this[_globalize] = new Globalize(locale);
		return locale;
	}

	loadTranslations(...translations) {
		if (!this[_globalize]) {
			throw new GlobalizationNotLoadedError();
		}
		Globalize.loadMessages(...translations);
	}

	T(key, ...args) {
		if (!this[_globalize]) {
			throw new GlobalizationNotLoadedError();
		}
		return this[_globalize].messageFormatter(key)(...args);
	}
}
