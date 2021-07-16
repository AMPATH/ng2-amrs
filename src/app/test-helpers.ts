import { DebugElement } from "@angular/core";
import { ComponentFixture, tick } from "@angular/core/testing";

/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 },
};

/** Simulate element click. Defaults to mouse left-button click event. */
export function click(
  el: DebugElement | HTMLElement,
  eventObj: any = ButtonClickEvents.left
): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler("click", eventObj);
  }
}

export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
  fixture.detectChanges();
  tick();
}
