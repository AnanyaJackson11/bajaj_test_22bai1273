import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
// Helpful GETs for browser testing
app.get("/", (_req, res) => {
  res.status(200).json({
    message: "BFHL API is running. Use POST /bfhl with JSON body { data: [...] }"
  });
});

app.get("/bfhl", (_req, res) => {
  res.status(405).json({
    error: "Method Not Allowed. Use POST /bfhl with JSON body { data: [...] }"
  });
});


/**
 * Helpers
 */
const isNumericString = (s) => /^-?\d+$/.test(s);
const isAlphaString = (s) => /^[A-Za-z]+$/.test(s);
const isOnlySpecials = (s) => /^[^A-Za-z0-9]+$/.test(s);

function classifyData(dataArray) {
  const even_numbers = [];
  const odd_numbers = [];
  const alphabets = [];
  const special_characters = [];
  let sum = 0;

  // Collect all alphabetic characters in order of appearance
  const alphaChars = [];

  for (let raw of dataArray) {
    // Force everything to string (examples show inputs as strings, but let's be safe)
    const item = String(raw);

    // Build alphaChars for any alphabet letters present in this token
    for (const ch of item) {
      if (/[A-Za-z]/.test(ch)) {
        alphaChars.push(ch);
      }
    }

    if (isNumericString(item)) {
      // classify as number (return numbers as strings)
      const n = parseInt(item, 10);
      if (n % 2 === 0) {
        even_numbers.push(item);
      } else {
        odd_numbers.push(item);
      }
      sum += n;
    } else if (isAlphaString(item)) {
      alphabets.push(item.toUpperCase());
    } else if (isOnlySpecials(item)) {
      special_characters.push(item);
    } else {
      // Mixed tokens: treat as special characters per spec ambiguity
      special_characters.push(item);
    }
  }

  // Build concat_string: reverse order of all alphabetic chars, alternating caps starting Upper
  const reversed = alphaChars.reverse();
  const transformed = reversed.map((ch, idx) =>
    idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()
  );
  const concat_string = transformed.join("");

  return {
    even_numbers,
    odd_numbers,
    alphabets,
    special_characters,
    sum: String(sum),
    concat_string,
  };
}

function makeUserId() {
  const fullName = process.env.FULL_NAME || "john doe"; // will be lowercased
  const dob = process.env.DOB_DDMMYYYY || "17091999"; // ddmmyyyy
  const normalized = fullName.trim().toLowerCase().replace(/\s+/g, "_");
  return `${normalized}_${dob}`;
}

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body || {};
    if (!Array.isArray(data)) {
      return res.status(200).json({
        is_success: false,
        user_id: makeUserId(),
        email: process.env.EMAIL || "john@xyz.com",
        roll_number: process.env.ROLL_NUMBER || "ABCD123",
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: "",
        error: "Invalid payload: body must be { data: [...] }",
      });
    }

    const result = classifyData(data);

    return res.status(200).json({
      is_success: true,
      user_id: makeUserId(),
      email: process.env.EMAIL || "john@xyz.com",
      roll_number: process.env.ROLL_NUMBER || "ABCD123",
      odd_numbers: result.odd_numbers,
      even_numbers: result.even_numbers,
      alphabets: result.alphabets,
      special_characters: result.special_characters,
      sum: result.sum,
      concat_string: result.concat_string,
    });
  } catch (err) {
    return res.status(200).json({
      is_success: false,
      user_id: makeUserId(),
      email: process.env.EMAIL || "john@xyz.com",
      roll_number: process.env.ROLL_NUMBER || "ABCD123",
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error: err?.message || "Unknown error",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BFHL API listening on http://localhost:${PORT}/bfhl`);
});
