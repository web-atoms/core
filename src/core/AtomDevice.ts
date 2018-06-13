import { RegisterSingleton } from "../di/RegisterSingleton";
import { AtomDisposable, IDisposable } from "./types";

export type AtomAction = (channel: string, data: any) => void;

class AtomHandler {

    public message: string;
    public list: AtomAction[];

    constructor(message: string) {
        this.message = message;
        this.list = new Array<AtomAction>();
    }

}

export class AtomMessageAction {
    public message: string;
    public action: AtomAction;

    constructor(msg: string, a: AtomAction) {
        this.message = msg;
        this.action = a;
    }
}

/**
 * Device (usually browser), instance of which supports
 * singleton instance to provide broadcast/messaging
 *
 * @export
 * @class AtomDevice
 */
@RegisterSingleton
export class AtomDevice {

    // /**
    //  *
    //  *
    //  * @static
    //  * @type {AtomDevice}
    //  * @memberof AtomDevice
    //  */
    // public static instance: AtomDevice = new AtomDevice();

    private bag: any;

    constructor() {

        this.bag = {};
    }

    /**
     * This method will run any asynchronous method
     * and it will display an error if it will fail
     * asynchronously
     *
     * @template T
     * @param {() => Promise<T>} tf
     * @memberof AtomDevice
     */
    public runAsync<T>(tf: () => Promise<T>): void {

        const task: any = tf();
        task.catch((error) => {
            this.onError(error);
        });
        // tslint:disable-next-line
        task.then(():void => {});
    }

    public onError: (m: any) => void = (error) => {
        // tslint:disable-next-line:no-console
        console.log(error);
    }

    /**
     * Broadcast given data to channel, only within the current window.
     *
     * @param {string} channel
     * @param {*} data
     * @returns
     * @memberof AtomDevice
     */
    public broadcast(channel: string, data: any): void {
        const ary: AtomHandler = this.bag[channel] as AtomHandler;
        if (!ary) {
            return;
        }
        for (const entry of ary.list) {
            entry.call(this, channel, data);
        }
    }

    /**
     * Subscribe for given channel with action that will be
     * executed when anyone will broadcast (this only works within the
     * current browser window)
     *
     * This method returns a disposable, when you call `.dispose()` it will
     * unsubscribe for current subscription
     *
     * @param {string} channel
     * @param {AtomAction} action
     * @returns {AtomDisposable} Disposable that supports removal of subscription
     * @memberof AtomDevice
     */
    public subscribe(channel: string, action: AtomAction): IDisposable {

        let ary: AtomHandler = this.bag[channel] as AtomHandler;
        if (!ary) {
            ary = new AtomHandler(channel);
            this.bag[channel] = ary;
        }
        ary.list.push(action);
        return new AtomDisposable(() => {
            ary.list = ary.list.filter((a) => a !== action);
            if (!ary.list.length) {
                this.bag[channel] = null;
            }
        });
    }
}
