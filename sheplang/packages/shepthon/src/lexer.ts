/**
 * ShepThon Lexer/Tokenizer (Phase 1)
 * 
 * Converts ShepThon source code into a stream of tokens.
 * 
 * Based on official TypeScript lexer patterns:
 * https://balit.boxxen.org/lexing/basic/
 * 
 * Responsibilities:
 * - Tokenize keywords, identifiers, literals, operators
 * - Track line/column positions for diagnostics
 * - Skip whitespace (preserve newlines where significant)
 * - Handle string literals with quotes
 * - Report invalid characters as INVALID tokens
 */

/**
 * Token types in ShepThon language
 */
export enum TokenType {
  // Keywords
  APP = 'APP',
  MODEL = 'MODEL',
  ENDPOINT = 'ENDPOINT',
  JOB = 'JOB',
  LET = 'LET',
  RETURN = 'RETURN',
  FOR = 'FOR',
  IN = 'IN',
  IF = 'IF',
  ELSE = 'ELSE',
  EVERY = 'EVERY',
  
  // HTTP Methods
  GET = 'GET',
  POST = 'POST',
  
  // Type keywords
  ID = 'ID',
  STRING = 'STRING',
  INT = 'INT',
  FLOAT = 'FLOAT',
  BOOL = 'BOOL',
  DATETIME = 'DATETIME',
  JSON = 'JSON',
  
  // Time units
  MINUTES = 'MINUTES',
  HOURS = 'HOURS',
  DAYS = 'DAYS',
  
  // Operators
  COLON = 'COLON',              // :
  ARROW = 'ARROW',              // ->
  EQUALS = 'EQUALS',            // =
  COMMA = 'COMMA',              // ,
  DOT = 'DOT',                  // .
  LBRACE = 'LBRACE',            // {
  RBRACE = 'RBRACE',            // }
  LPAREN = 'LPAREN',            // (
  RPAREN = 'RPAREN',            // )
  LBRACKET = 'LBRACKET',        // [
  RBRACKET = 'RBRACKET',        // ]
  LT = 'LT',                    // <
  GT = 'GT',                    // >
  LE = 'LE',                    // <=
  GE = 'GE',                    // >=
  EQ = 'EQ',                    // ==
  NE = 'NE',                    // !=
  NOT = 'NOT',                  // not
  AND = 'AND',                  // and (future)
  OR = 'OR',                    // or (future)
  QUESTION = 'QUESTION',        // ? (for optional params)
  
  // Literals
  IDENTIFIER = 'IDENTIFIER',
  STRING_LITERAL = 'STRING_LITERAL',
  NUMBER_LITERAL = 'NUMBER_LITERAL',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  
  // Special
  NEWLINE = 'NEWLINE',
  EOF = 'EOF',
  INVALID = 'INVALID'
}

/**
 * A token from the lexer
 */
export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

/**
 * Keyword to token type mapping
 */
const KEYWORDS: Record<string, TokenType> = {
  'app': TokenType.APP,
  'model': TokenType.MODEL,
  'endpoint': TokenType.ENDPOINT,
  'job': TokenType.JOB,
  'let': TokenType.LET,
  'return': TokenType.RETURN,
  'for': TokenType.FOR,
  'in': TokenType.IN,
  'if': TokenType.IF,
  'else': TokenType.ELSE,
  'every': TokenType.EVERY,
  
  // HTTP methods
  'GET': TokenType.GET,
  'POST': TokenType.POST,
  
  // Types
  'id': TokenType.ID,
  'string': TokenType.STRING,
  'int': TokenType.INT,
  'float': TokenType.FLOAT,
  'bool': TokenType.BOOL,
  'datetime': TokenType.DATETIME,
  'json': TokenType.JSON,
  
  // Time units
  'minutes': TokenType.MINUTES,
  'hours': TokenType.HOURS,
  'days': TokenType.DAYS,
  'minute': TokenType.MINUTES,  // Accept singular
  'hour': TokenType.HOURS,
  'day': TokenType.DAYS,
  
  // Boolean literals
  'true': TokenType.TRUE,
  'false': TokenType.FALSE,
  
  // Operators
  'not': TokenType.NOT,
  'and': TokenType.AND,
  'or': TokenType.OR
};

/**
 * ShepThon Lexer
 */
export class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  
  constructor(input: string) {
    this.input = input;
  }
  
  /**
   * Tokenize the entire input
   */
  tokenize(): Token[] {
    const tokens: Token[] = [];
    
    while (!this.isAtEnd()) {
      const token = this.nextToken();
      tokens.push(token);
      
      // Stop if we hit EOF
      if (token.type === TokenType.EOF) {
        break;
      }
    }
    
    // Always end with EOF if we haven't added it yet
    if (tokens.length === 0 || tokens[tokens.length - 1].type !== TokenType.EOF) {
      tokens.push(this.makeToken(TokenType.EOF, ''));
    }
    
    return tokens;
  }
  
  /**
   * Get the next token
   */
  private nextToken(): Token {
    // Skip whitespace (but not newlines)
    while (!this.isAtEnd() && this.isWhitespace(this.peek()) && this.peek() !== '\n') {
      this.advance();
    }
    
    if (this.isAtEnd()) {
      return this.makeToken(TokenType.EOF, '');
    }
    
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;
    const char = this.peek();
    
    // Newline
    if (char === '\n') {
      this.advance();
      this.line++;
      this.column = 1;
      return { type: TokenType.NEWLINE, value: '\n', line: startLine, column: startColumn };
    }
    
    // String literal
    if (char === '"' || char === "'") {
      return this.readString();
    }
    
    // Number literal
    if (this.isDigit(char)) {
      return this.readNumber();
    }
    
    // Identifier or keyword
    if (this.isAlpha(char)) {
      return this.readIdentifierOrKeyword();
    }
    
    // Two-character operators
    if (char === '-' && this.peekNext() === '>') {
      this.advance();
      this.advance();
      return { type: TokenType.ARROW, value: '->', line: startLine, column: startColumn };
    }
    
    if (char === '<' && this.peekNext() === '=') {
      this.advance();
      this.advance();
      return { type: TokenType.LE, value: '<=', line: startLine, column: startColumn };
    }
    
    if (char === '>' && this.peekNext() === '=') {
      this.advance();
      this.advance();
      return { type: TokenType.GE, value: '>=', line: startLine, column: startColumn };
    }
    
    if (char === '=' && this.peekNext() === '=') {
      this.advance();
      this.advance();
      return { type: TokenType.EQ, value: '==', line: startLine, column: startColumn };
    }
    
    if (char === '!' && this.peekNext() === '=') {
      this.advance();
      this.advance();
      return { type: TokenType.NE, value: '!=', line: startLine, column: startColumn };
    }
    
    // Single-character operators
    const singleChar = this.advance();
    
    switch (singleChar) {
      case ':': return { type: TokenType.COLON, value: ':', line: startLine, column: startColumn };
      case '=': return { type: TokenType.EQUALS, value: '=', line: startLine, column: startColumn };
      case ',': return { type: TokenType.COMMA, value: ',', line: startLine, column: startColumn };
      case '.': return { type: TokenType.DOT, value: '.', line: startLine, column: startColumn };
      case '{': return { type: TokenType.LBRACE, value: '{', line: startLine, column: startColumn };
      case '}': return { type: TokenType.RBRACE, value: '}', line: startLine, column: startColumn };
      case '(': return { type: TokenType.LPAREN, value: '(', line: startLine, column: startColumn };
      case ')': return { type: TokenType.RPAREN, value: ')', line: startLine, column: startColumn };
      case '[': return { type: TokenType.LBRACKET, value: '[', line: startLine, column: startColumn };
      case ']': return { type: TokenType.RBRACKET, value: ']', line: startLine, column: startColumn };
      case '<': return { type: TokenType.LT, value: '<', line: startLine, column: startColumn };
      case '>': return { type: TokenType.GT, value: '>', line: startLine, column: startColumn };
      case '?': return { type: TokenType.QUESTION, value: '?', line: startLine, column: startColumn };
      default:
        return { type: TokenType.INVALID, value: singleChar, line: startLine, column: startColumn };
    }
  }
  
  /**
   * Read a string literal
   */
  private readString(): Token {
    const startLine = this.line;
    const startColumn = this.column;
    const quote = this.advance(); // " or '
    let value = '';
    
    while (!this.isAtEnd() && this.peek() !== quote && this.peek() !== '\n') {
      value += this.advance();
    }
    
    if (this.peek() === quote) {
      this.advance(); // Closing quote
      return { type: TokenType.STRING_LITERAL, value, line: startLine, column: startColumn };
    }
    
    // Unterminated string
    return { type: TokenType.INVALID, value: quote + value, line: startLine, column: startColumn };
  }
  
  /**
   * Read a number literal
   */
  private readNumber(): Token {
    const startLine = this.line;
    const startColumn = this.column;
    let value = '';
    
    while (!this.isAtEnd() && (this.isDigit(this.peek()) || this.peek() === '.')) {
      value += this.advance();
    }
    
    return { type: TokenType.NUMBER_LITERAL, value, line: startLine, column: startColumn };
  }
  
  /**
   * Read an identifier or keyword
   */
  private readIdentifierOrKeyword(): Token {
    const startLine = this.line;
    const startColumn = this.column;
    let value = '';
    
    while (!this.isAtEnd() && (this.isAlphaNumeric(this.peek()) || this.peek() === '_')) {
      value += this.advance();
    }
    
    // Check if it's a keyword
    const tokenType = KEYWORDS[value] || TokenType.IDENTIFIER;
    
    return { type: tokenType, value, line: startLine, column: startColumn };
  }
  
  /**
   * Peek at current character without consuming
   */
  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.input[this.position];
  }
  
  /**
   * Peek at next character without consuming
   */
  private peekNext(): string {
    if (this.position + 1 >= this.input.length) return '\0';
    return this.input[this.position + 1];
  }
  
  /**
   * Advance and return current character
   */
  private advance(): string {
    const char = this.input[this.position];
    this.position++;
    this.column++;
    return char;
  }
  
  /**
   * Check if at end of input
   */
  private isAtEnd(): boolean {
    return this.position >= this.input.length;
  }
  
  /**
   * Helper: is whitespace (not newline)
   */
  private isWhitespace(char: string): boolean {
    return char === ' ' || char === '\t' || char === '\r';
  }
  
  /**
   * Helper: is digit
   */
  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }
  
  /**
   * Helper: is alpha character
   */
  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
  }
  
  /**
   * Helper: is alphanumeric
   */
  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }
  
  /**
   * Make a token at current position
   */
  private makeToken(type: TokenType, value: string): Token {
    return { type, value, line: this.line, column: this.column };
  }
}
