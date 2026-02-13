import { Injectable } from '@angular/core';
// Removed central constants dependency; using numeric breakpoints directly
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private isMobileSubject = new BehaviorSubject<boolean>(this.checkIsMobile());
  private isTabletSubject = new BehaviorSubject<boolean>(this.checkIsTablet());
  private isDesktopSubject = new BehaviorSubject<boolean>(this.checkIsDesktop());
  private sidebarVisibleSubject = new BehaviorSubject<boolean>(this.checkIsDesktop());
  private sidebarExpandedSubject = new BehaviorSubject<boolean>(this.checkIsDesktop());

  isMobile$: Observable<boolean> = this.isMobileSubject.asObservable();
  isTablet$: Observable<boolean> = this.isTabletSubject.asObservable();
  isDesktop$: Observable<boolean> = this.isDesktopSubject.asObservable();
  sidebarVisible$: Observable<boolean> = this.sidebarVisibleSubject.asObservable();
  sidebarExpanded$: Observable<boolean> = this.sidebarExpandedSubject.asObservable();

  constructor() {
    window.addEventListener('resize', () => this.onWindowResize());
    // Ensure initial subjects reflect the current window size
    this.onWindowResize();
  }

  private onWindowResize(): void {
    const isMobile = this.checkIsMobile();
    const isTablet = this.checkIsTablet();
    const isDesktop = this.checkIsDesktop();

    this.isMobileSubject.next(isMobile);
    this.isTabletSubject.next(isTablet);
    this.isDesktopSubject.next(isDesktop);

    // Auto-hide sidebar on mobile/tablet, auto-show on desktop
    if (isDesktop) {
      this.sidebarVisibleSubject.next(true);
      // default expanded on desktop
      this.sidebarExpandedSubject.next(true);
    } else if (isMobile || isTablet) {
      this.sidebarVisibleSubject.next(false);
    }
  }

  private checkIsMobile(): boolean {
    return window.innerWidth <= 767; // mobile: <= 767
  }

  private checkIsTablet(): boolean {
    return window.innerWidth >= 768 && window.innerWidth <= 1023; // tablet: 768-1023
  }

  private checkIsDesktop(): boolean {
    return window.innerWidth >= 1024; // desktop: >= 1024
  }

  toggleSidebar(): void {
    this.sidebarVisibleSubject.next(!this.sidebarVisibleSubject.value);
  }

  toggleSidebarExpanded(): void {
    this.sidebarExpandedSubject.next(!this.sidebarExpandedSubject.value);
  }

  setSidebarExpanded(expanded: boolean): void {
    this.sidebarExpandedSubject.next(expanded);
  }

  setSidebarVisible(visible: boolean): void {
    this.sidebarVisibleSubject.next(visible);
  }

  getSidebarVisible(): boolean {
    return this.sidebarVisibleSubject.value;
  }

  getIsMobile(): boolean {
    return this.isMobileSubject.value;
  }

  getIsTablet(): boolean {
    return this.isTabletSubject.value;
  }

  getIsDesktop(): boolean {
    return this.isDesktopSubject.value;
  }

  getSidebarExpanded(): boolean {
    return this.sidebarExpandedSubject.value;
  }
}
