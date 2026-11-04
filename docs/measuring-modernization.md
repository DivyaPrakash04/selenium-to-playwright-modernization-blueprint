# Measuring modernization value

Capture a baseline from Selenium before migrating, then compare the same scenarios on Playwright under equivalent environment and load. Report sample size and date; a single run is not a trend.

| Measure | How to compare | What it can show |
|---|---|---|
| Execution time | Median wall time over repeated runs | Faster feedback and capacity released. |
| Test stability | Pass rate over repeated runs | Whether failures reflect product defects or test noise. |
| Flake rate | Failures that pass on rerun ÷ total runs | Synchronization and environment sensitivity. |
| Parallel execution gains | Runtime at controlled worker counts | Throughput improvement and infrastructure tradeoffs. |
| Maintenance cost | Engineer hours spent diagnosing/updating tests | Whether locator and fixture changes reduce upkeep. |
| Developer productivity | Time from change to actionable test feedback | Whether teams can make decisions sooner. |

## Practical comparison

Use the same public scenario set (login, inventory, cart, checkout), browser/CI runner, and retry policy. Separate retry-recovered failures from clean passes, and do not use retries to hide instability. Track both raw values and trends. The reporting chain in this repository is test result → custom JSON metadata → a possible Jira integration; it does not write to Jira.
