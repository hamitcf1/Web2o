// Interactive Notes System for Web2o
// Author: HamitCF

// Fetch and render notes
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const notesCanvas = document.getElementById('notes-canvas');
    const toggleAnimationBtn = document.getElementById('toggle-animation');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const refreshNotesBtn = document.getElementById('refresh-notes');
    const noteModal = document.getElementById('note-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalTags = document.getElementById('modal-tags');
    const closeModal = document.getElementById('close-modal');
    
    // Constants for physics
    const REPULSION_STRENGTH = 150;
    const ATTRACTION_STRENGTH = 0.1;
    const VELOCITY_DECAY = 0.7;
    const MAX_VELOCITY = 5;
    
    // State variables
    let notes = [];
    let animationActive = true;
    let isDragging = false;
    let velocities = {};
    let currentZoom = 1;
    
    // Get dimensions of the container
    const width = notesCanvas.clientWidth;
    const height = notesCanvas.clientHeight;
    
    // Create SVG container
    const svg = d3.select(notesCanvas)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%');
    
    // Create a group for zoom/pan
    const mainGroup = svg.append('g');
    
    // Create zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 3])
        .on('zoom', (event) => {
            mainGroup.attr('transform', event.transform);
            currentZoom = event.transform.k;
        });
    
    // Apply zoom behavior to SVG
    svg.call(zoom);
    
    // Zoom controls
    zoomInBtn.addEventListener('click', () => {
        svg.transition().duration(300).call(zoom.scaleBy, 1.3);
    });
    
    zoomOutBtn.addEventListener('click', () => {
        svg.transition().duration(300).call(zoom.scaleBy, 0.7);
    });
    
    // Toggle animation
    toggleAnimationBtn.addEventListener('click', () => {
        animationActive = !animationActive;
        toggleAnimationBtn.classList.toggle('active', animationActive);
        if (animationActive) {
            requestAnimationFrame(animate);
        }
    });
    
    // Refresh notes
    refreshNotesBtn.addEventListener('click', () => {
        fetchNotes();
    });
    
    // Fetch notes from the repository
    async function fetchNotes() {
        try {
            const repoUrl = 'https://api.github.com/repos/hamitcf1/Web2o/contents/notes';
            const response = await fetch(repoUrl);
            const files = await response.json();
            
            // Filter markdown files
            const mdFiles = files.filter(file => file.name.endsWith('.md'));
            
            // Fetch content of each file
            notes = await Promise.all(mdFiles.map(async (file, index) => {
                const contentResponse = await fetch(file.download_url);
                const content = await contentResponse.text();
                
                // Extract title and tags from frontmatter if present
                let title = file.name.replace('.md', '');
                let tags = [];
                let parsedContent = content;
                
                // Check for frontmatter
                const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
                if (frontmatterMatch) {
                    const frontmatter = frontmatterMatch[1];
                    parsedContent = frontmatterMatch[2];
                    
                    // Extract title
                    const titleMatch = frontmatter.match(/title:\s*(.*)/);
                    if (titleMatch) {
                        title = titleMatch[1].trim();
                    }
                    
                    // Extract tags
                    const tagsMatch = frontmatter.match(/tags:\s*\[(.*)\]/);
                    if (tagsMatch) {
                        tags = tagsMatch[1].split(',').map(tag => tag.trim());
                    }
                }
                
                // Generate random position for the node
                const x = Math.random() * (width * 0.8) + width * 0.1;
                const y = Math.random() * (height * 0.8) + height * 0.1;
                
                return {
                    id: index,
                    title: title,
                    content: parsedContent,
                    tags: tags,
                    position: { x: x, y: y },
                    path: file.path
                };
            }));
            
            // Initialize velocities
            notes.forEach(note => {
                velocities[note.id] = { x: 0, y: 0 };
            });
            
            // Render notes
            renderNotes();
            
            // Start animation
            if (animationActive) {
                requestAnimationFrame(animate);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }
    
    // Render notes using D3
    function renderNotes() {
        // Clear previous elements
        mainGroup.selectAll('.link').remove();
        mainGroup.selectAll('.node').remove();
        
        // Create links first so they are behind nodes
        const connections = [];
        
        // Create connections between nodes with shared tags
        for (let i = 0; i < notes.length; i++) {
            const nodeA = notes[i];
            
            for (let j = i + 1; j < notes.length; j++) {
                const nodeB = notes[j];
                
                // Find shared tags
                if (nodeA.tags && nodeB.tags) {
                    const sharedTags = nodeA.tags.filter(tag => nodeB.tags.includes(tag));
                    
                    if (sharedTags.length > 0) {
                        connections.push({
                            source: nodeA,
                            target: nodeB,
                            strength: sharedTags.length,
                            sharedTags: sharedTags
                        });
                    }
                }
            }
        }
        
        // Create link elements
        const linkElements = mainGroup.selectAll("path.node-link")
            .data(connections)
            .enter()
            .append("path")
            .attr("class", "node-link")
            .attr("id", (d, i) => `link-${i}`)
            .attr("stroke-width", d => Math.min(2 + d.strength * 1, 5))
            .attr("stroke", "rgba(var(--accent-rgb), 0.5)")
            .attr("fill", "none");
            
        // Log connections for debugging
        console.log("Connections created:", connections.length);
        connections.forEach(c => {
            console.log(`Connection: ${c.source.title} <-> ${c.target.title} (Shared tags: ${c.sharedTags.join(', ')})`);
        });
        
        // Function to update link paths
        function updateLinkPath(d) {
            const sourceX = d.source.position.x;
            const sourceY = d.source.position.y;
            const targetX = d.target.position.x;
            const targetY = d.target.position.y;
            
            const dx = targetX - sourceX;
            const dy = targetY - sourceY;
            const dr = Math.sqrt(dx * dx + dy * dy);
            
            d3.select(this).attr("d", `M ${sourceX},${sourceY} A ${dr},${dr} 0 0,1 ${targetX},${targetY}`);
        }
        
        // Update all link paths
        function updateAllLinks() {
            mainGroup.selectAll("path.node-link").each(updateLinkPath);
        }
        
        // Update link paths initially
        updateAllLinks();
        
        // Create a node for each note using D3
        const nodesGroup = mainGroup.selectAll("g.node")
            .data(notes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("id", d => `node-${d.id}`)
            .attr("transform", d => `translate(${d.position.x}, ${d.position.y})`)
            .call(d3.drag()
                .on("start", startDrag)
                .on("drag", dragNode)
                .on("end", endDrag));
                
        // Add circles to nodes (Obsidian-style)
        nodesGroup.append("circle")
            .attr("r", d => Math.min(30, 15 + d.content.length / 500))
            .attr("fill", d => {
                // Color based on tags
                if (d.tags && d.tags.length) {
                    if (d.tags.includes("javascript")) return "rgba(246, 211, 101, 0.7)";
                    if (d.tags.includes("python")) return "rgba(110, 220, 156, 0.7)";
                    if (d.tags.includes("css")) return "rgba(159, 175, 245, 0.7)";
                    if (d.tags.includes("html")) return "rgba(241, 144, 102, 0.7)";
                    if (d.tags.includes("development")) return "rgba(128, 222, 234, 0.7)";
                    if (d.tags.includes("testing")) return "rgba(186, 104, 200, 0.7)";
                }
                return "rgba(149, 157, 165, 0.7)";
            })
            .attr("stroke", d => {
                if (d.tags && d.tags.length) {
                    if (d.tags.includes("javascript")) return "#f6d365";
                    if (d.tags.includes("python")) return "#6edc9c";
                    if (d.tags.includes("css")) return "#9faff5";
                    if (d.tags.includes("html")) return "#f19066";
                    if (d.tags.includes("development")) return "#80deea";
                    if (d.tags.includes("testing")) return "#ba68c8";
                }
                return "#959da5";
            })
            .attr("stroke-width", 2);
            
        // Add labels below nodes
        nodesGroup.append("text")
            .attr("dy", d => Math.min(30, 15 + d.content.length / 500) + 15)
            .attr("text-anchor", "middle")
            .attr("class", "node-label")
            .text(d => d.title.length > 15 ? d.title.substring(0, 15) + "..." : d.title);
        
        // Add click event for nodes
        nodesGroup.on("click", function(event, d) {
            if (!isDragging) {
                event.stopPropagation();
                openNote(d);
            }
        });
    }
    
    // Drag handlers
    function startDrag(event, d) {
        isDragging = false;
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }
    
    function dragNode(event, d) {
        isDragging = true;
        
        // Update position during drag
        event.subject.fx = event.x;
        event.subject.fy = event.y;
        
        // Update node position in D3
        d3.select(`#node-${d.id}`)
            .attr("transform", `translate(${event.x}, ${event.y})`);
        
        // Update temporary position for link updates
        d.position.x = event.x;
        d.position.y = event.y;
        
        // Update links
        updateAllLinks();
    }
    
    function endDrag(event, d) {
        // Update node position in our data
        event.subject.x = event.x;
        event.subject.y = event.y;
        event.subject.fx = null;
        event.subject.fy = null;
        
        // Set a timeout to distinguish between click and drag
        setTimeout(() => {
            isDragging = false;
        }, 100);
    }
    
    // Animation function
    function animate() {
        if (animationActive) {
            // Apply physics for each node
            applyForces();
            
            // Update node positions
            updateNodePositions();
            
            // Request next frame
            requestAnimationFrame(animate);
        }
    }
    
    // Apply forces to nodes
    function applyForces() {
        // Reset forces
        notes.forEach(nodeA => {
            velocities[nodeA.id].x *= VELOCITY_DECAY;
            velocities[nodeA.id].y *= VELOCITY_DECAY;
            
            // Apply forces from other nodes
            notes.forEach(nodeB => {
                if (nodeA.id !== nodeB.id) {
                    // Calculate distance between nodes
                    const dx = nodeB.position.x - nodeA.position.x;
                    const dy = nodeB.position.y - nodeA.position.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Skip if too far
                    if (distance > 500) return;
                    
                    // Normalize direction
                    const nx = dx / distance;
                    const ny = dy / distance;
                    
                    // Check for collision
                    const radiusA = Math.min(30, 15 + Math.sqrt(nodeA.content.length) / 500);
                    const radiusB = Math.min(30, 15 + Math.sqrt(nodeB.content.length) / 500);
                    const minDistance = radiusA + radiusB + 10;
                    
                    if (distance < minDistance) {
                        // Repulsion (stronger when closer)
                        const repulsionForce = REPULSION_STRENGTH / distance;
                        velocities[nodeA.id].x -= nx * repulsionForce;
                        velocities[nodeA.id].y -= ny * repulsionForce;
                    }
                    
                    // Attraction for nodes with shared tags
                    const sharedTags = nodeA.tags && nodeB.tags 
                        ? nodeA.tags.filter(tag => nodeB.tags.includes(tag)) 
                        : [];
                    
                    if (sharedTags.length > 0) {
                        const attractionForce = ATTRACTION_STRENGTH * distance * sharedTags.length;
                        velocities[nodeA.id].x += nx * attractionForce;
                        velocities[nodeA.id].y += ny * attractionForce;
                    }
                }
            });
            
            // Limit velocity
            const speed = Math.sqrt(
                velocities[nodeA.id].x * velocities[nodeA.id].x + 
                velocities[nodeA.id].y * velocities[nodeA.id].y
            );
            
            if (speed > MAX_VELOCITY) {
                velocities[nodeA.id].x = (velocities[nodeA.id].x / speed) * MAX_VELOCITY;
                velocities[nodeA.id].y = (velocities[nodeA.id].y / speed) * MAX_VELOCITY;
            }
        });
    }
    
    // Update node positions based on velocities
    function updateNodePositions() {
        notes.forEach(node => {
            // Update position
            node.position.x += velocities[node.id].x;
            node.position.y += velocities[node.id].y;
            
            // Keep in bounds
            node.position.x = Math.max(50, Math.min(width - 50, node.position.x));
            node.position.y = Math.max(50, Math.min(height - 50, node.position.y));
            
            // Update SVG elements
            d3.select(`#node-${node.id}`)
                .attr("transform", `translate(${node.position.x}, ${node.position.y})`);
        });
        
        // Update links
        updateAllLinks();
    }
    
    // Process click on node to open note content
    function openNote(d) {
        console.log('Opening note:', d.title); // Debug
        
        // Skip if dragging to avoid opening note when drag ends
        if (isDragging) {
            console.log('Skipping openNote because isDragging is true');
            return;
        }
        
        // Set modal content
        modalTitle.textContent = d.title;
        
        try {
            // Parse markdown with marked.js
            const parsedContent = marked.parse(d.content);
            modalBody.innerHTML = parsedContent;
            
            // Set tags
            let tagsHTML = '';
            if (d.tags && d.tags.length) {
                tagsHTML = d.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ');
            }
            modalTags.innerHTML = tagsHTML;
            
            // Show modal explicitly - first set display property
            noteModal.style.display = 'block';
            // Use timeout to ensure browser has processed the display change
            setTimeout(() => {
                noteModal.classList.add('show');
                document.querySelector('.modal-content').classList.add('show');
            }, 10);
            
            // Add event handler for links in the note content
            const links = modalBody.querySelectorAll('a');
            links.forEach(link => {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            });
        } catch (error) {
            console.error('Error parsing markdown:', error);
            // Show error message in modal
            modalBody.innerHTML = `<p>Error displaying content: ${error.message}</p><pre>${d.content}</pre>`;
            noteModal.style.display = 'block';
            noteModal.classList.add('show');
        }
    }
    
    // Close modal handler
    closeModal.addEventListener('click', () => {
        document.querySelector('.modal-content').classList.remove('show');
        // Use setTimeout to allow the animation to finish before hiding the modal
        setTimeout(() => {
            noteModal.classList.remove('show');
            setTimeout(() => {
                noteModal.style.display = 'none';
            }, 300);
        }, 300);
    });
    
    // Close modal when clicking outside content
    noteModal.addEventListener('click', (e) => {
        if (e.target === noteModal) {
            document.querySelector('.modal-content').classList.remove('show');
            // Use setTimeout to allow the animation to finish before hiding the modal
            setTimeout(() => {
                noteModal.classList.remove('show');
                setTimeout(() => {
                    noteModal.style.display = 'none';
                }, 300);
            }, 300);
        }
    });
    
    // Helper function to get a preview of the note content
    function getPreview(content, maxLength) {
        // Strip markdown syntax (basic approach)
        let text = content
            .replace(/#+\s+(.*)/g, '$1') // Headers
            .replace(/\*\*(.*)\*\*/g, '$1') // Bold
            .replace(/\*(.*)\*/g, '$1') // Italic
            .replace(/\[(.*)\]\(.*\)/g, '$1') // Links
            .replace(/```[^`]*```/g, '') // Code blocks
            .replace(/`([^`]*)`/g, '$1') // Inline code
            .replace(/^\s*>\s*(.*)/gm, '$1') // Blockquotes
            .replace(/^\s*[-*+]\s+(.*)/gm, '$1') // Unordered lists
            .replace(/^\s*\d+\.\s+(.*)/gm, '$1') // Ordered lists
            .trim();
        
        // Truncate to maxLength
        if (text.length > maxLength) {
            text = text.substring(0, maxLength) + '...';
        }
        
        return text;
    }
    
    // Initialize
    fetchNotes();
});
