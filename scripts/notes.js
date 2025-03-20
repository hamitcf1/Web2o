/**
 * Interactive Notes System
 * 
 * A dynamic visualization of markdown notes with D3.js
 * Features:
 * - Fetches markdown files from GitHub repository
 * - Creates interactive nodes for each note
 * - Implements physics-based animation
 * - Supports zoom and pan
 * - Displays note content in a modal
 * - Includes settings panel for customization
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const notesCanvas = document.getElementById('notes-canvas');
    const noteModal = document.getElementById('note-modal');
    const closeButton = document.querySelector('.note-modal .close');
    const noteTitle = document.getElementById('note-title');
    const noteTags = document.getElementById('note-tags');
    const noteContent = document.getElementById('note-content');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    // Control buttons
    const toggleAnimationBtn = document.getElementById('toggle-animation');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const refreshNotesBtn = document.getElementById('refresh-notes');
    const openSettingsBtn = document.getElementById('open-settings');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettingsBtn = document.querySelector('.close-settings');

    // Settings inputs
    const nodeSizeInput = document.getElementById('node-size');
    const linkStrengthInput = document.getElementById('link-strength');
    const repulsionStrengthInput = document.getElementById('repulsion-strength');
    const animationSpeedInput = document.getElementById('animation-speed');
    
    // State variables
    let notes = [];
    let simulation;
    let svg;
    let container;
    let linkElements;
    let nodeElements;
    let labelElements;
    let width = notesCanvas.clientWidth;
    let height = notesCanvas.clientHeight;
    let animationActive = true;
    let isDragging = false;
    let currentZoom = 1;
    let velocities = {};
    let transform = d3.zoomIdentity;
    
    // Physics parameters (now controlled by settings)
    let REPULSION_STRENGTH = -200;
    let LINK_STRENGTH = 0.1;
    let DAMPING_FACTOR = 0.95;
    let COLLISION_RADIUS = 40;
    let ANIMATION_SPEED = 0.3;
    
    // Initialize the visualization
    initVisualization();
    
    // Event listeners for controls
    toggleAnimationBtn.addEventListener('click', toggleAnimation);
    zoomInBtn.addEventListener('click', () => zoomBy(1.2));
    zoomOutBtn.addEventListener('click', () => zoomBy(0.8));
    refreshNotesBtn.addEventListener('click', refreshNotes);
    openSettingsBtn.addEventListener('click', toggleSettings);
    closeSettingsBtn.addEventListener('click', toggleSettings);

    // Settings event listeners
    nodeSizeInput.addEventListener('input', updateNodeSize);
    linkStrengthInput.addEventListener('input', updateLinkStrength);
    repulsionStrengthInput.addEventListener('input', updateRepulsionStrength);
    animationSpeedInput.addEventListener('input', updateAnimationSpeed);

    // Initialize slider values
    updateSliderTrack(nodeSizeInput);
    updateSliderTrack(linkStrengthInput);
    updateSliderTrack(repulsionStrengthInput);
    updateSliderTrack(animationSpeedInput);

    // Close modal when clicking the close button
    closeButton.addEventListener('click', closeNoteModal);
    
    // Close modal when clicking outside the modal content
    noteModal.addEventListener('click', (event) => {
        if (event.target === noteModal) {
            closeNoteModal();
        }
    });
    
    // Window resize handler
    window.addEventListener('resize', debounce(() => {
        width = notesCanvas.clientWidth;
        height = notesCanvas.clientHeight;
        if (svg) {
            svg.attr('width', width).attr('height', height);
            simulation.force('center', d3.forceCenter(width / 2, height / 2));
            simulation.alpha(0.3).restart();
        }
    }, 250));
    
    /**
     * Initialize the D3 visualization
     */
    function initVisualization() {
        // Create SVG element
        svg = d3.select(notesCanvas)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        // Create container for zoom/pan
        container = svg.append('g');
        
        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                transform = event.transform;
                container.attr('transform', transform);
            });
        
        svg.call(zoom);
        
        // Add mouse events for canvas dragging
        notesCanvas.addEventListener('mousedown', () => {
            notesCanvas.classList.add('dragging');
        });
        
        document.addEventListener('mouseup', () => {
            notesCanvas.classList.remove('dragging');
        });
        
        // Fetch notes from GitHub
        fetchNotes();
    }
    
    /**
     * Fetch notes from the GitHub repository
     */
    async function fetchNotes() {
        showLoading(true);
        
        try {
            console.log('Fetching notes from GitHub repository...');
            const repoUrl = 'https://api.github.com/repos/hamitcf1/Web2o/contents/notes';
            const response = await fetch(repoUrl);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch notes: ${response.status} ${response.statusText}`);
            }
            
            const files = await response.json();
            
            // Filter markdown files
            const mdFiles = files.filter(file => file.name.endsWith('.md'));
            console.log(`Found ${mdFiles.length} markdown files`);
            
            // Fetch content of each file
            notes = await Promise.all(mdFiles.map(async (file, index) => {
                try {
                    console.log(`Fetching content for: ${file.name}`);
                    const contentResponse = await fetch(file.download_url);
                    
                    if (!contentResponse.ok) {
                        console.error(`Failed to fetch content for ${file.name}`);
                        return null;
                    }
                    
                    const content = await contentResponse.text();
                    
                    // Parse frontmatter and content
                    const { title, tags, parsedContent } = parseMarkdownFile(file.name, content);
                    
                    // Generate initial position
                    const x = Math.random() * (width * 0.8) + width * 0.1;
                    const y = Math.random() * (height * 0.8) + height * 0.1;
                    
                    return {
                        id: index,
                        title: title,
                        content: parsedContent,
                        tags: tags,
                        x: x,
                        y: y,
                        path: file.path,
                        url: file.download_url
                    };
                } catch (error) {
                    console.error(`Error processing ${file.name}:`, error);
                    return null;
                }
            }));
            
            // Filter out null entries (failed fetches)
            notes = notes.filter(note => note !== null);
            console.log(`Successfully processed ${notes.length} notes`);
            
            // Create links between notes based on shared tags
            const links = createLinks(notes);
            
            // Render the visualization
            renderVisualization(notes, links);
            
        } catch (error) {
            console.error('Error fetching notes:', error);
            showError('Failed to load notes. Please try again later.');
        } finally {
            showLoading(false);
        }
    }
    
    /**
     * Parse a markdown file to extract frontmatter and content
     */
    function parseMarkdownFile(filename, content) {
        // Default values
        let title = filename.replace('.md', '');
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
                tags = tagsMatch[1].split(',')
                    .map(tag => tag.trim().replace(/['"]/g, ''));
            }
        }
        
        return { title, tags, parsedContent };
    }
    
    /**
     * Create links between notes based on shared tags
     */
    function createLinks(notes) {
        const links = [];
        
        // Create a map of tags to notes
        const tagMap = {};
        notes.forEach(note => {
            note.tags.forEach(tag => {
                if (!tagMap[tag]) {
                    tagMap[tag] = [];
                }
                tagMap[tag].push(note.id);
            });
        });
        
        // Create links for notes that share tags
        Object.values(tagMap).forEach(noteIds => {
            if (noteIds.length > 1) {
                for (let i = 0; i < noteIds.length; i++) {
                    for (let j = i + 1; j < noteIds.length; j++) {
                        links.push({
                            source: noteIds[i],
                            target: noteIds[j]
                        });
                    }
                }
            }
        });
        
        return links;
    }
    
    /**
     * Render the visualization with D3
     */
    function renderVisualization(nodes, links) {
        console.log('Render Visualization called with nodes:', nodes, 'and links:', links);
        // Clear previous elements
        container.selectAll('*').remove();
        
        // Create force simulation
        simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).strength(LINK_STRENGTH))
            .force('charge', d3.forceManyBody().strength(REPULSION_STRENGTH))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(COLLISION_RADIUS))
            .on('tick', ticked);
        
        // Create links
        linkElements = container.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('class', 'node-link');
        
        // Create nodes
        const nodeGroup = container.append('g')
            .attr('class', 'nodes')
            .selectAll('.node')
            .data(nodes)
            .enter().append('g')
            .attr('class', 'node')
            .call(d3.drag()
                .on('start', dragStarted)
                .on('drag', dragged)
                .on('end', dragEnded));
        
        // Add circles to nodes
        nodeElements = nodeGroup.append('circle')
            .attr('r', 20)
            .attr('fill', d => getNodeColor(d.tags))
            .attr('stroke', 'var(--node-border)')
            .attr('stroke-width', 2);
        
        // Add labels to nodes
        labelElements = nodeGroup.append('text')
            .attr('class', 'node-label')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .text(d => d.title.length > 12 ? d.title.substring(0, 10) + '...' : d.title);
        
        // Add click event to nodes
        nodeGroup.on('click', (event, d) => {
            if (!isDragging) {
                openNoteModal(d);
            }
        });
        
        // Initialize velocities for animation
        nodes.forEach(node => {
            velocities[node.id] = { x: 0, y: 0 };
        });
    }
    
    /**
     * Get a color for a node based on its tags
     */
    function getNodeColor(tags) {
        if (!tags || tags.length === 0) {
            return 'var(--node-default)';
        }
        
        // Simple hash function for tag-based colors
        const tag = tags[0];
        let hash = 0;
        for (let i = 0; i < tag.length; i++) {
            hash = tag.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const hue = Math.abs(hash % 360);
        return `hsla(${hue}, 70%, 60%, 0.8)`;
    }
    
    /**
     * Update positions on each tick of the simulation
     */
    function ticked() {
        // Update link positions
        linkElements
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        // Update node positions
        nodeElements
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        
        // Update label positions
        labelElements
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    }
    
    /**
     * Handle start of drag
     */
    function dragStarted(event, d) {
        isDragging = false;
        
        if (!event.active) {
            simulation.alphaTarget(0.3).restart();
        }
        
        d.fx = d.x;
        d.fy = d.y;
    }
    
    /**
     * Handle drag
     */
    function dragged(event, d) {
        isDragging = true;
        d.fx = event.x;
        d.fy = event.y;
    }
    
    /**
     * Handle end of drag
     */
    function dragEnded(event, d) {
        if (!event.active) {
            simulation.alphaTarget(0);
        }
        
        // Keep the node fixed at its new position
        setTimeout(() => {
            isDragging = false;
        }, 100);
    }
    
    /**
     * Open the note modal with content
     */
    function openNoteModal(note) {
        console.log('Opening note:', note.title);
        
        // Set modal title
        noteTitle.textContent = note.title;
        
        // Clear and add tags
        noteTags.innerHTML = '';
        if (note.tags && note.tags.length > 0) {
            note.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'note-tag';
                tagElement.textContent = tag;
                noteTags.appendChild(tagElement);
            });
        }
        
        // Set content
        try {
            noteContent.innerHTML = marked.parse(note.content);
        } catch (error) {
            console.error('Error parsing markdown:', error);
            noteContent.textContent = note.content;
        }
        
        // Show modal
        noteModal.style.display = 'block';
        
        // Force reflow
        void noteModal.offsetHeight;
        
        // Add show class for animation
        noteModal.classList.add('show');
    }
    
    /**
     * Close the note modal
     */
    function closeNoteModal() {
        noteModal.classList.remove('show');
        
        setTimeout(() => {
            noteModal.style.display = 'none';
        }, 300);
    }
    
    /**
     * Toggle settings panel
     */
    function toggleSettings() {
        console.log('Toggling settings panel');
        if (settingsPanel.classList.contains('active')) {
            // Hide panel
            settingsPanel.style.transform = 'translateX(100%)';
            setTimeout(() => {
                settingsPanel.classList.remove('active');
            }, 300);
        } else {
            // Show panel
            settingsPanel.classList.add('active');
            settingsPanel.style.transform = 'translateX(0)';
        }
    }

    /**
     * Update slider track color based on value
     */
    function updateSliderTrack(slider) {
        const min = slider.min;
        const max = slider.max;
        const value = slider.value;
        const percentage = ((value - min) / (max - min)) * 100;
        slider.style.setProperty('--value', `${percentage}%`);
    }

    /**
     * Update node size from settings
     */
    function updateNodeSize() {
        const value = parseInt(nodeSizeInput.value);
        console.log('Updating node size to:', value);
        COLLISION_RADIUS = value;
        updateSliderTrack(nodeSizeInput);
        if (simulation) {
            simulation.force('collision', d3.forceCollide().radius(COLLISION_RADIUS));
            updateVisualization();
        }
        // Update node elements size
        if (nodeElements) {
            nodeElements.attr('r', value / 2);
        }
    }

    /**
     * Update link strength from settings
     */
    function updateLinkStrength() {
        LINK_STRENGTH = parseFloat(linkStrengthInput.value);
        updateSliderTrack(linkStrengthInput);
        if (simulation) {
            simulation.force('link').strength(LINK_STRENGTH);
            updateVisualization();
        }
    }

    /**
     * Update repulsion strength from settings
     */
    function updateRepulsionStrength() {
        REPULSION_STRENGTH = parseInt(repulsionStrengthInput.value);
        updateSliderTrack(repulsionStrengthInput);
        if (simulation) {
            simulation.force('charge').strength(REPULSION_STRENGTH);
            updateVisualization();
        }
    }

    /**
     * Update animation speed from settings
     */
    function updateAnimationSpeed() {
        ANIMATION_SPEED = parseFloat(animationSpeedInput.value);
        updateSliderTrack(animationSpeedInput);
        if (simulation && animationActive) {
            simulation.alpha(ANIMATION_SPEED).restart();
        }
    }

    /**
     * Update visualization after settings change
     */
    function updateVisualization() {
        if (simulation && animationActive) {
            simulation.alpha(ANIMATION_SPEED).restart();
        }
    }

    /**
     * Toggle animation on/off
     */
    function toggleAnimation() {
        console.log('Toggle Animation called. Current state:', animationActive);
        animationActive = !animationActive;
        
        if (animationActive) {
            console.log('Animation activated.');
            toggleAnimationBtn.innerHTML = '<i class="fas fa-water"></i>';
            simulation.alpha(ANIMATION_SPEED).restart();
        } else {
            console.log('Animation deactivated.');
            toggleAnimationBtn.innerHTML = '<i class="fas fa-pause"></i>';
            simulation.stop();
        }
    }
    
    /**
     * Zoom by a factor
     */
    function zoomBy(factor) {
        currentZoom *= factor;
        currentZoom = Math.max(0.1, Math.min(4, currentZoom));
        
        const newTransform = d3.zoomIdentity
            .translate(transform.x, transform.y)
            .scale(currentZoom);
        
        svg.transition()
            .duration(300)
            .call(svg.zoom().transform, newTransform);
    }
    
    /**
     * Refresh notes from the repository
     */
    function refreshNotes() {
        fetchNotes();
    }
    
    /**
     * Show/hide loading indicator
     */
    function showLoading(show) {
        loadingIndicator.style.display = show ? 'flex' : 'none';
    }
    
    /**
     * Show error message
     */
    function showError(message) {
        // Could implement a toast or other notification here
        console.error(message);
    }
    
    /**
     * Debounce function for performance
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
});
