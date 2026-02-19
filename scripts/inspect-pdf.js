const fs = require('fs');
const pdf = require('pdf-parse');

const PDF_PATH = './public/uploads/날마다 주님과 2024.5-6월(신, 빌).pdf';

async function inspect() {
    try {
        if (!fs.existsSync(PDF_PATH)) {
            console.error(`File not found: ${PDF_PATH}`);
            return;
        }

        console.log(`Reading file: ${PDF_PATH}`);
        const dataBuffer = fs.readFileSync(PDF_PATH);

        // This expects pdf-parse v1.1.1 standard behavior
        const data = await pdf(dataBuffer);

        console.log("\n--- PDF INFO ---");
        console.log(`Pages: ${data.numpages}`);
        // console.log(`Info: ${JSON.stringify(data.info)}`);

        console.log("\n--- TEXT PREVIEW (First 3000 chars) ---");
        console.log(data.text.substring(0, 3000));
        console.log("\n--- END PREVIEW ---");

    } catch (error) {
        console.error("Error reading PDF:", error);
    }
}

inspect();
