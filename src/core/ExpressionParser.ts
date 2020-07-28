import { PathList } from "./types";

const viewModelParseWatchCache: {[key: string]: PathList[] } = {};

export function parsePath(f: any, parseThis?: boolean): PathList[] {
    let str: string = f.toString().trim();

    str = str.split("\n").filter((s) => !/^\/\//.test(s.trim())).join("\n");

    const key: string = (parseThis === undefined ? "un:" : (parseThis ? "_this:" : "_noThis:") ) + str;

    const px1: PathList[] = viewModelParseWatchCache[key];
    if (px1) {
        return px1;
    }

    if (str.endsWith("}")) {
        str = str.substr(0, str.length - 1);
    }

    if (str.startsWith("function (")) {
        str = str.substr("function (".length);
    } else if (str.startsWith("function(")) {
        str = str.substr("function(".length);
    } else {
        const sb = str.indexOf("(");
        if (sb !== -1) {
            str = str.substr(sb + 1);
        } else {
            if (parseThis !== undefined && parseThis === false) {
                return [];
            } else {
                parseThis = true;
            }
        }
    }

    str = str.trim();

    let index: number = str.indexOf(")");

    const commaIndex = str.indexOf(",");
    if (commaIndex !== -1 && commaIndex < index) {
        index = commaIndex;
    }

    const isThis: boolean = parseThis === undefined ? (index === 0 || parseThis) : parseThis;

    const p: string = (isThis ? "(\\_this|this)" : (str.substr(0, index) || "")).trim();

    /**
     * This is the case when there is no parameter to check and there `parseThis` is false
     */
    if (p.length === 0) {
        const empty = [];
        viewModelParseWatchCache[key] = empty;
        return empty;
    }

    str = str.substr(index + 1);

    const regExp: string = `(?:(\\b${p})(?:(\\.[a-zA-Z_][a-zA-Z_0-9]*)+)\\s?(?:(\\(|\\=\\=\\=|\\=\\=|\\=)?))`;

    const re: RegExp = new RegExp(regExp, "gi");

    let path: string[] = [];

    const ms: any = str.replace(re, (m) => {
        // console.log(`m: ${m}`);
        let px: string = m;
        if (px.startsWith("this.")) {
            if (parseThis !== true) {
                px = px.substr(5);
            }
        } else if (px.startsWith("_this.")) {
            if (parseThis !== true) {
                px = px.substr(6);
            } else {
                // need to convert _this to this
                px = px.substr(1);
            }
        } else {
            px = px.substr(p.length + 1);
        }

        px = px.split(".").filter((s) => !s.endsWith("(")).join(".");

        // console.log(px);
        if (!path.find((y) => y === px)) {
            path.push(px);
        }

        // path = path.filter( (f1) => f1.endsWith("==") || !(f1.endsWith("(") || f1.endsWith("=") ));

        // path = path.map(
        //     (px2) => (px2.endsWith("===") ? px2.substr(0, px2.length - 3) :
        //         ( px2.endsWith("==") ? px2.substr(0, px2.length - 2) : px2 )).trim() );

        const filtered = [];
        for (const iterator of path) {
            if (iterator.endsWith("==") || !(iterator.endsWith("(") || iterator.endsWith("="))) {
                filtered.push((iterator.endsWith("===") ? iterator.substr(0, iterator.length - 3) :
                    ( iterator.endsWith("==") ? iterator.substr(0, iterator.length - 2) : iterator )).trim());
            }
        }

        path = filtered.filter((px11) => {
            const search = px11 + ".";
            for (const iterator of filtered) {
                if (px11 !== iterator && iterator.indexOf(search) !== -1) {
                    return false;
                }
            }
            return true;
        });

        return m;
    });

    path = path.sort( (a, b) => b.localeCompare(a) );

    const duplicates = path;
    path = [];
    for (const iterator of duplicates) {
        if (path.find( (px2) => px2 === iterator )) {
            continue;
        }
        path.push(iterator);
    }

    const rp: string[] = [];
    for (const rpItem of path) {
        if (rp.find( (x) => x.startsWith(rpItem) )) {
            continue;
        }
        rp.push(rpItem);
    }

    // tslint:disable-next-line: no-console
    // console.log(`Watching: ${path.join(", ")}`);

    const pl = path.filter((p1) => p1).map( (p1) => p1.split("."));

    viewModelParseWatchCache[key] = pl;

    return pl;
}

interface IPathLists {
    thisPath?: PathList[];
    pathList?: PathList[];
    combined?: PathList[];
}

const viewModelParseWatchCache2: {[key: string]: IPathLists } = {};

export function parsePathLists(f: any): IPathLists {

    const str = f.toString().trim();

    const key: string = str;

    const px1 = viewModelParseWatchCache2[key];
    if (px1) {
        return px1;
    }

    // str = str.split("\n").filter((s) => !/^\/\//.test(s.trim())).join("\n");

    // if (str.endsWith("}")) {
    //     str = str.substr(0, str.length - 1);
    // }

    // if (str.startsWith("function (")) {
    //     str = str.substr("function (".length);
    // }

    // if (str.startsWith("function(")) {
    //     str = str.substr("function(".length);
    // }

    // str = str.trim();

    const pl = {
        pathList: parsePath(str, false),
        thisPath: parsePath(str, true),
        combined: []
    };

    if (pl.thisPath.length && pl.pathList.length) {
        // we need to combine this
        // pl.combinedPathList =
        pl.combined = pl.thisPath
            .map((x) => {
                x[0] = "t";
                x.splice(0, 0, "this");
                return x;
            })
            .concat(pl.pathList.map((x) => {
                x.splice(0, 0, "this", "x");
                return x;
            }));
        pl.thisPath = [];
        pl.pathList = [];
    }

    viewModelParseWatchCache2[key] = pl;

    return pl;
}
