import { AtomControl } from "./AtomComponent";

export default function InjectProperty(target: AtomControl, key: string): void {

    Object.defineProperty(target, key, {
        get() {
            const plist = (Reflect as any).getMetadata("design:type", target, key);
            const result = this.app.resolve(plist);
            // get is compatible with AtomWatcher
            // as it will ignore getter and it will
            // not try to set a binding refresher
            Object.defineProperty(this, key, {
                get: () => result
            });
            return result;
        },
        configurable: true
    });

}
