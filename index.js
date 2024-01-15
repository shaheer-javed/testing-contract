const express = require("express");
const bodyParser = require("body-parser");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Set up home route
app.get("/", (req, res) => {
  res.send("This is the homepage");
});

app.post("/", async (req, res) => {
  const postData = req.body;

  console.log(postData);
  let pdf = await createPdf(postData);

  console.log(pdf);

  res.send(pdf);
});

async function createPdf(postData) {
  const {
    sellerlegalName,
    sellerAddress,
    sellerEmail,
    sellerPhoneNumber,
    sellerContractDescription,
    buyerlegalName,
    buyerEmail,
    buyerPhoneNumber,
    buyerAddress,
    offer_price,
    offer_idea_title,
  } = postData;
  const pdfUrl =
    "http://res.cloudinary.com/dg9sk9vwq/raw/upload/v1704881641/pxrhssqn189jgogwrjdf.pdf";
  const formPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const size = 12;

  let page = pdfDoc.getPage(0);
  const { width, height } = page.getSize();
  console.log(width);
  console.log(height);

  const buyer_name = buyerlegalName;
  const buyer_email = buyerEmail;
  const buyer_phone = buyerPhoneNumber;
  const buyer_address = buyerAddress;

  const seller_name = sellerlegalName;
  const seller_email = sellerEmail;
  const seller_phone = sellerPhoneNumber;
  const seller_address = sellerAddress;

  const date = new Date().toDateString();

  const idea_title = offer_idea_title;
  const purchase_price = `${offer_price} USD`;

  const description =
    "The method accepts three parameters as mentioned above and described below. The method accepts three parameters as mentioned above and described below. The method accepts three parameters as mentioned above and described below. The method accepts three parameters as mentioned above and described belowThe method accepts three parameters as mentioned above and described below. The method accepts three parameters as mentioned above and described .";

  // Buyer Info
  page.drawText(buyer_name, {
    x: 72,
    y: 620,
    size,
    font: helveticaFont,
  });
  page.drawText(buyer_email, {
    x: 72,
    y: 604,
    size,
    font: helveticaFont,
  });
  page.drawText(buyer_phone, {
    x: 72,
    y: 588,
    size,
    font: helveticaFont,
  });
  page.drawText(buyer_address, {
    x: 72,
    y: 572,
    size,
    font: helveticaFont,
  });

  // Seller Info
  page.drawText(seller_name, {
    x: 72,
    y: 510,
    size,
    font: helveticaFont,
  });
  page.drawText(seller_email, {
    x: 72,
    y: 494,
    size,
    font: helveticaFont,
  });
  page.drawText(seller_phone, {
    x: 72,
    y: 478,
    size,
    font: helveticaFont,
  });
  page.drawText(seller_address, {
    x: 72,
    y: 462,
    size,
    font: helveticaFont,
  });

  // Idea Info
  page.drawText(idea_title, {
    x: 130,
    y: 415,
    size,
    font: helveticaFont,
  });
  page.drawText(purchase_price, {
    x: 175,
    y: 399,
    size,
    font: helveticaFont,
  });

  // Description

  addParagraphToPdf(sellerContractDescription, helveticaFont, page);

  // Signature Section
  page.drawText(buyer_name, {
    x: 72,
    y: 96,
    size,
    font: helveticaFont,
  });
  page.drawText(date, {
    x: 72,
    y: 80,
    size,
    font: helveticaFont,
  });
  page.drawText(seller_name, {
    x: 398,
    y: 96,
    size,
    font: helveticaFont,
  });
  page.drawText(date, {
    x: 398,
    y: 80,
    size,
    font: helveticaFont,
  });

  const pdfBytes = await pdfDoc.save();
  let res = uploadToClouinary(pdfBytes);
  return res;
}

function addParagraphToPdf(longText, font, page) {
  const size = 12;
  const textColor = rgb(0, 0, 0);

  // Set starting position
  const x = 72;
  let y = 243;

  const maxLineWidth = 500; // Adjust for margins

  // Manually implement word wrapping
  const words = longText.split(" ");
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine + " " + word;
    const width = font.widthOfTextAtSize(testLine, size);

    if (width < maxLineWidth) {
      currentLine = testLine;
    } else {
      page.drawText(currentLine, { x, y, font, size, color: textColor });
      y -= size + 2; // Adjust for line spacing
      currentLine = word;
    }
  }

  // Draw the last line
  if (currentLine.trim() !== "") {
    page.drawText(currentLine, { x, y, font, size, color: textColor });
  }
}

async function uploadToClouinary(modifiedPdfBytes) {
  const data = new FormData();
  data.append(
    "file",
    new Blob([modifiedPdfBytes], { type: "application/pdf" })
  );
  data.append("upload_preset", "muse_upload_contract");
  data.append("cloud_name", "dg9sk9vwq");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dg9sk9vwq/raw/upload",
    {
      method: "POST",
      body: data,
    }
  );
  const responseData = await response.json();
  console.log(responseData.url);
  return responseData.url;
}

app.listen(port, () => {
  console.log(`Success! Your application is running on  localhost${port}.`);
});
