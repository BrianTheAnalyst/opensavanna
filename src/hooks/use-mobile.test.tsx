import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";
import { vi } from 'vitest';

const MOBILE_BREAKPOINT = 768;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query === `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("useIsMobile", () => {
  it("should return true when screen width is less than mobile breakpoint", () => {
    (window.matchMedia as vi.Mock).mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("should return false when screen width is greater than mobile breakpoint", () => {
    (window.matchMedia as vi.Mock).mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("should update when the screen size changes", () => {
    let mql = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    (window.matchMedia as vi.Mock).mockReturnValue(mql);

    const { result } = renderHook(() => useIsMobile());

    // Initially, it's not mobile
    expect(result.current).toBe(false);

    // Simulate a change to mobile view
    act(() => {
        const changeListener = mql.addEventListener.mock.calls[0][1];
        changeListener({ matches: true });
    });

    // After change, it should be mobile
    // This will fail because the hook uses innerWidth instead of event.matches
    expect(result.current).toBe(true);
  });
});