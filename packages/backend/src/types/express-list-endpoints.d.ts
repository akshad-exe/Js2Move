declare module 'express-list-endpoints' {
  function listEndpoints(app: any): Array<{ path: string; methods: string[] }>
  export default listEndpoints;
}
