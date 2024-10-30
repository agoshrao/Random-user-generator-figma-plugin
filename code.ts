figma.showUI(__html__, { width: 300, height: 700 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generateUser') {
    // Randomly select gender if 'random' is chosen
    let gender = msg.gender;
    if (gender === 'random') {
      gender = Math.random() < 0.5 ? 'male' : 'female';
    }

    const nationality = msg.nationality ? `&nat=${msg.nationality}` : '';
    const userInfoUrl = `https://randomuser.me/api/?results=1&gender=${gender}${nationality}`;

    try {
      // Fetch user info from Random User API
      const userInfoResponse = await fetch(userInfoUrl);
      const userData = await userInfoResponse.json();
      const user = userData.results[0];
      const selectedFields = msg.selectedFields;

      // Load font for text nodes
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });

      let imageRect;
      if (msg.includePicture) {
        const imageUrl = `https://random-user-generator-figma-plugin.onrender.com/random-image?gender=${gender}`;
        const imageResponse = await fetch(imageUrl);
        const imageBytes = await imageResponse.arrayBuffer();
        const image = figma.createImage(new Uint8Array(imageBytes));

        // Create a rectangle for the image and set the image as a fill
        imageRect = figma.createRectangle();
        imageRect.resize(150, 150);
        imageRect.cornerRadius = 8;
        imageRect.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: image.hash }];
        figma.currentPage.appendChild(imageRect);        
      }

      // Display selected user details
      let userInfo = "";
      if (selectedFields.name) {
        userInfo += `Name: ${user.name.title} ${user.name.first} ${user.name.last}\n`;
      }
      if (selectedFields.login) {
        userInfo += `Username: ${user.login.username}\n`;
      }
      if (selectedFields.location) {
        const street = `${user.location.street.number} ${user.location.street.name}`;
        userInfo += `Location: ${street}, ${user.location.city}, Postcode: ${user.location.postcode}\n`;
      }
      if (selectedFields.country) {
        userInfo += `Country: ${user.location.country}\n`;
      }
      if (selectedFields.email) {
        userInfo += `Email: ${user.email}\n`;
      }
      if (selectedFields.phone) {
        userInfo += `Phone: ${user.phone || 'N/A'}\n`;
      }
      if (selectedFields.cell) {
        userInfo += `Cellphone: ${user.cell || 'N/A'}\n`;
      }
      if (selectedFields.dob) {
        const dobDate = new Date(user.dob.date).toLocaleDateString();
        userInfo += `Date of Birth: ${dobDate}\n`;
        if (selectedFields.age) { // Check if age is selected
          userInfo += `Age: ${user.dob.age}\n`; 
        }
      }      
      if (selectedFields.registered) {
        userInfo += `Registered: ${new Date(user.registered.date).toLocaleDateString()}\n`;
      }
      if (selectedFields.id) {
        userInfo += `ID: ${user.id.value || 'N/A'}\n`;
      }
      // Uncomment to include nationality
      // if (selectedFields.nat) {
      //     userInfo += `Nationality: ${user.nat}\n`;
      // }    

      // Create a text node for user information
      const textNode = figma.createText();
      textNode.characters = userInfo.trim();
      figma.currentPage.appendChild(textNode);

      // Arrange the image and text on the canvas
      if (imageRect) {
        imageRect.x = figma.viewport.center.x - 75;
        textNode.x = imageRect.x + 160;
        textNode.y = imageRect.y;
        figma.viewport.scrollAndZoomIntoView([imageRect, textNode]);
      } else {
        textNode.x = figma.viewport.center.x - textNode.width / 2;
        textNode.y = figma.viewport.center.y - textNode.height / 2;
        figma.viewport.scrollAndZoomIntoView([textNode]);
      }

    } catch (error) {
      console.error("Failed to fetch user data or image:", error);
      figma.notify("Error fetching user data or image.");
    }
  }
};
