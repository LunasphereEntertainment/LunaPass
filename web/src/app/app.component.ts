import { Component } from '@angular/core';
import { faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'LunaPass';

  searchIcon = faSearch;
  addIcon = faPlusCircle;
}
