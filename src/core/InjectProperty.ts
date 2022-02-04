import { AtomComponent } from "./AtomComponent";

export default function InjectProperty(target: AtomComponent<any, any>, key: string): void {

    Object.defineProperty(target, key, {
        get: function() {
            const plist = (Reflect as any).getMetadata("design:type", target, key);
            const result = this.app.resolve(plist);
            Object.defineProperty(this, key, {
                value: result,
                writable: false,
            });
            return result;
        },
        configurable: true
    });

}