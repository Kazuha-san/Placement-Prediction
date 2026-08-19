# Cyclomatic Complexity — `_out_of_range_penalty()`

Per AL403 Unit IV: V(G) = number of decision points (D) + 1

## Source (backend/app/prediction.py)

```python
def _out_of_range_penalty(value: float, feature_name: str) -> float:
    rng = TRAINING_RANGES.get(feature_name)
    if not rng:                                    # Decision 1
        return 0.0
    width = rng["max"] - rng["min"]
    if width <= 0:                                  # Decision 2
        return 0.0

    if value < rng["min"]:                          # Decision 3
        dist = (rng["min"] - value) / width
    elif value > rng["max"]:                        # Decision 4
        dist = (value - rng["max"]) / width
    else:
        return 0.0

    if dist <= GRACE:                                # Decision 5
        return 0.0
    return min((dist - GRACE) * PENALTY_SLOPE, PENALTY_CAP_PER_FIELD)
```

## Calculation

| Method | Value |
|---|---|
| Decision points (D) | 5 (four `if`/`elif` conditions + one further `if`) |
| V(G) = D + 1 | **6** |

## Control Flow Graph (nodes/edges cross-check)

Nodes: 1 (entry) → 2 (check rng) → 3 (return 0.0, no rng) → 4 (check width) →
5 (return 0.0, zero width) → 6 (check value<min) → 7 (dist=below-min calc) →
8 (check value>max) → 9 (dist=above-max calc) → 10 (return 0.0, in-range) →
11 (check dist<=GRACE) → 12 (return 0.0, in grace) → 13 (return penalty) = 13 nodes

Edges = 15 (each decision node has 2 outgoing edges, non-decision nodes have 1,
converging back toward the function's multiple return points)

V(G) = E - N + 2 = 15 - 13 + 2 = **6** ✓ (matches decision-point method)

## Minimum Test Cases Required for Full Branch Coverage

6 independent paths must be exercised at minimum:
1. `rng` not found (unknown feature)
2. `width <= 0` (zero-width range)
3. `value < min`, `dist <= GRACE` (in grace band, below min)
4. `value < min`, `dist > GRACE` (penalized, below min)
5. `value > max` (either grace or penalized branch, above max)
6. `min <= value <= max` (in range, no penalty)

## Actual Test Coverage Provided

`testing/unit/test_prediction_logic.py::TestOutOfRangePenalty` provides
**13 test cases** (TC-UT-01, 01b, 02–12) — more than double the minimum 6
required for full branch coverage, additionally covering boundary values
(exact min/max, exact GRACE boundary) and the penalty cap, per Boundary
Value Analysis on top of the base branch-coverage requirement.

Confirmed via `pytest --cov=app.prediction --cov-branch`: this function
shows 100% branch coverage in the coverage report (see Section 4.2 of the
Test Plan).
