import { IRect } from "../core/types";
import { AtomControl } from "./AtomControl";

export class AtomDockPanel extends AtomControl {

    // private children: Array<HTMLElement| Text | AtomControl> = [];

    // private availableRect: IRect = null;

    // private attempt: number = 0;

    constructor(e?: HTMLElement) {
        super(e || document.createElement("section"));
        // tslint:disable-next-line:no-console
        console.error("Use AtomGridView instead");
    }

    // public append(e: HTMLElement | Text | AtomControl): AtomControl {
    //     this.children.push(e);
    //     return this;
    // }

    // public onUpdateUI(): void {

    //     this.attempt ++;

    //     this.removeAllChildren(this.element);

    //     const width =  this.element.offsetWidth;
    //     const height = this.element.offsetHeight;

    //     if (!(width && height)) {
    //         if (this.attempt > 100) {
    //             // tslint:disable-next-line:no-console
    //             console.error(`AtomDockPanel (${width}, ${height}) must both have non zero width and height`);
    //             return;
    //         }
    //         // AtomDispatcher.instance.callLater(() => this.invalidate());
    //         setTimeout(() => {
    //             this.invalidate();
    //         }, 100);
    //         return;
    //     }

    //     this.attempt = 0;

    //     this.availableRect = { width, height, x: 0, y: 0 };

    //     for (const iterator of this.children) {
    //         if (iterator instanceof AtomControl) {
    //             const ac = iterator as AtomControl;
    //             this.addChild(ac.element, ac);
    //         } else {
    //             this.addChild(iterator as HTMLElement);
    //         }
    //     }
    //     super.onUpdateUI();
    // }

    // private addChild(e: HTMLElement, ac?: AtomControl): void {
    //     let dock: string = "dock-fill";
    //     for (let i = 0; i < e.classList.length ; i++) {
    //         const item = e.classList.item(i);
    //         if (!/^(dock\-)/i.test(item)) {
    //             continue;
    //         }
    //         dock = item;
    //         break;
    //     }

    //     switch (dock.toLowerCase()) {
    //         case "dock-left":
    //             this.availableRect.x +=
    //             break;
    //         case "dock-right":
    //             break;
    //         case "dock-top":
    //             break;
    //         case "dock-bottom":
    //             break;
    //         case "dock-fill":
    //             break;
    //     }

    // }

}
