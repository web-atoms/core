// tslint:disable:ban-types no-console
import { Atom } from "../Atom";
import { AtomUri } from "../core/atom-uri";
import { bindableProperty } from "../core/bindable-properties";
import { IClassOf, IDisposable, INotifyPropertyChanged } from "../core/types";
import { ServiceProvider } from "../di/ServiceProvider";
import { WindowService } from "../services/WindowService";
import { AtomPageViewModel } from "../view-model/AtomPageViewModel";
import { AtomViewModel } from "../view-model/AtomViewModel";
import { AtomControl } from "./AtomControl";
import { AtomUI } from "../core/atom-ui";
import { AtomDispatcher } from "../core/AtomDispatcher";

export class AtomPageView
    extends AtomControl
    implements INotifyPropertyChanged {

    public stack: AtomControl[] = [];

    @bindableProperty
    public url: string;

    @bindableProperty
    public keepStack: boolean = true;

    @bindableProperty
    public current: AtomControl = null;

    public currentDisposable: IDisposable = null;

    public backCommand: Function;

    private disposables: IDisposable[] = [];

    private windowService: WindowService;

    private lastUrl: string;

    constructor(e: HTMLElement) {
        super(e);
        AtomUI.assignID(this.element);
        this.windowService = ServiceProvider.global.get(WindowService);
        e.style.position = "relative";
        this.backCommand = () => {
            this.onBackCommand();
        };
    }

    public onBackCommand(): void {
        if (!this.stack.length) {
            console.warn(`FrameStack is empty !!`);
            return;
        }

        const ctrl: AtomControl = this.current;
        const e: HTMLElement = ctrl.element as HTMLElement;

        ctrl.dispose();
        e.remove();

        this.current = this.stack.pop();
        (this.current.element as HTMLElement).style.display = "";
    }

    public async canChange(): Promise<boolean> {
        if (!this.current) {
            return true;
        }
        const ctrl: AtomControl = this.current;
        const vm: AtomPageViewModel = ctrl.viewModel;
        if (vm.closeWarning) {
            if ( await this.windowService.confirm(vm.closeWarning, "Are you sure?")) {
                return true;
            }
            return false;
        }
        return true;
    }

    public push(ctrl: AtomControl): void {

        if (this.current) {
            if (this.keepStack) {
                (this.current.element as HTMLElement).style.display = "none";
                this.stack.push(this.current);
            } else {
                const c1: AtomControl = this.current;
                const e: HTMLElement = c1.element as HTMLElement;
                c1.dispose();
                e.remove();
            }
        }

        const element: HTMLElement = ctrl.element as HTMLElement;
        element.style.position = "absolute";
        element.style.top =
        element.style.bottom =
        element.style.left =
        element.style.right = "0";

        (this.element as HTMLElement).appendChild(element);

        this.current = ctrl;
    }

    public dispose(e?: HTMLElement): void {
        super.dispose(e);
        if (!e) {
            for (const d of this.disposables) {
                d.dispose();
            }
            this.disposables = [];
        }
    }

    public createControl(ctrl: AtomControl, q?: any): AtomControl {

        const div: HTMLElement = ctrl.element;
        div.id = `${this.element.id}_${this.stack.length + 1}`;

        AtomDispatcher.call(() => {
            const vm: any = ctrl.viewModel;
            if (q) {
                for (const key in q) {
                    if (q.hasOwnProperty(key)) {
                        const value = q[key];
                        vm[key] = value;
                    }
                }
            }
        });

        return ctrl;
    }

    public async load(url: string): Promise<any> {

        if (! await this.canChange()) {
            return;
        }

        const uri: AtomUri = new AtomUri(url);

        // const fragments: string[] =
        //     uri.path.split(".")
        //     .map( (f) => this.toUpperCase(f));

        // const scope: any = window;
        // var vm: any = null;
        // for (var f of fragments) {
        //     vm = scope[f + "ViewModel"];
        //     if (!vm) {
        //         vm = scope[f + "Model"];
        //     }
        //     scope = scope[f];
        //     if (!scope) {
        //         throw new Error(`No ${f} in ${url} found.`);
        //     }
        // }

        const ct = ServiceProvider.global.resolve(uri.path);

        const q: any = uri.query;

        const ctrl: AtomControl = this.createControl(ct, null, q);

        Atom.postAsync(async () => {
            const vm = ctrl.viewModel;
            if (vm) {
                if (vm instanceof AtomPageViewModel) {
                    const pvm: AtomPageViewModel = vm as AtomPageViewModel;
                    pvm.pageId = (ctrl.element as HTMLElement).id;
                }
            }
        });

        this.push(ctrl);

    }

    public toUpperCase(s: string): string {
        return s.split("-")
            .filter((t) => t)
            .map((t) => t.substr(0, 1).toUpperCase() + t.substr(1))
            .join("");
    }

    public onUpdateUI(): void {
        super.onUpdateUI();
        if (this.url === this.lastUrl) {
            return;
        }

        this.lastUrl = this.url;
        this.load(this.lastUrl);
    }

    public onPropertyChanged(name: string): void {
        super.onPropertyChanged(name);

        switch (name) {
            case "url":
                this.invalidate();
                break;
        }
    }
}
