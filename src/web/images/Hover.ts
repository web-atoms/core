// tslint:disable

        declare var SystemJS: any;

        export class Hover {

            private static mContentUrl: string = null;
            private static get contentUrl(): string {
                if (Hover.mContentUrl) {
                    return Hover.mContentUrl;
                }
                return Hover.mContentUrl =
                    "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6"+
		"IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246"+
		"IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0i"+
		"aHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8x"+
		"OTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJl"+
		"bmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxj"+
		"aXJjbGUgc3R5bGU9ImZpbGw6I0UyMUIxQjsiIGN4PSIyNTYiIGN5PSIyNTYiIHI9IjI1NiIvPg0KPHBh"+
		"dGggc3R5bGU9ImZpbGw6I0M0MDYwNjsiIGQ9Ik01MTAuMjgsMjg1LjMwNEwzNjcuOTEyLDE0Mi45MzZM"+
		"MTUwLjI0OCwzNjguNjA4bDE0MC45MjgsMTQwLjkyOA0KCUM0MDYuMzUyLDQ5My42OTYsNDk3LjA1Niw0"+
		"MDEuMjg4LDUxMC4yOCwyODUuMzA0eiIvPg0KPGc+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsi"+
		"IGQ9Ik0zNTQuMzc2LDM3MS41MzZjLTUuMTIsMC0xMC4yMzItMS45NTItMTQuMTQ0LTUuODU2TDE0Ni40"+
		"MDgsMTcxLjg0OA0KCQljLTcuODE2LTcuODE2LTcuODE2LTIwLjQ3MiwwLTI4LjI4czIwLjQ3Mi03Ljgx"+
		"NiwyOC4yOCwwTDM2OC41MiwzMzcuNGM3LjgxNiw3LjgxNiw3LjgxNiwyMC40NzIsMCwyOC4yOA0KCQlD"+
		"MzY0LjYwOCwzNjkuNTg0LDM1OS40OTYsMzcxLjUzNiwzNTQuMzc2LDM3MS41MzZ6Ii8+DQoJPHBhdGgg"+
		"c3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0xNjAuNTQ0LDM3MS41MzZjLTUuMTIsMC0xMC4yMzItMS45"+
		"NTItMTQuMTQ0LTUuODU2Yy03LjgxNi03LjgxNi03LjgxNi0yMC40NzIsMC0yOC4yOA0KCQlsMTkzLjgz"+
		"Mi0xOTMuODMyYzcuODE2LTcuODE2LDIwLjQ3Mi03LjgxNiwyOC4yOCwwczcuODE2LDIwLjQ3MiwwLDI4"+
		"LjI4TDE3NC42ODgsMzY1LjY4DQoJCUMxNzAuNzg0LDM2OS41ODQsMTY1LjY2NCwzNzEuNTM2LDE2MC41"+
		"NDQsMzcxLjUzNnoiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0K"+
		"PC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4N"+
		"CjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4N"+
		"CjwvZz4NCjwvc3ZnPg0K";
            }

            public static get url(): string {
                return `data:image/svg+xml;base64,${Hover.contentUrl}`;
            }
        }
        