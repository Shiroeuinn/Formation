import { defineRule, configure } from 'vee-validate';
import { confirmed, min, min_value, required } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import { isOldEnough } from './validators';

defineRule('confirmed', confirmed);
defineRule('required', required);
defineRule('min', min);
defineRule('min_value', min_value);
defineRule('isOldEnough', isOldEnough);
configure({
  validateOnInput: true,
  generateMessage: localize('en', {
    messages: {
      required: context => `The ${context.field} is required.`,
      min_value: 'The {field} must be 0:{min} or more.',
      min: 'The {field} must be at least 0:{min} characters.',
      confirmed: context => `The ${context.field} does not match.`,
      isOldEnough: `You're not old enough to bet on ponies.`
    }
  })
});
