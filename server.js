const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/generate-pdf", async (req, res) => {
  try {
    console.log("Launching Puppeteer...");
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
    const htmlContent = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
        </style>
      </head>
      <body>
        <h1>Hello, Puppeteer!</h1>
      </body>
      </html>
    `;
    await page.setContent(htmlContent, { waitUntil: "load" });

    console.log("Generating PDF...");
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    console.log("PDF generation successful!");

    await browser.close();

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="test.pdf"');
    res.setHeader("Content-Length", pdfBuffer.length);

    // Send the PDF data as the response
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error during PDF generation:", error);
    res.status(500).send("An error occurred while generating the PDF.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
