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
  gentlemen: [
    '0.jpg', '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg',
    '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg',
    '20.jpg', '21.jpg', '22.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpg', '27.jpg', '28.jpg', '29.jpg',
    '30.jpg', '31.jpg', '32.jpg', '33.jpg', '34.jpg', '35.jpg', '36.jpg', '37.jpg', '38.jpg', '39.jpg',
    '40.jpg', '41.jpg', '42.jpg', '43.jpg', '44.jpg', '45.jpg', '46.jpg', '47.jpg', '48.jpg', '49.jpg',
    '50.jpg', '51.jpg', '52.jpg', '53.jpg', '54.jpg', '55.jpg', '56.jpg', '57.jpg', '58.jpg', '59.jpg',
    '60.jpg', '61.jpg', '62.jpg', '63.jpg', '64.jpg', '65.jpg', '66.jpg', '67.jpg', '68.jpg', '69.jpg',
    '70.jpg', '71.jpg', '72.jpg', '73.jpg', '74.jpg', '75.jpg', '76.jpg', '77.jpg', '78.jpg', '79.jpg',
    '80.jpg', '81.jpg', '82.jpg', '83.jpg', '84.jpg', '85.jpg', '86.jpg', '87.jpg', '88.jpg', '89.jpg',
    '90.jpg', '91.jpg', '92.jpg', '93.jpg', '94.jpg'
  ], 
  ladies: [
    '0.jpg', '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg',
    '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg',
    '20.jpg', '21.jpg', '22.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpg', '27.jpg', '28.jpg', '29.jpg',
    '30.jpg', '31.jpg', '32.jpg', '33.jpg', '34.jpg', '35.jpg', '36.jpg', '37.jpg', '38.jpg', '39.jpg',
    '40.jpg', '41.jpg', '42.jpg', '43.jpg', '44.jpg', '45.jpg', '46.jpg', '47.jpg', '48.jpg', '49.jpg',
    '50.jpg', '51.jpg', '52.jpg', '53.jpg', '54.jpg', '55.jpg', '56.jpg', '57.jpg', '58.jpg', '59.jpg',
    '60.jpg', '61.jpg', '62.jpg', '63.jpg', '64.jpg', '65.jpg', '66.jpg', '67.jpg', '68.jpg', '69.jpg',
    '70.jpg', '71.jpg', '72.jpg', '73.jpg', '74.jpg', '75.jpg', '76.jpg', '77.jpg', '78.jpg', '79.jpg',
    '80.jpg', '81.jpg', '82.jpg', '83.jpg', '84.jpg', '85.jpg', '86.jpg', '87.jpg', '88.jpg', '89.jpg',
    '90.jpg', '91.jpg', '92.jpg', '93.jpg', '94.jpg'
  ],
  
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
