'use strict';
const fs = require('fs');
const lang = require('../config/lang.js');

/**
     * @fileOverview Narzędzia do zbierania adresów MAC.
     * @version 0.0.1
     * @module macHarvester
     * @example
     * const macHarvester = require('./macHarvester/macHarvester.js');
     * var mac = new macHarvester('/path/to/mac/tree/'),
     *     macTree = mac.get();
     * console.log(macTree);
     */


/**
 * @class
 * @classdesc Zbieracz adresów MAC z drzewa katalogów. Elementy pierwszego katalogu powinny być katalogiami o nazwie sali, w jakiej znajduje się grupa komputerów. W katalogach powinny znajdować się pliki tekstowe bez rozszerzenia zawierające listę adresów MAC każdego komputera (każdy w nowej linii).
 */
class macHarvester {
  /**
   * Sprawdza, czy podana ścieżka istnieje i w razie sukcesu zapisuje ścieżkę do pola klasy.
   * @constructor
   * @param {string} path Ścieżka bezwzględna do drzewa katalogów z adresami MAC.
   */
  constructor(path) {
    if(fs.existsSync(path)) {
      this.path = path;
    } else {
      throw lang.file.notFound.format(path);
    }
  }
  /**
   * Przeszukuje strukture drzewa katalogów w poszukiwaniu adresów MAC i zwraca w postaci obiektu o strukturze:
   * @method
   * @return {Object} Struktura obiektów awierająca tablice zebranych adresów MAC w postaci {nazwaSali:{nazwaGrupy: [mac1, mac2]}}
   */
  get() {
    let macTree = {};
    for(let room of fs.readdirSync(this.path)) {
      macTree[room] = {};
      for(let group of fs.readdirSync(`${this.path}/${room}`)) {
        macTree[room][group] = fs.readFileSync(`${this.path}/${room}/${group}`, 'utf-8').split('\n').filter(item => item.replace(' ', '')!='');
      }
    }
    return macTree;
  }
}

module.exports = macHarvester;
