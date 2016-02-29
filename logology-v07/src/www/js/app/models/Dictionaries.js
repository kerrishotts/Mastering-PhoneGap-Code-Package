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

import Emitter from "yasmf-emitter";

// private property symbols

let _dictionaries = Symbol(),
    _instances = Symbol(),
    _options = Symbol();

export default class Dictionaries extends Emitter {
    constructor() {
        super();
        this[_dictionaries] = new Map();
        this[_instances] = new Map();
        this[_options] = new Map();
    }

    addDictionary({name, Dictionary, options = {}} = {}) {
        this[_dictionaries].set(name, Dictionary);
        this[_instances].set(name, null);
        this[_options].set(name, options);
    }

    getDictionary({name} = {}) {
        return this[_dictionaries].get(name);
    }

    get dictionaries() {
        return Array.from(this[_dictionaries]).map(([k])=>k);
    }

    async getDictionaryInstance({name} = {}) {
        let instance = this[_instances].get(name);
        if (!instance) {
            let Dictionary = this[_dictionaries].get(name);
            let options = this[_options].get(name);
            instance = new Dictionary(options);
            await instance.load();
            this[_instances].set(name, instance);
        }
        return instance;
    }
}

export function createDictionaries(options = {}) {
    return new Dictionaries(options);
}
