// api/bfhl.js
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed. Use POST /bfhl with JSON body { data: [...] }",
    });
  }

  const isNumericString = (s) => /^-?\d+$/.test(s);
  const isAlphaString = (s) => /^[A-Za-z]+$/.test(s);
  const isOnlySpecials = (s) => /^[^A-Za-z0-9]+$/.test(s);

  function classifyData(dataArray) {
    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;

    const alphaChars = [];
    for (let raw of dataArray) {
      const item = String(raw);

      for (const ch of item) {
        if (/[A-Za-z]/.test(ch)) alphaChars.push(ch);
      }

      if (isNumericString(item)) {
        const n = parseInt(item, 10);
        (n % 2 === 0 ? even_numbers : odd_numbers).push(item);
        sum += n;
      } else if (isAlphaString(item)) {
        alphabets.push(item.toUpperCase());
      } else if (isOnlySpecials(item)) {
        special_characters.push(item);
      } else {
        special_characters.push(item);
      }
    }

    const transformed = alphaChars.reverse().map((ch, i) =>
      i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()
    );

    return {
      even_numbers,
      odd_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string: transformed.join(""),
    };
  }

  const fullName = process.env.FULL_NAME || "john doe";
  const dob = process.env.DOB_DDMMYYYY || "17091999";
  const user_id = `${fullName.trim().toLowerCase().replace(/\s+/g, "_")}_${dob}`;

  const { data } = req.body || {};
  if (!Array.isArray(data)) {
    return res.status(200).json({
      is_success: false,
      user_id,
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

  const r = classifyData(data);
  return res.status(200).json({
    is_success: true,
    user_id,
    email: process.env.EMAIL || "john@xyz.com",
    roll_number: process.env.ROLL_NUMBER || "ABCD123",
    odd_numbers: r.odd_numbers,
    even_numbers: r.even_numbers,
    alphabets: r.alphabets,
    special_characters: r.special_characters,
    sum: r.sum,
    concat_string: r.concat_string,
  });
}
