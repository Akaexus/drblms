'use strict';
const blessed = require('blessed');
const process = require('process');

/**
  * @fileOverview Definicja layoutu dla modułu blessed oraz key events.
  * @requires blessed
  * @requires process
  * @version 0.0.1
  */

/**
 * @namespace layout
 */
let layout = {
  screen: blessed.screen(),
  title: blessed.box({
    top: '5%',
    left: 'center',
    width: '90%',
    height: '20%',
    content: '{center}Clonezilla Server!\nWybierz interfejs oraz grupe komputerow:{/center}',
    tags: true,
    valign: 'middle',
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'black',
    }
  }),
  macGroupList: blessed.list({
    top: '25%',
    left: '50%',
    width: '45%',
    height: '60%',
    valign: 'middle',
    tags: true,
    interactive: true,
    keys: true,
    mouse: true,
    border: {
      type: 'line'
    },
    style: {
      selected: {
        fg: 'black',
        bg: 'white',
      },
      fg: 'white',
      bg: 'black',
    }
  }),
  interfacesList: blessed.list({
    top: '25%',
    left: '5%',
    width: '45%',
    height: '60%',
    valign: 'middle',
    tags: true,
    interactive: true,
    keys: true,
    mouse: true,
    border: {
      type: 'line'
    },
    style: {
      selected: {
        fg: 'black',
        bg: 'white',
      },
      fg: 'white',
      bg: 'black',
    }
  }),
};

layout.form = blessed.form({
  content: 'Initial number:',
  valign: 'middle',
  parent: layout.screen,
  mouse: true,
  keys: true,
  vi: true,
  left: 'center',
  top: '85%',
  height: '15%',
  width: '90%',
  border: 'line',
  style: {
    bg: 'black',
    fg: 'white'
  }
})

layout.initial = blessed.textbox({
  parent: layout.form,
  mouse: true,
  keys: true,
  vi: true,
  style: {
    bg: 'white',
    fg: 'black'
  },
  height: 1,
  width: 20,
  left: 'center',
  top: 'center',
  name: 'initial'
});

layout.submit = blessed.button({
  parent: layout.form,
  mouse: true,
  keys: true,
  shrink: true,
  right: 1,
  top: 0,
  shrink: true,
  name: 'submit',
  content: 'OKEY',
  padding: {
    left: 1,
    right: 1
  },
  style: {
    bg: 'white',
    fg: 'black',
    focus: {
      bg: 'red',
      fg: 'white',
      bold: true
    }
  }
});

layout.exit = blessed.button({
  parent: layout.form,
  mouse: true,
  keys: true,
  shrink: true,
  right: 1,
  bottom: 0,
  shrink: true,
  name: 'exit',
  content: 'EXIT',
  padding: {
    left: 1,
    right: 1
  },
  style: {
    bg: 'white',
    fg: 'black',
    focus: {
      bg: 'red',
      fg: 'white',
      bold: true,
    }
  }
});

layout.initial.on('focus', function() {
  layout.initial.readInput();
});

function exit() {
  process.exit(1);
}

layout.screen.key(['escape', 'q', 'C-c'], exit);
layout.exit.on('press', exit);
layout.initial.on('submit', function() {
  layout.form.submit();
});
layout.submit.on('press', function() {
  layout.form.submit();
});
layout.screen.append(layout.title);
layout.screen.append(layout.macGroupList);
layout.screen.append(layout.interfacesList);
layout.screen.append(layout.form);
layout.form.submit();

module.exports = layout;
