const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
    inputDirs: ['images', 'img'],  // Source directories
    outputDirs: ['public/images', 'public/img'],  // Output directories for processed images
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

async function convertToWebP(imagePath, inputDir, outputDir) {
    // Create output path maintaining directory structure
    const relativePath = path.relative(inputDir, imagePath);
    const outputPath = path.join(outputDir, relativePath);
    const webpPath = outputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    // Ensure output directory exists
    await fs.mkdir(path.dirname(webpPath), { recursive: true });
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
        // Copy original image to dist
        await fs.copyFile(imagePath, outputPath);
        await sharp(imagePath)
            .webp({ quality: config.quality })
            .toFile(webpPath);
        console.log(`Processed: ${imagePath}\n  → ${outputPath}\n  → ${webpPath}`);
    } catch (error) {
        console.error(`Error converting ${imagePath}:`, error);
    }
}

async function main() {
    try {
        let allImages = [];
        // Scan all input directories
        for (let i = 0; i < config.inputDirs.length; i++) {
            const inputDir = config.inputDirs[i];
            const outputDir = config.outputDirs[i];
            try {
                const images = await findImages(inputDir);
                allImages = allImages.concat(images.map(img => ({ img, inputDir, outputDir })));
            } catch (err) {
                console.warn(`Warning: Could not scan directory ${inputDir}:`, err.message);
            }
        }
        console.log(`Found ${allImages.length} images to convert`);
        // Convert all images
        const conversions = allImages.map(({ img, inputDir, outputDir }) => convertToWebP(img, inputDir, outputDir));
        await Promise.all(conversions);
        console.log('Conversion complete!');
    } catch (error) {
        console.error('Error during conversion:', error);
        process.exit(1);
    }
}

// Run the script
main();