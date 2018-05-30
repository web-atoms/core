var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../core/atom-binder", "../core/atom-list", "../core/bindable-properties", "./atom-control"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var atom_binder_1 = require("../core/atom-binder");
    require("../core/atom-list");
    var bindable_properties_1 = require("../core/bindable-properties");
    var atom_control_1 = require("./atom-control");
    var AtomItemsControl = /** @class */ (function (_super) {
        __extends(AtomItemsControl, _super);
        function AtomItemsControl() {
            // items,itemTemplate, filter, sort, itemsPresenter
            // allowMultipleSelection, allowSelectFirst selectAll selectedIndex selectedItem selectedItems
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.allowSelectFirst = false;
            _this.allowMultipleSelection = false;
            _this.valuePath = "value";
            _this.labelPath = "label";
            _this.valueSeparator = ", ";
            _this.mValue = undefined;
            _this.mSelectedItems = [];
            _this.mFilteredItems = [];
            _this.mSelectedItem = undefined;
            _this.mSelectAll = false;
            _this.mItems = undefined;
            _this.mItemsDisposable = null;
            return _this;
        }
        Object.defineProperty(AtomItemsControl.prototype, "value", {
            get: function () {
                var _this = this;
                if (this.allowMultipleSelection) {
                    var items = this.mSelectedItems;
                    if (items.length === 0) {
                        if (this.mValue !== undefined) {
                            return this.mValue;
                        }
                        return null;
                    }
                    items = items.map(function (m) { return m[_this.valuePath]; });
                    if (this.valueSeparator) {
                        items = items.join(this.valueSeparator);
                    }
                    return items;
                }
                var s = this.mSelectedItem;
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
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AtomItemsControl.prototype, "items", {
            get: function () {
                return this.mItems;
            },
            set: function (v) {
                var _this = this;
                if (this.mItemsDisposable) {
                    this.mItemsDisposable.dispose();
                    this.mItemsDisposable = null;
                }
                this.mItems = v;
                this.mFilteredItems = null;
                if (v != null) {
                    this.mItemsDisposable = atom_binder_1.AtomBinder.add_CollectionChanged(this.mItems, function (target, key, index, item) {
                        _this.onCollectionChangedInternal(key, index, item);
                    });
                    this.onCollectionChangedInternal("refresh", -1, null);
                }
                atom_binder_1.AtomBinder.refreshValue(this, "items");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AtomItemsControl.prototype, "selectedItem", {
            get: function () {
                if (this.mSelectedItem.length > 0) {
                    return this.mSelectedItem[0];
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        AtomItemsControl.prototype.dispose = function (e) {
            if (this.mItemsDisposable) {
                this.mItemsDisposable.dispose();
                this.mItemsDisposable = null;
            }
            this.mItems = null;
            this.mFilteredItems = null;
            _super.prototype.dispose.call(this, e);
        };
        AtomItemsControl.prototype.onPropertyChanged = function (name) {
            switch (name) {
                case "itemTemplate":
                case "labelPath":
                case "valuePath":
                    this.onCollectionChangedInternal("refresh", -1, null);
                    break;
            }
        };
        Object.defineProperty(AtomItemsControl.prototype, "sortPath", {
            set: function (v) {
                this.mSortPath = v;
                if (v) {
                    this.onCollectionChangedInternal("refresh", -1, null);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AtomItemsControl.prototype, "selectAll", {
            set: function (v) {
                if (v === undefined || v === null) {
                    return;
                }
                this.mSelectedItems.length = 0;
                var items = this.mItems;
                if (v && items) {
                    try {
                        for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                            var itm = items_1_1.value;
                            this.mSelectedItems.push(itm);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                this.mSelectAll = true;
                atom_binder_1.AtomBinder.refreshItems(this.mSelectedItems);
                var e_1, _a;
            },
            enumerable: true,
            configurable: true
        });
        // tslint:disable-next-line:no-empty
        AtomItemsControl.prototype.onCollectionChangedInternal = function (key, index, item) {
        };
        __decorate([
            bindable_properties_1.bindableProperty
        ], AtomItemsControl.prototype, "allowSelectFirst", void 0);
        __decorate([
            bindable_properties_1.bindableProperty
        ], AtomItemsControl.prototype, "allowMultipleSelection", void 0);
        __decorate([
            bindable_properties_1.bindableProperty
        ], AtomItemsControl.prototype, "valuePath", void 0);
        __decorate([
            bindable_properties_1.bindableProperty
        ], AtomItemsControl.prototype, "labelPath", void 0);
        __decorate([
            bindable_properties_1.bindableProperty
        ], AtomItemsControl.prototype, "itemTemplate", void 0);
        return AtomItemsControl;
    }(atom_control_1.AtomControl));
    exports.AtomItemsControl = AtomItemsControl;
});
//# sourceMappingURL=atom-items-control.js.map