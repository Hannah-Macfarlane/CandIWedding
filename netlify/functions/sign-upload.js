const cloudinary = require("cloudinary").v2;

// These are secret values stored in Netlify's environment variables
// — never hardcoded here
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.handler = async function (event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Generate a secure, short-lived signature
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: "wedding-photos",
        tags: "guest-upload",
        source: "uw",
      },
      process.env.CLOUDINARY_API_SECRET
    );

    // Send the signature + timestamp back to the frontend
    // The secret key itself is never sent
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        source: "uw",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate signature" }),
    };
  }
};

