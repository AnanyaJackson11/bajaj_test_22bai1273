# BFHL Full Stack API — `/bfhl` (POST)

Implements the Bajaj Full Stack assignment: classify input `data` and return arrays for even, odd, alphabets (uppercased), special characters, sum (as string), and a reverse alternating-caps concatenation of all alphabetical characters. Also returns `is_success`, `user_id` (`AnanyaTripathi_11-04-2003` lowercased with underscores), `ananya.tripathi1109@gmail.com`, and `22BAI1273`.

> Spec reference: Full Stack Question Paper – VIT.


## Run locally

```bash
# 1) Install
npm install

# 2) Configure (optional)cp .env.example .env


# 3) Start
npm start
# -> http://localhost:3000/bfhl
```

### Example

```bash
curl -X POST http://localhost:3000/bfhl   -H "Content-Type: application/json"   -d '{"data":["a","1","334","4","R","$"]}'
```

Expected (example from prompt, may vary in order formatting):
```json
{
  "is_success": true,
  "user_id": "john_doe_17091999",
  "email": "john@xyz.com",
  "roll_number": "ABCD123",
  "odd_numbers": ["1"],
  "even_numbers": ["334","4"],
  "alphabets": ["A","R"],
  "special_characters": ["$"],
  "sum": "339",
  "concat_string": "Ra"
}
```
## My output: 
<img width="2343" height="150" alt="image" src="https://github.com/user-attachments/assets/a510fa91-c8df-4fb9-a120-9213a4ca20f1" />
<img width="2280" height="962" alt="image" src="https://github.com/user-attachments/assets/202a3d71-c4ee-4d4b-93af-cc38e9bb094c" />


## Deploy (Render quick start)

1. Create a new Vercel app.
2. Connect your GitHub repo containing this project.
3. Build command: `npm install`
4. Start command: `npm start`
5. Set environment variables FULL_NAME, DOB_DDMMYYYY, EMAIL, ROLL_NUMBER in Render dashboard.




