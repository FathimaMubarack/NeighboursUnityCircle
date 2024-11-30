const Tesseract = require('tesseract.js');

async function extractTextFromImage(imageBuffer) {
    try {
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
            logger: (m) => console.log(m),  // Optional: logs progress
        });
        return text;
    } catch (error) {
        console.error('OCR Error:', error.message);
        throw new Error('Failed to extract text');
    }
}

module.exports = { extractTextFromImage };
