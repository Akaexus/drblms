'use strict';
const utils = require('./utils.js');

/** @version 0.2.0
  * @fileOverview Moduł do wygodnego przeprowadzania adresacji IP w wersji 4.
  * @module ipCalc
  * @example
  * const ipCalc = require('./libs/ipCalc.js');
  * var ip = new ipCalc('10.0.21.37', '255.0.0.0');
  * console.log(ip.info());
  *
  * // { address: [ 10, 0, 0, 0 ],
  * //   cidr: 8,
  * //   mask: [ 255, 0, 0, 0 ],
  * //   networkAddress: [ 10, 0, 0, 0 ],
  * //   broadcastAddress: [ 10, 255, 255, 255 ],
  * //   numberOfHosts: 16777214 }
  */

/**
  * Tablica 4-elementowa zawierająca oktety adresu IP.
  * @typedef {number[]} ipArray
  */

/**
  * String zawierający adres IP w formacie x.x.x.x.
  * @typedef {string} ipString
  */

/**
  * Adres IP wraz z maską w formacie 'a.b.c.d/mm'.-
  * @typedef {number[]} ipCombined
  */

/**
  * Tablica 4-elementowa zawierająca oktety maski podsieci.
  * @typedef {number[]} maskArray
  */

/**
  * String zawierający adres maski podsieci w formacie x.x.x.x.
  * @typedef {string} maskString
  */

/**
  * Maska adresu IP w formacie CIDR xx lub '/xx'.
  * @typedef {number|string} CIDR
  */

/**
 * Obiekt zawierający wszystkie dostępne informacje na temat wskazanego adresu IP.
 * @typedef {Object} ipInfo
 * @property {module:ipCalc~ipArray} address Adres IP w postaci tablicy oktetów.
 * @property {module:ipCalc~CIDR} cidr Maska podsieci w formacie CIDR.
 * @property {module:ipCalc~maskArray} mask Maska podsieci w postaci tablicy oktetów.
 * @property {module:ipCalc~ipArray} networkAddress Adres podsieci w postaci tablicy oktetów.
 * @property {module:ipCalc~ipArray} broadcastAddress Adres broadcast w postaci tablicy oktetów.
 * @property {number} numberOfHosts Liczba hostów możliwych do zaadresowania w podsieci.
 */

/**
 * Obiekt zawierający wszystkie dostępne informacje na temat wskazanego adresu IP.
 * @typedef {Object} subnetsInfo
 * @property {module:ipCalc~CIDR} subnetCIDR Adres IP w postaci {@link module:ipCalc~CIDR}.
 * @property {module:ipCalc~maskArray} subnetMask Adres IP w postaci {@link module:ipCalc~maskArray}.
 * @property {number} usedSubnets Liczba wykorzystanych podsieci.
 * @property {number} unusedSubnets Liczba niewykorzystanych podsieci.
 * @property {number} numberOfHostsInSubnet Liczba użytecznych adresów IP w podsieci.
 * @property {module:ipCalc~ipArray[]} subnets Tablica z adresami podsieci ({@link module:ipCalc~ipArray}).
 */

/**
  * @class
  * @classdesc Klasa pozwalająca na przeprowadzanie operacji na adresacji IPv4.
  * @example
  * const ipCalc = require('./libs/ipCalc.js');
  * var ip = new ipCalc('10.0.21.37', '255.0.0.0');
  * console.log(ip.info());
  *
  * // { address: [ 10, 0, 0, 0 ],
  * //   cidr: 8,
  * //   mask: [ 255, 0, 0, 0 ],
  * //   networkAddress: [ 10, 0, 0, 0 ],
  * //   broadcastAddress: [ 10, 255, 255, 255 ],
  * //   numberOfHosts: 16777214 }
  */
class IPv4 {
/**
 * Sprawdza poprawność przesłanego adresu IP oraz maski podsieci i w razie poprawnej weryfikacji zapisuje je w polu klasy.
 * @constructor
 * @param {module:ipCalc~ipArray|module:ipCalc~ipString} ip Adres ip.
 * @param {module:ipCalc~maskArray|module:ipCalc~maskString|module:ipCalc~CIDR} mask Maska adresu IP.
 */
  constructor(address, mask) {
    if(arguments.length == 0) {
      this.address = Array(4).fill(0);
      this.mask = Array(4).fill(0);
    } else if(arguments.length == 1) {
      this.mask = this.any2MaskArray(address);
      this.address = this.any2IPArray(address);
    } else {
      this.mask = this.any2MaskArray(mask);
      this.address = this.any2IPArray(address);
    }
  }

  /**
   * any2IPArray - Konwertuje adres IP do postaci 4-elementowej tablicy oktetów ({@link {module:ipCalc~ipArray}). W przypadku niepoprawnego adresu IP metoda zwraca false.
   *
   * @param  {module:ipCalc~ipArray|module:ipCalc~ipString|module:ipCalc~ipCombined} ip Adres IP w formacie 'x.x.x.x', 'a.b.c.d/mm' lub jako 4-elementowa tablica oktetów.
   * @return {module:ipCalc~ipArray} Adres IP.
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc('10.0.21.37', '255.0.0.0');
   * ip.any2IPArray();           // [10, 0, 21, 37]
   * ip.any2IPArray().join('.'); // '10.0.21.37'
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc();
   * ip.any2IPArray('10.0.21.37');    // [10, 0, 21, 37]
   * ip.any2IPArray('10.0.21.37/24'); // [10, 0, 21, 37]
   * ip.any2IPArray([10, 0, 21, 37]); // [10, 0, 21, 37]
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc('10.0.21.256', '255.0.0.0'); //niepoprawny adres IP
   * ip.any2IPArray(); //false
   */
  any2IPArray(ip) {
    if((typeof ip == 'string' || ip instanceof String) && (ip.match(/\/\d{0,2}/) || ip.match(/(\d{1,3}\.){3}(\d{1,3})\/\d{1,2}/))) {
      ip = ip.split('/')[0];
    }
    if(String(ip).replace(' ', '').replace(',', '.').match(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/g)) {
      ip = String(ip).replace(' ', '').replace(',', '.').split('.', 4);
    }
    if(Array.isArray(ip)) {
      if(ip.length<4) {
        ip = ip.slice(0, 4);
      } else {
        while(ip.length<4) {
          ip.push(0);
        }
      }
    } else {
      return false;
    }
    return ip.map(function(oct) {
      if(!isNaN(Number(oct))) {
        oct = Number(oct);
        if(oct<0) {
          return 0;
        } else if(oct>255) {
          return 255;
        }
        return oct;
      }
      return 0;
    });
  }

  /**
   * CIDR2MaskArray - Konwertuje maske podsieci zapisaną w formacie CIDR do 4-elementowej tablicy oktetów adresu maski.
   *
   * @param  {module:ipCalc~CIDR} cidr      Maska podsieci zapisana w formacie CIDR.
   * @return {module:ipCalc~maskArray}      Maska podsieci zapisana w formacie 4-elementowej tablicy oktetów.
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc();
   * ip.CIDR2MaskArray(12); //[255, 240, 0, 0]
   */

  CIDR2MaskArray(cidr) {
    var mask = [0, 0, 0, 0];
    for(var i=1, tempmask = cidr; i<=32; i++, tempmask--) {
      if(tempmask>0) {
        mask[parseInt((i-1)/8)]+=Math.pow(2, 8-(i%8 || 8));
      }
    }
    return mask;
  }
  // TODO: Poprawić to
  /**
   * Weryfikuje maskę sieciową i zwraca false w przypadku wykrycia błędu.
   *
   * @param  {module:ipCalc~maskArray} maskArray Maska sieciowa w formacie {@link module:ipCalc~maskArray}.
   * @return {boolean}           description
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc();
   * ip.validateMaskArray([255, 240, 0, 0]); //true
   * ip.validateMaskArray([255, 0, 255, 0]); //false
   * ip.validateMaskArray([255, 255, 253, 0]); //false
   */
  valiadeMaskArray(maskArray) {
    var bitMask = maskArray.map(function(oct) {
      var bitOct = '0000000'+oct.toString(2);
      return bitOct.slice(-8);
    }).join('');
    var nof0 = utils.countCharOccurences(bitMask, '0'),
        nof1 = utils.countCharOccurences(bitMask, '1');
        return ('1'.repeat(nof1)+'0'.repeat(nof0)) === bitMask;
  }


  /**
   * any2MaskArray - konwertuje adres maski sieciowej w dowolnej postaci do formatu {@link module:ipCalc~maskArray}.
   *
   * @param  {module:ipCalc~maskArray|module:ipCalc~maskString|module:ipCalc~ipCombined|module:ipCalc~CIDR} mask Maska sieciowa w dowolnym formacie.
   * @return {module:ipCalc~maskArray} Przekonwertowana maska sieciowa w postaci {@link module:ipCalc~maskArray}.
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc('10.0.21.37', '255.0.0.0');
   * ip.any2MaskArray();                // [255, 0, 0, 0]
   * ip.any2MaskArrayy().join('.');     // '255.0.0.0'
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc();
   * ip.any2MaskArray('255.0.0.0');     // [255, 0, 0, 0]
   * ip.any2MaskArray('10.0.21.37/24'); // [255, 255, 255, 0]
   * ip.any2MaskArray(24);              // [255, 255, 255, 0]
   * ip.any2MaskArray('/24');           // [255, 255, 255, 0]
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc();
   * ip.any2MaskArray('192.168.1.1');   //false
   */
  any2MaskArray(mask) {
    //CIDR
    if((typeof mask == 'string' || mask instanceof String) && (mask.match(/\/\d{0,2}/) || mask.match(/(\d{1,3}\.){3}(\d{1,3})\/\d{1,2}/))) {
      mask = mask.split('/')[1];
    }
    if(!isNaN(Number(mask))) {
      mask = Number(mask);
      if(mask<0) {
        return this.CIDR2MaskArray(0);
      } else if(mask>32) {
        return this.CIDR2MaskArray(32);
      } else {
        return this.CIDR2MaskArray(mask);
      }
    }
    var ipMask = this.any2IPArray(mask);
    if(ipMask && this.valiadeMaskArray(ipMask)) {
      return ipMask;
    }
    return false;
  }

  /**
   * mask2CIDR - Konwertuje adres maski sieciowej ({@link module:ipCalc~maskArray}) do formatu {@link module:ipCalc~CIDR}.
   *
   * @param  {module:ipCalc~maskArray} mask Maska sieciowa.
   * @return {module:ipCalc~CIDR} Maska sieciowa w formacie CIDR.
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc();
   * ip.any2MaskArray([255, 255, 255, 255]); // 32
   * ip.any2MaskArray('255.255.192.0');      // 18
   * ip.any2MaskArray('192.168.1.1/24');     // 24
   * ip.any2MaskArray('/24');                // 24
   * ip.any2MaskArray('24');                 // 24
   */
  mask2CIDR(mask) {
    mask = this.any2MaskArray(mask) || this.any2MaskArray(this.mask);
    if(mask==-1) {
      return {error: true};
    }
    var cidr = 0;
    for(var oct of mask) {
      if(oct) {
        cidr += oct.toString(2).split('').reduce(function(a,b){ return +a+ +b; });
      }
    }
    return cidr;
  }

  /**
   * Wylicza adres podsieci z podanego adresu IP oraz maski sieciowej.
   *
   * @param  {module:ipCalc~ipArray|module:ipCalc~ipString|module:ipCalc~ipCombined} address Adres IP.
   * @param  {module:ipCalc~maskArray|module:ipCalc~maskString|module:ipCalc~ipCombined|module:ipCalc~CIDR} mask    Maska podsieci.
   * @return {module:ipCalc~ipArray}        Adres podsieci.
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc();
   * ip.networkAddress('192.168.1.88', '255.255.255.0')       // [192, 168, 1, 0]
   * ip.networkAddress('192.168.1.88', [255, 255, 255, 0])    // [192, 168, 1, 0]
   * ip.networkAddress([192, 168, 1, 88], '255.255.255.0')    // [192, 168, 1, 0]
   * ip.networkAddress([192, 168, 1, 88], [255, 255, 255, 0]) // [192, 168, 1, 0]
   * ip.networkAddress([192, 168, 1, 88], 24)                 // [192, 168, 1, 0]
   * ip.networkAddress([192, 168, 1, 88], '/24')              // [192, 168, 1, 0]
   * ip.networkAddress('1992.168.1.1/24')                     // [192, 168, 1, 0]
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc('192.168.1.88/24');
   * ip.networkAddress()                                      // [192, 168, 1, 0]
   */
  networkAddress(address, mask) {
    if(arguments.length==1) {
      mask = this.any2MaskArray(address);
      address = this.any2IPArray(address);
    } else if(arguments.length==0) {
      mask = this.mask;
      address = this.address;
    } else {
      mask = this.any2MaskArray(mask);
      address = this.any2IPArray(address);
    }
    for(var i=0; i<address.length; i++) {
      address[i] = address[i] & mask[i];
    }
    return address;
  }
  /**
   * Wylicza adres rozgłoszeniowy z podanego adresu IP oraz maski sieciowej.
   *
   * @param  {module:ipCalc~ipArray|module:ipCalc~ipString|module:ipCalc~ipCombined} address Adres IP.
   * @param  {module:ipCalc~maskArray|module:ipCalc~maskString|module:ipCalc~ipCombined|module:ipCalc~CIDR} mask    Maska podsieci.
   * @return {module:ipCalc~ipArray}        Adres rozgłoszeniowy.
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc();
   * ip.broadcastAddress('192.168.1.88', '255.255.255.0')       // [192, 168, 1, 255]
   * ip.broadcastAddress('192.168.1.88', [255, 255, 255, 0])    // [192, 168, 1, 255]
   * ip.broadcastAddress([192, 168, 1, 88], '255.255.255.0')    // [192, 168, 1, 255]
   * ip.broadcastAddress([192, 168, 1, 88], [255, 255, 255, 0]) // [192, 168, 1, 255]
   * ip.broadcastAddress([192, 168, 1, 88], 24)                 // [192, 168, 1, 255]
   * ip.broadcastAddress([192, 168, 1, 88], '/24')              // [192, 168, 1, 255]
   * ip.broadcastAddress('1992.168.1.1/24')                     // [192, 168, 1, 255]
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc('192.168.1.88/24');
   * ip.broadcastAddress()                                      // [192, 168, 1, 255]
   */
  broadcastAddress(address, mask) {
    if(arguments.length==1) {
      mask = this.any2MaskArray(address);
      address = this.any2IPArray(address);
    } else if(arguments.length==0) {
      mask = this.mask;
      address = this.address;
    }
    var networkAddress = this.networkAddress(address, mask);
    var broadcastAddress = [0, 0, 0, 0].map((item, index, array)=> {
      return networkAddress[index]+255-mask[index];
    });
    return broadcastAddress;
  }

  /**
   * Wylicza liczbę użytecznych adresów (możliwych do przypisania hostom) w sieci.
   *
   * @param  {module:ipCalc~maskArray|module:ipCalc~maskString|module:ipCalc~ipCombined|module:ipCalc~CIDR} mask Maska sieciowa.
   * @return {number}      Liczba użytecznych adresów w sieci.
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc();
   * ip.numberOfHosts('255.255.255.0')    //254
   * ip.numberOfHosts([255, 255, 255, 0]) //254
   * ip.numberOfHosts('/24')              //254
   * ip.numberOfHosts(24)                 //254
   */
  numberOfHosts(mask) {
    if(typeof mask == 'undefined') {
      mask = this.mask;
    }
    return Math.pow(2, 32-this.mask2CIDR(this.any2MaskArray(mask)))-2;
  }

  /**
   * getSubnets - zwraca obiekt {@link module:ipCalc~subnetsInfo} z adresami podsieci.
   *
   * @param  {module:ipCalc~ipArray|module:ipCalc~ipString|module:ipCalc~ipCombined} address         Adres IP.
   * @param  {module:ipCalc~maskArray|module:ipCalc~maskString|module:ipCalc~ipCombined|module:ipCalc~CIDR} Maska podsieci.            description
   * @param  {number} numberOfSubnets Liczba podsieci.
   * @return {module:ipCalc~subnetsInfo} Obiekt z tablicą podsieci.
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc('172.16.0.0/12');
   * console.log(ip.getSubnets(7));
   * // { subnetCIDR: 15,
   * //   subnetMask: [ 255, 254, 0, 0 ],
   * //   usedSubnets: 7,
   * //   unusedSubnets: 1,
   * //   numberOfHostsInSubnet: 131070,
   * //   subnets:
   * //    [ [ 172, 16, 0, 0 ],
   * //      [ 172, 18, 0, 0 ],
   * //      [ 172, 20, 0, 0 ],
   * //      [ 172, 22, 0, 0 ],
   * //      [ 172, 24, 0, 0 ],
   * //      [ 172, 26, 0, 0 ],
   * //      [ 172, 28, 0, 0 ] ] }
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc('192.168.1.1/24');
   * console.log(ip.getSubnets(1337)); //false
   * // nie można utworzyć 1337 sieci przy masce /24
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc();
   * console.log(ip.getSubnets('172.16.0.0/12', 3));
   * // { subnetCIDR: 14,
   * //   subnetMask: [ 255, 252, 0, 0 ],
   * //   usedSubnets: 3,
   * //   unusedSubnets: 1,
   * //   numberOfHostsInSubnet: 262142,
   * //   subnets: [ [ 172, 16, 0, 0 ], [ 172, 20, 0, 0 ], [ 172, 24, 0, 0 ] ] }

   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc();
   * console.log(ip.getSubnets('172.16.0.0', '255.240.0.0', 7));
   * // { subnetCIDR: 15,
   * //   subnetMask: [ 255, 254, 0, 0 ],
   * //   usedSubnets: 7,
   * //   unusedSubnets: 1,
   * //   numberOfHostsInSubnet: 131070,
   * //   subnets:
   * //    [ [ 172, 16, 0, 0 ],
   * //      [ 172, 18, 0, 0 ],
   * //      [ 172, 20, 0, 0 ],
   * //      [ 172, 22, 0, 0 ],
   * //      [ 172, 24, 0, 0 ],
   * //      [ 172, 26, 0, 0 ],
   * //      [ 172, 28, 0, 0 ] ] }
   */
  getSubnets(address, mask, numberOfSubnets) {
    if(arguments.length === 1) {//numberOfSubnets only
      numberOfSubnets = address;
      address = this.address;
      mask = this.mask;
    } else if(arguments.length === 2) {//combined address + numberOfSubnets
      numberOfSubnets = mask;
      mask = this.any2MaskArray(address);
      address = this.any2IPArray(address);
    } else if(arguments.length === 3) { //all arguments
      mask = this.any2MaskArray(mask);
      address = this.any2IPArray(address);
    }
    numberOfSubnets = Math.abs(numberOfSubnets);
    var temp = 0;
    while(Math.pow(2, temp)<numberOfSubnets) {
      temp++;
    }
    var newmask = this.mask2CIDR(mask)+temp;
    if(newmask>32) {
      return false;
    }
    var hop = Math.pow(2, newmask%8?8-newmask%8:0),
        oct = newmask<=8?0:(newmask<=16?1:(newmask<=24?2:3)),
        subnetsInfo = {
          subnetCIDR: newmask,
          subnetMask: this.any2MaskArray(newmask),
          usedSubnets: numberOfSubnets,
          unusedSubnets: Math.pow(2, temp)-numberOfSubnets,
          numberOfHostsInSubnet: this.numberOfHosts(newmask),
          subnets: [this.networkAddress(address, mask)]
        };
    for(var i=1; i<numberOfSubnets; i++) {
      var subnet = JSON.parse(JSON.stringify(subnetsInfo.subnets[i-1]));
      subnet[oct]+=hop;
      for(var j=3; j>0; j--) {
        if(subnet[j]==256) {
          subnet[j]=0;
          subnet[j-1]++;
        }
      }
      subnetsInfo.subnets.push(subnet);
    }
    return subnetsInfo;
  }

  /**
   * info - Zbiera informacje o adresacji przekazanej w konstuktorze i zwraca w postaci {@link module:ipCalc~ipInfo}.
   * @return {module:ipCalc~ipInfo}  Informacje o adresacji.
   * @example
   * const ipCalc = require('./libs/ipCalc.js');
   * var ip = new ipCalc('172.16.0.0/12');
   * console.log(ip.info());
   * // { address: [ 172, 16, 0, 0 ],
   * //   cidr: 12,
   * //   mask: [ 255, 240, 0, 0 ],
   * //   networkAddress: [ 172, 16, 0, 0 ],
   * //   broadcastAddress: [ 172, 31, 255, 255 ],
   * //   numberOfHosts: 1048574 }
   */
  info() {
    return {
      address: this.address,
      cidr: this.mask2CIDR(),
      mask: this.mask,
      networkAddress: this.networkAddress(),
      broadcastAddress: this.broadcastAddress(),
      numberOfHosts: this.numberOfHosts()
    }
  }
}

module.exports = IPv4;
