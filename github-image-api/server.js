require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes

// GitHub repository details from environment variables
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH;
const GITHUB_BASE_FOLDER = process.env.GITHUB_BASE_FOLDER;

// Base URL for GitHub API
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/contents/${GITHUB_BASE_FOLDER}`;

// Route to fetch an image based on gender
app.get('/random-image', async (req, res) => {
  const gender = req.query.gender;

  // Determine folder based on gender parameter
  let folder;
  if (gender === 'male') {
    folder = 'gentlemen';
  } else if (gender === 'female') {
    folder = 'ladies';
  } else {
    // If gender is 'random' or unspecified, choose randomly between gentlemen and ladies
    const folderNames = ['gentlemen', 'ladies'];
    folder = folderNames[Math.floor(Math.random() * folderNames.length)];
  }

  try {
    // Fetch the list of images from the specified folder
    const response = await axios.get(`${GITHUB_API_URL}/${folder}`);
    const images = response.data.map(file => file.name); // Extract image names

    // Select a random image from the chosen folder
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imageUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/${GITHUB_BRANCH}/${GITHUB_BASE_FOLDER}/${folder}/${randomImage}`;

    // Send the image back
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(imageResponse.data);
  } catch (error) {
    console.error("Error fetching image from GitHub:", error.message);
    res.status(404).send('Image not found');
  }
});

app.listen(PORT, () => {
  console.log(`Image API running on port ${PORT}`);
});
