# Business logic

Our business logic is defined as plain functions wherever possible. All
dependencies are explicitly injected to ensure that the function's signature is
enough to explain what happens under the hood and reduce surprises when
debugging.

## General layout

```js
export const businessLogic = (...dependencies) => {
	/* does side effects to db most of the time */
};
```

## Motivation

Having businessLogic encapsulated into plain functions allows us to write
extensive tests, and ensure code reuse
