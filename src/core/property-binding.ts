import { IDisposable } from "./types";

export class PropertyBinding implements IDisposable {

    public name: string;

    constructor(name: string, path: string[] | (() => void), twoWays: boolean) {
        this.name = name;
    }

    public dispose(): void {
        throw new Error("Method not implemented.");
    }
}
