import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: any, res: any): Promise<any>;
    logout(res: any): Promise<any>;
    status(req: any, res: any): Promise<any>;
}
