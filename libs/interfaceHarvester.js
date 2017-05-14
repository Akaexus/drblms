'use strict';
const os = require('os');
const fs = require('fs');
const ini = require('ini');
const lang = require('../config/lang.js');

/**
  * @fileOverview Narzędzia do zbierania interfejsów sieciowych dostępnych dla DRBL.
  * @version 0.0.1
  * @module interfaceHarvester
  * @example
  * const interfaceHarvester = require('./interfaceHarvester.js');
  * var interfaces = new interfaceHarvester('/path/to/drblpush.conf'),
  *     listOfInterfaces = interfaces.get();
  * console.log(interfaces);
  */

 /**
  * Obiekt zawierający nazwy interfejsów wraz z ich konfiguracją.
  * @typedef {Object} interfaces
  * @property {object[]} interfaceName Tablica zawierające informacje dotyczące IPv4, IPv6 oraz konfiguracji klientów.
  */

/**
 * @class
 * @classdesc Zbiera i zwraca obiekt zawierający interfejsy widziane przez system i jednocześnie zawarte w konfiguracji DRBL (domyślnie drblpush.conf). Nie potrafi wykryć interfejsu, który nie został jeszcze użyty (nie zostały wysłane/odebrane żadne dane).
 */

class interfaceHarvester {
  /**
   * Sprawdza, czy wskazany plik istnieje i w razie sukcesu zapisuje ścieżkę do pola klasy.
   * @constructor
   * @param {string} drblpush ścieżka bezwzględna do pliku z konfiguracją klientów DRBL (domyślnie drblpush.conf).
   */
  constructor(drblpush) {
    if(fs.existsSync(drblpush)) {
      this.drblpush = drblpush;
    } else {
      throw `${drblpush} does not exists!`;
    }
  }
  /**
   * Przeszukuje plik z konfiguracją klientów (domyślnie drblpush.conf) oraz listę dostępnych interfejsów i zwraca ich wspólną część w postaci obiektu.
   * @method
   * @return {Object} interfaces Struktura obiektów awierająca tablice zebranych adresów MAC w postaci {nazwaSali:{nazwaGrupy: [mac1, mac2]}}
   */
  get() {
    let file = fs.readFileSync(this.drblpush, 'utf-8');
    let config = ini.parse(file);
    let interfaces = os.networkInterfaces();

    for(let _if in interfaces) {
      if(config.hasOwnProperty(_if)) {
        interfaces[_if][2] = config[_if];
      } else {
        delete interfaces[_if];
      }
    }
    return interfaces;
  }
}

module.exports = interfaceHarvester;
