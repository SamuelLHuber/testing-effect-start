// Helper script to update the HTML with valid JSON metadata
const fs = require("fs")
const path = require("path")

const metadataPath = path.join(__dirname, "miniapp-metadata.json")
const htmlPath = path.join(__dirname, "index.html")

// Read the JSON metadata
const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"))

// Read the HTML file
let html = fs.readFileSync(htmlPath, "utf8")

// Replace the fc:frame content with properly stringified JSON
const jsonString = JSON.stringify(metadata)
const metaRegex = /<meta\s+name="fc:frame"\s+content='[^']*'\s*\/>/
const newMeta = `<meta name="fc:frame" content='${jsonString}' />`

html = html.replace(metaRegex, newMeta)

// Write back to HTML
fs.writeFileSync(htmlPath, html)

console.log("✅ Updated fc:frame metadata in index.html")
console.log("📄 Metadata:", JSON.stringify(metadata, null, 2))
