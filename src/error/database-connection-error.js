import {CustomError} from './custom-error.js';

export class DataConnectionError extends CustomError {
    statusCode = 500;
    reason = 'Error connecting to database'
    constructor() {
        super('database timedout')

        Object.setPrototypeOf(this, DataConnectionError.prototype);
    }

    serializeErrors() {
        return [{message: this.reason}]
    }
   
}
