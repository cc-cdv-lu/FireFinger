import {
  Component,
  OnInit,
  HostBinding,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { confetti, ConfettiConfig } from 'dom-confetti';
import { StyleService } from '../../core';

@Component({
  selector: 'app-simple-win',
  templateUrl: './simple-win.component.html',
  styleUrls: ['./simple-win.component.scss'],
})
export class SimpleWinComponent implements OnInit {
  @HostBinding('class') componentCssClass;
  @ViewChild('confettiLocation', { static: true }) confettiLocation: ElementRef;
  imgURL = 'assets/img/grin.png';
  defaultConfig: ConfettiConfig = {
    angle: 0,
    spread: 130,
    startVelocity: 90,
    elementCount: 15,
    decay: 0.9,
    width: '40px',
    height: '40px',
  };
  extraConfig = {
    maxPoofs: 20,
    poofDelay: 1250,
    angleAdd: 30,
    interPoofDelay: 200,
  };
  poofCount = 0;

  @HostListener('window:keydown', ['$event'])
  keyEvent() {
    this.goBack();
  }
  constructor(private router: Router, public style: StyleService) {}

  ngOnInit() {
    this.launch();
  }

  goBack() {
    this.router.navigateByUrl('home');
  }

  launch() {
    this.poofCount = 0;
    setTimeout(() => {
      let target;
      target = this.confettiLocation.nativeElement;
      this.poofLoop(target);
    }, this.extraConfig.interPoofDelay);
  }

  poofLoop(target) {
    // console.log('Running poof loop...', this.poofCount);
    setTimeout(() => {
      confetti(target, this.defaultConfig); /** POOF **/

      this.defaultConfig.angle += this.extraConfig.angleAdd;
      if (this.defaultConfig.angle > 360) {
        this.defaultConfig.angle -= 360;
      }
      this.poofCount++;
      if (this.poofCount < this.extraConfig.maxPoofs) {
          this.poofLoop(target);
      }
    }, this.extraConfig.poofDelay);
  }
}
