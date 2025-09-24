// scraper.js
import axios from "axios";
import * as cheerio from "cheerio";

const scrapeBanks = async () => {
  const url = "https://www.theswiftcodes.com/nigeria/";

  // On ajoute un User-Agent pour que le site pense que c'est un navigateur
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  const $ = cheerio.load(data);

  const banks = [];

  // Vérifie le tableau
  $("table.swift tbody tr").each((i, el) => {
    const bankName = $(el).find("td").eq(0).text().trim();
    const city = $(el).find("td").eq(1).text().trim();
    const branch = $(el).find("td").eq(2).text().trim();
    const swiftCode = $(el).find("td").eq(3).text().trim();

    if (bankName) {
      banks.push({ bankName, city, branch, swiftCode });
    }
  });

  console.log("Nombre de banques trouvées:", banks.length);
  return banks;
};

export default scrapeBanks;
