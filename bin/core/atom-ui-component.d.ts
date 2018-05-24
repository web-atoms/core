import { AtomComponent } from "./atom-component";
export declare class AtomUIComponent extends AtomComponent {
    readonly owner: AtomUIComponent;
    getTemplate(name: string): HTMLElement;
}
export declare class Templates {
    static get(arg0: any, arg1: any): HTMLElement;
}
