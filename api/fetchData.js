// /api/fetchData.js

import { GAS_URL } from "./config";  // api内なので ./config でOK

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = { mode: "fetchData" };

    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("FetchData API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
