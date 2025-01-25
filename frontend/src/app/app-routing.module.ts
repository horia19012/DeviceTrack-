import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin/admin.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {UserComponent} from './user/user.component';
import {UserListComponent} from './user-list/user-list.component';
import {DeviceListComponent} from './device-list/device-list.component';
// import { AuthGuard } from './auth.guard'; // Import your AuthGuard if needed

const routes: Routes = [
  {path: 'admin/user-devices', component: AdminComponent}, // Protecting admin route
  {path: 'devices', component: DeviceListComponent},
  {path: 'admin/devices', component: DeviceListComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user', component: UserComponent},
  {path: 'admin/user-list', component: UserListComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'}, // Redirect to login by default
  {path: '**', redirectTo: '/login'} // Redirect any unknown paths to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
