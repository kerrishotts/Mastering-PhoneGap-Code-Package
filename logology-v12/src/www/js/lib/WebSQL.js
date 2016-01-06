"use strict";
/*eslint comma-spacing: 0, no-unused-vars: 0*/

function stringOrArrayJoin(v, joinWith = " ") {
    return (v instanceof Array) ? v.join(joinWith) : v;
}

function constructWhere(where) {
    let binds = [];
    let whereSql = Object.entries(where).map(([k, v]) =>  {
        let whereSql = " " + k + " ";
        if (v instanceof Array) {
            whereSql += v[0] + " ?";
            binds.push(v[1]);
        } else {
            whereSql += "= ?";
            binds.push(v);
        }
        return whereSql;
    }).join(" AND");
    if (whereSql !== "") {
        whereSql = "WHERE " + whereSql;
    }
    return {whereSql, binds};
}

export default class WebSQLDB {
    constructor({name, version = "1", description, quota = (1 * 1024 * 1024),
                location = 0, createFromLocation = 0,
                androidDatabaseImplementation = 2, androidLockWorkaround = 1} = {}) {
        this.db = null;
        this.name = name;
        this.version = version;
        this.description = description;
        this.quota = quota;
        this.plugin = false;
        this.supportsReadOnlyTransactions = false;
        this.log = false;

        let context = (typeof window !== "undefined") ? window :
                        (typeof global !== "undefined") ? global :
                          null;

        if (!context) {
            throw new Error("No Web SQL Interface available.");
        }

        try {
            if (context.sqlitePlugin && !context.jshAdmin) {
                this.plugin = true;
                this.db = context.sqlitePlugin.openDatabase({name, location, createFromLocation,
                                                            androidDatabaseImplementation,
                                                            androidLockWorkaround});
            } else {
                this.db = context.openDatabase(name, version, description, quota);
                if (!this.db) {
                    // try something else -- for testing
                    this.db = new context.openDatabase(name, version, description, quota);
                }
            }
        } catch (err) {
            throw new Error("No Web SQL Interface available, or failed to open database. Details:" + err.message);
        }

        if (!this.db) {
            throw new Error("Could not instantiate a database.");
        }

        if (this.db.readTransaction) {
            this.supportsReadOnlyTransactions = true;
        }

        this.db.error = function (err) {
            console.log(err.message);
        }
    }

    close() {
        if (this.db && this.db.close) {
            console.log("closed");
            this.db.close();
        }
        this.db = null;
    }

    transaction(cb, {readOnly = false} = {}) {
        return new Promise((resolve, reject) => {
            let r;
            this.db[(readOnly && this.supportsReadOnlyTransactions) ? "readTransaction" : "transaction"]((transaction) => {
                try {
                    if (this.log) { console.log("[WebSQL] Beginning transaction"); }
                    r = cb(transaction);
                    if (this.log) { console.log("[WebSQL] Finished transaction"); }
                } catch (err) {
                    if (this.log) { console.log("[WebSQL] Error " + err.message); }
                    reject(err);
                }
            }, (err) => reject(err),
            () => resolve(r));
        });
    }

    exec({transaction, sql, binds, readOnly = false} = {}) {
        if (this.log) { console.log(`[WebSQL] exec ${sql}, ${JSON.stringify(binds, null, 2)}, ${readOnly}`); }
        if (!transaction) {
            if (this.log) { console.log("[WebSQL] No transaction; wrapping."); }
            return this.transaction((transaction) => {
                return this.exec({transaction, sql, binds, readOnly});
            }, {readOnly});
        } else {
            if (this.log) { console.log("[WebSQL] executing sql on transaction: " + sql); }
            let returnResults = {};
            transaction.executeSql(sql, binds,
                (transaction, results) => {
                    if (this.log) { console.log("[WebSQL] creating return result"); }
                    returnResults.rowsAffected = results && results.rowsAffected && results.rowsAffected;
                    returnResults.rows = [];
                    if (results.rows && results.rows.length > 0) {
                        if (this.log) { console.log("[WebSQL] iterating over rows"); }
                        for (let i = 0, l = results.rows.length; i < l; i++) {
                            returnResults.rows.push(results.rows.item(i));
                        }
                    }
                });
            if (this.log) { console.log("[WebSQL] returning result", returnResults); }
            return returnResults;
        }
    }

    query({transaction, sql, binds}) {
        return this.exec({transaction, sql, binds, readOnly: true});
    }

    createTable({name, fields = [], constraints = [], ifNotExists = true, transaction, template = false} = {}) {
        let fieldSql = fields.map((field = []) => field.join(" ")).join(", "),
            constraintSQL = constraints.join(" ");
        let sql = `CREATE TABLE ${ifNotExists ? "IF NOT EXISTS" : ""} ${name} (${fieldSql} ${constraintSQL !== "" ? `, ${constraintSQL}` : ""})`;
        return template ? sql : this.exec({transaction, sql});
    }

    dropTable({name, ifExists = false, transaction, template = false} = {}) {
        let sql = `DROP TABLE ${ifExists ? "IF EXISTS" : ""} ${name}`;
        return template ? sql : this.exec({transaction, sql});
    }

    alterTable({name, renameTo, addField = [], transaction, template = false} = {}) {
        let [fieldName, fieldType, ...fieldOpts] = addField;
        let sql = `ALTER TABLE ${name} `;
        if (renameTo) {
            sql += ` RENAME TO ${renameTo}`;
        } else {
            sql += ` ADD COLUMN ${fieldName} ${fieldType} ${fieldOpts.join(" ")}`;
        }
        return template ? sql : this.exec({transaction, sql});
    }

    insert({intoTable, data = {}, replace = false, transaction, template = false} = {}) {
        let fieldKeys = Object.keys(data);
        let fieldNames = fieldKeys.join(", ");
        let fieldBinds = fieldKeys.map(() => "?").join(", ");
        let binds = Object.values(data);
        let sql = `INSERT ${replace ? "OR REPLACE" : ""} INTO ${intoTable} (${fieldNames}) VALUES (${fieldBinds})`;
        return template ? sql : this.exec({transaction, sql, binds});
    }

    replace({intoTable, data = {}, transaction, template = false} = {}) {
        return this.insert({intoTable, data, transaction, replace: true, template});
    }

    select({fields=["*"], from=[], where={}, orderBy=[], transaction, template = false} = {}) {
        let [fieldSql, fromSql, orderBySql] = [fields, from, orderBy].map(e => {
            return (e instanceof Array) ? (e.map((v) => stringOrArrayJoin(v)).join(", "))
                                        : e;
        });
        let {whereSql, binds} = constructWhere(where);
        let sql = `SELECT ${fieldSql} FROM ${fromSql} ${whereSql} ${orderBySql !== "" ? `ORDER BY ${orderBySql}` : ""}`;
        return template ? sql : this.query({transaction, sql, binds});
    }
};
