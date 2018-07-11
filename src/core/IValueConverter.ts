export interface IValueConverter {
    fromSource(v: any): any;
    fromTarget(v: any): any;
}
