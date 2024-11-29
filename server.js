const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Determine the environment
const IS_RENDER = process.env.RENDER === "true";
const PORT = IS_RENDER ? 10001 : 3000;

app.post("/generate-pdf", async (req, res) => {
  try {
    console.log(
      `Launching Puppeteer in ${IS_RENDER ? "Render" : "local"} environment...`
    );

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    console.log("Setting minimal page content...");
    const { title } = req.body;
    const htmlContent = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
        </style>
      </head>
      <body>
        <h1>${title || "Hello, Puppeteer!"}</h1>
      </body>
      </html>
    `;
    await page.setContent(htmlContent, { waitUntil: "load" });

    console.log("Generating PDF...");
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    console.log("PDF generation successful!");

    await browser.close();

    // Convert PDF buffer to Base64
    const base64Pdf = pdfBuffer.toString("base64");
    res.status(200).json({ base64Pdf });
  } catch (error) {
    console.error("Error during PDF generation:", error);
    res.status(500).send("Failed to generate PDF.");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
