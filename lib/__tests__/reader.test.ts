import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("../gallery-store", () => ({
  listGalleries: vi.fn(),
  readGallery: vi.fn(),
}))

import { listGalleries, readGallery } from "../gallery-store"
import { getGalleries, getGallery } from "../reader"
import type { Gallery } from "../gallery-store"

const mockListGalleries = vi.mocked(listGalleries)
const mockReadGallery = vi.mocked(readGallery)

beforeEach(() => {
  vi.clearAllMocks()
})

const GALLERY: Gallery = {
  title: "Snowy Owl",
  location: "Alaska",
  subject: "Owl",
  shootDate: "2024-12-01",
  description: "",
  photos: [],
}

describe("getGalleries", () => {
  it("remaps { slug, gallery } to { slug, entry }", async () => {
    mockListGalleries.mockResolvedValue([{ slug: "snowy-owl", gallery: GALLERY }])
    const result = await getGalleries()
    expect(result).toEqual([{ slug: "snowy-owl", entry: GALLERY }])
  })

  it("returns an empty array when there are no galleries", async () => {
    mockListGalleries.mockResolvedValue([])
    expect(await getGalleries()).toEqual([])
  })
})

describe("getGallery", () => {
  it("returns the gallery for a known slug", async () => {
    mockReadGallery.mockResolvedValue(GALLERY)
    expect(await getGallery("snowy-owl")).toEqual(GALLERY)
  })

  it("returns null for an unknown slug", async () => {
    mockReadGallery.mockResolvedValue(null)
    expect(await getGallery("missing")).toBeNull()
  })
})
