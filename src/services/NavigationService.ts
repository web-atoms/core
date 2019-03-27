import { AtomUri } from "../core/AtomUri";
import { INameValuePairs } from "../core/types";

// export interface ILocation {
//     href?: string;
//     hash?: INameValues;
//     host?: string;
//     hostName?: string;
//     port?: string;
//     protocol?: string;
// }

export enum NotifyType {
    Information = "info",
    Warning = "warn",
    Error = "error"
}

export abstract class NavigationService {
    public abstract alert(message: string, title?: string): Promise<any>;
    public abstract confirm(message: string, title?: string): Promise<boolean>;
    public abstract openPage<T>(pageName: string, p?: INameValuePairs): Promise<T>;

    public abstract notify(message: string, title?: string, type?: NotifyType, delay?: number): void;

    public abstract get title(): string;
    public abstract set title(v: string);

    public abstract get location(): AtomUri;
    public abstract set location(v: AtomUri);

    public abstract navigate(url: string): void;

    public abstract back(): void;

    public abstract refresh(): void;
}

// Do not mock Navigation unless you want it in design time..
// Mock.mock(NavigationService, "MockNavigationService");
