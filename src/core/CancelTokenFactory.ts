import { AtomBinder } from "./AtomBinder";
import { CancelToken, IDisposable } from "./types";

/**
 * We recommend using CancelTokenFactory instead of using CancelToken directly.
 * This class will cancel previous token before creating new token for given key.
 */
export default class CancelTokenFactory implements IDisposable {
    private mToken: { [key: string]: CancelToken } = {};

    /**
     * This will create a new token and cancel previous token
     */
    public newToken(key?: string): CancelToken {
        key = key || "__old";
        const old = this.mToken [key];
        if (old) {
            old.cancel();
        }
        const n = this.mToken[key] = new CancelToken();
        return n;
    }

    public dispose(): void {
        for (const key in this.mToken) {
            if (this.mToken.hasOwnProperty(key)) {
                const element = this.mToken[key];
                element.dispose();
            }
        }
    }
}
