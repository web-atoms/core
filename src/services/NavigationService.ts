import { RegisterSingleton } from "../di/RegisterSingleton";
import { WindowService } from "./WindowService";

export interface ILocation {
    href?: string;
    hash?: string;
    host?: string;
    hostName?: string;
    port?: string;
    protocol?: string;
}

@RegisterSingleton
export class NavigationService extends WindowService {

    /**
     * Get current window title
     *
     * @type {string}
     * @memberof BrowserService
     */
    get title(): string {
        return window.document.title;
    }

    /**
     * Set current window title
     * @memberof BrowserService
     */
    set title(v: string) {
        window.document.title = v;
    }

    /**
     * Gets current location of browser, this does not return
     * actual location but it returns values of browser location.
     * This is done to provide mocking behaviour for unit testing.
     *
     * @readonly
     * @type {AtomLocation}
     * @memberof BrowserService
     */
    public get location(): ILocation {
        return {
            href: location.href,
            hash: location.hash,
            host: location.host,
            hostName: location.hostname,
            port: location.port,
            protocol: location.protocol
        };
    }

    /**
     * Navigate current browser to given url.
     * @param {string} url
     * @memberof BrowserService
     */
    public navigate(url: string): void {
        location.href = url;
    }

    public back(): void {
        window.history.back();
    }
}
