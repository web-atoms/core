import { CancelToken } from "./types.js";

export default interface IFetchEvent {
    search?: string;
    value?: any;
    cancel?: CancelToken;
}
