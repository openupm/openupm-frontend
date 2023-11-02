// The back to top button is based on the @vuepress/plugin-back-to-top plugin and modified to support vue-virtual-scroll-grid.
import { debounce } from 'ts-debounce';
import { computed, defineComponent, h, onUnmounted, ref, Transition, watchEffect } from 'vue';

import '@node_modules/@vuepress/plugin-back-to-top/lib/client/styles/vars.css';
import '@node_modules/@vuepress/plugin-back-to-top/lib/client/styles/back-to-top.css';

export const BackToTop = defineComponent({
  name: 'VueVirtualScrollGridBackToTop',
  props: {
    gridWrapper: {
      type: null,
      required: false,
    }
  },
  setup(props) {
    const scrollTop = ref(0);

    const getScrollTop = (): number => props.gridWrapper ? props.gridWrapper.scrollTop : 0;

    const scrollToTop = () => {
      if (props.gridWrapper)
        props.gridWrapper.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const show = computed(() => scrollTop.value > 300);

    const onScroll = debounce(() => {
      scrollTop.value = getScrollTop();
    }, 100);

    const onScrollHandler = () => {
      onScroll();
    };

    watchEffect(() => {
      if (props.gridWrapper) {
        scrollTop.value = getScrollTop();
        props.gridWrapper.addEventListener('scroll', onScrollHandler);
      }
    });

    onUnmounted(() => {
      if (props.gridWrapper)
        props.gridWrapper.removeEventListener('scroll', onScrollHandler);
    });

    const backToTopEl = h('div', { class: 'back-to-top', onClick: scrollToTop });

    return () =>
      h(
        Transition,
        {
          name: 'back-to-top',
        },
        () => (show.value ? backToTopEl : null),
      );
  },
})

export default BackToTop;