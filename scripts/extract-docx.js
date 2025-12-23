const fs = require('fs');
const path = require('path');

// Simple approach: Try to use mammoth if available, otherwise provide instructions
async function extractDocx(filePath) {
  try {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('mammoth not installed. Run: npm install --save-dev mammoth');
      return null;
    }
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node scripts/extract-docx.js <docx_file>');
    process.exit(1);
  }
  
  const filePath = args[0];
  const content = await extractDocx(filePath);
  
  if (content) {
    console.log(content);
  }
}

main().catch(console.error);


