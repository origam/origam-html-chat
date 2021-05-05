/*
Copyright 2005 - 2021 Advantage Solutions, s. r. o.

This file is part of ORIGAM (http://www.origam.org).

ORIGAM is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

ORIGAM is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with ORIGAM. If not, see <http://www.gnu.org/licenses/>.
*/

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
