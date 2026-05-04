import {useState} from "react";
import {useAtom} from "jotai";
import {tokenAtom} from "../../../../core/atoms/token.ts";
import {createUserFunc} from "../../../../utils/Hooks/CreateUserHook.ts";

export const useCreateUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [,setJwt] = useAtom(tokenAtom);

    const createUser = async (): Promise<boolean> => {
        setError('');
        setSuccess('');

        if (!username.trim()) {
            setError('Please choose a username.');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return false;
        }
        setLoading(true);

        let res: string | undefined = undefined;
        try{
            res = await createUserFunc(username, password);
        }
        catch(error){
            console.log(error);
        }
        setLoading(false);

        if (res){
            setSuccess('Account created! Redirecting…');
            setJwt(res);
            return true
        }
        else setError('Could not create account. (Possibly because username is taken)');
        return false;
    }

    return {
        username,
        password,
        error,
        loading,
        success,
        setUsername,
        setPassword,
        createUser,
    }
}