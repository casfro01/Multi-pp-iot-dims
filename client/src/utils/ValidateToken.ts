export function validateToken(token: string |null): boolean {
    if (!token) return false;

    const payload = decodeJwt<{ exp: number }>(token);
    if (isExpired(payload.exp)) return false;

    return true;
}


function decodeJwt<T>(token: string): T {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
}

function isExpired(exp: number): boolean {
    return Date.now() >= exp * 1000;
}