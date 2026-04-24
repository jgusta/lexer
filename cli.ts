#!/usr/bin/env node

import { readFile } from "node:fs/promises"
import { stdin as input, stdout as output, argv, exit } from "node:process"

import { lexCLike } from "./lexer"
import { parseCLike } from "./parser"

type Command = "lex" | "parse"

interface CliOptions {
  command: Command
  sourcePath: string
  compact: boolean
}

function printUsage(): void {
  output.write(
    [
      "Usage:",
      "  npm run lex -- <file>",
      "  npm run parse -- <file>",
      "  npm start -- <lex|parse> <file>",
      "",
      "Notes:",
      "  Use '-' as the file path to read from stdin.",
      "  Add '--compact' to print compact JSON.",
    ].join("\n") + "\n",
  )
}

function parseArgs(rawArgs: string[]): CliOptions | null {
  let compact = false
  const positional: string[] = []

  for (const arg of rawArgs) {
    if (arg === "--compact") {
      compact = true
      continue
    }
    if (arg === "--help" || arg === "-h") {
      return null
    }
    positional.push(arg)
  }

  if (positional.length < 2) {
    return null
  }

  const [command, sourcePath] = positional
  if (command !== "lex" && command !== "parse") {
    return null
  }

  return {
    command,
    sourcePath,
    compact,
  }
}

async function readSource(sourcePath: string): Promise<string> {
  if (sourcePath === "-") {
    const chunks: Buffer[] = []
    for await (const chunk of input) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
    }
    return Buffer.concat(chunks).toString("utf8")
  }

  return readFile(sourcePath, "utf8")
}

function printJson(value: unknown, compact: boolean): void {
  output.write(JSON.stringify(value, null, compact ? undefined : 2) + "\n")
}

async function main(): Promise<void> {
  const options = parseArgs(argv.slice(2))
  if (!options) {
    printUsage()
    exit(1)
  }

  try {
    const source = await readSource(options.sourcePath)
    if (options.command === "lex") {
      printJson(lexCLike(source), options.compact)
      return
    }

    printJson(parseCLike(source), options.compact)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(message)
    exit(1)
  }
}

void main()
