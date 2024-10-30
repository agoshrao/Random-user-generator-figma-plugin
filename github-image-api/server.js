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

// Helper function to fetch image file names from a specific folder
async function fetchImageList(folder) {
  const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/contents/${GITHUB_BASE_FOLDER}/${folder}?ref=${GITHUB_BRANCH}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
    });

    // Filter for images
    const imageFiles = response.data
      .filter(file => file.type === 'file' && /\.(jpg|jpeg|png)$/i.test(file.name))
      .map(file => file.name);
    
    console.log(`Fetched images from ${folder}:`, imageFiles);
    return imageFiles;
  } catch (error) {
    console.error(`Failed to fetch image list from ${folder}:`, error.message);
    return [];
  }
}

// Route to fetch an image based on gender
app.get('/random-image', async (req, res) => {
  const gender = req.query.gender;

  let folder;
  if (gender === 'male') {
    folder = 'gentlemen';
  } else if (gender === 'female') {
    folder = 'ladies';
  } else {
    folder = Math.random() < 0.5 ? 'gentlemen' : 'ladies';
  }

  try {
    const images = await fetchImageList(folder);

    if (images.length === 0) {
      return res.status(404).send(`No images found in folder: ${folder}`);
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imageUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/${GITHUB_BRANCH}/${GITHUB_BASE_FOLDER}/${folder}/${randomImage}`;

    console.log(`Fetching image: ${imageUrl}`);
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
