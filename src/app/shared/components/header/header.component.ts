import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ResponsiveService } from '../../../core/services/responsive.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isMobileOrTablet$: Observable<boolean>;

  constructor(private responsiveService: ResponsiveService) {
    this.isMobileOrTablet$ = new Observable(observer => {
      this.responsiveService.isMobile$.subscribe(isMobile => {
        observer.next(isMobile);
      });
      this.responsiveService.isTablet$.subscribe(isTablet => {
        observer.next(isTablet);
      });
    });
  }

  ngOnInit(): void {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      // Close navbar collapse
    }
  }

  toggleSidebar(): void {
    // On desktop: toggle expanded/collapsed. On mobile/tablet: toggle visibility.
    if (this.responsiveService.getIsDesktop()) {
      this.responsiveService.toggleSidebarExpanded();
    } else {
      this.responsiveService.toggleSidebar();
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
