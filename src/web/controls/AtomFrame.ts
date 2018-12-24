// tslint:disable:ban-types no-console
import { Atom } from "../../Atom";
import { AtomDispatcher } from "../../core/AtomDispatcher";
import { AtomLoader } from "../../core/AtomLoader";
import { AtomUri } from "../../core/AtomUri";
import { BindableProperty } from "../../core/BindableProperty";
import { IClassOf, IDisposable, INotifyPropertyChanged } from "../../core/types";
import { NavigationService } from "../../services/NavigationService";
import { AtomWindowViewModel } from "../../view-model/AtomWindowViewModel";
import { AtomUI } from "../core/AtomUI";
import { AtomControl } from "./AtomControl";

/**
 * Creates and hosts an instance of AtomControl available at given URL. Query string parameters
 * from the url will be passed to view model as initial property values.
 *
 * By default stack is turned off, so elements and controls will be destroyed when new control is hosted.
 */
export class AtomFrame
    extends AtomControl
    implements INotifyPropertyChanged {

    public stack: AtomControl[] = [];

    @BindableProperty
    public url: string;

    @BindableProperty
    public keepStack: boolean = false;

    @BindableProperty
    public current: AtomControl = null;

    public currentDisposable: IDisposable = null;

    public backCommand: Function;

    private navigationService: NavigationService;

    private lastUrl: string;

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

        const ctrl = await AtomLoader.loadView<AtomControl>(uri, this.app);

        this.push(ctrl);

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

    protected preCreate(): void {
        if (!this.element) {
            this.element = document.createElement("section");
        }
        AtomUI.assignID(this.element);
        const style = this.element.style;
        style.position = "absolute";
        style.left = style.right = style.top = style.bottom = "0";
        this.backCommand = () => {
            this.onBackCommand();
        };
    }
}
