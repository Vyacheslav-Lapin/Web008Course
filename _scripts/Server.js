'use strict';

const /** @type string */ METHOD = 'GET';
const /** @type string */ BASE_URL = '/webapi/';

class Server {

    /**
     * @param {string} path
     * @param {function(string)} resolve
     * @param {function(string)} reject
     */
    static getTextAsync(path, resolve, reject) {
        const /** @type XMLHttpRequest */ xhr = new XMLHttpRequest();
        xhr.open(METHOD, BASE_URL + path, true);
        //noinspection SpellCheckingInspection
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) return;
            if (xhr.status === 200)
                resolve(xhr.responseText);
            else
                reject(xhr.statusText);
        };
        xhr.send(null);
    }

    /**
     * @template T
     * @param {string} path
     * @param {function(T)} resolve
     * @param {function(Error)} reject
     */
    static getObjectAsync(path, resolve, reject) {
        this.getTextAsync(path,
            text => resolve(JSON.parse(text)),
            status => reject(Error('JSON didn\'t load successfully; error code:' + status)));
    }

    /** @returns {Promise<Array<Gun>>} */
    static getGuns() {
        return new Promise((resolve, reject) => this.getObjectAsync('gun.json', resolve, reject));
    }
}