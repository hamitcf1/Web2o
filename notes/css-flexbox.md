---
title: CSS Flexbox
tags: [css, layout, web]
position:
  x: 450
  y: 200
---

# CSS Flexbox

Flexbox is a one-dimensional layout method for arranging items in rows or columns.

## Basic Properties

### Container Properties
- `display: flex` - Activates flexbox
- `flex-direction` - Sets the direction (row, column)
- `justify-content` - Aligns along main axis
- `align-items` - Aligns along cross axis

### Item Properties
- `flex-grow` - How much an item can grow
- `flex-shrink` - How much an item can shrink
- `flex-basis` - Default size of an item

## Example
```css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item {
  flex: 1;
}
```
