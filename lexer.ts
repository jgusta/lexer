/*
 * TypeScript adaptation of stb_c_lexer.h.
 *
 * This keeps the useful parts of the original header's token model, but the
 * implementation is intentionally pragmatic instead of line-for-line. The goal
 * here is a small lexer plus a recursive-descent parser for C-like languages,
 * not a fully conforming C front-end.
 */

export enum TokenKind {
  EOF = "EOF",
  ParseError = "ParseError",
  Identifier = "Identifier",
  Keyword = "Keyword",
  IntLiteral = "IntLiteral",
  FloatLiteral = "FloatLiteral",
  StringLiteral = "StringLiteral",
  CharLiteral = "CharLiteral",
  Eq = "Eq",
  NotEq = "NotEq",
  LessEq = "LessEq",
  GreaterEq = "GreaterEq",
  AndAnd = "AndAnd",
  OrOr = "OrOr",
  Shl = "Shl",
  Shr = "Shr",
  PlusPlus = "PlusPlus",
  MinusMinus = "MinusMinus",
  PlusEq = "PlusEq",
  MinusEq = "MinusEq",
  MulEq = "MulEq",
  DivEq = "DivEq",
  ModEq = "ModEq",
  AndEq = "AndEq",
  OrEq = "OrEq",
  XorEq = "XorEq",
  Arrow = "Arrow",
  EqArrow = "EqArrow",
  ShlEq = "ShlEq",
  ShrEq = "ShrEq",
  Ellipsis = "Ellipsis",
  LParen = "LParen",
  RParen = "RParen",
  LBrace = "LBrace",
  RBrace = "RBrace",
  LBracket = "LBracket",
  RBracket = "RBracket",
  Comma = "Comma",
  Semicolon = "Semicolon",
  Colon = "Colon",
  Question = "Question",
  Dot = "Dot",
  Plus = "Plus",
  Minus = "Minus",
  Star = "Star",
  Slash = "Slash",
  Percent = "Percent",
  Ampersand = "Ampersand",
  Pipe = "Pipe",
  Caret = "Caret",
  Tilde = "Tilde",
  Bang = "Bang",
  Assign = "Assign",
  Less = "Less",
  Greater = "Greater",
}

export interface SourceLocation {
  offset: number
  line: number
  column: number
}

export interface Token {
  kind: TokenKind
  lexeme: string
  start: SourceLocation
  end: SourceLocation
  value?: number | string
  message?: string
}

export interface Program {
  kind: "Program"
  body: TopLevelNode[]
}

export type TopLevelNode =
  | FunctionDefinition
  | FunctionDeclaration
  | VariableDeclaration
  | StructDeclaration
  | EnumDeclaration
  | Statement

export interface TypeRef {
  kind: "TypeRef"
  specifiers: string[]
  qualifiers: string[]
  storage: string[]
  pointerDepth: number
  text: string
  inlineBody?: string
}

export interface VariableDeclarator {
  kind: "VariableDeclarator"
  name: string
  pointerDepth: number
  arrayDimensions: Array<Expression | null>
  initializer?: Expression
}

export interface ParameterDeclaration {
  kind: "ParameterDeclaration"
  type: TypeRef
  name?: string
  pointerDepth: number
  arrayDimensions: Array<Expression | null>
  isVariadic?: boolean
}

export interface FunctionDeclaration {
  kind: "FunctionDeclaration"
  returnType: TypeRef
  name: string
  pointerDepth: number
  parameters: ParameterDeclaration[]
}

export interface FunctionDefinition {
  kind: "FunctionDefinition"
  returnType: TypeRef
  name: string
  pointerDepth: number
  parameters: ParameterDeclaration[]
  body: BlockStatement
}

export interface VariableDeclaration {
  kind: "VariableDeclaration"
  type: TypeRef
  declarators: VariableDeclarator[]
}

export interface StructDeclaration {
  kind: "StructDeclaration"
  type: TypeRef
  name?: string
}

export interface EnumDeclaration {
  kind: "EnumDeclaration"
  type: TypeRef
  name?: string
}

export type Statement =
  | BlockStatement
  | ExpressionStatement
  | IfStatement
  | WhileStatement
  | DoWhileStatement
  | ForStatement
  | ReturnStatement
  | BreakStatement
  | ContinueStatement
  | SwitchStatement
  | LabeledStatement
  | DeclarationStatement
  | EmptyStatement

export interface BlockStatement {
  kind: "BlockStatement"
  body: Statement[]
}

export interface ExpressionStatement {
  kind: "ExpressionStatement"
  expression: Expression
}

export interface IfStatement {
  kind: "IfStatement"
  test: Expression
  consequent: Statement
  alternate?: Statement
}

export interface WhileStatement {
  kind: "WhileStatement"
  test: Expression
  body: Statement
}

export interface DoWhileStatement {
  kind: "DoWhileStatement"
  body: Statement
  test: Expression
}

export interface ForStatement {
  kind: "ForStatement"
  init?: Expression | VariableDeclaration
  test?: Expression
  update?: Expression
  body: Statement
}

export interface ReturnStatement {
  kind: "ReturnStatement"
  argument?: Expression
}

export interface BreakStatement {
  kind: "BreakStatement"
}

export interface ContinueStatement {
  kind: "ContinueStatement"
}

export interface SwitchStatement {
  kind: "SwitchStatement"
  discriminant: Expression
  body: Statement
}

export interface LabeledStatement {
  kind: "LabeledStatement"
  label: string
  body: Statement
}

export interface DeclarationStatement {
  kind: "DeclarationStatement"
  declaration: VariableDeclaration
}

export interface EmptyStatement {
  kind: "EmptyStatement"
}

export type Expression =
  | IdentifierExpression
  | LiteralExpression
  | UnaryExpression
  | UpdateExpression
  | BinaryExpression
  | AssignmentExpression
  | ConditionalExpression
  | CallExpression
  | MemberExpression
  | IndexExpression
  | CastExpression
  | CommaExpression
  | ParenthesizedExpression

export interface IdentifierExpression {
  kind: "Identifier"
  name: string
}

export interface LiteralExpression {
  kind: "Literal"
  literalKind: TokenKind.IntLiteral | TokenKind.FloatLiteral | TokenKind.StringLiteral | TokenKind.CharLiteral
  value: number | string
  raw: string
}

export interface UnaryExpression {
  kind: "UnaryExpression"
  operator: string
  argument: Expression | TypeRef
}

export interface UpdateExpression {
  kind: "UpdateExpression"
  operator: "++" | "--"
  argument: Expression
  prefix: boolean
}

export interface BinaryExpression {
  kind: "BinaryExpression"
  operator: string
  left: Expression
  right: Expression
}

export interface AssignmentExpression {
  kind: "AssignmentExpression"
  operator: string
  left: Expression
  right: Expression
}

export interface ConditionalExpression {
  kind: "ConditionalExpression"
  test: Expression
  consequent: Expression
  alternate: Expression
}

export interface CallExpression {
  kind: "CallExpression"
  callee: Expression
  arguments: Expression[]
}

export interface MemberExpression {
  kind: "MemberExpression"
  object: Expression
  property: string
  computed: false
  operator: "." | "->"
}

export interface IndexExpression {
  kind: "IndexExpression"
  object: Expression
  index: Expression
}

export interface CastExpression {
  kind: "CastExpression"
  targetType: TypeRef
  argument: Expression
}

export interface CommaExpression {
  kind: "CommaExpression"
  expressions: Expression[]
}

export interface ParenthesizedExpression {
  kind: "ParenthesizedExpression"
  expression: Expression
}

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

const TYPE_SPECIFIERS = new Set([
  "bool",
  "char",
  "double",
  "enum",
  "float",
  "int",
  "long",
  "short",
  "signed",
  "struct",
  "union",
  "unsigned",
  "void",
  "_Bool",
])

const TYPE_QUALIFIERS = new Set(["const", "volatile"])
const STORAGE_SPECIFIERS = new Set(["auto", "extern", "inline", "register", "static", "typedef"])
const STATEMENT_KEYWORDS = new Set([
  "break",
  "case",
  "continue",
  "default",
  "do",
  "else",
  "for",
  "goto",
  "if",
  "return",
  "switch",
  "while",
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

const ASSIGNMENT_OPERATORS = new Map<TokenKind, string>([
  [TokenKind.Assign, "="],
  [TokenKind.PlusEq, "+="],
  [TokenKind.MinusEq, "-="],
  [TokenKind.MulEq, "*="],
  [TokenKind.DivEq, "/="],
  [TokenKind.ModEq, "%="],
  [TokenKind.AndEq, "&="],
  [TokenKind.OrEq, "|="],
  [TokenKind.XorEq, "^="],
  [TokenKind.ShlEq, "<<="],
  [TokenKind.ShrEq, ">>="],
])

const RELATIONAL_OPERATORS = new Map<TokenKind, string>([
  [TokenKind.Less, "<"],
  [TokenKind.Greater, ">"],
  [TokenKind.LessEq, "<="],
  [TokenKind.GreaterEq, ">="],
])

const ADDITIVE_OPERATORS = new Map<TokenKind, string>([
  [TokenKind.Plus, "+"],
  [TokenKind.Minus, "-"],
])

const MULTIPLICATIVE_OPERATORS = new Map<TokenKind, string>([
  [TokenKind.Star, "*"],
  [TokenKind.Slash, "/"],
  [TokenKind.Percent, "%"],
])

const SHIFT_OPERATORS = new Map<TokenKind, string>([
  [TokenKind.Shl, "<<"],
  [TokenKind.Shr, ">>"],
])

const EQUALITY_OPERATORS = new Map<TokenKind, string>([
  [TokenKind.Eq, "=="],
  [TokenKind.NotEq, "!="],
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
  private index = 0;
  private line = 1;
  private column = 0;

  constructor(source: string) {
    this.source = source
  }

  tokenize(): Token[] {
    const tokens: Token[] = []

    for (; ;) {
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
    for (; ;) {
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

class ParserError extends Error {
  readonly token: Token

  constructor(message: string, token: Token) {
    super(`${message} at ${token.start.line}:${token.start.column}`)
    this.name = "ParserError"
    this.token = token
  }
}

interface ParsedDeclarator {
  name?: string
  pointerDepth: number
  arrayDimensions: Array<Expression | null>
  parameters?: ParameterDeclaration[]
}

interface TypeComponents {
  qualifiers: string[]
  storage: string[]
  specifiers: string[]
  inlineBody?: string
}

export class Parser {
  private readonly tokens: Token[]
  private position = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  parseProgram(): Program {
    const body: TopLevelNode[] = []

    while (!this.isAtEnd()) {
      const node = this.parseTopLevelNode()
      body.push(node)
    }

    return { kind: "Program", body }
  }

  private parseTopLevelNode(): TopLevelNode {
    const declaration = this.tryParseExternalDeclaration()
    if (declaration) {
      return declaration
    }
    return this.parseStatement()
  }

  private tryParseExternalDeclaration(): TopLevelNode | null {
    const start = this.position
    if (!this.looksLikeDeclarationStart()) {
      return null
    }

    try {
      const type = this.parseTypeRef(false)
      if (this.match(TokenKind.Semicolon)) {
        if (type.specifiers.includes("struct")) {
          return { kind: "StructDeclaration", type, name: this.extractTagName(type.text) }
        }
        if (type.specifiers.includes("enum")) {
          return { kind: "EnumDeclaration", type, name: this.extractTagName(type.text) }
        }
        return { kind: "VariableDeclaration", type, declarators: [] }
      }

      const declarator = this.parseDeclarator()
      if (!declarator.name) {
        throw this.error("Expected declarator name", this.current())
      }

      if (declarator.parameters && this.check(TokenKind.LBrace)) {
        return {
          kind: "FunctionDefinition",
          returnType: type,
          name: declarator.name,
          pointerDepth: declarator.pointerDepth,
          parameters: declarator.parameters,
          body: this.parseBlockStatement(),
        }
      }

      if (declarator.parameters && this.match(TokenKind.Semicolon)) {
        return {
          kind: "FunctionDeclaration",
          returnType: type,
          name: declarator.name,
          pointerDepth: declarator.pointerDepth,
          parameters: declarator.parameters,
        }
      }

      const declarators: VariableDeclarator[] = [this.finishVariableDeclarator(declarator)]
      while (this.match(TokenKind.Comma)) {
        declarators.push(this.finishVariableDeclarator(this.parseDeclarator()))
      }
      this.expect(TokenKind.Semicolon, "Expected ';' after declaration")
      return { kind: "VariableDeclaration", type, declarators }
    } catch {
      this.position = start
      return null
    }
  }

  private finishVariableDeclarator(parsed: ParsedDeclarator): VariableDeclarator {
    if (!parsed.name) {
      throw this.error("Expected declarator name", this.current())
    }

    const declarator: VariableDeclarator = {
      kind: "VariableDeclarator",
      name: parsed.name,
      pointerDepth: parsed.pointerDepth,
      arrayDimensions: parsed.arrayDimensions,
    }

    if (this.match(TokenKind.Assign)) {
      declarator.initializer = this.parseExpression()
    }

    return declarator
  }

  private parseStatement(): Statement {
    if (this.match(TokenKind.Semicolon)) {
      return { kind: "EmptyStatement" }
    }

    if (this.check(TokenKind.LBrace)) {
      return this.parseBlockStatement()
    }

    if (this.matchKeyword("if")) {
      return this.parseIfStatement()
    }
    if (this.matchKeyword("while")) {
      return this.parseWhileStatement()
    }
    if (this.matchKeyword("do")) {
      return this.parseDoWhileStatement()
    }
    if (this.matchKeyword("for")) {
      return this.parseForStatement()
    }
    if (this.matchKeyword("return")) {
      return this.parseReturnStatement()
    }
    if (this.matchKeyword("break")) {
      this.expect(TokenKind.Semicolon, "Expected ';' after break")
      return { kind: "BreakStatement" }
    }
    if (this.matchKeyword("continue")) {
      this.expect(TokenKind.Semicolon, "Expected ';' after continue")
      return { kind: "ContinueStatement" }
    }
    if (this.matchKeyword("switch")) {
      return this.parseSwitchStatement()
    }
    if (this.matchKeyword("case")) {
      const label = this.parseExpression()
      this.expect(TokenKind.Colon, "Expected ':' after case label")
      return { kind: "LabeledStatement", label: this.renderExpression(label), body: this.parseStatement() }
    }
    if (this.matchKeyword("default")) {
      this.expect(TokenKind.Colon, "Expected ':' after default")
      return { kind: "LabeledStatement", label: "default", body: this.parseStatement() }
    }

    if (this.check(TokenKind.Identifier) && this.peekToken(1)?.kind === TokenKind.Colon) {
      const label = this.advance().lexeme
      this.expect(TokenKind.Colon, "Expected ':' after label")
      return { kind: "LabeledStatement", label, body: this.parseStatement() }
    }

    const declaration = this.tryParseLocalDeclaration()
    if (declaration) {
      return declaration
    }

    const expression = this.parseExpression()
    this.expect(TokenKind.Semicolon, "Expected ';' after expression")
    return { kind: "ExpressionStatement", expression }
  }

  private tryParseLocalDeclaration(): DeclarationStatement | null {
    const start = this.position
    if (!this.looksLikeDeclarationStart()) {
      return null
    }

    try {
      const type = this.parseTypeRef(false)
      const declarators: VariableDeclarator[] = []
      if (!this.check(TokenKind.Semicolon)) {
        declarators.push(this.finishVariableDeclarator(this.parseDeclarator()))
        while (this.match(TokenKind.Comma)) {
          declarators.push(this.finishVariableDeclarator(this.parseDeclarator()))
        }
      }
      this.expect(TokenKind.Semicolon, "Expected ';' after declaration")
      return {
        kind: "DeclarationStatement",
        declaration: { kind: "VariableDeclaration", type, declarators },
      }
    } catch {
      this.position = start
      return null
    }
  }

  private parseBlockStatement(): BlockStatement {
    this.expect(TokenKind.LBrace, "Expected '{'")
    const body: Statement[] = []

    while (!this.check(TokenKind.RBrace) && !this.isAtEnd()) {
      body.push(this.parseStatement())
    }

    this.expect(TokenKind.RBrace, "Expected '}'")
    return { kind: "BlockStatement", body }
  }

  private parseIfStatement(): IfStatement {
    this.expect(TokenKind.LParen, "Expected '(' after if")
    const test = this.parseExpression()
    this.expect(TokenKind.RParen, "Expected ')' after condition")
    const consequent = this.parseStatement()
    const alternate = this.matchKeyword("else") ? this.parseStatement() : undefined
    return { kind: "IfStatement", test, consequent, alternate }
  }

  private parseWhileStatement(): WhileStatement {
    this.expect(TokenKind.LParen, "Expected '(' after while")
    const test = this.parseExpression()
    this.expect(TokenKind.RParen, "Expected ')' after condition")
    const body = this.parseStatement()
    return { kind: "WhileStatement", test, body }
  }

  private parseDoWhileStatement(): DoWhileStatement {
    const body = this.parseStatement()
    this.expectKeyword("while", "Expected 'while' after do body")
    this.expect(TokenKind.LParen, "Expected '(' after while")
    const test = this.parseExpression()
    this.expect(TokenKind.RParen, "Expected ')' after condition")
    this.expect(TokenKind.Semicolon, "Expected ';' after do-while")
    return { kind: "DoWhileStatement", body, test }
  }

  private parseForStatement(): ForStatement {
    this.expect(TokenKind.LParen, "Expected '(' after for")

    let init: Expression | VariableDeclaration | undefined
    if (!this.check(TokenKind.Semicolon)) {
      const localDecl = this.tryParseForDeclaration()
      if (localDecl) {
        init = localDecl
      } else {
        init = this.parseExpression()
        this.expect(TokenKind.Semicolon, "Expected ';' after for initializer")
      }
    } else {
      this.advance()
    }

    const test = this.check(TokenKind.Semicolon) ? undefined : this.parseExpression()
    this.expect(TokenKind.Semicolon, "Expected ';' after for condition")
    const update = this.check(TokenKind.RParen) ? undefined : this.parseExpression()
    this.expect(TokenKind.RParen, "Expected ')' after for clauses")

    return {
      kind: "ForStatement",
      init,
      test,
      update,
      body: this.parseStatement(),
    }
  }

  private tryParseForDeclaration(): VariableDeclaration | null {
    const start = this.position
    if (!this.looksLikeDeclarationStart()) {
      return null
    }

    try {
      const type = this.parseTypeRef(false)
      const declarators = [this.finishVariableDeclarator(this.parseDeclarator())]
      while (this.match(TokenKind.Comma)) {
        declarators.push(this.finishVariableDeclarator(this.parseDeclarator()))
      }
      this.expect(TokenKind.Semicolon, "Expected ';' after for declaration")
      return { kind: "VariableDeclaration", type, declarators }
    } catch {
      this.position = start
      return null
    }
  }

  private parseReturnStatement(): ReturnStatement {
    if (this.match(TokenKind.Semicolon)) {
      return { kind: "ReturnStatement" }
    }

    const argument = this.parseExpression()
    this.expect(TokenKind.Semicolon, "Expected ';' after return")
    return { kind: "ReturnStatement", argument }
  }

  private parseSwitchStatement(): SwitchStatement {
    this.expect(TokenKind.LParen, "Expected '(' after switch")
    const discriminant = this.parseExpression()
    this.expect(TokenKind.RParen, "Expected ')' after switch value")
    return { kind: "SwitchStatement", discriminant, body: this.parseStatement() }
  }

  private parseExpression(): Expression {
    const expressions: Expression[] = [this.parseAssignmentExpression()]
    while (this.match(TokenKind.Comma)) {
      expressions.push(this.parseAssignmentExpression())
    }
    if (expressions.length === 1) {
      return expressions[0]
    }
    return { kind: "CommaExpression", expressions }
  }

  private parseAssignmentExpression(): Expression {
    const left = this.parseConditionalExpression()
    const assignment = ASSIGNMENT_OPERATORS.get(this.current().kind)
    if (!assignment) {
      return left
    }

    this.advance()
    const right = this.parseAssignmentExpression()
    return { kind: "AssignmentExpression", operator: assignment, left, right }
  }

  private parseConditionalExpression(): Expression {
    const test = this.parseLogicalOrExpression()
    if (!this.match(TokenKind.Question)) {
      return test
    }
    const consequent = this.parseExpression()
    this.expect(TokenKind.Colon, "Expected ':' in conditional expression")
    const alternate = this.parseConditionalExpression()
    return { kind: "ConditionalExpression", test, consequent, alternate }
  }

  private parseLogicalOrExpression(): Expression {
    let expression = this.parseLogicalAndExpression()
    while (this.match(TokenKind.OrOr)) {
      expression = {
        kind: "BinaryExpression",
        operator: "||",
        left: expression,
        right: this.parseLogicalAndExpression(),
      }
    }
    return expression
  }

  private parseLogicalAndExpression(): Expression {
    let expression = this.parseBitwiseOrExpression()
    while (this.match(TokenKind.AndAnd)) {
      expression = {
        kind: "BinaryExpression",
        operator: "&&",
        left: expression,
        right: this.parseBitwiseOrExpression(),
      }
    }
    return expression
  }

  private parseBitwiseOrExpression(): Expression {
    let expression = this.parseBitwiseXorExpression()
    while (this.match(TokenKind.Pipe)) {
      expression = {
        kind: "BinaryExpression",
        operator: "|",
        left: expression,
        right: this.parseBitwiseXorExpression(),
      }
    }
    return expression
  }

  private parseBitwiseXorExpression(): Expression {
    let expression = this.parseBitwiseAndExpression()
    while (this.match(TokenKind.Caret)) {
      expression = {
        kind: "BinaryExpression",
        operator: "^",
        left: expression,
        right: this.parseBitwiseAndExpression(),
      }
    }
    return expression
  }

  private parseBitwiseAndExpression(): Expression {
    let expression = this.parseEqualityExpression()
    while (this.match(TokenKind.Ampersand)) {
      expression = {
        kind: "BinaryExpression",
        operator: "&",
        left: expression,
        right: this.parseEqualityExpression(),
      }
    }
    return expression
  }

  private parseEqualityExpression(): Expression {
    let expression = this.parseRelationalExpression()
    while (EQUALITY_OPERATORS.has(this.current().kind)) {
      const operator = EQUALITY_OPERATORS.get(this.advance().kind) as string
      expression = {
        kind: "BinaryExpression",
        operator,
        left: expression,
        right: this.parseRelationalExpression(),
      }
    }
    return expression
  }

  private parseRelationalExpression(): Expression {
    let expression = this.parseShiftExpression()
    while (RELATIONAL_OPERATORS.has(this.current().kind)) {
      const operator = RELATIONAL_OPERATORS.get(this.advance().kind) as string
      expression = {
        kind: "BinaryExpression",
        operator,
        left: expression,
        right: this.parseShiftExpression(),
      }
    }
    return expression
  }

  private parseShiftExpression(): Expression {
    let expression = this.parseAdditiveExpression()
    while (SHIFT_OPERATORS.has(this.current().kind)) {
      const operator = SHIFT_OPERATORS.get(this.advance().kind) as string
      expression = {
        kind: "BinaryExpression",
        operator,
        left: expression,
        right: this.parseAdditiveExpression(),
      }
    }
    return expression
  }

  private parseAdditiveExpression(): Expression {
    let expression = this.parseMultiplicativeExpression()
    while (ADDITIVE_OPERATORS.has(this.current().kind)) {
      const operator = ADDITIVE_OPERATORS.get(this.advance().kind) as string
      expression = {
        kind: "BinaryExpression",
        operator,
        left: expression,
        right: this.parseMultiplicativeExpression(),
      }
    }
    return expression
  }

  private parseMultiplicativeExpression(): Expression {
    let expression = this.parseUnaryExpression()
    while (MULTIPLICATIVE_OPERATORS.has(this.current().kind)) {
      const operator = MULTIPLICATIVE_OPERATORS.get(this.advance().kind) as string
      expression = {
        kind: "BinaryExpression",
        operator,
        left: expression,
        right: this.parseUnaryExpression(),
      }
    }
    return expression
  }

  private parseUnaryExpression(): Expression {
    if (this.match(TokenKind.PlusPlus)) {
      return { kind: "UpdateExpression", operator: "++", argument: this.parseUnaryExpression(), prefix: true }
    }
    if (this.match(TokenKind.MinusMinus)) {
      return { kind: "UpdateExpression", operator: "--", argument: this.parseUnaryExpression(), prefix: true }
    }

    const unaryMap = new Map<TokenKind, string>([
      [TokenKind.Plus, "+"],
      [TokenKind.Minus, "-"],
      [TokenKind.Bang, "!"],
      [TokenKind.Tilde, "~"],
      [TokenKind.Star, "*"],
      [TokenKind.Ampersand, "&"],
    ])

    if (this.current().kind === TokenKind.Keyword && this.current().lexeme === "sizeof") {
      this.advance()
      if (this.check(TokenKind.LParen) && this.looksLikeTypeNameInParens()) {
        this.advance()
        const targetType = this.parseTypeRef(true)
        this.expect(TokenKind.RParen, "Expected ')' after sizeof type")
        return { kind: "UnaryExpression", operator: "sizeof", argument: targetType }
      }
      return { kind: "UnaryExpression", operator: "sizeof", argument: this.parseUnaryExpression() }
    }

    const unaryOperator = unaryMap.get(this.current().kind)
    if (unaryOperator) {
      this.advance()
      return { kind: "UnaryExpression", operator: unaryOperator, argument: this.parseUnaryExpression() }
    }

    if (this.check(TokenKind.LParen) && this.looksLikeTypeNameInParens()) {
      this.advance()
      const targetType = this.parseTypeRef(true)
      this.expect(TokenKind.RParen, "Expected ')' after cast type")
      return { kind: "CastExpression", targetType, argument: this.parseUnaryExpression() }
    }

    return this.parsePostfixExpression()
  }

  private parsePostfixExpression(): Expression {
    let expression = this.parsePrimaryExpression()

    for (; ;) {
      if (this.match(TokenKind.LParen)) {
        const args: Expression[] = []
        if (!this.check(TokenKind.RParen)) {
          do {
            args.push(this.parseAssignmentExpression())
          } while (this.match(TokenKind.Comma))
        }
        this.expect(TokenKind.RParen, "Expected ')' after arguments")
        expression = { kind: "CallExpression", callee: expression, arguments: args }
        continue
      }

      if (this.match(TokenKind.LBracket)) {
        const index = this.parseExpression()
        this.expect(TokenKind.RBracket, "Expected ']' after index")
        expression = { kind: "IndexExpression", object: expression, index }
        continue
      }

      if (this.match(TokenKind.Dot)) {
        const property = this.expectIdentifierLike("Expected member name").lexeme
        expression = { kind: "MemberExpression", object: expression, property, computed: false, operator: "." }
        continue
      }

      if (this.match(TokenKind.Arrow)) {
        const property = this.expectIdentifierLike("Expected member name").lexeme
        expression = { kind: "MemberExpression", object: expression, property, computed: false, operator: "->" }
        continue
      }

      if (this.match(TokenKind.PlusPlus)) {
        expression = { kind: "UpdateExpression", operator: "++", argument: expression, prefix: false }
        continue
      }

      if (this.match(TokenKind.MinusMinus)) {
        expression = { kind: "UpdateExpression", operator: "--", argument: expression, prefix: false }
        continue
      }

      return expression
    }
  }

  private parsePrimaryExpression(): Expression {
    const token = this.current()

    if (token.kind === TokenKind.Identifier || (token.kind === TokenKind.Keyword && !STATEMENT_KEYWORDS.has(token.lexeme))) {
      this.advance()
      if (token.lexeme === "true" || token.lexeme === "false") {
        return {
          kind: "Literal",
          literalKind: TokenKind.IntLiteral,
          value: token.lexeme === "true" ? 1 : 0,
          raw: token.lexeme,
        }
      }
      return { kind: "Identifier", name: token.lexeme }
    }

    if (
      token.kind === TokenKind.IntLiteral ||
      token.kind === TokenKind.FloatLiteral ||
      token.kind === TokenKind.StringLiteral ||
      token.kind === TokenKind.CharLiteral
    ) {
      this.advance()
      return {
        kind: "Literal",
        literalKind: token.kind,
        value: token.value as number | string,
        raw: token.lexeme,
      }
    }

    if (this.match(TokenKind.LParen)) {
      const expression = this.parseExpression()
      this.expect(TokenKind.RParen, "Expected ')'")
      return { kind: "ParenthesizedExpression", expression }
    }

    throw this.error("Expected expression", token)
  }

  private parseTypeRef(allowAbstractPointers: boolean): TypeRef {
    const components = this.parseTypeComponents()
    let pointerDepth = 0

    if (allowAbstractPointers) {
      while (this.match(TokenKind.Star)) {
        pointerDepth += 1
        while (this.current().kind === TokenKind.Keyword && TYPE_QUALIFIERS.has(this.current().lexeme)) {
          this.advance()
        }
      }
    }

    const parts = [...components.storage, ...components.qualifiers, ...components.specifiers]
    if (pointerDepth > 0) {
      parts.push("*".repeat(pointerDepth))
    }

    return {
      kind: "TypeRef",
      qualifiers: components.qualifiers,
      storage: components.storage,
      specifiers: components.specifiers,
      pointerDepth,
      text: parts.join(" ").trim(),
      inlineBody: components.inlineBody,
    }
  }

  private parseTypeComponents(): TypeComponents {
    const qualifiers: string[] = []
    const storage: string[] = []
    const specifiers: string[] = []
    let inlineBody: string | undefined
    let sawBaseType = false

    while (!this.isAtEnd()) {
      const token = this.current()
      if (token.kind !== TokenKind.Keyword && token.kind !== TokenKind.Identifier) {
        break
      }

      if (token.kind === TokenKind.Keyword && STORAGE_SPECIFIERS.has(token.lexeme)) {
        storage.push(this.advance().lexeme)
        continue
      }

      if (token.kind === TokenKind.Keyword && TYPE_QUALIFIERS.has(token.lexeme)) {
        qualifiers.push(this.advance().lexeme)
        continue
      }

      if (token.kind === TokenKind.Keyword && (token.lexeme === "struct" || token.lexeme === "union" || token.lexeme === "enum")) {
        sawBaseType = true
        specifiers.push(this.advance().lexeme)
        if (this.current().kind === TokenKind.Identifier || this.current().kind === TokenKind.Keyword) {
          specifiers.push(this.advance().lexeme)
        }
        if (this.match(TokenKind.LBrace)) {
          inlineBody = this.collectBalancedText(TokenKind.LBrace, TokenKind.RBrace)
        }
        continue
      }

      if (token.kind === TokenKind.Keyword && TYPE_SPECIFIERS.has(token.lexeme)) {
        sawBaseType = true
        specifiers.push(this.advance().lexeme)
        continue
      }

      if (!sawBaseType && token.kind === TokenKind.Identifier) {
        sawBaseType = true
        specifiers.push(this.advance().lexeme)
        continue
      }

      break
    }

    if (!sawBaseType) {
      throw this.error("Expected type name", this.current())
    }

    return { qualifiers, storage, specifiers, inlineBody }
  }

  private collectBalancedText(openKind: TokenKind, closeKind: TokenKind): string {
    let depth = 1
    const pieces: string[] = ["{"]

    while (!this.isAtEnd() && depth > 0) {
      const token = this.advance()
      pieces.push(token.lexeme)
      if (token.kind === openKind) {
        depth += 1
      } else if (token.kind === closeKind) {
        depth -= 1
      }
    }

    return pieces.join(" ").trim()
  }

  private parseDeclarator(): ParsedDeclarator {
    let pointerDepth = 0
    while (this.match(TokenKind.Star)) {
      pointerDepth += 1
      while (this.current().kind === TokenKind.Keyword && TYPE_QUALIFIERS.has(this.current().lexeme)) {
        this.advance()
      }
    }

    let name: string | undefined
    if (this.match(TokenKind.LParen)) {
      const inner = this.parseDeclarator()
      this.expect(TokenKind.RParen, "Expected ')' after declarator")
      name = inner.name
      pointerDepth += inner.pointerDepth
    } else {
      name = this.expectIdentifierLike("Expected identifier").lexeme
    }

    const arrayDimensions: Array<Expression | null> = []
    let parameters: ParameterDeclaration[] | undefined

    for (; ;) {
      if (this.match(TokenKind.LParen)) {
        parameters = this.parseParameterList()
        continue
      }

      if (this.match(TokenKind.LBracket)) {
        const dimension = this.check(TokenKind.RBracket) ? null : this.parseExpression()
        this.expect(TokenKind.RBracket, "Expected ']'")
        arrayDimensions.push(dimension)
        continue
      }

      break
    }

    return { name, pointerDepth, arrayDimensions, parameters }
  }

  private parseParameterList(): ParameterDeclaration[] {
    if (this.match(TokenKind.RParen)) {
      return []
    }

    const parameters: ParameterDeclaration[] = []

    do {
      if (this.match(TokenKind.Ellipsis)) {
        parameters.push({
          kind: "ParameterDeclaration",
          type: {
            kind: "TypeRef",
            qualifiers: [],
            storage: [],
            specifiers: ["..."],
            pointerDepth: 0,
            text: "...",
          },
          pointerDepth: 0,
          arrayDimensions: [],
          isVariadic: true,
        })
        break
      }

      const type = this.parseTypeRef(true)
      let parsed: ParsedDeclarator | null = null
      if (!this.check(TokenKind.Comma) && !this.check(TokenKind.RParen)) {
        parsed = this.parseDeclarator()
      }

      if (
        !parsed &&
        type.specifiers.length === 1 &&
        type.specifiers[0] === "void" &&
        type.pointerDepth === 0 &&
        parameters.length === 0 &&
        this.check(TokenKind.RParen)
      ) {
        this.expect(TokenKind.RParen, "Expected ')' after parameters")
        return []
      }

      parameters.push({
        kind: "ParameterDeclaration",
        type,
        name: parsed?.name,
        pointerDepth: parsed?.pointerDepth ?? 0,
        arrayDimensions: parsed?.arrayDimensions ?? [],
      })
    } while (this.match(TokenKind.Comma))

    this.expect(TokenKind.RParen, "Expected ')' after parameters")
    return parameters
  }

  private looksLikeDeclarationStart(): boolean {
    const token = this.current()
    if (token.kind === TokenKind.Keyword && (TYPE_SPECIFIERS.has(token.lexeme) || TYPE_QUALIFIERS.has(token.lexeme) || STORAGE_SPECIFIERS.has(token.lexeme))) {
      return true
    }

    if (token.kind !== TokenKind.Identifier) {
      return false
    }

    let offset = 1
    while (this.peekToken(offset)?.kind === TokenKind.Star) {
      offset += 1
    }

    const next = this.peekToken(offset)
    const afterNext = this.peekToken(offset + 1)
    if (next?.kind === TokenKind.Identifier) {
      return true
    }
    if (next?.kind === TokenKind.LParen && afterNext?.kind === TokenKind.Star) {
      return true
    }
    return false
  }

  private looksLikeTypeNameInParens(): boolean {
    if (!this.check(TokenKind.LParen)) {
      return false
    }

    let offset = 1
    let sawIdentifier = false
    let sawExplicitTypeMarker = false

    for (; ;) {
      const token = this.peekToken(offset)
      if (!token) {
        return false
      }

      if (token.kind === TokenKind.RParen) {
        return sawExplicitTypeMarker
      }

      if (token.kind === TokenKind.Keyword) {
        if (TYPE_SPECIFIERS.has(token.lexeme) || TYPE_QUALIFIERS.has(token.lexeme) || STORAGE_SPECIFIERS.has(token.lexeme)) {
          sawExplicitTypeMarker = true
          offset += 1
          continue
        }
        return false
      }

      if (token.kind === TokenKind.Identifier) {
        if (sawIdentifier) {
          return false
        }
        sawIdentifier = true
        offset += 1
        continue
      }

      if (token.kind === TokenKind.Star) {
        if (!sawIdentifier && !sawExplicitTypeMarker) {
          return false
        }
        sawExplicitTypeMarker = true
        offset += 1
        continue
      }

      return false
    }
  }

  private renderExpression(expression: Expression): string {
    switch (expression.kind) {
      case "Identifier":
        return expression.name
      case "Literal":
        return expression.raw
      default:
        return expression.kind
    }
  }

  private extractTagName(text: string): string | undefined {
    const parts = text.split(/\s+/)
    return parts.length >= 2 ? parts[1] : undefined
  }

  private match(...kinds: TokenKind[]): boolean {
    if (kinds.includes(this.current().kind)) {
      this.advance()
      return true
    }
    return false
  }

  private matchKeyword(keyword: string): boolean {
    if (this.current().kind === TokenKind.Keyword && this.current().lexeme === keyword) {
      this.advance()
      return true
    }
    return false
  }

  private expect(kind: TokenKind, message: string): Token {
    if (this.current().kind !== kind) {
      throw this.error(message, this.current())
    }
    return this.advance()
  }

  private expectKeyword(keyword: string, message: string): Token {
    if (this.current().kind !== TokenKind.Keyword || this.current().lexeme !== keyword) {
      throw this.error(message, this.current())
    }
    return this.advance()
  }

  private expectIdentifierLike(message: string): Token {
    const token = this.current()
    if (token.kind === TokenKind.Identifier || token.kind === TokenKind.Keyword) {
      return this.advance()
    }
    throw this.error(message, token)
  }

  private check(kind: TokenKind): boolean {
    return this.current().kind === kind
  }

  private current(): Token {
    return this.tokens[this.position] ?? this.tokens[this.tokens.length - 1]
  }

  private peekToken(offset: number): Token | undefined {
    return this.tokens[this.position + offset]
  }

  private advance(): Token {
    const token = this.current()
    if (!this.isAtEnd()) {
      this.position += 1
    }
    return token
  }

  private isAtEnd(): boolean {
    return this.current().kind === TokenKind.EOF
  }

  private error(message: string, token: Token): ParserError {
    return new ParserError(message, token)
  }
}

export function lexCLike(source: string): Token[] {
  return new Lexer(source).tokenize()
}

export function parseCLike(source: string): Program {
  const tokens = lexCLike(source)
  const badToken = tokens.find((token) => token.kind === TokenKind.ParseError)
  if (badToken) {
    throw new Error(`${badToken.message ?? "Lex error"} at ${badToken.start.line}:${badToken.start.column}`)
  }
  return new Parser(tokens).parseProgram()
}
