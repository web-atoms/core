
export class TestMethod {

    public name: string;
    public category: string;
    public description: any;

    public testClass: any;

    public error: any;

    public logText: string;

    constructor(desc: any, name: string, category: string, target: any) {
        this.description = desc;
        this.name = name;
        this.category = category;
        this.testClass = target;
    }

    get path(): string {
        return `${this.category}/${this.name}`;
    }

}
