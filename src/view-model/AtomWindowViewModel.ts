import { AtomBinder } from "../core/AtomBinder";
import { BindableProperty } from "../core/BindableProperty";
import { NavigationService } from "../services/NavigationService";
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
 *      @Inject windowService: NavigationService
 *      var result = await
 *          windowService.openPage(
 *              ModuleFiles.views.NewWindow,
 *              {
 *                  title: "Edit Object",
 *                  data: {
 *                      id: 4
 *                  }
 *              });
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

    @BindableProperty
    public title: string;

    public closeWarning: string;

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
    @BindableProperty
    public windowName: string;

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
    public async cancel(): Promise<any> {
        if (this.closeWarning) {
            const navigationService = this.app.resolve(NavigationService);
            if (! await navigationService.confirm(this.closeWarning, "Are you sure?")) {
                return;
            }
        }
        this.broadcast(`atom-window-cancel:${this.windowName}`, "cancelled");
    }

}
