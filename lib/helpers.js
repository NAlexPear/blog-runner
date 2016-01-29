'use strict'

const fs = require('fs');

module.exports = {
  
  //async file reader
  reader(path, callback){
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) throw err;
      callback(data);
    });
  }

}
