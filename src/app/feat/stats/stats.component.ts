import { Component, OnInit } from '@angular/core';
import { User, UserService, CompletedLesson } from '@app/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  user: User;

  constructor(private userService: UserService) {
    this.userService.onUserChange.subscribe(() => this.reloadData());
  }

  ngOnInit() {
    this.reloadData();
  }

  async reloadData() {
    this.user = await this.userService.getCurrentUser();
    // display nicely?
  }

  async deleteCompletedLessons() {
    await this.reloadData();

    this.user.completedLessons = [];
    this.userService.editUser(this.user);
  }
}
