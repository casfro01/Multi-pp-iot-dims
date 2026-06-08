import {authClient} from "../../core/api-clients.ts";
import type {LoginRequest} from "../../core/ServerAPI.ts";
import {useAtom} from "jotai";
import {tokenAtom} from "../../core/atoms/token.ts";


export async function login(username: string, password: string): Promise<string | undefined> {
    const request: LoginRequest = {
        userName: username,
        password: password,
    }
    const res = await authClient.login(request);

    return res?.jwt
}

export const useJwt = () => {
    const [jwt,] = useAtom(tokenAtom);

    return jwt;
}