import { Atom } from "../Atom";
import { AtomControl, IAtomControlElement } from "../controls/AtomControl";
import { AtomWindow } from "../controls/AtomWindow";
import { AtomDevice } from "../core/AtomDevice";
import { ArrayHelper, IClassOf, IDisposable } from "../core/types";
import { RegisterSingleton } from "../di/RegisterSingleton";
import { ServiceProvider } from "../di/ServiceProvider";
import { AtomViewModel } from "../view-model/AtomViewModel";

@RegisterSingleton
export class WindowService {

    private popups: AtomControl[] = [];

    private lastPopupID: number = 0;

    private currentTarget: HTMLElement = null;

    constructor() {
        if (window) {
            window.addEventListener("click", (e) => {
                this.currentTarget = e.target as HTMLElement;
                this.closePopup();
            });
        }
    }

    public confirm(message: string, title: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public alert(message: string, title?: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public async openPopup<T>(windowId: string, vm: AtomViewModel): Promise<T> {
        await Atom.delay(5);
        return await this.openPopupAsync<T>(windowId, vm, true);
    }

    public openWindow<T>(windowId: string, vm: AtomViewModel): Promise<T> {
        return this.openPopupAsync<T>(windowId, vm, false);
    }

    public closePopup(): void {
        if (!this.popups.length) {
            return;
        }
        const peek = this.popups[this.popups.length - 1];
        const element = peek.element;
        let target = this.currentTarget;

        while (target) {
            if (target.classList.contains("close-popup")) {
                break;
            }
            if (target === element) {
                // do not close this popup....
                return;
            }
            target = target.parentElement;
        }

        const message = `atom-window-cancel:${peek.element.id}`;
        const device = ServiceProvider.global.get(AtomDevice);
        device.broadcast(message, "canceled");
    }

    private openPopupAsync<T>(windowId: string, vm: AtomViewModel, isPopup: boolean): Promise<T> {
        return new Promise((resolve, reject) => {
            const popup = ServiceProvider.global.resolve(windowId) as AtomControl;

            const e = popup.element;

            e.id = `atom_popup_${this.lastPopupID++}`;
            e.style.zIndex = 10000 + this.lastPopupID + "";

            if (isPopup) {
                (popup.element as IAtomControlElement)._logicalParent
                    = this.currentTarget as IAtomControlElement;

                const x = this.currentTarget.offsetLeft;
                const y = this.currentTarget.offsetTop;
                const h = this.currentTarget.offsetHeight;
                e.style.position = "absolute";
                e.style.left = x + "px";
                e.style.top = (y + h) + "px";
            }

            document.body.appendChild(e);

            const disposables: IDisposable[] = [popup];

            const closeFunction = () => {
                for (const iterator of disposables) {
                    iterator.dispose();
                }
                e.remove();
                ArrayHelper.remove(this.popups, (a) => a === popup);
            };

            const device = ServiceProvider.global.get(AtomDevice);

            disposables.push(device.subscribe(`atom-window-close:${e.id}`, (g, i) => {
                closeFunction();
                resolve(i);
            }));

            disposables.push(device.subscribe(`atom-window-cancel:${e.id}`, (g, i) => {
                closeFunction();
                reject(i);
            }));

            popup.init();

        });
    }
}
