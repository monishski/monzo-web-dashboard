## Util Functions

### Use 'get' Prefix and Object Parameters for Multiple Arguments

When a defining a utility function use the 'get' prefix and when it requires multiple parameters, use an object parameter pattern for better readability and maintainability.

```ts
// ❌ Avoid
function processData(data: Data, userId: string, options: Options) {
  // ...
}

// ✅ Prefer
function getData({
  data,
  userId,
  options,
}: {
  data: Data;
  userId: string;
  options: Options;
}) {
  // ...
}
```

Benefits:

- Prefix makes it clear that its a utility
- Named parameters make the code more self-documenting
- Easier to add/remove parameters without breaking function signatures
- Better IDE support with parameter hints
- Parameters are more explicit at the call site

### When to Use Object Parameters

- When a function has more than 2 parameters
- When parameters are related and form a logical group
- When parameters might need to be extended in the future
- When parameter order is not immediately obvious

### When to Use Regular Parameters

- For single parameters
- For very simple functions with 2 or fewer parameters
- When parameter order is obvious and conventional (e.g., `map(callback, array)`)
