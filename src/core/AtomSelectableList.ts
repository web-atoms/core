import { AtomList } from "./AtomList";

export default class AtomSelectableList<T> {

    public selected: T[];

    constructor(public readonly list: T[]) {
    }

    public toggle(item: T): void {
        if (this.isSelected(item)) {
            this.deselect(item);
        } else {
            this.select(item);
        }
    }

    public isSelected(item: T): boolean {
        return this.selected.findIndex( (x) => x === item) !== -1;
    }

    public select(item: T): void {
        if (this.selected.findIndex((x) => x === item) === -1) {
            this.selected.add(item);
        }
    }

    public deselect(item: T): void {
        this.selected.remove(item);
    }

    public selectAll(): void {
        this.selected.replace(this.list);
    }

    public clearSelection(): void {
        this.selected.clear();
    }
}
