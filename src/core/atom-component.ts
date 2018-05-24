import { AtomUI } from "./atom-ui";

interface IEventObject {

    element: any;

    name?: string;

    methodName?: string;

    // tslint:disable-next-line:ban-types
    handler?: Function;

    key?: string;

}
export class AtomComponent {

    [key: string]: any;

    private eventHandlers: IEventObject[] = [];

    public bindEvent(
        element: any,
        name?: string,
        // tslint:disable-next-line:ban-types
        methodName?: (string | Function),
        key?: string,
        // tslint:disable-next-line:ban-types
        method?: Function): void {
        if (!element) {
            return;
        }
        if (!method) {
            if (methodName instanceof String) {
                method = AtomUI.createDelegate(this, methodName);
            } else {
                // tslint:disable-next-line:ban-types
                method = methodName as Function;
            }
        }
        const be: IEventObject = {
            element,
            name,
            methodName: methodName as string,
            handler: method
        };
        if (key) {
            be.key = key;
        }
        if (element.addEventListener) {
            element.addEventListener(name, method, false);
        } else {
            // var f: Function = element["add_" + name];
        }
    }
    public unbindEvent(arg0: any, arg1?: any, arg2?: any, arg3?: any): void {
        throw new Error("Method not implemented.");
    }

    public init(): void {
        // initialization used by derived controls
    }

    public dispose(): void {
        this.unbindEvent(null, null, null);
    }
}
