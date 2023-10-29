import {Route} from "@angular/router";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {NotesComponent} from "./core/notes/notes.component";
import {AuthGuard} from "./guards/auth.guard";
import {MainLayoutComponent} from "./core/main-layout/main-layout.component";


export const APP_ROUTE: Route[] = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},


  {path: 'login', component: LoginComponent},

  {path: 'registration', component: RegisterComponent},
  {
    path: 'note',
    component: MainLayoutComponent,
    loadChildren: () => import('./core/main-layout/main-layout.route').then((m) => m.MainLayoutRoute),
    canActivate: [AuthGuard]
  },
];
