import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { VisitResourceService } from 'src/app/openmrs-api/visit-resource.service';

/** A visit with no encounters, as listed for removal. */
interface EmptyVisit {
  uuid: string;
  startDatetime: string;
  stopDatetime: string;
  visitType: string;
  location: string;
  /** Started today: listed, but not ticked by default. */
  isToday: boolean;
  /** Not ended yet. */
  isOpen: boolean;
  /**
   * For today's visits: why it looks like a duplicate - another visit of the
   * same type today has encounters ('real'), or an earlier empty visit of the
   * same type today exists ('earlier'); null when it is the only one.
   */
  duplicateOf: 'real' | 'earlier' | null;
  /** The earliest of several empty same-type visits today: the one kept. */
  hasLaterCopies: boolean;
  selected: boolean;
  status: 'waiting' | 'removing' | 'removed' | 'skipped' | 'failed';
  note?: string;
}

/**
 * For each of today's visits without encounters: is it a possible duplicate,
 * and is it the one kept. Visits are compared only with today's visits of the
 * same type.
 *   'real'    - another visit of that type today has encounters
 *   'earlier' - none has encounters, and another one comes first
 *   null      - it is the one kept (the first, or the only one)
 * "First" is by start time, then by uuid, so visits started at exactly the
 * same time still leave exactly one kept.
 */
export function markTodayDuplicates(
  visits: any[],
  now: Date
): {
  [uuid: string]: {
    duplicateOf: 'real' | 'earlier' | null;
    hasLaterCopies: boolean;
  };
} {
  const sameDay = (value: any) => moment(value).isSame(now, 'day');
  const typeOf = (v: any) => (v.visitType ? v.visitType.uuid : null);
  const startOf = (v: any) => {
    const time = new Date(v.startDatetime).getTime();
    return isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
  };
  const comesBefore = (a: any, b: any) =>
    startOf(a) !== startOf(b)
      ? startOf(a) < startOf(b)
      : String(a.uuid) < String(b.uuid);
  const hasEncounters = (v: any) => !!v.encounters && v.encounters.length > 0;

  const today = visits.filter((v) => sameDay(v.startDatetime));
  const result = {};
  today
    .filter((v) => !hasEncounters(v))
    .forEach((visit) => {
      const others = today.filter(
        (o) => o.uuid !== visit.uuid && typeOf(o) === typeOf(visit)
      );
      let duplicateOf: 'real' | 'earlier' | null = null;
      if (others.some(hasEncounters)) {
        duplicateOf = 'real';
      } else if (others.some((o) => comesBefore(o, visit))) {
        duplicateOf = 'earlier';
      }
      result[visit.uuid] = {
        duplicateOf,
        hasLaterCopies: duplicateOf === null && others.length > 0
      };
    });
  return result;
}

/** Only what is needed to find visits without encounters. */
const VISIT_LIST_V =
  'custom:(uuid,startDatetime,stopDatetime,visitType:(uuid,name),' +
  'location:(uuid,display),encounters:(uuid))';

/** The encounters of one visit, checked again just before removing it. */
const VISIT_CHECK_V = 'custom:(uuid,voided,encounters:(uuid))';

const VOID_REASON = 'Visit without encounters - removed from the visits page';

/**
 * Lists the patient's visits that have no encounters and removes (voids) the
 * ones the user picks, one at a time, showing progress. Visits started today
 * are never offered, so a visit about to be used is not removed.
 */
@Component({
  selector: 'app-empty-visits-cleanup',
  templateUrl: './empty-visits-cleanup.component.html',
  styleUrls: ['./empty-visits-cleanup.component.css']
})
export class EmptyVisitsCleanupComponent implements OnDestroy {
  @Input() public patientUuid: string;
  /** Emitted after visits were removed, so the page can reload its visits. */
  @Output() public visitsRemoved = new EventEmitter<number>();

  public open = false;
  public loading = false;
  public loadError = '';
  public visits: EmptyVisit[] = [];
  /** Visits without encounters started today (listed, not ticked). */
  public todayCount = 0;

  public confirming = false;
  public running = false;
  public stopRequested = false;
  public finished = false;

  private subscription = new Subscription();

  /** Today's empty visits that look like duplicates. */
  public get todayDuplicateCount(): number {
    return this.visits.filter((v) => v.isToday && v.duplicateOf).length;
  }

  public get selectedCount(): number {
    return this.visits.filter((v) => v.selected).length;
  }

  public get allSelected(): boolean {
    return this.visits.length > 0 && this.visits.every((v) => v.selected);
  }

  public get doneCount(): number {
    return this.visits.filter(
      (v) =>
        v.status === 'removed' ||
        v.status === 'skipped' ||
        v.status === 'failed'
    ).length;
  }

  public get removedCount(): number {
    return this.visits.filter((v) => v.status === 'removed').length;
  }

  public get failedCount(): number {
    return this.visits.filter((v) => v.status === 'failed').length;
  }

  public get skippedCount(): number {
    return this.visits.filter((v) => v.status === 'skipped').length;
  }

  /** Of the visits being removed in this run. */
  public get runTotal(): number {
    return this.visits.filter((v) => v.status !== 'waiting' || v.selected)
      .length;
  }

  public get progressPercent(): number {
    const total = this.runTotal;
    return total ? Math.round((this.doneCount / total) * 100) : 0;
  }

  constructor(private visitResourceService: VisitResourceService) {}

  public ngOnDestroy(): void {
    this.stopRequested = true;
    this.subscription.unsubscribe();
  }

  public toggleOpen() {
    this.open = !this.open;
    if (this.open && !this.running && this.visits.length === 0) {
      this.findEmptyVisits();
    }
  }

  /** Loads the patient's visits and keeps those with no encounters. */
  public findEmptyVisits() {
    if (!this.patientUuid) {
      return;
    }
    this.loading = true;
    this.loadError = '';
    this.finished = false;
    this.confirming = false;
    this.visits = [];
    this.todayCount = 0;
    const request = this.visitResourceService.getPatientVisits({
      patientUuid: this.patientUuid,
      v: VISIT_LIST_V
    });
    this.subscription.add(
      request.pipe(take(1)).subscribe(
        (visits: any[]) => {
          const today = moment();
          const empty = (visits || []).filter(
            (visit) => !visit.encounters || visit.encounters.length === 0
          );
          this.todayCount = empty.filter((visit) =>
            moment(visit.startDatetime).isSame(today, 'day')
          ).length;
          const marks = markTodayDuplicates(visits || [], today.toDate());
          const duplicateOf = (visit: any) =>
            marks[visit.uuid] ? marks[visit.uuid].duplicateOf : null;
          const hasLaterCopies = (visit: any) =>
            marks[visit.uuid] ? marks[visit.uuid].hasLaterCopies : false;
          this.visits = empty
            .sort(
              (a, b) =>
                new Date(b.startDatetime).getTime() -
                new Date(a.startDatetime).getTime()
            )
            .map((visit) => ({
              uuid: visit.uuid,
              startDatetime: visit.startDatetime,
              stopDatetime: visit.stopDatetime,
              visitType: visit.visitType ? visit.visitType.name : '',
              location: visit.location ? visit.location.display : '',
              // Today's visits are listed but not ticked: one may be in use.
              isToday: moment(visit.startDatetime).isSame(today, 'day'),
              isOpen: !visit.stopDatetime,
              duplicateOf: duplicateOf(visit),
              hasLaterCopies: hasLaterCopies(visit),
              // Earlier days: ticked. Today: ticked only when it is a
              // duplicate; the one kept (a same-type visit with encounters,
              // or else the earliest empty one) stays unticked.
              selected:
                !moment(visit.startDatetime).isSame(today, 'day') ||
                duplicateOf(visit) !== null,
              status: 'waiting' as 'waiting'
            }));
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.loadError =
            'Could not load the visits. ' + (error ? String(error) : '');
        }
      )
    );
  }

  public toggleAll(checked: boolean) {
    if (this.running) {
      return;
    }
    this.visits.forEach((v) => {
      if (v.status === 'waiting') {
        v.selected = checked;
      }
    });
  }

  public askToConfirm() {
    if (this.selectedCount > 0 && !this.running) {
      this.confirming = true;
    }
  }

  public cancelConfirm() {
    this.confirming = false;
  }

  /** Removes the selected visits one by one, checking each first. */
  public async removeSelected() {
    this.confirming = false;
    this.running = true;
    this.stopRequested = false;
    this.finished = false;

    const queue = this.visits.filter(
      (v) => v.selected && v.status === 'waiting'
    );
    for (const visit of queue) {
      if (this.stopRequested) {
        break;
      }
      visit.status = 'removing';
      try {
        // Checked again now: still has no encounters and is not voided.
        const current: any = await this.visitResourceService
          .getVisitByUuid(visit.uuid, { v: VISIT_CHECK_V })
          .pipe(take(1))
          .toPromise();
        if (!current || current.voided) {
          visit.status = 'skipped';
          visit.note = 'Already removed';
          continue;
        }
        if (current.encounters && current.encounters.length > 0) {
          visit.status = 'skipped';
          visit.note = 'Now has encounters - kept';
          continue;
        }
        await this.visitResourceService
          .voidVisit(visit.uuid, encodeURIComponent(VOID_REASON))
          .pipe(take(1))
          .toPromise();
        visit.status = 'removed';
      } catch (error) {
        visit.status = 'failed';
        visit.note = error ? String(error) : 'Could not remove';
      }
    }

    // Anything not reached because of Stop goes back to waiting.
    this.visits.forEach((v) => {
      if (v.status === 'removing') {
        v.status = 'waiting';
      }
    });
    this.running = false;
    this.finished = true;
    if (this.removedCount > 0) {
      this.visitsRemoved.emit(this.removedCount);
    }
  }

  public stop() {
    this.stopRequested = true;
  }

  public formatDate(value: string): string {
    return value ? moment(value).format('DD MMM YYYY, HH:mm') : '';
  }

  public trackByUuid(index: number, visit: EmptyVisit) {
    return visit.uuid;
  }
}
