import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { FooterComponent } from './components/footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { TypingIoComponent } from './components/typing-io/typing-io.component';
import { CharacterComponent } from './components/character/character.component';

import { TypingLineComponent } from './components/typing-line/typing-line.component';

import { TypingService } from './services/typing/typing.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [
    HomeComponent,
    FooterComponent,
    TypingIoComponent,
    TypingLineComponent,
    CharacterComponent,
  ],
  providers: [TypingService],
})
export class HomeModule {}
