import {useEffect, useState} from "react";
import {scoreClient} from "../../../core/api-clients.ts";

export interface ScoreRecord {
    deviceId: string;
    quizName: string;
    answerRate: number; // 0–100
    datetime: string;  // ISO string
}

export function formatDatetime(iso: string): { date: string; time: string } {
    const d = new Date(iso);
    const date = d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
    const time = d.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });
    return { date, time };
}

export function getRateLabel(rate: number): string {
    if (rate >= 90) return 'Excellent';
    if (rate >= 70) return 'Good';
    if (rate >= 50) return 'Fair';
    return 'Low';
}

export function getRateTier(rate: number): 'excellent' | 'good' | 'fair' | 'low' {
    if (rate >= 90) return 'excellent';
    if (rate >= 70) return 'good';
    if (rate >= 50) return 'fair';
    return 'low';
}

export type SortField = 'datetime' | 'quizName' | 'answerRate' | 'deviceId';
export type SortDir = 'asc' | 'desc';

export function sortScores(
    records: ScoreRecord[],
    field: SortField,
    dir: SortDir,
): ScoreRecord[] {
    return [...records].sort((a, b) => {
        let cmp = 0;
        if (field === 'datetime') {
            cmp = new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
        } else if (field === 'answerRate') {
            cmp = a.answerRate - b.answerRate;
        } else {
            cmp = a[field].localeCompare(b[field]);
        }
        return dir === 'asc' ? cmp : -cmp;
    });
}

export function useScores(){
    const [scores, setRows] = useState<ScoreRecord[]>([]);
    useEffect(() => {
        scoreClient.getScore().then(res => {
            setRows(res.map(s => {
                return {
                    deviceId: s.deviceId ? s.deviceId : 'unknown',
                    quizName: s.quizName ? s.quizName : 'unknown',
                    answerRate: s.answerRate ? toPercentage(s.answerRate) : 10,
                    datetime: s.time ? s.time : null,
                } as ScoreRecord
            }))
        })
    }, []);
    return {
        scores
    }
}

function toPercentage(value: string): number {
    const [correct, total] = value.split("/").map(Number);
    return Math.round((correct / total) * 100);
}