<p align="center"><a href="https://nodei.co/npm/csy.db"><img src="https://nodei.co/npm/csy.db.png"></a></p>

<p align="center"><img src="https://img.shields.io/npm/v/csy.db?style=for-the-badge"> <img src="https://img.shields.io/github/repo-size/CsYBot/csy.db-npm?style=for-the-badge"> <img src="https://img.shields.io/npm/l/csy.db?style=for-the-badge"> <img src="https://img.shields.io/npm/dt/csy.db?style=for-the-badge"> <img src="https://img.shields.io/github/contributors/CsYBot/csy.db-npm?style=for-the-badge"> <a href="https://discord.gg/gkmwaAZQBu" target="_blank"> <img alt="Discord" src="https://img.shields.io/badge/CsYBot%20Support-Click%20here-7289d9?style=for-the-badge&logo=discord"> </a></p>

# csy.db

**Examples:**
```js
const db = require("csy.db");

// Data Set | Get | Add
db.set("KEY", "DATA"); // Change Data And Result Data
db.get("KEY"); // Result Data
db.add("KEY"); // Change Data And Result Data
db.fetch("KEY"); // Result Data

// Data All

db.all("OPTIONAL MAX DATAS NUMBER"); // All Datas

// Data exists

db.has("KEY"); // True/False

// Data Count

db.size(); // All Data Size

// How do i change the location of data?
// Edit the (csydb.config.json) file that occurs after startup.
```

**Multiple Data**
```js
const csydb = require("csy.db");
const db = new csydb.create("datas.json", 0); // ({PATH}, {MAXDATALIMIT})
```

<br>

For Support Join Server: https://discord.gg/gkmwaAZQBu
