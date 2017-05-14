'use strict';
/**
  * @fileOverview Paczka językowa dla drblMacSelector. Zawiera obiekt z komunikatami językowymi gotowymi do sformatowania przez prototyp `format()` klasy `String` z {@link utils}.
  * @version 0.0.1
  */

  /**
   * Zbiór komunikatów o błędach. Istnieje możliwość zastosowania formatowania podbnego do funkcji `printf()` przy użyciu {@link utils}.
   * @example
   * const lang = require('../config/lang.js');
   * var path = '/foo/bar';
   * try {
   *  fs.accessSync(path);
   * } catch(e) {
   *  console.error(lang.notAccessible.format(path));
   * }
   * @namespace
   * @property {Object} file Zbiór komunikatów odnoszących się do plików.
   * @property {string} file.notFound Komunikat w wypadku braku pliku/katalogu.
   * @property {string} file.notAccessible Komunikat w wypadku braku uprawnień do pliku/katalogu.
   * @property {string} file.savedSuccessfully Komunikat w wypadku poprawnego zapisania pliku.
   * @property {string} file.cantCreate Komunikat w wypadku braku możliwości utworzenia pliku/katalogu.
   * @property {Object} json Zbiór komunikatów związanych z obsługą formatu JSON.
   * @property {string} json.parse Komunikat w wypadku błędu parsowania.
   */
var lang =  {
  file: {
    notFound: '[drblms] Nie znaleziono %s!',
    notAccessible: '[drblms] Brak dostępu do %s!',
    savedSuccessfully: '[drblms] Pomyślnie zapisano %s!\n[drblms] Trwa parsowanie konfiguracji...',
    cantCreate: '[drblms] Nie można utworzyć %s!'
  },
  json: {
    parse: '[drblms] Błąd podczas parsowania JSON!'
  }
}
module.exports = lang;
