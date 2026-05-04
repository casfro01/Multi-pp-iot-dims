import {useState} from "react";
import {login} from "../../../../utils/Hooks/LoginHook.ts";
import {useAtom} from "jotai";
import {tokenAtom} from "../../../../core/atoms/token.ts";

export const useSignInPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [,setJwt] = useAtom(tokenAtom);

    const loginAsync = async (): Promise<boolean> => {

        setError('');
        if (!username.trim() || !password.trim()) {
            setError('Please fill in both fields.');
            return false;
        }

        setLoading(true);

        try{
            const res = await login(username, password);

            setLoading(false);

            if (res) {
                setJwt(res);
                return true;
            }
        }
        catch(error){
            setError("Wrong username or password");
            console.log(error)
        }
        setLoading(false);
        return false;
    }

    return {
        setUsername,
        setPassword,
        username,
        password,
        error,
        loading,
        loginAsync
    }
}