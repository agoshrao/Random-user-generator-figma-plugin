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
    res.json({ imageUrl }); // Send the image URL as a JSON response
  } catch (error) {
    console.error("Error fetching image from GitHub:", error.message);
    res.status(500).send('Internal Server Error');
  }
});
