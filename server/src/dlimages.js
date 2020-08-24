const fs = require("fs").promises;
const axios = require("axios");

async function main() {
  for (let i = 1; i <= 70; i++) {
    const url = `https://i.pravatar.cc/35?img=${i}`;
    console.log("Getting", url);
    const img = await axios.get(url, { responseType: "arraybuffer" });
    //console.log(img.data);
    await fs.writeFile(`./public/img/avatar-35/avatar-${String(i).padStart(3, "0")}.jpg`, img.data, "binary");
  }

  for (let i = 1; i <= 70; i++) {
    const url = `https://i.pravatar.cc/300?img=${i}`;
    console.log("Getting", url);
    const img = await axios.get(url, { responseType: "arraybuffer" });
    //console.log(img.data);
    await fs.writeFile(`./public/img/avatar-300/avatar-${String(i).padStart(3, "0")}.jpg`, img.data, "binary");
  }
}

main();
