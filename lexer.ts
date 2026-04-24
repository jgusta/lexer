/*
 * TypeScript adaptation of stb_c_lexer.h.
 *
 * This keeps the useful parts of the original header's token model, but the
 * implementation is intentionally pragmatic instead of line-for-line.
 */

import { SourceLocation, Token, TokenKind } from "./syntax"

const KEYWORDS = new Set([
  "auto",
  "bool",
  "break",
  "case",
  "char",
  "const",
  "continue",
  "default",
  "do",
  "double",
  "else",
  "enum",
  "extern",
  "false",
  "float",
  "for",
  "goto",
  "if",
  "inline",
  "int",
  "long",
  "register",
  "return",
  "short",
  "signed",
  "sizeof",
  "static",
  "struct",
  "switch",
  "true",
  "typedef",
  "union",
  "unsigned",
  "void",
  "volatile",
  "while",
  "_Bool",
])

const MULTI_CHAR_TOKENS: Array<[string, TokenKind]> = [
  ["<<=", TokenKind.ShlEq],
  [">>=", TokenKind.ShrEq],
  ["...", TokenKind.Ellipsis],
  ["==", TokenKind.Eq],
  ["!=", TokenKind.NotEq],
  ["<=", TokenKind.LessEq],
  [">=", TokenKind.GreaterEq],
  ["&&", TokenKind.AndAnd],
  ["||", TokenKind.OrOr],
  ["<<", TokenKind.Shl],
  [">>", TokenKind.Shr],
  ["++", TokenKind.PlusPlus],
  ["--", TokenKind.MinusMinus],
  ["+=", TokenKind.PlusEq],
  ["-=", TokenKind.MinusEq],
  ["*=", TokenKind.MulEq],
  ["/=", TokenKind.DivEq],
  ["%=", TokenKind.ModEq],
  ["&=", TokenKind.AndEq],
  ["|=", TokenKind.OrEq],
  ["^=", TokenKind.XorEq],
  ["->", TokenKind.Arrow],
  ["=>", TokenKind.EqArrow],
]

const SINGLE_CHAR_TOKENS = new Map<string, TokenKind>([
  ["(", TokenKind.LParen],
  [")", TokenKind.RParen],
  ["{", TokenKind.LBrace],
  ["}", TokenKind.RBrace],
  ["[", TokenKind.LBracket],
  ["]", TokenKind.RBracket],
  [",", TokenKind.Comma],
  [";", TokenKind.Semicolon],
  [":", TokenKind.Colon],
  ["?", TokenKind.Question],
  [".", TokenKind.Dot],
  ["+", TokenKind.Plus],
  ["-", TokenKind.Minus],
  ["*", TokenKind.Star],
  ["/", TokenKind.Slash],
  ["%", TokenKind.Percent],
  ["&", TokenKind.Ampersand],
  ["|", TokenKind.Pipe],
  ["^", TokenKind.Caret],
  ["~", TokenKind.Tilde],
  ["!", TokenKind.Bang],
  ["=", TokenKind.Assign],
  ["<", TokenKind.Less],
  [">", TokenKind.Greater],
])

function isIdentifierStart(ch: string): boolean {
  return /[A-Za-z_$]/.test(ch)
}

function isIdentifierContinue(ch: string): boolean {
  return /[A-Za-z0-9_$]/.test(ch)
}

function isDigit(ch: string): boolean {
  return /[0-9]/.test(ch)
}

function stripNumericSuffix(text: string): string {
  return text.replace(/[uUlLfF]+$/, "")
}

function parseHexFloat(text: string): number {
  const match = /^0[xX]([0-9A-Fa-f]*\.?[0-9A-Fa-f]+)[pP]([+-]?\d+)/.exec(text)
  if (!match) {
    return Number.NaN
  }

  const mantissaText = match[1]
  const exponent = Number.parseInt(match[2], 10)
  const dotIndex = mantissaText.indexOf(".")
  const intPart = dotIndex === -1 ? mantissaText : mantissaText.slice(0, dotIndex)
  const fracPart = dotIndex === -1 ? "" : mantissaText.slice(dotIndex + 1)

  let value = intPart.length > 0 ? Number.parseInt(intPart, 16) : 0
  for (let i = 0; i < fracPart.length; i += 1) {
    const digit = Number.parseInt(fracPart[i], 16)
    value += digit / Math.pow(16, i + 1)
  }

  return value * Math.pow(2, exponent)
}

function cloneLocation(offset: number, line: number, column: number): SourceLocation {
  return { offset, line, column }
}

export class Lexer {
  private readonly source: string
  private index = 0
  private line = 1
  private column = 0

  constructor(source: string) {
    this.source = source
  }

  tokenize(): Token[] {
    const tokens: Token[] = []

    for (;;) {
      const token = this.nextToken()
      tokens.push(token)
      if (token.kind === TokenKind.EOF || token.kind === TokenKind.ParseError) {
        break
      }
    }

    return tokens
  }

  getLocation(offset: number): SourceLocation {
    let line = 1
    let column = 0

    for (let i = 0; i < Math.min(offset, this.source.length); i += 1) {
      const ch = this.source[i]
      if (ch === "\n") {
        line += 1
        column = 0
      } else {
        column += 1
      }
    }

    return { offset, line, column }
  }

  private nextToken(): Token {
    this.skipTrivia()

    if (this.index >= this.source.length) {
      const loc = cloneLocation(this.index, this.line, this.column)
      return { kind: TokenKind.EOF, lexeme: "", start: loc, end: loc }
    }

    const start = cloneLocation(this.index, this.line, this.column)
    const ch = this.peek()

    if (isIdentifierStart(ch)) {
      return this.lexIdentifier(start)
    }

    if (isDigit(ch) || (ch === "." && isDigit(this.peek(1)))) {
      return this.lexNumber(start)
    }

    if (ch === '"' || ch === "'") {
      return this.lexStringLike(start, ch)
    }

    for (const [lexeme, kind] of MULTI_CHAR_TOKENS) {
      if (this.source.startsWith(lexeme, this.index)) {
        this.advanceBy(lexeme.length)
        return {
          kind,
          lexeme,
          start,
          end: cloneLocation(this.index, this.line, this.column),
        }
      }
    }

    const single = SINGLE_CHAR_TOKENS.get(ch)
    if (single) {
      this.advance()
      return {
        kind: single,
        lexeme: ch,
        start,
        end: cloneLocation(this.index, this.line, this.column),
      }
    }

    this.advance()
    return {
      kind: TokenKind.ParseError,
      lexeme: ch,
      start,
      end: cloneLocation(this.index, this.line, this.column),
      message: `Unexpected character '${ch}'`,
    }
  }

  private skipTrivia(): void {
    for (;;) {
      let advanced = false

      while (this.index < this.source.length) {
        const ch = this.peek()
        if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r" || ch === "\f") {
          this.advance()
          advanced = true
          continue
        }
        break
      }

      if (this.source.startsWith("//", this.index)) {
        advanced = true
        while (this.index < this.source.length && this.peek() !== "\n") {
          this.advance()
        }
        continue
      }

      if (this.source.startsWith("/*", this.index)) {
        advanced = true
        this.advanceBy(2)
        while (this.index < this.source.length && !this.source.startsWith("*/", this.index)) {
          this.advance()
        }
        if (this.source.startsWith("*/", this.index)) {
          this.advanceBy(2)
        }
        continue
      }

      if (this.peek() === "#" && this.isAtLineStart()) {
        advanced = true
        while (this.index < this.source.length && this.peek() !== "\n") {
          this.advance()
        }
        continue
      }

      if (!advanced) {
        return
      }
    }
  }

  private isAtLineStart(): boolean {
    for (let i = this.index - 1; i >= 0; i -= 1) {
      const ch = this.source[i]
      if (ch === "\n") {
        return true
      }
      if (ch !== " " && ch !== "\t" && ch !== "\r") {
        return false
      }
    }
    return true
  }

  private lexIdentifier(start: SourceLocation): Token {
    let text = ""
    while (this.index < this.source.length && isIdentifierContinue(this.peek())) {
      text += this.advance()
    }

    return {
      kind: KEYWORDS.has(text) ? TokenKind.Keyword : TokenKind.Identifier,
      lexeme: text,
      value: text,
      start,
      end: cloneLocation(this.index, this.line, this.column),
    }
  }

  private lexNumber(start: SourceLocation): Token {
    const remaining = this.source.slice(this.index)

    const patterns: Array<[RegExp, TokenKind]> = [
      [/^0[xX](?:[0-9A-Fa-f]+(?:\.[0-9A-Fa-f]*)?|\.[0-9A-Fa-f]+)[pP][+-]?\d+[uUlLfF]*/, TokenKind.FloatLiteral],
      [/^0[xX][0-9A-Fa-f]+[uUlL]*/, TokenKind.IntLiteral],
      [/^(?:\d+\.\d*|\.\d+|\d+[eE][+-]?\d+|\d+\.\d*[eE][+-]?\d+|\d*\.\d+[eE][+-]?\d+)[fFlL]*/, TokenKind.FloatLiteral],
      [/^(?:0[0-7]*|\d+)[uUlL]*/, TokenKind.IntLiteral],
    ]

    for (const [pattern, kind] of patterns) {
      const match = pattern.exec(remaining)
      if (!match) {
        continue
      }

      const lexeme = match[0]
      this.advanceBy(lexeme.length)

      let value: number
      if (kind === TokenKind.FloatLiteral) {
        value = lexeme.startsWith("0x") || lexeme.startsWith("0X")
          ? parseHexFloat(stripNumericSuffix(lexeme))
          : Number(stripNumericSuffix(lexeme))
      } else if (lexeme.startsWith("0x") || lexeme.startsWith("0X")) {
        value = Number.parseInt(stripNumericSuffix(lexeme).slice(2), 16)
      } else if (lexeme.length > 1 && lexeme.startsWith("0")) {
        value = Number.parseInt(stripNumericSuffix(lexeme), 8)
      } else {
        value = Number.parseInt(stripNumericSuffix(lexeme), 10)
      }

      return {
        kind,
        lexeme,
        value,
        start,
        end: cloneLocation(this.index, this.line, this.column),
      }
    }

    this.advance()
    return {
      kind: TokenKind.ParseError,
      lexeme: this.source.slice(start.offset, this.index),
      start,
      end: cloneLocation(this.index, this.line, this.column),
      message: "Malformed numeric literal",
    }
  }

  private lexStringLike(start: SourceLocation, delimiter: '"' | "'"): Token {
    this.advance()
    let value = ""
    let closed = false

    while (this.index < this.source.length) {
      const ch = this.advance()
      if (ch === delimiter) {
        closed = true
        break
      }

      if (ch === "\\") {
        const escape = this.advance()
        value += this.decodeEscape(escape)
        continue
      }

      if (ch === "\n" || ch === "\r") {
        return {
          kind: TokenKind.ParseError,
          lexeme: this.source.slice(start.offset, this.index),
          start,
          end: cloneLocation(this.index, this.line, this.column),
          message: "Unterminated string or character literal",
        }
      }

      value += ch
    }

    if (!closed) {
      return {
        kind: TokenKind.ParseError,
        lexeme: this.source.slice(start.offset, this.index),
        start,
        end: cloneLocation(this.index, this.line, this.column),
        message: "Unterminated string or character literal",
      }
    }

    if (delimiter === "'") {
      const charCode = value.length > 0 ? value.charCodeAt(0) : 0
      return {
        kind: TokenKind.CharLiteral,
        lexeme: this.source.slice(start.offset, this.index),
        value: charCode,
        start,
        end: cloneLocation(this.index, this.line, this.column),
      }
    }

    return {
      kind: TokenKind.StringLiteral,
      lexeme: this.source.slice(start.offset, this.index),
      value,
      start,
      end: cloneLocation(this.index, this.line, this.column),
    }
  }

  private decodeEscape(ch: string): string {
    switch (ch) {
      case "n":
        return "\n"
      case "r":
        return "\r"
      case "t":
        return "\t"
      case "f":
        return "\f"
      case "0":
        return "\0"
      case "\\":
        return "\\"
      case "'":
        return "'"
      case '"':
        return '"'
      default:
        return ch
    }
  }

  private peek(offset = 0): string {
    return this.source[this.index + offset] ?? ""
  }

  private advance(): string {
    const ch = this.source[this.index] ?? ""
    this.index += 1
    if (ch === "\n") {
      this.line += 1
      this.column = 0
    } else {
      this.column += 1
    }
    return ch
  }

  private advanceBy(length: number): void {
    for (let i = 0; i < length; i += 1) {
      this.advance()
    }
  }
}

export function lexCLike(source: string): Token[] {
  return new Lexer(source).tokenize()
}

export * from "./syntax"
export { Parser, parseCLike } from "./parser"
