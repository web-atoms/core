import { AtomBinder } from "../core";
import { AtomViewModel } from "./AtomViewModel";

/**
 * This view model should be used with WindowService to create and open window.
 *
 * This view model has `close` and `cancel` methods. `close` method will
 * close the window and will resolve the given result in promise. `cancel`
 * will reject the given promise.
 *
 * @example
 *
 *      var windowService = DI.resolve(WindowService);
 *      var result = await
 *          windowService.openWindow(
 *              "Namespace.WindowName",
 *              new WindowNameViewModel());
 *
 *
 *
 *      class NewTaskWindowViewModel extends AtomWindowViewModel{
 *
 *          ....
 *          save(){
 *
 *              // close and send result
 *              this.close(task);
 *
 *          }
 *          ....
 *
 *      }
 *
 * @export
 * @class AtomWindowViewModel
 * @extends {AtomViewModel}
 */
export class AtomWindowViewModel extends AtomViewModel {

    /**
     * windowName will be set to generated html tag id, you can use this
     * to mock AtomWindowViewModel in testing.
     *
     * When window is closed or cancelled, view model only broadcasts
     * `atom-window-close:${this.windowName}`, you can listen for
     * such message.
     *
     * @type {string}
     * @memberof AtomWindowViewModel
     */
    private mWindowName: string;
    public get windowName(): string {
        return this.mWindowName;
    }
    public set windowName(v: string) {
        this.mWindowName = v;
        AtomBinder.refreshValue(this, "windowName");
    }

    /**
     * This will broadcast `atom-window-close:windowName`.
     * WindowService will close the window on receipt of such message and
     * it will resolve the promise with given result.
     *
     *      this.close(someResult);
     *
     * @param {*} [result]
     * @memberof AtomWindowViewModel
     */
    public close(result?: any): void {
        // tslint:disable-next-line:no-string-literal
        this["_channelPrefix"] = "";
        this.broadcast(`atom-window-close:${this.windowName}`, result);
    }

    /**
     * This will broadcast `atom-window-cancel:windowName`
     * WindowService will cancel the window on receipt of such message and
     * it will reject the promise with "cancelled" message.
     *
     *      this.cancel();
     *
     * @memberof AtomWindowViewModel
     */
    public cancel(): void {
        // tslint:disable-next-line:no-string-literal
        this["_channelPrefix"] = "";
        this.broadcast(`atom-window-cancel:${this.windowName}`, null);
    }

}
