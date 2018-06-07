import { Service } from "../di";

@Service()
export class WindowService {

    public confirm(message: string, title: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
