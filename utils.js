const debounce = (func, wait) => {
    let timeoutId;
    
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), wait);
    };
}; 