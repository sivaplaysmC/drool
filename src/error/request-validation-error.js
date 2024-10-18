// import { CustomError } from './custom-error.js';
// import {ValidationError} from 'express-validator.js'
//
// export class RequestValidationError extends CustomError {
//     statusCode = 400;
//     constructor(errors) {
//         super('Invalid request parameters')
//
//         Object.setPrototypeOf(this, RequestValidationError.prototype);
//     }
//
//     serializeErrors() {
//         return this.errors.map((err) => {
//             return {message: err.msg, field: err.param}
//         })}
// }
