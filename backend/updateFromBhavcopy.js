const axios = require('axios');
const unzipper = require('unzipper');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const DB_PATH = path.join(__dirname, '../db.json');

function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

function getYesterdayDate() {
  const today = new Date();
  today.setDate(today.getDate() - 1);

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  return `${yyyy}${mm}${dd}`;
}


// async function downloadBhavcopy(date) {

// //   const date = getTodayDate();

//   const url = `https://archives.nseindia.com/content/cm/BhavCopy_NSE_CM_0_0_0_${date}_F_0000.csv.zip`;

//   console.log("Downloading:", url);

//   const response = await axios({
//     method: 'GET',
//     url: url,
//     responseType: 'stream',
//     headers: {
//         'User-Agent': 'Mozilla/5.0',
//         'Accept': 'application/zip',
//         'Referer': 'https://www.nseindia.com/',
//         'Origin': 'https://www.nseindia.com'
//     }
//   });

//   return response.data
//     .pipe(unzipper.ParseOne())
//     .pipe(csv());
// }

async function downloadBhavcopy(date) {

  const url = `https://archives.nseindia.com/content/cm/BhavCopy_NSE_CM_0_0_0_${date}_F_0000.csv.zip`;

  console.log("📥 Downloading:", url);

  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'arraybuffer',
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/zip',
      'Referer': 'https://www.nseindia.com/',
      'Origin': 'https://www.nseindia.com'
    }
  });

  const buffer = Buffer.from(response.data);
  console.log("✅ Downloaded", buffer.length, "bytes");

  const directory = await unzipper.Open.buffer(buffer);

  if (!directory.files.length) {
    throw new Error("ZIP file is empty");
  }

  const file = directory.files[0];
  console.log("📄 Extracted file:", file.path);

  // Use csv() with proper options
  return file.stream()
    .pipe(csv({
      skipComments: true,
      mapHeaders: ({ header }) => header.trim()  // Trim header whitespace
    }));
}


async function updatePrices(date) {

  return new Promise(async (resolve, reject) => {

    try {

      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
      const stocks = db.stocks;

      const bhavStream = await downloadBhavcopy(date);

      let rowCount = 0;

      const stockMap = {};
      stocks.forEach(s => stockMap[s.stockName] = s);

      bhavStream.on('data', (row) => {

        rowCount++;

        // NSE CSV uses abbreviated column names: TckrSymb, ClsPric
        const symbol = row.TckrSymb;
        const closePrice = parseFloat(row.ClsPric);

        if (!symbol || isNaN(closePrice)) {
          return;
        }

        let stock = stockMap[symbol];

        if (stock) {
          stock.currentPrice = closePrice;
        } else {
          stocks.push({
            id: stocks.length + 1,
            stockName: symbol,
            fullName: symbol,
            category: "Unknown",
            subCategory: "Unknown",
            currentPrice: closePrice,
            actualPrice: closePrice,
            market: "NSE"
          });
        }

      });

      bhavStream.on('end', () => {
        console.log("📊 Total rows processed:", rowCount);
        console.log("📦 Total stocks in DB:", stocks.length);

        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        console.log("✅ All prices updated successfully.");
        resolve();   // 🔥 Now API waits properly

      });

      bhavStream.on('error', (err) => {
        reject(err);
      });

    } catch (error) {
      reject(error);
    }

  });
}


module.exports = {
  updatePrices,
  getYesterdayDate
};


// Run daily at 6 PM
cron.schedule('0 18 * * *', () => {
  console.log("Running daily update...");
  updatePrices(getTodayDate());
});
