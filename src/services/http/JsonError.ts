export default class JsonError extends Error {

    constructor(
        message: string,
        public readonly json: any) {
        super(message);
    }

}
