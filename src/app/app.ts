import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StudentsTableComponent } from './components/students-table/students-table.component';
import { NimbleThemeProviderModule } from '@ni/nimble-angular';
import { NimbleLabelProviderCoreModule } from '@ni/nimble-angular/label-provider/core';
import { NimbleLabelProviderTableModule } from '@ni/nimble-angular/label-provider/table';
import { StudentsFilterComponent } from './components/students-filter/students-filter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    StudentsTableComponent,
    NimbleThemeProviderModule,
    StudentsFilterComponent,
    NimbleLabelProviderCoreModule,
    NimbleLabelProviderTableModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
}
