/*
 * Shared token and AST definitions for the C-like lexer/parser.
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
