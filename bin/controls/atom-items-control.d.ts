import "../core/atom-list";
import { IAtomElement } from "../core/types";
import { AtomControl } from "./atom-control";
export declare class AtomItemsControl extends AtomControl {
    allowSelectFirst: boolean;
    allowMultipleSelection: boolean;
    valuePath: string;
    labelPath: string;
    itemTemplate: any;
    valueSeparator: string;
    private mValue;
    private mSortPath;
    private mSelectedItems;
    private mFilteredItems;
    private mSelectedItem;
    private mSelectAll;
    readonly value: any;
    private mItems;
    private mItemsDisposable;
    items: any[];
    readonly selectedItem: any;
    dispose(e?: IAtomElement): void;
    onPropertyChanged(name: string): void;
    sortPath: string;
    selectAll: any;
    protected onCollectionChangedInternal(key: string, index: number, item: any): void;
}
