import { AtomViewModel } from "../view-model/AtomViewModel";
import { AtomBinder } from "./AtomBinder";
import { AtomDisposableList } from "./AtomDisposableList";
import { IDisposable } from "./types";

export type valuePathOrFunc<T> = ((item: T) => any);

export default class AtomSelectableList<T> {

    public readonly items: Array<ISelectableItem<T>>;

    public readonly selectedItems: Array<ISelectableItem<T>> = [];

    public get selectedIndex(): number {
        if (this.selectedItems.length) {
            return this.items.indexOf(this.selectedItems[0]);
        }
        return -1;
    }

    public set selectedIndex(n: number) {
        this.selectedItems.clear();
        if (n === -1) {
            return;
        }
        this.selectedItems.add(this.items[n]);
    }

    private mValue: any = undefined;
    public get value(): any {
        if (this.selectedItems.length) {
            if (this.allowMultipleSelection) {
                return this.selectedItems.map((x) => this.valuePath(x.item));
            }
            return this.valuePath(this.selectedItems[0].item);
        }
        return this.mValue;
    }

    public set value(v: any) {
        this.mValue = v;
        if (!this.allowMultipleSelection) {
            v = [v];
        }
        const va = v as any;
        const values = this.items.filter((x) => {
            const vp = this.valuePath(x.item);
            const existing = va.find((y) => y === vp );
            return existing ? true : false;
        });
        this.selectedItems.replace(values);
    }

    constructor(
        public allowMultipleSelection: boolean = false,
        public valuePath?: valuePathOrFunc<T>
    ) {
        if (!this.valuePath) {
            this.valuePath = (x) => x;
        }
        this.items = [];
    }

    public replace(source: T[], start?: number, size?: number): void {
        let values = this.value as any[];
        if (!this.allowMultipleSelection) {
            values = [values];
        }
        const map = source.map((x) => {
            const item = this.newItem(x);
            if (values && values.length) {
                const v = this.valuePath(x);
                if (values.find((v1) => v1 === v)) {
                    item.selected = true;
                }
            }
            return item;
        });
        const a = source as any;
        if (a.total) {
            (map as any).total = a.total;
        }
        this.items.replace(map, start, size);
        this.mValue = undefined;
    }

    public find(item: T | ((i: T) => boolean)): ISelectableItem<T> {
        let itemf = (i: T) => (item as any)(i);
        if (typeof item !== "function") {
            const e = item;
            itemf = (i: T) => i === e;
        }
        return this.items.find((i) => itemf(i.item));
    }

    public select(item: T): void {
        const si = this.items.find( (x) => x.item === item);
        si.selected = true;
    }

    public deselect(item: T): void {
        const si = this.items.find( (x) => x.item === item);
        si.selected = false;
    }

    public toggle(item: T): void {
        const si = this.items.find( (x) => x.item === item);
        si.selected = !si.selected;
    }

    // private syncItems(target: T[], key: string, index: number, a: T): void {
    //     switch (key) {
    //         case "reset":
    //         case "refresh":
    //             if (!target.length) {
    //                 this.selectedItems.clear();
    //             } else {
    //                 this.items.replace(target.map( (x) => this.newItem(x) ));
    //             }
    //             this.mValue = undefined;
    //             break;
    //         case "add":
    //             this.items.insert(index, this.newItem(a));
    //             break;
    //         case "remove":
    //             const item = this.items[index];
    //             item.selected = false;
    //             this.items.removeAt(index);
    //             break;
    //     }
    // }

    private newItem(item: T): ISelectableItem<T> {
        const self = this;
        const newItem = {
            item,
            get selected(): boolean {
                return self.selectedItems.find((x) => x === this) ? true : false;
            },
            set selected(v: boolean) {
                if (v) {
                    if (this.selected) {
                        return;
                    }
                    if (!self.allowMultipleSelection) {
                        self.selectedItems.clear();
                    }
                    self.selectedItems.add(this);
                } else {
                    self.selectedItems.remove(this);
                }
                AtomBinder.refreshValue(self, "value");
            }
        };
        // const value = this.valuePath(item);
        // let values = this.value as any[];
        // if (values) {
        //     if (!this.allowMultipleSelection) {
        //         values = [values];
        //     }
        //     if (values.find((x) => x === value)) {
        //         newItem.selected = true;
        //     }
        // }
        return newItem;
    }

}

export interface ISelectableItem<T> {
    selected?: boolean;
    item: T;
}
