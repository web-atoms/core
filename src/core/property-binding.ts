import { IDisposable } from "./types";

export class PropertyBinding implements IDisposable {

    constructor(name: string, path: string[] | (() => void), twoWays: boolean) {

    }

    public dispose(): void {
        throw new Error("Method not implemented.");
    }
}
