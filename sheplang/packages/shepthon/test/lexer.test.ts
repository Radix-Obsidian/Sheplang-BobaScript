/**
 * ShepThon Lexer Tests (Phase 1)
 * 
 * Verifies the lexer correctly tokenizes ShepThon source code.
 */

import { describe, it, expect } from 'vitest';
import { Lexer, TokenType } from '../src/lexer.js';

describe('ShepThon Lexer - Phase 1', () => {
  describe('Keywords', () => {
    it('tokenizes app keyword', () => {
      const lexer = new Lexer('app');
      const tokens = lexer.tokenize();
      
      expect(tokens).toHaveLength(2); // app + EOF
      expect(tokens[0].type).toBe(TokenType.APP);
      expect(tokens[0].value).toBe('app');
    });

    it('tokenizes model keyword', () => {
      const lexer = new Lexer('model');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.MODEL);
    });

    it('tokenizes endpoint keyword', () => {
      const lexer = new Lexer('endpoint');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.ENDPOINT);
    });

    it('tokenizes job keyword', () => {
      const lexer = new Lexer('job');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.JOB);
    });

    it('tokenizes control flow keywords', () => {
      const lexer = new Lexer('let return for in if else');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.LET);
      expect(tokens[1].type).toBe(TokenType.RETURN);
      expect(tokens[2].type).toBe(TokenType.FOR);
      expect(tokens[3].type).toBe(TokenType.IN);
      expect(tokens[4].type).toBe(TokenType.IF);
      expect(tokens[5].type).toBe(TokenType.ELSE);
    });

    it('tokenizes HTTP method keywords', () => {
      const lexer = new Lexer('GET POST');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.GET);
      expect(tokens[1].type).toBe(TokenType.POST);
    });
  });

  describe('Type Keywords', () => {
    it('tokenizes all type keywords', () => {
      const lexer = new Lexer('id string int float bool datetime json');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.ID);
      expect(tokens[1].type).toBe(TokenType.STRING);
      expect(tokens[2].type).toBe(TokenType.INT);
      expect(tokens[3].type).toBe(TokenType.FLOAT);
      expect(tokens[4].type).toBe(TokenType.BOOL);
      expect(tokens[5].type).toBe(TokenType.DATETIME);
      expect(tokens[6].type).toBe(TokenType.JSON);
    });
  });

  describe('Identifiers', () => {
    it('tokenizes simple identifiers', () => {
      const lexer = new Lexer('myVar user_name count123');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('myVar');
      expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[1].value).toBe('user_name');
      expect(tokens[2].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[2].value).toBe('count123');
    });

    it('distinguishes identifiers from keywords', () => {
      const lexer = new Lexer('app appName');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.APP); // keyword
      expect(tokens[1].type).toBe(TokenType.IDENTIFIER); // identifier
      expect(tokens[1].value).toBe('appName');
    });
  });

  describe('String Literals', () => {
    it('tokenizes double-quoted strings', () => {
      const lexer = new Lexer('"hello world"');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.STRING_LITERAL);
      expect(tokens[0].value).toBe('hello world');
    });

    it('tokenizes single-quoted strings', () => {
      const lexer = new Lexer("'hello world'");
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.STRING_LITERAL);
      expect(tokens[0].value).toBe('hello world');
    });

    it('tokenizes path strings', () => {
      const lexer = new Lexer('"/reminders"');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.STRING_LITERAL);
      expect(tokens[0].value).toBe('/reminders');
    });

    it('reports unterminated strings as invalid', () => {
      const lexer = new Lexer('"unterminated');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.INVALID);
    });
  });

  describe('Number Literals', () => {
    it('tokenizes integers', () => {
      const lexer = new Lexer('42 123 0');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.NUMBER_LITERAL);
      expect(tokens[0].value).toBe('42');
      expect(tokens[1].type).toBe(TokenType.NUMBER_LITERAL);
      expect(tokens[1].value).toBe('123');
      expect(tokens[2].type).toBe(TokenType.NUMBER_LITERAL);
      expect(tokens[2].value).toBe('0');
    });

    it('tokenizes floats', () => {
      const lexer = new Lexer('3.14 0.5');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.NUMBER_LITERAL);
      expect(tokens[0].value).toBe('3.14');
      expect(tokens[1].type).toBe(TokenType.NUMBER_LITERAL);
      expect(tokens[1].value).toBe('0.5');
    });
  });

  describe('Boolean Literals', () => {
    it('tokenizes true and false', () => {
      const lexer = new Lexer('true false');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.TRUE);
      expect(tokens[0].value).toBe('true');
      expect(tokens[1].type).toBe(TokenType.FALSE);
      expect(tokens[1].value).toBe('false');
    });
  });

  describe('Operators', () => {
    it('tokenizes single-character operators', () => {
      const lexer = new Lexer(': = , . { } ( ) [ ] < >');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.COLON);
      expect(tokens[1].type).toBe(TokenType.EQUALS);
      expect(tokens[2].type).toBe(TokenType.COMMA);
      expect(tokens[3].type).toBe(TokenType.DOT);
      expect(tokens[4].type).toBe(TokenType.LBRACE);
      expect(tokens[5].type).toBe(TokenType.RBRACE);
      expect(tokens[6].type).toBe(TokenType.LPAREN);
      expect(tokens[7].type).toBe(TokenType.RPAREN);
      expect(tokens[8].type).toBe(TokenType.LBRACKET);
      expect(tokens[9].type).toBe(TokenType.RBRACKET);
      expect(tokens[10].type).toBe(TokenType.LT);
      expect(tokens[11].type).toBe(TokenType.GT);
    });

    it('tokenizes arrow operator', () => {
      const lexer = new Lexer('->');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.ARROW);
      expect(tokens[0].value).toBe('->');
    });

    it('tokenizes comparison operators', () => {
      const lexer = new Lexer('<= >= == !=');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.LE);
      expect(tokens[1].type).toBe(TokenType.GE);
      expect(tokens[2].type).toBe(TokenType.EQ);
      expect(tokens[3].type).toBe(TokenType.NE);
    });

    it('tokenizes not operator', () => {
      const lexer = new Lexer('not email');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.NOT);
      expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
    });
  });

  describe('Position Tracking', () => {
    it('tracks line and column for single line', () => {
      const lexer = new Lexer('app DogReminders');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].line).toBe(1);
      expect(tokens[0].column).toBe(1);
      expect(tokens[1].line).toBe(1);
      expect(tokens[1].column).toBe(5); // after "app "
    });

    it('tracks line numbers across newlines', () => {
      const lexer = new Lexer('app\nmodel');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].line).toBe(1); // app
      expect(tokens[1].type).toBe(TokenType.NEWLINE);
      expect(tokens[1].line).toBe(1);
      expect(tokens[2].line).toBe(2); // model
    });
  });

  describe('Complete ShepThon Snippets', () => {
    it('tokenizes minimal model definition', () => {
      const source = `
        model Reminder {
          id: id
          text: string
        }
      `;
      const lexer = new Lexer(source);
      const tokens = lexer.tokenize();
      
      // Find key tokens
      const modelToken = tokens.find(t => t.type === TokenType.MODEL);
      const idToken = tokens.find(t => t.type === TokenType.ID);
      const stringToken = tokens.find(t => t.type === TokenType.STRING);
      
      expect(modelToken).toBeDefined();
      expect(idToken).toBeDefined();
      expect(stringToken).toBeDefined();
    });

    it('tokenizes endpoint definition', () => {
      const source = `endpoint GET "/reminders" -> [Reminder]`;
      const lexer = new Lexer(source);
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.ENDPOINT);
      expect(tokens[1].type).toBe(TokenType.GET);
      expect(tokens[2].type).toBe(TokenType.STRING_LITERAL);
      expect(tokens[2].value).toBe('/reminders');
      expect(tokens[3].type).toBe(TokenType.ARROW);
    });

    it('tokenizes job with schedule', () => {
      const source = `job "cleanup" every 5 minutes`;
      const lexer = new Lexer(source);
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.JOB);
      expect(tokens[1].type).toBe(TokenType.STRING_LITERAL);
      expect(tokens[1].value).toBe('cleanup');
      expect(tokens[2].type).toBe(TokenType.EVERY);
      expect(tokens[3].type).toBe(TokenType.NUMBER_LITERAL);
      expect(tokens[3].value).toBe('5');
      expect(tokens[4].type).toBe(TokenType.MINUTES);
    });

    it('tokenizes member access', () => {
      const source = `db.Reminder.findAll()`;
      const lexer = new Lexer(source);
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.IDENTIFIER); // db
      expect(tokens[1].type).toBe(TokenType.DOT);
      expect(tokens[2].type).toBe(TokenType.IDENTIFIER); // Reminder
      expect(tokens[3].type).toBe(TokenType.DOT);
      expect(tokens[4].type).toBe(TokenType.IDENTIFIER); // findAll
      expect(tokens[5].type).toBe(TokenType.LPAREN);
      expect(tokens[6].type).toBe(TokenType.RPAREN);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty input', () => {
      const lexer = new Lexer('');
      const tokens = lexer.tokenize();
      
      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe(TokenType.EOF);
    });

    it('handles only whitespace', () => {
      const lexer = new Lexer('   \t  ');
      const tokens = lexer.tokenize();
      
      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe(TokenType.EOF);
    });

    it('handles invalid characters', () => {
      const lexer = new Lexer('@#$');
      const tokens = lexer.tokenize();
      
      expect(tokens[0].type).toBe(TokenType.INVALID);
      expect(tokens[1].type).toBe(TokenType.INVALID);
      expect(tokens[2].type).toBe(TokenType.INVALID);
    });

    it('ends with EOF token', () => {
      const lexer = new Lexer('app Test');
      const tokens = lexer.tokenize();
      
      expect(tokens[tokens.length - 1].type).toBe(TokenType.EOF);
    });
  });
});
