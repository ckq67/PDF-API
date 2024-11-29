const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");

const app = express();
app.use(express.json());

app.post("/generate-pdf", async (req, res) => {
  try {
    console.log("Launching Puppeteer...");

    const chromiumPath =
      "/opt/render/.cache/puppeteer/chrome/linux-131.0.6778.85/chrome-linux64/chrome";
    console.log("Checking Chromium executable path...");
    if (fs.existsSync(chromiumPath)) {
      console.log("Chromium found at:", chromiumPath);
    } else {
      console.error("Chromium NOT found at:", chromiumPath);
    }

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

    console.log("Puppeteer launched successfully!");

    const page = await browser.newPage();
    console.log("New page created.");

    const htmlContent = `
      <html>
      <head>
        <title>Sample PDF</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
        </style>
      </head>
      <body>
        <h1>Hello from Puppeteer on Render!</h1>
      </body>
      </html>
    `;
    console.log("Setting content...");
    await page.setContent(htmlContent, { waitUntil: "load" });

    console.log("Generating PDF...");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    console.log("PDF generated successfully!");

    await browser.close();
    console.log("Browser closed.");

    const base64Pdf = pdfBuffer.toString("base64");
    console.log("Sending PDF as Base64...");
    res.status(200).json({ base64Pdf });
  } catch (error) {
    console.error("Error during PDF generation:", error.message);
    console.error("Stack Trace:", error.stack);
    res.status(500).send("Failed to generate PDF.");
  }
});

const PORT = process.env.PORT || 10001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
