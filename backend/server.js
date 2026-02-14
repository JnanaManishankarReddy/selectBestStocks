const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { updatePrices, getYesterdayDate } = require('./updateFromBhavcopy');

const app = express();
app.use(cors());  // ✅ Enable CORS
app.set('etag', false);

const PORT = 5000;

const LAST_UPDATE_FILE = path.join(__dirname, 'lastUpdate.json');

app.get('/update-previous', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    try {

        const yesterday = getYesterdayDate();
        let count = 0;  

        // Check last update
        if (fs.existsSync(LAST_UPDATE_FILE)) {
            const data = JSON.parse(fs.readFileSync(LAST_UPDATE_FILE));

            if (data.date === yesterday) {
                count = data.count || 0;
                // if (count >= 5) {
                //     return res.json({ message: "Maximum 2 updates allowed today." });
                // }
            }
        }

        await updatePrices(yesterday);

        fs.writeFileSync(LAST_UPDATE_FILE, JSON.stringify({ date: yesterday, count: count + 1 }));

        res.json({ message: "Yesterday data updated successfully." });
    } catch (error) {
        console.error("Update failed:", error.message);
        res.status(500).json({ error: "Failed to update prices" });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
