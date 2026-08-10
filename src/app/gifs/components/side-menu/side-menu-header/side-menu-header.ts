import { Component } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-side-menu-header',
  imports: [],
  templateUrl: './side-menu-header.html',
})
export class SideMenuHeader {
  envs = environment;
}
