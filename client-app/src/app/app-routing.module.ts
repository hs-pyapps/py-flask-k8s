import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { TweetsComponent } from './tweets/tweets.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignOutComponent } from './sign-out/sign-out.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/tweets',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'sign-out',
    component: SignOutComponent
  },
  {
    path: 'tweets',
    component: TweetsComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
