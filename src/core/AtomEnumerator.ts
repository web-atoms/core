export default class AtomEnumerator<T> {

    private index: number = -1;

    constructor(private readonly items: T[]) {
    }

    public next(): boolean {
        this.index ++;
        return this.index < this.items.length;
    }

    public get current(): T {
        return this.items[this.index];
    }

    public get currentIndex(): number {
        return this.index;
    }

}
