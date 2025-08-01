# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `bun dev` (hot reload enabled, no clear screen)
- **Production server**: `bun start`
- **Lint and format**: `bun run lint` (runs ESLint with auto-fix + dprint formatting)
- **Check code quality**: `bun run check` (ESLint + dprint check without fixes)
- **Run tests**: `bun test` (uses Vitest)

## Architecture Overview

This is a **Zerion Portfolio Mini App** built with:

### Core Stack

- **Runtime**: Bun with TypeScript
- **Framework**: Effect-ts with effect-start for server/client bundling
- **UI**: Preact (aliased as React) with Preact-ISO for routing
- **Styling**: TailwindCSS with DaisyUI components
- **State**: React Query + Wagmi for wallet connection
- **Build**: effect-start bundler with Bun Tailwind plugin

### Key Architecture Patterns

- **Effect-ts**: Functional programming with Effect for server layer composition
- **Preact Compatibility**: Uses React ecosystem libraries via Preact compat layer (tsconfig paths)
- **File-based Routing**: Routes defined in `src/routes/` with `_manifest.ts` pattern
- **Wallet Integration**: Wagmi config for Web3 wallet connections with React Query

### Project Structure

- `src/App.tsx` - Main app with providers (Wagmi, QueryClient, Router)
- `src/server.ts` - Effect-ts server layer with bundling configuration
- `src/routes/` - File-based routing with layout and page components
- `src/components/` - Reusable UI components (Wallet, etc.)
- `src/config/wagmi.ts` - Web3 wallet configuration

### Code Style & Linting

- **ESLint**: Comprehensive config with Effect-ts plugin and custom local rules
- **Formatting**: dprint with TypeScript/JSON/Markdown support (80 char line width)
- **Import Sorting**: Custom rules for Effect-ts imports and destructuring
- **Type Safety**: Strict TypeScript with Effect-ts patterns enforced

### External Dependencies

- **Node.js modules**: Extensively externalized in bundler config to avoid browser conflicts
- **Zerion API**: Portfolio data fetching (see spec/SPEC.md for API details)
- **Farcaster**: Mini app SDK integration

## Zerion API Integration

The app displays wallet portfolio data using Zerion's API:

- **Positions**: `/v1/wallets/{address}/positions/` for holdings data
- **Portfolio**: `/v1/wallets/{address}/portfolio` for total values
- **PnL**: `/v1/wallets/{address}/pnl/` for profit/loss metrics

UI shows percentage-based donut chart (max 7 positions + "Others") with realized/unrealized gains below. See `spec/SPEC.md` for complete API documentation and `agent/zerion-llms.txt` for reference materials.

## Development Notes

- Uses Bun's hot reload for development
- Effect-ts server serves both API and static assets
- Preact compat layer enables React ecosystem usage
- Custom ESLint rules enforce Effect-ts patterns and code quality
- All Node.js modules externalized to prevent browser bundling issues# Claude Instructions

An always make sure to refer to the [COLOR SCHEME DEFINITION AND BRAND GUIDELINES](./COLORS.md) when doing any frontend, design or color work. You don't need to do colors or come up with gradients. We can use the instructions in COLORS.md to create a consistent and visually appealing design in line with dTech's premium boutique identity.

## Project structure

## 🚨 HIGHEST PRIORITY RULES 🚨

### ABSOLUTELY FORBIDDEN: try-catch in Effect.gen

**NEVER use `try-catch` blocks inside `Effect.gen` generators!**

- Effect generators handle errors through the Effect type system, not JavaScript exceptions
- Use `Effect.tryPromise`, `Effect.try`, or proper Effect error handling instead
- **CRITICAL**: This will cause runtime errors and break Effect's error handling
- **EXAMPLE OF WHAT NOT TO DO**:
  ```ts
  Effect.gen(function*() {
    try {
      // ❌ WRONG - Never do this in Effect.gen
      const result = yield* someEffect
    } catch (error) {
      // ❌ This will never be reached and breaks Effect semantics
    }
  })
  ```
- **CORRECT PATTERN**:
  ```ts
  Effect.gen(function*() {
    // ✅ Use Effect's built-in error handling
    const result = yield* Effect.result(someEffect)
    if (result._tag === "Failure") {
      // Handle error case
    }
  })
  ```

### ABSOLUTELY FORBIDDEN: Type Assertions

**NEVER EVER use `as never`, `as any`, or `as unknown` type assertions!**

- These break TypeScript's type safety and hide real type errors
- Always fix the underlying type issues instead of masking them
- **FORBIDDEN PATTERNS**:
  ```ts
  // ❌ NEVER do any of these
  const value = something as any
  const value = something as never
  const value = something as unknown
  ```
- **CORRECT APPROACH**: Fix the actual type mismatch by:
  - Using proper generic type parameters
  - Importing correct types
  - Using proper Effect constructors and combinators
  - Adjusting function signatures to match usage

### MANDATORY: Return Yield Pattern for Errors

**ALWAYS use `return yield*` when yielding errors or interrupts in Effect.gen!**

- When yielding `Effect.fail`, `Effect.interrupt`, or other terminal effects, always use `return yield*`
- This makes it clear that the generator function terminates at that point
- **MANDATORY PATTERN**:
  ```ts
  Effect.gen(function*() {
    if (someCondition) {
      // ✅ CORRECT - Always use return yield* for errors
      return yield* Effect.fail("error message")
    }

    if (shouldInterrupt) {
      // ✅ CORRECT - Always use return yield* for interrupts
      return yield* Effect.interrupt
    }

    // Continue with normal flow...
    const result = yield* someOtherEffect
    return result
  })
  ```
- **WRONG PATTERNS**:
  ```ts
  Effect.gen(function*() {
    if (someCondition) {
      // ❌ WRONG - Missing return keyword
      yield* Effect.fail("error message")
      // Unreachable code after error!
    }
  })
  ```
- **CRITICAL**: Always use `return yield*` to make termination explicit and avoid unreachable code

## Project Overview

This project uses the effect library, focusing on functional programming patterns and effect systems in TypeScript.

## Development Workflow

### Core Principles

- **Research → Plan → Implement**: Never jump straight to coding
- **Reality Checkpoints**: Regularly validate progress and approach
- **Zero Tolerance for Errors**: All automated checks must pass
- **Clarity over Cleverness**: Choose clear, maintainable solutions

### Implementation Specifications

- **Specifications Directory**: `.specs/` contains detailed implementation plans and specifications for all features
- **Organization**: Each specification is organized by feature name (e.g., `effect-transaction-to-atomic-refactor`, `txhashmap-implementation`)
- **Purpose**: Reference these specifications when implementing new features or understanding existing implementation plans

### Structured Development Process

1. **Research Phase**
   - Understand the codebase and existing patterns
   - Identify related modules and dependencies
   - Review test files and usage examples
   - Use multiple approaches for complex problems

2. **Planning Phase**
   - Create detailed implementation plan
   - Identify validation checkpoints
   - Consider edge cases and error handling
   - Validate plan before implementation

3. **Implementation Phase**
   - Execute with frequent validation
   - **🚨 CRITICAL**: IMMEDIATELY run `bun run lint --fix <typescript_file.ts>` after editing ANY TypeScript file
   - Run automated checks at each step
   - Use parallel approaches when possible
   - Stop and reassess if stuck

### 🚨 MANDATORY FUNCTION DEVELOPMENT WORKFLOW 🚨

**ALWAYS follow this EXACT sequence when creating ANY new function:**

1. **Create function** - Write the function implementation in TypeScript file
2. **Lint TypeScript file** - Run `bun run lint --fix <typescript_file.ts>`
3. **Check compilation** - Run `bun` to ensure it compiles
4. **Lint TypeScript file again** - Run `bun run lint --fix <typescript_file.ts>` again
5. **Ensure compilation** - Run `bun` again to double-check
6. **Write test** - Create comprehensive test for the function in test file
7. **Compile test & lint test file** - Run `bun run build` then `bun run lint --fix <test_file.ts>`

**CRITICAL NOTES:**

- **ONLY LINT TYPESCRIPT FILES** (.ts and .tsx files) - Do NOT lint markdown, JSON, or other file types
- **NEVER SKIP ANY STEP** - This workflow is MANDATORY for every single function created
- **NEVER CONTINUE** to the next step until the current step passes completely
- **NEVER CREATE MULTIPLE FUNCTIONS** without completing this full workflow for each one

This ensures:

- Zero compilation errors at any point
- Clean, properly formatted TypeScript code
- Immediate test coverage for every function
- No accumulation of technical debt

### Mandatory Validation Steps

- **🚨 CRITICAL FIRST STEP**: IMMEDIATELY run `bun run lint --fix <typescript_file.ts>` after editing ANY TypeScript file
- Always run tests after making changes: `bun run test <test_file.ts>`
- Run type checking: `bun run check`
- Build the project: `bun run build`
- **MANDATORY AFTER EVERY EDIT**: Always lint TypeScript files that are changed with `bun run lint --fix <typescript_file.ts>`
- Always check for type errors before committing: `bun run check`

### 🚨 TYPESCRIPT LINTING REMINDER 🚨

**NEVER FORGET**: After editing ANY TypeScript file (.ts), IMMEDIATELY run:

```bash
bun run lint --fix <typescript_file.ts>
```

- This is NOT optional - it must be done after EVERY TypeScript file modification!
- **ONLY lint .ts files** - Do NOT attempt to lint markdown, JSON, or other file types

### When Stuck

- Stop spiraling into complex solutions
- Break down the problem into smaller parts
- Use the Task tool for parallel problem-solving
- Simplify the approach
- Ask for guidance rather than guessing

### Scratchpad Development Workflow

For efficient example development, use the `./scratchpad/` directory:

```bash
# Create temporary development files
touch ./scratchpad/test-example.ts

# Check TypeScript compilation
bun --noEmit ./scratchpad/test-example.ts

# Fix formatting using project rules
bun run lint --fix ./scratchpad/test-example.ts

# Test execution if needed
bun ./scratchpad/test-example.ts
```

**Scratchpad Benefits:**

- ✅ Rapid prototyping of complex examples
- ✅ Safe testing without affecting main codebase
- ✅ Easy iteration on example code
- ✅ Type checking validation before copying to JSDoc

**⚠️ Remember to Clean Up:**

```bash
# Clean up test files when done
rm scratchpad/test-*.ts
rm scratchpad/temp*.ts scratchpad/example*.ts
```

## Code Style Guidelines

### TypeScript Quality Standards

- **Type Safety**: NEVER use `any` type or `as any` assertions
- **Explicit Types**: Use concrete types over generic `unknown` where possible
- **Type Annotations**: Add explicit annotations when inference fails
- **Early Returns**: Prefer early returns for better readability
- **Input Validation**: Validate all inputs at boundaries
- **Error Handling**: Use proper Effect error management patterns

### Effect Library Conventions

- Follow existing TypeScript patterns in the codebase
- Use functional programming principles
- Maintain consistency with Effect library conventions
- Use proper Effect constructors (e.g., `Array.make()`, `Chunk.fromIterable()`)
- Prefer `Effect.gen` for monadic composition
- Use `Data.TaggedError` for custom error types
- Implement resource safety with automatic cleanup patterns

### Code Organization

- No comments unless explicitly requested
- Follow existing file structure and naming conventions
- Delete old code when replacing functionality
- **NEVER create new script files or tools unless explicitly requested by the user**
- Choose clarity over cleverness in all implementations

### Implementation Completeness

Code is considered complete only when:

- All linters pass (`bun run lint`)
- All tests pass (`bun run test`)
- All type checks pass (`bun run check`)
- Feature works end-to-end
- Old/deprecated code is removed
- Documentation is updated

## Testing

- Test files are located in `/*/test/` directories
- Use existing test patterns and utilities
- Always verify implementations with tests
- Run specific tests with: `bun run test <filename>`

### Time-Dependent Testing

- **CRITICAL**: When testing time-dependent code (delays, timeouts, scheduling), always use `TestClock` to avoid flaky tests
- Import `TestClock` from `effect/TestClock` and use `TestClock.advance()` to control time progression
- Never rely on real wall-clock time (`Effect.sleep`, `Effect.timeout`) in tests without TestClock
- Examples of time-dependent operations that need TestClock:
  - `Effect.sleep()` and `Effect.delay()`
  - `Effect.timeout()` and `Effect.race()` with timeouts
  - Scheduled operations and retry logic
  - Queue operations with time-based completion
  - Any concurrent operations that depend on timing
- Pattern: Use `TestClock.advance("duration")` to simulate time passage instead of actual delays

### Testing Framework Selection

#### When to Use @effect/vitest

- **MANDATORY**: Use `@effect/vitest` for modules that work with Effect values
- **Effect-based functions**: Functions that return `Effect<A, E, R>` types
- **Modules**: Effect, Stream, Layer, TestClock, etc.
- **Import pattern**: `import { assert, describe, it } from "@effect/vitest"`
- **Test pattern**: `it.effect("description", () => Effect.gen(function*() { ... }))`

#### When to Use Regular vitest

- **MANDATORY**: Use regular `vitest` for pure TypeScript functions
- **Pure functions**: Functions that don't return Effect types (Graph, Data, Equal, etc.)
- **Utility modules**: Graph, Chunk, Array, String, Number, etc.
- **Import pattern**: `import { describe, expect, it } from "vitest"`
- **Test pattern**: `it("description", () => { ... })`

### it.effect Testing Pattern

- **MANDATORY**: Use `it.effect` for all Effect-based tests, not `Effect.runSync` with regular `it`
- **CRITICAL**: Import `{ assert, describe, it }` from `@effect/vitest`, not from `vitest`
- **FORBIDDEN**: Never use `expect` from vitest in Effect tests - use `assert` methods instead
- **PATTERN**: All tests should use `it.effect("description", () => Effect.gen(function*() { ... }))`

#### Correct it.effect Pattern:

```ts
import { assert, describe, it } from "@effect/vitest"
import * as Effect from "effect/Effect"
import * as SomeModule from "effect/SomeModule"

describe("ModuleName", () => {
  describe("feature group", () => {
    it.effect("should do something", () =>
      Effect.gen(function*() {
        const result = yield* SomeModule.operation()

        // Use assert methods, not expect
        assert.strictEqual(result, expectedValue)
        assert.deepStrictEqual(complexResult, expectedObject)
        assert.isTrue(booleanResult)
        assert.isFalse(negativeResult)
      }))

    it.effect("should handle errors", () =>
      Effect.gen(function*() {
        const txRef = yield* SomeModule.create()
        yield* SomeModule.update(txRef, newValue)

        const value = yield* SomeModule.get(txRef)
        assert.strictEqual(value, newValue)
      }))
  })
})
```

#### Wrong Patterns (NEVER USE):

```ts
// ❌ WRONG - Using Effect.runSync with regular it
import { describe, expect, it } from "vitest"
it("test", () => {
  const result = Effect.runSync(Effect.gen(function*() {
    return yield* someEffect
  }))
  expect(result).toBe(value) // Wrong assertion method
})

// ❌ WRONG - Using expect instead of assert
it.effect("test", () =>
  Effect.gen(function*() {
    const result = yield* someEffect
    expect(result).toBe(value) // Should use assert.strictEqual
  }))
```

#### Key it.effect Guidelines:

- **Import pattern**: `import { assert, describe, it } from "@effect/vitest"`
- **Test structure**: `it.effect("description", () => Effect.gen(function*() { ... }))`
- **Assertions**: Use `assert.strictEqual`, `assert.deepStrictEqual`, `assert.isTrue`, `assert.isFalse`
- **Effect composition**: All operations inside the generator should yield Effects
- **Error testing**: Use `Effect.exit()` for testing error conditions
- **Transactional testing**: Use `Effect.atomic()` for testing transactional behavior

## Git Workflow

- Main branch: `master`
- Create feature branches for new work
- If we are on `master` create a git worktree with a feature branch using `git worktree add wt-<feature> -b feat/<feature>`
- Only commit when explicitly requested
- Follow conventional commit messages

## Key Directories

### Development & Build

- `scripts/` - Build and maintenance scripts
- `docs/` - documentation files
- `scratchpad/` - Temporary development and testing files

### Configuration & Specs

- `.specs/` - Implementation specifications and plans organized by feature
- `.github/` - GitHub Actions workflows and templates
- `.vscode/` - VS Code workspace configuration
- `.changeset/` - Changeset configuration for versioning

## Problem-Solving Strategies

### When Encountering Complex Issues

1. **Stop and Analyze**: Don't spiral into increasingly complex solutions
2. **Break Down**: Divide complex problems into smaller, manageable parts
3. **Use Parallel Approaches**: Launch multiple Task agents for different aspects
4. **Research First**: Always understand existing patterns before creating new ones
5. **Validate Frequently**: Use reality checkpoints to ensure you're on track
6. **Simplify**: Choose the simplest solution that meets requirements
7. **Ask for Help**: Request guidance rather than guessing

### Effective Task Management

- Use TodoWrite/TodoRead tools for complex multi-step tasks
- Mark tasks as in_progress before starting work
- Complete tasks immediately upon finishing
- Break large tasks into smaller, trackable components

## Performance Considerations

- **Measure First**: Always measure performance before optimizing
- Prefer eager evaluation patterns where appropriate
- Consider memory usage and optimization
- Follow established performance patterns in the codebase
- Prioritize clarity over premature optimization
- Use appropriate data structures for the use case

An always make sure to refer to the [COLOR SCHEME DEFINITION AND BRAND GUIDELINES](./COLORS.md) when doing any frontend, design or color work. You don't need to do colors or come up with gradients. We can use the instructions in COLORS.md to create a consistent and visually appealing design in line with dTech's premium boutique identity.
