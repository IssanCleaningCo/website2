const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
    inputDirs: ['images', 'img'],  // Directories to scan for images
    quality: 80,  // WebP quality (0-100)
    skipExisting: true,  // Skip if WebP version exists
    extensions: ['.jpg', '.jpeg', '.png']
};

async function findImages(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    let images = [];

    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
            images = images.concat(await findImages(fullPath));
        } else if (config.extensions.includes(path.extname(file.name).toLowerCase())) {
            images.push(fullPath);
        }
    }

    return images;
}

async function convertToWebP(imagePath) {
    const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    // Skip if WebP exists and skipExisting is true
    if (config.skipExisting) {
        try {
            await fs.access(webpPath);
            console.log(`Skipping ${imagePath} (WebP already exists)`);
            return;
        } catch (err) {
            // WebP doesn't exist, continue with conversion
        }
    }

    try {
        await sharp(imagePath)
            .webp({ quality: config.quality })
            .toFile(webpPath);
        
        console.log(`Converted: ${imagePath} → ${webpPath}`);
    } catch (error) {
        console.error(`Error converting ${imagePath}:`, error);
    }
}

async function main() {
    try {
        let allImages = [];
        
        // Scan all input directories
        for (const dir of config.inputDirs) {
            try {
                const images = await findImages(dir);
                allImages = allImages.concat(images);
            } catch (err) {
                console.warn(`Warning: Could not scan directory ${dir}:`, err.message);
            }
        }

        console.log(`Found ${allImages.length} images to convert`);

        // Convert all images
        const conversions = allImages.map(convertToWebP);
        await Promise.all(conversions);

        console.log('Conversion complete!');
    } catch (error) {
        console.error('Error during conversion:', error);
        process.exit(1);
    }
}

// Run the script
main(); 