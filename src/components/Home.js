import React from 'react';
import TodoListCard from './TodoListCard';
// ... other imports

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to My Projects</h1>
      <div className="projects-grid">
        <TodoListCard />
        {/* Your existing project cards */}
      </div>
    </div>
  );
}

export default Home; 