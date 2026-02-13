import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ResponsiveService } from '../../../core/services/responsive.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class SideNavbarComponent implements OnInit, OnDestroy {
  isExpanded = true;
  isVisible: boolean = false;
  isDesktop: boolean = false;
  isOverlayVisible: boolean = false;
  private destroy$ = new Subject<void>();

  menuItems = [
    { label: 'Dashboard', icon: '📊', path: '/' },
    { label: 'Best Stocks', icon: '⭐', path: '/' },
    { label: 'Add New Stock', icon: '➕', path: '/create-stock' },
    { label: 'Portfolio', icon: '💼', path: '#' },
    { label: 'Watchlist', icon: '👁️', path: '#' },
    { label: 'Analytics', icon: '📈', path: '#' },
    { label: 'Settings', icon: '⚙️', path: '#' }
  ];

  constructor(private responsiveService: ResponsiveService) {}

  @HostBinding('class.expanded') get hostExpanded() {
    return this.isDesktop && this.isExpanded;
  }

  @HostBinding('class.collapsed') get hostCollapsed() {
    return this.isDesktop && !this.isExpanded;
  }

  ngOnInit(): void {
    // Subscribe to desktop state
    this.responsiveService.isDesktop$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDesktop => {
        this.isDesktop = isDesktop;
        if (isDesktop) {
          this.isVisible = true;
          // restore expanded state from service when on desktop
          this.isExpanded = this.responsiveService.getSidebarExpanded();
        }
      });

    // subscribe to expanded state
    this.responsiveService.sidebarExpanded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(expanded => {
        if (this.isDesktop) {
          this.isExpanded = expanded;
        }
      });

    // Subscribe to sidebar visibility
    this.responsiveService.sidebarVisible$
      .pipe(takeUntil(this.destroy$))
      .subscribe(visible => {
        this.isVisible = visible;
        this.isOverlayVisible = !this.isDesktop && this.isVisible;
      });

    // Initial state
    this.isDesktop = this.responsiveService.getIsDesktop();
    this.isVisible = this.responsiveService.getSidebarVisible();
    this.isExpanded = this.responsiveService.getSidebarExpanded();
  }

  toggleSidebar(): void {
    if (this.isDesktop) {
      // On desktop, toggle expanded/collapsed state via service
      this.responsiveService.toggleSidebarExpanded();
    } else {
      // On mobile/tablet, toggle visibility
      this.responsiveService.toggleSidebar();
    }
  }

  closeSidebar(): void {
    this.responsiveService.setSidebarVisible(false);
  }

  closeSidebarOnMobileTablet(): void {
    if (!this.isDesktop) {
      this.responsiveService.setSidebarVisible(false);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
