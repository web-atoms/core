import Assert from "@web-atoms/unit-test/dist/Assert.js";
import Category from "@web-atoms/unit-test/dist/Category.js";
import Test from "@web-atoms/unit-test/dist/Test.js";
import TestItem from "@web-atoms/unit-test/dist/TestItem.js";
import { App } from "../../App.js";
import { Inject } from "../../di/Inject.js";
import { ServiceCollection } from "../../di/ServiceCollection.js";
import { ServiceProvider } from "../../di/ServiceProvider.js";

class GlobalClass {

    public id: number;

    constructor() {
        this.id = (new Date()).getTime();
    }

}

class DependentService {

    constructor(
        @Inject public g: GlobalClass,
        @Inject public sp: ServiceProvider
    ) {

    }

}

@Category("DI")
export class TestCase extends TestItem {

    @Test
    public singleton(): void {

        const app = new App();

        ServiceCollection.instance.registerSingleton(GlobalClass);
        ServiceCollection.instance.registerSingleton(DependentService);

        const g1 =  app.get(GlobalClass);
        const g2 =  app.get(GlobalClass);

        Assert.equals(g1, g2);

        const ds = app.get(DependentService);
        Assert.equals(ds.g, g1);

        Assert.equals(ds.sp, app);
    }

}
