const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting video compression...');

// Check if ffmpeg is available
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ ffmpeg not found. Please install ffmpeg first:');
  console.error('   Windows: Download from https://ffmpeg.org/download.html');
  console.error('   Mac: brew install ffmpeg');
  console.error('   Linux: sudo apt install ffmpeg');
  process.exit(1);
}

// Create compressed videos directory
const compressedDir = path.join(__dirname, 'videos', 'compressed');
if (!fs.existsSync(compressedDir)) {
  fs.mkdirSync(compressedDir, { recursive: true });
}

// Video compression settings
const compressionSettings = {
  // For background/hero videos (lower quality, smaller size)
  background: {
    crf: 28, // Higher CRF = smaller file, lower quality
    preset: 'fast',
    scale: '1280:720' // 720p
  },
  // For content videos (better quality)
  content: {
    crf: 23, // Lower CRF = better quality, larger file
    preset: 'medium',
    scale: '1920:1080' // 1080p
  }
};

// Define which videos are background vs content
const videoTypes = {
  'cleaning.mp4': 'background',
  'home.mp4': 'background',
  'contact.mp4': 'background',
  'pricing.mp4': 'background',
  'services.mp4': 'background'
};

// Compress each video
const videosDir = path.join(__dirname, 'videos');
const videoFiles = fs.readdirSync(videosDir).filter(file => file.endsWith('.mp4'));

videoFiles.forEach(videoFile => {
  const inputPath = path.join(videosDir, videoFile);
  const outputPath = path.join(compressedDir, videoFile);
  const videoType = videoTypes[videoFile] || 'content';
  const settings = compressionSettings[videoType];
  
  console.log(`\n🎬 Compressing ${videoFile} (${videoType})...`);
  
  try {
    const command = `ffmpeg -i "${inputPath}" -c:v libx264 -crf ${settings.crf} -preset ${settings.preset} -vf "scale=${settings.scale}:force_original_aspect_ratio=decrease,pad=${settings.scale}:(ow-iw)/2:(oh-ih)/2" -c:a aac -b:a 128k -movflags +faststart "${outputPath}" -y`;
    
    execSync(command, { stdio: 'inherit' });
    
    // Get file sizes
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${videoFile} compressed successfully!`);
    console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`   Compressed: ${(compressedSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`   Savings: ${savings}%`);
    
  } catch (error) {
    console.error(`❌ Error compressing ${videoFile}:`, error.message);
  }
});

console.log('\n🎉 Video compression complete!');
console.log(`📁 Compressed videos saved to: ${compressedDir}`);
console.log('\n💡 Next steps:');
console.log('   1. Review the compressed videos');
console.log('   2. Replace original videos with compressed versions');
console.log('   3. Update your build process to use compressed videos'); 