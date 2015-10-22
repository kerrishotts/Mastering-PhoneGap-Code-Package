"use strict";

var _toArray = function (arr) { return Array.isArray(arr) ? arr : Array.from(arr); };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/*eslint comma-spacing: 0, no-unused-vars: 0*/
var WebSQLDB = (function () {
    function stringOrArrayJoin(v) {
        var joinWith = arguments[1] === undefined ? " " : arguments[1];

        return v instanceof Array ? v.join(joinWith) : v;
    }

    function constructWhere(where) {
        var binds = [];
        var whereSql = Object.entries(where).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2);

            var k = _ref2[0];
            var v = _ref2[1];

            var whereSql = " " + k + " ";
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
        return { whereSql: whereSql, binds: binds };
    }

    return (function () {
        function WebSQLDB() {
            var _ref3 = arguments[0] === undefined ? {} : arguments[0];

            var name = _ref3.name;
            var _ref3$version = _ref3.version;
            var version = _ref3$version === undefined ? "1" : _ref3$version;
            var description = _ref3.description;
            var _ref3$quota = _ref3.quota;
            var quota = _ref3$quota === undefined ? 5 * 1024 * 1024 : _ref3$quota;
            var _ref3$location = _ref3.location;
            var location = _ref3$location === undefined ? 0 : _ref3$location;
            var _ref3$createFromLocation = _ref3.createFromLocation;
            var createFromLocation = _ref3$createFromLocation === undefined ? 0 : _ref3$createFromLocation;
            var _ref3$androidDatabaseImplementation = _ref3.androidDatabaseImplementation;
            var androidDatabaseImplementation = _ref3$androidDatabaseImplementation === undefined ? 2 : _ref3$androidDatabaseImplementation;
            var _ref3$androidLockWorkaround = _ref3.androidLockWorkaround;
            var androidLockWorkaround = _ref3$androidLockWorkaround === undefined ? 1 : _ref3$androidLockWorkaround;

            _classCallCheck(this, WebSQLDB);

            this.db = null;
            this.name = name;
            this.version = version;
            this.description = description;
            this.quota = quota;
            this.plugin = false;
            this.supportsReadOnlyTransactions = false;
            this.log = false;

            if (window.sqlitePlugin && !window.jshAdmin) {
                this.plugin = true;
                this.db = window.sqlitePlugin.openDatabase({ name: name, location: location, createFromLocation: createFromLocation,
                    androidDatabaseImplementation: androidDatabaseImplementation,
                    androidLockWorkaround: androidLockWorkaround });
            } else {
                this.db = window.openDatabase(name, version, description, quota);
            }

            if (!this.db) {
                throw new Error("Could not instantiate a database.");
            }

            if (this.db.readTransaction) {
                this.supportsReadOnlyTransactions = true;
            }
        }

        _createClass(WebSQLDB, [{
            key: "close",
            value: function close() {
                this.db = null;
            }
        }, {
            key: "transaction",
            value: function transaction(cb) {
                var _this = this;

                var _ref4 = arguments[1] === undefined ? {} : arguments[1];

                var _ref4$readOnly = _ref4.readOnly;
                var readOnly = _ref4$readOnly === undefined ? false : _ref4$readOnly;

                return new Promise(function (resolve, reject) {
                    var r = undefined;
                    _this.db[readOnly && _this.supportsReadOnlyTransactions ? "readTransaction" : "transaction"](function (transaction) {
                        try {
                            if (_this.log) {
                                console.log("[WebSQL] Beginning transaction");
                            }
                            r = cb(transaction);
                            if (_this.log) {
                                console.log("[WebSQL] Finished transaction");
                            }
                        } catch (err) {
                            if (_this.log) {
                                console.log("[WebSQL] Error " + err.message);
                            }
                            reject(err);
                        }
                    }, function (err) {
                        return reject(err);
                    }, function () {
                        return resolve(r);
                    });
                });
            }
        }, {
            key: "exec",
            value: function exec() {
                var _this2 = this;

                var _ref5 = arguments[0] === undefined ? {} : arguments[0];

                var transaction = _ref5.transaction;
                var sql = _ref5.sql;
                var binds = _ref5.binds;
                var _ref5$readOnly = _ref5.readOnly;
                var readOnly = _ref5$readOnly === undefined ? false : _ref5$readOnly;

                if (this.log) {
                    console.log("[WebSQL] exec " + sql + ", " + JSON.stringify(binds, null, 2) + ", " + readOnly);
                }
                if (!transaction) {
                    if (this.log) {
                        console.log("[WebSQL] No transaction; wrapping.");
                    }
                    return this.transaction(function (transaction) {
                        return _this2.exec({ transaction: transaction, sql: sql, binds: binds, readOnly: readOnly });
                    }, { readOnly: readOnly });
                } else {
                    var _ret = (function () {
                        if (_this2.log) {
                            console.log("[WebSQL] executing sql on transaction: " + sql);
                        }
                        var returnResults = {};
                        transaction.executeSql(sql, binds, function (transaction, results) {
                            returnResults.rowsAffected = results.rowsAffected;
                            returnResults.rows = [];
                            if (results.rows && results.rows.length > 0) {
                                for (var i = 0, l = results.rows.length; i < l; i++) {
                                    returnResults.rows.push(results.rows.item(i));
                                }
                            }
                        });
                        return {
                            v: returnResults
                        };
                    })();

                    if (typeof _ret === "object") {
                        return _ret.v;
                    }
                }
            }
        }, {
            key: "query",
            value: function query(_ref6) {
                var transaction = _ref6.transaction;
                var sql = _ref6.sql;
                var binds = _ref6.binds;

                return this.exec({ transaction: transaction, sql: sql, binds: binds, readOnly: true });
            }
        }, {
            key: "createTable",
            value: function createTable() {
                var _ref7 = arguments[0] === undefined ? {} : arguments[0];

                var name = _ref7.name;
                var _ref7$fields = _ref7.fields;
                var fields = _ref7$fields === undefined ? [] : _ref7$fields;
                var _ref7$constraints = _ref7.constraints;
                var constraints = _ref7$constraints === undefined ? [] : _ref7$constraints;
                var _ref7$ifNotExists = _ref7.ifNotExists;
                var ifNotExists = _ref7$ifNotExists === undefined ? true : _ref7$ifNotExists;
                var transaction = _ref7.transaction;
                var _ref7$template = _ref7.template;
                var template = _ref7$template === undefined ? false : _ref7$template;

                var fieldSql = fields.map(function () {
                    var field = arguments[0] === undefined ? [] : arguments[0];
                    return field.join(" ");
                }).join(", "),
                    constraintSQL = constraints.join(" ");
                var sql = "CREATE TABLE " + (ifNotExists ? "IF NOT EXISTS" : "") + " " + name + " (" + fieldSql + " " + (constraintSQL !== "" ? ", " + constraintSQL : "") + ")";
                return template ? sql : this.exec({ transaction: transaction, sql: sql });
            }
        }, {
            key: "dropTable",
            value: function dropTable() {
                var _ref8 = arguments[0] === undefined ? {} : arguments[0];

                var name = _ref8.name;
                var _ref8$ifExists = _ref8.ifExists;
                var ifExists = _ref8$ifExists === undefined ? false : _ref8$ifExists;
                var transaction = _ref8.transaction;
                var _ref8$template = _ref8.template;
                var template = _ref8$template === undefined ? false : _ref8$template;

                var sql = "DROP TABLE " + (ifExists ? "IF EXISTS" : "") + " " + name;
                return template ? sql : this.exec({ transaction: transaction, sql: sql });
            }
        }, {
            key: "alterTable",
            value: function alterTable() {
                var _ref9 = arguments[0] === undefined ? {} : arguments[0];

                var name = _ref9.name;
                var renameTo = _ref9.renameTo;
                var _ref9$addField = _ref9.addField;
                var addField = _ref9$addField === undefined ? [] : _ref9$addField;
                var transaction = _ref9.transaction;
                var _ref9$template = _ref9.template;
                var template = _ref9$template === undefined ? false : _ref9$template;

                var _addField = _toArray(addField);

                var fieldName = _addField[0];
                var fieldType = _addField[1];

                var fieldOpts = _addField.slice(2);

                var sql = "ALTER TABLE " + name + " ";
                if (renameTo) {
                    sql += " RENAME TO " + renameTo;
                } else {
                    sql += " ADD COLUMN " + fieldName + " " + fieldType + " " + fieldOpts.join(" ");
                }
                return template ? sql : this.exec({ transaction: transaction, sql: sql });
            }
        }, {
            key: "insert",
            value: function insert() {
                var _ref10 = arguments[0] === undefined ? {} : arguments[0];

                var intoTable = _ref10.intoTable;
                var _ref10$data = _ref10.data;
                var data = _ref10$data === undefined ? {} : _ref10$data;
                var _ref10$replace = _ref10.replace;
                var replace = _ref10$replace === undefined ? false : _ref10$replace;
                var transaction = _ref10.transaction;
                var _ref10$template = _ref10.template;
                var template = _ref10$template === undefined ? false : _ref10$template;

                var fieldKeys = Object.keys(data);
                var fieldNames = fieldKeys.join(", ");
                var fieldBinds = fieldKeys.map(function () {
                    return "?";
                }).join(", ");
                var binds = Object.values(data);
                var sql = "INSERT " + (replace ? "OR REPLACE" : "") + " INTO " + intoTable + " (" + fieldNames + ") VALUES (" + fieldBinds + ")";
                return template ? sql : this.exec({ transaction: transaction, sql: sql, binds: binds });
            }
        }, {
            key: "replace",
            value: function replace() {
                var _ref11 = arguments[0] === undefined ? {} : arguments[0];

                var intoTable = _ref11.intoTable;
                var _ref11$data = _ref11.data;
                var data = _ref11$data === undefined ? {} : _ref11$data;
                var transaction = _ref11.transaction;
                var _ref11$template = _ref11.template;
                var template = _ref11$template === undefined ? false : _ref11$template;

                return this.insert({ intoTable: intoTable, data: data, transaction: transaction, replace: true, template: template });
            }
        }, {
            key: "select",
            value: function select() {
                var _ref12 = arguments[0] === undefined ? {} : arguments[0];

                var _ref12$fields = _ref12.fields;
                var fields = _ref12$fields === undefined ? ["*"] : _ref12$fields;
                var _ref12$from = _ref12.from;
                var from = _ref12$from === undefined ? [] : _ref12$from;
                var _ref12$where = _ref12.where;
                var where = _ref12$where === undefined ? {} : _ref12$where;
                var _ref12$orderBy = _ref12.orderBy;
                var orderBy = _ref12$orderBy === undefined ? [] : _ref12$orderBy;
                var transaction = _ref12.transaction;
                var _ref12$template = _ref12.template;
                var template = _ref12$template === undefined ? false : _ref12$template;

                var _map = [fields, from, orderBy].map(function (e) {
                    return e instanceof Array ? e.map(function (v) {
                        return stringOrArrayJoin(v);
                    }).join(", ") : e;
                });

                var _map2 = _slicedToArray(_map, 3);

                var fieldSql = _map2[0];
                var fromSql = _map2[1];
                var orderBySql = _map2[2];

                var _constructWhere = constructWhere(where);

                var whereSql = _constructWhere.whereSql;
                var binds = _constructWhere.binds;

                var sql = "SELECT " + fieldSql + " FROM " + fromSql + " " + whereSql + " " + (orderBySql !== "" ? "ORDER BY " + orderBySql : "");
                return template ? sql : this.query({ transaction: transaction, sql: sql, binds: binds });
            }
        }]);

        return WebSQLDB;
    })();
})();
