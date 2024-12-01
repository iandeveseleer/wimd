import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-altcha',
  standalone: true,
  templateUrl: './altcha.component.html',
  styleUrls: ['./altcha.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AltchaComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AltchaComponent),
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AltchaComponent implements ControlValueAccessor, Validator {
  @ViewChild('altchaWidget', { static: true }) altchaWidget!: ElementRef;

  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};
  apiUrl: string = environment.apiUrl;

  ngAfterViewInit(): void {
    const el = this.altchaWidget.nativeElement as HTMLElement;
    el.addEventListener('statechange', (ev) => {
      const { detail } = ev as CustomEvent;
      if (detail) {
        const { payload, state } = detail;
        this.onStateChange(state, payload);
      }
    });
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.value) {
      return { required: true };
    }
    return null;
  }

  onStateChange(state: 'unverified' | 'verifying' | 'verified' | 'error', payload: string = '') {
    this.value = state === 'verified' ? payload : '';
    this.onChange(this.value);
    this.onTouched();
  }
}