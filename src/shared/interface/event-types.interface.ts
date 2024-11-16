export interface EventPayloads {
  'admin.create': { name: string; email: string; password: string };
  'forgot.password': { name: string; resetcode: string; email: string };
}
