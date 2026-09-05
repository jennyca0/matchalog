# Project agent instructions

These instructions apply throughout this repository and resolve conflicts among installed skills. Follow system and developer instructions first, then the user's current request, then these project rules. Skill defaults apply only where compatible with those instructions.

## Selecting skills

The project uses Codex. Skill files live in `.agents/skills/`; update those files directly. Keep skill installations scoped to Codex unless the user requests another runtime.

Use skills for their actual task scope. Reading a skill to audit it does not activate its implementation workflow. Do not activate every design or process skill because its description says "always" or "mandatory."

For a visual change, select one primary visual direction. Preserve the existing product's design system and implementation stack unless the requested change calls for replacing them. Supporting skills may contribute compatible guidance; their conflicting aesthetic defaults do not accumulate. If the user names multiple skills, combine their compatible parts and resolve conflicts from the requested outcome and supplied references.

| Skill | Project scope and conflict resolution |
| --- | --- |
| `redesign-existing-projects` | Use to audit and improve existing UI. Existing product conventions take precedence over generic replacement styles. |
| `minimalist-ui` | Use for a requested quiet editorial direction. Its flat surfaces, restrained motion, borders, and smaller radii govern that direction. |
| `high-end-visual-design` | Use when the requested direction calls for its depth, rounded containers, and richer surfaces. Do not impose its glass, pill buttons, or double containers on a minimalist design. |
| `design-taste-frontend-v1` | Use when explicitly requested or when maintaining work based on this version. Its reference to a newer default does not mean that skill is installed. |
| `gpt-taste` | Use for cinematic marketing work where its approach fits. Random selection, AIDA structure, overlapping imagery, fixed CTA counts, and GSAP motion are optional techniques governed by the brief. |
| `stitch-design-taste` | Use for Google Stitch design specifications. Its layout rules govern that workflow, not every frontend task. The bundled example `DESIGN.md` is not automatically this project's design system. |
| `image-to-code` | Use for an image-led website implementation. A supplied design or approved reference takes precedence over newly generated imagery. Technical fixes and small UI edits do not require new mockups. |
| `imagegen-frontend-web` | Use for website reference images. Generate separate section images when that is the requested format; derive scope from the task rather than automatically expanding it to six or eight sections. |
| `imagegen-frontend-mobile` | Use for native mobile screen concepts and flows. A responsive website does not automatically require phone mockups or a native app flow. |
| `brandkit` | Use for brand identity boards. Its multi-panel board format applies to the brand deliverable; the web skill's separate-section format applies to website references. |
| `full-output-enforcement` | Complete requested deliverables without placeholders. Keep status and final prose concise; full source listings are needed only when requested. Continue work autonomously instead of requiring a "continue" reply merely to finish. |

Accessibility, readable content, responsive behavior, and functional requirements take precedence over aesthetic recipes. Choose fonts, hero alignment, CTA count, card structure, colors, and motion to suit the selected direction. Do not combine contradictory mandates for centered versus asymmetric heroes, flat versus glass surfaces, or small versus oversized radii.

Use the existing animation tools where practical. Add GSAP, Framer Motion, or another dependency only when the requested behavior warrants it. Respect reduced-motion preferences; perpetual animation, pinning, and scroll effects are not universal requirements.

Within a selected skill, explicit constraints take precedence over conflicting examples: minimalist gradient examples do not override its no-gradient rule, and animation examples do not override performance restrictions. Verify font assets and dependencies before using them. If a technique calls for Python randomization, either run it or make a deliberate design choice; never report simulated execution as a real tool result.

## Execution and approval

Treat action requests as authorization to perform the work within their scope. Infer routine choices from context and persist until the intended outcome is complete. Complete independent authorized preparation before asking for missing information or approval so the result is concrete and reviewable.

Planning and brainstorming should support execution. Their skill-level approval gates do not require renewed permission for work already authorized, including reversible edits, reviews, and fixes. Ask only when essential information or actual permission is missing. Continue independent work while awaiting an answer. Follow applicable tool and environment approval requirements.

Delegate bounded independent tasks when collaboration tools are available and doing so can save time or improve quality; continue useful local work alongside them. Use the actual tool schemas for model settings, dispatch, and waits when skill examples disagree with the runtime.

## Verification and communication

Run checks appropriate to the change and complete required checks. Use meaningful tests for behavior and risks that need verification. Do not add tests that merely mirror reversible, low-impact edits. After checks pass, expand or repeat them only for new changes, failures, or unresolved concerns. For documentation-only edits, inspect the text, references, and diff.

Lead with the result or intended action. Use clear, concise paragraphs and plain words. Use lists for genuinely parallel or sequential information. Avoid canned conclusions, invented compound labels, unprompted contrasts, and hypothetical warnings. Report what changed and how it was verified, with material limitations when relevant.
