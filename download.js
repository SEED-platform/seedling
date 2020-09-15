const fs = require('fs');
const https = require('https');
const path = require('path');
const StreamZip = require('node-stream-zip');

const resourcesDir = path.resolve(__dirname, 'resources');
const pg12Dir = path.resolve(resourcesDir, 'pg12');
const pg12Bin = path.resolve(pg12Dir, 'bin');
const zipPath = path.resolve(resourcesDir, 'pg12.zip');


(async () => {
  if (!fs.existsSync(pg12Bin)) {
    if (!fs.existsSync(resourcesDir)) {
      fs.mkdirSync(resourcesDir);
    }
    let url;
    if (process.platform === 'win32') {
      url = 'https://nrel-seed.s3.us-east-1.amazonaws.com/dependencies/pg12-win.zip';
    } else if (process.platform === 'darwin') {
      url = 'https://nrel-seed.s3.us-east-1.amazonaws.com/dependencies/pg12-osx.zip';
    } else {
      throw new Error(`Unsupported Platform: ${process.platform}`);
    }

    await download(url);
    await extract(zipPath);
    fs.unlinkSync(zipPath);
  }
})();

async function download(url) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(pg12Dir)) {
      return resolve();
    }
    console.log('Downloading pg12...');
    const file = fs.createWriteStream(zipPath);
    https.get(url, response => {
      response.pipe(file);

      response.on('end', () => {
        resolve();
      });
    }).on('error', (err) => {
      reject(`Failed to download pg12: ${err.message}`);
    });
  });
}

async function extract(zipPath) {
  return new Promise((resolve, reject) => {
    console.log('Extracting pg12...');
    const zip = new StreamZip({
      file: zipPath,
      storeEntries: true
    });
    zip.on('error', err => {
      reject(`Zip error: ${err}`);
    });
    zip.on('ready', () => {
      fs.mkdirSync(pg12Dir);
      zip.extract(null, pg12Dir, err => {
        if (err) {
          return reject(`Extract error ${err}`);
        }
        zip.close();
        resolve();
      });
    });
  });
}
