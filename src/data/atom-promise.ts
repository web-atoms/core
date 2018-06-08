// export class AtomPromise{

//     private _success = [];
//     private _failed = [];
//     private _cached = false;

//     private _process = null;

//     private _calls = 0;

//     private _showProgress = true;
//     private _showError = true;

//     private success: (...a: any[]) => void;
//     private error: (...a: any[]) => void;

//     constructor() {
//         this._success = [];
//         this._failed = [];
//         this._cached = false;

//         this._process = null;

//         this._calls = 0;

//         this._showProgress = true;
//         this._showError = true;

//         this.success = (...a: any[]) => {
//             this.onSuccess.apply(this, a);
//         };

//         this.error = (...a: any[]) => {
//             this.onError.apply(this, a);
//         };
//     }

//     public onSuccess(c): void {
//         this._value = c;
//         if (this._process) {
//             this._value = this._process(this._value);
//         }
//         var r = this._success;
//         for (var i = 0; i < r.length ; i++) {
//             r[i](this);
//         }
//     }

//     public onError() {
//         this.errors = arguments;
//         var r = this._failed;
//         for (var i = 0; i < r.length; i++) {
//             r[i](this);
//         }
//     }

//     public then(t) {
//         this._success.push(t);
//         return this;
//     }

//     public process(f) {
//         this._process = f;
//         return this;
//     }

//     public failed(f) {
//         this._failed.push(f);
//         return this;
//     }

//     public value(v) {

//         if (v !== undefined) {
//             this._value = v;
//             return;
//         }
//         return this._value;
//     }

//     public onInvoke(r) {
//         this._invoke = r;
//         return this;
//     }

//     public invoke() {
//         if (!this._persist) {
//             this.invokePromise();
//             return this;
//         }
//         var _this = this;
//         this.promiseTimeout = setTimeout(function () {
//             _this.invokePromise();
//         }, 100);
//         return this;
//     }

//     public invokePromise() {
//         this.promiseTimeout = null;
//         if (this._showProgress) {
//             atomApplication.setBusy(true);
//             if (this._calls === 0) {
//                 var f = function () {
//                     atomApplication.setBusy(false);
//                 };
//                 this.then(f);
//                 this.failed(f);
//             }
//         }
//         this._calls++;
//         this._invoke(this);
//         return this;
//     }

//     public pushValue(v) {
//         var _this = this;
//         this._cached = true;
//         setTimeout(function () {
//             _this.onSuccess.apply(_this, [v]);
//         }, 1);
//     }

//     public showProgress(b) {
//         this._showProgress = b;
//         return this;
//     }

//     public showError(b) {
//         this._showError = b;
//         return this;
//     }

//     public persist(v) {
//         if (v === undefined)
//             this._persist = true;
//         else
//             this._persist = v;
//         return this;
//     }

//     public abort() {
//         if (this.promiseTimeout) {
//             clearTimeout(this.promiseTimeout);
//             this.promiseTimeout = null;
//             return;
//         }
//         this._failed.length = 0;
//         this._success.length = 0;
//         if (this._showProgress) {
//             atomApplication.setBusy(false);
//         }
//         if (this.handle) {
//             this.handle.abort();
//         }
//     }

// }
