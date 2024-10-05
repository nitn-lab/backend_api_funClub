const path = require('path');

// Controller to handle profile image upload
exports.uploadProfileImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Generate URL to access the uploaded file
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
};
