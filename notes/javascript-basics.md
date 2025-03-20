---
title: JavaScript Basics
tags: [javascript, programming, web]
position:
  x: 150
  y: 120
---

# JavaScript Basics

## Variables
JavaScript has three ways to declare variables:
- `var`: Function scoped, older way
- `let`: Block scoped, preferred for variables
- `const`: Block scoped, for constants

## Functions
Functions can be declared in multiple ways:
```javascript
// Function declaration
function add(a, b) {
    return a + b;
}

// Arrow function
const multiply = (a, b) => a * b;
```

## Arrays
Arrays are zero-indexed collections of items:
```javascript
const fruits = ['apple', 'banana', 'orange'];
fruits.forEach(fruit => console.log(fruit));
```

## Objects
Objects store collections of key-value pairs:
```javascript
const person = {
    name: 'John',
    age: 30,
    greet() {
        return `Hello, my name is ${this.name}`;
    }
};
```
