import { Component, Input } from '@angular/core';

/**
 * Blurs the page and shows, in the middle of it, how much of a patient list
 * has loaded: a count, and a bar when the figure the list was opened from is
 * known.
 */
@Component({
  selector: 'app-linelist-loading-overlay',
  templateUrl: './linelist-loading-overlay.component.html',
  styleUrls: ['./linelist-loading-overlay.component.css']
})
export class LinelistLoadingOverlayComponent {
  @Input() public title = '';
  @Input() public loaded = 0;
  @Input() public expected: number = null;
  /** Replaces the count message, e.g. for a list built in one request. */
  @Input() public statusText: string = null;
  /** A progress value supplied by the caller (0-100), instead of counting. */
  @Input() public progress: number = null;
  /** Small print under the bar, e.g. that the progress is an estimate. */
  @Input() public note: string = null;

  public get percent(): number {
    if (this.progress !== null && this.progress !== undefined) {
      return Math.max(0, Math.min(100, Math.round(this.progress)));
    }
    if (!this.expected) {
      return null;
    }
    return Math.min(
      100,
      Math.round(((this.loaded || 0) / this.expected) * 100)
    );
  }

  public get message(): string {
    if (this.statusText) {
      return this.statusText;
    }
    return (
      (this.loaded || 0).toLocaleString() +
      (this.expected ? ' of ' + this.expected.toLocaleString() : '') +
      ' patients loaded'
    );
  }
}
