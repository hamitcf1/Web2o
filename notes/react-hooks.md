---
title: React Hooks
tags: [react, javascript, frontend]
position:
  x: 300
  y: 450
---

# React Hooks

Hooks are functions that let you "hook into" React state and lifecycle features from function components.

## Basic Hooks

### useState
```jsx
const [count, setCount] = useState(0);

// Update state
setCount(count + 1);
```

### useEffect
```jsx
useEffect(() => {
  // Side effects code
  document.title = `Count: ${count}`;
  
  return () => {
    // Cleanup code
  };
}, [count]); // Dependency array
```

### useContext
```jsx
const value = useContext(MyContext);
```

## Custom Hooks
You can create your own hooks to reuse stateful logic between components.

```jsx
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', updateSize);
    updateSize();
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return size;
}
```
