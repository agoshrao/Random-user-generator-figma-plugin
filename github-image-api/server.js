const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import CORS middleware

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes

// GitHub repository details and folder structure
const GITHUB_USERNAME = 'agoshrao';
const GITHUB_REPOSITORY = 'Random-user-generator-figma-plugin';
const GITHUB_BRANCH = 'main';
const GITHUB_BASE_FOLDER = 'github-image-api/user_photos';
const folders = {
  gentlemen: ['0.jpg', '1.jpg', '2.jpg'],
  ladies: ['0.jpg', '1.jpg', '2.jpg'],
  lego: ['0.jpg', '1.jpg', '2.jpg']
};

app.get('/random-image', async (req, res) => {
  const folderNames = Object.keys(folders);
  const randomFolder = folderNames[Math.floor(Math.random() * folderNames.length)];
  const images = folders[randomFolder];
  const randomImage = images[Math.floor(Math.random() * images.length)];
  const imageUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/${GITHUB_BRANCH}/${GITHUB_BASE_FOLDER}/${randomFolder}/${randomImage}`;

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
