import { AtomViewModel } from "../view-model/AtomViewModel";
import { AtomDisposableList } from "./AtomDisposableList";
import { IDisposable } from "./types";

export type valuePathOrFunc<T> = string | ((item: T) => any);

export default class AtomSelectableList<T> {

    public readonly items: Array<ISelectableItem<T>>;

    public readonly selectedItems: Array<ISelectableItem<T>> = [];

    private mValue: any = undefined;
    public get value(): any {
        if (this.mValue !== undefined) {
            return this.mValue;
        }
    }
    public set value(v: any) {
        this.mValue = v;
    }

    constructor(
        source: T[],
        public valuePath?: valuePathOrFunc<T>,
        public allowMultipleSelection: boolean = false,
        disposablesOrVM?: AtomDisposableList | AtomViewModel
    ) {
        if (disposablesOrVM) {
            if (disposablesOrVM instanceof AtomViewModel) {
                disposablesOrVM.registerDisposable(source.watch((target, key, index, item) => {
                    this.syncItems(target, key, index, item);
                }));
            } else {
                disposablesOrVM.add(source.watch((target, key, index, item) => {
                    this.syncItems(target, key, index, item);
                }));
            }
        }
        this.items = source.map((x) => this.newItem(x));
    }

    private syncItems(target: T[], key: string, index: number, a: T): void {
        switch (key) {
            case "reset":
            case "refresh":
                this.items.replace(target.map( (x) => this.newItem(x) ));
                break;
            case "add":
                this.items.insert(index, this.newItem(a));
                break;
            case "remove":
                const item = this.items[index];
                item.selected = false;
                this.items.removeAt(index);
                break;
        }
    }

    private newItem(item: T): ISelectableItem<T> {
        const self = this;
        return {
            item,
            get selected(): boolean {
                return self.selectedItems.find((x) => x.item === item) ? true : false;
            },
            set selected(v: boolean) {
                if (v) {
                    if (this.selected) {
                        return;
                    }
                    self.selectedItems.add(this);
                } else {
                    self.selectedItems.remove(this);
                }
            }
        };
    }

}

export interface ISelectableItem<T> {
    selected?: boolean;
    item: T;
}
