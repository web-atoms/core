import { IDisposable } from "../core/types.js";

export interface IAtomViewModel {
    setupWatch(ft: () => any, proxy?: () => any, forValidation?: boolean, name?: string): IDisposable ;
}

export type viewModelInit = (vm: any) => void;

export type viewModelInitFunc = (target: any, key: string | symbol) => void;

export function registerInit(target: any, fx: viewModelInit ): void {
    const t: any = target as any;
    const inits: viewModelInit[] = t._$_inits = t._$_inits || [];
    inits.push(fx);
}
