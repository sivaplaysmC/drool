# Controllers

## General format:

```js
const controller = (...dependencies) => {
	return (req, res, next) => {
		/* Logic for controller */
	};
};
```

A controller module can only export functions

Each exported function must:

-   Get dependencies as arguments
-   Return request handler

Validation ~when required~ IS MUST

The behavior of a controller must ONLY depend on it's parameters - allows for
easier testing and less surprises

## Good habits

-   write jsdoc comments
-   write exports in the beginning of the file
