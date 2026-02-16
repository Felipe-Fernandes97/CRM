declare module 'ogl' {
  export class Renderer {
    gl: any;
    setSize(width: number, height: number): void;
    render(options: { scene: any }): void;
  }
  export class Program {
    uniforms: any;
    constructor(gl: any, options: any);
  }
  export class Mesh {
    constructor(gl: any, options: any);
  }
  export class Color {
    constructor(...args: number[]);
  }
  export class Triangle {
    constructor(gl: any);
  }
}
