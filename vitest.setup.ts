import "@testing-library/jest-dom/vitest"

// jsdom no implementa ResizeObserver; varios componentes de radix-ui (Slider, Collapsible) lo usan.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub
