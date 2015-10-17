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
      var self = this;
      fetch('http://jsonplaceholder.typicode.com/users/1')
        .then(function(response) {
          response.json().then(function(obj) {
            self.name = obj.name;
          });
        })
    }
}

bootstrap(HelloApp);
