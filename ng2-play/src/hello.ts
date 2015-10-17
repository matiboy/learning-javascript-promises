import {Component, bootstrap} from 'angular2/angular2';

@Component({
    selector: 'hello-app',
    template: `
        <h1>Hello, {{name}}!</h1>>
    `
})
export class HelloApp {
    name: string = 'World';
    constructor() {

    }
}

bootstrap(HelloApp);
