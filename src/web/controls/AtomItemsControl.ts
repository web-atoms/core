import { AtomBinder } from "../../core/AtomBinder";
import "../../core/AtomList";
import { BindableProperty } from "../../core/BindableProperty";
import { IAtomElement, IClassOf, IDisposable } from "../../core/types";
import { AtomUI, ChildEnumerator } from "../../web/core/AtomUI";
import { AtomControl, IAtomControlElement } from "./AtomControl";

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
    public itemTemplate: IClassOf<AtomControl> = AtomItemsControlItemTemplate;

    public valueSeparator: string = ", ";

    private mValue: any = undefined;

    private mSortPath: string;

    private mSelectedItems: any[];
    private mSelectedItemsWatcher: IDisposable;

    // private mFilteredItems: any[] = [];

    // private mSelectedItem: any = undefined;

    private mFilter: any = undefined;

    private mSelectAll: boolean = false;

    private mItemsPresenter: HTMLElement;

    private mFirstChild: any = null;

    private mLastChild: any = null;

    private mScrollerSetup: any = false;

    private mScopes: any = null;

    private mVirtualContainer: any;

    private mUiVirtualize: any;

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

    private mAutoScrollToSelection: any;

    private lastScrollTop: any;

    private mPromises: any;

    private mItems: any[] = undefined;

    private mItemsDisposable: IDisposable = null;

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
        const sitems = this.selectedItems;
        if (v === undefined || v === null) {
            // reset...
            AtomBinder.clear(sitems);
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
        // var items = AtomArray.intersect(dataItems, this._valuePath, v);
        sitems.length = 0;
        const vp = this.valuePath;
        for (const item of v) {
            // tslint:disable-next-line:triple-equals
            if (dataItems.filter( (f) => f[vp] == item ).length) {
                sitems.push(item);
            }
        }
        AtomBinder.refreshItems(sitems);
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
            this.mItemsDisposable = AtomBinder.add_CollectionChanged(v,
                (target, key, index, item) => {
                    this.onCollectionChangedInternal(key, index, item);
            });
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
        if (value) {
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
            this.mSelectedItemsWatcher = AtomBinder.add_CollectionChanged(v,
                (t, k, i, item) => {
                    this.onSelectedItemsChanged(k, i, item);
                });
        }
    }

    public get selectedIndex() {
        if (!this.mItems) {
            return -1;
        }
        const item: any = this.selectedItem;
        return this.mItems.indexOf(item);
    }

    // public getIndexOfDataItem(item: any) {
    //     if (item === null) {
    //         return -1;
    //     }
    //     const array = this.get_dataItems();
    //     for (const itm of array) {
    //         if (itm === item) {
    //             return itm;
    //         }
    //     }
    //     return -1;
    // }

    // public get itemTemplate(): IClassOf<AtomControl> {
    //     return this.mItemTemplate;
    // }

    // public set itemTemplate(v: IClassOf<AtomControl>) {
    //     this.mItemTemplate = v;
    //     this.onCollectionChangedInternal("refresh", -1, null);
    // }

    // public get_dataItems() {
    //     let r: any[] = this.mItems;
    //     if (r) {
    //         const f = this.mFilter;
    //         if (f) {
    //             let a = [];
    //             if (typeof f === "object") {
    //                 a = Atom.query(r).where(f).toArray();
    //             } else {
    //                 for (const itm of r) {
    //                     const item = itm;
    //                     if (f(item, item.currentIndex)) {
    //                         a.push(item);
    //                     }
    //                 }
    //             }
    //             this.mFilteredItems = a;
    //             r = a;
    //         }

    //         // const sp = this.mSortPath;
    //         // if (sp) {
    //         //     const spf = window.AtomFilter.sort(sp);
    //         //     r = r.sort(spf);
    //         // }
    //         return r;
    //     }
    //     return $(this.itemsPresenter).children();
    // }

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
                this.invalidate();
                // this.runAfterInit(() => {
                //     if (this.mItems) {
                //         this.onCollectionChangedInternal("refresh", -1, null);
                //     }
                // });
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

    public resetVirtulContainer() {
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

    public postVirtualCollectionChanged() {
        // WebAtoms.dispatcher.callLater(() => {
        //     this.onVirtualCollectionChanged();
        // });
    }

    public onVirtualCollectionChanged(): any {
        const ip = this.itemsPresenter;
        const items = null;
        // const items = this.get_dataItems();
        // if (!items.length) {
        //     this.resetVirtulContainer();
        //     return;
        // }
        this.validateScroller();
        const fc = this.mFirstChild;
        const lc = this.mLastChild;
        const vc = this.mVirtualContainer;
        const vcHeight = AtomUI.innerHeight(vc);
        const vcScrollHeight = vc.scrollHeight;
        if (isNaN(vcHeight) || vcHeight <= 0 || vcScrollHeight <= 0) {
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

       // const parentScope = this.get_scope();

        const element = this.element;

        if (this.mTraining) {
            if (vcHeight >= itemsHeight) {
                // lets add item...
                const pes = lc.previousElementSibling;
                if (pes !== fc) {
                    const dt = pes.atomControl.get_data();
                    // for (const aeItem of items) {
                    //     if (aeItem === dt) {
                    //         break;
                    //     }
                    // }
                }

                // if (items) {
                //     const dt1 = items[0];
                //     const emtChild = this.createChildElement(parentScope, null, dt1, ae, null);
                //     ip.insertBefore(emtChild, lc);
                //     this.applyItemStyle(emtChild, dt1, items.isFirst(), items.isLast());
                //     this.postVirtualCollectionChanged();
                // }
            } else {

                // calculate avg height
                let totalVisibleItems = 0;
                let nes = fc.nextElementSibling;
                let allHeight = 0;
                let allWidth = 0;
                while (nes !== lc) {
                    totalVisibleItems++;
                    allHeight += AtomUI.outerHeight(nes, true);
                    allWidth += AtomUI.outerWidth(nes, true);
                    nes = nes.nextElementSibling;
                }
                avgHeight = allHeight / totalVisibleItems;
                avgWidth = allWidth / totalVisibleItems;
                totalVisibleItems--;
                this.mAvgHeight = avgHeight;
                this.mAvgWidth = avgWidth;

                const columns = Math.floor(vcWidth / avgWidth);
                const allRows = Math.ceil(items.length / columns);
                const visibleRows = Math.ceil(totalVisibleItems / columns);
                this.mAllRows = allRows;
                this.mColumns = columns;
                this.mVisibleRows = visibleRows;
                this.mVisibleHeight = visibleRows * avgHeight;
                AtomUI.css(lc, {
                    height: ((allRows - visibleRows + 1) * avgHeight) + "px"
                });
                this.mTraining = false;
                this.mReady = true;
                this.postVirtualCollectionChanged();
                }
            return;

            }
        this.lastScrollTop = vc.scrollTop;
        if (this.mIsChanging) {
            return;
        }
        this.mIsChanging = true;
        const block = Math.floor(this.mVisibleHeight / avgHeight);
        const itemsInBlock = this.mVisibleRows * this.mColumns;

        // lets simply recreate the view... if we are out of the scroll bounds...
        const index = Math.floor(vc.scrollTop / this.mVisibleHeight);
        const itemIndex = index * itemsInBlock;
        // if (itemIndex >= items.length) {
        //     this.mIsChanging = false;
        //     return;
        // }
        const lastIndex = (Math.max(index, 0) + 3) * itemsInBlock - 1;
        const firstIndex = Math.max(0, (index) * itemsInBlock);

        let ce = fc.nextElementSibling;

        const firstItem = fc.nextElementSibling;
        const lastItem = lc.previousElementSibling;

        if (firstItem !== lastItem) {
            const firstVisibleIndex = firstItem.atomControl.get_scope().itemIndex;
            const lastVisibleIndex = lastItem.atomControl.get_scope().itemIndex;
            if (firstIndex >= firstVisibleIndex && lastIndex <= lastVisibleIndex) {
                // console.log("All items are visible...");
                this.mIsChanging = false;
                return;
            }
        }

        const remove = [];
        const cache = {};

        while (ce !== lc) {
            const c = ce;
            ce = ce.nextElementSibling;
            const s = c.atomControl.get_scope().itemIndex;
            cache[s] = c;
            remove.push(c);
        }

        // WebAtoms.dispatcher.pause();

        const ae = items;
        for (let j = 0; j < firstIndex; j++) {
            ae.next();
        }
        let after = fc;

        let last = null;

        const add = [];

        for (let i = firstIndex; i <= lastIndex; i++) {
            if (!ae.next()) {
                break;
            }
            const index2 = ae.currentIndex();
            const data = ae.current();
            const elementChild = cache[index2];
            if (elementChild && (element as IAtomControlElement).atomControl.data === data) {
                        cache[index2] = null;
                } else {
                   // elementChild = this.createChildElement(parentScope, null, data, ae, null);
            }
            elementChild.before = after;
            add.push(elementChild);
            after = elementChild;
            this.applyItemStyle(elementChild, data, ae.isFirst(), ae.isLast());
            last = index2;
        }

        const h = (this.mAllRows - block * 3) * avgHeight - index * this.mVisibleHeight;

        // WebAtoms.dispatcher.callLater(() => {
        //     const oldHeight = $fc.height();
        //     const newHeight = index * this.mVisibleHeight;

        //     const diff = newHeight - oldHeight;
        //     const oldScrollTop = vc.scrollTop;
        //     for (const aItem of add) {
        //         const ac = aItem.current();
        //         ip.insertBefore(ac, ac.before.nextElementSibling);
        //         ac.before = null;
        //     }
        //     AtomUI.css(fc, {
        //         height: newHeight
        //     });
        //     for (const aItem of remove) {
        //         const ec = aItem.current();
        //         if (!ec.before) {
        //             ec.atomControl.dispose();
        //         }
        //         ec.remove();
        //     }
        //     AtomUI.css(lc, {
        //         height: h
        //     });

        //     this.mIsChanging = false;
        // });
        // WebAtoms.dispatcher.start();
    }

    // public createChildElement(parentScope: any, parentElement: any, data: any, ae: any, before: any): any {
    //     const elementChild = null;
    //     // const elementChild = AtomUI.cloneNode(this.mItemTemplate);
    //     elementChild._logicalParent = parentElement || this.itemsPresenter;
    //     elementChild._templateParent = this;
    //     elementChild._isDirty = true;

    //     if (parentElement) {
    //         // WebAtoms.dispatcher.callLater(() => {
    //         // if (before) {
    //         //     parentElement.insertBefore(elementChild, before);
    //         //     } else {
    //         //          parentElement.appendChild(elementChild);
    //         //     }
    //         // });
    //     }

    //     const index = ae ? ae.currentIndex() : -1;
    //     const scope = null;

    //     if (this.mUiVirtualize) {
    //         const scopes = this.mScopes || {
    //         };
    //         this.mScopes = scopes;

    //        // scope = scopes[index] || new AtomScope(this, parentScope, parentScope.__application);
    //         scopes[index] = scope;
    //     } else {
    //        // scope = new AtomScope(this, parentScope, parentScope.__application);
    //     }

    //     if (ae) {
    //         scope.itemIsFirst = ae.isFirst();
    //         scope.itemIsLast = ae.isLast();
    //         scope.itemIndex = index;
    //         scope.itemExpanded = false;
    //         scope.data = data;
    //         scope.get_itemSelected = () => {
    //                     return scope.owner.isSelected(data);
    //             };
    //         scope.set_itemSelected = (v) => {
    //                     scope.owner.toggleSelection(data, true);
    //             };
    //     }

    //     const ac = AtomUI.createControl(elementChild, this.mChildItemType, data, scope);
    //     return elementChild;
    // }

    public applyItemStyle(arg0: any, arg1: any, arg2: any, arg3: any): any {
        throw new Error("Method not implemented.");
    }

    public updateChildSelections(type: any, index: any, item: any): any {
        throw new Error("Method not implemented.");
    }

    public isSelected(item: any) {
        let sitem = null;
        for (const msitem of this.mSelectedItems) {
            sitem = msitem;
            if (sitem === item) {
                return true;
            }
        }
        return false;
    }

    public bringSelectionIntoView() {

        // do not scroll for first auto select
        // if (this.mAllowSelectFirst && this.get_selectedIndex() === 0) {
        //     return;
        // }

        if (this.mUiVirtualize) {
            const index = 0;
           // const index = this.get_selectedIndex();
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
            if (this.mAutoScrollToSelection) {
                this.bringSelectionIntoView();
            }
        }
        this.updateSelectionBindings();
        // AtomControl.updateUI();

        // this.invokePost();
    }

    // public invokePost() {
    //     if (!this.mOnUIChanged) {
    //         return;
    //     }

    //     const errors = undefined;
    //    // const errors = this.get_errors();
    //     if (errors.length) {

    //        // Atom.alert(errors.join("\n"));

    //         return false;
    //     }

    //     if (this.mConfirm) {
    //         if (!confirm(this.mConfirmMessage)) {
    //             return;
    //         }
    //     }

    //     if (!this.mPostUrl) {
    //         AtomControl.invokeAction(this.mNext);
    //         return;
    //     }
    //     let data = null;
    //     // let data = this.get_postData();

    //     if (data === null || data === undefined) {
    //         return;
    //     }
    //     data = AtomBinder.getClone(data);
    //     const p = null;
    //    // const p = AtomPromise.json(this.mPostUrl, null, { type: "POST", data: data });
    //     p.then(() => {
    //         this.invokeNext();
    //     });
    //     const errorNext = this.mErrorNext;
    //     if (errorNext) {
    //         p.failed((pr) => {
    //             AtomControl.invokeAction(errorNext);
    //         });
    //     }
    //     p.invoke();
    // }

    // public invokeNext() {
    //     AtomControl.invokeAction(this.mNext);
    // }

    public hasItems() {
        return this.mItems !== undefined && this.mItems !== null;
    }

    public onUpdateUI(): void {
        super.onUpdateUI();
        this.onCollectionChangedInternal("refresh", -1, null);
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

        if (/reset|refresh/i.test(key)) {
            this.resetVirtulContainer();
        }

        if (/remove/gi.test(key)) {
            // tslint:disable-next-line:no-shadowed-variable
            const ip = this.itemsPresenter || this.element;
            const en = new ChildEnumerator(ip);
            while (en.next()) {
                const ce = en.current;
                // tslint:disable-next-line:no-shadowed-variable
                const c = ce as IAtomControlElement;
                if (c.atomControl && c.atomControl.data === item) {
                    c.atomControl.dispose();
                    ce.remove();
                    break;
                }
            }
            // AtomControl.updateUI();
            return;
        }

        if (this.mUiVirtualize) {
            this.onVirtualCollectionChanged();
            return;
        }
        // AtomUIComponent
        const parentScope = undefined;
        // var parentScope = this.get_scope();

        // var et = this.getTemplate("itemTemplate");
        // if (et) {
        //     et = AtomUI.getAtomType(et);
        //     if (et) {
        //         this._childItemType = et;
        //     }
        // }

        const items = this.mFilter ? this.mItems.filter(this.mFilter) : this.mItems;

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
            let cindex: number = 0;
            const en = new ChildEnumerator(this.itemsPresenter);
            while (en.next()) {
                if (cindex === index) {
                    last = en.current;
                    break;
                }
                cindex++;
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

    protected onCollectionChangedInternal(key: string, index: number, item: any): void {
        // Atom.refresh(this, "allValues");
        AtomBinder.refreshValue(this, "allValues");
        const value = this.mValue;

        this.onCollectionChanged(key, index, item);

        if (value) {
            if (!(value || this.mAllowSelectFirst)) {
                AtomBinder.clear(this.mSelectedItems);
            }
        }
        if (value != null) {
            this.mValue  = value;
            if (this.selectedIndex !== -1) {
                return;
            } else {
                this.mValue = undefined;
                }
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

    // protected refresh() {
    //     if (this.mPromises && this.mPromises.items) {
    //         this.mPromises.items.invoke();
    //     }

    // }

    // protected onUpdateUI() {
    //    // base.onUpdateUI.call(this);

    //     if (this.mUiVirtualize) {
    //         this.onVirtualCollectionChanged();
    //     }

    //     for (const aeItem of AtomUI.childEnumerator(this.itemsPresenter)) {
    //         const item = aeItem as any;
    //         if (!item.atomControl) {
    //             continue;
    //         }
    //         const dataItem = item.atomControl.get_data();
    //         AtomBinder.refreshValue(item.atomControl.get_scope(), "itemSelected");
    //         this.applyItemStyle(item, dataItem, item.isFirst(), item.isLast());
    //     }
    // }

    // protected onCreated() {
    //     if (this.mItems) {
    //         this.onCollectionChangedInternal("refresh", -1, null);
    //     }

    //     // this.dispatcher.callLater(function () {
    //     //     if (caller._autoScrollToSelection) {
    //     //         caller.bringSelectionIntoView();
    //     //     }
    //     // });

    // }

    protected validateScroller() {

        if (this.mScrollerSetup) {
            return;
        }
        const ip = this.itemsPresenter;
        const e = this.element as HTMLElement;

        let vc = this.mVirtualContainer;
        if (!vc) {
            if (ip === e || /table/i.test(e.nodeName)) {
                throw new Error("virtualContainer presenter not found, you must put itemsPresenter "
                        + "inside a virtualContainer in order for Virtualization to work");
            } else {
                vc = this.mVirtualContainer = this.element;
            }
        }
        AtomUI.css(vc, {
            overflow: "auto"
        } );
        this.bindEvent(vc, "scroll", () => {
            this.onScroll();
        });
        AtomUI.css(ip, {
            overflow: "hidden"
        } );

        const isTable = /tbody/i.test(ip.nodeName);

        let fc;
        let lc;

        if (isTable) {
            fc = document.createElement("TR");
            lc = document.createElement("TR");
        } else {
            fc = document.createElement("DIV");
            lc = document.createElement("DIV");
        }

        // $(fc).addClass("sticky first-child").css({ posiiton: "relative", height: 0, width: "100%", clear: "both" });
        AtomUI.addClass(fc, "sticky first-child");

        // $(lc).addClass("sticky last-child").css({ posiiton: "relative", height: 0, width: "100%", clear: "both" });
        AtomUI.addClass(fc, "sticky first-child");

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
        const e = ac.element as IAtomControlElement;
        e._logicalParent = this.element as IAtomControlElement;
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
