import { RegisterSingleton } from "../../di/RegisterSingleton";
import { BaseService, Get } from "../../services/http/RestService";

@RegisterSingleton
export class MovieService extends BaseService {

    @Get("@web-atoms/core/dist/web/samples/tabs/views/List.json")
    public async countryList(): Promise<any> {
        return null;
    }

}
