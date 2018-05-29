export type CompiledMethod = {
	// tslint:disable-next-line:indent
	length: number,
	method: Function,
	path: Array<string[]>,
	original: string
};

export class AtomEvaluator {

	static instance:AtomEvaluator = new AtomEvaluator();

	ecache: any = {};

	becache:any = {};

	parse(txt:string):CompiledMethod {

		// http://jsfiddle.net/A3vg6/44/ (recommended)
		// http://jsfiddle.net/A3vg6/45/ (working)
		// http://jsfiddle.net/A3vg6/51/ (including $ sign)
		var be:CompiledMethod = this.becache[txt];
		if (be) {
			return be;
		}

		var regex:RegExp = /(?:(\$)(window|localViewModel|viewModel|appScope|scope|data|owner|localScope))(?:\.[a-zA-Z_][a-zA-Z_0-9]*(\()?)*/gi;

		var keywords:RegExp = /(window|localViewModel|viewModel|appScope|scope|data|owner|localScope)/gi;

		var path:Array<string[]> = [];
		var vars:string[] = [];

		var found:any = {};

		var ms:string = txt.replace(regex,
			 (match:string): string => {
				var original:string = match;
				var nv:string = "v" + (path.length + 1);
				if (match.indexOf("$owner.") === 0) {
					match = match.substr(7);
				} else {
					if (match.indexOf("owner.") === 0) {
						match = match.substr(6);
					} else {
						match = match.substr(1);
					}
				}

				var matches:string[] = match.split(".");

				var trail:string = "";

				matches = matches.filter(m => {
					if(!m.endsWith("(")) {
						return true;
					}
					trail = "." + m;
					return false;
				});

				if(matches.length>0) {
					path.push(matches);
					vars.push(nv);
				} else {
					return original;
				}
				return "(" + nv + ")" + trail;
			}
			);


		var method:any = "return " + ms + ";";
		var methodString:string = method;
		try {
			method = this.compile(vars, method);
		} catch (e) {
			// throw new Error("Error executing \n" + methodString + "\nOriginal: " + txt + "\r\n" + e);
			throw new Error(`${e.message} in "${txt}"`);
		}

		be = {
			length: vars.length,
			method: method,
			path: path,
			original: ms
		};
		this.becache[txt] = be;
		return be;
	}
	compile(vars:string[], method:string): Function {
		var k:string = vars.join("-") + ":" + method;
		var e:Function = this.ecache[k];
		if (e) {
			return e;
		}

		vars.push("Atom");
		vars.push("AtomPromise");
		vars.push("$x");

		e = new Function(method);
		this.ecache[k] = e;
		return e;
	}
}
