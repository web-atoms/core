// tslint:disable

        declare var SystemJS: any;

        export class Button {

            private static mContentUrl: string = null;
            private static get contentUrl(): string {
                if (Button.mContentUrl) {
                    return Button.mContentUrl;
                }
                return Button.mContentUrl =
                    "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6"+
		"IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246"+
		"IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJo"+
		"dHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5"+
		"OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDU1Ljk5MiA0NTUuOTkyIiBz"+
		"dHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0NTUuOTkyIDQ1NS45OTI7IiB4bWw6c3BhY2U9"+
		"InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8Zz4NCgkJCTxnPg0KCQkJCTxwYXRoIHN0eWxlPSJmaWxs"+
		"OiMwMTAwMDI7IiBkPSJNMjI3Ljk5NiwwQzEwMi4wODEsMCwwLDEwMi4wODEsMCwyMjcuOTk2YzAsMTI1"+
		"Ljk0NSwxMDIuMDgxLDIyNy45OTYsMjI3Ljk5NiwyMjcuOTk2DQoJCQkJCWMxMjUuOTQ1LDAsMjI3Ljk5"+
		"Ni0xMDIuMDUxLDIyNy45OTYtMjI3Ljk5NkM0NTUuOTkyLDEwMi4wODEsMzUzLjk0MSwwLDIyNy45OTYs"+
		"MHogTTIyNy45OTYsNDI1LjU5Mw0KCQkJCQljLTEwOC45NTIsMC0xOTcuNTk3LTg4LjY0NS0xOTcuNTk3"+
		"LTE5Ny41OTdTMTE5LjA0NCwzMC4zOTksMjI3Ljk5NiwzMC4zOTlzMTk3LjU5Nyw4OC42NDUsMTk3LjU5"+
		"NywxOTcuNTk3DQoJCQkJCVMzMzYuOTQ4LDQyNS41OTMsMjI3Ljk5Niw0MjUuNTkzeiIvPg0KCQkJCTxw"+
		"YXRoIHN0eWxlPSJmaWxsOiMwMTAwMDI7IiBkPSJNMzEyLjE0MiwxMjIuMzU4bC04My41MzgsODMuNTY4"+
		"bC03NC45NjUtODMuNTY4Yy01LjkyOC01LjkyOC0xNS41NjUtNS45MjgtMjEuNDkyLDANCgkJCQkJYy01"+
		"LjkyOCw1LjkyOC01LjkyOCwxNS41NjUsMCwyMS40OTJsNzQuOTY1LDgzLjU2OGwtODQuNzIzLDg0Ljcy"+
		"M2MtNS45MjgsNS45MjgtNS45MjgsMTUuNTk1LDAsMjEuNDkyDQoJCQkJCWM1LjkyOCw1LjkyOCwxNS41"+
		"NjUsNS45MjgsMjEuNDkyLDBsODMuNTY4LTgzLjUzOGw3NC45NjUsODMuNTM4YzUuODk3LDUuOTI4LDE1"+
		"LjU2NSw1LjkyOCwyMS40NjIsMA0KCQkJCQljNS45MjgtNS44OTgsNS45MjgtMTUuNTY1LDAtMjEuNDky"+
		"bC03NC45OTUtODMuNTM4bDg0LjcyMy04NC43NTRjNS45MjgtNS45MjgsNS45MjgtMTUuNTY1LDAtMjEu"+
		"NDkyDQoJCQkJCUMzMjcuNjc2LDExNi40MywzMTguMDcsMTE2LjQzLDMxMi4xNDIsMTIyLjM1OHoiLz4N"+
		"CgkJCTwvZz4NCgkJPC9nPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwv"+
		"Zz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+"+
		"DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4N"+
		"Cgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+"+
		"DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9n"+
		"Pg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxn"+
		"Pg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K";
            }

            public static get url(): string {
                return `data:image/svg+xml;base64,${Button.contentUrl}`;
            }
        }
        