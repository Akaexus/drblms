'use strict';
const util = require('util');

/**
  * @fileOverview Narzędzia wspomagające.
  * @version 0.0.1
  */

/** @namespace */
var utils = {
  /**
   * arraysEqual - zwraca wynik głębokiego porównania dwóch tablic.
   * @function
   * @param {array} a Tablica a.
   * @param {array} b Tablica b.
   * @returns {bool}
   * @example
   * var a = [21, [88, 21]];
   * var b = [21, [88, 21]];
   * var c = [21, [88, 37]];
   * utils.arraysEqual(a, b); //true
   * utils.arraysEqual(a, c); //false
 */
arraysEqual: function(a,b) {
    if (a instanceof Array && b instanceof Array) {
        if (a.length!=b.length) {
            return false;
          }
        for(var i=0; i<a.length; i++)
            if (!arraysEqual(a[i],b[i])) {
              return false;
            }
        return true;
    } else {
        return a==b;
    }
  },
  /**
   * countCharOccurences - zwraca liczbę wystąpień znaku w łańcuchu znaków.
   *
   * @param  {string} string Przeszukiwany łańcuch znaków.
   * @param  {string} char   Poszukiwany znak.
   * @return {number}        description
   * @example
   * utils.countCharOccurences('+[----->+++<]>+++.+++++++++.', '+'); //16
   */

  countCharOccurences: function(string, char) {
    var occurences = 0;
    for(var i=0; i<string.length; i++) {
      if(string[i]===char) {
        occurences++;
      }
    }
    return occurences;
  }
}

/**
 * String.prototype.format - Dodatkowa metoda do klasy String pozwalająca na formatowanie łańcuchów znaków w stylu printf().
 * @memberof utils
 * @return {type}  description
 */
String.prototype.format = function() {
  var args = Array.prototype.slice.call(arguments);
  args.splice(0, 0, String(this));
  return util.format.apply(null, args);
}


module.exports = utils;
