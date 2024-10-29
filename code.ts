figma.showUI(__html__, { width: 300, height: 600 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generateUser') {
    const gender = msg.gender === 'random' ? '' : `&gender=${msg.gender}`;
    const nationality = msg.nationality ? `&nat=${msg.nationality}` : '';
    const url = `https://randomuser.me/api/?results=1${gender}${nationality}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const user = data.results[0];
      const selectedFields = msg.selectedFields;

      // Load font before creating text nodes
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });

      let userInfo = "";
      if (selectedFields.name) {
        userInfo += `Name: ${user.name.first} ${user.name.last}\n`;
      }
      if (selectedFields.login) {
        userInfo += `Login: ${user.login.username}\n`; // Corrected this line
      }
      if (selectedFields.location) {
        userInfo += `Location: ${user.location.city}, ${user.location.country}\n`;
      }
      if (selectedFields.email) {
        userInfo += `Email: ${user.email}\n`;
      }
      if (selectedFields.phone) {
        userInfo += `Phone: ${user.phone || 'N/A'}\n`; // Added fallback
      }
      if (selectedFields.cell) {
        userInfo += `Cellphone: ${user.cell || 'N/A'}\n`; // Added fallback
      }
      if (selectedFields.dob) {
        userInfo += `Date of Birth: ${user.dob ? new Date(user.dob.date).toLocaleDateString() : 'N/A'}\n`; // Added fallback
      }

      const textNode = figma.createText();
      textNode.characters = userInfo.trim();
      figma.currentPage.appendChild(textNode);
      figma.viewport.scrollAndZoomIntoView([textNode]);

    } catch (error) {
      console.error("Failed to fetch user data:", error);
      figma.notify("Error fetching user data. Check console for details.");
    }
  }
};