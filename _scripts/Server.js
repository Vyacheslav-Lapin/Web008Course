'use strict';

const /** @type string */ BASE_URL = '/webapi/';

class Server {

    /** @returns {Promise<Array<Gun>>} */
    static getGuns() {
        //noinspection JSUnresolvedFunction
        return fetch(BASE_URL + 'gun.json');
    }
}