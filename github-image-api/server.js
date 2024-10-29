// server.js
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// GitHub repository details
const GITHUB_USERNAME = 'agoshrao';
const GITHUB_REPOSITORY = 'Generate-Random-User---Figma-plugin';
const GITHUB_BRANCH = 'main';
const GITHUB_BASE_FOLDER = 'User photos'; // Folder name with space

app.get('/image/:folder/:name', async (req, res) => {
  const folder = encodeURIComponent(req.params.folder); // Ensure folder name is encoded
  const imageName = encodeURIComponent(req.params.name); // Ensure image name is encoded
  const imageUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/${GITHUB_BRANCH}/${GITHUB_BASE_FOLDER}/${folder}/${imageName}`;

  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    res.setHeader('Content-Type', 'image/jpeg'); // Adjust based on image type
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching image from GitHub:", error.message);
    res.status(404).send('Image not found');
  }
});

app.listen(PORT, () => {
  console.log(`Image API running at http://localhost:${PORT}`);
});
