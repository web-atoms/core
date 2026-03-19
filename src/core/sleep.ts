import { CancelToken } from "./types.js";

export default function sleep(timeInMS: number, ct?: CancelToken, throwOnCancel = true) {
    let token = 0;
    return new Promise<void>((resolve, reject) => {
        ct?.registerForCancel((reason) => {
            if (token) {
                clearTimeout(token);
                if (throwOnCancel) {
                    reject(reason);
                } else {
                    resolve();
                }
            }
        });
        if (ct?.cancelled) {
            if (throwOnCancel) {
                reject("cancelled");
            } else {
                resolve();
            }
            return;
        }
        token = setTimeout(resolve, timeInMS);
    });
}
