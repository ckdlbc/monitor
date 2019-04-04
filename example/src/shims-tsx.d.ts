import Vue, { VNode } from 'vue'
import { trackEvent } from '@monitor/collector-track/src'
declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
  interface Window {
    pio: any
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $trackEvent: any
  }
}
