// import { AtomComponent } from "./atom-component";

// // all scope properties are removed, they are no longer needed
// export class AtomUIComponent extends AtomComponent {

//     public get owner(): AtomUIComponent {
//         return this;
//     }

//     public getTemplate(name: string): HTMLElement {
//         let t: any = this["_" + name];
//         if (t) {
//             return t as HTMLElement;
//         }

//         // resolve..
//         t = Templates.get(this.constructor, name);
//         if (!t) {
//             return null;
//         }
//         this["_" + name] = t;
//         return t;
//     }

// }

// export class Templates {
//     public static get(arg0: any, arg1: any): HTMLElement {
//         throw new Error("Method not implemented.");
//     }
// }
