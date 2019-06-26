import { AtomBinder } from "../../core/AtomBinder";
import { AtomDispatcher } from "../../core/AtomDispatcher";
import AtomEnumerator from "../../core/AtomEnumerator";
import "../../core/AtomList";
import { BindableProperty } from "../../core/BindableProperty";
import { IAtomElement, IClassOf, IDisposable } from "../../core/types";
import { AtomUI, ChildEnumerator } from "../../web/core/AtomUI";
import { AtomControl } from "./AtomControl";

export class AtomItemsControl extends AtomControl {
    @BindableProperty
    public mAllowSelectFirst: boolean = false;

    @BindableProperty
    public allowMultipleSelection: boolean = false;

    @BindableProperty
    public valuePath: string = "value";

    @BindableProperty
    public labelPath: string = "label";

    @BindableProperty
    public itemTemplate: IClassOf<AtomControl>;

    @BindableProperty
    public version: number = 1;

    public autoScrollToSelection: any = false;

    public sort: string | ((a: any, b: any) => number) = null;

    public valueSeparator: string = ", ";

    public uiVirtualize: any = false;

    private mValue: any = undefined;

    private mSelectedItems: any[];

    private mSelectedItemsWatcher: IDisposable;

    private itemsInvalidated: any;

    // private mFilteredItems: any[] = [];

    // private mSelectedItem: any = undefined;

    private mFilter: any = undefined;

    private mSelectAll: boolean = false;

    private mItemsPresenter: HTMLElement;

    private mFirstChild: HTMLElement = null;

    private mLastChild: HTMLElement = null;

    private mScrollerSetup: any = false;

    private mScopes: any = null;

    private mVirtualContainer: any;

    private mChildItemType: any;

    private scrollTimeout: any;

    private mTraining: any;

    private mAvgHeight: any;

    private mAvgWidth: any;

    private mAllRows: any;

    private mColumns: any;

    private mVisibleRows: any;

    private mVisibleHeight: any;

    private mReady: any;

    private mIsChanging: any;

    private mOnUIChanged: any;

    private lastScrollTop: any;

    private mPromises: any;

    private mItems: any[] = undefined;

    private mItemsDisposable: IDisposable = null;

    private isUpdating = false;

    public get itemsPresenter(): HTMLElement {
        return this.mItemsPresenter || (this.mItemsPresenter = this.element);
    }

    public set itemsPresenter(v: HTMLElement) {
        this.mItemsPresenter = v;
        AtomBinder.refreshValue(this, "itemsPresenter");
    }

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

        let s = this.selectedItem;
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

    public set value(v: any) {
        this.mValue = v;
        const dataItems = this.items;
        if (!dataItems) {
            return;
        }
        const sItems = this.selectedItems;
        if (v === undefined || v === null) {
            // reset...
            AtomBinder.clear(sItems);
            return;
        }
        if (this.allowMultipleSelection && this.valueSeparator) {
            if (typeof v !== "string") {
                v = "" + v;
            }
            v = (v as string).split(this.valueSeparator);
        } else {
            v = [v];
        }
        // const items = AtomArray.intersect(dataItems, this._valuePath, v);
        sItems.length = 0;
        const vp = this.valuePath;
        for (const item of v) {
            // tslint:disable-next-line:triple-equals
            const dataItem = dataItems.find( (i) => i[vp] == v);
            if (dataItem) {
                sItems.push(dataItem);
            }
        }
        // this.updateSelectionBindings();
        AtomBinder.refreshItems(sItems);
    }

    public get items(): any[] {
        return this.mItems;
    }

    public set items(v: any[]) {
        if (this.mItemsDisposable) {
            this.mItemsDisposable.dispose();
            this.mItemsDisposable = null;
        }
        this.mItems = v;
        // this.mFilteredItems = null;
        if (v != null) {
            this.mItemsDisposable = this.registerDisposable(AtomBinder.add_CollectionChanged(v,
                (target, key, index, item) => {
                    this.onCollectionChangedInternal(key, index, item);
            }));
            // this.onCollectionChangedInternal("refresh", -1, null);
        }
        AtomBinder.refreshValue(this, "items");
    }

    public get selectedItem(): any {
        if (this.selectedItems.length > 0) {
            return this.selectedItems[0];
        }
        return null;
    }

    public set selectedItem(value: any) {
        if (value !== undefined && value !== null) {
            this.mSelectedItems.length = 1;
            this.mSelectedItems[0] = value;
        } else {
            this.mSelectedItems.length = 0;
        }
        AtomBinder.refreshItems(this.mSelectedItems);
    }

    public get selectedItems() {
        return this.mSelectedItems || (this.selectedItems = []);
    }

    public set selectedItems(v: any[]) {
        if (this.mSelectedItemsWatcher) {
            this.mSelectedItemsWatcher.dispose();
            this.mSelectedItemsWatcher = null;
        }
        this.mSelectedItems = v;
        if (v) {
            this.mSelectedItemsWatcher = this.registerDisposable(AtomBinder.add_CollectionChanged(v,
                (t, k, i, item) => {
                    this.onSelectedItemsChanged(k, i, item);
                }));
        }
    }

    public get selectedIndex(): number {
        if (!this.mItems) {
            return -1;
        }
        const item: any = this.selectedItem;
        return this.mItems.indexOf(item);
    }

    public set selectedIndex(n: number) {
        if (!this.mItems) {
            return;
        }
        if (n <= -1 || n >= this.mItems.length) {
            this.selectedItem = null;
            return;
        }
        this.selectedItem = this.mItems[n];
    }

    public dispose(e?: HTMLElement): void {
        this.items = null;
        this.selectedItems = null;
        // this.mFilteredItems = null;
        super.dispose(e);
    }

    public onPropertyChanged(name: string): void {
        switch (name) {
            case "itemsPresenter":
            case "itemTemplate":
            case "labelPath":
            case "valuePath":
            case "items":
            case "filter":
            case "sort":
                if (this.mItems) {
                    this.invalidateItems();
                }
                // this.runAfterInit(() => {
                //     if (this.mItems) {
                //         this.onCollectionChangedInternal("refresh", -1, null);
                //     }
                // });
                break;
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

    public resetVirtualContainer() {
        const ip = this.itemsPresenter;
        if (ip) {
            this.disposeChildren(ip);
        }
        this.mFirstChild = null;
        this.mLastChild = null;
        this.mScrollerSetup = false;
        this.mScopes = null;
        this.unbindEvent(this.mVirtualContainer, "scroll");
    }

    public postVirtualCollectionChanged(): void {
        this.app.callLater(() => {
            this.onVirtualCollectionChanged();
        });
    }

    public onVirtualCollectionChanged() {

        const ip = this.itemsPresenter;

        const items = this.items;
        if (!items.length) {
            this.resetVirtualContainer();
            return;
        }

        this.validateScroller();

        const fc = this.mFirstChild;
        const lc = this.mLastChild;

        const vc = this.mVirtualContainer;

        const vcHeight = AtomUI.innerHeight(vc);
        const vcScrollHeight = vc.scrollHeight;

        if ( isNaN(vcHeight) || vcHeight <= 0 || vcScrollHeight <= 0) {
            setTimeout(() => {
                this.onVirtualCollectionChanged();
            }, 1000);
            return;
        }

        const vcWidth = AtomUI.innerWidth(vc);

        let avgHeight = this.mAvgHeight;
        let avgWidth = this.mAvgWidth;

        const itemsHeight = vc.scrollHeight - AtomUI.outerHeight(fc) - AtomUI.outerHeight(lc);
        const itemsWidth = AtomUI.innerWidth(ip);

        const element = this.element;

        let ce: HTMLElement;

        let ae = new AtomEnumerator(items);

        if (this.mTraining) {
            if (vcHeight >= itemsHeight) {
                // lets add item...
                ce = lc.previousElementSibling as HTMLElement;
                if (ce !== fc) {
                    const data = (ce as HTMLElement).atomControl.data;
                    while (ae.next()) {
                        if (ae.current === data) { break; }
                    }
                }

                if (ae.next()) {
                    const data = ae.current;
                    const elementChild = this.createChild(null, data);
                    ip.insertBefore(elementChild.element, lc);
                    this.postVirtualCollectionChanged();
                }
            } else {

                // calculate avg height
                let totalVisibleItems = 0;
                ce = fc.nextElementSibling as HTMLElement;
                let allHeight = 0;
                let allWidth = 0;
                while (ce !== lc) {
                    totalVisibleItems++;
                    allHeight += AtomUI.outerHeight(ce);
                    allWidth += AtomUI.outerWidth(ce);
                    ce = ce.nextElementSibling as HTMLElement;
                }
                avgHeight = allHeight / totalVisibleItems;
                avgWidth = allWidth / totalVisibleItems;
                totalVisibleItems--;
                this.mAvgHeight = avgHeight;
                this.mAvgWidth = avgWidth;

                const columns = Math.floor(vcWidth / avgWidth);
                const allRows = Math.ceil(items.length / columns);
                const visibleRows = Math.ceil(totalVisibleItems / columns);

                // tslint:disable-next-line:no-console
                console.log({
                    avgWidth,
                    avgHeight,
                    totalVisibleItems,
                    allRows,
                    columns
                });

                this.mAllRows = allRows;
                this.mColumns = columns;

                this.mVisibleRows = visibleRows;
                this.mVisibleHeight = visibleRows * avgHeight;

                // set height of last child... to increase padding
                lc.style.height = ((allRows - visibleRows + 1) * avgHeight) + "px";
                this.mTraining = false;
                this.mReady = true;
                this.postVirtualCollectionChanged();
            }
            return;

        }

        const self = this;

        this.lastScrollTop = vc.scrollTop;

        if (this.mIsChanging) {
            // setTimeout(function () {
            //    self.onVirtualCollectionChanged();
            // }, 100);
            return;
        }
        this.mIsChanging = true;

        const block = Math.floor(this.mVisibleHeight / avgHeight);
        const itemsInBlock = this.mVisibleRows * this.mColumns;

        // lets simply recreate the view... if we are out of the scroll bounds...
        const index = Math.floor(vc.scrollTop / this.mVisibleHeight);
        const itemIndex = index * itemsInBlock;
        // console.log("First block index is " + index + " item index is " + index * itemsInBlock);

        if (itemIndex >= items.length) {
            this.mIsChanging = false;
            return;
        }

        const lastIndex = Math.min( (Math.max(index, 0) + 3 ) * itemsInBlock - 1, items.length - 1);
        const firstIndex =  Math.max(0, (index) * itemsInBlock);

        ce = fc.nextElementSibling as HTMLElement;

        const firstItem = fc.nextElementSibling as HTMLElement;
        const lastItem = lc.previousElementSibling as HTMLElement;

        if (firstItem !== lastItem) {
            const firstVisibleIndex = items.indexOf(firstItem.atomControl.data);
            const lastVisibleIndex = items.indexOf(lastItem.atomControl.data);
            // tslint:disable-next-line:no-console
            console.log({
                firstVisibleIndex,
                firstIndex,
                lastVisibleIndex,
                lastIndex
            });
            if (firstIndex >= firstVisibleIndex && lastIndex <= lastVisibleIndex) {
                // tslint:disable-next-line:no-console
                console.log("All items are visible...");
                this.mIsChanging = false;
                return;
            }
        }

        const remove = [];
        const cache = {};

        while (ce !== lc) {
            const c = ce;
            ce = ce.nextElementSibling as HTMLElement;
            const s = items.indexOf(c.atomControl.data);
            cache[s] = c;
            remove.push(c);
        }

        this.app.dispatcher.pause();

        ae = new AtomEnumerator(items);
        for (let i = 0; i < firstIndex; i++) {
            ae.next();
        }

        let after = fc;

        let last = null;

        const add = [];

        for (let i = firstIndex; i <= lastIndex; i++) {
            if (!ae.next()) {
                break;
            }
            const index2 = ae.currentIndex;
            const data = ae.current;
            let elementChild = cache[index2];
            if (elementChild && element.atomControl.data === data) {
                cache[index2] = null;
            } else {
                elementChild = this.createChild(null, data).element;
            }
            elementChild.before = after;
            add.push(elementChild);
            after = elementChild;
            last = index2;
        }

        const h = (this.mAllRows - block * 3) * avgHeight -  index * this.mVisibleHeight;
        // tslint:disable-next-line:no-console
        console.log("last child height = " + h);

        this.app.callLater(() => {

            const oldHeight = AtomUI.outerHeight(fc);
            const newHeight = index * this.mVisibleHeight;

            const diff = newHeight - oldHeight;
            const oldScrollTop = vc.scrollTop;

            const a = new AtomEnumerator(add);
            while (a.next()) {
                const ec = a.current;
                ip.insertBefore(ec, ec.before.nextElementSibling);
                ec.before = null;
            }

            fc.style.height = newHeight + "px";

            for (const iterator of remove) {
                if (!iterator.before) {
                    iterator.atomControl.dispose();
                }
                iterator.remove();
            }
            // const a = new AtomEnumerator(remove);
            // while (a.next()) {
            //     const ec = a.current();
            //     if (!ec.before) {
            //         ec.atomControl.dispose();
            //     }
            //     ec.remove();
            // }

            // vc.scrollTop = oldScrollTop - diff;

            lc.style.height = h + "px";

            // tslint:disable-next-line:no-console
            console.log(`Old: ${oldScrollTop} Diff: ${diff} Old Height: ${oldHeight} Height: ${newHeight}`);

            this.mIsChanging = false;

        });

        this.app.dispatcher.start();

        AtomBinder.refreshValue(this, "childAtomControls");
    }

    public isSelected(item: any) {
        let selectedItem = null;
        for (const iterator of this.mSelectedItems) {
            selectedItem = iterator;
            if (selectedItem === item) {
                return true;
            }
        }
        return false;
    }

    public bringIntoView(data: any): void {
        this.app.callLater(() => {
            const en = new ChildEnumerator(this.itemsPresenter || this.element);
            while (en.next()) {
                const item = en.current;
                const dataItem = item.atomControl ? item.atomControl.data : item;
                if (dataItem === data) {
                    item.scrollIntoView();
                    return;
                }
            }
        });
    }

    public bringSelectionIntoView() {

        // do not scroll for first auto select
        // if (this.mAllowSelectFirst && this.get_selectedIndex() === 0) {
        //     return;
        // }

        if (this.uiVirtualize) {

            const index = this.selectedIndex;
            if (!this.mReady) {
                setTimeout(() => {
                    this.bringSelectionIntoView();
                }, 1000);
                return;
            }
            const avgHeight = this.mAvgHeight;

            const vcHeight =  AtomUI.innerHeight(this.mVirtualContainer);

            const block = Math.ceil(vcHeight / avgHeight);
            const itemsInBlock = block * this.mColumns;

            const scrollTop = Math.floor(index / itemsInBlock);
            AtomUI.scrollTop(this.mVirtualContainer, scrollTop * vcHeight);
            return;
        }
        const en = new ChildEnumerator(this.itemsPresenter || this.element);
        while (en.next()) {
            const item: any = en.current;
            const dataItem = item.atomControl ? item.atomControl.get_data() : item;
            if (this.isSelected(dataItem)) {
                item.scrollIntoView();
                return;
            }
        }
    }

    public updateSelectionBindings(): void {
        this.version = this.version + 1;
        if (this.mSelectedItems && this.mSelectedItems.length) {
            this.mValue = undefined;
        }
        AtomBinder.refreshValue(this, "value");
        AtomBinder.refreshValue(this, "selectedItem");
        AtomBinder.refreshValue(this, "selectedItems");
        AtomBinder.refreshValue(this, "selectedIndex");
        if (!this.mSelectedItems.length) {
            if (this.mSelectAll === true) {
                this.mSelectAll = false;
                AtomBinder.refreshValue(this, "selectAll");
            }
        }
    }

    public onSelectedItemsChanged(type: any, index: any, item: any) {
        if (!this.mOnUIChanged) {
            // this.updateChildSelections(type, index, item);
            if (this.autoScrollToSelection) {
                this.bringSelectionIntoView();
            }
        }
        this.updateSelectionBindings();
        // AtomControl.updateUI();

        // this.invokePost();
    }

    public hasItems() {
        return this.mItems !== undefined && this.mItems !== null;
    }

    public invalidateItems(): void {
        if (this.pendingInits || this.isUpdating) {
            setTimeout(() => {
                this.invalidateItems();
            }, 5);
            return;
        }
        if (this.itemsInvalidated) {
            clearTimeout(this.itemsInvalidated);
            this.itemsInvalidated = 0;
        }
        this.itemsInvalidated = setTimeout(() => {
            this.itemsInvalidated = 0;
            this.onCollectionChangedInternal("refresh", -1, null);
        }, 5);
        // this.registerDisposable({
        //     dispose: () => {
        //         if (this.itemsInvalidated) {
        //             clearTimeout(this.itemsInvalidated);
        //         }
        //     }
        // });
    }

    public onCollectionChanged(key: string, index: number, item: any): any {

        if (!this.mItems) {
            return;
        }

        if (!this.itemTemplate) {
            return;
        }

        if (!this.itemsPresenter) {
            this.itemsPresenter = this.element as HTMLElement;
        }

        this.version = this.version + 1;

        if (/reset|refresh/i.test(key)) {
            this.resetVirtualContainer();
        }

        if (/remove/gi.test(key)) {
            // tslint:disable-next-line:no-shadowed-variable
            const ip = this.itemsPresenter || this.element;
            const en = new ChildEnumerator(ip);
            while (en.next()) {
                const ce = en.current;
                // tslint:disable-next-line:no-shadowed-variable
                const c = ce;
                if (c.atomControl && c.atomControl.data === item) {
                    c.atomControl.dispose();
                    ce.remove();
                    break;
                }
            }
            // AtomControl.updateUI();
            return;
        }

        if (this.uiVirtualize) {
            this.onVirtualCollectionChanged();
            return;
        }
        // AtomUIComponent
        const parentScope = undefined;
        // const parentScope = this.get_scope();

        // const et = this.getTemplate("itemTemplate");
        // if (et) {
        //     et = AtomUI.getAtomType(et);
        //     if (et) {
        //         this._childItemType = et;
        //     }
        // }

        let items: any[] = this.mFilter ? this.mItems.filter(this.mFilter) : this.mItems;
        let s = this.sort;
        if (s) {
            if (typeof s === "string") {
                const sp = s;
                s = (l, r) => {
                    const lv: string = (l[sp] || "").toString();
                    const rv: string = (r[sp] || "").toString();
                    return lv.toLowerCase().localeCompare(rv.toLowerCase());
                };
            }
            items = items.sort(s);
        }

        if (/add/gi.test(key)) {
           // WebAtoms.dispatcher.pause();

            // for (const aeItem of this.mItems) {
            //     for (const ceItem of AtomUI.childEnumerator(this.itemsPresenter)) {
            //         const d: any = ceItem;
            //         if (aeItem.currentIndex() === index) {
            //             const ctl: any = this.createChildElement(parentScope, this.itemsPresenter, item, aeItem, d);
            //             this.applyItemStyle(ctl, item, aeItem.isFirst(), aeItem.isLast());
            //             break;
            //         }
            //         if (aeItem.isLast()) {
            // tslint:disable-next-line:max-line-length
            //             const ctl: any = this.createChildElement(parentScope, this.itemsPresenter, item, aeItem, null);
            //             this.applyItemStyle(ctl, item, aeItem.isFirst(), aeItem.isLast());
            //             break;
            //         }
            //     }
            // }

           // WebAtoms.dispatcher.start();
            // AtomControl.updateUI();

            const lastItem = items[index];
            let last: HTMLElement = null;
            let cIndex: number = 0;
            const en = new ChildEnumerator(this.itemsPresenter);
            while (en.next()) {
                if (cIndex === index) {
                    last = en.current;
                    break;
                }
                cIndex++;
            }
            const df2 = document.createDocumentFragment();
            this.createChild(df2, lastItem);
            if (last) {
                this.itemsPresenter.insertBefore(df2, last);
            } else {
                this.itemsPresenter.appendChild(df2);
            }
            return;
        }

        const element = this.itemsPresenter;

        // const dataItems = this.get_dataItems();

        // AtomControl.disposeChildren(element);

        this.disposeChildren(this.itemsPresenter);

        // WebAtoms.dispatcher.pause();

        // const items = this.get_dataItems(true);

        const added = [];

        // this.getTemplate("itemTemplate");

        // tslint:disable-next-line:no-console
        // console.log("Started");
        // const df = document.createDocumentFragment();

        const ip = this.itemsPresenter || this.element;

        for (const mItem of items) {
            const data = mItem;
            // const elementChild = this.createChildElement(parentScope, element, data, mItem, null);
            // added.push(elementChild);
            // this.applyItemStyle(elementChild, data, mItem.isFirst(), mItem.isLast());
            const ac = this.createChild(null, data);
            ip.appendChild(ac.element);
        }

        // (this.element as HTMLElement).appendChild(df);
        // tslint:disable-next-line:no-console
        // console.log("Ended");

        // const self = this;
        // WebAtoms.dispatcher.callLater(() => {
        //     const dirty = [];

        //     for (const elementItem of AtomUI.childEnumerator(element)) {
        //         const ct = elementItem;
        //         const func = added.filter((fx) => ct === fx);
        //         if (func.pop() !== ct) {
        //             dirty.push(ct);
        //         }
        //     }

        //     for (const dirtyItem of dirty) {
        //         const drt = dirtyItem;
        //         if (drt.atomControl) {
        //             drt.atomControl.dispose();
        //         }
        //         AtomUI.remove(item);
        //     }

        //     });

       // WebAtoms.dispatcher.start();

        // AtomBinder.refreshValue(this, "childAtomControls");
    }

    protected preCreate(): void {
        super.preCreate();
        this.itemTemplate = AtomItemsControlItemTemplate;
    }

    protected onCollectionChangedInternal(key: string, index: number, item: any): void {
        // Atom.refresh(this, "allValues");
        // AtomBinder.refreshValue(this, "allValues");
        const value = this.value;

        try {
            this.isUpdating = true;
            this.onCollectionChanged(key, index, item);

            if (value) {
                if (!(value || this.mAllowSelectFirst)) {
                    AtomBinder.clear(this.mSelectedItems);
                }
            }
            if (value != null) {
                this.value  = value;
                if (this.selectedIndex !== -1) {
                    return;
                } else {
                    this.mValue = undefined;
                }
            }
        } finally {
            this.app.callLater(() => {
                this.isUpdating = false;
            });
        }
        // this.selectDefault();
    }

    public set allowSelectFirst(b: any) {
        b = b ? b !== "false" : b;
        this.mAllowSelectFirst = b;
    }

    public set filter(f: any) {
        if (f === this.mFilter) {
            return;
        }
        this.mFilter = f;
        // this.mFilteredItems = null;
        AtomBinder.refreshValue(this, "filter");
    }

    protected onScroll() {
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        this.scrollTimeout = setTimeout(() => {
            this.scrollTimeout = 0;
            this.onVirtualCollectionChanged();
        }, 10);
    }

    protected toggleSelection(data: any) {
        this.mOnUIChanged = true;
        this.mValue = undefined;
        if (this.allowMultipleSelection) {
            if (this.mSelectedItems.indexOf(data) !== -1) {
                AtomBinder.removeItem(this.mSelectedItems, data);
            } else {
                AtomBinder.addItem(this.mSelectedItems, data);
            }
        } else {
            this.mSelectedItems.length = 1;
            this.mSelectedItems[0] = data;
            AtomBinder.refreshItems(this.mSelectedItems);
        }
        this.mOnUIChanged = false;
    }

    protected validateScroller(): void {

        if (this.mScrollerSetup) {
            return;
        }

        const ip = this.itemsPresenter;
        const e = this.element;

        let vc: HTMLElement = this.mVirtualContainer;
        if (!vc) {
            if (ip === e || /table/i.test(e.nodeName)) {
                throw new Error("virtualContainer presenter not found,"
                + "you must put itemsPresenter inside a virtualContainer in order for Virtualization to work");
            } else {
                vc = this.mVirtualContainer = this.element;
            }
        }

        vc.style.overflow = "auto";

        this.bindEvent(vc, "scroll", () => {
            this.onScroll();
        });

        ip.style.overflow = "hidden";

        // this.validateScroller = null;

        const isTable = /tbody/i.test(ip.nodeName);

        let fc: HTMLElement;
        let lc: HTMLElement;

        if (isTable) {
            fc = document.createElement("TR");
            lc = document.createElement("TR");
        } else {
            fc = document.createElement("DIV");
            lc = document.createElement("DIV");
        }

        fc.classList.add("sticky");
        fc.classList.add("first-child");

        lc.classList.add("sticky");
        lc.classList.add("last-child");

        fc.style.position = "relative";
        fc.style.height = "0";
        fc.style.width = "100%";
        fc.style.clear = "both";

        lc.style.position = "relative";
        lc.style.height = "0";
        lc.style.width = "100%";
        lc.style.clear = "both";

        this.mFirstChild = fc;
        this.mLastChild = lc;

        ip.appendChild(fc);
        ip.appendChild(lc);

        // let us train ourselves to find average height/width
        this.mTraining = true;
        this.mScrollerSetup = true;
    }

    protected createChild(df: DocumentFragment, data: any): AtomControl {
        const t = this.itemTemplate;
        const ac = this.app.resolve(t, true);
        const e = ac.element;
        e._logicalParent = this.element;
        e._templateParent = this;
        if (df) {
            df.appendChild(ac.element as HTMLElement);
        }
        ac.data = data;
        return ac;
    }

    protected disposeChildren(e: HTMLElement): void {
        const en = new ChildEnumerator(e);
        while (en.next()) {
            const iterator = en.current;
            const ac = (iterator as any).atomControl as AtomControl;
            if (ac) {
                ac.dispose();
            }
        }
        e.innerHTML = "";
    }
}

class AtomItemsControlItemTemplate extends AtomControl {

    protected create(): void {
        this.element = document.createElement("div");
        this.runAfterInit(() => {
            const tp = this.templateParent as AtomItemsControl;
            this.element.textContent = this.data[tp.valuePath];
        });
    }
}
