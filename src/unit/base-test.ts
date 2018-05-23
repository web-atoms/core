export class Assert{

    static equals(
        expected: any,
        result:any, 
        msg?:string ){
        if(result !== expected){
            Assert.throw(msg || `Expected ${expected}, found ${result}`);
        }
    }

    static doesNotEqual(
        expected: any,
        result:any,
        msg?:string){
        if(result === expected)
            Assert.throw(msg || `Not Expected ${expected}, found ${result}`);
    }

    static throws(
        expected:string, 
        f:()=>any,
        msg?:string){
        try{
            f();
            Assert.throw(msg || `Expected ${expected}, no exception was thrown.`);
        }catch(e){
            if(e.message != expected)
            {
                Assert.throw(msg || `Expected error ${expected}, found ${e.message}`);
            }
        }
    }

    static async throwsAsync(
        expected: string,
        f:()=> Promise<any>,
        msg?:string ):Promise<any>{
        try{
            await f();
            Assert.throw(msg || `Expected ${expected}, no exception was thrown.`);
        }catch(e){
            if(e.message != expected)
            {
                Assert.throw(msg || `Expected error ${expected}, found ${e.message}`);
            }
        }
    }

    static isTrue(b:boolean, msg?:string){
        if(b !== true)
            Assert.throw(msg || "Expected isTrue");
    }

    static isFalse(b:boolean, msg?:string){
        if(b !== false)
            Assert.throw(msg || "Expected isFalse");
    }

    static throw(message:string){
        throw new Error(`Assertion Failed, ${message}`);
    }


}


export function Category(name:string){

    return (target:any)=>{

        //target.testCategory = name;
        //return target;
    
        // save a reference to the original constructor
        var original = target;
    
        // a utility function to generate instances of a class
        function construct(constructor, args) {
            var c : any = function () {
            return constructor.apply(this, args);
            }
            c.prototype = constructor.prototype;
            return new c();
        }
        
        // the new constructor behaviour
        var f : any = function (...args) {
            this.testCategory = name;
            return construct(original, args);
        }
        
        // copy prototype so intanceof operator still works
        f.prototype = original.prototype;
        
        // return new constructor (will override original)
        return f;
    }
}

export class TestContext {

    logs:Array<any> = [];
    errors:Array<any> = [];

    log(a:any):void {
        this.logs.push(a);
    }

    error(a:any):void {
        this.errors.push(a);
    }

    reset():void {
        this.logs.length = 0;
        this.errors.length = 0;
    }

}

export class TestMethod {

    constructor(desc:any, name:string, category:string, target:any) {
        this.description = desc;
        this.name = name;
        this.category = category;
        this.testClass = target;
    }

    name:string;
    category:string;
    description: any;

    testClass: any;

    get path(): string {
        return `${this.category}/${this.name}`;
    }

    error:any;

    logText: string;
}

export class TestItem {

    logText:string = "";

    async init():Promise<any> {
        return 0;
    }

    async dispose():Promise<any> {
        return 0;
    }

    log(text:string):void {
        if(text) {
            this.logText += text;
        }
    }

    delay(n:number):Promise<any> {
        return new Promise((resolve,reject)=> {
            setTimeout(()=> {
                resolve();
            },n);
        });
    }


}


export function Test(name?:string):Function {
    return (target:TestItem, propertyKey: string, descriptor: any):void => {

        // console.log(`Test called for ${target.constructor.name} in ${propertyKey}`)
        TestRunner.instance.tests.push(new TestMethod(
            name || propertyKey,
            propertyKey,
            target.constructor.name,
            target.constructor ));
    };
}

export class TestRunner {

    private static _instance:TestRunner;
    static get instance(): TestRunner{
        if(!TestRunner._instance) {
            TestRunner._instance = new TestRunner();
        }
        return TestRunner._instance;
    }

    constructor() {
        this.tests = [];
        this.executed = [];
    }

    tests:Array<TestMethod>;
    executed:Array<TestMethod>;

    printAll():void {
        // var results = this.executed.sort((a,b)=>{
        //     return a.testClass.category.localeCompare(b.testClass.category);
        // });
        // var results = results.sort((a,b)=>{
        //     return a.description.localeCompare(b.description);
        // });
        for(var result of this.executed){
            if(result.error) {

                console.error(`${result.category} > ${result.description} failed ${result.error.message}.`);
                console.error(result.error);
            }else {
                console.log(`${result.category} > ${result.description} succeeded.`);
            }
            if(result.logText) {
                console.log(`\t\t${result.logText}`);
            }
        }
    }

    runTest(f:any,target:any):Promise<any> {
        return new Promise((resolve,reject)=> {
            try {
                var t:any = f.apply(target);
                if(t && t.then) {
                    t.then(v=> {
                        resolve(v);
                    });
                    t.catch(e=> {
                        reject(e);
                    });
                    return;
                }
                resolve();
            }catch(ex) {
                reject(ex);
            }
        });
    }

    discover(...a:any[]):void {
        
    }

    async run(filter?: string):Promise<any> {


        if(filter) {
            var r:RegExp = null;
            if(filter.startsWith("/")) {
                var index:number = filter.lastIndexOf("/");
                var options:string = filter.substr(index+1);
                filter = filter.substr(0,index);
                var exp:string = filter.substr(1);

                r = new RegExp(exp,options );

                this.tests = this.tests.filter( x => r.test(x.path) );

            }else {
                var categories:Array<string[]> = filter.split(",").map(x => x.trim().toLowerCase().split("."));
                this.tests = this.tests.filter( x => {
                    var lc:string = x.category.toLowerCase();
                    var ln:string = x.name.toLowerCase();
                    var b:any = categories.find( c => c[0] === lc && ((!c[1]) || ( c[1] === ln  )));
                    return b;
                });
            }
        }



        return this._run();

    }


    async _run():Promise<any> {

        if(this.tests.length === 0) {
            this.printAll();
            return;
        }

        var peek:TestMethod = this.tests.shift();

        this.executed.push(peek);

        var test:TestItem = new (peek.testClass as {new ()});

        try {
            await test.init();

            var fx:Function = test[peek.name];

            await this.runTest(fx,test);
        }catch(e) {
            peek.error = e;
        }
        finally {
            peek.logText = test.logText;
            try {
                await test.dispose();
            }catch(er) {
                peek.error = er;
            }
        }

        await this._run();

    }

}