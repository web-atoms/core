// tslint:disable
			declare var UMD: any;
			UMD = UMD || { resolvePath: (v) => v };
			export const ModuleFiles =
				{
  "src": {
    "web": {
      "images": {
        "busy_gif": UMD.resolvePath("web-atoms-core/src/web/images/busy.gif"),
        "closeButtonHover_svg": UMD.resolvePath("web-atoms-core/src/web/images/close-button-hover.svg"),
        "closeButton_svg": UMD.resolvePath("web-atoms-core/src/web/images/close-button.svg")
      },
      "samples": {
        "tabs": {
          "views": {
            "List_json": "web-atoms-core/src/web/samples/tabs/views/List.json"
          }
        }
      }
    }
  },
  "tests": {
    "web": {
      "views": {
        "TestHost": "web-atoms-core/dist/tests/web/views/TestHost"
      }
    }
  }
}
