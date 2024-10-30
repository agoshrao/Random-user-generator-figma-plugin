const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes

// GitHub repository details and folder structure
const GITHUB_USERNAME = 'agoshrao';
const GITHUB_REPOSITORY = 'Random-user-generator-figma-plugin';
const GITHUB_BRANCH = 'main';
const GITHUB_BASE_FOLDER = 'github-image-api/user_photos';

// Folder structure with sample images for each gender
const folders = {
  gentlemen: ['0.jpg', '1.jpg', '2.jpg'], // Add or update these with actual image names
  ladies: ['0.jpg', '1.jpg', '2.jpg'],
};

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

  // Select a random image from the chosen folder
  const images = folders[folder];
  const randomImage = images[Math.floor(Math.random() * images.length)];
  const imageUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/${GITHUB_BRANCH}/${GITHUB_BASE_FOLDER}/${folder}/${randomImage}`;

  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching image from GitHub:", error.message);
    res.status(404).send('Image not found');
  }
});

app.listen(PORT, () => {
  console.log(`Image API running on port ${PORT}`);
});
