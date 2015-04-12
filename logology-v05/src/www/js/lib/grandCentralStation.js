/*
 * Grand Central Station
 * @singleton
 *
 * Grand Central Station or GCS is used as an emitter that the entire application can
 * listen and respond to.
 *
 */
import Emitter from "yasmf-emitter";

let grandCentralStation = new Emitter();
export default grandCentralStation;
