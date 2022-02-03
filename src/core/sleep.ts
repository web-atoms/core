import { CancelToken } from "./types";

export default function sleep(timeInMS: number, ct?: CancelToken) {
    let token = 0;
    return new Promise<void>((resolve, reject) => {
        ct?.registerForCancel((reason) => {
            if (token) {
                clearTimeout(token);
                reject(reason);
            }
        });
        if (ct?.cancelled) {
            reject("cancelled");
            return;
        }
        token = setTimeout(resolve, timeInMS);
    });
}
