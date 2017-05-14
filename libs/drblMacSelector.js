'use strict';
/**
     * @fileOverview Narzędzie pozwalające na szybki wybór grupy komputerów do dystrybucji obrazów.
     * @version 0.0.1
     * @module drblMacSelector
     * @requires module:interfaceHarvester
     * @requires module:macHarvester
     * @requires module:fs-extra
     * @requires module:ini
     * @example
     * var drblMacSelector = require('./libs/drblMacSelector.js');
     * var drblms = new drblMacSelector('./config/config.json');
     * drblms.init();
     */

const fs = require('fs-extra');
const ini = require('ini');
const path = require('path');
const utils = require('./utils.js');
const lang = require('../config/lang.js');
const defaultConfig = require('../config/config.json');

/**
 * @class
 * @memberof module:drblMacSelector
 * @classdesc Narzędzie pozwalające na szybki wybór grupy komputerów do dystrybucji obrazów.
 */
class drblMacSelector {
  /**
   * Weryfikuje istnienie oraz dostęp do pliku konfiguracyjnego (domyślnie config/config.json) oraz pobiera layout z pliku config/layout.js.
   * @constructor
   * @param {string} configPath Ścieżka dostępu do pliku konfiguracyjnego (domyślnie config/config.json).
   */
  constructor(configFolder) {
    this.config = this.grabConfig(configFolder);
    this.layout = this.getLayout();
  }

  /**
   * Obiekt zawierający konfigracje drblMacSelector.
   * @typedef {Object} drblConfig
   * @property {string} macFolder Ścieżka dostępu do katalogu z adresami mac. @see {@link module:macHarvester}
   * @property {string} drblpush Ścieżka do pliku konfiguracyjnego drblpush.conf.
   */

  /**
   * grabConfig - Weryfikuje, czy pod podaną ścieżką znajduje się folder z plikiem konfiguracyjnym i zwraca jego zawartość w postaci obiektu. W razie niepowodzenia zwraca domyślną konfigurację.
   * @param  {string} configPath Ścieżka dostępu do folderu z plikiem konfigracyjnym (config.json).
   * @return {module:drblMacSelector~drblConfig}            Konfiguracja drblMacSelector.
   */
  grabConfig(configPath) {
    try {
      fs.ensureDirSync(configPath);
      configPath = path.resolve(configPath);
    } catch(e) {
      return defaultConfig;
    }
    try {
      fs.ensureDirSync(configPath+'/macbank/');
    } catch(e) {
      throw lang.files.cantCreate.format(configPath+'/macbank/');
    }
    try {
      fs.accessSync(configPath+'/config.json');
      return require(configPath+'/config.json');
    } catch (e) {
      fs.writeFileSync(configPath+'/config.json', JSON.stringify(defaultConfig), {encoding: 'utf8', mode: 0o755});
      return defaultConfig;
    }
    return defaultConfig;
  }
  /**
   * Pobiera obiekt z adresami MAC używając {@link module:macHarvester} i dodaje do layoutu.
   * @method
   */
  assignMacList() {
    this.macs = (new (require('./macHarvester.js'))(this.config.macFolder)).get();
    for(let room in this.macs) {
      for(let group in this.macs[room]) {
        this.layout.macGroupList.addItem(`${room}/${group}/ [${this.macs[room][group].length}]`);
      }
    }
  }
  /**
   * Pobiera obiekt z obiektami interfejsów używając {@link module:interfacesHarvester} i dodaje do layoutu.
   * @method
   * @see {@link module:interfacesHarvester}
   */
  assignInterfaces() {
    const ipCalc = require('./ipCalc.js');
    this.interfaces = (new (require('./interfaceHarvester.js'))(this.config.drblpush)).get();
    for(let _if in this.interfaces) {
      this.layout.interfacesList.addItem(_if+', '+this.interfaces[_if][0].address+'/'+(new ipCalc()).mask2CIDR(this.interfaces[_if][0].netmask));
    }
    return this;
  }
  /**
   * Pobiera layout z pliku config/layout.js.
   * @method
   * @return {Object} Obiekt typu layout z modułu blessed.
   */
  getLayout() {
    return require('../config/layout.js');
  }
  setupLayout() {
    var self = this;
    self.layout.interfacesList.on('select', function(event) {
      self.config.drblConfig = {};
      self.config.interface = event.content.split(',')[0];
      self.config.drblConfig[self.config.interface] = {interface: self.config.interface};
      self.layout.macGroupList.focus();
    });
    self.layout.macGroupList.on('select', function(event) {
      self.config.room = event.content.split('/')[0];
      self.config.group = event.content.split('/')[1];
      self.layout.form.focus();
      self.layout.initial.focus();
    });
    self.layout.form.on('submit', function() {
      self.layout.screen.destroy();
      self.parseConfig();
    });
    self.layout.interfacesList.focus();
    self.layout.screen.render();
  }
  /**
   * Pobiera layout z pliku {@link config/layout.js}.
   * @method
   */
  parseConfig() {
    if(isNaN(this.layout.initial.value) || this.layout.initial.value==='') {
      this.config.drblConfig[this.config.interface]['ip_start'] = -1;
    } else {
      this.config.drblConfig[this.config.interface]['ip_start'] = Number(this.layout.initial.value);
    }
    this.config.drblConfig[this.config.interface].mac = path.resolve(this.config.macFolder+'/'+this.config.room+'/'+this.config.group);
    this.writeConfig(this.config.drblConfig);
  }
  /**
   * Zapisuje ustawienia do pliku konfiguracyjnego DRBL (domyślnie drblpush.conf).
   * @param {Object} drblConfig Obiekt zawierający ustawienia drblpush. Struktura ustawień jest wygląda identycznie jak w pliku drblpush.conf.
   * @method
   */
  writeConfig(drblConfig) {
    let drblpushConfig = ini.parse(fs.readFileSync(this.config.drblpush, 'utf-8'));
    for(let section in drblConfig) {
      for(let property in drblConfig[section]) {
        drblpushConfig[section][property] = drblConfig[section][property];
      }
    }
    fs.writeFileSync(this.config.drblpush, ini.encode(drblpushConfig));
    console.log(lang.file.savedSuccessfully.format(this.config.drblpush));
    const util = require('util');
    var exec = require('child_process').exec;
    exec('yes | drblpush -c /etc/drbl/drblpush.conf', function(error, stdout, stderr) {
      console.log(stdout);
      if(stderr) {
        console.log(stderr);
      }
    });
  }
  /**
   * Główna metoda odpowiadająca za odpowiednie wywołania zbierania adresów MAC, interfejsów oraz ustawienie layoutu.
   * @method
   */
  init() {
    for(let _if in this.interfaces) {
      layout.interfacesList.addItem()
    }
    this.assignMacList();
    this.assignInterfaces();
    this.setupLayout();
  }
}
module.exports = drblMacSelector;
