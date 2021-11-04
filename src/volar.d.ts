import type { UnwrapRef, VNode } from 'vue';
import type { RouteLocationNormalized, RouterView, RouterLink, useLink } from 'vue-router';
import type { Field, Form, useField, useForm } from 'vee-validate';

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    RouterLink: typeof RouterLink & {
      __VLS_slots: {
        default: UnwrapRef<ReturnType<typeof useLink>>;
      };
    };
    RouterView: typeof RouterView & {
      __VLS_slots: {
        default: {
          Component: VNode;
          route: RouteLocationNormalized & { href: string };
        };
      };
    };
    Field: typeof Field & {
      __VLS_slots: {
        default: UnwrapRef<ReturnType<typeof useField>> & { field: any };
      };
    };
    Form: typeof Form & {
      __VLS_slots: {
        default: UnwrapRef<ReturnType<typeof useForm>>;
      };
    };
  }
}
