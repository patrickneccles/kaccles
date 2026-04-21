import fs from "fs/promises"
import path from "path"
import { parse, stringify } from "yaml"

const ABOUT_FILE = path.join(process.cwd(), "content", "about.yaml")

export type About = {
  bio: string
}

export async function readAbout(): Promise<About> {
  try {
    const raw = await fs.readFile(ABOUT_FILE, "utf8")
    const data = parse(raw)
    return { bio: data.bio ?? "" }
  } catch {
    return { bio: "" }
  }
}

export async function writeAbout(about: About): Promise<void> {
  await fs.mkdir(path.dirname(ABOUT_FILE), { recursive: true })
  await fs.writeFile(ABOUT_FILE, stringify(about))
}
