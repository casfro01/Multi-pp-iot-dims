import {useAtom} from "jotai";
import {Navigate} from "react-router";
import {tokenAtom} from "../../core/atoms/token.ts";
import {validateToken} from "../../utils/ValidateToken.ts";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({children}: ProtectedRouteProps) {
    const [jwt,] = useAtom(tokenAtom);

    if (!jwt || !validateToken(jwt)) {
        return <Navigate to="/signin" replace />
    }

    return children;

}