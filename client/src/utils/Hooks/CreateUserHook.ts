import {authClient} from "../../core/api-clients.ts";
import type {RegisterRequest} from "../../core/ServerAPI.ts";
import {login} from "./LoginHook.ts";

export async function createUserFunc(username: string, password: string): Promise<string | undefined>{
    const request: RegisterRequest = {
        userName: username,
        password: password,
    }
    const res = await authClient.register(request);

    if (!res){
        return undefined;
    }

    return await login(username, password);
}