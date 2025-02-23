
import { Injectable } from "@nestjs/common";

@Injectable()
export class RedirectService {

    getMenuUrl(id: string) {
        const frontEndUrl = process.env.CLIENT_MENU_URL;
        const menuUrl = `${frontEndUrl}/?table=${id}`;
        return menuUrl;
    }
}
