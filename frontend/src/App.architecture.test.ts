import { describe, expect, it } from "vitest";
import appSource from "./App.tsx?raw";

const readAppSource = () => appSource;

describe("App architecture guardrails", () => {
  it("keeps App as a provider shell that delegates Song Library behavior to feature modules", () => {
    const source = readAppSource();

    expect(source).toContain('import { SongLibraryWorkspace } from "./features/songs/SongLibraryWorkspace";');
    expect(source).toContain("export const AppContent = () => <SongLibraryWorkspace />;");
    expect(source).toContain("<DesignSystemProvider>");
    expect(source).toContain("<Provider store={store}>");
  });

  it("does not let extracted Song Library ownership drift back into App", () => {
    const source = readAppSource();

    expect(source).not.toContain("@emotion/styled");
    expect(source).not.toMatch(/\bstyled\./);
    expect(source).not.toMatch(/<table\b|<thead\b|<tbody\b|<tr\b|<td\b|<th\b/i);
    expect(source).not.toMatch(/KPI Metrics Summary|Album Volume Directory|Selected Song|Delete this song\?/);
    expect(source).not.toMatch(/getSongPayload|duration must use|artworkUrl must be|genre must be one of/);
    expect(source).not.toMatch(/useState|useEffect|useMemo|useRef|useSelector|useDispatch/);
  });
});
