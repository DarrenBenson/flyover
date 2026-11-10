# Sprint Report: RUN-01M73QDR

## Goal

A credited photo is shown, or no photo, and never a copied logo

**Verdict: Judged achieved** - A credited photo renders with a link and a QR code, and an empty list renders neither.

> **Run:** 2026-11-10T21:51:02Z to 2026-11-10T22:01:49Z (0.2h)
> **Verified on:** b94bca835700a5d5fed8bd22ad4d1ad44c20677a   **Fingerprint:** ec2381fa655205d7

## Estimates

How far the plan's forecast was from what the run took. Points are compared over the
delivered units; minutes over the units' own measured minutes, summed over the units that also
carry a forecast; tokens over the whole run. The run's wall-clock span stands on its own
line with no ratio. Ratio is actual over forecast.

| Measure | Forecast | Actual | Ratio | Over |
| --- | --- | --- | --- | --- |
| Points | 3 | 3 | 1.0x | 1 of 1 delivered unit(s) |
| Minutes | NOT MEASURED - the plan recorded no minute forecast for any unit | NOT MEASURED - no unit carries a measured time (an In Progress span or agent minutes) | NOT MEASURED - needs both a forecast and an actual | the whole run: forecast over 0 of 1 unit(s) planned or added and not dropped; no unit carries both a forecast and a measured time |
| Wall-clock span | not forecast | 10.8 | no ratio | the run's minutes, start to end, so waiting counts; the forecast is active work, so the two are not compared |
| Priced cost | not forecast | NOT MEASURED - the run carries no meter stamp and no session token baseline | no ratio | priced input-equivalent tokens, the run's headline cost |
| Tokens | 75,000 | NOT MEASURED - the run carries no meter stamp and no session token baseline | NOT MEASURED - withheld - no delegated spend was supplied, so the actual is the main-thread meter alone, which cannot see a delegated agent's spend; each lane records its builder's total with `sprint lane return --tokens N` | the whole run: forecast over 1 of 1 unit(s) planned or added and not dropped; actual is the run meter, a lower bound |
| Priced per point | not forecast | NOT MEASURED - the run carries no meter stamp and no session token baseline | no ratio | the Priced cost row over the 3 point(s) of the 1 delivered unit(s), in priced input-equivalent tokens per point |
| Dollar cost | not forecast | NOT MEASURED - the reading carries no per-model split of its components | no ratio | estimated US dollars: each model's own components in the Priced cost row times that model's list prices; price table effective 2026-11-06 |
| Dollars per point | not forecast | NOT MEASURED - the reading carries no per-model split of its components | no ratio | the Dollar cost row over the 3 point(s) of the 1 delivered unit(s); price table effective 2026-11-06 |

Each cell names its source. A figure labelled agent minutes or agent tokens sums the agent
totals tagged to that unit; an unlabelled one is measured over the unit's own open span. The
actual on the Minutes row above sums these minutes over the units that also carry a forecast;
spans of units open at the same time overlap, so that sum can exceed the wall-clock span.

| Unit | Dollars | Forecast minutes | Minutes | Forecast tokens | Tokens | Priced |
| --- | --- | --- | --- | --- | --- | --- |
| US01M73FFM | NOT MEASURED - no agent returned for it was priced from its own transcript | NOT MEASURED - not in the plan | NOT MEASURED - no In Progress span and no agent total tagged to it - record one with `retro.py accuracy --delegated-tokens N --delegated-unit US01M73FFM --delegated-minutes M` | 75,000 | NOT MEASURED - no In Progress span and no agent total tagged to it - record one with `retro.py accuracy --delegated-tokens N --delegated-unit US01M73FFM --delegated-minutes M` | NOT MEASURED - no agent returned for it was priced from its own transcript - price one with `sprint.py lane return --units US01M73FFM --agent A` |

## Delivered to plan

| Measure | Units | Points |
| --- | --- | --- |
| Planned | 1 | 3 |
| Delivered of the plan | 1 | 3 |
| Added mid-run and delivered | 0 of 0 added | 0 |
| Dropped | 0 | 0 |
| Carried undelivered | 0 | 0 |

Points here are the sizes the plan recorded: a unit resized since keeps its planned size and
shows its current size below, and an added unit is sized when it is added. Added units are work
outside the plan and are never counted as delivering it. Points delivered at their current
size, plan and added together: 3.

| Unit | Planned points | Points | Outcome | Review rounds |
| --- | --- | --- | --- | --- |
| US01M73FFM | 3 | 3 | delivered | 1 |

## Known issues handed over

0 open finding(s) raised in the run, 0 close gap(s), 0 carried unit(s)

No open finding, close gap or carried unit is recorded.

## Sign-off

| Signed by | Date | Fingerprint signed |
| --- | --- | --- |
| Darren Benson (delegated to Juno) | 2026-11-10T22:01:49Z | ec2381fa655205d7 |

Signing records the principal, the date and this report's fingerprint against RUN-01M73QDR.

## Appendix

### Tokens by model

NOT MEASURED - the run carries no meter stamp and no session token baseline (consulted sdlc-studio/.local/run-state.json)

Delegated: NOT MEASURED - no delegated agent supplied a total, which is not the same fact as no work having been delegated.

**Cost by role: NOT MEASURED** - no closing reading in the run's window recorded the spend by role (consulted sdlc-studio/.local/run-state.json)

### DORA

| Key | This run | Mapping | Elite band | Derived from |
| --- | --- | --- | --- | --- |
| Deployment frequency | 1 | a push to main IS the deployment in this trunk-based repository: there is no separate deploy step, and CI on that commit is what decides whether the change stood up; with no forge run data a deployment is counted as a commit on main inside the run window | on demand | git history - 1 commit(s) on main inside the run window |
| Lead time for changes | NOT MEASURED - no forge run data | the span from the run's first commit on main to its last - per-commit lead time is not derived, because the work is committed locally and pushed in batches | under a day | no commit and no push-triggered run inside the run window |
| Change failure rate | NOT MEASURED - no forge run data | a push to main IS the deployment in this trunk-based repository: there is no separate deploy step, and CI on that commit is what decides whether the change stood up; the rate is the share of push-triggered CI runs on main that concluded failure or timed out - a cancelled or skipped run is not a failed deployment | 0-15% | no push-triggered CI run is readable for this run window |
| Time to restore | NOT MEASURED - no forge run data | per red streak on main, in creation order, the span from its first failure's conclusion to the conclusion of the first push-triggered run created after it that concluded success, floored at zero; the median over the window's restored streaks, or not restored while the window's last streak is still red | under an hour | no push-triggered CI run is readable for this run window |

### Calibration

| Rate | Value | Source |
| --- | --- | --- |
| Tokens per point | 25,000 | seed |
| Minutes per point | NOT MEASURED - the plan snapshot records no rate | not measured |

### Rulings

Persona seats ruled 0 time(s), 0 of them by citing a
precedent; the operator ruled 0 time(s).

### Waivers in force

no gate stood down for this seal - the log was read and carries no accepted waiver dated inside this report's window

### Lessons

8 lesson class(es) in force at this close.

| Lesson | Class | State | Hits this run | Hits in total |
| --- | --- | --- | --- | --- |
| LC-001 | mutant never applied | active | 0 | 0 |
| LC-002 | criterion words outrun the fixture | active | 0 | 0 |
| LC-003 | mechanism reaches no caller | active | 0 | 0 |
| LC-004 | premise not executed | active | 0 | 0 |
| LC-005 | repair breaks its neighbour | active | 0 | 0 |
| LC-006 | absence read as an answer | active | 0 | 0 |
| LC-007 | shared machine resources exhausted | active | 0 | 0 |
| LC-008 | constraint added without retirement | active | 0 | 0 |

### Not measured

Close checklist rows this run gave nothing to measure. Nothing is known to be wrong, so none is
a known issue; nothing is known to be right, so none reads as done.

| Row | State | Why |
| --- | --- | --- |
| cost: Cost, velocity and estimate accuracy | not measured | no per-unit telemetry, no measured run total and no supplied sprint total, so what this sprint cost is not attributable - which is not zero |
