
const fs = require('fs');
const path = require('path');

function scanDirectory(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            scanDirectory(filePath, fileList);
        } else if (file.endsWith('.java')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

function countTestsInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const testMatches = content.match(/@Test\b/g);
    return testMatches ? testMatches.length : 0;
}

function generateReport(projectPath) {
    const javaFiles = scanDirectory(projectPath);
    let totalTests = 0;
    let testClasses = 0;

    javaFiles.forEach(file => {
        const count = countTestsInFile(file);
        if (count > 0) {
            testClasses++;
            totalTests += count;
            console.log(`✔ ${file} → ${count} testes`);
        }
    });

    console.log(`\nResumo:`);
    console.log(`Classes de teste: ${testClasses}`);
    console.log(`Total de métodos @Test: ${totalTests}`);
}

generateReport('../qe-transec-test-obs-validation-service');
