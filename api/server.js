const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const matter = require('gray-matter');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Endpoint to get all markdown files
app.get('/api/get-markdown-files', (req, res) => {
    const notesDir = path.join(__dirname, '../notes');
    
    try {
        // Check if directory exists
        if (!fs.existsSync(notesDir)) {
            return res.status(404).json({ error: 'Notes directory not found' });
        }
        
        // Read all files from the notes directory
        const files = fs.readdirSync(notesDir)
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const filePath = path.join(notesDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Parse frontmatter if exists (for metadata like tags)
                const { data, content: markdownContent } = matter(content);
                
                // Generate a position if not defined
                const position = data.position || {
                    x: Math.floor(Math.random() * 500) + 100,
                    y: Math.floor(Math.random() * 400) + 100
                };
                
                // Extract tags from frontmatter or create default ones based on content
                let tags = data.tags || [];
                
                // If no tags in frontmatter, try to extract keywords from content
                if (tags.length === 0) {
                    // Simple keyword extraction
                    const words = markdownContent.toLowerCase()
                        .replace(/[^\w\s]/g, '')
                        .split(/\s+/)
                        .filter(word => word.length > 4);
                    
                    // Count word frequency
                    const wordCount = {};
                    words.forEach(word => {
                        wordCount[word] = (wordCount[word] || 0) + 1;
                    });
                    
                    // Get top 3 most frequent words as tags
                    tags = Object.entries(wordCount)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(entry => entry[0]);
                }
                
                return {
                    id: path.basename(file, '.md'),
                    title: data.title || path.basename(file, '.md').replace(/-/g, ' '),
                    content: markdownContent,
                    tags: tags,
                    position: position
                };
            });
        
        res.json({ files });
    } catch (error) {
        console.error('Error reading markdown files:', error);
        res.status(500).json({ error: 'Failed to read markdown files' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
