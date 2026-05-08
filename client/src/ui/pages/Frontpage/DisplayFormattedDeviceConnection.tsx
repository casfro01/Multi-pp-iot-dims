import {useEffect, useState} from "react";
import {StateleSSEClient} from "../../../core/SseClientSecure.ts";
import {subClient} from "../../../core/api-clients.ts";
import {useAtom} from "jotai";
import {tokenAtom} from "../../../core/atoms/token.ts";

export default function DisplayFormattedDeviceConnection() {
    const [sData, setData] = useState<string[]>([]);
    const [code, setCode] = useState<string>("");
    const [token] = useAtom(tokenAtom);
    useEffect(() => {
        const sseClient = new StateleSSEClient("/api/Subscriber/sse", 'connected', token);
        sseClient.listen<string>(async (id) => {
            const res = await subClient.subscribeToDeviceConnection(id)
            setCode(res);
            return { group: "deviceJoin" + res, data: null}
        },
            (data) => {
            if (data){
                setData(prev => [...prev, data]);
            }
            });
    }, [token])
    return <>
        <p>{code}</p>
        <p>{sData.length}</p>
        {
            sData.map((device, i) => (
                <p key={i}>{JSON.stringify(device)}</p>
            ))
        }
    </>
}