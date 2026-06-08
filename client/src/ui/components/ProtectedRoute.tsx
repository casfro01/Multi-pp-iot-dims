import {useAtom} from "jotai";
import {Navigate} from "react-router";
import {tokenAtom} from "../../core/atoms/token.ts";
import {validateToken} from "../../utils/ValidateToken.ts";
import {signin} from "../pages/pages.ts";
import {useEffect, useState} from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({children}: ProtectedRouteProps) {
    const [jwt] = useAtom(tokenAtom);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [jwt]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!jwt || !validateToken(jwt)) {
        return <Navigate to={signin} replace />;
    }

    return children;

}