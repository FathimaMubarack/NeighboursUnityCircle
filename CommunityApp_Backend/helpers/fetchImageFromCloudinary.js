const axios = require('axios');

async function fetchImageFromCloudinary(imageUrl) {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    } catch (error) {
        console.error('Error fetching image from Cloudinary:', error.message);
        throw new Error('Failed to download image');
    }
}

module.exports = { fetchImageFromCloudinary };
