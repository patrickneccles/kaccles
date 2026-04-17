import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock fs/promises before importing gallery-store so CONTENT_DIR path calls are intercepted
vi.mock("fs/promises", () => ({
  default: {
    readdir: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn(),
    unlink: vi.fn(),
    rm: vi.fn(),
  },
}))

import fs from "fs/promises"
import { stringify } from "yaml"
import {
  slugify,
  listGalleries,
  readGallery,
  writeGallery,
  deleteGallery,
  type Gallery,
} from "../gallery-store"

const mockFs = vi.mocked(fs)

beforeEach(() => {
  vi.clearAllMocks()
})

// ---------------------------------------------------------------------------
// slugify
// ---------------------------------------------------------------------------

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Great Gray Owl")).toBe("great-gray-owl")
  })

  it("collapses multiple non-alphanumeric chars into one hyphen", () => {
    expect(slugify("Yellowstone — Summer 2024")).toBe("yellowstone-summer-2024")
  })

  it("strips leading and trailing hyphens", () => {
    expect(slugify("  birds  ")).toBe("birds")
  })

  it("handles numbers", () => {
    expect(slugify("Trip #3")).toBe("trip-3")
  })

  it("returns empty string for blank input", () => {
    expect(slugify("")).toBe("")
  })
})

// ---------------------------------------------------------------------------
// readGallery
// ---------------------------------------------------------------------------

const SAMPLE_GALLERY: Gallery = {
  title: "Great Gray Owl",
  location: "Yellowstone",
  subject: "Owl",
  shootDate: "2024-06-01",
  description: "A misty morning shoot",
  photos: [{ image: "/images/galleries/owl/1.jpg", caption: "Perched" }],
}

describe("readGallery", () => {
  it("parses a valid YAML file into a Gallery", async () => {
    mockFs.readFile.mockResolvedValue(stringify(SAMPLE_GALLERY) as never)
    const result = await readGallery("great-gray-owl")
    expect(result).toEqual(SAMPLE_GALLERY)
  })

  it("fills missing optional fields with empty strings", async () => {
    mockFs.readFile.mockResolvedValue(stringify({ title: "Minimal" }) as never)
    const result = await readGallery("minimal")
    expect(result).toEqual({
      title: "Minimal",
      location: "",
      subject: "",
      shootDate: "",
      description: "",
      photos: [],
    })
  })

  it("returns null when the file does not exist", async () => {
    mockFs.readFile.mockRejectedValue(Object.assign(new Error("ENOENT"), { code: "ENOENT" }))
    const result = await readGallery("nonexistent")
    expect(result).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// writeGallery
// ---------------------------------------------------------------------------

describe("writeGallery", () => {
  it("creates the content directory and writes YAML", async () => {
    mockFs.mkdir.mockResolvedValue(undefined as never)
    mockFs.writeFile.mockResolvedValue(undefined as never)

    await writeGallery("great-gray-owl", SAMPLE_GALLERY)

    expect(mockFs.mkdir).toHaveBeenCalledOnce()
    expect(mockFs.writeFile).toHaveBeenCalledOnce()

    const [filePath, content] = mockFs.writeFile.mock.calls[0] as [string, string]
    expect(filePath).toMatch(/great-gray-owl\.yaml$/)
    expect(content).toContain("title: Great Gray Owl")
  })

  it("omits empty optional fields from the written YAML", async () => {
    mockFs.mkdir.mockResolvedValue(undefined as never)
    mockFs.writeFile.mockResolvedValue(undefined as never)

    await writeGallery("minimal", {
      title: "Minimal",
      location: "",
      subject: "",
      shootDate: "",
      description: "",
      photos: [],
    })

    const [, content] = mockFs.writeFile.mock.calls[0] as [string, string]
    expect(content).not.toContain("location")
    expect(content).not.toContain("subject")
    expect(content).not.toContain("shootDate")
    expect(content).not.toContain("description")
  })
})

// ---------------------------------------------------------------------------
// deleteGallery
// ---------------------------------------------------------------------------

describe("deleteGallery", () => {
  it("unlinks the YAML file and removes the images directory", async () => {
    mockFs.unlink.mockResolvedValue(undefined as never)
    mockFs.rm.mockResolvedValue(undefined as never)

    await deleteGallery("great-gray-owl")

    expect(mockFs.unlink).toHaveBeenCalledOnce()
    expect((mockFs.unlink.mock.calls[0] as [string])[0]).toMatch(/great-gray-owl\.yaml$/)

    expect(mockFs.rm).toHaveBeenCalledOnce()
    expect((mockFs.rm.mock.calls[0] as [string])[0]).toMatch(/great-gray-owl$/)
    expect(mockFs.rm.mock.calls[0][1]).toMatchObject({ recursive: true, force: true })
  })
})

// ---------------------------------------------------------------------------
// listGalleries
// ---------------------------------------------------------------------------

describe("listGalleries", () => {
  it("returns an empty array when the content directory does not exist", async () => {
    mockFs.readdir.mockRejectedValue(Object.assign(new Error("ENOENT"), { code: "ENOENT" }))
    const result = await listGalleries()
    expect(result).toEqual([])
  })

  it("ignores non-YAML files", async () => {
    mockFs.readdir.mockResolvedValue(["owl.yaml", ".DS_Store", "notes.txt"] as never)
    mockFs.readFile.mockResolvedValue(stringify({ title: "Owl" }) as never)

    const result = await listGalleries()
    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe("owl")
  })

  it("sorts galleries by shootDate descending (newest first)", async () => {
    mockFs.readdir.mockResolvedValue(["a.yaml", "b.yaml", "c.yaml"] as never)
    mockFs.readFile
      .mockResolvedValueOnce(stringify({ title: "A", shootDate: "2023-01-01" }) as never)
      .mockResolvedValueOnce(stringify({ title: "B", shootDate: "2024-06-15" }) as never)
      .mockResolvedValueOnce(stringify({ title: "C", shootDate: "2024-01-01" }) as never)

    const result = await listGalleries()
    expect(result.map((e) => e.gallery.shootDate)).toEqual([
      "2024-06-15",
      "2024-01-01",
      "2023-01-01",
    ])
  })

  it("pushes galleries without a shootDate to the end", async () => {
    mockFs.readdir.mockResolvedValue(["a.yaml", "b.yaml"] as never)
    mockFs.readFile
      .mockResolvedValueOnce(stringify({ title: "Undated" }) as never)
      .mockResolvedValueOnce(stringify({ title: "Dated", shootDate: "2024-01-01" }) as never)

    const result = await listGalleries()
    expect(result[0].gallery.title).toBe("Dated")
    expect(result[1].gallery.title).toBe("Undated")
  })
})
