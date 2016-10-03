import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router'
import { MDL } from './mdl.upgrade.element'

@Component({
  selector: 'login',
  templateUrl: 'app/login.component.html',
  directives: [ROUTER_DIRECTIVES, MDL]
})
export class LoginComponent {}
