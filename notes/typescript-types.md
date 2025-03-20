---
title: TypeScript Types
tags: [typescript, javascript, programming]
position:
  x: 500
  y: 550
---

# TypeScript Types

## Basic Types

```typescript
// Primitive types
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";

// Array types
let list: number[] = [1, 2, 3];
let names: Array<string> = ["John", "Jane"];

// Tuple
let person: [string, number] = ["John", 25];

// Enum
enum Color {Red, Green, Blue}
let c: Color = Color.Green;

// Any
let notSure: any = 4;
notSure = "maybe a string";

// Void
function warnUser(): void {
  console.log("Warning!");
}

// Null and Undefined
let u: undefined = undefined;
let n: null = null;

// Never
function error(message: string): never {
  throw new Error(message);
}
```

## Interface

```typescript
interface User {
  name: string;
  id: number;
  email?: string; // Optional property
  readonly createdAt: Date; // Read-only property
}

function createUser(user: User): User {
  return user;
}
```

## Type Aliases

```typescript
type Point = {
  x: number;
  y: number;
};

type ID = string | number;
```
