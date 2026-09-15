# KIDDO Adaptive Progression V1

## Principle

KIDDO follows the curriculum. Learner evidence determines pace, practice, support, and challenge; it does not replace the curriculum pathway.

## State model

- **Developing** — insufficient evidence of secure understanding. Continue the current curriculum step and gather more evidence.
- **Secure** — evidence indicates the learner can progress. Avoid unnecessary repetition and move to the next required node.
- **Needs support** — evidence indicates the learner is struggling. Route toward support/remediation before normal progression.

## Progression rule

For the active curriculum node:

1. Determine learner state from recorded evidence.
2. If the state is `needs_support`, keep the learner anchored to the current concept and provide support.
3. If the node's mastery threshold has not been met, keep the learner on that node and collect further evidence.
4. Once the threshold is met, advance to the next required curriculum node.
5. At the end of a pathway, mark the pathway complete rather than inventing additional curriculum.

## Mastery thresholds

The mastery policy is deliberately centralized so thresholds can be tuned as real learner data accumulates. Current stage thresholds are:

- Guided Practice: 3 attempts at 60% accuracy.
- Independent Practice: 3 attempts at 80% accuracy.
- Mastery Mission: 3 attempts at 90% accuracy.

These are product defaults, not permanent educational claims. They should be validated against learner outcomes before being treated as final policy.

## Future extensions

The next layer can add differentiated remediation, acceleration, spaced revision, and mastery missions while preserving the same curriculum spine.
