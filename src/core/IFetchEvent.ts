import { CancelToken } from "./types";

export default interface IFetchEvent {
    search?: string;
    value?: any;
    cancel?: CancelToken;
}
