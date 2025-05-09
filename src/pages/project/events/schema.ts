import * as v from 'valibot'

export const schema = v.object({
  event_id: v.number(),
  title: v.string(),
  description: v.string(),
  priority: v.string(),
  due_date: v.date(),
});