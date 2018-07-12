// tslint:disable

        declare var SystemJS: any;

        export class HoverAsync {

            public static url(): Promise<string> {
                return new Promise(
                    (resolve, reject) => {
                        SystemJS.import("Hover")
                            .then((m) => {
                                resolve(m["Hover"].url());
                            }).catch((r) => {
                                reject(r);
                            });
                    }
                );
            }
        }
        