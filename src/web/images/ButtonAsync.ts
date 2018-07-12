// tslint:disable

        declare var SystemJS: any;

        export class ButtonAsync {

            public static url(): Promise<string> {
                return new Promise(
                    (resolve, reject) => {
                        SystemJS.import("Button")
                            .then((m) => {
                                resolve(m["Button"].url());
                            }).catch((r) => {
                                reject(r);
                            });
                    }
                );
            }
        }
        