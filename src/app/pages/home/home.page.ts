import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { AuthRouteGuardService } from 'src/app/services/auth-route-guard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements AfterContentInit {
  authState: any;
  // including AuthGuardService here so that it's available to listen to auth events
  authService: AuthRouteGuardService;

  constructor(public events: Events, public guard: AuthRouteGuardService) {
    this.authState = {loggedIn: false};
    this.authService = guard;
  }

  ngAfterContentInit() {
    this.events.publish('data:AuthState', this.authState);
  }

  login() {
    this.authState.loggedIn = true;
    this.events.publish('data:AuthState', this.authState);
  }

  logout() {
    this.authState.loggedIn = false;
    this.events.publish('data:AuthState', this.authState);
  }
}
