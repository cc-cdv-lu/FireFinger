import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { FooterComponent } from './components/footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { TypingIoComponent } from './components/typing-io/typing-io.component';
import { CharacterComponent } from './components/character/character.component';

import { TypingCharacterComponent } from './components/typing-character/typing-character.component';
import { TypingImageComponent } from './components/typing-image/typing-image.component';
import { TypingLineComponent } from './components/typing-line/typing-line.component';
import { TypingWordComponent } from './components/typing-word/typing-word.component';

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
    TypingCharacterComponent,
    TypingImageComponent,
    TypingLineComponent,
    TypingWordComponent,
    CharacterComponent,
  ],
})
export class HomeModule {}
