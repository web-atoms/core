export declare class AtomComponent {
    [key: string]: any;
    private eventHandlers;
    bindEvent(element: any, name?: string, methodName?: (string | Function), key?: string, method?: Function): void;
    unbindEvent(arg0: any, arg1?: any, arg2?: any, arg3?: any): void;
    init(): void;
    dispose(): void;
}
