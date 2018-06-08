import { TypeKey } from "./TypeKey";

export class InjectedTypes {
    public static paramList: { [key: string]: Array<{ new ()}> } = {};
}

export function Inject(target: any, name: string, index: number): void {
    const key = TypeKey.get(target);
    const plist = (Reflect as any).getMetadata("design:paramtypes", target, name);
    InjectedTypes.paramList[TypeKey.get(target)] = plist;
}
