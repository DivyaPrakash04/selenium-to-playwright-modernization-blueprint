# Cloud AI vs local AI for migration

| Consideration | Cloud model | Local model |
|---|---|---|
| Security and privacy | Code is sent to a provider; use only approved services and data. | Data can remain on managed local infrastructure; endpoint access still needs controls. |
| Cost | Subscription or token charges; little local hardware. | Infrastructure and operations cost; model may be free to download. |
| Compliance | Depends on provider terms, region, retention, and organizational approval. | Can support restricted environments, subject to model license and local controls. |
| Accuracy | Often strong reasoning and broad context; output still needs review. | Varies by model and hardware; smaller context may need narrower tasks. |
| Performance | Network and provider capacity affect latency. | Depends on available CPU/GPU and model size; no network round trip. |
| Best fit | Approved, non-sensitive code and complex migration analysis. | Restricted source code, offline work, or repeatable narrow conversions. |

## A safe working loop

1. Classify the source and select an approved model path.
2. Send one test plus minimal sanitized DOM evidence, not a whole repository by default.
3. Ask for complete code and explicit uncertainty; do not invite guessed selectors.
4. Review generated code with `ai-review-checklist.md` and execute it locally.
5. Record what changed and compare results with the legacy test.

Neither cloud nor local AI makes generated code trustworthy by itself. Human review and observed execution connect AI-assisted migration to Playwright results and business visibility.
