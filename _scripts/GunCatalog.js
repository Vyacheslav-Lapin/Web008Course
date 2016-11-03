'use strict';

class GunCatalog {

    /**
     * @param {string} id
     */
    constructor(id="Guns") {
        /**
         * @private
         * @type HTMLTableElement
         */
        this.targetElement = document.getElementById(id);
    }

    /**
     * @param {Gun} gun
     */
    add(gun) {
        //noinspection JSValidateTypes
        const /** @type HTMLTableRowElement */ gunTr = document.createElement("tr");

        //noinspection JSValidateTypes
        const /** @type HTMLTableCellElement */ name = document.createElement("td");

        //noinspection JSValidateTypes
        const /** @type HTMLAnchorElement */ buyLink = document.createElement("a");
        buyLink.href = "/buy?id=" + gun.id;

        buyLink.appendChild(document.createTextNode(gun.name));
        name.appendChild(buyLink);
        gunTr.appendChild(name);

        //noinspection JSValidateTypes
        const /** @type HTMLTableCellElement */ caliber = document.createElement("td");
        caliber.appendChild(document.createTextNode(String(gun.caliber)));
        gunTr.appendChild(caliber);

        this.targetElement.appendChild(gunTr);
    }

    /**
     * @param {Array<Gun>} guns
     */
    addAll(guns=[]) {
        guns.forEach(gun => this.add(gun));
    }
}