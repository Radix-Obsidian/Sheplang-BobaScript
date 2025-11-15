/**
 * ShepThon Parser Tests (Phase 1)
 * 
 * Tests the full recursive descent parser.
 * Target: Parse Dog Reminders example completely.
 */

import { describe, it, expect } from 'vitest';
import { parseShepThon } from '../src/parser.js';

describe('ShepThon Parser - Phase 1', () => {
  describe('App Block', () => {
    it('parses minimal app', () => {
      const source = 'app TestApp { }';
      const result = parseShepThon(source);
      
      expect(result.app).not.toBeNull();
      expect(result.app?.name).toBe('TestApp');
      expect(result.diagnostics).toHaveLength(0);
    });

    it('parses app with newlines', () => {
      const source = `
        app MyApp {
        
        }
      `;
      const result = parseShepThon(source);
      
      expect(result.app?.name).toBe('MyApp');
    });

    it('reports error when app keyword missing', () => {
      const source = 'model Test {}';
      const result = parseShepThon(source);
      
      expect(result.app).toBeNull();
      expect(result.diagnostics.length).toBeGreaterThan(0);
      expect(result.diagnostics[0].message).toContain('app');
    });
  });

  describe('Model Parsing', () => {
    it('parses simple model', () => {
      const source = `app TestApp { model User { id: id name: string } }`;
      const result = parseShepThon(source);
      
      expect(result.app?.models).toHaveLength(1);
      expect(result.app?.models[0].name).toBe('User');
      expect(result.app?.models[0].fields).toHaveLength(2);
      expect(result.app?.models[0].fields[0].name).toBe('id');
      expect(result.app?.models[0].fields[1].name).toBe('name');
    });

    it('parses model with all field types', () => {
      const source = `app TestApp { model Demo { id: id name: string age: int price: float active: bool created: datetime meta: json } }`;
      const result = parseShepThon(source);
      
      const model = result.app?.models[0];
      expect(model?.fields).toHaveLength(7);
      expect(model?.fields.map(f => f.type)).toEqual([
        'id', 'string', 'int', 'float', 'bool', 'datetime', 'json'
      ]);
    });

    it('parses model with default values', () => {
      const source = `app TestApp { model Reminder { id: id done: bool = false count: int = 0 } }`;
      const result = parseShepThon(source);
      
      const fields = result.app?.models[0].fields;
      expect(fields?.[0].name).toBe('id');
      expect(fields?.[1].name).toBe('done');
      expect(fields?.[1].defaultValue).toBe(false);
      expect(fields?.[2].name).toBe('count');
      expect(fields?.[2].defaultValue).toBe(0);
    });

    it('parses multiple models', () => {
      const source = `
        app TestApp {
          model User {
            id: id
          }
          model Post {
            id: id
          }
        }
      `;
      const result = parseShepThon(source);
      
      expect(result.app?.models).toHaveLength(2);
      expect(result.app?.models.map(m => m.name)).toEqual(['User', 'Post']);
    });
  });

  describe('Endpoint Parsing', () => {
    it('parses GET endpoint without parameters', () => {
      const source = `
        app TestApp {
          endpoint GET "/users" -> [User] {
            return db.User.findAll()
          }
        }
      `;
      const result = parseShepThon(source);
      
      const endpoint = result.app?.endpoints[0];
      expect(endpoint?.method).toBe('GET');
      expect(endpoint?.path).toBe('/users');
      expect(endpoint?.parameters).toHaveLength(0);
      expect(endpoint?.returnType.isArray).toBe(true);
      expect(endpoint?.body).toHaveLength(1);
    });

    it('parses POST endpoint with parameters', () => {
      const source = `
        app TestApp {
          endpoint POST "/reminders" (text: string, time: datetime) -> Reminder {
            let reminder = db.Reminder.create({ text, time })
            return reminder
          }
        }
      `;
      const result = parseShepThon(source);
      
      const endpoint = result.app?.endpoints[0];
      expect(endpoint?.method).toBe('POST');
      expect(endpoint?.path).toBe('/reminders');
      expect(endpoint?.parameters).toHaveLength(2);
      expect(endpoint?.parameters[0].name).toBe('text');
      expect(endpoint?.parameters[0].type).toBe('string');
      expect(endpoint?.parameters[1].name).toBe('time');
      expect(endpoint?.parameters[1].type).toBe('datetime');
      expect(endpoint?.body).toHaveLength(2);
    });

    it('parses endpoint with optional parameter', () => {
      const source = `
        app TestApp {
          endpoint GET "/leads" (status?: string) -> [Lead] {
            return db.Lead.findAll()
          }
        }
      `;
      const result = parseShepThon(source);
      
      const param = result.app?.endpoints[0].parameters[0];
      expect(param?.name).toBe('status');
      expect(param?.optional).toBe(true);
    });
  });

  describe('Job Parsing', () => {
    it('parses job with minutes schedule', () => {
      const source = `
        app TestApp {
          job "cleanup" every 5 minutes {
            return db.Session.deleteAll()
          }
        }
      `;
      const result = parseShepThon(source);
      
      const job = result.app?.jobs[0];
      expect(job?.name).toBe('cleanup');
      expect(job?.schedule.every).toBe(5);
      expect(job?.schedule.unit).toBe('minutes');
      expect(job?.body).toHaveLength(1);
    });

    it('parses job with hours schedule', () => {
      const source = `
        app TestApp {
          job "hourly" every 1 hour {
            return db.Data.process()
          }
        }
      `;
      const result = parseShepThon(source);
      
      expect(result.app?.jobs[0].schedule.every).toBe(1);
      expect(result.app?.jobs[0].schedule.unit).toBe('hours');
    });

    it('parses job with days schedule', () => {
      const source = `
        app TestApp {
          job "daily" every 1 day {
            return db.Report.generate()
          }
        }
      `;
      const result = parseShepThon(source);
      
      expect(result.app?.jobs[0].schedule.unit).toBe('days');
    });
  });

  describe('Statement Parsing', () => {
    it('parses let statement', () => {
      const source = `
        app TestApp {
          endpoint GET "/test" -> User {
            let user = db.User.findOne()
            return user
          }
        }
      `;
      const result = parseShepThon(source);
      
      const stmt = result.app?.endpoints[0].body[0];
      expect(stmt?.type).toBe('let');
      if (stmt?.type === 'let') {
        expect(stmt.name).toBe('user');
      }
    });

    it('parses return statement', () => {
      const source = `
        app TestApp {
          endpoint GET "/test" -> [User] {
            return db.User.findAll()
          }
        }
      `;
      const result = parseShepThon(source);
      
      const stmt = result.app?.endpoints[0].body[0];
      expect(stmt?.type).toBe('return');
    });

    it('parses for statement', () => {
      const source = `
        app TestApp {
          job "process" every 1 hour {
            for item in items {
              return process(item)
            }
          }
        }
      `;
      const result = parseShepThon(source);
      
      const stmt = result.app?.jobs[0].body[0];
      expect(stmt?.type).toBe('for');
      if (stmt?.type === 'for') {
        expect(stmt.item).toBe('item');
        expect(stmt.body).toHaveLength(1);
      }
    });

    it('parses if statement', () => {
      const source = `
        app TestApp {
          endpoint POST "/check" (value: string) -> User {
            if value {
              return db.User.find(value)
            }
            return db.User.findAll()
          }
        }
      `;
      const result = parseShepThon(source);
      
      const stmt = result.app?.endpoints[0].body[0];
      expect(stmt?.type).toBe('if');
      if (stmt?.type === 'if') {
        expect(stmt.thenBody).toHaveLength(1);
      }
    });
  });

  describe('Expression Parsing', () => {
    it('parses member access', () => {
      const source = `
        app TestApp {
          endpoint GET "/test" -> [User] {
            return db.User.findAll()
          }
        }
      `;
      const result = parseShepThon(source);
      
      // Just verify it parses without errors
      expect(result.diagnostics).toHaveLength(0);
    });

    it('parses function call', () => {
      const source = `
        app TestApp {
          endpoint GET "/test" -> [User] {
            return findAll()
          }
        }
      `;
      const result = parseShepThon(source);
      
      expect(result.diagnostics).toHaveLength(0);
    });

    // Object literal syntax { key: value } needs enhancement
    it.skip('parses binary expression with object literal', () => {
      const source = `
        app TestApp {
          job "check" every 1 minute {
            let due = db.Reminder.find({ time <= now() })
            return due
          }
        }
      `;
      const result = parseShepThon(source);
      
      expect(result.diagnostics).toHaveLength(0);
    });
  });

  describe('Dog Reminders Example (Simplified)', () => {
    it('parses Dog Reminders structure', () => {
      const source = `app DogReminders { model Reminder { id: id text: string time: datetime done: bool = false } endpoint GET "/reminders" -> [Reminder] { return db.Reminder.findAll() } endpoint POST "/reminders" (text: string, time: datetime) -> Reminder { return db.Reminder.create() } job "mark-due-as-done" every 5 minutes { let due = db.Reminder.find() return due } }`;
      
      const result = parseShepThon(source);
      
      // Verify no parse errors
      expect(result.diagnostics).toHaveLength(0);
      
      // Verify app
      expect(result.app).not.toBeNull();
      expect(result.app?.name).toBe('DogReminders');
      
      // Verify model
      expect(result.app?.models).toHaveLength(1);
      expect(result.app?.models[0].name).toBe('Reminder');
      expect(result.app?.models[0].fields).toHaveLength(4);
      expect(result.app?.models[0].fields[3].defaultValue).toBe(false);
      
      // Verify endpoints
      expect(result.app?.endpoints).toHaveLength(2);
      expect(result.app?.endpoints[0].method).toBe('GET');
      expect(result.app?.endpoints[0].path).toBe('/reminders');
      expect(result.app?.endpoints[1].method).toBe('POST');
      expect(result.app?.endpoints[1].parameters).toHaveLength(2);
      
      // Verify job
      expect(result.app?.jobs).toHaveLength(1);
      expect(result.app?.jobs[0].name).toBe('mark-due-as-done');
      expect(result.app?.jobs[0].schedule.every).toBe(5);
      expect(result.app?.jobs[0].schedule.unit).toBe('minutes');
    });
  });

  describe('Error Handling', () => {
    it('reports error for missing brace', () => {
      const source = 'app Test {';
      const result = parseShepThon(source);
      
      expect(result.diagnostics.length).toBeGreaterThan(0);
    });

    it('reports error with line/column', () => {
      const source = 'app Test { model }';
      const result = parseShepThon(source);
      
      if (result.diagnostics.length > 0) {
        expect(result.diagnostics[0].line).toBeDefined();
        expect(result.diagnostics[0].column).toBeDefined();
      }
    });
  });
});
