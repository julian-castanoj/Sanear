declare module 'rxjs' {
    export * from 'rxjs/internal/Observable';
    export * from 'rxjs/internal/Observer';
    
    // Add more exports as needed for specific modules
  }
  
  declare module 'rxjs/operators' {
    export * from 'rxjs/internal/operators/map';
    // Add more exports as needed for specific operators
  }