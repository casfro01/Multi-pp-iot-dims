import {useEffect, useState} from "react";
import {StateleSSEClient} from "../../../core/SseClientSecure.ts";
import {authClient, subClient} from "../../../core/api-clients.ts";
import {useAtom} from "jotai";
import {tokenAtom} from "../../../core/atoms/token.ts";
import {mapToPairingPayload, type PairingPayload} from "../../../core/Types/PairingPayload.ts";
import {useNavigate} from "react-router";


export type Step = 'name' | 'code' | 'success'
export interface LinkDeviceState {
    step: Step
    displayName: string
    code: string | null
    loading: boolean
    error: string | null
}


export const useLinkDevicePage = () => {
    const [token] = useAtom(tokenAtom);
    const [client, setClient] = useState<StateleSSEClient | null>(null);

    const [state, setState] = useState<LinkDeviceState>({
        step: 'name',
        displayName: '',
        code: null,
        loading: false,
        error: null,
    });
    const navigator = useNavigate();
    const onSuccess = async (payload: PairingPayload) => {
        setState(s => ({...s, loading: true, error: null}));
        try{
            await authClient.setDisplayName({
                displayName: state.displayName,
                deviceId: payload.DeviceId,
                code: state.code ? state.code : undefined,
                userId: "shababs"
            })
        }
        catch(error: unknown){
            console.log(error);
            setState(s => ({...s, loading: false, error: "Something happend. booo hooo."}));
        }
        navigator("/main")
    };
    // set display name -> which should update the state, which should call an useEffect to fetch a code
    const handleNameSubmit = async (displayName: string) => {
        setState(s => ({ ...s, loading: true, error: null }))
        try {
            setState(s => ({
                ...s,
                step: 'code',
                displayName: displayName,
                loading: false,
            }))
        } catch (err) {
            setState(s => ({
                ...s,
                loading: false,
                error: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
            }))
        }
    }
    const handleBack = () => {
        setState({ step: 'name', displayName: '', code: null, loading: false, error: null })
        client?.disconnect();
    }
    useEffect(() => {
        if (state.displayName === '' || state.code || state.step != 'code') return;
        const sseClient = new StateleSSEClient('/api/Subscriber/sse', 'connected', token)
        setClient(sseClient);
        const unsubscribe = sseClient.listen<PairingPayload | string>(
            async (connectionId) => {
                const code = await subClient.subscribeToDeviceConnection(connectionId)
                setState(s => ({ ...s, code: 'success' }))
                console.log(code);
                return { group: 'deviceJoin' + code, data: null };
            },
            (raw) => {
                const payload = mapToPairingPayload(raw);
                if (payload){
                    setState(s => ({ ...s, step: 'success' }))
                }
                onSuccess(payload);
            },
        )
        return () => {
            unsubscribe();
            sseClient.disconnect();
        }
    }, [state]);

    return {
        state,
        navigator,
        onSuccess,
        handleNameSubmit,
        handleBack
    }
}