export type Role = 'Unknown' | 'Admin' | 'User';

export type Permission = 'AdminPanel' | 'RegisterAdmin' | 
                         'Dashboard' | 'RoomsView' | 'RoomsEdit' |
                         'DevicesView' | 'DevicesEdit' |
                         'ScenesView' | 'ScenesEdit' |
                         'Automation' | 'Energy';

export class AuthData
{
    constructor(private _login?: string,
                private _token?: string,
                private _roles?: Role[],
                private _permissions?: Permission[])
    {}

    public get login(): string | undefined { return this._login; };

    public get token(): string | undefined { return this._token; };

    public get isAuthorized(): boolean { return !!this._token; };

    public get roles(): Role[] { return this._roles ?? []; };

    public get permissions(): Permission[] { return this._permissions ?? []; };
}

export const Unauthorized: AuthData = new AuthData();