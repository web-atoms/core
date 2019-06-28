// tslint:disable:ban-types no-console
import { Atom } from "../../Atom";
import { AtomBinder } from "../../core/AtomBinder";
import { AtomDispatcher } from "../../core/AtomDispatcher";
import { AtomLoader } from "../../core/AtomLoader";
import { AtomUri } from "../../core/AtomUri";
import { BindableProperty } from "../../core/BindableProperty";
import { IClassOf, IDisposable, INotifyPropertyChanged } from "../../core/types";
import { NavigationService } from "../../services/NavigationService";
import { AtomWindowViewModel } from "../../view-model/AtomWindowViewModel";
import { AtomUI } from "../core/AtomUI";
import AtomFrameStyle from "../styles/AtomFrameStyle";
import { AtomControl } from "./AtomControl";

export interface IPageItem {
    url: string;
    page: AtomControl;
}

/**
 * Creates and hosts an instance of AtomControl available at given URL. Query string parameters
 * from the url will be passed to view model as initial property values.
 *
 * By default stack is turned off, so elements and controls will be destroyed when new control is hosted.
 */
export class AtomFrame
    extends AtomControl
    implements INotifyPropertyChanged {

    public stack: IPageItem[] = [];

    @BindableProperty
    public keepStack: boolean = false;

    @BindableProperty
    public current: AtomControl = null;

    public pagePresenter: HTMLElement;

    public currentDisposable: IDisposable = null;

    public backCommand: Function;

    private mUrl: string;
    public get url(): string {
        return this.mUrl;
    }
    public set url(value: string) {
        if (this.mUrl === value) {
            return;
        }
        this.runAfterInit(() => {
            this.app.runAsync(() => this.load(value));
        });
    }

    private navigationService: NavigationService;

    public async onBackCommand(): Promise<void> {
        if (!this.stack.length) {
            console.warn(`FrameStack is empty !!`);
            return;
        }

        if (!await this.canChange()) {
            return;
        }

        const ctrl: AtomControl = this.current;
        const e: HTMLElement = ctrl.element as HTMLElement;

        ctrl.dispose();
        e.remove();

        const last = this.stack.pop();
        this.mUrl = last.url;
        this.current = last.page;
        (this.current.element as HTMLElement).style.display = "";
        AtomBinder.refreshValue(this, "url");
    }

    public async canChange(): Promise<boolean> {
        if (!this.current) {
            return true;
        }
        const ctrl: AtomControl = this.current;
        const vm: AtomWindowViewModel = ctrl.viewModel;
        if (vm && vm.closeWarning) {
            if ( await this.navigationService.confirm(vm.closeWarning, "Are you sure?")) {
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
                this.stack.push({ url: (this.current as any)._$_url , page: this.current });
            } else {
                if (this.current === ctrl) {
                    return;
                }
                const c1: AtomControl = this.current;
                const e1: HTMLElement = c1.element as HTMLElement;
                c1.dispose();
                e1.remove();
            }
        }

        const element: HTMLElement = ctrl.element as HTMLElement;
        const e = this.pagePresenter || this.element;
        (e).appendChild(element);

        this.current = ctrl;
    }

    // public createControl(ctrl: AtomControl, q?: any): AtomControl {

    //     const div: HTMLElement = ctrl.element;
    //     div.id = `${this.element.id}_${this.stack.length + 1}`;

    //     AtomDispatcher.call(() => {
    //         const vm: any = ctrl.viewModel;
    //         if (q) {
    //             for (const key in q) {
    //                 if (q.hasOwnProperty(key)) {
    //                     const value = q[key];
    //                     vm[key] = value;
    //                 }
    //             }
    //         }
    //     });

    //     return ctrl;
    // }

    public async load(url: string): Promise<any> {

        if (! await this.canChange()) {
            return;
        }

        const uri: AtomUri = new AtomUri(url);

        const ctrl = await AtomLoader.loadView<AtomControl>(uri, this.app);

        (ctrl as any)._$_url = url;

        this.push(ctrl);

        this.mUrl = url;
        AtomBinder.refreshValue(this, "url");

        await Atom.postAsync(this.app, async () => {
            const vm = ctrl.viewModel;
            if (vm) {
                if (vm instanceof AtomWindowViewModel) {
                    const pvm: AtomWindowViewModel = vm as AtomWindowViewModel;
                    pvm.windowName = (ctrl.element as HTMLElement).id;
                }
            }
        });
    }

    public toUpperCase(s: string): string {
        return s.split("-")
            .filter((t) => t)
            .map((t) => t.substr(0, 1).toUpperCase() + t.substr(1))
            .join("");
    }

    protected preCreate(): void {
        this.defaultControlStyle = AtomFrameStyle;
        this.pagePresenter = null;
        if (!this.element) {
            this.element = document.createElement("section");
        }
        AtomUI.assignID(this.element);
        this.runAfterInit(() => {
            this.setPrimitiveValue(this.element, "styleClass", this.controlStyle.root);
        });
        this.backCommand = () => {
            this.onBackCommand();
        };
    }
}
