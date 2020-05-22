import { AtomViewModel } from "../view-model/AtomViewModel";
import { AtomBinder } from "./AtomBinder";
import { AtomDisposableList } from "./AtomDisposableList";
import { IDisposable } from "./types";

export type valuePathOrFunc<T> = ((item: T) => any);

const isSelectableItem = {};

export default class AtomSelectableList<T> {

    public readonly items: Array<ISelectableItem<T>>;

    public readonly selectedItems: Array<ISelectableItem<T>> = [];

    /**
     * Reference for Paging
     */
    public start: number;

    /**
     * Reference for paging
     */
    public total: number;

    public get selectedIndex(): number {
        if (this.selectedItems.length) {
            return this.items.indexOf(this.selectedItems[0]);
        }
        return -1;
    }

    public set selectedIndex(n: number) {
        this.selectedItems.clear();
        if (n === -1) {
            this.updateBindings(true);
            return;
        }
        this.selectedItems.add(this.items[n]);
    }

    public get selectedItem(): T {
        if (!this.selectedItems.length) {
            return null;
        }
        const s = this.selectedItems[0];
        return s ? s.item : null;
    }

    public set selectedItem(item: T) {
        this.selectedItems.clear();
        if (!item) {
            this.updateBindings(true);
            return;
        }
        const si = this.items.find((s) => s.item === item);
        si.select();
    }

    public get label(): any {
        const labels = this.selectedItems.map((x) => this.labelPath(x.item));
        if (this.allowMultipleSelection) {
            return labels;
        }
        return labels[0] || null;
    }

    public get selectAll(): boolean {
        if (this.items.length) {
            return this.items.length === this.selectedItems.length;
        }
        return false;
    }

    public set selectAll(v: boolean) {
        if (v) {
            this.selectedItems.splice(0, this.selectedItems.length, ... this.items);
        } else {
            this.selectedItems.clear();
        }
        AtomBinder.refreshItems(this.selectedItems);
        for (const iterator of this.items) {
            AtomBinder.refreshValue(iterator, "selected");
        }
    }

    private mValue: any = undefined;
    public get value(): any {
        if (this.allowMultipleSelection && this.items.length) {
            return this.selectedItems.map((x) => this.valuePath(x.item));
        }
        if (this.selectedItems.length) {
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
        this.replaceSelectedInternal(va, false);
    }

    constructor(
        public allowMultipleSelection: boolean = false,
        public valuePath?: valuePathOrFunc<T>,
        public labelPath?: valuePathOrFunc<T>
    ) {
        if (!this.valuePath) {
            this.valuePath = (x) => x;
        }
        if (!this.labelPath) {
            this.labelPath = (x) => (x as any).label || x;
        }
        this.items = [];

    }

    /**
     * Remove all items
     * @param clearValue clear Selection
     */
    public clear(clearValue: boolean = false) {
        if (clearValue) {
            this.replaceSelectedInternal([], false);
        }
        this.items.clear();
    }

    /**
     * Append to existing items
     * @param source source items
     * @param total total number of items
     */
    public append(source: T[], total?: number) {
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
        this.total = total;
        this.items.addAll(map);
        this.mValue = undefined;
        this.updateBindings(true);
    }

    public replace(source: T[], start?: number, size?: number): void {
        let values = this.value as any[];
        if (!this.allowMultipleSelection) {
            values = [values];
        }
        this.selectedItems.clear();
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
        this.updateBindings(true);
    }

    public find(item: T | ((i: T) => boolean)): ISelectableItem<T> {
        let itemF = (i: T) => (item as any)(i);
        if (typeof item !== "function") {
            const e = item;
            itemF = (i: T) => i === e;
        }
        return this.items.find((i) => itemF(i.item));
    }

    public select(item: T | ISelectableItem<T>): void {
        const i = item as ISelectableItem<T>;
        if (i.itemType === isSelectableItem) {
            i.select();
            return;
        }
        const si = this.items.find( (x) => x.item === item);
        si.select();
    }

    public deselect(item: T | ISelectableItem<T>): void {
        const i = item as ISelectableItem<T>;
        if (i.itemType === isSelectableItem) {
            i.deselect();
            return;
        }
        const si = this.items.find( (x) => x.item === item);
        si.deselect();
    }

    public toggle(item: T | ISelectableItem<T>): void {
        const i = item as ISelectableItem<T>;
        if (i.itemType === isSelectableItem) {
            i.toggle();
            return;
        }
        const si = this.items.find( (x) => x.item === item);
        si.toggle();
    }

    public replaceSelected(va: T[]): void {
        this.replaceSelectedInternal(va, true);
    }

    private replaceSelectedInternal(va: T[] = [], refreshValue: boolean = true): void {

        const newItems = !va ? [] : this.items.filter((x) => {
            const vp = this.valuePath(x.item);
            const existing = va.find((y) => y === vp );
            return existing ? true : false;
        });
        const s = this.selectedItems.slice();
        this.selectedItems.clear();
        for (const iterator of s) {
            AtomBinder.refreshValue(iterator, "selected");
        }
        if (newItems.length) {
            this.selectedItems.replace(newItems);
        }

        this.updateBindings(refreshValue);
    }

    private updateBindings(refreshValue: boolean = true) {
        // to prevent recursive updates...
        if (refreshValue) {
            AtomBinder.refreshValue(this, "value");
        }

        AtomBinder.refreshValue(this, "label");
        AtomBinder.refreshValue(this, "selectAll");
        AtomBinder.refreshValue(this, "selectedItem");
        AtomBinder.refreshValue(this, "selectedIndex");
    }

    private newItem(item: T): ISelectableItem<T> {
        const self = this;
        const newItem: ISelectableItem<T> = {
            item,
            itemType: isSelectableItem,
            select: null,
            deselect: null,
            toggle: null,
            get selected(): boolean {
                return self.selectedItems.find((x) => x === this) ? true : false;
            },
            set selected(v: boolean) {
                if (v) {
                    if (this.selected) {
                        return;
                    }
                    self.clearSelected();
                    self.selectedItems.add(this);
                } else {
                    self.selectedItems.remove(this);
                }
                AtomBinder.refreshValue(this, "selected");
                self.updateBindings(true);
            }
        };
        newItem.select = () => {
            newItem.selected = true;
        };
        newItem.deselect = () => {
            newItem.selected = false;
        };
        newItem.toggle = () => {
            newItem.selected = !newItem.selected;
        };

        return newItem;
    }

    private clearSelected() {
        if (!this.allowMultipleSelection) {
            const si = this.selectedItem;
            this.selectedItems.clear();
            AtomBinder.refreshValue(si, "selected");
        }
    }
}

export interface ISelectableItem<T> {
    selected: boolean;
    item: T;
    itemType: any;
    select: () => void;
    deselect: () => void;
    toggle: () => void;
}
