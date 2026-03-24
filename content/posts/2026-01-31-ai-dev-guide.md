---
layout: post
title: "Mastering AI-Assisted Development"
date: 2026-01-31
categories:
  - DevOps
  - AI
description: >-
    TBD
cover:
    image: "/images/posts/ai-assistant.jpg"
    alt: "AI Assisted Development"
    caption: "AI Assisted Development"
---

I've been delegating more coding than ever to AI in the last few months. Over time, I noticed some common patterns that work and common pitfals. I've distilled what works for me when AI to do most of the heavy lifting. This isn't about prompt engineering tricks—it's about fundamentally rethinking your development workflow.

If you're an experienced engineer looking to delegate more coding to AI while maintaining quality and control, this guide will help you assess where you are and where you could be.

Before you start, a critical assessment is important. YOU are the Software Engineer not the AI. That means that building something you don't understand will lead to problems you can't fix. Software Engineering skills are more critical than ever, but the code is not necessarily written by you.

---

## 1. Specs Are Essential

**The Reality:** You need specifications (PRDs + technical specs) that tell AI what to build. AI can help you write specs, but it can't replace your domain knowledge, business context, or architectural vision.

**The Nuance:** AI is excellent at expanding rough outlines into structured specs and finding edge cases. But it often misses non-functional requirements, political constraints, performance considerations, and business priorities that aren't explicitly stated.

**Why This Matters:** A good spec is the foundation of everything. Without it, you're having the same conversation repeatedly. But a spec written entirely by AI without your domain expertise will miss critical context.

**What Good Looks Like:**
1. Start with a rough outline that includes business context and constraints (1-2 paragraphs)
2. Ask AI to expand it into a structured spec with requirements and acceptance criteria
3. Iterate on the spec with AI—it's faster than implementation. Include edge-case checks, and conflicting requirements.
4. **Critically review and add:** Performance requirements, security constraints, business priorities, integration complexity
5. Once the spec is solid, hand it to AI for implementation

**Common Pitfalls:**
- Jumping straight to implementation without a spec
- Letting AI write specs without sufficient domain context
- Making specs too rigid (see point 4 about balance)
- Not versioning specs as requirements evolve
- Assuming AI understands implicit business priorities

**Self-Assessment:** Do you find yourself re-explaining the same feature multiple times across conversations? You need better specs. Do your specs miss business context that you "just know"? You're delegating too much spec-writing to AI.

---

## 2. Manage Context Aggressively

**The Reality:** Claude Sonnet 4.5 advertises a 200K token context window. In practice, you get roughly 150K words before things break down. That's about 300 pages of dense technical documentation—sounds generous until you try to feed it your entire codebase.

**The Nuance:** Different models handle context differently. Some engineers successfully run 50+ message conversations without catastrophic degradation. The key is understanding that context isn't just about size—it's about signal-to-noise ratio.

**Why This Matters:** "dumping everything and letting AI figure it out" leads to bloated prompts with redundant file reads, entire dependency trees, and tangential code that dilutes the signal.

**What Good Looks Like:**
- Be surgical about context. Only include files directly relevant to the task.
- Use semantic search to find specific implementations rather than reading entire modules.
- Chunk large tasks into smaller, focused sessions with targeted context.
- Think of context like RAM—every byte counts.
- For critical architectural decisions, repeat them explicitly rather than relying on distant context.
- Start fresh conversations for distinct features or bug fixes
- Keep conversations focused on single objectives
- Monitor conversation length and proactively reset before quality degrades
- Trying to implement multiple unrelated features in one mega-conversation

**Common Pitfalls:**
- Reading entire files when you only need specific functions
- Including test files, config files, and documentation "just in case"
- Letting AI explore freely without constraining its search space
- Assuming AI remembers details from 40+ messages ago

**Self-Assessment:** Are you regularly hitting context limits or noticing quality degrading mid conversation? If yes, you're not managing context well enough.

---

## 3. The Specificity-Autonomy Balance Is Where Magic Happens

**The Reality:** Being too vague ("add authentication") leaves AI guessing. Being too specific ("add a React hook called useAuth with methods login, logout, and refreshToken that stores JWT in localStorage") removes AI's ability to suggest better approaches.

**Why This Matters:** The sweet spot is specifying *what* and *why* while leaving *how* flexible enough for AI to apply best practices.

**What Good Looks Like:**
- Define the problem and constraints: "Users need authentication that persists across sessions and supports token refresh"
- Specify non-negotiables: "Must integrate with our existing Auth0 setup"
- Leave implementation details open: Let AI suggest the data structure, hook design, and error handling approach
- Provide architectural guardrails: "Follow the patterns in our existing user service module"

**Common Pitfalls:**
- Micro-managing every variable name and function signature
- Writing pseudo-code and asking AI to "just implement this"
- Being so vague that AI has to make wild assumptions
- Not providing enough context about existing patterns and conventions

**Self-Assessment:** Does AI often surprise you with better solutions than you imagined? Or does it just act as a typing assistant? The former means you're in the sweet spot.

---

## 4. Limit AI's Blast Radius

**The Reality:** AI with unlimited tool access can accidentally leak sensitive data, modify unrelated files, or make changes in production systems. Constraints aren't restrictions—they're safety rails.

**Why This Matters:** Data leaks happen when AI reads sensitive config files or API keys and includes them in responses. Unintended changes occur when AI has write access to files outside the current feature scope.

**What Good Looks Like:**
- Scope AI's file access to specific directories for each task
- Use environment-specific credentials (dev/staging only)
- Review diffs before committing AI-generated code
- Use tools like .gitignore to exclude sensitive files
- Consider sandboxed environments (including networking) for AI-assisted development
- Use feature branches for all AI-generated changes
- Implement pre-commit hooks that check for secrets

**Common Pitfalls:**
- Giving AI access to entire codebase when working on one module
- Not reviewing generated code before committing
- Letting AI read .env files, secrets, or production configs
- Allowing network access to production databases from AI-assisted sessions
- Not using feature branches for AI-generated changes
- Assuming AI will "know" not to touch sensitive files

**Self-Assessment:** Could AI accidentally access your production database or commit secrets? If you're not sure, your blast radius is too large.

---

## 5. Stay ON the Loop, Not IN the Loop

**The Reality:** While important overall, the tools (Copilot, Cursor, Claude, ChatGPT) matter less than how you structure the workflow. The real leverage comes from setting up the right context and letting AI iterate autonomously.

**The Nuance:** Tooling is probably 50% of the equation. But the other 50%—how you structure specs, context, and verification—is what this guide focuses on because it's tool-agnostic and transferable.

**Why This Matters:** Being "in the loop" means approving every single change—tedious and slow. Being "on the loop" means setting up guardrails (specs, tests, types), letting AI work through multiple iterations, then reviewing the complete result.

**The ON vs. IN Distinction:**
- **IN the loop:** "Add a button. Now change its color. Now add an icon. Now move it left..."
- **ON the loop:** "Add a CTA button matching our design system that triggers user signup. Make sure it passes our accessibility tests. GO."

**What Good Looks Like:**
- Choose tools that fit your workflow (IDE integration vs. web interface vs. CLI)
- Write comprehensive specs with clear acceptance criteria (AI's guardrails)
- Provide AI with test suites it should pass
- Let AI iterate on implementation without constant check-ins
- Review completed work in bulk, not line-by-line during development
- Focus your time on architecture and specs, not individual implementations

**Common Pitfalls:**
- Micromanaging every AI decision (defeats the purpose)
- Not setting up proper guardrails (tests, types, linting) before letting AI work
- Reviewing code mid-implementation instead of after completion
- Not trusting AI enough to work autonomously within defined boundaries
- Dismissing tooling differences as irrelevant
- Not experimenting with different tools to find your best fit

**Self-Assessment:** Are you spending more time directing AI than you would just coding? You're too far "in the loop." Does AI frequently produce broken code? Your guardrails are too weak. Are you frustrated by your tool's limitations? Maybe it's time to try a different one.

---

## 6. Create a Project Navigation Guide

**The Reality:** AI spends significant time searching for relevant files, understanding project structure, and locating existing implementations. A navigation README eliminates this wasteful exploration.

**Why This Matters:** Every minute AI spends searching is wasted context space and slower iteration. A good navigation document frontloads critical information about where things live and why.

**What Good Looks Like:**
Create a `AGENTS.md` file that includes:
- Project architecture overview
- Location of specs/PRDs for each feature
- File/folder structure with purpose explanations
- Key patterns and conventions (naming, styling, testing)
- Common operations and where their code lives
- Links to detailed technical specs
- **What NOT to touch** (legacy code, generated files, sensitive areas)
- Have AI add key learnings at the end of its loop

Then, start every AI conversation with: "Load AGENTS.md first, then proceed with the task."

**Example Structure:**
```markdown
# Project Navigation Guide

## Architecture
- Frontend: Vue 3 + TypeScript in `src/`
- Backend: Python Azure Functions in `api/`
- Tests: Playwright E2E in `tests/`, pytest unit tests in `api/test/`

## Feature Specs
- Export System: See `docs/recipe-book-export-prd.md`
- Authentication: See `docs/auth-spec.md`

## Code Locations
- Recipe data access: `src/services/recipe.ts`
- PDF generation: `src/helpers/pdfHelpers.ts`
- Navigation menu: Configured in `TopBar.vue` and `RecipeList.vue`

## Key Patterns
- Components: PascalCase, located in `src/components/`
- State: Custom reactive store via `src/services/store.ts`
- Routing: Hash-based with file-based route generation

## DO NOT MODIFY
- `src/legacy/` - being phased out, don't enhance
- Generated files in `dev-dist/`
```

**Common Pitfalls:**
- Not creating this file until the project is already complex
- Making it too detailed (should be a map, not documentation)
- Forgetting to update it as architecture evolves
- Not explicitly telling AI to load it first
- Not including "no-go zones" that AI should avoid

**Self-Assessment:** Does AI frequently ask "where is X implemented?" or search through many files before finding the right one? You need a navigation guide.

---

## 7. Verify AI Code Quality Systematically

**The Reality:** AI-generated code can be syntactically correct but semantically wrong, miss edge cases, or introduce subtle bugs. Trust, but verify—systematically.

**Why This Matters:** The promise of AI coding is speed, but speed without quality is technical debt. The key is setting up systems that catch issues automatically, allowing AI to iterate toward correctness.

**What Good Looks Like:**
- **Type Safety:** Use TypeScript, Python type hints, or similar. AI respects types and they catch many bugs
- **Automated Tests:** Require AI to make existing tests pass and create tests for new code
- **Linting and Formatting:** Auto-run on save. AI should fix its own style issues
- **Code Review Checklists:** After AI completes work, review against your team's standards
- **Incremental Verification:** Have AI run tests after each logical chunk, not just at the end
- **Manual Testing:** Don't skip it. AI doesn't understand user experience.
- **UI Changes:** Provide tools to AI to validate UI changes before task completion. A Playwright MCP or similar skill can greatly improve the output

**AI-Assisted Quality Loop:**
1. AI implements feature
2. AI runs type checker and fixes errors
3. AI runs UI checks if appropriate
4. AI creates tests for new code
5. AI runs tests and fixes failures
6. AI runs linter and addresses warnings
7. You review for logic, architecture, and maintainability
8. **You test it manually** for UX, performance, and edge cases

**Common Pitfalls:**
- Accepting AI code without running tests
- Not providing AI with test output when things fail
- Disabling strict type checking because "it's faster"
- Skipping code review because "AI wrote it"
- Not giving AI error messages to fix its own mistakes
- Assuming passing tests mean the code is correct
- Not testing for performance or user experience issues

**Self-Assessment:** Do you regularly find bugs in AI-generated code during manual testing? Your automated verification is too weak. Do you skip manual testing because tests pass? You're building technical debt.

---

## 8. Understand the Cost-Performance Tradeoff

**The Reality:** Not all tasks are worth AI's time, and not all AI approaches are cost-effective. Being strategic about when and how to use AI maximizes value.

**Why This Matters:** AI API costs, compute time, your time, and the learning curve are all resources. Using AI to format JSON or rename variables is expensive overkill. Using it to architect complex systems is high leverage.

**Cost-Effective Use Cases:**
- **High:** New feature implementation, writing comprehensive tests, exploring unfamiliar libraries
- **Medium:** Debugging complex issues, documentation generation, code reviews
- **Low:** Simple renaming, formatting, trivial fixes you could do in 30 seconds

**The Hidden Costs:**
- **Learning curve:** Weeks to months learning optimal AI workflows
- **Context switching:** Mental overhead moving between AI-assisted and manual work
- **Review time:** Reviewing AI code takes longer than reading human code (trust deficit)
- **Maintenance debt:** AI may generate working code that's harder to maintain long-term

**Performance Optimization:**
- **Focused context:** Smaller context = faster responses = cheaper tokens
- **Smart caching:** Reuse specs and navigation docs across conversations
- **Right-sized models:** Use smaller/faster models for simple tasks (e.g., GitHub Copilot for autocomplete vs. Claude for architecture)

**The Cost Model:**
- AI API calls: Paid per token (input + output)
- Your time: Most expensive resource
- Iteration speed: Faster feedback = more attempts = better results
- **Opportunity cost:** Time learning AI workflows vs. just building

**Decision Framework:**
```
Is the task:
- Tedious and well-defined? → AI (high value)
- Complex but exploratory? → You (for now), then AI to implement
- Simple and quick? → Just do it yourself
- Creative/architectural? → Collaborate with AI
- Critical security/performance code? → You lead, AI assists
```

**Common Pitfalls:**
- Using AI for every tiny change (death by a thousand API calls)
- Not monitoring your AI API spending
- Choosing slow, expensive models for simple tasks
- Forgetting that your time reviewing bad AI output is a cost too
- Not measuring whether AI is actually saving time on specific task types
- Ignoring the learning curve investment

**Self-Assessment:** Are you spending more on AI API calls than you're saving in developer time? Are you using AI for tasks that take longer to explain than to just do? Are you still learning optimal workflows after months? Reassess your cost-performance balance.

---

## 9. Beware the Maintenance Debt You're Creating

**The Hard Truth:** AI-generated code often works beautifully on day one but creates maintenance headaches months later. This is the #1 complaint from teams using AI at scale.

**Why This Happens:**
- AI doesn't know your team's abstraction patterns
- AI copies and pastes similar code across files instead of extracting shared utilities
- AI over-engineers solutions because it doesn't know your constraints
- AI writes code that works but lacks the "why"—comments and documentation are minimal or generic

**What Maintenance Debt Looks Like:**
- Duplicated logic across 10 files that should be one utility
- "Clever" solutions that work but no one understands six months later
- Missing error handling for edge cases discovered in production
- Code that passes tests but has performance issues at scale
- Dependencies added without consideration for bundle size or security

**What Good Looks Like:**
- Review AI code for abstractions: "Should this be a shared utility?"
- Enforce documentation standards: AI must explain complex logic
- Check for duplication: Search for similar patterns across the codebase
- Consider maintenance: "Will I understand this in six months?"
- Refactor proactively: Don't let AI-generated code accumulate unchecked

**The Test:**
After AI generates a feature, ask yourself:
1. Can a junior engineer on the team understand this code?
2. Does this follow our team's patterns and conventions?
3. Is there duplicated logic that should be extracted?
4. Will this code be easy to debug when it breaks?
5. Did AI add dependencies thoughtfully?

**Common Pitfalls:**
- Shipping AI code without refactoring
- Accumulating small pieces of technical debt that compound
- Not enforcing abstraction patterns with AI
- Accepting "good enough" code that creates maintenance burden
- Measuring productivity by features shipped, not code quality

**Self-Assessment:** Go back to code AI wrote for you 3-6 months ago. Is it easy to understand? Easy to modify? If not, you're creating maintenance debt faster than you realize.

---

## 10. Team Dynamics: The Unsolved Problem

**The Reality:** AI-assisted development at the team level introduces challenges that aren't solved by better prompts or specs.

**The Knowledge Transfer Problem:**
When one engineer + AI ships features rapidly, others on the team struggle to understand the code. The engineer who wrote it (with AI) might not fully understand it either.

**The Code Review Challenge:**
- How do you review 500 lines of AI-generated code in a PR?
- Do you hold it to the same standard as human code?
- Who's responsible when AI-generated code causes a production incident?

**The Junior Engineer Dilemma:**
- AI can make junior engineers productive quickly (good)
- But they don't learn fundamentals along the way (bad)
- Years later, they have gaps in core skills

**What Good Looks Like (We're Still Figuring This Out):**
- **Code review standards:** AI-generated code requires even more scrutiny
- **Documentation requirements:** AI code must include thorough comments
- **Knowledge sharing:** Engineers who use AI heavily must explain approaches to team
- **Skill development:** Junior engineers have "no-AI" learning tasks
- **Collective ownership:** Team reviews AI-generated code together periodically

**Common Pitfalls:**
- One engineer becomes the "AI whisperer" and a knowledge bottleneck
- Code review becomes rubber-stamping because volume is too high
- Team coding standards erode as AI introduces inconsistent patterns
- Junior engineers advance without fundamental skills
- Technical debt accumulates because no one fully owns AI-generated code

**Self-Assessment:** Is your team's code becoming harder to understand? Are PRs getting larger and harder to review? Is knowledge concentrated in the engineer who used AI? These are warning signs.

---

## 11. The False Productivity Trap

**The Uncomfortable Truth:** AI makes it easy to build the wrong thing faster. Shipping more code doesn't mean delivering more value.

**The Trap:**
- AI eliminates implementation friction
- You ship features in half the time
- But you didn't validate those features should be built
- Time saved coding is consumed by:
  - Debugging issues in production
  - Refactoring poorly abstracted code
  - Building features that users don't want

**The Real Productivity Metrics:**
- **Not:** Lines of code written
- **Not:** Features shipped per sprint
- **But:** User value delivered
- **But:** Production incidents avoided
- **But:** Technical debt managed

**What Good Looks Like:**
- Use AI to ship features faster, but validate features more thoroughly first
- Invest time saved into better requirements gathering and user research
- Build prototypes with AI to test ideas before committing to full implementation
- Focus on outcomes, not output

**The Lesson from Teams Using AI at Scale:**
The teams that benefit most from AI aren't the ones shipping the most code. They're the ones using AI to:
- Explore more solution approaches before committing
- Build higher-quality implementations of well-validated features
- Automate testing and verification more thoroughly
- Spend more time on architecture and less on implementation

**Self-Assessment:** Are you shipping more but with higher bug rates? Are you building features faster but with less clarity on user value? You're in the productivity trap.

---

## 12. AI Makes You a Different Kind of Engineer (For Better and Worse)

**The Transformation:**
After 6-12 months of heavy AI use, you're not the same engineer. Your skills have shifted.

**Skills That Improve:**
- **Architecture and design:** You think more about "what" and "why" because AI handles "how"
- **Specification writing:** You get better at articulating requirements
- **Code review:** You read more code (yours + AI's) and develop better review instincts
- **Problem decomposition:** You break down problems into AI-manageable chunks
- **Testing strategy:** You rely more on automated verification

**Skills That Atrophy:**
- **Debugging intuition:** When you don't write code, you don't build muscle memory for common bugs
- **Implementation details:** You forget syntax, API details, framework quirks
- **Low-level optimization:** You rely on AI for performance tuning you used to do instinctively
- **Learning new tech:** You use AI as a crutch instead of reading docs and experimenting

**The Long-Term Question:**
Are you becoming a better engineer or just a better AI manager? The answer depends on how intentional you are about skill development.

**What Good Looks Like:**
- Deliberately practice skills that AI doesn't develop (architecture, system design)
- Periodically write code without AI to maintain fundamentals
- Read and understand AI-generated code thoroughly—don't just trust it
- Use AI to explore new tech, but also read official docs and build toy projects
- Teach others what you learn (teaching reinforces understanding)

**The Risk:**
In 5 years, you might be unable to:
- Debug complex issues without AI assistance
- Write code from scratch when AI isn't available
- Evaluate trade-offs without AI suggesting options
- Learn new technologies without AI handholding

**The Opportunity:**
In 5 years, you might excel at:
- Architecting complex systems at scale
- Translating business requirements into technical specs
- Managing multiple AI agents working in parallel
- Leveraging AI to explore solution spaces you couldn't before

**Self-Assessment:** Are you deliberately investing in skills AI doesn't develop? Or are you becoming dependent on AI for everything? The best engineers use AI as a force multiplier, not a replacement for fundamental skills.

---

## Putting It All Together: A Realistic Workflow

These lessons aren't isolated tips—they form a cohesive, honest workflow:

1. **Start with specs** (with AI's help, but your domain expertise drives) that balance specificity and autonomy
2. **Create navigation guides** so AI doesn't waste time exploring
3. **Set clear boundaries** on what AI can access and modify
4. **Choose the right tool** for your workflow, but focus on the workflow itself
5. **Set up verification systems** (types, tests, linting) as guardrails
6. **Identify no-AI zones** (security-critical, learning opportunities, trivial tasks)
7. **Stay ON the loop** by letting AI iterate autonomously within those guardrails
8. **Manage context aggressively** to maintain quality throughout the conversation
9. **Verify systematically** rather than hoping AI got it right
10. **Review for maintenance debt** before shipping
11. **Be strategic** about which tasks justify AI assistance
12. **Measure outcomes, not output**
13. **Invest in skills** that AI doesn't develop

---

Cheers,\
Lucas