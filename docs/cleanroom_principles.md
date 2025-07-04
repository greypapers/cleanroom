# Principles of CLEANROOM.JS

This document outlines the core principles and philosophy behind the CLEANROOM.JS project.

## 1. Minimalism and Direct Control
- **No `npm`**: A deliberate avoidance of Node Package Manager to reduce external dependencies and gain direct control over the build process and included libraries.
- **First Principles Re-implementation**: Focus on understanding and re-assembling core functionalities (like UI rendering, state management) from fundamental concepts rather than relying on opaque abstractions.
- **Lean Dependencies**: Only include essential libraries, and integrate them directly rather than through complex module systems.

## 2. Transparency and Understanding
- **"Clean-Room" Design**: Emphasizes understanding how underlying mechanisms work by re-implementing them, fostering deeper knowledge and easier customization.
- **Reduced Abstraction Layers**: Minimize layers of abstraction to keep the codebase straightforward and easy to reason about.

## 3. Performance and Efficiency
- **Optimized for Browser**: Direct control over code allows for fine-tuned optimizations for browser environments.
- **Small Footprint**: Aim for a minimal bundle size by carefully selecting and integrating only necessary features.

## 4. Opinionated Frontend Development
- **Specific Tooling Choices**: Preference for tools like `esbuild` for bundling due to its speed and simplicity.
- **Integration with Backend**: Designed to integrate seamlessly with lightweight Python backends (e.g., Starlette), reflecting a full-stack perspective.

## 5. Modern Practices without the "Churn"
- **Modern Composability**: Embrace modern component-based architecture and reactive patterns (like Hooks and Signals) without adopting the typical overhead and rapid changes associated with larger frameworks.
- **Stability over Trends**: Prioritize stable, understandable implementations over chasing every new JavaScript ecosystem trend.

## 6. Educational and Exploratory
- **Learning Platform**: Serves as a platform for exploring and documenting minimalist frontend techniques.
- **Reverse Engineering Insights**: Leverages insights gained from reverse-engineering existing frameworks to build more robust and understandable solutions.
