import { describe, expect, it } from "vitest";

import { formatFileSize } from "./format-file-size";

describe("formatFileSize", () => {
    it("formats bytes, kilobytes and megabytes", () => {
        expect(formatFileSize(512)).toBe("512 B");
        expect(formatFileSize(2048)).toBe("2 KB");
        expect(formatFileSize(1.8 * 1024 * 1024)).toBe("1.8 MB");
    });

    it("rolls over at the 1024 boundary", () => {
        expect(formatFileSize(1023)).toBe("1023 B");
        expect(formatFileSize(1024)).toBe("1 KB");
    });

    it("treats empty and invalid sizes as zero", () => {
        expect(formatFileSize(0)).toBe("0 B");
        expect(formatFileSize(-5)).toBe("0 B");
        expect(formatFileSize(Number.NaN)).toBe("0 B");
    });
});
