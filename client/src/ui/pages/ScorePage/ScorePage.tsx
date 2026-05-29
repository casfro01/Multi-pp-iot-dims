import "./Scorepage.css"
import {
    formatDatetime,
    getRateLabel,
    getRateTier,
    type SortField,
    type SortDir, useScores,
} from './useScorePage.ts';
import {useState} from "react";
import {useNavigate} from "react-router";
import {main} from "../pages.ts";

const SORT_OPTIONS: { field: SortField; label: string }[] = [
    { field: 'datetime',   label: 'Date' },
    { field: 'quizName',   label: 'Quiz' },
    { field: 'answerRate', label: 'Rate' },
    { field: 'deviceId',   label: 'Device' },
];

export default function ScoresPage() {
    const navigator = useNavigate();
    const onBack= () => {navigator(main);}
    const [sortField, setSortField] = useState<SortField>('datetime');
    const [sortDir,   setSortDir]   = useState<SortDir>('desc');

    const {scores: records} = useScores();

    const avgRate = Math.round(
        records.reduce((s, r) => s + r.answerRate, 0) / records.length,
    );
    const topScore = Math.max(...records.map((r) => r.answerRate));

    function handleSort(field: SortField) {
        if (field === sortField) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    }

    return (
        <div className="scores-root">
            {/* Background decoration */}
            <div className="scores-bg" aria-hidden="true">
                <div className="scores-bg__orb scores-bg__orb--1" />
                <div className="scores-bg__orb scores-bg__orb--2" />
                <div className="scores-bg__orb scores-bg__orb--3" />
            </div>

            <main className="scores-page">
                <div className="scores-inner">

                    {/* Back */}
                    <button className="scores-back" onClick={onBack} type="button">
                        <span className="scores-back__arrow">←</span>
                        Back to main
                    </button>

                    {/* Header */}
                    <header className="scores-header">
                        <h1 className="scores-title">Score Records</h1>
                        <p className="scores-subtitle">{records.length} sessions logged</p>
                    </header>

                    {/* Summary stats */}
                    <div className="scores-stats">
                        <div className="scores-stat-card">
                            <div className="scores-stat-card__label">Total Sessions</div>
                            <div className="scores-stat-card__value">{records.length}</div>
                        </div>
                        <div className="scores-stat-card">
                            <div className="scores-stat-card__label">Avg Answer Rate</div>
                            <div className="scores-stat-card__value scores-stat-card__value--accent">
                                {avgRate}%
                            </div>
                        </div>
                        <div className="scores-stat-card">
                            <div className="scores-stat-card__label">Top Score</div>
                            <div className="scores-stat-card__value">{topScore}%</div>
                        </div>
                    </div>

                    {/* Sort toolbar */}
                    <div className="scores-toolbar" role="group" aria-label="Sort records">
                        <span className="scores-toolbar__label">Sort by</span>
                        {SORT_OPTIONS.map(({ field, label }) => {
                            const active = sortField === field;
                            const icon = active ? (sortDir === 'asc' ? '↑' : '↓') : '';
                            return (
                                <button
                                    key={field}
                                    className={`scores-sort-btn${active ? ' scores-sort-btn--active' : ''}`}
                                    onClick={() => handleSort(field)}
                                    type="button"
                                    aria-pressed={active}
                                >
                                    {label}
                                    {active && <span className="scores-sort-btn__icon">{icon}</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Table */}
                    <div className="scores-table-card">
                        {records.length === 0 ? (
                            <p className="scores-empty">No score records found.</p>
                        ) : (
                            <table className="scores-table">
                                <thead>
                                <tr>
                                    <th>Device</th>
                                    <th>Quiz</th>
                                    <th>Date &amp; Time</th>
                                    <th>Answer Rate</th>
                                </tr>
                                </thead>
                                <tbody>
                                {records.map((record, idx) => {
                                    const { date, time } = formatDatetime(record.datetime);
                                    const tier          = getRateTier(record.answerRate);
                                    const label         = getRateLabel(record.answerRate);
                                    return (
                                        <tr key={idx}>
                                            <td>
                                                <span className="scores-device">{record.deviceId}</span>
                                            </td>
                                            <td>
                                                <span className="scores-quiz">{record.quizName}</span>
                                            </td>
                                            <td>
                                                <div className="scores-datetime">
                                                    <span className="scores-datetime__date">{date}</span>
                                                    <span className="scores-datetime__time">{time}</span>
                                                </div>
                                            </td>
                                            <td>
                          <span className={`scores-rate scores-rate--${tier}`}>
                            <span className="scores-rate__pct">{record.answerRate}%</span>
                              {label}
                          </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}