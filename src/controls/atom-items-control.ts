import { AtomBinder } from "../core/atom-binder";
import "../core/atom-list";
import { bindableProperty } from "../core/bindable-properties";
import { IAtomElement, IDisposable } from "../core/types";
import { AtomControl } from "./atom-control";

export class AtomItemsControl extends AtomControl {

    // items,itemTemplate, filter, sort, itemsPresenter
    // allowMultipleSelection, allowSelectFirst selectAll selectedIndex selectedItem selectedItems

    @bindableProperty
    public allowSelectFirst: boolean = false;

    @bindableProperty
    public allowMultipleSelection: boolean = false;

    @bindableProperty
    public valuePath: string = "value";

    @bindableProperty
    public labelPath: string = "label";

    @bindableProperty
    public itemTemplate: any;

    public valueSeparator: string = ", ";

    private mValue: any = undefined;

    private mSortPath: string;

    private mSelectedItems: any[] = [];

    private mFilteredItems: any[] = [];

    private mSelectedItem: any = undefined;

    private mSelectAll: boolean = false;

    public get value(): any {
        if (this.allowMultipleSelection) {
            let items = this.mSelectedItems;
            if (items.length === 0) {
                if (this.mValue !== undefined) {
                    return this.mValue;
                }
                return null;
            }
            items = items.map((m) => m[this.valuePath]);
            if (this.valueSeparator) {
                items = items.join(this.valueSeparator) as any;
            }
            return items;
        }

        let s = this.mSelectedItem;
        if (!s) {
            if (this.mValue !== undefined) {
                return this.mValue;
            }
            return null;
        }
        if (this.valuePath) {
            s = s[this.valuePath];
        }
        return s;
    }
    private mItems: any[] = undefined;
    private mItemsDisposable: IDisposable = null;
    public get items(): any[] {
        return this.mItems;
    }

    public set items(v: any[]) {
        if (this.mItemsDisposable) {
            this.mItemsDisposable.dispose();
            this.mItemsDisposable = null;
        }
        this.mItems = v;
        this.mFilteredItems = null;
        if (v != null) {
            this.mItemsDisposable = AtomBinder.add_CollectionChanged(this.mItems,
                (target, key, index, item) => {
                    this.onCollectionChangedInternal(key, index, item);
            });
            this.onCollectionChangedInternal("refresh", -1, null);
        }
        AtomBinder.refreshValue(this, "items");
    }

    public get selectedItem(): any {
        if (this.mSelectedItem.length > 0) {
                    return this.mSelectedItem[0];
        }
        return null;
    }

    public dispose(e?: IAtomElement): void {
        if (this.mItemsDisposable) {
            this.mItemsDisposable.dispose();
            this.mItemsDisposable = null;
        }
        this.mItems = null;
        this.mFilteredItems = null;
        super.dispose(e);
    }

    public onPropertyChanged(name: string): void {
        switch (name) {
            case "itemTemplate":
            case "labelPath":
            case "valuePath":
                this.onCollectionChangedInternal("refresh", -1, null);
                break;
        }
    }

    public set sortPath(v: string) {
        this.mSortPath = v;
        if (v) {
            this.onCollectionChangedInternal("refresh", -1, null);
        }
    }

    public set selectAll(v: any) {
        if (v === undefined || v === null) {
            return;
        }
        this.mSelectedItems.length = 0;
        const items: any[] = this.mItems;
        if (v && items) {
            for (const itm of items) {
                this.mSelectedItems.push(itm);
                }
            }
        this.mSelectAll = true;
        AtomBinder.refreshItems(this.mSelectedItems);
    }

    // tslint:disable-next-line:no-empty
    protected onCollectionChangedInternal(key: string, index: number, item: any): void {
    }
}
